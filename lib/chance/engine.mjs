// Chance odds-selection engine — DEV-ONLY reference + tests (not shipped).
//
// This mirrors the logic embedded in public/embed/chance.js so the math can be
// verified with plain `node lib/chance/engine.mjs` (no test-runner dependency).
// Ported from sneakers-trading/apps/platform/src/lib/chance/engine.ts.
//
// Mechanic: a shopper's stake buys a YES position on a REAL market at price `p`
// (= implied probability). A win pays stake/p. Sized "make whole" so a win
// covers the full purchase. The two product modes differ only in WHO pre-pays:
//   - flip-to-free : shopper pays itemPrice + premium; win -> $0 (risks premium)
//   - win-it-back  : shopper pays itemPrice; house fronts the stake; win -> full
//                    amount credited back (shopper has zero downside)

// --- risk-$ <-> likelihood ---
export function premiumToProb(premium, itemPrice) {
  return premium / (itemPrice + premium)
}
export function probToPremium(targetProb, itemPrice) {
  return (targetProb * itemPrice) / (1 - targetProb)
}
/** Implied prob -> "X:1" payout label (0.091 -> "10:1"). */
export function oddsLabel(prob) {
  if (prob <= 0 || prob >= 1) return '—'
  const x = (1 - prob) / prob
  return `${x >= 10 ? Math.round(x) : x.toFixed(1)}:1`
}

const DEFAULTS = {
  resolveWithinHours: 72,
  resolveMinHours: 1,
  minLiquidity: 250,
  priceTolerance: 0.06,
  mustMakeWhole: true,
  blockTags: ['politics', 'elections', 'politician'],
}

const round2 = (n) => Math.round(n * 100) / 100

function toCandidates(snaps, now) {
  const out = []
  for (const s of snaps) {
    if (s.phase === 'closed') continue
    const resolvesAt = s.resolves_at ?? null
    const resolvesInHours = resolvesAt ? (Date.parse(resolvesAt) - now) / 3_600_000 : null
    for (const o of s.outcomes) {
      const price = o.best_ask
      if (price == null || price <= 0 || price >= 1) continue
      out.push({
        marketId: s.platform_market_id,
        question: s.question,
        outcome: o.name,
        price,
        resolvesAt,
        resolvesInHours,
        liquidity: s.liquidity ?? null,
        tags: s.tags ?? [],
      })
    }
  }
  return out
}

function passes(c, f) {
  if (f.minLiquidity != null && (c.liquidity ?? 0) < f.minLiquidity) return false
  if (c.resolvesInHours == null) return false
  if (c.resolvesInHours > f.resolveWithinHours) return false
  if (c.resolvesInHours < f.resolveMinHours) return false
  const tags = c.tags.map((t) => t.toLowerCase())
  if (f.blockTags?.some((b) => tags.includes(b.toLowerCase()))) return false
  return true
}

/**
 * Build the pre-selected list of Chance offers. Each tier (risk amount OR target
 * likelihood) is matched to the best real outcome near its implied price. Tiers
 * with no match return { available:false } (never silently dropped).
 */
export function findChanceOffers({ itemPrice, tiers, snapshots, filters, now }) {
  const f = { ...DEFAULTS, ...(filters ?? {}) }
  now = now ?? Date.now()

  const candidates = toCandidates(snapshots, now).filter((c) => passes(c, f))
  const used = new Set()
  const offers = []

  for (const tier of tiers) {
    const targetProb = tier.targetProb ?? premiumToProb(tier.premium, itemPrice)
    const premium = round2(tier.premium ?? probToPremium(tier.targetProb, itemPrice))

    const pick = candidates
      .filter((c) => !used.has(`${c.marketId}|${c.outcome}`))
      .filter((c) => Math.abs(c.price - targetProb) <= f.priceTolerance)
      .filter((c) => (f.mustMakeWhole ? c.price <= targetProb : true))
      .sort(
        (a, b) =>
          Math.abs(a.price - targetProb) - Math.abs(b.price - targetProb) ||
          (a.resolvesInHours ?? Infinity) - (b.resolvesInHours ?? Infinity) ||
          (b.liquidity ?? 0) - (a.liquidity ?? 0),
      )[0]

    if (!pick) {
      offers.push({ available: false, premium, targetProb, oddsLabel: oddsLabel(targetProb), itemPrice })
      continue
    }

    used.add(`${pick.marketId}|${pick.outcome}`)
    // make-whole position: a win returns the full item price (shopper pays $0 / gets itemPrice back)
    const makeWholePremium = round2(probToPremium(pick.price, itemPrice)) // flip-to-free cost
    const houseStake = round2(pick.price * itemPrice) // win-it-back: stake the house fronts
    offers.push({
      available: true,
      premium: makeWholePremium,
      targetProb,
      price: pick.price,
      winProbPct: Math.round(pick.price * 100),
      oddsLabel: oddsLabel(pick.price),
      itemPrice,
      marketId: pick.marketId,
      question: pick.question,
      outcome: pick.outcome,
      payout: round2(itemPrice + makeWholePremium), // gross payout on win (flip-to-free)
      houseStake,
      resolvesInHours: pick.resolvesInHours == null ? null : Math.round(pick.resolvesInHours),
      liquidity: pick.liquidity,
      venue: pick.venue ?? null,
    })
  }

  return offers
}

/** A spread of target likelihoods → a varied grid of real-market cards. */
export const SPREAD_TIERS = [0.5, 0.4, 0.3, 0.22, 0.15, 0.09].map((targetProb) => ({ targetProb }))

// ----------------------------------------------------------------------------
// Inline tests — run: node lib/chance/engine.mjs
// ----------------------------------------------------------------------------
function nearly(a, b, eps = 1e-6) {
  return Math.abs(a - b) <= eps
}
function run() {
  let pass = 0
  const fail = []
  const ok = (name, cond) => (cond ? pass++ : fail.push(name))

  // math round-trips
  ok('premiumToProb basic', nearly(premiumToProb(25, 75), 0.25))
  ok('probToPremium basic', nearly(probToPremium(0.25, 75), 25))
  ok('round-trip prob->premium->prob', nearly(premiumToProb(probToPremium(0.3, 80), 80), 0.3))
  ok('oddsLabel 10:1', oddsLabel(0.0909) === '10:1')
  ok('oddsLabel 1.0:1', oddsLabel(0.5) === '1.0:1')
  ok('oddsLabel guard', oddsLabel(0) === '—' && oddsLabel(1) === '—')

  const NOW = Date.parse('2026-06-04T12:00:00Z')
  const at = (h) => new Date(NOW + h * 3_600_000).toISOString()
  const snaps = [
    { platform_market_id: 'm-fav', question: 'Favorite hits?', phase: 'open', resolves_at: at(20), liquidity: 5000, tags: ['sports'], outcomes: [{ name: 'Yes', best_ask: 0.5 }] },
    { platform_market_id: 'm-long', question: 'Longshot hits?', phase: 'open', resolves_at: at(30), liquidity: 5000, tags: ['crypto'], outcomes: [{ name: 'Yes', best_ask: 0.1 }] },
    { platform_market_id: 'm-illiquid', question: 'Thin market?', phase: 'open', resolves_at: at(10), liquidity: 50, tags: [], outcomes: [{ name: 'Yes', best_ask: 0.3 }] },
    { platform_market_id: 'm-politics', question: 'Election thing?', phase: 'open', resolves_at: at(10), liquidity: 9000, tags: ['politics'], outcomes: [{ name: 'Yes', best_ask: 0.4 }] },
    { platform_market_id: 'm-closed', question: 'Already closed?', phase: 'closed', resolves_at: at(10), liquidity: 9000, tags: [], outcomes: [{ name: 'Yes', best_ask: 0.3 }] },
    { platform_market_id: 'm-toosoon', question: 'Resolves now?', phase: 'open', resolves_at: at(0.2), liquidity: 9000, tags: [], outcomes: [{ name: 'Yes', best_ask: 0.22 }] },
  ]
  const itemPrice = 80
  const offers = findChanceOffers({ itemPrice, tiers: SPREAD_TIERS, snapshots: snaps, now: NOW })

  const fav = offers.find((o) => o.marketId === 'm-fav')
  ok('favorite matched at p=0.5', fav?.available === true && nearly(fav.price, 0.5))
  ok('flip-to-free premium = make-whole', fav && nearly(fav.premium, round2(probToPremium(0.5, 80)))) // 80
  ok('make-whole: win pays full payout', fav && nearly(fav.payout, round2(itemPrice + fav.premium)))
  ok('win-it-back house stake = p*itemPrice', fav && nearly(fav.houseStake, round2(0.5 * 80))) // 40
  ok('winProbPct from real price', fav?.winProbPct === 50)

  const long = offers.find((o) => o.marketId === 'm-long')
  ok('longshot matched at p≈0.1', long?.available === true && nearly(long.price, 0.1))
  ok('longshot cheaper premium than favorite', long && fav && long.premium < fav.premium)

  ok('illiquid market filtered out', !offers.some((o) => o.marketId === 'm-illiquid'))
  ok('politics tag blocked', !offers.some((o) => o.marketId === 'm-politics'))
  ok('closed phase excluded', !offers.some((o) => o.marketId === 'm-closed'))
  ok('too-soon market excluded', !offers.some((o) => o.marketId === 'm-toosoon'))
  ok('no market reuse', new Set(offers.filter((o) => o.available).map((o) => o.marketId)).size === offers.filter((o) => o.available).length)
  ok('unmatched tier -> available:false (not dropped)', offers.length === SPREAD_TIERS.length)

  console.log(`\nChance engine: ${pass} passed, ${fail.length} failed`)
  if (fail.length) {
    console.log('FAILED:\n  - ' + fail.join('\n  - '))
    process.exit(1)
  }
  console.log('All assertions green ✓\n')
}

if (import.meta.url === `file://${process.argv[1]}`) run()
