import { NextRequest, NextResponse } from 'next/server'
import { researchAdminClient, noDb } from '@/lib/research/server'
import { emailConfigured, sendMagicLinkEmail } from '@/lib/research/loginEmail'

// Branded replacement for client-side signInWithOtp on the dashboard login.
// Always returns { success: true } whether or not the email belongs to a tester,
// so emails can't be enumerated. `emailed: false` only signals the global
// "SendGrid not configured" case so the client can fall back to Supabase's
// default magic-link email.
export async function POST(req: NextRequest) {
  let b: Record<string, any>
  try { b = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }
  const email = String(b.email || '').trim().toLowerCase()
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Valid email required' }, { status: 400 })

  const db = researchAdminClient()
  if (!db) return noDb()
  if (!emailConfigured()) return NextResponse.json({ success: true, emailed: false })

  const { data: t } = await db.from('research_testers').select('id,first_name').eq('email', email).maybeSingle()
  if (t) {
    // Light rate limit: skip if we already emailed this tester in the last minute.
    const { data: recent } = await db.from('research_messages').select('id').eq('tester_id', t.id).eq('channel', 'email')
      .gte('sent_at', new Date(Date.now() - 60_000).toISOString()).limit(1)
    if (!recent?.length) await sendMagicLinkEmail(db, { email, first_name: t.first_name, tester_id: t.id }, 'login')
  }
  return NextResponse.json({ success: true, emailed: true })
}
