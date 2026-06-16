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

  it('rejects more than 50 candidates', async () => {
    const many = Array.from({ length: 51 }, (_, i) => cand('m' + i, 0.25, ['nba']));
    const res = await request(app).post('/api/v1/offers/rank').send({
      merchantId: 'biz-1', context: { amount: 47.3, mode: 'round_up' }, candidates: many,
    });
    expect(res.status).toBe(400);
  });

  it('returns an empty pool sanely when there are no candidates', async () => {
    getChanceSettings.mockResolvedValue({ aiProvider: 'off', aiModel: null, parlaysEnabled: false });
    getRankProvider.mockReturnValue({ rank: async () => [] });
    const res = await request(app).post('/api/v1/offers/rank').send({
      merchantId: 'biz-1', context: { amount: 47.3, mode: 'round_up' }, candidates: [],
    });
    expect(res.status).toBe(200);
    expect(res.body.offers).toEqual([]);
    expect(res.body.ranked).toBe(false);
    expect(res.body.demo).toBe(true);
  });

  it('still returns 200 with deterministic offers when settings load fails', async () => {
    getChanceSettings.mockRejectedValue(new Error('db down'));
    getRankProvider.mockReturnValue({ rank: async () => [] });
    const res = await request(app).post('/api/v1/offers/rank').send({
      merchantId: 'biz-1', context: { amount: 47.3, mode: 'round_up' }, candidates: [cand('a', 0.25, ['nba'])],
    });
    expect(res.status).toBe(200);
    expect(res.body.ranked).toBe(false);
    expect(res.body.offers[0].id).toBe('s0');
  });
});
