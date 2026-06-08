import { supabase } from '../lib/supabase';
import { config } from '../config';

export interface Wallet { id: string; currency: string; balanceCents: number; }

export async function createWallet(currency = 'USD'): Promise<Wallet> {
  const { data, error } = await supabase
    .from('wallets')
    .insert({ user_id: config.chance.anonUserId, currency, status: 'active' })
    .select('id, currency, balance_available')
    .single();
  if (error || !data) throw new Error(`createWallet failed: ${error?.message}`);
  return { id: data.id, currency: data.currency, balanceCents: data.balance_available };
}

export async function getWallet(walletId: string): Promise<Wallet | null> {
  const { data, error } = await supabase
    .from('wallets')
    .select('id, currency, balance_available')
    .eq('id', walletId)
    .single();
  if (error || !data) return null;
  return { id: data.id, currency: data.currency, balanceCents: data.balance_available };
}

export async function createFundingSession(input: {
  walletId: string; amountCents: number; currency: string; stripeSessionId: string;
}): Promise<void> {
  const { error } = await supabase.from('chance_funding_sessions').insert({
    wallet_id: input.walletId, amount: input.amountCents, currency: input.currency,
    stripe_session_id: input.stripeSessionId, status: 'pending',
  });
  if (error) throw new Error(`createFundingSession failed: ${error.message}`);
}

export async function completeFundingSession(stripeSessionId: string): Promise<void> {
  await supabase.from('chance_funding_sessions')
    .update({ status: 'completed', completed_at: new Date().toISOString() })
    .eq('stripe_session_id', stripeSessionId);
}

export async function creditWallet(input: {
  walletId: string; amountCents: number; currency: string; externalId: string;
}): Promise<{ balanceCents: number; credited: boolean }> {
  const { data, error } = await supabase.rpc('credit_wallet', {
    p_wallet_id: input.walletId, p_amount: input.amountCents,
    p_currency: input.currency, p_external_id: input.externalId,
  });
  if (error) throw new Error(`credit_wallet failed: ${error.message}`);
  const row = Array.isArray(data) ? data[0] : data;
  return { balanceCents: row.balance_available, credited: row.credited };
}
