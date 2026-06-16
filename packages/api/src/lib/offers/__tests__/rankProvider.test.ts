import { mergeRanked, OffRankProvider, getRankProvider, safeRank, withTimeout } from '../rankProvider';
import { Offer, RankProvider, RankInput, RankedOffer } from '../types';

const offer = (id: string): Offer => ({
  id, kind: 'single', legs: [], price: 0.25,
  display: { chancePct: 25, odds: '3.0:1', framedDiscountPct: 8, achievesFree: false, payToday: 51, winPayout: 4 },
});

describe('mergeRanked', () => {
  const pool = [offer('s0'), offer('s1'), offer('s2')];

  it('orders by rank for known ids', () => {
    const out = mergeRanked(pool, [{ offerId: 's2', rank: 0 }, { offerId: 's0', rank: 1 }], 6);
    expect(out.map(o => o.id)).toEqual(['s2', 's0', 's1']); // s1 unmentioned -> appended
  });

  it('drops ids the model invented', () => {
    const out = mergeRanked(pool, [{ offerId: 'GHOST', rank: 0 }, { offerId: 's1', rank: 1 }], 6);
    expect(out.map(o => o.id)).toEqual(['s1', 's0', 's2']);
  });

  it('caps at max', () => {
    const out = mergeRanked(pool, [], 2);
    expect(out).toHaveLength(2);
  });
});

describe('OffRankProvider', () => {
  it('returns an empty ranking (deterministic order downstream)', async () => {
    const out = await new OffRankProvider().rank({ context: { amount: 50, mode: 'round_up' }, offers: [offer('s0')], max: 6 });
    expect(out).toEqual([]);
  });
});

describe('getRankProvider', () => {
  it('returns the off provider for "off"', () => {
    expect(getRankProvider('off')).toBeInstanceOf(OffRankProvider);
  });
});

describe('safeRank', () => {
  it('falls back to [] when the provider throws', async () => {
    const throwing: RankProvider = { rank: () => Promise.reject(new Error('boom')) };
    const out = await safeRank(throwing, { context: { amount: 50, mode: 'round_up' }, offers: [], max: 6 }, 1000);
    expect(out).toEqual([]);
  });

  it('falls back to [] when the provider exceeds the timeout', async () => {
    const slow: RankProvider = { rank: () => new Promise<RankedOffer[]>(r => setTimeout(() => r([{ offerId: 's0', rank: 0 }]), 50)) };
    const out = await safeRank(slow, { context: { amount: 50, mode: 'round_up' }, offers: [], max: 6 }, 5);
    expect(out).toEqual([]);
  });
});

describe('withTimeout', () => {
  it('resolves the fallback on timeout', async () => {
    const out = await withTimeout(new Promise<number>(r => setTimeout(() => r(1), 50)), 5, 99);
    expect(out).toBe(99);
  });
});
