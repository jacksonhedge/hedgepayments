import { NextRequest, NextResponse } from 'next/server'
import { researchAdminClient, noDb, normalizePhone } from '@/lib/research/server'
import { notifySlack } from '@/lib/slack'

// Quick tester subscribe from /research (name, email, phone, text-or-email).
// Insert-only into research_subscribers. Full applications go through /api/research/apply.
export async function POST(req: NextRequest) {
  let b: Record<string, any>
  try { b = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const name = String(b.name || '').trim().slice(0, 120)
  const email = String(b.email || '').trim().toLowerCase()
  const phone = normalizePhone(b.phone)
  const channel = ['text', 'email', 'both'].includes(b.channel) ? (b.channel as string) : 'email'

  if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 })
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  if (channel !== 'email' && !phone) return NextResponse.json({ error: 'Valid US mobile number required for text alerts' }, { status: 400 })
  if (b.phone && !phone) return NextResponse.json({ error: 'Phone must be a valid US number' }, { status: 400 })

  const db = researchAdminClient()
  if (!db) return noDb()

  // Unauthenticated: never modify an existing row (anyone could re-point another
  // subscriber's phone/channel by resubmitting their email). Duplicate emails get
  // the same success response so addresses can't be enumerated.
  const { error } = await db
    .from('research_subscribers')
    .insert({ name, email, phone, notify_channel: channel, source: 'research-page' })
  if (error) {
    if (error.code === '23505') return NextResponse.json({ success: true })
    console.error('research_subscribers insert failed:', error.message)
    return NextResponse.json({ error: 'Could not save' }, { status: 500 })
  }

  // Not awaited: keeps response timing identical to the duplicate-email path so
  // the endpoint can't be used to probe which addresses are already subscribed.
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  void notifySlack(`🔔 *Research subscriber* (${channel}): ${esc(name)} · ${esc(email)}${phone ? ' · ' + phone : ''}`).catch(() => {})
  return NextResponse.json({ success: true })
}
