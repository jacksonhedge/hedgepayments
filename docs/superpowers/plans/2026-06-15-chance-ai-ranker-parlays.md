# Chance AI offer-ranker + parlays + round-ups — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a server-side AI offer-ranker and multi-leg parlays to Chance, with round-ups as the default mechanic and combos targeted at a free order — all demo-tier, with the deterministic engine as the always-on fallback.

**Architecture:** New pure-logic modules + a `POST /api/v1/offers/rank` endpoint in `@hedge/api`. The endpoint derives the round-up stake, builds an offer pool (single-leg candidates + synthetic combos targeted at the free-order price `pFree`), asks a per-merchant LLM provider to rank it (Anthropic or OpenAI SDK, behind a `RankProvider` interface), and merges the ranking — dropping any IDs the LLM invents and falling back to deterministic order on error/timeout. The embeddable drop-in (`packages/link`) calls it in round-up mode and falls back to local order on failure.

**Tech Stack:** TypeScript, Express, Supabase (`@supabase/supabase-js`), Joi, Jest + supertest (`@hedge/api`); Preact + Vitest (`packages/link`); `@anthropic-ai/sdk`, `openai`.

**Spec:** `docs/superpowers/specs/2026-06-15-chance-ai-ranker-parlays-design.md`

**Conventions:**
- API tests run with Jest: `cd packages/api && npx jest <path>`. Link tests run with Vitest: `cd packages/link && npx vitest run <path>`.
- All `git` commands run from the repo root (`~/Projects/HedgePayments/website`).
- Demo-tier: responses are display/selection only — no settlement, no balance debit.

---

## File structure

```
packages/api/src/
  lib/offers/
    types.ts                 # Candidate, Offer, OfferDisplay, PurchaseContext, RankedOffer, RankInput, RankProvider
    calc.ts                  # round-up math + frameOffer (pure)
    comboSource.ts           # ComboSource interface + SyntheticComboSource + correlated()
    nativeComboSource.ts     # NativeComboSource stub (same interface)
    rankProvider.ts          # OffRankProvider, getRankProvider, mergeRanked, withTimeout, safeRank
    providers/anthropic.ts   # AnthropicRankProvider (@anthropic-ai/sdk)
    providers/openai.ts      # OpenAIRankProvider (openai)
    __tests__/               # calc, comboSource, nativeComboSource, rankProvider, providers tests
  services/merchantSettings.ts          # getChanceSettings (Supabase)
  services/__tests__/merchantSettings.test.ts
  routes/offers.ts                       # POST /rank
  routes/__tests__/offers.test.ts
  index.ts                               # MODIFY: mount offersRouter
supabase/migrations/007_chance_engine_settings.sql
packages/link/src/app/flows/chance/
  offersClient.ts                        # requestOffers() with local fallback
  offersClient.test.ts
  Chance.tsx                             # MODIFY: default round-up + call requestOffers
ROADMAP.md                               # MODIFY: note the engine capability
```

---

## Task 1: Offer types + round-up / framing math

**Files:**
- Create: `packages/api/src/lib/offers/types.ts`
- Create: `packages/api/src/lib/offers/calc.ts`
- Test: `packages/api/src/lib/offers/__tests__/calc.test.ts`

- [ ] **Step 1: Create the types module**

Create `packages/api/src/lib/offers/types.ts`:

```ts
export type Venue = 'polymarket' | 'kalshi';
export type ChanceMode = 'round_up' | 'flip-to-free' | 'win-it-back';

export interface Candidate {
  marketId: string;          // "slug|outcome"
  question: string;
  outcome: string;
  venue: Venue;
  price: number;             // 0 < price < 1
  resolves_at: string | null;
  liquidity: number;
  tags: string[];
}

export interface OfferDisplay {
  chancePct: number;
  odds: string;              // e.g. "12:1"
  framedDiscountPct: number; // capped at 100 (never "more than free")
  achievesFree: boolean;
  payToday: number;          // amount + stake (flip-to-free)
  winPayout: number;         // stake / price, rounded
}

export interface Offer {
  id: string;                // 's0'/'p0'... assigned at pool build
  kind: 'single' | 'parlay';
  legs: Candidate[];         // 1 leg for single, 2-3 for parlay
  price: number;             // single: leg price; parlay: product of leg prices
  display: OfferDisplay;
}

export interface PurchaseContext {
  amount: number;
  productTitle?: string;
  category?: string;
  mode: ChanceMode;
}

export interface RankedOffer { offerId: string; rank: number; reason?: string }

export interface RankInput { context: PurchaseContext; offers: Offer[]; max: number }

export interface RankProvider { rank(input: RankInput): Promise<RankedOffer[]> }
```

- [ ] **Step 2: Write the failing test**

Create `packages/api/src/lib/offers/__tests__/calc.test.ts`:

```ts
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
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `cd packages/api && npx jest src/lib/offers/__tests__/calc.test.ts`
Expected: FAIL — `Cannot find module '../calc'`.

- [ ] **Step 4: Implement `calc.ts`**

Create `packages/api/src/lib/offers/calc.ts`:

```ts
import { OfferDisplay } from './types';

export const round2 = (n: number): number => Math.round(n * 100) / 100;
export const clamp = (n: number, lo: number, hi: number): number => Math.max(lo, Math.min(hi, n));

export function oddsLabel(p: number): string {
  if (p <= 0 || p >= 1) return '—';
  const x = (1 - p) / p;
  return (x >= 10 ? Math.round(x) : x.toFixed(1)) + ':1';
}

/** Stake = round-up change to the next whole dollar; a whole amount stakes a full $1. */
export function roundUpStake(amount: number): number {
  const stake = Math.ceil(amount) - amount;
  return stake < 0.005 ? 1 : round2(stake);
}

/** Combined price at which a win on `stake` exactly covers `amount` (free order). */
export function pFree(amount: number, stake: number): number {
  return stake / amount;
}

/** Honest display framing for an offer priced at `price`, staking the round-up `stake`. */
export function frameOffer(amount: number, stake: number, price: number): OfferDisplay {
  const p = clamp(price, 0.0001, 0.9999);
  const winPayout = round2(stake / p);
  const coverage = Math.min(winPayout, amount);          // cap at free
  return {
    chancePct: Math.round(p * 100),
    odds: oddsLabel(p),
    framedDiscountPct: Math.round((coverage / amount) * 100),
    achievesFree: winPayout >= amount - 1e-9,
    payToday: round2(amount + stake),
    winPayout,
  };
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `cd packages/api && npx jest src/lib/offers/__tests__/calc.test.ts`
Expected: PASS (all assertions).

- [ ] **Step 6: Commit**

```bash
git add packages/api/src/lib/offers/types.ts packages/api/src/lib/offers/calc.ts packages/api/src/lib/offers/__tests__/calc.test.ts
git commit -m "feat(chance): offer types + round-up/free-order framing math"
```

---

## Task 2: SyntheticComboSource (parlays targeted at the free-order price)

**Files:**
- Create: `packages/api/src/lib/offers/comboSource.ts`
- Test: `packages/api/src/lib/offers/__tests__/comboSource.test.ts`

- [ ] **Step 1: Write the failing test**

Create `packages/api/src/lib/offers/__tests__/comboSource.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd packages/api && npx jest src/lib/offers/__tests__/comboSource.test.ts`
Expected: FAIL — `Cannot find module '../comboSource'`.

- [ ] **Step 3: Implement `comboSource.ts`**

Create `packages/api/src/lib/offers/comboSource.ts`:

```ts
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
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd packages/api && npx jest src/lib/offers/__tests__/comboSource.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/api/src/lib/offers/comboSource.ts packages/api/src/lib/offers/__tests__/comboSource.test.ts
git commit -m "feat(chance): synthetic combo source targeting the free-order price"
```

---

## Task 3: NativeComboSource stub (Polymarket-combo drop-in)

**Files:**
- Create: `packages/api/src/lib/offers/nativeComboSource.ts`
- Test: `packages/api/src/lib/offers/__tests__/nativeComboSource.test.ts`

- [ ] **Step 1: Write the failing test**

Create `packages/api/src/lib/offers/__tests__/nativeComboSource.test.ts`:

```ts
import { NativeComboSource } from '../nativeComboSource';

describe('NativeComboSource (stub)', () => {
  it('returns no offers until the Polymarket combo API is wired', () => {
    const offers = new NativeComboSource().build([], { targetPrice: 0.02, amount: 50, stake: 1 });
    expect(offers).toEqual([]);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd packages/api && npx jest src/lib/offers/__tests__/nativeComboSource.test.ts`
Expected: FAIL — `Cannot find module '../nativeComboSource'`.

- [ ] **Step 3: Implement `nativeComboSource.ts`**

Create `packages/api/src/lib/offers/nativeComboSource.ts`:

```ts
import { Candidate, Offer } from './types';
import { ComboSource, ComboOpts } from './comboSource';

/**
 * Drop-in for when Polymarket exposes a public combo/CAOC API.
 * Same interface as SyntheticComboSource; until the endpoint exists, returns no offers.
 */
export class NativeComboSource implements ComboSource {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  build(_candidates: Candidate[], _opts: ComboOpts): Offer[] {
    // TODO: fetch Polymarket combo contracts, map to Offer[] with kind 'parlay'.
    return [];
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd packages/api && npx jest src/lib/offers/__tests__/nativeComboSource.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/api/src/lib/offers/nativeComboSource.ts packages/api/src/lib/offers/__tests__/nativeComboSource.test.ts
git commit -m "feat(chance): native Polymarket combo source stub"
```

---

## Task 4: Rank merge, off provider, factory, timeout/safe-rank

**Files:**
- Create: `packages/api/src/lib/offers/rankProvider.ts`
- Test: `packages/api/src/lib/offers/__tests__/rankProvider.test.ts`

- [ ] **Step 1: Write the failing test**

Create `packages/api/src/lib/offers/__tests__/rankProvider.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd packages/api && npx jest src/lib/offers/__tests__/rankProvider.test.ts`
Expected: FAIL — `Cannot find module '../rankProvider'`.

- [ ] **Step 3: Implement `rankProvider.ts`**

Create `packages/api/src/lib/offers/rankProvider.ts`:

```ts
import { Offer, RankedOffer, RankProvider, RankInput } from './types';

/** Pure merge: order known offers by rank, drop invented ids, append the rest, trim to max. */
export function mergeRanked(pool: Offer[], ranked: RankedOffer[], max: number): Offer[] {
  const byId = new Map(pool.map(o => [o.id, o]));
  const seen = new Set<string>();
  const ordered: Offer[] = [];
  for (const r of [...ranked].sort((a, b) => a.rank - b.rank)) {
    const o = byId.get(r.offerId);
    if (o && !seen.has(o.id)) { ordered.push(o); seen.add(o.id); }
  }
  for (const o of pool) if (!seen.has(o.id)) ordered.push(o);
  return ordered.slice(0, max);
}

/** Provider used when AI is off — no LLM call; deterministic order results from an empty ranking. */
export class OffRankProvider implements RankProvider {
  async rank(_input: RankInput): Promise<RankedOffer[]> {
    return [];
  }
}

export function getRankProvider(provider: 'anthropic' | 'openai' | 'off', model?: string): RankProvider {
  if (provider === 'anthropic') {
    // Lazy require so the SDK isn't loaded unless used.
    const { AnthropicRankProvider } = require('./providers/anthropic');
    return new AnthropicRankProvider(model);
  }
  if (provider === 'openai') {
    const { OpenAIRankProvider } = require('./providers/openai');
    return new OpenAIRankProvider(model);
  }
  return new OffRankProvider();
}

export function withTimeout<T>(p: Promise<T>, ms: number, fallback: T): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeout = new Promise<T>(resolve => { timer = setTimeout(() => resolve(fallback), ms); });
  return Promise.race([p, timeout]).finally(() => clearTimeout(timer));
}

/** Run a provider with hard error + timeout guards; both degrade to deterministic order. */
export async function safeRank(provider: RankProvider, input: RankInput, ms: number): Promise<RankedOffer[]> {
  const call = provider.rank(input).catch(() => [] as RankedOffer[]);
  return withTimeout(call, ms, []);
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd packages/api && npx jest src/lib/offers/__tests__/rankProvider.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/api/src/lib/offers/rankProvider.ts packages/api/src/lib/offers/__tests__/rankProvider.test.ts
git commit -m "feat(chance): rank merge, off provider, factory, safe-rank timeout"
```

---

## Task 5: AnthropicRankProvider (Claude)

**Files:**
- Modify: `packages/api/package.json` (add `@anthropic-ai/sdk`)
- Create: `packages/api/src/lib/offers/providers/anthropic.ts`
- Test: `packages/api/src/lib/offers/__tests__/anthropicProvider.test.ts`

- [ ] **Step 1: Add the dependency**

Run: `cd packages/api && npm install @anthropic-ai/sdk`
Expected: `@anthropic-ai/sdk` added to `dependencies`.

- [ ] **Step 2: Write the failing test (inject a fake client — no network)**

Create `packages/api/src/lib/offers/__tests__/anthropicProvider.test.ts`:

```ts
import { AnthropicRankProvider } from '../providers/anthropic';
import { Offer } from '../types';

const offer = (id: string): Offer => ({
  id, kind: 'single', legs: [{ marketId: id + '|Yes', question: 'Q ' + id, outcome: 'Yes', venue: 'polymarket', price: 0.25, resolves_at: null, liquidity: 5000, tags: ['nba'] }],
  price: 0.25, display: { chancePct: 25, odds: '3.0:1', framedDiscountPct: 8, achievesFree: false, payToday: 51, winPayout: 4 },
});

describe('AnthropicRankProvider', () => {
  it('returns the parsed ranking and sends offer ids + context to the model', async () => {
    const calls: any[] = [];
    const fakeClient = {
      messages: {
        parse: async (req: any) => {
          calls.push(req);
          return { parsed_output: { ranked: [{ offerId: 's1', rank: 0 }, { offerId: 's0', rank: 1 }] } };
        },
      },
    };
    const provider = new AnthropicRankProvider('claude-haiku-4-5', fakeClient as any);
    const out = await provider.rank({
      context: { amount: 50, mode: 'round_up', productTitle: 'Running shoes', category: 'footwear' },
      offers: [offer('s0'), offer('s1')], max: 6,
    });

    expect(out).toEqual([{ offerId: 's1', rank: 0 }, { offerId: 's0', rank: 1 }]);
    expect(calls[0].model).toBe('claude-haiku-4-5');
    const prompt = JSON.stringify(calls[0].messages);
    expect(prompt).toContain('s0');
    expect(prompt).toContain('s1');
    expect(prompt).toContain('Running shoes');
  });

  it('returns [] when the model yields no parsed output', async () => {
    const fakeClient = { messages: { parse: async () => ({ parsed_output: null }) } };
    const provider = new AnthropicRankProvider('claude-haiku-4-5', fakeClient as any);
    const out = await provider.rank({ context: { amount: 50, mode: 'round_up' }, offers: [offer('s0')], max: 6 });
    expect(out).toEqual([]);
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `cd packages/api && npx jest src/lib/offers/__tests__/anthropicProvider.test.ts`
Expected: FAIL — `Cannot find module '../providers/anthropic'`.

- [ ] **Step 4: Implement `providers/anthropic.ts`**

Create `packages/api/src/lib/offers/providers/anthropic.ts`:

```ts
import Anthropic from '@anthropic-ai/sdk';
import { RankProvider, RankInput, RankedOffer, Offer, PurchaseContext } from '../types';

const RANK_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    ranked: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          offerId: { type: 'string' },
          rank: { type: 'integer' },
          reason: { type: 'string' },
        },
        required: ['offerId', 'rank'],
      },
    },
  },
  required: ['ranked'],
};

const SYSTEM =
  'You curate prediction-market offers for a shopper at checkout. Rank the given offers for ' +
  'relevance to what they are buying and appeal/likelihood to play. Return only offerIds from the ' +
  'list — never invent an id. rank 0 is shown first.';

function userPrompt(context: PurchaseContext, offers: Offer[], max: number): string {
  const slim = offers.map(o => ({
    id: o.id, kind: o.kind, odds: o.display.odds, framedDiscountPct: o.display.framedDiscountPct,
    achievesFree: o.display.achievesFree, questions: o.legs.map(l => l.question), tags: o.legs.flatMap(l => l.tags),
  }));
  return [
    `Purchase: ${context.productTitle ?? 'unknown item'} (category: ${context.category ?? 'unknown'}), amount $${context.amount}.`,
    `Return up to ${max} offers, best first.`,
    `Offers: ${JSON.stringify(slim)}`,
  ].join('\n');
}

export class AnthropicRankProvider implements RankProvider {
  private client: Anthropic;
  constructor(private model: string = 'claude-haiku-4-5', client?: Anthropic) {
    this.client = client ?? new Anthropic();
  }

  async rank({ context, offers, max }: RankInput): Promise<RankedOffer[]> {
    const msg: any = await this.client.messages.parse({
      model: this.model,
      max_tokens: 1024,
      system: SYSTEM,
      messages: [{ role: 'user', content: userPrompt(context, offers, max) }],
      output_config: { format: { type: 'json_schema', schema: RANK_SCHEMA } },
    });
    return (msg.parsed_output?.ranked ?? []) as RankedOffer[];
  }
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `cd packages/api && npx jest src/lib/offers/__tests__/anthropicProvider.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add packages/api/package.json packages/api/package-lock.json packages/api/src/lib/offers/providers/anthropic.ts packages/api/src/lib/offers/__tests__/anthropicProvider.test.ts
git commit -m "feat(chance): Anthropic (Claude) rank provider"
```

---

## Task 6: OpenAIRankProvider (ChatGPT)

**Files:**
- Modify: `packages/api/package.json` (add `openai`)
- Create: `packages/api/src/lib/offers/providers/openai.ts`
- Test: `packages/api/src/lib/offers/__tests__/openaiProvider.test.ts`

- [ ] **Step 1: Add the dependency**

Run: `cd packages/api && npm install openai`
Expected: `openai` added to `dependencies`.

- [ ] **Step 2: Write the failing test (inject a fake client)**

Create `packages/api/src/lib/offers/__tests__/openaiProvider.test.ts`:

```ts
import { OpenAIRankProvider } from '../providers/openai';
import { Offer } from '../types';

const offer = (id: string): Offer => ({
  id, kind: 'single', legs: [{ marketId: id + '|Yes', question: 'Q ' + id, outcome: 'Yes', venue: 'polymarket', price: 0.25, resolves_at: null, liquidity: 5000, tags: ['nba'] }],
  price: 0.25, display: { chancePct: 25, odds: '3.0:1', framedDiscountPct: 8, achievesFree: false, payToday: 51, winPayout: 4 },
});

describe('OpenAIRankProvider', () => {
  it('parses the JSON content into a ranking', async () => {
    const fakeClient = {
      chat: { completions: { create: async () => ({ choices: [{ message: { content: JSON.stringify({ ranked: [{ offerId: 's0', rank: 0 }] }) } }] }) } },
    };
    const provider = new OpenAIRankProvider('gpt-4o-mini', fakeClient as any);
    const out = await provider.rank({ context: { amount: 50, mode: 'round_up' }, offers: [offer('s0')], max: 6 });
    expect(out).toEqual([{ offerId: 's0', rank: 0 }]);
  });

  it('returns [] on unparseable content', async () => {
    const fakeClient = { chat: { completions: { create: async () => ({ choices: [{ message: { content: 'not json' } }] }) } } };
    const provider = new OpenAIRankProvider('gpt-4o-mini', fakeClient as any);
    const out = await provider.rank({ context: { amount: 50, mode: 'round_up' }, offers: [offer('s0')], max: 6 });
    expect(out).toEqual([]);
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `cd packages/api && npx jest src/lib/offers/__tests__/openaiProvider.test.ts`
Expected: FAIL — `Cannot find module '../providers/openai'`.

- [ ] **Step 4: Implement `providers/openai.ts`**

Create `packages/api/src/lib/offers/providers/openai.ts`:

```ts
import OpenAI from 'openai';
import { RankProvider, RankInput, RankedOffer, Offer, PurchaseContext } from '../types';

const SYSTEM =
  'You curate prediction-market offers for a shopper at checkout. Rank the given offers for ' +
  'relevance to what they are buying and appeal/likelihood to play. Use only offerIds from the list — ' +
  'never invent an id. Respond as JSON {"ranked":[{"offerId","rank","reason"}]}; rank 0 is shown first.';

function userPrompt(context: PurchaseContext, offers: Offer[], max: number): string {
  const slim = offers.map(o => ({
    id: o.id, kind: o.kind, odds: o.display.odds, framedDiscountPct: o.display.framedDiscountPct,
    achievesFree: o.display.achievesFree, questions: o.legs.map(l => l.question), tags: o.legs.flatMap(l => l.tags),
  }));
  return [
    `Purchase: ${context.productTitle ?? 'unknown item'} (category: ${context.category ?? 'unknown'}), amount $${context.amount}.`,
    `Return up to ${max} offers, best first.`,
    `Offers: ${JSON.stringify(slim)}`,
  ].join('\n');
}

export class OpenAIRankProvider implements RankProvider {
  private client: OpenAI;
  constructor(private model: string = 'gpt-4o-mini', client?: OpenAI) {
    this.client = client ?? new OpenAI();
  }

  async rank({ context, offers, max }: RankInput): Promise<RankedOffer[]> {
    const res: any = await this.client.chat.completions.create({
      model: this.model,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM },
        { role: 'user', content: userPrompt(context, offers, max) },
      ],
    });
    try {
      const parsed = JSON.parse(res.choices?.[0]?.message?.content ?? '{}');
      return Array.isArray(parsed.ranked) ? (parsed.ranked as RankedOffer[]) : [];
    } catch {
      return [];
    }
  }
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `cd packages/api && npx jest src/lib/offers/__tests__/openaiProvider.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add packages/api/package.json packages/api/package-lock.json packages/api/src/lib/offers/providers/openai.ts packages/api/src/lib/offers/__tests__/openaiProvider.test.ts
git commit -m "feat(chance): OpenAI (ChatGPT) rank provider"
```

---

## Task 7: Merchant Chance settings (migration + service)

**Files:**
- Create: `supabase/migrations/007_chance_engine_settings.sql`
- Create: `packages/api/src/services/merchantSettings.ts`
- Test: `packages/api/src/services/__tests__/merchantSettings.test.ts`

- [ ] **Step 1: Write the migration**

Create `supabase/migrations/007_chance_engine_settings.sql`:

```sql
-- 007 — Per-merchant Chance engine settings: AI offer-ranker provider + parlays toggle.
-- Dedicated table (more Chance knobs are expected); one row per business account.
CREATE TABLE IF NOT EXISTS business_chance_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_account_id UUID NOT NULL REFERENCES business_accounts(id) ON DELETE CASCADE,
  ai_provider TEXT NOT NULL DEFAULT 'off' CHECK (ai_provider IN ('anthropic', 'openai', 'off')),
  ai_model TEXT,
  parlays_enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (business_account_id)
);

CREATE INDEX IF NOT EXISTS idx_business_chance_settings_account
  ON business_chance_settings(business_account_id);
```

- [ ] **Step 2: Write the failing service test (mock Supabase)**

Create `packages/api/src/services/__tests__/merchantSettings.test.ts`:

```ts
const single = jest.fn();
jest.mock('../../lib/supabase', () => ({
  supabase: { from: () => ({ select: () => ({ eq: () => ({ single }) }) }) },
}));

import { getChanceSettings } from '../merchantSettings';

describe('getChanceSettings', () => {
  beforeEach(() => single.mockReset());

  it('returns defaults (off, no parlays) when no row exists', async () => {
    single.mockResolvedValue({ data: null, error: { message: 'no rows' } });
    const s = await getChanceSettings('biz-1');
    expect(s).toEqual({ aiProvider: 'off', aiModel: null, parlaysEnabled: false });
  });

  it('maps a stored row to ChanceSettings', async () => {
    single.mockResolvedValue({ data: { ai_provider: 'anthropic', ai_model: 'claude-haiku-4-5', parlays_enabled: true }, error: null });
    const s = await getChanceSettings('biz-1');
    expect(s).toEqual({ aiProvider: 'anthropic', aiModel: 'claude-haiku-4-5', parlaysEnabled: true });
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `cd packages/api && npx jest src/services/__tests__/merchantSettings.test.ts`
Expected: FAIL — `Cannot find module '../merchantSettings'`.

- [ ] **Step 4: Implement `merchantSettings.ts`**

Create `packages/api/src/services/merchantSettings.ts`:

```ts
import { supabase } from '../lib/supabase';

export interface ChanceSettings {
  aiProvider: 'anthropic' | 'openai' | 'off';
  aiModel: string | null;
  parlaysEnabled: boolean;
}

const DEFAULTS: ChanceSettings = { aiProvider: 'off', aiModel: null, parlaysEnabled: false };

export async function getChanceSettings(businessAccountId: string): Promise<ChanceSettings> {
  const { data, error } = await supabase
    .from('business_chance_settings')
    .select('ai_provider, ai_model, parlays_enabled')
    .eq('business_account_id', businessAccountId)
    .single();
  if (error || !data) return DEFAULTS;
  return {
    aiProvider: data.ai_provider,
    aiModel: data.ai_model ?? null,
    parlaysEnabled: !!data.parlays_enabled,
  };
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `cd packages/api && npx jest src/services/__tests__/merchantSettings.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add supabase/migrations/007_chance_engine_settings.sql packages/api/src/services/merchantSettings.ts packages/api/src/services/__tests__/merchantSettings.test.ts
git commit -m "feat(chance): business_chance_settings migration + settings service"
```

> **Note for the operator:** apply `007` to the target Supabase before the endpoint is used with real merchants. Until applied, `getChanceSettings` returns the safe defaults (`off`, no parlays) — existing merchants behave exactly as today.

---

## Task 8: `POST /api/v1/offers/rank` endpoint

**Files:**
- Create: `packages/api/src/routes/offers.ts`
- Modify: `packages/api/src/index.ts` (mount the router)
- Test: `packages/api/src/routes/__tests__/offers.test.ts`

- [ ] **Step 1: Write the failing test (mock settings + provider factory)**

Create `packages/api/src/routes/__tests__/offers.test.ts`:

```ts
import request from 'supertest';
import express from 'express';

const getChanceSettings = jest.fn();
jest.mock('../../services/merchantSettings', () => ({ getChanceSettings: (...a: any[]) => getChanceSettings(...a) }));

const getRankProvider = jest.fn();
jest.mock('../../lib/offers/rankProvider', () => {
  const actual = jest.requireActual('../../lib/offers/rankProvider');
  return { ...actual, getRankProvider: (...a: any[]) => getRankProvider(...a) };
});

import { offersRouter } from '../offers';

const app = express();
app.use(express.json());
app.use('/api/v1/offers', offersRouter);

const cand = (slug: string, price: number, tags: string[]) => ({
  marketId: slug + '|Yes', question: 'Q ' + slug, outcome: 'Yes', venue: 'polymarket',
  price, resolves_at: null, liquidity: 5000, tags,
});

describe('POST /api/v1/offers/rank', () => {
  beforeEach(() => { getChanceSettings.mockReset(); getRankProvider.mockReset(); });

  it('400s without an amount', async () => {
    const res = await request(app).post('/api/v1/offers/rank').send({ merchantId: 'biz-1', context: {}, candidates: [] });
    expect(res.status).toBe(400);
  });

  it('returns deterministic single offers when AI is off, marked demo', async () => {
    getChanceSettings.mockResolvedValue({ aiProvider: 'off', aiModel: null, parlaysEnabled: false });
    getRankProvider.mockReturnValue({ rank: async () => [] });
    const res = await request(app).post('/api/v1/offers/rank').send({
      merchantId: 'biz-1', context: { amount: 47.3, mode: 'round_up' },
      candidates: [cand('a', 0.25, ['nba']), cand('b', 0.25, ['crypto'])],
    });
    expect(res.status).toBe(200);
    expect(res.body.demo).toBe(true);
    expect(res.body.ranked).toBe(false);
    expect(res.body.offers.map((o: any) => o.id)).toEqual(['s0', 's1']);
    expect(res.body.stake).toBeCloseTo(0.7, 5);
  });

  it('adds parlays when enabled', async () => {
    getChanceSettings.mockResolvedValue({ aiProvider: 'off', aiModel: null, parlaysEnabled: true });
    getRankProvider.mockReturnValue({ rank: async () => [] });
    const res = await request(app).post('/api/v1/offers/rank').send({
      merchantId: 'biz-1', context: { amount: 47.3, mode: 'round_up' },
      candidates: [cand('a', 0.25, ['nba']), cand('b', 0.25, ['crypto']), cand('c', 0.25, ['soccer'])],
    });
    expect(res.body.offers.some((o: any) => o.kind === 'parlay')).toBe(true);
  });

  it('applies the provider ranking and drops invented ids', async () => {
    getChanceSettings.mockResolvedValue({ aiProvider: 'anthropic', aiModel: null, parlaysEnabled: false });
    getRankProvider.mockReturnValue({ rank: async () => [{ offerId: 's1', rank: 0 }, { offerId: 'GHOST', rank: 1 }] });
    const res = await request(app).post('/api/v1/offers/rank').send({
      merchantId: 'biz-1', context: { amount: 47.3, mode: 'round_up' },
      candidates: [cand('a', 0.25, ['nba']), cand('b', 0.25, ['crypto'])],
    });
    expect(res.body.ranked).toBe(true);
    expect(res.body.offers[0].id).toBe('s1');
    expect(res.body.offers.map((o: any) => o.id)).not.toContain('GHOST');
  });

  it('falls back to deterministic order when the provider throws', async () => {
    getChanceSettings.mockResolvedValue({ aiProvider: 'anthropic', aiModel: null, parlaysEnabled: false });
    getRankProvider.mockReturnValue({ rank: async () => { throw new Error('boom'); } });
    const res = await request(app).post('/api/v1/offers/rank').send({
      merchantId: 'biz-1', context: { amount: 47.3, mode: 'round_up' },
      candidates: [cand('a', 0.25, ['nba'])],
    });
    expect(res.status).toBe(200);
    expect(res.body.ranked).toBe(false);
    expect(res.body.offers[0].id).toBe('s0');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd packages/api && npx jest src/routes/__tests__/offers.test.ts`
Expected: FAIL — `Cannot find module '../offers'`.

- [ ] **Step 3: Implement `routes/offers.ts`**

Create `packages/api/src/routes/offers.ts`:

```ts
import { Router, Request, Response } from 'express';
import Joi from 'joi';
import { logger } from '../utils/logger';
import { getChanceSettings } from '../services/merchantSettings';
import { roundUpStake, pFree, frameOffer } from '../lib/offers/calc';
import { SyntheticComboSource } from '../lib/offers/comboSource';
import { getRankProvider, safeRank, mergeRanked } from '../lib/offers/rankProvider';
import { Candidate, Offer } from '../lib/offers/types';

export const offersRouter = Router();

const RANK_MS = 1500;
const MAX_OFFERS = 6;

const candidateSchema = Joi.object({
  marketId: Joi.string().required(),
  question: Joi.string().allow('').required(),
  outcome: Joi.string().allow('').required(),
  venue: Joi.string().valid('polymarket', 'kalshi').required(),
  price: Joi.number().greater(0).less(1).required(),
  resolves_at: Joi.string().allow(null),
  liquidity: Joi.number().min(0).required(),
  tags: Joi.array().items(Joi.string()).default([]),
}).unknown(true); // the drop-in Candidate carries extra fields (winProbPct, seed) — allow them through

const bodySchema = Joi.object({
  merchantId: Joi.string().required(),
  context: Joi.object({
    amount: Joi.number().positive().required(),
    productTitle: Joi.string().allow('').optional(),
    category: Joi.string().allow('').optional(),
    mode: Joi.string().valid('round_up', 'flip-to-free', 'win-it-back').default('round_up'),
  }).required(),
  candidates: Joi.array().items(candidateSchema).default([]),
});

function buildSingles(cands: Candidate[], amount: number, stake: number): Offer[] {
  return cands.map((c, i) => ({
    id: 's' + i, kind: 'single', legs: [c], price: c.price, display: frameOffer(amount, stake, c.price),
  }));
}

offersRouter.post('/rank', async (req: Request, res: Response) => {
  const { value, error } = bodySchema.validate(req.body || {});
  if (error) return res.status(400).json({ error: error.message });

  const { merchantId, context, candidates } = value;
  const amount: number = context.amount;
  const stake = roundUpStake(amount);
  const target = pFree(amount, stake);

  let settings;
  try {
    settings = await getChanceSettings(merchantId);
  } catch (e: any) {
    logger.error('chance settings load failed', { e: e?.message });
    settings = { aiProvider: 'off' as const, aiModel: null, parlaysEnabled: false };
  }

  const pool: Offer[] = buildSingles(candidates as Candidate[], amount, stake);
  if (settings.parlaysEnabled) {
    const combos = new SyntheticComboSource().build(candidates as Candidate[], {
      targetPrice: target, amount, stake, maxOffers: 4,
    });
    pool.push(...combos);
  }

  const provider = getRankProvider(settings.aiProvider, settings.aiModel || undefined);
  const ranked = await safeRank(provider, { context, offers: pool, max: MAX_OFFERS }, RANK_MS);
  const offers = mergeRanked(pool, ranked, MAX_OFFERS);

  res.json({ offers, ranked: ranked.length > 0, mode: context.mode, stake, demo: true });
});
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd packages/api && npx jest src/routes/__tests__/offers.test.ts`
Expected: PASS.

- [ ] **Step 5: Mount the router in `index.ts`**

In `packages/api/src/index.ts`, add the import next to the other route imports (after line 11 `import { linkRouter } from './routes/link';`):

```ts
import { offersRouter } from './routes/offers';
```

And add the mount next to the other `app.use('/api/v1/...')` lines (after line 39 `app.use('/api/v1/link', linkRouter);`):

```ts
app.use('/api/v1/offers', offersRouter);
```

- [ ] **Step 6: Run the full API suite to confirm nothing regressed**

Run: `cd packages/api && npx jest`
Expected: PASS (all suites, including existing chance/link/marketing tests).

- [ ] **Step 7: Commit**

```bash
git add packages/api/src/routes/offers.ts packages/api/src/routes/__tests__/offers.test.ts packages/api/src/index.ts
git commit -m "feat(chance): POST /offers/rank endpoint (round-up pool + AI rank + fallback)"
```

---

## Task 9: Drop-in client helper with local fallback

**Files:**
- Create: `packages/link/src/app/flows/chance/offersClient.ts`
- Test: `packages/link/src/app/flows/chance/offersClient.test.ts`

- [ ] **Step 1: Write the failing test (inject a fake fetch — Vitest)**

Create `packages/link/src/app/flows/chance/offersClient.test.ts`:

```ts
import { describe, it, expect, vi } from 'vitest';
import { requestOffers } from './offersClient';
import type { Candidate } from './engine';

const cand = (id: string, price: number): Candidate => ({
  marketId: id + '|Yes', question: 'Q ' + id, outcome: 'Yes', venue: 'polymarket',
  price, winProbPct: Math.round(price * 100), resolves_at: null, liquidity: 5000, tags: ['nba'],
});

describe('requestOffers', () => {
  it('returns the server offers on success and posts round-up context', async () => {
    const fetch = vi.fn(async (_url: string, init: any) => {
      const body = JSON.parse(init.body);
      expect(body.context.mode).toBe('round_up');
      return { ok: true, json: async () => ({ offers: [{ id: 's1', kind: 'single' }] }) } as any;
    });
    const out = await requestOffers('biz-1', { amount: 47.3 }, [cand('a', 0.25)], { fetch: fetch as any, apiBase: 'https://api.test' });
    expect(out.map((o: any) => o.id)).toEqual(['s1']);
  });

  it('falls back to local single offers when the request is not ok', async () => {
    const fetch = vi.fn(async () => ({ ok: false, status: 500, json: async () => ({}) }) as any);
    const out = await requestOffers('biz-1', { amount: 47.3 }, [cand('a', 0.25), cand('b', 0.2)], { fetch: fetch as any, apiBase: 'https://api.test' });
    expect(out.map((o: any) => o.id)).toEqual(['s0', 's1']);
    expect(out[0].kind).toBe('single');
  });

  it('falls back to local offers when fetch throws', async () => {
    const fetch = vi.fn(async () => { throw new Error('network'); });
    const out = await requestOffers('biz-1', { amount: 47.3 }, [cand('a', 0.25)], { fetch: fetch as any, apiBase: 'https://api.test' });
    expect(out.map((o: any) => o.id)).toEqual(['s0']);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd packages/link && npx vitest run src/app/flows/chance/offersClient.test.ts`
Expected: FAIL — cannot resolve `./offersClient`.

- [ ] **Step 3: Implement `offersClient.ts`**

Create `packages/link/src/app/flows/chance/offersClient.ts`:

```ts
import type { Candidate } from './engine';

export interface OffersDeps { fetch: typeof fetch; apiBase: string }
export interface OfferContext { amount: number; productTitle?: string; category?: string; mode?: string }

/** Local deterministic fallback: map candidates to single offers in the order given. */
function localOffers(candidates: Candidate[], max = 6) {
  return candidates.slice(0, max).map((c, i) => ({ id: 's' + i, kind: 'single', legs: [c], price: c.price }));
}

/**
 * Ask the server to rank/curate offers (round-up mode by default).
 * Any failure (non-ok, timeout, network) degrades to the local deterministic order.
 */
export async function requestOffers(
  merchantId: string,
  context: OfferContext,
  candidates: Candidate[],
  deps: OffersDeps,
  timeoutMs = 1800,
): Promise<any[]> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    let res: Response;
    try {
      res = await deps.fetch(deps.apiBase + '/api/v1/offers/rank', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ merchantId, context: { mode: 'round_up', ...context }, candidates }),
        signal: ctrl.signal,
      });
    } finally {
      clearTimeout(timer);
    }
    if (!res.ok) return localOffers(candidates);
    const data = await res.json();
    return Array.isArray(data.offers) ? data.offers : localOffers(candidates);
  } catch {
    return localOffers(candidates);
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd packages/link && npx vitest run src/app/flows/chance/offersClient.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/link/src/app/flows/chance/offersClient.ts packages/link/src/app/flows/chance/offersClient.test.ts
git commit -m "feat(chance): drop-in offers client with local deterministic fallback"
```

---

## Task 10: Wire the drop-in to round-up + ranked offers, update ROADMAP

**Files:**
- Modify: `packages/link/src/app/flows/chance/Chance.tsx`
- Modify: `ROADMAP.md`

- [ ] **Step 1: Read the current Chance flow to find the candidate→render seam**

Run: `cd packages/link && sed -n '1,80p' src/app/flows/chance/Chance.tsx`
Identify where `matchMarkets(...)` output is rendered as the offer list, the default `mode` state, and where `apiBase`/merchant id are available (config passed to the flow).

- [ ] **Step 2: Default the flow to round-up mode**

In `Chance.tsx`, set the initial mode state to round-up (replace the existing default-mode initializer):

```tsx
// before: const [mode, setMode] = useState<'flip-to-free' | 'win-it-back'>('flip-to-free')
const [mode, setMode] = useState<'round_up' | 'flip-to-free' | 'win-it-back'>('round_up')
```

(If the component currently has only the two legacy modes, widen the type as shown and keep `'round_up'` first/default.)

- [ ] **Step 3: Replace the local-only offer list with the ranked request, keeping local fallback**

At the point where candidates are resolved (after `matchMarkets`/`fetchPolymarketCandidates`), call `requestOffers` and render its result. Add the import at the top:

```tsx
import { requestOffers } from './offersClient'
```

Then, where the offer list is computed for render, replace the direct candidate mapping with an effect that fetches ranked offers and falls back locally:

```tsx
const [offers, setOffers] = useState<any[]>([])

useEffect(() => {
  let alive = true
  if (!candidates.length) { setOffers([]); return }
  requestOffers(
    merchantId,
    { amount, productTitle, category, mode: 'round_up' },
    candidates,
    { fetch: window.fetch.bind(window), apiBase: API_BASE },
  ).then(list => { if (alive) setOffers(list) })
  return () => { alive = false }
}, [candidates, amount, merchantId])
```

Use the existing names in `Chance.tsx` for `candidates`, `amount`, `merchantId`, `productTitle`, `category`, and `API_BASE`. If `merchantId`/`productTitle`/`category` are not yet threaded into the flow, pass what is available (at minimum `merchantId` and `amount`); the endpoint tolerates missing product context. Render `offers` where the candidate list was rendered before; each offer's `display` (when present from the server) carries `odds`, `framedDiscountPct`, and `achievesFree` for "free vs. $X off" framing.

- [ ] **Step 4: Run the link test suite to confirm no regressions**

Run: `cd packages/link && npx vitest run`
Expected: PASS (existing `engine.test.ts`, `Chance.test.tsx`, and `offersClient.test.ts`).

- [ ] **Step 5: Build the drop-in to confirm it compiles**

Run: `cd packages/link && npm run build`
Expected: Vite build completes without type errors.

- [ ] **Step 6: Update ROADMAP.md**

In `ROADMAP.md`, under the SHIPPED/Demo section, add a bullet recording the new capability:

```markdown
- ✅ **AI offer-ranker + parlays + round-ups (default)** — server-side `/offers/rank` (`@hedge/api`): round-up is the default mechanic (stake = round-up change → free order), synthetic parlays via `ComboSource` target the free-order price (native Polymarket-combo adapter stubbed), and a per-merchant LLM ranks offers (Claude/ChatGPT/off, platform-held keys). Deterministic engine is the always-on fallback. Demo-tier (no settlement). Spec/plan: `docs/superpowers/specs/2026-06-15-chance-ai-ranker-parlays-design.md`.
```

- [ ] **Step 7: Commit**

```bash
git add packages/link/src/app/flows/chance/Chance.tsx ROADMAP.md
git commit -m "feat(chance): drop-in defaults to round-up + ranked offers; roadmap"
```

---

## Self-review notes (spec coverage)

- **Round-ups default** → Task 1 (stake/`pFree`), Task 8 (endpoint derives stake), Task 10 (drop-in default mode).
- **Combos target free-order price + honest framing** → Task 1 (`frameOffer` cap/achievesFree), Task 2 (target-price ordering + framing assertions).
- **Native-ready** → Task 3 (`NativeComboSource` stub, same interface).
- **AI ranker, per-merchant provider, security invariant (drop invented ids)** → Tasks 4–6 (providers + `mergeRanked` drop), Task 7 (settings), Task 8 (wiring + drop-test).
- **Deterministic fallback (error/timeout)** → Task 4 (`safeRank`), Task 8 (fallback test), Task 9 (client local fallback).
- **Demo-safety** → Task 8 (`demo: true`, no settlement fields).
- **Platform-held keys** → Tasks 5/6 (SDK clients read env; no per-merchant key storage).
