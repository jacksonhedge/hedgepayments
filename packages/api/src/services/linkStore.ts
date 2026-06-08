import { supabase } from '../lib/supabase';

const TTL_MS = 30 * 60 * 1000;

function genToken(): string {
  let s = '';
  for (let i = 0; i < 32; i++) s += Math.floor(Math.random() * 36).toString(36);
  return 'lt_' + s;
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
