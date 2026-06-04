/**
 * Chance™ — a Hedge Pay product. Embeddable checkout drop-in (Plaid-style flow).
 *
 * Add a shot at a discounted/free order to ANY checkout with two lines:
 *
 *   <script src="https://hedgepayments.com/embed/chance.js" async></script>
 *   <chance-checkout amount="100" currency="USD" mode="flip-to-free"></chance-checkout>
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
 *   chance:applied  detail { mode, risk, win, total, offer }   shopper placed
 *   chance:result   detail { won, mode, amountBack, finalPrice, offer }
 *   chance:declined detail { amount }
 *
 * Flow (intent-first, modelled on Plaid Link):
 *   1. Intro — how it works
 *   2. Configure — two linked sliders: how much to RISK + how much to WIN
 *      (the discount). chance ≈ risk ÷ win; we surface a live market count.
 *   3. Markets — the real props near those odds; pick one, fine-tune the exact
 *      stake, place → "connecting" handshake → result.
 *
 * Self-contained: the odds engine + a seeded market snapshot run client-side.
 * Settlement is SIMULATED for the demo (seeded by each market's true
 * probability). Hedge routes the stake to a real external market — router, not
 * the house. Real execution is a later phase.
 */
(function () {
  'use strict'
  if (window.customElements && customElements.get('chance-checkout')) return
  var THIS_SCRIPT = document.currentScript
  var ASSET_BASE = (function () {
    // host integrations (e.g. the browser extension, loaded as a content script
    // where document.currentScript is null) can pin the asset origin.
    if (window.__CHANCE_ASSET_BASE) return window.__CHANCE_ASSET_BASE
    try { return new URL(THIS_SCRIPT.src).origin } catch (e) { return 'https://hedgepayments.com' }
  })()

  // ===========================================================================
  // 1. Engine bits (pure) — ported from sneakers-trading chance-engine
  // ===========================================================================
  var round2 = function (n) { return Math.round(n * 100) / 100 }
  var clamp = function (n, lo, hi) { return Math.max(lo, Math.min(hi, n)) }
  function oddsLabel(p) {
    if (p <= 0 || p >= 1) return '—'
    var x = (1 - p) / p
    return (x >= 10 ? Math.round(x) : x.toFixed(1)) + ':1'
  }
  var ENGINE_DEFAULTS = {
    resolveWithinHours: 72, resolveMinHours: 1, minLiquidity: 250,
    blockTags: ['politics', 'elections', 'politician'],
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

  // ===========================================================================
  // 2. Eligibility (geo gate) — location is a LEGALITY gate, not personalization
  // ===========================================================================
  var US_BLOCKED = { WA: 1, ID: 1, NV: 1, MI: 1, AZ: 1, LA: 1, CT: 1, TN: 1 }
  var INTL_BLOCKED = { CU: 1, IR: 1, KP: 1, SY: 1, RU: 1 }
  function resolveEligibility(country, region) {
    var c = (country || 'US').toUpperCase(), r = (region || '').toUpperCase()
    if (c === 'US') {
      if (US_BLOCKED[r]) return { eligible: false, venue: null, reason: 'state-restricted' }
      return { eligible: true, venue: 'kalshi', reason: 'ok' }
    }
    if (INTL_BLOCKED[c]) return { eligible: false, venue: null, reason: 'country-restricted' }
    return { eligible: true, venue: 'polymarket', reason: 'ok' }
  }
  var VENUE = {
    kalshi: {
      name: 'Kalshi', accent: '#0a8f72', url: function (id) { return 'https://kalshi.com/markets/' + id },
      avatar: function (s) { return '<span class="avatar avK" style="width:' + s + 'px;height:' + s + 'px;font-size:' + Math.round(s * 0.5) + 'px">K</span>' },
    },
    polymarket: {
      name: 'Polymarket', accent: '#2b6ef6', url: function (id) { return 'https://polymarket.com/event/' + id },
      avatar: function (s) { return '<img class="avatar" alt="Polymarket" src="' + ASSET_BASE + '/logos/polymarket.png" style="width:' + s + 'px;height:' + s + 'px">' },
    },
  }
  function venueOf(v) { return VENUE[v] || VENUE.polymarket }

  // ===========================================================================
  // 3. Seed market snapshot (deterministic). `h` = hours until resolution.
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
  // --- live source: Polymarket public Gamma API (CORS-open → fetch from browser) ---
  var GAMMA = 'https://gamma-api.polymarket.com'
  var POLY_TAGS = ['nba', 'nfl', 'mlb', 'nhl', 'soccer', 'ufc', 'tennis', 'crypto']
  function parseArr(s) { if (!s) return null; try { var v = JSON.parse(s); return Array.isArray(v) ? v.map(String) : null } catch (e) { return null } }

  // human expiration from an ISO timestamp: "ends in 6h" / "ends Sat" / "ends Jun 7"
  function fmtExpiry(iso) {
    if (!iso) return ''
    var ms = Date.parse(iso) - Date.now()
    if (!(ms > 0)) return 'ending soon'
    var h = ms / 3600000
    if (h < 1) return 'ends in <1h'
    if (h < 24) return 'ends in ' + Math.round(h) + 'h'
    var d = new Date(iso)
    if (h < 24 * 7) return 'ends ' + d.toLocaleDateString(undefined, { weekday: 'short' })
    return 'ends ' + d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }

  // Seed fallback (Polymarket only) — used if the live API is slow/unreachable.
  function buildSeedCandidates(now) {
    return SEED.polymarket.map(function (m) {
      return {
        marketId: m[0], question: m[1], outcome: 'Yes', venue: 'polymarket', price: m[2],
        winProbPct: Math.round(m[2] * 100), resolves_at: new Date(now + m[3] * 3600000).toISOString(),
        liquidity: 5000, tags: m[4], seed: true,
      }
    }).sort(function (a, b) { return b.price - a.price })
  }

  // Live Polymarket candidates straight from the public Gamma API.
  function fetchPolymarketCandidates(now) {
    var out = [], seen = {}
    return Promise.all(POLY_TAGS.map(function (tag) {
      return fetch(GAMMA + '/events?closed=false&active=true&limit=40&tag_slug=' + tag, { headers: { accept: 'application/json' } })
        .then(function (r) { return r.ok ? r.json() : [] })
        .then(function (events) {
          (events || []).forEach(function (ev) {
            var evTags = (ev.tags || []).map(function (t) { return (t.slug || '').toLowerCase() })
            if (ENGINE_DEFAULTS.blockTags.some(function (b) { return evTags.indexOf(b) >= 0 })) return
            ;(ev.markets || []).forEach(function (m) {
              if (m.closed || m.archived) return
              var id = m.conditionId || m.id || m.slug; if (!id || seen[id]) return
              var names = parseArr(m.outcomes), prices = parseArr(m.outcomePrices)
              if (!names || !prices || names.length !== prices.length) return
              var liq = m.liquidityNum != null ? m.liquidityNum : (m.liquidity ? Number(m.liquidity) : null)
              var rIso = m.endDate || null
              var rIn = rIso ? (Date.parse(rIso) - now) / 3600000 : null
              if (liq == null || liq < 250) return
              if (rIn == null || rIn < 1 || rIn > 24 * 21) return
              seen[id] = 1
              names.forEach(function (name, i) {
                var price = Number(prices[i])
                if (!(price > 0 && price < 1)) return
                out.push({
                  marketId: (m.slug || id) + '|' + name, question: m.question || ev.title || '', outcome: name,
                  venue: 'polymarket', price: price, winProbPct: Math.round(price * 100),
                  resolves_at: rIso, liquidity: liq, tags: evTags,
                })
              })
            })
          })
        }).catch(function () { /* tag fetch failed — skip */ })
    })).then(function () { return out.sort(function (a, b) { return b.price - a.price }) })
  }

  // market label: append the outcome when it isn't a plain Yes/No
  function displayMarket(m) {
    var o = (m.outcome || '').toLowerCase()
    return (o === 'yes' || o === 'no' || !m.outcome) ? m.question : m.question + ' — ' + m.outcome
  }

  var BAND = 0.075 // how near a market's price must be to the target chance to count as a match
  var SHOW_CAP = 12 // most live markets to surface near the odds (closest first)

  // ===========================================================================
  // 4. Styles (scoped to the shadow root) — refined-minimal, Plaid-inspired
  // ===========================================================================
  var STYLE = `
  :host { all: initial; }
  * { box-sizing: border-box; font-family: var(--ch-font, ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif); }
  .wrap { --ink:#15161c; --ink2:#3a3d49; --muted:#8a90a0; --line:#eceef2; --line2:#e2e5ea; --bg:#fff; --soft:#f6f7f9;
          --chance:#0e9f6e; --chance-dk:#0b8159; --chip:#eef7f2; --blue:#2b6ef6; }
  .wrap.dark { --ink:#f3f4f7; --ink2:#c7cad4; --muted:#7c8190; --line:#23252d; --line2:#2c2f38; --bg:#16171d; --soft:#1d1f27; --chip:#16291f; }
  .script { font-family: 'Snell Roundhand','Brush Script MT',cursive; font-style: italic; font-weight: 600; font-size: 1.12em; }

  /* ---------- trigger ---------- */
  .trigger { display:flex; width:100%; align-items:center; gap:13px; cursor:pointer; text-align:left;
    border:1px solid #cdeede; background:linear-gradient(180deg,#f4fdf8,#ecfbf3); border-radius:16px; padding:14px 16px; color:#0a7d57;
    transition:border-color .18s, transform .12s, box-shadow .18s; position:relative; overflow:hidden; isolation:isolate; }
  .trigger:hover { border-color:var(--chance); transform:translateY(-1px); box-shadow:0 10px 26px rgba(14,159,110,.16); }
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
    animation:rise .3s cubic-bezier(.18,.84,.27,1); transition:height .34s cubic-bezier(.4,0,.2,1); }
  @media (min-width:640px){ .sheet{ border-radius:24px; } }
  @keyframes rise { from{transform:translateY(26px); opacity:.5} to{transform:translateY(0); opacity:1} }

  .hdr { display:grid; grid-template-columns:34px 1fr 34px; align-items:center; padding:14px 16px 6px; }
  .hbtn { width:34px; height:34px; border:none; background:transparent; color:var(--muted); border-radius:10px; cursor:pointer;
    font-size:17px; display:grid; place-items:center; transition:background .15s, color .15s; }
  .hbtn:hover { background:var(--soft); color:var(--ink); }
  .brandWrap { justify-self:center; display:flex; flex-direction:column; align-items:center; gap:3px; }
  .brandMark { display:inline-flex; align-items:center; gap:7px; font-size:12.5px; font-weight:700; color:var(--ink2); }
  .demoStrip { font-size:9px; font-weight:800; letter-spacing:.07em; text-transform:uppercase; color:#b9860b; background:rgba(255,210,63,.14); border:1px solid rgba(255,210,63,.4); border-radius:20px; padding:1px 9px; }
  .wrap.dark .demoStrip { color:#ffd23f; }
  .brandMark .dot { width:19px; height:19px; border-radius:6px; display:grid; place-items:center; font-size:11px; color:#fff;
    background:radial-gradient(120% 120% at 30% 20%, #14b87f, #0b8159); }

  .body { padding:6px 20px 0; overflow-y:auto; transition:opacity .18s ease, transform .18s ease; }
  .foot { padding:14px 20px 18px; border-top:1px solid transparent; transition:opacity .18s ease; }
  .step { }

  .title { font-size:20px; font-weight:800; letter-spacing:-.02em; margin:6px 0 5px; line-height:1.15; }
  .sub { color:var(--muted); font-size:13px; line-height:1.45; margin:0 0 14px; }
  .rWin { color:var(--chance); }

  /* ---------- intro (how it works) ---------- */
  .hero { display:grid; place-items:center; gap:0; padding:8px 0 6px; }
  .heroBadge { width:60px; height:60px; border-radius:18px; display:grid; place-items:center; font-size:28px; color:#fff;
    background:radial-gradient(120% 120% at 30% 20%, #14b87f, #0b8159); box-shadow:0 10px 26px rgba(11,129,89,.35); }
  .steps { margin:14px 0 4px; display:flex; flex-direction:column; gap:12px; }
  .stepRow { display:flex; gap:13px; align-items:flex-start; }
  .stepNo { width:26px; height:26px; border-radius:9px; background:var(--chip); color:var(--chance); font-weight:800; font-size:13px; display:grid; place-items:center; flex:none; }
  .stepTx b { font-size:13.5px; font-weight:700; display:block; }
  .stepTx span { font-size:12.5px; color:var(--muted); }
  .example { margin:16px 0 2px; padding:12px 14px; border-radius:13px; background:var(--soft); border:1px dashed var(--line2);
    font-size:12.5px; color:var(--ink2); text-align:center; line-height:1.5; }
  .example b { color:var(--ink); }

  /* ---------- sliders (configure) ---------- */
  .sl { margin:18px 0; }
  .slTop { display:flex; align-items:baseline; justify-content:space-between; margin-bottom:9px; }
  .slLbl { font-size:13px; font-weight:700; color:var(--ink2); }
  .slVal { font-size:19px; font-weight:800; letter-spacing:-.01em; }
  .slVal small { font-size:12px; font-weight:600; color:var(--muted); margin-left:4px; }
  .rng { -webkit-appearance:none; appearance:none; width:100%; height:7px; border-radius:7px; background:var(--line2); outline:none; cursor:pointer; }
  .rng::-webkit-slider-thumb { -webkit-appearance:none; width:24px; height:24px; border-radius:50%; background:var(--chance); border:3px solid var(--bg); box-shadow:0 2px 9px rgba(14,159,110,.55); cursor:pointer; transition:transform .1s; }
  .rng::-webkit-slider-thumb:active { transform:scale(1.12); }
  .rng::-moz-range-thumb { width:21px; height:21px; border-radius:50%; background:var(--chance); border:3px solid var(--bg); box-shadow:0 2px 9px rgba(14,159,110,.55); cursor:pointer; }
  .rng.win::-webkit-slider-thumb { background:var(--blue); box-shadow:0 2px 9px rgba(43,110,246,.5); }
  .rng.win::-moz-range-thumb { background:var(--blue); }

  .readout { margin-top:20px; background:var(--soft); border:1px solid var(--line); border-radius:16px; padding:15px 16px; }
  .roMain { display:flex; align-items:center; justify-content:space-between; }
  .roChance { font-size:30px; font-weight:800; letter-spacing:-.02em; line-height:1; }
  .roChance small { font-size:13px; color:var(--muted); font-weight:600; margin-left:5px; }
  .roOdds { font-size:12px; font-weight:700; color:var(--chance); background:var(--chip); padding:5px 11px; border-radius:20px; }
  .roLine { display:flex; justify-content:space-between; font-size:13px; color:var(--ink2); margin-top:11px; padding-top:11px; border-top:1px solid var(--line2); }
  .roLine b { font-weight:800; color:var(--ink); }
  .roHint { font-size:12px; color:var(--muted); text-align:center; margin-top:11px; }
  .roHint b { color:var(--chance); }

  /* ---------- market rows ---------- */
  .toolbar { display:flex; align-items:center; justify-content:space-between; gap:10px; margin:4px 0 12px; }
  .chips { display:flex; gap:7px; }
  .chip { padding:6px 11px; border-radius:20px; border:1px solid var(--line2); background:var(--bg); color:var(--ink2);
    font-size:12px; font-weight:600; cursor:pointer; transition:all .15s; }
  .chip.on { border-color:var(--chance); background:var(--chip); color:var(--chance); }
  .stepper { display:flex; align-items:center; gap:8px; background:var(--soft); border:1px solid var(--line2); border-radius:11px; padding:5px 7px; }
  .stepper button { width:24px; height:24px; border:none; border-radius:7px; background:var(--bg); color:var(--ink); font-size:15px; font-weight:800; cursor:pointer; box-shadow:0 1px 2px rgba(0,0,0,.06); }
  .stepper button:active { transform:translateY(1px); }
  .stepper .sv { font-size:13px; font-weight:800; min-width:46px; text-align:center; }
  .stepper .sv small { display:block; font-size:9.5px; color:var(--muted); font-weight:600; }

  .rows { display:flex; flex-direction:column; gap:8px; padding-bottom:8px; }
  .row { display:flex; align-items:center; gap:13px; width:100%; text-align:left; cursor:pointer;
    background:var(--bg); border:1px solid var(--line); border-radius:15px; padding:12px 13px; color:var(--ink);
    transition:border-color .15s, box-shadow .15s, transform .1s, background .15s; }
  .row:hover { border-color:var(--line2); background:var(--soft); transform:translateY(-1px); box-shadow:0 6px 18px rgba(15,22,32,.06); }
  .row.on { border-color:var(--chance); background:var(--chip); box-shadow:0 0 0 2px var(--chance); }
  .avatar { border-radius:11px; object-fit:cover; flex:none; display:block; }
  .avatar.avK { background:#00c792; color:#04231b; font-weight:900; display:grid; place-items:center; letter-spacing:-.04em; }
  .rowMid { flex:1; min-width:0; }
  .rowQ { font-size:14px; font-weight:700; letter-spacing:-.01em; line-height:1.25; }
  .rowSub { font-size:11.5px; color:var(--muted); margin-top:3px; }
  .vName { font-weight:700; }
  .rowRight { display:flex; align-items:center; gap:8px; flex:none; }
  .rowVal { text-align:right; }
  .rowVal b { font-size:13.5px; font-weight:800; display:block; letter-spacing:-.01em; color:var(--chance); }
  .rowVal small { font-size:10px; color:var(--muted); }
  .chev { color:var(--muted); font-size:16px; }
  .empty { text-align:center; color:var(--muted); padding:24px 8px; font-size:13px; }
  .empty b { color:var(--ink); display:block; margin-bottom:3px; }

  /* ---------- place bar (sticky foot on markets step) ---------- */
  .placeBar { background:var(--soft); border:1px solid var(--line); border-radius:14px; padding:11px 14px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center; }
  .placeBar .pbL { font-size:12px; color:var(--muted); } .placeBar .pbL b { color:var(--ink); font-size:14px; display:block; }
  .placeBar .pbR { text-align:right; font-size:12px; color:var(--muted); } .placeBar .pbR b { color:var(--chance); font-size:15px; display:block; }

  /* ---------- buttons ---------- */
  .cta { width:100%; padding:15px; border:none; border-radius:13px; background:var(--chance); color:#fff; font-size:15px;
    font-weight:800; letter-spacing:-.01em; cursor:pointer; position:relative; overflow:hidden; isolation:isolate; transition:background .15s, transform .1s, opacity .15s;
    box-shadow:0 8px 20px rgba(14,159,110,.28); }
  .cta:hover { background:var(--chance-dk); } .cta:active { transform:translateY(1px); } .cta:disabled { opacity:.4; cursor:default; box-shadow:none; }
  .ghost { width:100%; margin-top:9px; padding:11px; border:none; background:transparent; color:var(--muted); font-weight:600; font-size:13px; cursor:pointer; border-radius:10px; }
  .ghost:hover { color:var(--ink); background:var(--soft); }
  .note { text-align:center; color:var(--muted); font-size:11px; margin-top:12px; line-height:1.5; }
  .note b { color:var(--ink2); }
  .demoTag { display:inline-block; margin-top:6px; font-size:9.5px; font-weight:700; letter-spacing:.05em; text-transform:uppercase;
    color:var(--muted); background:var(--soft); border:1px dashed var(--line2); border-radius:20px; padding:3px 10px; }

  /* ---------- handshake ---------- */
  .hsWrap { text-align:center; padding:24px 0 8px; }
  .hs { display:flex; align-items:center; justify-content:center; margin-bottom:22px; }
  .hsNode { position:relative; width:62px; height:62px; border-radius:18px; display:grid; place-items:center; flex:none; z-index:1; box-shadow:0 8px 22px rgba(15,22,32,.12); }
  .hsNode .avatar { width:62px; height:62px; border-radius:18px; }
  .hsHedge { background:radial-gradient(120% 120% at 30% 20%, #14b87f, #0b8159); color:#fff; font-size:28px; }
  .hsNode::before { content:''; position:absolute; inset:-5px; border-radius:22px; border:2px solid var(--chance); opacity:0; animation:ring 1.8s ease-out infinite; }
  .hsNode.delay::before { animation-delay:.9s; }
  @keyframes ring { 0%{opacity:.5; transform:scale(.85)} 70%{opacity:0; transform:scale(1.18)} 100%{opacity:0} }
  .hsTrack { width:74px; height:3px; margin:0 -6px; position:relative; background:repeating-linear-gradient(90deg,var(--line2) 0 5px,transparent 5px 11px); }
  .hsTrack i { position:absolute; top:50%; width:7px; height:7px; border-radius:50%; background:var(--chance); transform:translate(-50%,-50%); animation:travel 1.5s linear infinite; box-shadow:0 0 8px rgba(14,159,110,.6); }
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

  .stateBox { text-align:center; padding:36px 16px; color:var(--muted); }
  .stateBox .se { font-size:30px; margin-bottom:8px; } .stateBox b { color:var(--ink); display:block; margin-bottom:4px; font-size:14.5px; }
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
      this.state = { view: 'trigger', elig: null, candidates: [], risk: 0, win: 0, venue: 'all', picked: null, outcome: null }
      // host integrations (e.g. the Chance browser extension) can open the sheet
      // programmatically without rendering the inline trigger (trigger="none").
      this.addEventListener('chance:open', this.open.bind(this))
      this.renderTrigger()
    }

    cfg() {
      var amount = Math.max(2, parseFloat(attr(this, 'amount', '50')) || 50)
      return {
        amount: amount,
        currency: attr(this, 'currency', 'USD'),
        mode: attr(this, 'mode', 'flip-to-free') === 'win-it-back' ? 'win-it-back' : 'flip-to-free',
        theme: attr(this, 'theme', 'light') === 'dark' ? 'dark' : 'light',
        apiBase: attr(this, 'api-base', null),
        country: attr(this, 'country', null),
        region: attr(this, 'region', null),
        trigger: attr(this, 'trigger', 'default'),
      }
    }
    get flip() { return this.cfg().mode === 'flip-to-free' }
    emit(name, detail) { this.dispatchEvent(new CustomEvent(name, { detail: detail, bubbles: true, composed: true })) }

    // slider ranges, relative to the order amount
    bounds() {
      var a = this.cfg().amount
      return {
        riskMin: 1, riskMax: Math.max(5, Math.round(a * 0.6)),
        winMin: Math.max(2, Math.round(a * 0.15)), winMax: a,
      }
    }
    // markets near a target probability — closest-to-odds first, then most liquid, capped
    matchMarkets(risk, win) {
      var p = clamp(risk / win, 0.01, 0.97)
      return (this.state.candidates || [])
        .filter(function (c) { return Math.abs(c.price - p) <= BAND })
        .sort(function (a, b) { return Math.abs(a.price - p) - Math.abs(b.price - p) || (b.liquidity || 0) - (a.liquidity || 0) })
        .slice(0, SHOW_CAP)
    }
    // core derived numbers for a (risk, win) pair
    calc(risk, win) {
      var a = this.cfg().amount
      var p = clamp(risk / win, 0.01, 0.97)
      return {
        p: p, chancePct: Math.round(p * 100), odds: oddsLabel(p),
        discountPct: Math.round((win / a) * 100),
        payToday: this.flip ? round2(a + risk) : a,
        matches: this.matchMarkets(risk, win),
      }
    }

    // ---------- shell + morph (mount the sheet ONCE; only the body morphs between steps) ----------
    shell(inner) { return '<style>' + STYLE + '</style><div class="wrap ' + this.cfg().theme + '">' + inner + '</div>' }
    mountSheet() {
      var self = this
      this.shadowRoot.innerHTML = this.shell(
        '<div class="overlay"><div class="sheet">' +
        '<div class="hdr"><button class="hbtn navBack" data-nav="back" style="visibility:hidden">‹</button>' +
        '<span class="brandWrap"><span class="brandMark"><span class="dot">✦</span> <span class="script">Chance</span><span style="opacity:.6;font-weight:600;margin-left:5px">· a Hedge Pay product</span></span>' +
        '<span class="demoStrip">Demo · no real money yet</span></span>' +
        '<button class="hbtn" data-nav="close">✕</button></div>' +
        '<div class="body"></div><div class="foot"></div></div></div>')
      var ov = this.shadowRoot.querySelector('.overlay')
      ov.onclick = function (e) { if (e.target === ov) self.close() }
      this.shadowRoot.querySelector('[data-nav="close"]').onclick = function () { self.close() }
      this.shadowRoot.querySelector('[data-nav="back"]').onclick = function () { self.back() }
    }
    bindActs() {
      var self = this
      this.shadowRoot.querySelectorAll('.body [data-act], .foot [data-act]').forEach(function (b) {
        b.onclick = function () { self.act(b.getAttribute('data-act')) }
      })
    }
    // smoothly tween the sheet's height around a DOM mutation
    tweenHeight(mutate) {
      var sheet = this.shadowRoot.querySelector('.sheet')
      var startH = sheet.offsetHeight
      mutate()
      sheet.style.height = 'auto'
      var endH = sheet.offsetHeight
      sheet.style.height = startH + 'px'
      void sheet.offsetHeight
      sheet.style.height = endH + 'px'
      window.setTimeout(function () { sheet.style.height = 'auto' }, 360)
    }
    // cross-fade + height-morph the body/foot to a new step — NO overlay/sheet/header rebuild
    morph(back, bodyHtml, footHtml, bind) {
      var self = this, sr = this.shadowRoot
      var body = sr.querySelector('.body'), foot = sr.querySelector('.foot')
      sr.querySelector('.navBack').style.visibility = back ? 'visible' : 'hidden'
      var apply = function () {
        body.innerHTML = bodyHtml; foot.innerHTML = footHtml || ''
        self.bindActs(); if (bind) bind()
        body.style.opacity = '1'; body.style.transform = 'none'; foot.style.opacity = '1'
      }
      if (!body.innerHTML) { body.style.opacity = '0'; apply(); return } // first paint — let the sheet rise in
      body.style.opacity = '0'; body.style.transform = 'translateY(6px)'; foot.style.opacity = '0'
      window.setTimeout(function () { self.tweenHeight(apply) }, 150)
    }
    act(a) {
      if (a === 'close') return this.close()
      if (a === 'intro-next') return this.renderConfig()
      if (a === 'config-next') return this.renderMarkets()
      if (a === 'place') return this.place()
      if (a === 'decline') { this.emit('chance:declined', { amount: this.cfg().amount }); return this.close() }
    }
    back() {
      if (this.state.view === 'config') return this.renderIntro()
      if (this.state.view === 'markets') return this.renderConfig()
    }

    // ---------- trigger ----------
    renderTrigger() {
      this.state.view = 'trigger'
      var c = this.cfg()
      if (c.trigger === 'none') { this.shadowRoot.innerHTML = this.shell('') ; return } // headless: opened via chance:open
      var sub = c.mode === 'win-it-back' ? 'Free shot to win money off your order' : 'Risk a little for a discount — or a free order'
      this.shadowRoot.innerHTML = this.shell(
        '<button class="trigger shimmer"><span class="trigBadge">✦</span>' +
        '<span><span class="trigMain">Add <span class="script">Chance</span> — win it back?</span>' +
        '<span class="trigSub">' + sub + '</span></span><span class="trigArrow">›</span></button>')
      this.shadowRoot.querySelector('.trigger').onclick = this.open.bind(this)
    }

    open() {
      var c = this.cfg()
      this.state.elig = resolveEligibility(c.country, c.region)
      var b = this.bounds()
      this.state.risk = Math.max(b.riskMin, Math.round(c.amount * 0.06))
      this.state.win = Math.round(c.amount * 0.5)
      this.state.venue = 'all'; this.state.picked = null; this.state.outcome = null
      this.state.candidates = []; this.state.live = false
      this.state.loading = this.state.elig.eligible
      this.mountSheet()
      this.renderIntro()
      if (this.state.elig.eligible) this.loadCandidates()
    }
    // fetch live Polymarket markets; fall back to seed; refresh whatever step is showing
    loadCandidates() {
      var self = this, now = Date.now()
      var done = function (list, live) {
        self.state.candidates = list; self.state.live = live; self.state.loading = false
        if (self.state.view === 'config' && self._cfgUpdate) self._cfgUpdate()
        else if (self.state.view === 'markets') self.renderMarkets()
      }
      fetchPolymarketCandidates(now)
        .then(function (live) { (live && live.length >= 4) ? done(live, true) : done(buildSeedCandidates(now), false) })
        .catch(function () { done(buildSeedCandidates(now), false) })
    }
    close() { this.renderTrigger() }

    // ---------- step 1: intro ----------
    renderIntro() {
      this.state.view = 'intro'
      var c = this.cfg(), free = this.flip ? 'risk a little' : 'free to play'
      if (!this.state.elig.eligible) {
        this.morph(false, '<div class="stateBox"><div class="se">📍</div><b>Chance isn’t available in your area yet</b>' +
          (this.state.elig.reason === 'state-restricted' ? 'Not offered in your state right now.' : 'Not offered in your region right now.') + '</div>', '')
        return
      }
      var exRisk = Math.max(1, Math.round(c.amount * 0.06)), exWin = Math.round(c.amount * 0.5)
      var step1 = this.flip
        ? ['Set your risk &amp; reward', 'Choose how much to stake and the discount you want to win.']
        : ['Pick your reward', 'Choose the discount you want a shot at — free to play.']
      this.morph(false,
        '<div class="step"><div class="hero"><span class="heroBadge">✦</span></div>' +
        '<div class="title" style="text-align:center">Turn your order into a <span class="rWin">win</span></div>' +
        '<p class="sub" style="text-align:center">Back a real market at checkout. If it hits, you ' + (this.flip ? 'knock money off — up to a free order' : 'win money off your order') + '. Either way, it ships.</p>' +
        '<div class="steps">' +
        '<div class="stepRow"><span class="stepNo">1</span><span class="stepTx"><b>' + step1[0] + '</b><span>' + step1[1] + '</span></span></div>' +
        '<div class="stepRow"><span class="stepNo">2</span><span class="stepTx"><b>We find a real market</b><span>A live Kalshi or Polymarket prop near your odds.</span></span></div>' +
        '<div class="stepRow"><span class="stepNo">3</span><span class="stepTx"><b>It hits? You save.</b><span>Your discount is applied. Miss, and your order still ships.</span></span></div>' +
        '</div>' +
        '<div class="example">e.g. your <b>$' + FMT(c.amount) + '</b> order → ' + (this.flip ? 'risk <b>$' + FMT(exRisk) + '</b>' : '<b>free</b>') + ' to win <b>$' + FMT(exWin) + '</b> back <b>(' + Math.round(exWin / c.amount * 100) + '% off)</b></div></div>',
        '<button class="cta" data-act="intro-next">Get started →</button>' +
        '<button class="ghost" data-act="decline">Maybe next time</button>')
    }

    // ---------- step 2: configure (two linked sliders) ----------
    renderConfig() {
      this.state.view = 'config'
      var self = this, c = this.cfg(), b = this.bounds()
      this.state.risk = clamp(this.state.risk, b.riskMin, b.riskMax)
      this.state.win = clamp(this.state.win, b.winMin, b.winMax)

      var riskCtrl = this.flip
        ? '<div class="sl"><div class="slTop"><span class="slLbl">How much to risk</span><span class="slVal" id="vRisk">$' + FMT(this.state.risk) + '</span></div>' +
          '<input class="rng" id="sRisk" type="range" min="' + b.riskMin + '" max="' + b.riskMax + '" step="1" value="' + this.state.risk + '"></div>'
        : '<div class="sl"><div class="slTop"><span class="slLbl">Your stake <small style="color:var(--chance);font-weight:700">· on the house</small></span><span class="slVal" id="vRisk">$' + FMT(this.state.risk) + '</span></div>' +
          '<input class="rng" id="sRisk" type="range" min="' + b.riskMin + '" max="' + b.riskMax + '" step="1" value="' + this.state.risk + '"></div>'

      this.morph(true,
        '<div class="step"><div class="title">Set your bet</div>' +
        '<p class="sub">Slide to choose your risk and the discount you want. We’ll find real markets at those odds.</p>' +
        riskCtrl +
        '<div class="sl"><div class="slTop"><span class="slLbl">Discount you win</span><span class="slVal" id="vWin">$' + FMT(this.state.win) + '<small id="vWinPct">' + Math.round(this.state.win / c.amount * 100) + '% off</small></span></div>' +
        '<input class="rng win" id="sWin" type="range" min="' + b.winMin + '" max="' + b.winMax + '" step="1" value="' + this.state.win + '"></div>' +
        '<div class="readout"><div class="roMain"><div class="roChance" id="vChance">—<small>chance it hits</small></div><span class="roOdds" id="vOdds">—</span></div>' +
        '<div class="roLine"><span>Pay today</span><b id="vPay">—</b></div>' +
        '<div class="roHint" id="vHint">—</div></div></div>',
        '<button class="cta" id="findBtn" data-act="config-next">Find markets →</button>',
      function () {
      var sRisk = self.shadowRoot.querySelector('#sRisk'), sWin = self.shadowRoot.querySelector('#sWin')
      var update = function () {
        self.state.risk = parseInt(sRisk.value, 10); self.state.win = parseInt(sWin.value, 10)
        // keep win strictly greater than risk so odds stay < 100%
        if (self.state.win <= self.state.risk) { self.state.win = Math.min(b.winMax, self.state.risk + 1); sWin.value = self.state.win }
        self.fillTrack(sRisk, b.riskMin, b.riskMax); self.fillTrack(sWin, b.winMin, b.winMax)
        var k = self.calc(self.state.risk, self.state.win)
        self.shadowRoot.querySelector('#vRisk').textContent = '$' + FMT(self.state.risk)
        self.shadowRoot.querySelector('#vWin').innerHTML = '$' + FMT(self.state.win) + '<small>' + k.discountPct + '% off</small>'
        self.shadowRoot.querySelector('#vChance').innerHTML = k.chancePct + '%<small>chance it hits</small>'
        self.shadowRoot.querySelector('#vOdds').textContent = k.odds + ' odds'
        self.shadowRoot.querySelector('#vPay').textContent = '$' + FMT(k.payToday)
        var hint = self.shadowRoot.querySelector('#vHint'), btn = self.shadowRoot.querySelector('#findBtn')
        if (self.state.loading) {
          hint.textContent = 'Finding live markets…'
          btn.disabled = true; btn.textContent = 'Finding live markets…'
          return
        }
        if (k.matches.length) {
          hint.innerHTML = '<b>' + k.matches.length + '</b> live market' + (k.matches.length > 1 ? 's' : '') + ' near these odds'
          btn.disabled = false; btn.textContent = 'Find ' + k.matches.length + ' market' + (k.matches.length > 1 ? 's' : '') + ' →'
        } else {
          hint.innerHTML = 'No markets at these odds — try a bigger risk or smaller discount'
          btn.disabled = true; btn.textContent = 'No markets at these odds'
        }
      }
      self._cfgUpdate = update
      sRisk.oninput = update; sWin.oninput = update
      update()
      })
    }
    fillTrack(el, min, max) {
      var pct = ((el.value - min) / (max - min)) * 100
      var accent = el.classList.contains('win') ? 'var(--blue)' : 'var(--chance)'
      el.style.background = 'linear-gradient(90deg,' + accent + ' 0 ' + pct + '%, var(--line2) ' + pct + '% 100%)'
    }

    // ---------- step 3: markets — morph the frame once, then update rows in place ----------
    renderMarkets() {
      this.state.view = 'markets'
      var self = this, c = this.cfg()
      if (this.state.loading) { this.morph(true, '<div class="stateBox"><div class="spin"></div>Finding live markets…</div>', ''); return }
      var pNow = clamp(this.state.risk / this.state.win, 0.01, 0.97)
      // freeze the matched set on entry; the stake stepper only re-prices these
      this.state.matched = this.matchMarkets(this.state.risk, this.state.win)
      var venues = this.state.matched.reduce(function (s, o) { return s.indexOf(o.venue) < 0 ? s.concat(o.venue) : s }, [])
      if (this.state.venue !== 'all' && venues.indexOf(this.state.venue) < 0) this.state.venue = 'all'
      var chancePct = Math.round(pNow * 100)

      var bodyHtml =
        '<div class="step"><div class="title">Markets near your odds</div>' +
        '<p class="sub">Risk <b style="color:var(--ink)">$' + FMT(this.state.risk) + '</b> to win about <b style="color:var(--ink)">$' + FMT(this.state.win) + '</b> · ~' + chancePct + '% chance. Pick one — nudge the stake to fine-tune.</p>' +
        '<div class="toolbar"><div class="chips">' +
        (function () { var cv = ['all'].concat(venues); if (cv.indexOf('kalshi') < 0) cv.push('kalshi'); return cv.map(function (v) { var lbl = v === 'all' ? 'All' : (v === 'kalshi' ? 'Kalshi · soon' : venueOf(v).name); return '<button class="chip ' + (self.state.venue === v ? 'on' : '') + '" data-venue="' + v + '">' + lbl + '</button>' }).join('') })() +
        '</div><div class="stepper"><button data-step="-1">−</button><span class="sv">$' + FMT(this.state.risk) + '<small>risk</small></span><button data-step="1">+</button></div></div>' +
        '<div class="rows" id="rows"></div></div>'

      this.morph(true, bodyHtml, '', function () {
        var b = self.bounds()
        self.shadowRoot.querySelectorAll('[data-venue]').forEach(function (x) {
          x.onclick = function () {
            self.state.venue = x.getAttribute('data-venue')
            self.shadowRoot.querySelectorAll('[data-venue]').forEach(function (y) { y.classList.toggle('on', y === x) })
            self.tweenHeight(function () { self.paintRows() })
          }
        })
        self.shadowRoot.querySelectorAll('[data-step]').forEach(function (x) {
          x.onclick = function () { self.state.risk = clamp(self.state.risk + parseInt(x.getAttribute('data-step'), 10), b.riskMin, b.riskMax); self.refreshValues() }
        })
        self.paintRows()
      })
    }
    // (re)draw the market rows + foot in place — no sheet rebuild
    paintRows() {
      var self = this, c = this.cfg()
      var rowsEl = this.shadowRoot.querySelector('#rows')
      if (this.state.venue === 'kalshi') {
        rowsEl.innerHTML = '<div class="empty"><b>Kalshi markets are coming online</b>Polymarket is live now — switch to “All” or “Polymarket”.</div>'
        this.shadowRoot.querySelector('.foot').innerHTML = this.placeFoot(); this.bindActs(); return
      }
      var list = (this.state.matched || []).filter(function (m) { return self.state.venue === 'all' || m.venue === self.state.venue })
      rowsEl.innerHTML = list.length ? list.map(function (m) {
        var V = venueOf(m.venue)
        var winAt = Math.min(c.amount, round2(self.state.risk / m.price))
        var on = self.state.picked === m.marketId ? ' on' : ''
        return '<button class="row' + on + '" data-id="' + m.marketId + '">' + V.avatar(40) +
          '<div class="rowMid"><div class="rowQ">' + esc(displayMarket(m)) + '</div>' +
          '<div class="rowSub"><span class="vName" style="color:' + V.accent + '">' + V.name + '</span> · ' + m.winProbPct + '% chance · ' + fmtExpiry(m.resolves_at) + '</div></div>' +
          '<div class="rowRight"><div class="rowVal"><b>win $' + FMT(winAt) + '</b><small>' + Math.round(winAt / c.amount * 100) + '% off</small></div><span class="chev">›</span></div></button>'
      }).join('') : '<div class="empty"><b>No markets in this filter</b>Switch venue, or go back and widen your risk.</div>'
      rowsEl.querySelectorAll('.row').forEach(function (x) { x.onclick = function () { self.selectRow(x.getAttribute('data-id')) } })
      this.shadowRoot.querySelector('.foot').innerHTML = this.placeFoot(); this.bindActs()
    }
    // highlight a pick + reveal the place bar — toggle classes, don't redraw the list
    selectRow(id) {
      var self = this
      this.state.picked = id
      this.shadowRoot.querySelectorAll('#rows .row').forEach(function (r) { r.classList.toggle('on', r.getAttribute('data-id') === id) })
      this.tweenHeight(function () { self.shadowRoot.querySelector('.foot').innerHTML = self.placeFoot(); self.bindActs() })
    }
    // fine-tune stepper — re-price the same rows in place (set changes, height doesn't)
    refreshValues() {
      var self = this, c = this.cfg()
      this.shadowRoot.querySelectorAll('#rows .row').forEach(function (r) {
        var m = (self.state.matched || []).filter(function (x) { return x.marketId === r.getAttribute('data-id') })[0]; if (!m) return
        var winAt = Math.min(c.amount, round2(self.state.risk / m.price))
        var rv = r.querySelector('.rowVal'); if (rv) rv.innerHTML = '<b>win $' + FMT(winAt) + '</b><small>' + Math.round(winAt / c.amount * 100) + '% off</small>'
      })
      var sv = this.shadowRoot.querySelector('.stepper .sv'); if (sv) sv.innerHTML = '$' + FMT(this.state.risk) + '<small>risk</small>'
      this.shadowRoot.querySelector('.foot').innerHTML = this.placeFoot(); this.bindActs()
    }
    placeFoot() {
      var self = this, c = this.cfg()
      var m = this.state.picked ? (this.state.matched || []).filter(function (x) { return x.marketId === self.state.picked })[0] : null
      if (!m) return '<button class="cta" disabled>Pick a market to place</button>'
      var winAt = Math.min(c.amount, round2(this.state.risk / m.price))
      var payToday = this.flip ? round2(c.amount + this.state.risk) : c.amount
      return '<div class="placeBar"><div class="pbL">Pay today<b>$' + FMT(payToday) + '</b></div>' +
        '<div class="pbR">if it hits<b>win $' + FMT(winAt) + ' (' + Math.round(winAt / c.amount * 100) + '% off)</b></div></div>' +
        '<button class="cta shimmer" data-act="place">' + (this.flip ? 'Risk $' + FMT(this.state.risk) + ' &amp; place' : 'Place — free to play') + '</button>'
    }

    // ---------- resolving (handshake) ----------
    place() {
      var self = this, c = this.cfg()
      var m = this.state.candidates.filter(function (x) { return x.marketId === self.state.picked })[0]
      if (!m) return
      var V = venueOf(m.venue)
      var winAt = Math.min(c.amount, round2(this.state.risk / m.price))
      var payToday = this.flip ? round2(c.amount + this.state.risk) : c.amount
      this.state.placed = { market: m, risk: this.state.risk, winAt: winAt, payToday: payToday, venue: m.venue }
      this.emit('chance:applied', { mode: c.mode, risk: this.flip ? this.state.risk : 0, win: winAt, total: payToday, offer: m })
      this.state.view = 'resolving'

      this.morph(false,
        '<div class="step hsWrap"><div class="hs"><span class="hsNode hsHedge">✦</span>' +
        '<span class="hsTrack"><i></i><i></i><i></i></span>' +
        '<span class="hsNode delay">' + V.avatar(62) + '</span></div>' +
        '<div class="rTitle">Connecting to ' + V.name + '…</div>' +
        '<p class="sub" style="text-align:center">Placing your position on “' + esc(displayMarket(m)) + '” · ' + fmtExpiry(m.resolves_at) + '</p></div>')

      setTimeout(function () {
        var won = Math.random() < m.price // seeded by the market's true probability
        self.state.outcome = won
        self.renderResult(won)
        self.emit('chance:result', { won: won, mode: c.mode, offer: m, amountBack: won ? winAt : 0, finalPrice: won ? Math.max(0, round2(payToday - winAt)) : payToday })
      }, 2100)
    }

    // ---------- result ----------
    renderResult(won) {
      var c = this.cfg(), P = this.state.placed, V = venueOf(P.venue), flip = this.flip
      var m = P.market, winAt = P.winAt
      var netPaid = won ? Math.max(0, round2((flip ? P.payToday : c.amount) - winAt)) : P.payToday
      var offPct = Math.round(winAt / c.amount * 100)
      var body
      if (won) {
        body = '<div class="emoji">🎉</div><div class="rTitle rWin">' + (winAt >= c.amount ? 'Your order’s free!' : 'You won $' + FMT(winAt) + ' off!') + '</div>' +
          '<p class="sub" style="text-align:center">“' + esc(displayMarket(m)) + '” resolved <b>Yes</b> on ' + V.name + '. ' + offPct + '% knocked off your order.</p>' +
          '<div class="break"><div><span>Order</span><span>$' + FMT(c.amount) + '</span></div>' +
          (flip ? '<div><span><span class="script" style="font-size:1em">Chance</span> stake</span><span>+$' + FMT(P.risk) + '</span></div>' : '') +
          '<div><span><span class="script" style="font-size:1em">Chance</span> win-back</span><span class="neg">−$' + FMT(winAt) + '</span></div>' +
          '<div class="fin winFin"><span>You paid</span><span>$' + FMT(netPaid) + '</span></div></div>'
      } else {
        body = '<div class="emoji">🪙</div><div class="rTitle">So close!</div>' +
          '<p class="sub" style="text-align:center">“' + esc(displayMarket(m)) + '” resolved <b>No</b> on ' + V.name + '. Your order still ships' + (flip ? '.' : ' — no harm in the swing.') + '</p>' +
          '<div class="break"><div><span>Order</span><span>$' + FMT(c.amount) + '</span></div>' +
          (flip ? '<div><span><span class="script" style="font-size:1em">Chance</span> stake</span><span>$' + FMT(P.risk) + '</span></div>' : '') +
          '<div class="fin"><span>You paid</span><span>$' + FMT(P.payToday) + '</span></div></div>'
      }
      this.morph(false,
        '<div class="step result">' + body +
        '<div class="note" style="margin-top:18px">Powered by <b>Hedge Pay</b> · markets via Kalshi &amp; Polymarket<br>' +
        '<span class="demoTag">Demo settlement — real routing coming</span></div></div>',
        '<button class="cta" data-act="close">Done</button>')
    }
  }

  customElements.define('chance-checkout', ChanceCheckout)
})()
