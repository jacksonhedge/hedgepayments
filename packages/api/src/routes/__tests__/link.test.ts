jest.mock('../../lib/supabase', () => ({ supabase: {} }));
jest.mock('../../services/linkStore');
jest.mock('../../config', () => ({ config: { hedge: { linkKey: 'test-key' } } }));
import express from 'express';
import request from 'supertest';
import * as linkStore from '../../services/linkStore';
import { linkRouter } from '../link';

function app() { const a = express(); a.use(express.json()); a.use('/api/v1/link', linkRouter); return a; }

describe('link router', () => {
  beforeEach(() => jest.clearAllMocks());

  it('POST /sessions rejects a wrong X-Hedge-Key', async () => {
    const res = await request(app()).post('/api/v1/link/sessions').set('x-hedge-key', 'nope').send({ product: 'chance' });
    expect(res.status).toBe(401);
  });
  it('POST /sessions rejects a missing product', async () => {
    const res = await request(app()).post('/api/v1/link/sessions').set('x-hedge-key', 'test-key').send({});
    expect(res.status).toBe(400);
  });
  it('POST /sessions mints a token', async () => {
    (linkStore.createSession as jest.Mock).mockResolvedValue({ token: 'lt_1', expiresAt: '2030-01-01T00:00:00Z' });
    const res = await request(app()).post('/api/v1/link/sessions').set('x-hedge-key', 'test-key').send({ product: 'chance', config: { amount: 85 } });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ link_token: 'lt_1', expires_at: '2030-01-01T00:00:00Z' });
  });
  it('POST /sessions/:token/exchange returns config on success', async () => {
    (linkStore.exchange as jest.Mock).mockResolvedValue({ product: 'chance', config: { amount: 85 }, env: 'sandbox' });
    const res = await request(app()).post('/api/v1/link/sessions/lt_1/exchange').send();
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ product: 'chance', config: { amount: 85 }, env: 'sandbox' });
  });
  it('POST /sessions/:token/exchange 410s on an invalid token', async () => {
    (linkStore.exchange as jest.Mock).mockResolvedValue(null);
    const res = await request(app()).post('/api/v1/link/sessions/bad/exchange').send();
    expect(res.status).toBe(410);
    expect(res.body.error_code).toBe('INVALID_LINK_TOKEN');
  });

  it('POST /sessions/:token/consume returns 200 { ok: true } on success', async () => {
    (linkStore.consumeOnSuccess as jest.Mock).mockResolvedValue({ id: 'uuid-1' });
    const res = await request(app())
      .post('/api/v1/link/sessions/lt_1/consume')
      .send({ result: { won: true } });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
    expect(linkStore.consumeOnSuccess).toHaveBeenCalledWith('lt_1', { won: true });
  });

  it('POST /sessions/:token/consume returns 409 when already consumed', async () => {
    (linkStore.consumeOnSuccess as jest.Mock).mockResolvedValue(null);
    (linkStore.selectStatus as jest.Mock).mockResolvedValue('consumed');
    const res = await request(app())
      .post('/api/v1/link/sessions/lt_1/consume')
      .send({ result: { won: false } });
    expect(res.status).toBe(409);
    expect(res.body.error_code).toBe('ALREADY_CONSUMED');
  });

  it('POST /sessions/:token/consume returns 410 when token invalid/expired', async () => {
    (linkStore.consumeOnSuccess as jest.Mock).mockResolvedValue(null);
    (linkStore.selectStatus as jest.Mock).mockResolvedValue(null);
    const res = await request(app())
      .post('/api/v1/link/sessions/lt_bad/consume')
      .send({ result: { won: false } });
    expect(res.status).toBe(410);
    expect(res.body.error_code).toBe('INVALID_LINK_TOKEN');
  });
});
