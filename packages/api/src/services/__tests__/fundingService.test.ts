jest.mock('../../lib/stripe', () => ({
  stripe: { checkout: { sessions: { create: jest.fn() } }, webhooks: { constructEvent: jest.fn() } },
}));
jest.mock('../../lib/supabase', () => ({ supabase: { from: jest.fn(), rpc: jest.fn() } }));
jest.mock('../walletStore');
import { stripe } from '../../lib/stripe';
import * as walletStore from '../walletStore';
import { startFunding, handleWebhookEvent } from '../fundingService';

const s = stripe as any;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('fundingService.startFunding', () => {
  it('creates a $25 Checkout session (2500 cents) and records it', async () => {
    s.checkout.sessions.create.mockResolvedValue({ id: 'cs_1', url: 'https://stripe/cs_1' });
    (walletStore.createFundingSession as jest.Mock).mockResolvedValue(undefined);
    const res = await startFunding({ walletId: 'w1', amount: 25, currency: 'USD' });
    expect(s.checkout.sessions.create).toHaveBeenCalledWith(expect.objectContaining({
      mode: 'payment', client_reference_id: 'w1',
    }));
    const arg = s.checkout.sessions.create.mock.calls[0][0];
    expect(arg.line_items[0].price_data.unit_amount).toBe(2500);
    expect(res).toEqual({ checkoutUrl: 'https://stripe/cs_1', sessionId: 'cs_1' });
    expect(walletStore.createFundingSession).toHaveBeenCalledWith(
      expect.objectContaining({ walletId: 'w1', amountCents: 2500, stripeSessionId: 'cs_1' }));
  });
});

describe('fundingService.handleWebhookEvent', () => {
  it('credits the wallet on checkout.session.completed', async () => {
    (walletStore.creditWallet as jest.Mock).mockResolvedValue({ balanceCents: 2500, credited: true });
    (walletStore.completeFundingSession as jest.Mock).mockResolvedValue(undefined);
    await handleWebhookEvent({
      type: 'checkout.session.completed',
      data: { object: { id: 'cs_1', amount_total: 2500, currency: 'usd', metadata: { walletId: 'w1' } } },
    } as any);
    expect(walletStore.creditWallet).toHaveBeenCalledWith({
      walletId: 'w1', amountCents: 2500, currency: 'USD', externalId: 'cs_1',
    });
  });

  it('ignores unrelated event types', async () => {
    await handleWebhookEvent({ type: 'payment_intent.created', data: { object: {} } } as any);
    expect(walletStore.creditWallet).not.toHaveBeenCalled();
  });
});
