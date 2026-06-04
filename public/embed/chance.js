/**
 * Chance™ by Hedge — embeddable checkout drop-in.
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
 *
 * Self-contained: the odds engine + a seeded market snapshot run client-side, so
 * it works on a static site with no backend. Bet settlement is SIMULATED for the
 * demo (seeded by each market's true probability) — real routing/execution to
 * Kalshi/Polymarket is a later phase. Hedge is the router, not the house.
 */
(function () {
  'use strict'
  if (window.customElements && customElements.get('chance-checkout')) return

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
  function venueBrand(v) {
    return v === 'kalshi'
      ? { name: 'Kalshi', verb: 'Settled on', url: function (id) { return 'https://kalshi.com/markets/' + id } }
      : { name: 'Polymarket', verb: 'Routed to', url: function (id) { return 'https://polymarket.com/event/' + id } }
  }

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
    var brand = venueBrand(elig.venue)
    var offers = findChanceOffers({ itemPrice: cfg.amount, tiers: SPREAD_TIERS, snapshots: seedSnapshots(elig.venue, now), now: now })
    return Promise.resolve({
      eligible: true, venue: elig.venue, brand: { name: brand.name, verb: brand.verb },
      offers: offers.filter(function (o) { return o.available }),
    })
  }

  // ===========================================================================
  // 4. Styles (scoped to the shadow root) — ported from the /store demo
  // ===========================================================================
  var STYLE = `
  :host { all: initial; }
  * { box-sizing: border-box; font-family: var(--ch-font, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif); }
  .wrap { --ink:#1a1a1f; --muted:#6b7280; --line:#e5e7eb; --bg:#f4f4f6; --card:#fff; --chance:#0e9f6e; --chance-dk:#0b8159; --win:#0e9f6e; }
  .wrap.dark { --ink:#f4f4f6; --muted:#9aa0aa; --line:#2a2c33; --bg:#0f1014; --card:#181a20; }
  .script { font-family: 'Snell Roundhand','Brush Script MT',cursive; font-style: italic; font-weight: 600; font-size: 1.12em; }

  /* trigger */
  .trigger { display:flex; width:100%; align-items:center; justify-content:space-between; gap:12px; cursor:pointer;
    border:1px solid #bbf3d8; background:#effdf6; border-radius:14px; padding:14px 16px; text-align:left; color:#0b8159;
    transition:border-color .15s, transform .1s, box-shadow .15s; position:relative; overflow:hidden; isolation:isolate; }
  .trigger:hover { border-color:var(--chance); transform:translateY(-1px); box-shadow:0 8px 24px rgba(14,159,110,.18); }
  .trigger:active { transform:translateY(0); }
  .trigBadge { display:grid; place-items:center; width:34px; height:34px; border-radius:10px; background:var(--chance); color:#fff; font-size:17px; flex:none; }
  .trigMain { font-weight:800; font-size:14px; color:#0a7d57; }
  .trigSub { font-size:12px; color:#0b8159; opacity:.85; margin-top:1px; }
  .trigArrow { margin-left:auto; color:var(--chance); font-weight:800; }
  .shimmer::after { content:''; position:absolute; top:-10%; left:-160%; width:55%; height:120%; pointer-events:none;
    transform:skewX(-20deg); background:linear-gradient(100deg,transparent,rgba(255,255,255,.65) 50%,transparent);
    animation:sh 2.8s ease-in-out infinite; }
  @keyframes sh { 0%{left:-160%} 55%,100%{left:160%} }

  /* overlay + sheet */
  .overlay { position:fixed; inset:0; z-index:2147483000; display:flex; align-items:flex-end; justify-content:center;
    background:rgba(8,10,14,.46); backdrop-filter:blur(3px); padding:0; animation:fade .2s ease; }
  @media (min-width:640px){ .overlay{ align-items:center; padding:16px; } }
  @keyframes fade { from{opacity:0} to{opacity:1} }
  .sheet { width:100%; max-width:560px; max-height:92vh; overflow-y:auto; background:var(--bg); color:var(--ink);
    border-radius:20px 20px 0 0; box-shadow:0 -10px 60px rgba(0,0,0,.4); animation:rise .26s cubic-bezier(.2,.8,.2,1); }
  @media (min-width:640px){ .sheet{ border-radius:20px; } }
  @keyframes rise { from{transform:translateY(24px); opacity:.6} to{transform:translateY(0); opacity:1} }
  .head { display:flex; align-items:flex-start; justify-content:space-between; padding:18px 20px 0; }
  .pill { display:inline-flex; align-items:center; gap:7px; background:#effdf6; color:var(--chance); font-weight:700; font-size:12px;
    padding:6px 12px; border-radius:30px; border:1px solid #bbf3d8; }
  .x { border:none; background:transparent; color:var(--muted); font-size:20px; cursor:pointer; line-height:1; padding:4px; }
  .body { padding:14px 20px 22px; }
  .title { font-size:22px; font-weight:800; letter-spacing:-.02em; margin:8px 0 4px; text-align:center; }
  .sub { color:var(--muted); font-size:13.5px; line-height:1.5; text-align:center; max-width:42ch; margin:0 auto 4px; }

  .mkts { display:grid; grid-template-columns:1fr 1fr; gap:11px; margin-top:18px; }
  @media (max-width:520px){ .mkts{ grid-template-columns:1fr; } }
  .mkt { text-align:left; background:var(--card); border:1px solid var(--line); border-radius:14px; padding:14px; cursor:pointer;
    transition:border-color .15s, box-shadow .15s, transform .1s; color:var(--ink); }
  .mkt:hover { transform:translateY(-2px); box-shadow:0 8px 22px rgba(0,0,0,.07); }
  .mkt.on { border-color:var(--chance); background:color-mix(in srgb, var(--chance) 8%, var(--card)); box-shadow:0 0 0 2px var(--chance); }
  .mktTop { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
  .venue { display:inline-flex; align-items:center; gap:7px; padding:3px 10px 3px 4px; border-radius:24px; font-size:13px; font-weight:800; }
  .vK { background:#e3fbf3; color:#0a8f72; } .vP { background:#e9f0ff; color:#2b6ef6; }
  .vIcon { display:grid; place-items:center; width:24px; height:24px; border-radius:6px; font-weight:900; font-size:14px; }
  .vKI { background:#00c79a; color:#042b22; } .vPI { background:#2b6ef6; color:#fff; font-size:12px; }
  .mktChance { font-size:11.5px; font-weight:700; color:var(--muted); }
  .mktQ { font-size:14.5px; font-weight:700; line-height:1.3; min-height:38px; }
  .mktBot { display:flex; align-items:center; justify-content:space-between; margin-top:12px; }
  .mktYes { font-weight:700; font-size:12px; color:var(--chance); background:#effdf6; border:1px solid #bbf3d8; border-radius:8px; padding:5px 10px; }
  .mkt.on .mktYes { background:var(--chance); color:#fff; }
  .mktWin { font-size:13.5px; font-weight:800; text-align:right; }
  .mktWin small { display:block; color:var(--muted); font-weight:500; font-size:10.5px; }

  .actions { display:flex; gap:10px; margin-top:18px; }
  .ghost { flex:none; padding:14px 18px; border-radius:11px; border:1px solid var(--line); background:var(--card); color:var(--ink); font-weight:600; cursor:pointer; font-size:13.5px; }
  .ghost:hover { border-color:var(--muted); }
  .cta { flex:1; padding:14px; border:none; border-radius:11px; background:var(--chance); color:#fff; font-size:14.5px; font-weight:800; cursor:pointer;
    position:relative; overflow:hidden; isolation:isolate; transition:background .15s; }
  .cta:hover { background:var(--chance-dk); } .cta:disabled { opacity:.45; cursor:default; }

  /* result */
  .result { text-align:center; padding:22px 8px 6px; }
  .spinner { width:46px; height:46px; border:4px solid var(--line); border-top-color:var(--chance); border-radius:50%; margin:6px auto 16px; animation:spin .8s linear infinite; }
  @keyframes spin { to{ transform:rotate(360deg); } }
  .emoji { font-size:58px; line-height:1; }
  .rTitle { font-size:24px; font-weight:800; letter-spacing:-.02em; margin:12px 0 6px; }
  .rWin { color:var(--win); }
  .break { background:var(--card); border:1px solid var(--line); border-radius:12px; padding:14px 16px; margin:18px auto 0; max-width:340px; text-align:left; }
  .break div { display:flex; justify-content:space-between; font-size:13.5px; padding:4px 0; color:var(--muted); }
  .break .fin { font-weight:800; font-size:16px; color:var(--ink); border-top:1px solid var(--line); padding-top:9px; margin-top:4px; }
  .break .fin.winFin { color:var(--win); }
  .neg { color:var(--win); }
  .foot { text-align:center; color:var(--muted); font-size:11.5px; margin-top:18px; }
  .foot b { color:var(--ink); }
  .demoTag { display:inline-block; margin-top:6px; font-size:10px; font-weight:700; letter-spacing:.04em; text-transform:uppercase;
    color:var(--muted); background:var(--bg); border:1px dashed var(--line); border-radius:20px; padding:2px 9px; }
  .state { text-align:center; padding:34px 16px; color:var(--muted); }
  .state .se { font-size:30px; }
  @media (prefers-reduced-motion: reduce){ .shimmer::after,.cta::after{ display:none; } .sheet,.overlay{ animation:none; } }
  `

  // ===========================================================================
  // 5. The custom element
  // ===========================================================================
  var FMT = function (n) { return Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 }) }

  function venueTag(v) {
    if (v === 'kalshi') return '<span class="venue vK"><span class="vIcon vKI">K</span>Kalshi</span>'
    return '<span class="venue vP"><span class="vIcon vPI">P</span>Polymarket</span>'
  }

  var ChanceCheckout = (function () {
    function attr(el, name, dflt) { var v = el.getAttribute(name); return v == null || v === '' ? dflt : v }

    class El extends HTMLElement {
      connectedCallback() {
        if (this._mounted) return
        this._mounted = true
        this.attachShadow({ mode: 'open' })
        this.state = { view: 'trigger', data: null, picked: null, outcome: null }
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

      style() { return '<style>' + STYLE + '</style>' }
      wrapOpen() { return '<div class="wrap ' + this.cfg().theme + '">' }

      emit(name, detail) { this.dispatchEvent(new CustomEvent(name, { detail: detail, bubbles: true, composed: true })) }

      renderTrigger() {
        var c = this.cfg()
        var sub = c.mode === 'win-it-back'
          ? 'Buy as usual — free shot to win all $' + FMT(c.amount) + ' back'
          : 'Pay a little more for a shot at $0'
        this.shadowRoot.innerHTML = this.style() + this.wrapOpen() +
          '<button class="trigger shimmer" part="trigger">' +
            '<span class="trigBadge">✦</span>' +
            '<span><span class="trigMain">Add <span class="script">Chance</span> — win it back?</span>' +
            '<span class="trigSub">' + sub + '</span></span>' +
            '<span class="trigArrow">→</span>' +
          '</button></div>'
        this.shadowRoot.querySelector('.trigger').onclick = this.open.bind(this)
      }

      open() {
        var self = this, c = this.cfg()
        this.state.picked = null; this.state.outcome = null
        this.renderSheet('<div class="state"><div class="spinner"></div>Finding live markets…</div>')
        getOffers(c).then(function (data) {
          self.state.data = data
          if (data.eligible && data.offers && data.offers.length) self.state.picked = 0
          self.renderPicker()
        }).catch(function () {
          self.state.data = { eligible: true, offers: [] }
          self.renderPicker()
        })
      }

      close() { this.state.view = 'trigger'; this.renderTrigger() }

      renderSheet(inner, headExtra) {
        this.shadowRoot.innerHTML = this.style() + this.wrapOpen() +
          '<div class="overlay"><div class="sheet"><div class="head">' +
            '<span class="pill">✦ <span class="script">Chance</span> by Hedge</span>' +
            '<button class="x">✕</button></div>' +
            '<div class="body">' + inner + '</div></div></div></div>'
        var ov = this.shadowRoot.querySelector('.overlay')
        ov.onclick = function (e) { if (e.target === ov) this.close() }.bind(this)
        this.shadowRoot.querySelector('.x').onclick = this.close.bind(this)
        this.shadowRoot.querySelector('.sheet').onclick = function (e) { e.stopPropagation() }
      }

      renderPicker() {
        var c = this.cfg(), d = this.state.data
        if (!d || !d.eligible) {
          this.renderSheet('<div class="state"><div class="se">📍</div><p><b>Chance isn’t available in your area yet</b></p><p>' +
            (d && d.reason === 'state-restricted' ? 'Not offered in your state right now.' : 'Not offered in your region right now.') + '</p></div>')
          return
        }
        if (!d.offers || !d.offers.length) {
          this.renderSheet('<div class="state"><div class="se">🛰️</div><p><b>No matching markets right now</b></p><p>We look for soon-resolving, liquid markets. Check back shortly.</p></div>')
          return
        }
        var flip = c.mode === 'flip-to-free'
        var title = flip ? 'Flip your order to <span class="rWin">free</span>'
          : 'Win your <span class="rWin">$' + FMT(c.amount) + '</span> back'
        var sub = flip
          ? 'Pay a little more to back a real market. If it hits, your whole order is on us — you pay $0. Either way, it ships.'
          : 'Pick a real market on ' + d.venue.charAt(0).toUpperCase() + d.venue.slice(1) + '. Free to play. If it hits, we put your full $' + FMT(c.amount) + ' back — on the house. Either way, it ships.'

        var cards = d.offers.map(function (o, i) {
          var on = this.state.picked === i ? ' on' : ''
          var headRight, winBlock
          if (flip) {
            headRight = '<span class="mktChance">' + o.winProbPct + '% → $0</span>'
            winBlock = '<span class="mktWin">+$' + FMT(o.premium) + '<small>to play</small></span>'
          } else {
            headRight = '<span class="mktChance">' + o.winProbPct + '% chance</span>'
            winBlock = '<span class="mktWin">$' + FMT(c.amount) + ' back<small>free to play</small></span>'
          }
          return '<button class="mkt' + on + '" data-i="' + i + '">' +
            '<div class="mktTop">' + venueTag(o.venue || d.venue) + headRight + '</div>' +
            '<div class="mktQ">' + o.question + '</div>' +
            '<div class="mktBot"><span class="mktYes">Yes ' + Math.round(o.price * 100) + '¢</span>' + winBlock + '</div>' +
          '</button>'
        }.bind(this)).join('')

        var sel = this.state.picked != null ? d.offers[this.state.picked] : null
        var ctaLabel, ghostLabel = 'Pay $' + FMT(c.amount) + ' as usual'
        if (!sel) ctaLabel = 'Pick a market'
        else if (flip) ctaLabel = 'Add <span class="script">Chance</span> · Pay $' + FMT(c.amount + sel.premium)
        else ctaLabel = 'Place — win back $' + FMT(c.amount)

        this.renderSheet(
          '<div class="title">' + title + '</div><p class="sub">' + sub + '</p>' +
          '<div class="mkts">' + cards + '</div>' +
          '<div class="actions"><button class="ghost">' + ghostLabel + '</button>' +
          '<button class="cta shimmer" ' + (sel ? '' : 'disabled') + '>' + ctaLabel + '</button></div>' +
          '<div class="foot">Hedge routes your stake to <b>' + (d.brand ? d.brand.name : 'a real market') + '</b> — we’re not the house.</div>'
        )
        var self = this
        this.shadowRoot.querySelectorAll('.mkt').forEach(function (b) {
          b.onclick = function () { self.state.picked = parseInt(b.getAttribute('data-i'), 10); self.renderPicker() }
        })
        this.shadowRoot.querySelector('.ghost').onclick = function () { self.emit('chance:declined', { amount: c.amount }); self.close() }
        var cta = this.shadowRoot.querySelector('.cta')
        if (sel) cta.onclick = this.place.bind(this)
      }

      place() {
        var c = this.cfg(), d = this.state.data, o = d.offers[this.state.picked]
        var flip = c.mode === 'flip-to-free'
        var total = flip ? round2(c.amount + o.premium) : c.amount
        this.emit('chance:applied', { mode: c.mode, premium: flip ? o.premium : 0, total: total, offer: o })

        this.state.view = 'resolving'
        var vName = (o.venue || d.venue) === 'kalshi' ? 'Kalshi' : 'Polymarket'
        this.renderSheet('<div class="result"><div class="spinner"></div>' +
          '<div class="rTitle">Resolving on ' + vName + '…</div>' +
          '<p class="sub">“' + o.question + '”</p></div>')

        var self = this
        setTimeout(function () {
          var won = Math.random() < o.price // seeded by the market's true probability
          self.state.outcome = won
          self.renderResult(won, o, total, flip, vName)
          self.emit('chance:result', {
            won: won, mode: c.mode, offer: o,
            amountBack: won ? c.amount : 0,
            finalPrice: won ? 0 : (flip ? total : c.amount),
          })
        }, 1900)
      }

      renderResult(won, o, total, flip, vName) {
        var c = this.cfg()
        var body
        if (won) {
          body = '<div class="emoji">🎉</div><div class="rTitle rWin">' +
            (flip ? 'It hit — your order’s free!' : 'You won it back!') + '</div>' +
            '<p class="sub">“' + o.question + '” resolved <b>Yes</b> on ' + vName + '. ' +
            (flip ? 'We covered the whole order.' : 'We credited your full $' + FMT(c.amount) + '.') + '</p>' +
            '<div class="break"><div><span>' + (flip ? 'Order + stake' : 'Order') + '</span><span>$' + FMT(flip ? total : c.amount) + '</span></div>' +
            '<div><span>Chance win-back</span><span class="neg">−$' + FMT(flip ? total : c.amount) + '</span></div>' +
            '<div class="fin winFin"><span>You paid</span><span>$0.00</span></div></div>'
        } else {
          body = '<div class="emoji">🪙</div><div class="rTitle">So close!</div>' +
            '<p class="sub">“' + o.question + '” resolved <b>No</b> on ' + vName + '. ' +
            (flip ? 'Your order still ships.' : 'Your order still ships — no harm in the swing.') + '</p>' +
            '<div class="break"><div><span>Order</span><span>$' + FMT(c.amount) + '</span></div>' +
            (flip ? '<div><span>Chance stake</span><span>$' + FMT(o.premium) + '</span></div>' : '') +
            '<div class="fin"><span>You paid</span><span>$' + FMT(flip ? total : c.amount) + '</span></div></div>'
        }
        this.renderSheet('<div class="result">' + body +
          '<div class="foot">Powered by <b>Hedge</b> · markets via Kalshi &amp; Polymarket<br>' +
          '<span class="demoTag">Demo settlement — real routing coming</span></div>' +
          '<div class="actions"><button class="cta" style="flex:1">Done</button></div></div>')
        this.shadowRoot.querySelector('.cta').onclick = this.close.bind(this)
      }
    }
    return El
  })()

  customElements.define('chance-checkout', ChanceCheckout)
})()
