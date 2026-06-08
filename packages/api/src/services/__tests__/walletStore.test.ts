jest.mock('../../lib/supabase', () => ({ supabase: { from: jest.fn(), rpc: jest.fn() } }));
import { supabase } from '../../lib/supabase';
import { creditWallet, getWallet } from '../walletStore';

const mocked = supabase as unknown as { from: jest.Mock; rpc: jest.Mock };

describe('walletStore.creditWallet', () => {
  it('calls credit_wallet RPC and maps the result', async () => {
    mocked.rpc.mockResolvedValue({ data: [{ balance_available: 2500, credited: true }], error: null });
    const res = await creditWallet({ walletId: 'w1', amountCents: 2500, currency: 'USD', externalId: 'evt_1' });
    expect(mocked.rpc).toHaveBeenCalledWith('credit_wallet', {
      p_wallet_id: 'w1', p_amount: 2500, p_currency: 'USD', p_external_id: 'evt_1',
    });
    expect(res).toEqual({ balanceCents: 2500, credited: true });
  });
});

describe('walletStore.getWallet', () => {
  it('returns null when not found', async () => {
    const single = jest.fn().mockResolvedValue({ data: null, error: null });
    mocked.from.mockReturnValue({ select: () => ({ eq: () => ({ single }) }) });
    expect(await getWallet('missing')).toBeNull();
  });
});
