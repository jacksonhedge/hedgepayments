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
