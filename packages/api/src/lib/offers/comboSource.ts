import { Candidate, Offer } from './types';
import { frameOffer } from './calc';

export interface ComboOpts {
  targetPrice: number;
  amount: number;
  stake: number;
  maxLegs?: number;       // default 3
  maxOffers?: number;     // default 4
  minLiquidity?: number;  // default 250
}

export interface ComboSource {
  build(candidates: Candidate[], opts: ComboOpts): Offer[];
}

function eventOf(c: Candidate): string {
  return c.marketId.split('|')[0];
}

export function correlated(a: Candidate, b: Candidate): boolean {
  if (eventOf(a) === eventOf(b)) return true;
  const ta = new Set(a.tags.map(t => t.toLowerCase()));
  return b.tags.some(t => ta.has(t.toLowerCase()));
}

/** Returns true if adding `cand` to `group` keeps every pair uncorrelated. */
function compatible(group: Candidate[], cand: Candidate): boolean {
  return group.every(g => !correlated(g, cand));
}

export class SyntheticComboSource implements ComboSource {
  build(candidates: Candidate[], opts: ComboOpts): Offer[] {
    const maxLegs = opts.maxLegs ?? 3;
    const maxOffers = opts.maxOffers ?? 4;
    const minLiq = opts.minLiquidity ?? 250;
    const pool = candidates.filter(c => c.price > 0 && c.price < 1 && c.liquidity >= minLiq);

    const combos: Candidate[][] = [];
    const recurse = (start: number, group: Candidate[]) => {
      if (group.length >= 2) combos.push([...group]);
      if (group.length === maxLegs) return;
      for (let i = start; i < pool.length; i++) {
        if (compatible(group, pool[i])) recurse(i + 1, [...group, pool[i]]);
      }
    };
    recurse(0, []);

    return combos
      .map(legs => {
        const price = legs.reduce((acc, l) => acc * l.price, 1);
        return {
          id: '', // assigned by the pool builder
          kind: 'parlay' as const,
          legs,
          price,
          display: frameOffer(opts.amount, opts.stake, price),
        };
      })
      .sort((a, b) => Math.abs(a.price - opts.targetPrice) - Math.abs(b.price - opts.targetPrice))
      .slice(0, maxOffers)
      .map((o, i) => ({ ...o, id: 'p' + i }));
  }
}
