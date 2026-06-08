jest.mock('../../lib/supabase', () => ({ supabase: {} }));
jest.mock('../../services/marketingService');
import express from 'express';
import request from 'supertest';
import * as marketing from '../../services/marketingService';
import { marketingRouter } from '../marketing';

function app() { const a = express(); a.use(express.json()); a.use('/api/v1', marketingRouter); return a; }

describe('marketing router', () => {
  beforeEach(() => jest.clearAllMocks());

  it('POST /waitlist rejects a bad email', async () => {
    const r = await request(app()).post('/api/v1/waitlist').send({ email: 'nope' });
    expect(r.status).toBe(400);
  });

  it('POST /waitlist joins (lowercased/trimmed email)', async () => {
    (marketing.joinWaitlist as jest.Mock).mockResolvedValue({ ok: true });
    const r = await request(app()).post('/api/v1/waitlist').send({ email: '  AL@B.com ', source: 'hero' });
    expect(r.status).toBe(200);
    expect(marketing.joinWaitlist).toHaveBeenCalledWith('al@b.com', 'hero');
  });

  it('POST /subscribe requires a name', async () => {
    const r = await request(app()).post('/api/v1/subscribe').send({ email: 'a@b.com' });
    expect(r.status).toBe(400);
  });

  it('POST /subscribe subscribes', async () => {
    (marketing.subscribe as jest.Mock).mockResolvedValue({ ok: true });
    const r = await request(app()).post('/api/v1/subscribe').send({ email: 'a@b.com', name: 'Al' });
    expect(r.status).toBe(200);
    expect(marketing.subscribe).toHaveBeenCalledWith('a@b.com', 'Al');
  });
});
