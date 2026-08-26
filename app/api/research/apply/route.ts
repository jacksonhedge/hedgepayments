import { NextRequest, NextResponse } from 'next/server'
import { researchAdminClient, noDb, normalizePhone } from '@/lib/research/server'
import { notifySlack } from '@/lib/slack'
import { cleanCode, recordReferral } from '@/lib/research/referrals'

// Tester application from /research/signup. Upserts by email; the client then
// sends a Supabase magic link so the tester can reach /research/dashboard.
export async function POST(req: NextRequest) {
  let b: Record<string, any>
  try { b = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const email = String(b.email || '').trim().toLowerCase()
  const first_name = String(b.first_name || '').trim()
  const last_name = String(b.last_name || '').trim() || null
  const state = String(b.state || '').trim().toUpperCase()
  const age_bucket = b.age_bucket === '21+' ? '21+' : b.age_bucket === '18-20' ? '18-20' : ''
  const phone = normalizePhone(b.phone)
  const platforms: string[] = Array.isArray(b.platforms) ? b.platforms.map(String).slice(0, 30) : []
  const payout_method = ['venmo','paypal','cashapp','zelle'].includes(b.payout_method) ? b.payout_method : null
  const payout_handle = payout_method && b.payout_handle ? String(b.payout_handle).trim().slice(0, 120) : null
  const verticals: string[] = Array.isArray(b.verticals) ? b.verticals.map(String).slice(0, 10) : []
  const referral_code = cleanCode(b.referral_code)

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  if (!first_name || !state || !age_bucket) return NextResponse.json({ error: 'first_name, state and age_bucket are required' }, { status: 400 })
  if (b.phone && !phone) return NextResponse.json({ error: 'Phone must be a valid US number' }, { status: 400 })

  const db = researchAdminClient()
  if (!db) return noDb()

  // Unauthenticated endpoint: never modify an existing profile (anyone could
  // overwrite another tester's phone/name by resubmitting their email). Existing
  // testers just get the magic link from the client and edit in the dashboard.
  // Response is identical either way so emails can't be enumerated.
  const { data: existing } = await db.from('research_testers').select('id').eq('email', email).maybeSingle()
  if (existing) return NextResponse.json({ success: true })

  const row = { email, first_name, last_name, state, age_bucket, phone, platforms, verticals, payout_method, payout_handle,
    sms_opt_in: !!phone && b.sms_opt_in !== false, referral_source: b.referral_source ? String(b.referral_source).slice(0, 200) : null, referral_code }
  const { data: inserted, error } = await db.from('research_testers').insert(row).select('id').single()
  if (error) {
    console.error('research_testers insert failed:', error.message)
    return NextResponse.json({ error: 'Could not save application' }, { status: 500 })
  }
  await recordReferral(db, referral_code, 'apply', { testerId: inserted?.id, email })
  await notifySlack(`🧪 *New research tester*: ${first_name}${last_name ? ' ' + last_name : ''} · ${state} · ${age_bucket} · ${email}${phone ? ' · ' + phone : ''}${referral_code ? ' · ref ' + referral_code : ''}\nPlatforms: ${platforms.join(', ') || '—'}`)
  return NextResponse.json({ success: true })
}
