import { NextRequest, NextResponse } from 'next/server'
import { researchAdminClient, requireAdmin, noDb, mergeTemplate } from '@/lib/research/server'
import { sendEmail, sendSMS } from '@/lib/sendgrid'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://hedgepayments.com'

// GET ?tester_id=  → message history for one tester (or latest 100 overall)
export async function GET(req: NextRequest) {
  const denied = requireAdmin(req); if (denied) return denied
  const db = researchAdminClient(); if (!db) return noDb()
  const testerId = req.nextUrl.searchParams.get('tester_id')
  let q = db.from('research_messages').select('*, research_testers(first_name,email)').order('sent_at', { ascending: false }).limit(100)
  if (testerId) q = q.eq('tester_id', testerId)
  const { data, error } = await q
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ messages: data })
}

// POST { tester_ids[], channel: 'sms'|'email', subject?, body, test_id? }
// Merge fields: {{first_name}} {{last_name}} {{email}} {{state}} {{test}} {{dashboard_url}} {{screener_url}} (needs screener_id)
export async function POST(req: NextRequest) {
  const denied = requireAdmin(req); if (denied) return denied
  const db = researchAdminClient(); if (!db) return noDb()
  const b = await req.json()
  const ids: string[] = Array.isArray(b.tester_ids) ? b.tester_ids : []
  const channel = b.channel === 'sms' ? 'sms' : b.channel === 'email' ? 'email' : null
  const body = String(b.body || '').trim()
  const subject = String(b.subject || '').trim()
  if (!ids.length || !channel || !body) return NextResponse.json({ error: 'tester_ids, channel and body required' }, { status: 400 })
  if (channel === 'email' && !subject) return NextResponse.json({ error: 'subject required for email' }, { status: 400 })

  const { data: testers, error } = await db.from('research_testers').select('*').in('id', ids)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  let testTitle: string | null = null
  if (b.test_id) {
    const { data: t } = await db.from('research_tests').select('title').eq('id', b.test_id).maybeSingle()
    testTitle = t?.title || null
  }

  let screenerSlug: string | null = null
  if (b.screener_id) {
    const { data: sc } = await db.from('research_screeners').select('slug').eq('id', b.screener_id).maybeSingle()
    screenerSlug = sc?.slug || null
  }

  const results: { tester_id: string; ok: boolean; reason?: string }[] = []
  for (const t of testers || []) {
    const vars = { first_name: t.first_name, last_name: t.last_name, email: t.email, state: t.state, test: testTitle, dashboard_url: `${SITE}/research/dashboard`, screener_url: screenerSlug ? `${SITE}/research/s/${screenerSlug}?eid=${t.invite_token}` : '' }
    const text = mergeTemplate(body, vars)
    let ok = false
    let reason: string | undefined
    if (channel === 'sms') {
      if (!t.phone) reason = 'no phone'
      else if (!t.sms_opt_in) reason = 'sms opted out'
      else ok = await sendSMS({ to: t.phone, body: text })
      if (!ok && !reason) reason = 'twilio send failed (check TWILIO_* env)'
    } else {
      if (!t.email_opt_in) reason = 'email opted out'
      else ok = await sendEmail({ to: t.email, subject: mergeTemplate(subject, vars), text, html: text.replace(/\n/g, '<br/>'), fromName: 'Hedge Research' })
      if (!ok && !reason) reason = 'sendgrid send failed (check SENDGRID_* env)'
    }
    await db.from('research_messages').insert({
      tester_id: t.id, channel, subject: channel === 'email' ? mergeTemplate(subject, vars) : null, body: text,
      status: ok ? 'sent' : 'failed', error: ok ? null : reason, test_id: b.test_id || null,
    })
    results.push({ tester_id: t.id, ok, reason })
  }
  return NextResponse.json({ sent: results.filter((r) => r.ok).length, failed: results.filter((r) => !r.ok), results })
}
