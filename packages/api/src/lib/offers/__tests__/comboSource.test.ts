import { SyntheticComboSource, correlated } from '../comboSource';
import { Candidate } from '../types';

const c = (marketId: string, price: number, tags: string[], liquidity = 5000): Candidate => ({
  marketId, question: 'q ' + marketId, outcome: 'Yes', venue: 'polymarket',
  price, resolves_at: null, liquidity, tags,
});

describe('correlated()', () => {
  it('treats same-event legs (same slug) as correlated', () => {
    expect(correlated(c('lakers-game|Yes', 0.5, ['nba']), c('lakers-game|No', 0.5, ['nba']))).toBe(true);
  });
  it('treats legs sharing any tag as correlated', () => {
    expect(correlated(c('a|Yes', 0.5, ['nba']), c('b|Yes', 0.5, ['nba']))).toBe(true);
  });
  it('treats unrelated legs as uncorrelated', () => {
    expect(correlated(c('a|Yes', 0.5, ['nba']), c('b|Yes', 0.5, ['crypto']))).toBe(false);
  });
});

describe('SyntheticComboSource.build', () => {
  const cands = [
    c('a|Yes', 0.25, ['nba']),
    c('b|Yes', 0.25, ['crypto']),
    c('c|Yes', 0.25, ['soccer']),
    c('d|Yes', 0.20, ['ufc']),
  ];

  it('builds uncorrelated parlays whose price is the product of legs', () => {
    const offers = new SyntheticComboSource().build(cands, { targetPrice: 0.0148, amount: 47.3, stake: 0.7, maxOffers: 4 });
    expect(offers.length).toBeGreaterThan(0);
    for (const o of offers) {
      expect(o.kind).toBe('parlay');
      expect(o.legs.length).toBeGreaterThanOrEqual(2);
      expect(o.legs.length).toBeLessThanOrEqual(3);
      const product = o.legs.reduce((acc, l) => acc * l.price, 1);
      expect(o.price).toBeCloseTo(product, 6);
    }
  });

  it('never combines correlated legs', () => {
    const correlatedSet = [c('a|Yes', 0.25, ['nba']), c('b|Yes', 0.25, ['nba']), c('c|Yes', 0.25, ['nba'])];
    const offers = new SyntheticComboSource().build(correlatedSet, { targetPrice: 0.02, amount: 50, stake: 1, maxOffers: 4 });
    expect(offers).toHaveLength(0);
  });

  it('orders by closeness to the target price and caps maxOffers', () => {
    const offers = new SyntheticComboSource().build(cands, { targetPrice: 0.0148, amount: 47.3, stake: 0.7, maxOffers: 2 });
    expect(offers.length).toBeLessThanOrEqual(2);
    const dists = offers.map(o => Math.abs(o.price - 0.0148));
    expect(dists).toEqual([...dists].sort((x, y) => x - y));
  });

  it('frames a reached free-order combo as free, an under-target combo as partial', () => {
    const offers = new SyntheticComboSource().build(cands, { targetPrice: 0.0148, amount: 47.3, stake: 0.7, maxOffers: 4 });
    for (const o of offers) {
      expect(o.display.achievesFree).toBe(o.price <= 0.0148 + 1e-9);
    }
  });
});
