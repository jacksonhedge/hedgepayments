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

/** True if a and b share the same event slug (before `|`) or any tag (case-insensitive). */
export function correlated(a: Candidate, b: Candidate): boolean {
  if (eventOf(a) === eventOf(b)) return true;
  // Untagged candidates with different slugs are treated as uncorrelated (vacuously).
  const ta = new Set(a.tags.map(t => t.toLowerCase()));
  return b.tags.some(t => ta.has(t.toLowerCase()));
}

/** Returns true if adding `cand` to `group` keeps every pair uncorrelated. */
function compatible(group: Candidate[], cand: Candidate): boolean {
  return group.every(g => !correlated(g, cand));
}

export class SyntheticComboSource implements ComboSource {
  build(candidates: Candidate[], opts: ComboOpts): Offer[] {
    const maxLegs = Math.min(opts.maxLegs ?? 3, 3);
    const maxOffers = opts.maxOffers ?? 4;
    const minLiq = opts.minLiquidity ?? 250;
    // Combination count grows ~C(n,2)+C(n,3); cap the working set so a large
    // candidate list can never lock the event loop. The pool is a curated subset
    // anyway, so truncation degrades gracefully (never throws / blocks a sale).
    const pool = candidates
      .filter(c => c.price > 0 && c.price < 1 && c.liquidity >= minLiq)
      .slice(0, 24);

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
      .map(legs => ({ legs, price: legs.reduce((acc, l) => acc * l.price, 1) }))
      .sort((a, b) => Math.abs(a.price - opts.targetPrice) - Math.abs(b.price - opts.targetPrice))
      .slice(0, maxOffers)
      .map((c, i) => ({
        id: 'p' + i,
        kind: 'parlay' as const,
        legs: c.legs,
        price: c.price,
        display: frameOffer(opts.amount, opts.stake, c.price),
      }));
  }
}
