import type { SupabaseClient } from '@supabase/supabase-js'

// Referral tracking for Hedge Research.
//  - research_referral_codes: registry of codes (chapters, ambassadors, testers, partners)
//  - research_referrals:      one row per attributed signup (subscribe or apply)
//  - every subscriber gets an own_referral_code so they can refer friends.

export function cleanCode(raw: unknown): string | null {
  const c = String(raw ?? '').trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '').slice(0, 32)
  return c || null
}

// e.g. "JACK-7K3Q" — short, readable, unambiguous alphabet.
export function generateCode(name: string): string {
  const base = name.trim().split(/\s+/)[0].toUpperCase().replace(/[^A-Z]/g, '').slice(0, 6) || 'HEDGE'
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  let tail = ''
  for (let i = 0; i < 4; i++) tail += alphabet[Math.floor(Math.random() * alphabet.length)]
  return `${base}-${tail}`
}

// Register a personal code for a subscriber, retrying on the rare collision.
export async function assignOwnCode(db: SupabaseClient, subscriberId: string, name: string, email: string): Promise<string | null> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateCode(name)
    const { error } = await db.from('research_referral_codes').insert({ code, owner_name: name, owner_email: email, owner_type: 'tester', subscriber_id: subscriberId })
    if (error) { if (error.code === '23505') continue; console.error('referral code insert failed:', error.message); return null }
    const { error: e2 } = await db.from('research_subscribers').update({ own_referral_code: code }).eq('id', subscriberId)
    if (e2) console.error('own_referral_code update failed:', e2.message)
    return code
  }
  return null
}

// Log an attributed signup. Unknown codes are still logged (code_known=false)
// so typos / unregistered chapter codes are visible in admin rather than lost.
export async function recordReferral(
  db: SupabaseClient,
  code: string | null,
  event: 'subscribe' | 'apply',
  ids: { subscriberId?: string; testerId?: string; email: string },
): Promise<void> {
  if (!code) return
  const { data } = await db.from('research_referral_codes').select('code, active').eq('code', code).maybeSingle()
  const { error } = await db.from('research_referrals').insert({
    code,
    code_known: !!data && data.active !== false,
    event,
    subscriber_id: ids.subscriberId ?? null,
    tester_id: ids.testerId ?? null,
    referred_email: ids.email,
  })
  if (error) console.error('research_referrals insert failed:', error.message)
}
