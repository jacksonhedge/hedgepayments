import { Offer, RankedOffer, RankProvider, RankInput } from './types';

/** Pure merge: order known offers by rank, drop invented ids, append the rest, trim to max. */
export function mergeRanked(pool: Offer[], ranked: RankedOffer[], max: number): Offer[] {
  const byId = new Map(pool.map(o => [o.id, o]));
  const seen = new Set<string>();
  const ordered: Offer[] = [];
  // Contract: ranks are unique and non-negative; ties fall back to pool order (stable sort).
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
  // Providers are lazy-required so their SDKs aren't loaded unless actually selected.
  if (provider === 'anthropic') {
    const { AnthropicRankProvider } = require('./providers/anthropic');
    return new AnthropicRankProvider(model) as RankProvider;
  }
  if (provider === 'openai') {
    const { OpenAIRankProvider } = require('./providers/openai');
    return new OpenAIRankProvider(model) as RankProvider;
  }
  return new OffRankProvider();
}

export function withTimeout<T>(p: Promise<T>, ms: number, fallback: T): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<T>(resolve => { timer = setTimeout(() => resolve(fallback), ms); });
  // Degrade both a slow promise (timeout) and a rejected one to the fallback.
  return Promise.race([p.catch(() => fallback), timeout]).finally(() => {
    if (timer !== undefined) clearTimeout(timer);
  });
}

/** Run a provider with hard error + timeout guards; both degrade to deterministic order. */
export async function safeRank(provider: RankProvider, input: RankInput, ms: number): Promise<RankedOffer[]> {
  const call = provider.rank(input).catch(() => [] as RankedOffer[]);
  return withTimeout(call, ms, []);
}
