// packages/link/src/app/flows/chance/engine.test.ts
import { describe, it, expect, vi } from 'vitest'
import {
  resolveEligibility,
  matchMarkets,
  calc,
  bounds,
  buildSeedCandidates,
  round2,
  clamp,
  oddsLabel,
  fmtExpiry,
  type Candidate,
} from './engine'

describe('resolveEligibility', () => {
  it('returns eligible=false for a blocked US state', () => {
    expect(resolveEligibility('US', 'WA')).toMatchObject({ eligible: false, reason: 'state-restricted' })
  })
  it('returns eligible=true for an allowed US state', () => {
    expect(resolveEligibility('US', 'CA')).toMatchObject({ eligible: true, venue: 'kalshi' })
  })
  it('returns eligible=false for a blocked country', () => {
    expect(resolveEligibility('RU', '')).toMatchObject({ eligible: false, reason: 'country-restricted' })
  })
  it('returns eligible=true + polymarket for an allowed non-US country', () => {
    expect(resolveEligibility('GB', '')).toMatchObject({ eligible: true, venue: 'polymarket' })
  })
  it('defaults to US-eligible when country is undefined', () => {
    expect(resolveEligibility(undefined, 'CA')).toMatchObject({ eligible: true })
  })
})

describe('matchMarkets', () => {
  const base: Candidate = { marketId: 'm1', question: 'Q?', outcome: 'Yes', venue: 'polymarket', price: 0.5, winProbPct: 50, resolves_at: null, liquidity: 1000, tags: [] }
  const candidates: Candidate[] = [
    { ...base, marketId: 'm1', price: 0.50, liquidity: 2000 },
    { ...base, marketId: 'm2', price: 0.48, liquidity: 1000 },
    { ...base, marketId: 'm3', price: 0.90, liquidity: 5000 }, // too far from 0.5/0.5 = 1.0
    { ...base, marketId: 'm4', price: 0.05, liquidity: 9000 }, // too far
  ]

  it('only returns markets within BAND (0.075) of target odds', () => {
    // risk=5, win=10 → p=0.5; candidates at 0.50 and 0.48 are within BAND; 0.90 and 0.05 are not
    const matches = matchMarkets(candidates, 5, 10)
    expect(matches.map(m => m.marketId)).toContain('m1')
    expect(matches.map(m => m.marketId)).toContain('m2')
    expect(matches.map(m => m.marketId)).not.toContain('m3')
    expect(matches.map(m => m.marketId)).not.toContain('m4')
  })

  it('sorts by closeness to target probability, then liquidity', () => {
    const matches = matchMarkets(candidates, 5, 10)
    expect(matches[0].marketId).toBe('m1') // closer (0.50 vs 0.48)
    expect(matches[1].marketId).toBe('m2')
  })

  it('caps at 12 results', () => {
    const many: Candidate[] = Array.from({ length: 20 }, (_, i) => ({ ...base, marketId: `m${i}`, price: 0.50 + i * 0.001 }))
    expect(matchMarkets(many, 5, 10).length).toBe(12)
  })
})

describe('calc', () => {
  it('computes correct chancePct, payToday for flip-to-free', () => {
    const result = calc(100, 10, 20, 'flip-to-free')
    expect(result.chancePct).toBe(50)   // 10/20 = 0.5
    expect(result.payToday).toBe(110)   // amount + risk
    expect(result.discountPct).toBe(20) // 20/100
  })
  it('payToday = amount for win-it-back mode', () => {
    const result = calc(100, 10, 20, 'win-it-back')
    expect(result.payToday).toBe(100)
  })
})

describe('bounds', () => {
  it('riskMax = 60% of amount, winMax = amount', () => {
    const b = bounds(100)
    expect(b.riskMax).toBe(60)
    expect(b.winMax).toBe(100)
    expect(b.riskMin).toBe(1)
    expect(b.winMin).toBe(15)
  })
})

describe('buildSeedCandidates', () => {
  it('returns a non-empty sorted array with valid price range', () => {
    const now = Date.now()
    const seeds = buildSeedCandidates(now)
    expect(seeds.length).toBeGreaterThan(0)
    seeds.forEach(s => {
      expect(s.price).toBeGreaterThan(0)
      expect(s.price).toBeLessThan(1)
      expect(new Date(s.resolves_at!).getTime()).toBeGreaterThan(now)
    })
    // sorted descending by price
    for (let i = 1; i < seeds.length; i++) {
      expect(seeds[i].price).toBeLessThanOrEqual(seeds[i - 1].price)
    }
  })
})

describe('helpers', () => {
  it('round2 rounds to 2 decimal places', () => {
    expect(round2(10.006)).toBe(10.01)
    expect(round2(3.14159)).toBe(3.14)
  })
  it('clamp clamps to [lo, hi]', () => {
    expect(clamp(5, 1, 10)).toBe(5)
    expect(clamp(-1, 1, 10)).toBe(1)
    expect(clamp(20, 1, 10)).toBe(10)
  })
  it('oddsLabel formats correctly', () => {
    expect(oddsLabel(0.5)).toBe('1.0:1')
    expect(oddsLabel(0.1)).toBe('9.0:1')
  })
})
