/**
 * Chance™ by Hedge — embeddable checkout drop-in (Plaid-style flow).
 *
 * Add a shot at a free order to ANY checkout with two lines:
 *
 *   <script src="https://hedgepayments.com/embed/chance.js" async></script>
 *   <chance-checkout amount="85" currency="USD" mode="flip-to-free"></chance-checkout>
 *
 * Attributes:
 *   amount    (required)  order/item price, major units
 *   currency  (USD)       display only
 *   mode      (flip-to-free | win-it-back)
 *   theme     (light | dark)
 *   api-base  (optional)  hosted Hedge offers API; default = compute in-browser
 *   country / region      demo override for the eligibility gate
 *
 * Events (listen on the element):
 *   chance:applied  detail { mode, premium, total, offer }   shopper added Chance
 *   chance:result   detail { won, mode, amountBack, finalPrice, offer }
 *   chance:declined detail { amount }
 *
 * Flow (modelled on Plaid Link): pick a market (searchable venue-logo list) →
 * confirm → "connecting" handshake while it resolves → result. Self-contained:
 * the odds engine + a seeded market snapshot run client-side. Settlement is
 * SIMULATED for the demo (seeded by each market's true probability) — real
 * routing/execution to Kalshi/Polymarket is a later phase. Hedge routes the
 * stake to a real external market; it is the router, not the house.
 */
(function () {
  'use strict'
  if (window.customElements && customElements.get('chance-checkout')) return
  var THIS_SCRIPT = document.currentScript
  var ASSET_BASE = (function () {
    try { return new URL(THIS_SCRIPT.src).origin } catch (e) { return 'https://hedgepayments.com' }
  })()

  // ===========================================================================
  // 1. Engine (pure) — ported from sneakers-trading chance-engine
  // ===========================================================================
  var round2 = function (n) { return Math.round(n * 100) / 100 }
  function premiumToProb(premium, item) { return premium / (item + premium) }
  function probToPremium(prob, item) { return (prob * item) / (1 - prob) }
  function oddsLabel(p) {
    if (p <= 0 || p >= 1) return '—'
    var x = (1 - p) / p
    return (x >= 10 ? Math.round(x) : x.toFixed(1)) + ':1'
  }

  var ENGINE_DEFAULTS = {
    resolveWithinHours: 72, resolveMinHours: 1, minLiquidity: 250,
    priceTolerance: 0.06, mustMakeWhole: true,
    blockTags: ['politics', 'elections', 'politician'],
  }
  var SPREAD_TIERS = [0.5, 0.4, 0.3, 0.22, 0.15, 0.09].map(function (p) { return { targetProb: p } })

  function toCandidates(snaps, now) {
    var out = []
    for (var i = 0; i < snaps.length; i++) {
      var s = snaps[i]
      if (s.phase === 'closed') continue
      var rAt = s.resolves_at || null
      var rIn = rAt ? (Date.parse(rAt) - now) / 3600000 : null
      for (var j = 0; j < s.outcomes.length; j++) {
        var o = s.outcomes[j], price = o.best_ask
        if (price == null || price <= 0 || price >= 1) continue
        out.push({
          marketId: s.platform_market_id, question: s.question, outcome: o.name,
          price: price, resolvesInHours: rIn, liquidity: s.liquidity == null ? null : s.liquidity,
          tags: s.tags || [], venue: s.venue || null,
        })
      }
    }
    return out
  }
  function passes(c, f) {
    if (f.minLiquidity != null && (c.liquidity || 0) < f.minLiquidity) return false
    if (c.resolvesInHours == null) return false
    if (c.resolvesInHours > f.resolveWithinHours) return false
    if (c.resolvesInHours < f.resolveMinHours) return false
    var tags = c.tags.map(function (t) { return t.toLowerCase() })
    for (var i = 0; i < f.blockTags.length; i++) if (tags.indexOf(f.blockTags[i]) >= 0) return false
    return true
  }
  function findChanceOffers(args) {
    var f = Object.assign({}, ENGINE_DEFAULTS, args.filters || {})
    var now = args.now || Date.now()
    var item = args.itemPrice
    var cands = toCandidates(args.snapshots, now).filter(function (c) { return passes(c, f) })
    var used = {}, offers = []
    args.tiers.forEach(function (tier) {
      var targetProb = tier.targetProb != null ? tier.targetProb : premiumToProb(tier.premium, item)
      var pick = cands
        .filter(function (c) { return !used[c.marketId + '|' + c.outcome] })
        .filter(function (c) { return Math.abs(c.price - targetProb) <= f.priceTolerance })
        .filter(function (c) { return f.mustMakeWhole ? c.price <= targetProb : true })
        .sort(function (a, b) {
          return Math.abs(a.price - targetProb) - Math.abs(b.price - targetProb) ||
            (a.resolvesInHours || Infinity) - (b.resolvesInHours || Infinity) ||
            (b.liquidity || 0) - (a.liquidity || 0)
        })[0]
      if (!pick) {
        offers.push({ available: false, targetProb: targetProb, oddsLabel: oddsLabel(targetProb), itemPrice: item })
        return
      }
      used[pick.marketId + '|' + pick.outcome] = true
      var premium = round2(probToPremium(pick.price, item)) // flip-to-free cost (make-whole)
      offers.push({
        available: true, targetProb: targetProb, price: pick.price,
        winProbPct: Math.round(pick.price * 100), oddsLabel: oddsLabel(pick.price), itemPrice: item,
        marketId: pick.marketId, question: pick.question, outcome: pick.outcome,
        premium: premium, payout: round2(item + premium), houseStake: round2(pick.price * item),
        resolvesInHours: pick.resolvesInHours == null ? null : Math.round(pick.resolvesInHours),
        liquidity: pick.liquidity, venue: pick.venue,
      })
    })
    return offers
  }

  // ===========================================================================
  // 2. Eligibility (geo gate) — location is a LEGALITY gate, not personalization
  // ===========================================================================
  var US_BLOCKED = { WA: 1, ID: 1, NV: 1, MI: 1, AZ: 1, LA: 1, CT: 1, TN: 1 }
  var INTL_BLOCKED = { CU: 1, IR: 1, KP: 1, SY: 1, RU: 1 }
  function resolveEligibility(country, region) {
    var c = (country || 'US').toUpperCase(), r = (region || '').toUpperCase()
    if (c === 'US') {
      if (US_BLOCKED[r]) return { eligible: false, venue: null, reason: 'state-restricted', country: c, region: r }
      return { eligible: true, venue: 'kalshi', reason: 'ok', country: c, region: r }
    }
    if (INTL_BLOCKED[c]) return { eligible: false, venue: null, reason: 'country-restricted', country: c, region: r }
    return { eligible: true, venue: 'polymarket', reason: 'ok', country: c, region: r || null }
  }

  // venue presentation — name, accent, avatar, verification link
  var VENUE = {
    kalshi: {
      name: 'Kalshi', accent: '#0a8f72', verb: 'Settled on',
      url: function (id) { return 'https://kalshi.com/markets/' + id },
      avatar: function (size) {
        return '<span class="avatar avK" style="width:' + size + 'px;height:' + size + 'px;font-size:' + Math.round(size * 0.5) + 'px">K</span>'
      },
    },
    polymarket: {
      name: 'Polymarket', accent: '#2b6ef6', verb: 'Routed to',
      url: function (id) { return 'https://polymarket.com/event/' + id },
      avatar: function (size) {
        return '<img class="avatar" alt="Polymarket" src="' + ASSET_BASE + '/logos/polymarket.png" style="width:' + size + 'px;height:' + size + 'px">'
      },
    },
  }
  function venueOf(v) { return VENUE[v] || VENUE.polymarket }

  // ===========================================================================
  // 3. Seed market snapshot (deterministic) — replaces the live source for the
  //    demo. Prices span the tier spread so every tier finds a real match.
  //    `h` = hours until resolution (resolves_at computed from Date.now()).
  // ===========================================================================
  var SEED = {
    kalshi: [
      ['k-spx', 'Will the S&P 500 close green today?', 0.49, 6, ['finance']],
      ['k-fed', 'Will the Fed signal a rate cut this meeting?', 0.39, 30, ['finance']],
      ['k-nyc', 'Will NYC hit 90°F this week?', 0.30, 48, ['weather']],
      ['k-gas', 'Will US gas average under $3.10 this week?', 0.22, 60, ['economy']],
      ['k-btc', 'Will Bitcoin top $125k this week?', 0.15, 50, ['crypto']],
      ['k-hur', 'Will a Category 3 hurricane form this week?', 0.09, 70, ['weather']],
    ],
    polymarket: [
      ['p-lal', 'Lakers to beat the Celtics tonight?', 0.48, 5, ['sports']],
      ['p-ars', 'Arsenal to win their match this weekend?', 0.40, 40, ['sports']],
      ['p-eth', 'Will Ethereum flip $4,000 this week?', 0.31, 55, ['crypto']],
      ['p-btc', 'Will Bitcoin top $125k in June?', 0.20, 60, ['crypto']],
      ['p-sol', 'Will Solana flip $250 this month?', 0.13, 66, ['crypto']],
      ['p-spx', 'Will SpaceX launch Starship this week?', 0.09, 70, ['space']],
    ],
  }
  function seedSnapshots(venue, now) {
    return (SEED[venue] || []).map(function (m) {
      return {
        platform_market_id: m[0], question: m[1], phase: 'open', venue: venue,
        resolves_at: new Date(now + m[3] * 3600000).toISOString(),
        liquidity: 5000, tags: m[4], outcomes: [{ name: 'Yes', best_ask: m[2] }],
      }
    })
  }

  // getOffers: local compute by default; POST to api-base when provided (future).
  // Demo shows BOTH venues so shoppers see the venue logos; production restricts
  // to the single geo-legal venue (elig.venue).
  function getOffers(cfg) {
    if (cfg.apiBase) {
      return fetch(cfg.apiBase.replace(/\/$/, '') + '/offers', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ amount: cfg.amount, mode: cfg.mode, country: cfg.country, region: cfg.region }),
      }).then(function (r) { return r.json() })
    }
    var now = Date.now()
    var elig = resolveEligibility(cfg.country, cfg.region)
    if (!elig.eligible) return Promise.resolve({ eligible: false, reason: elig.reason, venue: null, offers: [] })
    var offers = []
    ;['kalshi', 'polymarket'].forEach(function (v) {
      findChanceOffers({ itemPrice: cfg.amount, tiers: SPREAD_TIERS, snapshots: seedSnapshots(v, now), now: now })
        .forEach(function (o) { if (o.available) offers.push(o) })
    })
    offers.sort(function (a, b) { return b.winProbPct - a.winProbPct })
    return Promise.resolve({ eligible: true, venue: elig.venue, offers: offers })
  }

  // ===========================================================================
  // 4. Styles (scoped to the shadow root) — refined-minimal, Plaid-inspired
  // ===========================================================================
  var STYLE = `
  :host { all: initial; }
  * { box-sizing: border-box; font-family: var(--ch-font, ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif); }
  .wrap { --ink:#15161c; --ink2:#3a3d49; --muted:#8a90a0; --line:#eceef2; --line2:#e2e5ea; --bg:#fff; --soft:#f6f7f9;
          --chance:#0e9f6e; --chance-dk:#0b8159; --chip:#eef7f2; }
  .wrap.dark { --ink:#f3f4f7; --ink2:#c7cad4; --muted:#7c8190; --line:#23252d; --line2:#2c2f38; --bg:#16171d; --soft:#1d1f27; --chip:#16291f; }
  .script { font-family: 'Snell Roundhand','Brush Script MT',cursive; font-style: italic; font-weight: 600; font-size: 1.12em; }

  /* ---------- trigger ---------- */
  .trigger { display:flex; width:100%; align-items:center; gap:13px; cursor:pointer; text-align:left;
    border:1px solid #cdeede; background:linear-gradient(180deg,#f4fdf8,#ecfbf3); border-radius:16px; padding:14px 16px; color:#0a7d57;
    transition:border-color .18s, transform .12s, box-shadow .18s; position:relative; overflow:hidden; isolation:isolate; }
  .trigger:hover { border-color:var(--chance); transform:translateY(-1px); box-shadow:0 10px 26px rgba(14,159,110,.16); }
  .trigger:active { transform:translateY(0); }
  .trigBadge { display:grid; place-items:center; width:36px; height:36px; border-radius:11px; flex:none;
    background:radial-gradient(120% 120% at 30% 20%, #14b87f, #0b8159); color:#fff; font-size:18px; box-shadow:0 4px 12px rgba(11,129,89,.35); }
  .trigMain { font-weight:800; font-size:14.5px; color:#0a7146; letter-spacing:-.01em; }
  .trigSub { font-size:12px; color:#0b8159; opacity:.9; margin-top:1px; }
  .trigArrow { margin-left:auto; color:var(--chance); font-weight:800; font-size:18px; }
  .shimmer::after { content:''; position:absolute; top:-10%; left:-160%; width:55%; height:120%; pointer-events:none;
    transform:skewX(-20deg); background:linear-gradient(100deg,transparent,rgba(255,255,255,.6) 50%,transparent); animation:sh 3s ease-in-out infinite; }
  @keyframes sh { 0%{left:-160%} 55%,100%{left:160%} }

  /* ---------- overlay + sheet ---------- */
  .overlay { position:fixed; inset:0; z-index:2147483000; display:flex; align-items:flex-end; justify-content:center;
    background:rgba(13,16,22,.5); backdrop-filter:blur(4px); animation:fade .22s ease; }
  @media (min-width:640px){ .overlay{ align-items:center; padding:18px; } }
  @keyframes fade { from{opacity:0} to{opacity:1} }
  .sheet { width:100%; max-width:452px; max-height:92vh; display:flex; flex-direction:column; overflow:hidden;
    background:var(--bg); color:var(--ink); border-radius:24px 24px 0 0; box-shadow:0 -12px 70px rgba(0,0,0,.45);
    animation:rise .3s cubic-bezier(.18,.84,.27,1); }
  @media (min-width:640px){ .sheet{ border-radius:24px; } }
  @keyframes rise { from{transform:translateY(26px); opacity:.5} to{transform:translateY(0); opacity:1} }

  /* header — back · brand · close (Plaid chrome) */
  .hdr { display:grid; grid-template-columns:34px 1fr 34px; align-items:center; padding:14px 16px 6px; }
  .hbtn { width:34px; height:34px; border:none; background:transparent; color:var(--muted); border-radius:10px; cursor:pointer;
    font-size:17px; display:grid; place-items:center; transition:background .15s, color .15s; }
  .hbtn:hover { background:var(--soft); color:var(--ink); }
  .brandMark { justify-self:center; display:inline-flex; align-items:center; gap:7px; font-size:12.5px; font-weight:700; color:var(--ink2); }
  .brandMark .dot { width:19px; height:19px; border-radius:6px; display:grid; place-items:center; font-size:11px; color:#fff;
    background:radial-gradient(120% 120% at 30% 20%, #14b87f, #0b8159); }

  .body { padding:6px 20px 0; overflow-y:auto; }
  .foot { padding:14px 20px 18px; }
  .step { animation:stepIn .28s cubic-bezier(.2,.8,.2,1); }
  @keyframes stepIn { from{opacity:0; transform:translateY(8px)} to{opacity:1; transform:translateY(0)} }

  .title { font-size:20px; font-weight:800; letter-spacing:-.02em; margin:6px 0 5px; line-height:1.15; }
  .sub { color:var(--muted); font-size:13px; line-height:1.45; margin:0 0 14px; }
  .rWin { color:var(--chance); }

  /* ---------- search + filter ---------- */
  .search { position:relative; margin-bottom:12px; }
  .search input { width:100%; padding:12px 14px 12px 38px; border-radius:12px; border:1px solid var(--line2); background:var(--soft);
    color:var(--ink); font-size:14px; outline:none; transition:border-color .15s, box-shadow .15s; }
  .search input:focus { border-color:var(--chance); box-shadow:0 0 0 3px rgba(14,159,110,.14); background:var(--bg); }
  .search input::placeholder { color:var(--muted); }
  .search .mag { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:var(--muted); font-size:14px; }
  .chips { display:flex; gap:7px; margin-bottom:12px; }
  .chip { padding:6px 12px; border-radius:20px; border:1px solid var(--line2); background:var(--bg); color:var(--ink2);
    font-size:12.5px; font-weight:600; cursor:pointer; transition:all .15s; }
  .chip:hover { border-color:var(--muted); }
  .chip.on { border-color:var(--chance); background:var(--chip); color:var(--chance); }

  /* ---------- market rows (Plaid institution list) ---------- */
  .rows { display:flex; flex-direction:column; gap:8px; padding-bottom:8px; }
  .row { display:flex; align-items:center; gap:13px; width:100%; text-align:left; cursor:pointer;
    background:var(--bg); border:1px solid var(--line); border-radius:15px; padding:12px 13px; color:var(--ink);
    transition:border-color .15s, box-shadow .15s, transform .1s, background .15s; }
  .row:hover { border-color:var(--line2); background:var(--soft); transform:translateY(-1px); box-shadow:0 6px 18px rgba(15,22,32,.06); }
  .row:active { transform:translateY(0); }
  .avatar { border-radius:11px; object-fit:cover; flex:none; display:block; box-shadow:0 1px 0 rgba(0,0,0,.04); }
  .avatar.avK { background:#00c792; color:#04231b; font-weight:900; display:grid; place-items:center; letter-spacing:-.04em; }
  .rowMid { flex:1; min-width:0; }
  .rowQ { font-size:14px; font-weight:700; letter-spacing:-.01em; line-height:1.25; }
  .rowSub { font-size:11.5px; color:var(--muted); margin-top:3px; display:flex; align-items:center; gap:6px; }
  .vName { font-weight:700; }
  .pct { display:inline-flex; align-items:center; }
  .rowRight { display:flex; align-items:center; gap:8px; flex:none; }
  .rowVal { text-align:right; }
  .rowVal b { font-size:13.5px; font-weight:800; display:block; letter-spacing:-.01em; }
  .rowVal small { font-size:10px; color:var(--muted); }
  .chev { color:var(--muted); font-size:16px; }
  .empty { text-align:center; color:var(--muted); padding:26px 0; font-size:13px; }

  /* ---------- confirm ---------- */
  .cHero { display:flex; align-items:center; gap:13px; padding:6px 0 4px; }
  .cQ { font-size:16px; font-weight:800; letter-spacing:-.015em; line-height:1.25; }
  .cMeta { font-size:12px; color:var(--muted); margin-top:4px; }
  .cMeta a { color:var(--chance); text-decoration:none; font-weight:600; }
  .mathCard { background:var(--soft); border:1px solid var(--line); border-radius:15px; padding:14px 16px; margin:16px 0 4px; }
  .mLine { display:flex; justify-content:space-between; font-size:13.5px; padding:5px 0; color:var(--ink2); }
  .mLine.muted { color:var(--muted); }
  .mLine.pay { font-weight:800; font-size:15.5px; color:var(--ink); border-top:1px solid var(--line2); padding-top:11px; margin-top:5px; }
  .mWin { display:flex; justify-content:space-between; align-items:center; margin-top:12px; padding:11px 13px; border-radius:11px;
    background:var(--chip); border:1px dashed #bbe9d4; font-size:13px; font-weight:700; color:var(--chance-dk); }
  .wrap.dark .mWin { border-color:#1f4533; }
  .mWin b { font-size:15px; }

  /* ---------- buttons ---------- */
  .cta { width:100%; padding:15px; border:none; border-radius:13px; background:var(--chance); color:#fff; font-size:15px;
    font-weight:800; letter-spacing:-.01em; cursor:pointer; position:relative; overflow:hidden; isolation:isolate; transition:background .15s, transform .1s;
    box-shadow:0 8px 20px rgba(14,159,110,.28); }
  .cta:hover { background:var(--chance-dk); } .cta:active { transform:translateY(1px); }
  .ghost { width:100%; margin-top:9px; padding:12px; border:none; background:transparent; color:var(--muted); font-weight:600; font-size:13px; cursor:pointer; border-radius:10px; }
  .ghost:hover { color:var(--ink); background:var(--soft); }
  .note { text-align:center; color:var(--muted); font-size:11px; margin-top:12px; line-height:1.5; }
  .note b { color:var(--ink2); }

  /* ---------- handshake (the fun graphic) ---------- */
  .hsWrap { text-align:center; padding:24px 0 8px; }
  .hs { display:flex; align-items:center; justify-content:center; gap:0; margin-bottom:22px; }
  .hsNode { position:relative; width:62px; height:62px; border-radius:18px; display:grid; place-items:center; flex:none; z-index:1;
    box-shadow:0 8px 22px rgba(15,22,32,.12); }
  .hsNode .avatar { width:62px; height:62px; border-radius:18px; }
  .hsHedge { background:radial-gradient(120% 120% at 30% 20%, #14b87f, #0b8159); color:#fff; font-size:28px; }
  .hsNode::before { content:''; position:absolute; inset:-5px; border-radius:22px; border:2px solid var(--chance); opacity:0; animation:ring 1.8s ease-out infinite; }
  .hsNode.delay::before { animation-delay:.9s; }
  @keyframes ring { 0%{opacity:.5; transform:scale(.85)} 70%{opacity:0; transform:scale(1.18)} 100%{opacity:0} }
  .hsTrack { width:74px; height:3px; margin:0 -6px; position:relative; background:repeating-linear-gradient(90deg,var(--line2) 0 5px,transparent 5px 11px); }
  .hsTrack i { position:absolute; top:50%; width:7px; height:7px; border-radius:50%; background:var(--chance); transform:translate(-50%,-50%);
    animation:travel 1.5s linear infinite; box-shadow:0 0 8px rgba(14,159,110,.6); }
  .hsTrack i:nth-child(2){ animation-delay:.5s } .hsTrack i:nth-child(3){ animation-delay:1s }
  @keyframes travel { 0%{left:0; opacity:0} 12%{opacity:1} 88%{opacity:1} 100%{left:100%; opacity:0} }

  /* ---------- result ---------- */
  .result { text-align:center; padding:18px 4px 4px; }
  .emoji { font-size:54px; line-height:1; }
  .rTitle { font-size:22px; font-weight:800; letter-spacing:-.02em; margin:12px 0 6px; }
  .break { background:var(--soft); border:1px solid var(--line); border-radius:14px; padding:13px 16px; margin:18px auto 0; max-width:330px; text-align:left; }
  .break div { display:flex; justify-content:space-between; font-size:13.5px; padding:4px 0; color:var(--ink2); }
  .break .fin { font-weight:800; font-size:16px; color:var(--ink); border-top:1px solid var(--line2); padding-top:9px; margin-top:4px; }
  .break .fin.winFin { color:var(--chance); } .neg { color:var(--chance); }
  .demoTag { display:inline-block; margin-top:8px; font-size:9.5px; font-weight:700; letter-spacing:.05em; text-transform:uppercase;
    color:var(--muted); background:var(--soft); border:1px dashed var(--line2); border-radius:20px; padding:3px 10px; }

  .stateBox { text-align:center; padding:36px 16px; color:var(--muted); }
  .stateBox .se { font-size:30px; margin-bottom:8px; }
  .stateBox b { color:var(--ink); display:block; margin-bottom:4px; font-size:14.5px; }
  .spin { width:42px; height:42px; border:3px solid var(--line2); border-top-color:var(--chance); border-radius:50%; margin:0 auto 14px; animation:spin .8s linear infinite; }
  @keyframes spin { to{ transform:rotate(360deg); } }
  @media (prefers-reduced-motion: reduce){ .shimmer::after,.cta::after,.hsTrack i,.hsNode::before{ animation:none; } .sheet,.overlay,.step{ animation:none; } }
  `

  // ===========================================================================
  // 5. The custom element
  // ===========================================================================
  var FMT = function (n) { return Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 }) }
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] }) }

  function attr(el, name, dflt) { var v = el.getAttribute(name); return v == null || v === '' ? dflt : v }

  class ChanceCheckout extends HTMLElement {
    connectedCallback() {
      if (this._mounted) return
      this._mounted = true
      this.attachShadow({ mode: 'open' })
      this.state = { view: 'trigger', data: null, picked: null, query: '', venue: 'all', outcome: null }
      this.renderTrigger()
    }

    cfg() {
      return {
        amount: Math.max(0.5, parseFloat(attr(this, 'amount', '50')) || 50),
        currency: attr(this, 'currency', 'USD'),
        mode: attr(this, 'mode', 'flip-to-free') === 'win-it-back' ? 'win-it-back' : 'flip-to-free',
        theme: attr(this, 'theme', 'light') === 'dark' ? 'dark' : 'light',
        apiBase: attr(this, 'api-base', null),
        country: attr(this, 'country', null),
        region: attr(this, 'region', null),
      }
    }
    get flip() { return this.cfg().mode === 'flip-to-free' }
    emit(name, detail) { this.dispatchEvent(new CustomEvent(name, { detail: detail, bubbles: true, composed: true })) }

    // -- shells --
    shell(inner) { return '<style>' + STYLE + '</style><div class="wrap ' + this.cfg().theme + '">' + inner + '</div>' }
    sheet(headerHtml, bodyHtml, footHtml) {
      return this.shell('<div class="overlay"><div class="sheet">' + headerHtml +
        '<div class="body">' + bodyHtml + '</div>' + (footHtml ? '<div class="foot">' + footHtml + '</div>' : '') +
        '</div></div>')
    }
    header(opts) {
      opts = opts || {}
      var back = opts.back ? '<button class="hbtn" data-act="back">‹</button>' : '<span></span>'
      return '<div class="hdr">' + back +
        '<span class="brandMark"><span class="dot">✦</span> <span class="script">Chance</span> by Hedge</span>' +
        '<button class="hbtn" data-act="close">✕</button></div>'
    }

    renderTrigger() {
      var c = this.cfg()
      var sub = c.mode === 'win-it-back'
        ? 'Buy as usual — free shot to win all $' + FMT(c.amount) + ' back'
        : 'Pay a little more for a shot at $0'
      this.shadowRoot.innerHTML = this.shell(
        '<button class="trigger shimmer"><span class="trigBadge">✦</span>' +
        '<span><span class="trigMain">Add <span class="script">Chance</span> — win it back?</span>' +
        '<span class="trigSub">' + sub + '</span></span><span class="trigArrow">›</span></button>')
      this.shadowRoot.querySelector('.trigger').onclick = this.open.bind(this)
    }

    bindChrome() {
      var self = this
      this.shadowRoot.querySelectorAll('[data-act]').forEach(function (b) {
        b.onclick = function () { var a = b.getAttribute('data-act'); if (a === 'close') self.close(); else if (a === 'back') self.back() }
      })
      var ov = this.shadowRoot.querySelector('.overlay')
      if (ov) ov.onclick = function (e) { if (e.target === ov) self.close() }
    }

    open() {
      var self = this
      this.state.query = ''; this.state.venue = 'all'; this.state.picked = null; this.state.outcome = null
      this.paint(this.header(), '<div class="stateBox"><div class="spin"></div>Finding live markets…</div>')
      getOffers(this.cfg()).then(function (data) { self.state.data = data; self.renderPick() })
        .catch(function () { self.state.data = { eligible: true, offers: [] }; self.renderPick() })
    }
    close() { this.state.view = 'trigger'; this.renderTrigger() }
    back() { if (this.state.view === 'confirm') this.renderPick() }

    paint(headerHtml, bodyHtml, footHtml) {
      this.shadowRoot.innerHTML = this.sheet(headerHtml, bodyHtml, footHtml)
      this.bindChrome()
    }

    // ---- step 1: pick ----
    renderPick() {
      this.state.view = 'pick'
      var self = this, c = this.cfg(), d = this.state.data
      if (!d || !d.eligible) {
        this.paint(this.header(), '<div class="stateBox"><div class="se">📍</div><b>Chance isn’t available in your area yet</b>' +
          (d && d.reason === 'state-restricted' ? 'Not offered in your state right now.' : 'Not offered in your region right now.') + '</div>')
        return
      }
      var all = d.offers || []
      if (!all.length) {
        this.paint(this.header(), '<div class="stateBox"><div class="se">🛰️</div><b>No matching markets right now</b>We look for soon-resolving, liquid markets.</div>')
        return
      }
      var q = this.state.query.toLowerCase()
      var venues = all.reduce(function (s, o) { return s.indexOf(o.venue) < 0 ? s.concat(o.venue) : s }, [])
      var list = all.filter(function (o) {
        return (self.state.venue === 'all' || o.venue === self.state.venue) && (!q || o.question.toLowerCase().indexOf(q) >= 0)
      })

      var title = this.flip ? 'Back a market, flip it <span class="rWin">free</span>' : 'Win your <span class="rWin">$' + FMT(c.amount) + '</span> back'
      var sub = this.flip
        ? 'Pick a real market. Pay a little more — if it hits, the whole order’s on us. Either way it ships.'
        : 'Pick a real market. Free to play — if it hits, we refund the whole order. Either way it ships.'

      var chips = venues.length > 1
        ? '<div class="chips">' + ['all'].concat(venues).map(function (v) {
            var lbl = v === 'all' ? 'All markets' : venueOf(v).name
            return '<button class="chip ' + (self.state.venue === v ? 'on' : '') + '" data-venue="' + v + '">' + lbl + '</button>'
          }).join('') + '</div>'
        : ''

      var rows = list.length ? list.map(function (o) {
        var V = venueOf(o.venue)
        var val = self.flip
          ? '<div class="rowVal"><b>+$' + FMT(o.premium) + '</b><small>to play</small></div>'
          : '<div class="rowVal"><b>$' + FMT(c.amount) + '</b><small>back</small></div>'
        return '<button class="row" data-id="' + o.marketId + '">' +
          V.avatar(40) +
          '<div class="rowMid"><div class="rowQ">' + esc(o.question) + '</div>' +
          '<div class="rowSub"><span class="vName" style="color:' + V.accent + '">' + V.name + '</span> · ' +
          '<span class="pct">' + o.winProbPct + '% chance</span> · ~' + o.resolvesInHours + 'h</div></div>' +
          '<div class="rowRight">' + val + '<span class="chev">›</span></div></button>'
      }).join('') : '<div class="empty">No markets match “' + esc(this.state.query) + '”.</div>'

      this.paint(this.header(),
        '<div class="step"><div class="title">' + title + '</div><p class="sub">' + sub + '</p>' +
        '<div class="search"><span class="mag">⌕</span><input type="text" placeholder="Search markets…" value="' + esc(this.state.query) + '"/></div>' +
        chips + '<div class="rows">' + rows + '</div></div>',
        '<button class="ghost" data-act="decline">Pay $' + FMT(c.amount) + ' as usual</button>')

      var input = this.shadowRoot.querySelector('.search input')
      input.oninput = function () { self.state.query = input.value; self.renderPick(); var i2 = self.shadowRoot.querySelector('.search input'); if (i2) { i2.focus(); i2.setSelectionRange(i2.value.length, i2.value.length) } }
      this.shadowRoot.querySelectorAll('[data-venue]').forEach(function (b) { b.onclick = function () { self.state.venue = b.getAttribute('data-venue'); self.renderPick() } })
      this.shadowRoot.querySelectorAll('.row').forEach(function (b) {
        b.onclick = function () { self.state.picked = all.filter(function (o) { return o.marketId === b.getAttribute('data-id') })[0]; self.renderConfirm() }
      })
      var dec = this.shadowRoot.querySelector('[data-act="decline"]')
      if (dec) dec.onclick = function () { self.emit('chance:declined', { amount: c.amount }); self.close() }
    }

    // ---- step 2: confirm ----
    renderConfirm() {
      this.state.view = 'confirm'
      var self = this, c = this.cfg(), o = this.state.picked, V = venueOf(o.venue)
      var payToday = this.flip ? round2(c.amount + o.premium) : c.amount
      var math = this.flip
        ? '<div class="mLine"><span>Order</span><span>$' + FMT(c.amount) + '</span></div>' +
          '<div class="mLine"><span><span class="script" style="font-size:1em">Chance</span> stake</span><span>+$' + FMT(o.premium) + '</span></div>' +
          '<div class="mLine pay"><span>Pay today</span><span>$' + FMT(payToday) + '</span></div>'
        : '<div class="mLine"><span>Order</span><span>$' + FMT(c.amount) + '</span></div>' +
          '<div class="mLine muted"><span>To play</span><span>Free</span></div>' +
          '<div class="mLine pay"><span>Pay today</span><span>$' + FMT(c.amount) + '</span></div>'
      var winLine = this.flip
        ? '<span>If “Yes” hits</span><b>You pay $0</b>'
        : '<span>If “Yes” hits</span><b>$' + FMT(c.amount) + ' back → $0</b>'
      var ctaLbl = this.flip ? 'Pay $' + FMT(payToday) + ' &amp; place' : 'Place — win back $' + FMT(c.amount)

      this.paint(this.header({ back: true }),
        '<div class="step"><div class="cHero">' + V.avatar(48) +
        '<div><div class="cQ">' + esc(o.question) + '</div>' +
        '<div class="cMeta"><span style="color:' + V.accent + ';font-weight:700">' + V.name + '</span> · Yes ' + Math.round(o.price * 100) + '¢ · resolves ~' + o.resolvesInHours + 'h · ' +
        '<a href="' + V.url(o.marketId) + '" target="_blank" rel="noopener">view ↗</a></div></div></div>' +
        '<div class="mathCard">' + math + '<div class="mWin">' + winLine + '</div></div>' +
        '<p class="note">Hedge routes your stake to <b>' + V.name + '</b> — we’re not the house. ' +
        '<span class="demoTag">Demo settlement</span></p></div>',
        '<button class="cta shimmer" data-act="place">' + ctaLbl + '</button>')

      this.shadowRoot.querySelector('[data-act="place"]').onclick = this.place.bind(this)
    }

    // ---- step 3: resolving (handshake) ----
    place() {
      var self = this, c = this.cfg(), o = this.state.picked, V = venueOf(o.venue)
      var payToday = this.flip ? round2(c.amount + o.premium) : c.amount
      this.emit('chance:applied', { mode: c.mode, premium: this.flip ? o.premium : 0, total: payToday, offer: o })
      this.state.view = 'resolving'

      this.paint(this.header(),
        '<div class="step hsWrap"><div class="hs">' +
        '<span class="hsNode hsHedge">✦</span>' +
        '<span class="hsTrack"><i></i><i></i><i></i></span>' +
        '<span class="hsNode delay">' + V.avatar(62) + '</span></div>' +
        '<div class="rTitle">Connecting to ' + V.name + '…</div>' +
        '<p class="sub" style="text-align:center">Placing your position on “' + esc(o.question) + '”</p></div>')

      setTimeout(function () {
        var won = Math.random() < o.price // seeded by the market's true probability
        self.state.outcome = won
        self.renderResult(won, payToday)
        self.emit('chance:result', { won: won, mode: c.mode, offer: o, amountBack: won ? c.amount : 0, finalPrice: won ? 0 : payToday })
      }, 2100)
    }

    // ---- step 4: result ----
    renderResult(won, payToday) {
      var c = this.cfg(), o = this.state.picked, V = venueOf(o.venue), flip = this.flip
      var body
      if (won) {
        body = '<div class="emoji">🎉</div><div class="rTitle rWin">' + (flip ? 'It hit — your order’s free!' : 'You won it back!') + '</div>' +
          '<p class="sub" style="text-align:center">“' + esc(o.question) + '” resolved <b>Yes</b> on ' + V.name + '. ' +
          (flip ? 'We covered the whole order.' : 'We credited your full $' + FMT(c.amount) + '.') + '</p>' +
          '<div class="break"><div><span>' + (flip ? 'Order + stake' : 'Order') + '</span><span>$' + FMT(flip ? payToday : c.amount) + '</span></div>' +
          '<div><span><span class="script" style="font-size:1em">Chance</span> win-back</span><span class="neg">−$' + FMT(flip ? payToday : c.amount) + '</span></div>' +
          '<div class="fin winFin"><span>You paid</span><span>$0.00</span></div></div>'
      } else {
        body = '<div class="emoji">🪙</div><div class="rTitle">So close!</div>' +
          '<p class="sub" style="text-align:center">“' + esc(o.question) + '” resolved <b>No</b> on ' + V.name + '. Your order still ships' + (flip ? '.' : ' — no harm in the swing.') + '</p>' +
          '<div class="break"><div><span>Order</span><span>$' + FMT(c.amount) + '</span></div>' +
          (flip ? '<div><span><span class="script" style="font-size:1em">Chance</span> stake</span><span>$' + FMT(o.premium) + '</span></div>' : '') +
          '<div class="fin"><span>You paid</span><span>$' + FMT(flip ? payToday : c.amount) + '</span></div></div>'
      }
      this.paint(this.header(),
        '<div class="step result">' + body +
        '<div class="note" style="margin-top:18px">Powered by <b>Hedge</b> · markets via Kalshi &amp; Polymarket<br>' +
        '<span class="demoTag">Demo settlement — real routing coming</span></div></div>',
        '<button class="cta" data-act="close">Done</button>')
    }
  }

  customElements.define('chance-checkout', ChanceCheckout)
})()
