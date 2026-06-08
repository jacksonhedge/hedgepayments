jest.mock('../../lib/supabase', () => ({ supabase: {} }));
jest.mock('../../services/walletStore');
jest.mock('../../services/fundingService');
import express from 'express';
import request from 'supertest';
import * as walletStore from '../../services/walletStore';
import * as fundingService from '../../services/fundingService';
import { chanceRouter } from '../chance';

function app() { const a = express(); a.use(express.json()); a.use('/api/v1/chance', chanceRouter); return a; }

describe('chance router', () => {
  beforeEach(() => jest.clearAllMocks());

  it('POST /wallet creates a wallet', async () => {
    (walletStore.createWallet as jest.Mock).mockResolvedValue({ id: 'w1', currency: 'USD', balanceCents: 0 });
    const res = await request(app()).post('/api/v1/chance/wallet').send({});
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ walletId: 'w1', currency: 'USD' });
  });

  it('GET /wallet/:id returns dollars + cents', async () => {
    (walletStore.getWallet as jest.Mock).mockResolvedValue({ id: 'w1', currency: 'USD', balanceCents: 4569 });
    const res = await request(app()).get('/api/v1/chance/wallet/w1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ walletId: 'w1', currency: 'USD', balanceCents: 4569, balance: 45.69 });
  });

  it('GET /wallet/:id 404s when missing', async () => {
    (walletStore.getWallet as jest.Mock).mockResolvedValue(null);
    expect((await request(app()).get('/api/v1/chance/wallet/none')).status).toBe(404);
  });

  it('POST /funding/sessions rejects non-positive amount', async () => {
    const res = await request(app()).post('/api/v1/chance/funding/sessions').send({ walletId: 'w1', amount: 0 });
    expect(res.status).toBe(400);
  });

  it('POST /funding/sessions returns the checkout url', async () => {
    (fundingService.startFunding as jest.Mock).mockResolvedValue({ checkoutUrl: 'https://stripe/cs_1', sessionId: 'cs_1' });
    const res = await request(app()).post('/api/v1/chance/funding/sessions').send({ walletId: 'w1', amount: 25 });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ checkoutUrl: 'https://stripe/cs_1', sessionId: 'cs_1' });
  });
});
