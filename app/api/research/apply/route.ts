import { NextRequest, NextResponse } from 'next/server'
import { researchAdminClient, noDb, normalizePhone } from '@/lib/research/server'
import { notifySlack } from '@/lib/slack'

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
  const verticals: string[] = Array.isArray(b.verticals) ? b.verticals.map(String).slice(0, 10) : []

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  if (!first_name || !state || !age_bucket) return NextResponse.json({ error: 'first_name, state and age_bucket are required' }, { status: 400 })
  if (b.phone && !phone) return NextResponse.json({ error: 'Phone must be a valid US number' }, { status: 400 })

  const db = researchAdminClient()
  if (!db) return noDb()

  const { data: existing } = await db.from('research_testers').select('id,status').eq('email', email).maybeSingle()
  const row = { email, first_name, last_name, state, age_bucket, phone, platforms, verticals,
    sms_opt_in: !!phone && b.sms_opt_in !== false, referral_source: b.referral_source ? String(b.referral_source).slice(0, 200) : null }
  const { error } = existing
    ? await db.from('research_testers').update(row).eq('id', existing.id)
    : await db.from('research_testers').insert(row)
  if (error) {
    console.error('research_testers upsert failed:', error.message)
    return NextResponse.json({ error: 'Could not save application' }, { status: 500 })
  }
  if (!existing) {
    await notifySlack(`🧪 *New research tester*: ${first_name}${last_name ? ' ' + last_name : ''} · ${state} · ${age_bucket} · ${email}${phone ? ' · ' + phone : ''}\nPlatforms: ${platforms.join(', ') || '—'}`)
  }
  return NextResponse.json({ success: true, returning: !!existing })
}
