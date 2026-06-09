jest.mock('../../lib/supabase', () => ({ supabase: { from: jest.fn() } }));
import { supabase } from '../../lib/supabase';
import { createSession, exchange, consumeOnSuccess } from '../linkStore';

const mocked = supabase as unknown as { from: jest.Mock };

describe('linkStore.createSession', () => {
  it('inserts a pending session and returns a token + expiry', async () => {
    const insert = jest.fn().mockResolvedValue({ error: null });
    mocked.from.mockReturnValue({ insert });
    const res = await createSession({ product: 'chance', config: { amount: 85 } });
    expect(res.token).toMatch(/^lt_/);
    expect(new Date(res.expiresAt).getTime()).toBeGreaterThan(Date.now());
    const row = insert.mock.calls[0][0][0];
    expect(row.product).toBe('chance');
    expect(row.status).toBe('pending');
    expect(row.token).toBe(res.token);
  });
});

describe('linkStore.exchange', () => {
  function selectReturning(data: any) {
    return { select: () => ({ eq: () => ({ single: () => Promise.resolve({ data, error: data ? null : { message: 'no rows' } }) }) }) };
  }
  it('returns config for a valid pending session and marks it opened', async () => {
    const update = jest.fn().mockReturnValue({ eq: jest.fn().mockResolvedValue({ error: null }) });
    const future = new Date(Date.now() + 60000).toISOString();
    mocked.from
      .mockReturnValueOnce(selectReturning({ id: '1', product: 'chance', config: { amount: 85 }, env: 'sandbox', status: 'pending', expires_at: future }))
      .mockReturnValueOnce({ update });
    const res = await exchange('lt_x');
    expect(res).toEqual({ product: 'chance', config: { amount: 85 }, env: 'sandbox' });
    expect(update).toHaveBeenCalledWith(expect.objectContaining({ status: 'opened' }));
  });
  it('returns null for an expired session', async () => {
    const past = new Date(Date.now() - 60000).toISOString();
    mocked.from.mockReturnValueOnce(selectReturning({ id: '1', product: 'chance', config: {}, env: 'sandbox', status: 'pending', expires_at: past }));
    expect(await exchange('lt_x')).toBeNull();
  });
  it('returns null for a consumed session', async () => {
    const future = new Date(Date.now() + 60000).toISOString();
    mocked.from.mockReturnValueOnce(selectReturning({ id: '1', product: 'chance', config: {}, env: 'sandbox', status: 'consumed', expires_at: future }));
    expect(await exchange('lt_x')).toBeNull();
  });
  it('returns null for an unknown token', async () => {
    mocked.from.mockReturnValueOnce(selectReturning(null));
    expect(await exchange('nope')).toBeNull();
  });
});

describe('linkStore.consumeOnSuccess', () => {
  function updateReturning(data: any) {
    const single = jest.fn().mockResolvedValue({ data, error: data ? null : { message: 'no rows' } });
    const select = jest.fn().mockReturnValue({ single });
    const neq = jest.fn().mockReturnValue({ select });
    const eq = jest.fn().mockReturnValue({ neq });
    const update = jest.fn().mockReturnValue({ eq });
    return { update, eq, neq, select, single };
  }

  it('returns { id } on a successful first consume', async () => {
    const chain = updateReturning({ id: 'uuid-1' });
    mocked.from.mockReturnValue(chain);
    const result = await consumeOnSuccess('lt_x', { won: true });
    expect(result).toEqual({ id: 'uuid-1' });
    expect(chain.neq).toHaveBeenCalledWith('status', 'consumed');
  });

  it('returns null when 0 rows updated (already consumed)', async () => {
    const chain = updateReturning(null);
    mocked.from.mockReturnValue(chain);
    const result = await consumeOnSuccess('lt_x', { won: false });
    expect(result).toBeNull();
  });

  it('returns null for an unknown token', async () => {
    const chain = updateReturning(null);
    mocked.from.mockReturnValue(chain);
    const result = await consumeOnSuccess('lt_unknown', { won: true });
    expect(result).toBeNull();
  });
});
