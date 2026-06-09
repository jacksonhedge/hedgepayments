import { randomBytes } from 'crypto';
import { supabase } from '../lib/supabase';

const TTL_MS = 30 * 60 * 1000;

function genToken(): string {
  return 'lt_' + randomBytes(32).toString('base64url');
}

export interface NewSession { product: string; config?: Record<string, unknown>; env?: string }

export async function createSession(input: NewSession): Promise<{ token: string; expiresAt: string }> {
  const token = genToken();
  const expiresAt = new Date(Date.now() + TTL_MS).toISOString();
  const { error } = await supabase.from('link_sessions').insert([
    { token, product: input.product, config: input.config || {}, env: input.env || 'sandbox', status: 'pending', expires_at: expiresAt },
  ]);
  if (error) throw new Error(`createSession failed: ${error.message}`);
  return { token, expiresAt };
}

export async function exchange(token: string): Promise<{ product: string; config: any; env: string } | null> {
  const { data, error } = await supabase
    .from('link_sessions')
    .select('id, product, config, env, status, expires_at')
    .eq('token', token)
    .single();
  if (error || !data) return null;
  if (data.status === 'consumed') return null;
  if (new Date(data.expires_at).getTime() < Date.now()) return null;
  if (data.status === 'pending') {
    await supabase.from('link_sessions').update({ status: 'opened', opened_at: new Date().toISOString() }).eq('token', token);
  }
  return { product: data.product, config: data.config, env: data.env };
}

export async function consumeOnSuccess(
  token: string,
  result: unknown,
): Promise<{ id: string } | null> {
  const { data, error } = await supabase
    .from('link_sessions')
    .update({
      status: 'consumed',
      consumed_at: new Date().toISOString(),
      consume_result: result,
    })
    .eq('token', token)
    .neq('status', 'consumed')
    .select('id')
    .single();
  if (error || !data) return null;
  return { id: data.id };
}

export async function selectStatus(token: string): Promise<string | null> {
  const { data } = await supabase
    .from('link_sessions')
    .select('status')
    .eq('token', token)
    .single();
  return data?.status ?? null;
}
