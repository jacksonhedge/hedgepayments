import { roundUpStake, pFree, frameOffer, oddsLabel, round2, clamp } from '../calc';

describe('round-up math', () => {
  it('stakes the change up to the next whole dollar', () => {
    expect(roundUpStake(47.30)).toBeCloseTo(0.70, 5);
  });

  it('stakes a full $1 when the amount is already whole', () => {
    expect(roundUpStake(47)).toBe(1);
  });

  it('derives the free-order target price as stake/amount', () => {
    expect(pFree(47.30, 0.70)).toBeCloseTo(0.0148, 4);
  });
});

describe('frameOffer (honest framing)', () => {
  it('marks an offer free only when a win covers the whole order', () => {
    // price == pFree exactly -> winPayout == amount -> free
    const d = frameOffer(50, 1, 0.02); // stake 1, price 0.02 -> payout 50
    expect(d.achievesFree).toBe(true);
    expect(d.framedDiscountPct).toBe(100);
  });

  it('frames an under-target single as a partial discount, never free', () => {
    const d = frameOffer(50, 1, 0.25); // payout 4 -> 8% of order
    expect(d.achievesFree).toBe(false);
    expect(d.framedDiscountPct).toBe(8);
  });

  it('caps an overshoot at a free order (no more-than-free)', () => {
    const d = frameOffer(50, 1, 0.005); // payout 200 -> capped to 100%
    expect(d.framedDiscountPct).toBe(100);
    expect(d.achievesFree).toBe(true);
  });

  it('payToday is amount + stake', () => {
    expect(frameOffer(50, 1, 0.25).payToday).toBe(51);
  });
});

describe('helpers', () => {
  it('formats odds', () => {
    expect(oddsLabel(0.5)).toBe('1.0:1');
    expect(round2(1.005)).toBe(1.01);
    expect(clamp(5, 0, 1)).toBe(1);
  });
});
