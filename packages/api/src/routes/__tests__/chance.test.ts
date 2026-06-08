jest.mock('../../lib/supabase', () => ({ supabase: {} }));
jest.mock('../../services/walletStore');
jest.mock('../../services/fundingService');
jest.mock('../../lib/stripe', () => ({ stripe: { webhooks: { constructEvent: jest.fn() } } }));
import express from 'express';
import request from 'supertest';
import * as walletStore from '../../services/walletStore';
import * as fundingService from '../../services/fundingService';
import { stripe } from '../../lib/stripe';
import { chanceRouter } from '../chance';
import { chanceWebhook } from '../chanceWebhook';

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

function webhookApp() {
  const a = express();
  a.post('/webhook', express.raw({ type: 'application/json' }), chanceWebhook);
  return a;
}

describe('chance webhook', () => {
  it('400s on bad signature', async () => {
    (stripe.webhooks.constructEvent as jest.Mock).mockImplementation(() => { throw new Error('bad sig'); });
    const res = await request(webhookApp()).post('/webhook').set('stripe-signature', 'x').send(Buffer.from('{}'));
    expect(res.status).toBe(400);
  });

  it('200s and dispatches on valid event', async () => {
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue({ type: 'checkout.session.completed', data: { object: { id: 'cs_1', amount_total: 2500, currency: 'usd', metadata: { walletId: 'w1' } } } });
    (fundingService.handleWebhookEvent as jest.Mock).mockResolvedValue(undefined);
    const res = await request(webhookApp()).post('/webhook').set('stripe-signature', 'x').send(Buffer.from('{}'));
    expect(res.status).toBe(200);
    expect(fundingService.handleWebhookEvent).toHaveBeenCalled();
  });
});
