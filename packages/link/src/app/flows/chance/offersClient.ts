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
