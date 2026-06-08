import { supabase } from '../lib/supabase';

// Canonical lead-capture for the marketing site. The Next.js routes (app/api/waitlist,
// app/api/subscribe) still serve in production (output:export was removed), but new work
// and the eventual client repoint should target these @hedge/api endpoints.

export async function joinWaitlist(email: string, source = 'hedgepayments'): Promise<{ ok: true }> {
  const { error } = await supabase.from('waitlist').insert([
    { email, source, created_at: new Date().toISOString() },
  ]);
  // Treat a duplicate email as success (already on the list).
  if (error && !/duplicate|unique/i.test(error.message)) throw new Error(`waitlist insert failed: ${error.message}`);
  return { ok: true };
}

export async function subscribe(email: string, name: string): Promise<{ ok: true }> {
  const { error } = await supabase.from('subscribers').insert([
    { email, name, subscribed_at: new Date().toISOString() },
  ]);
  if (error && !/duplicate|unique/i.test(error.message)) throw new Error(`subscribe insert failed: ${error.message}`);
  return { ok: true };
}
