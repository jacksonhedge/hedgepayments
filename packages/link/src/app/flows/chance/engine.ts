export interface Candidate {
  marketId: string
  question: string
  outcome: string
  venue: 'polymarket' | 'kalshi'
  price: number
  winProbPct: number
  resolves_at: string | null
  liquidity: number
  tags: string[]
  seed?: boolean
}

export interface Eligibility {
  eligible: boolean
  venue: 'kalshi' | 'polymarket' | null
  reason: string
}

const US_BLOCKED: Record<string, 1> = { WA: 1, ID: 1, NV: 1, MI: 1, AZ: 1, LA: 1, CT: 1, TN: 1 }
const INTL_BLOCKED: Record<string, 1> = { CU: 1, IR: 1, KP: 1, SY: 1, RU: 1 }
export const BAND = 0.075
const SHOW_CAP = 12
const GAMMA = 'https://gamma-api.polymarket.com'
const POLY_TAGS = ['nba', 'nfl', 'mlb', 'nhl', 'soccer', 'ufc', 'tennis', 'crypto']
const BLOCK_TAGS = ['politics', 'elections', 'politician']

const SEED_DATA: Array<[string, string, number, number, string[]]> = [
  ['p-lal', 'Lakers to beat the Celtics tonight?', 0.48, 5, ['sports']],
  ['p-ars', 'Arsenal to win their match this weekend?', 0.40, 40, ['sports']],
  ['p-eth', 'Will Ethereum flip $4,000 this week?', 0.31, 55, ['crypto']],
  ['p-btc', 'Will Bitcoin top $125k in June?', 0.20, 60, ['crypto']],
  ['p-sol', 'Will Solana flip $250 this month?', 0.13, 66, ['crypto']],
  ['p-spx', 'Will SpaceX launch Starship this week?', 0.09, 70, ['space']],
]

export function round2(n: number): number { return Math.round(n * 100) / 100 }
export function clamp(n: number, lo: number, hi: number): number { return Math.max(lo, Math.min(hi, n)) }

export function oddsLabel(p: number): string {
  if (p <= 0 || p >= 1) return '—'
  const x = (1 - p) / p
  return (x >= 10 ? Math.round(x) : x.toFixed(1)) + ':1'
}

export function resolveEligibility(country?: string, region?: string): Eligibility {
  const c = (country || 'US').toUpperCase()
  const r = (region || '').toUpperCase()
  if (c === 'US') {
    if (US_BLOCKED[r]) return { eligible: false, venue: null, reason: 'state-restricted' }
    return { eligible: true, venue: 'kalshi', reason: 'ok' }
  }
  if (INTL_BLOCKED[c]) return { eligible: false, venue: null, reason: 'country-restricted' }
  return { eligible: true, venue: 'polymarket', reason: 'ok' }
}

export function matchMarkets(candidates: Candidate[], risk: number, win: number): Candidate[] {
  const p = clamp(risk / win, 0.01, 0.97)
  return candidates
    .filter(c => Math.abs(c.price - p) <= BAND)
    .sort((a, b) => Math.abs(a.price - p) - Math.abs(b.price - p) || b.liquidity - a.liquidity)
    .slice(0, SHOW_CAP)
}

export function bounds(amount: number) {
  return {
    riskMin: 1,
    riskMax: Math.max(5, Math.round(amount * 0.6)),
    winMin:  Math.max(2, Math.round(amount * 0.15)),
    winMax:  amount,
  }
}

export function calc(
  amount: number,
  risk: number,
  win: number,
  mode: 'flip-to-free' | 'win-it-back',
) {
  const p = clamp(risk / win, 0.01, 0.97)
  return {
    p,
    chancePct:   Math.round(p * 100),
    odds:        oddsLabel(p),
    discountPct: Math.round((win / amount) * 100),
    payToday:    mode === 'flip-to-free' ? round2(amount + risk) : amount,
  }
}

export function buildSeedCandidates(now: number): Candidate[] {
  return SEED_DATA.map(([marketId, question, price, hours, tags]) => ({
    marketId,
    question,
    outcome: 'Yes',
    venue: 'polymarket' as const,
    price,
    winProbPct: Math.round(price * 100),
    resolves_at: new Date(now + hours * 3600000).toISOString(),
    liquidity: 5000,
    tags,
    seed: true,
  })).sort((a, b) => b.price - a.price)
}

export function fmtExpiry(iso: string | null): string {
  if (!iso) return ''
  const ms = Date.parse(iso) - Date.now()
  if (!(ms > 0)) return 'ending soon'
  const h = ms / 3600000
  if (h < 1)    return 'ends in <1h'
  if (h < 24)   return 'ends in ' + Math.round(h) + 'h'
  const d = new Date(iso)
  if (h < 24 * 7) return 'ends ' + d.toLocaleDateString(undefined, { weekday: 'short' })
  return 'ends ' + d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function parseArr(s: string | null): string[] | null {
  if (!s) return null
  try { const v = JSON.parse(s); return Array.isArray(v) ? v.map(String) : null } catch { return null }
}

export async function fetchPolymarketCandidates(now: number): Promise<Candidate[]> {
  const out: Candidate[] = []
  const seen: Record<string, 1> = {}
  await Promise.all(POLY_TAGS.map(async tag => {
    try {
      const r = await fetch(GAMMA + '/events?closed=false&active=true&limit=40&tag_slug=' + tag, {
        headers: { accept: 'application/json' },
      })
      if (!r.ok) return
      const events: any[] = (await r.json()) || []
      for (const ev of events) {
        const evTags: string[] = (ev.tags || []).map((t: any) => (t.slug || '').toLowerCase())
        if (BLOCK_TAGS.some(b => evTags.includes(b))) continue
        for (const m of (ev.markets || [])) {
          if (m.closed || m.archived) continue
          const id = m.conditionId || m.id || m.slug
          if (!id || seen[id]) continue
          const names = parseArr(m.outcomes), prices = parseArr(m.outcomePrices)
          if (!names || !prices || names.length !== prices.length) continue
          const liq = m.liquidityNum != null ? m.liquidityNum : (m.liquidity ? Number(m.liquidity) : null)
          const rIso: string | null = m.endDate || null
          const rIn = rIso ? (Date.parse(rIso) - now) / 3600000 : null
          if (liq == null || liq < 250) continue
          if (rIn == null || rIn < 1 || rIn > 24 * 21) continue
          seen[id] = 1
          names.forEach((name, i) => {
            const price = Number(prices![i])
            if (!(price > 0 && price < 1)) return
            out.push({
              marketId: (m.slug || id) + '|' + name,
              question: m.question || ev.title || '',
              outcome: name,
              venue: 'polymarket',
              price,
              winProbPct: Math.round(price * 100),
              resolves_at: rIso,
              liquidity: liq!,
              tags: evTags,
            })
          })
        }
      }
    } catch { /* tag failed — skip */ }
  }))
  return out.sort((a, b) => b.price - a.price)
}
