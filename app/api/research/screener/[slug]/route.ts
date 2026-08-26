import { NextRequest, NextResponse } from 'next/server'
import { researchAdminClient, noDb, normalizePhone } from '@/lib/research/server'
import { evaluate, stateAbbr, platformSlug, type Question, type Answers } from '@/lib/research/screeners'
import { notifySlack } from '@/lib/slack'

// GET /api/research/screener/:slug?eid=<invite_token>
// Returns the screener; when eid resolves to a tester the email is locked to them.
export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const db = researchAdminClient(); if (!db) return noDb()
  const { data: sc } = await db.from('research_screeners').select('id,slug,title,intro,questions,status').eq('slug', params.slug).maybeSingle()
  if (!sc) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (sc.status !== 'open') return NextResponse.json({ error: 'This screener is closed' }, { status: 410 })
  const eid = req.nextUrl.searchParams.get('eid')
  let invitee: { email: string; full_name: string; already: boolean } | null = null
  if (eid && /^[0-9a-f-]{36}$/i.test(eid)) {
    const { data: t } = await db.from('research_testers').select('id,email,first_name,last_name').eq('invite_token', eid).maybeSingle()
    if (t) {
      const { data: r } = await db.from('research_screener_responses').select('id').eq('screener_id', sc.id).eq('email', t.email).maybeSingle()
      invitee = { email: t.email, full_name: [t.first_name, t.last_name].filter(Boolean).join(' '), already: !!r }
    }
  }
  return NextResponse.json({ screener: sc, invitee })
}

// POST { eid?, email?, full_name, answers, consent: { storage, deletion, future } }
export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const db = researchAdminClient(); if (!db) return noDb()
  let b: any; try { b = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }
  const { data: sc } = await db.from('research_screeners').select('*').eq('slug', params.slug).maybeSingle()
  if (!sc || sc.status !== 'open') return NextResponse.json({ error: 'Screener unavailable' }, { status: 410 })
  const questions = sc.questions as Question[]
  const answers: Answers = b.answers && typeof b.answers === 'object' ? b.answers : {}
  const consent = { storage: !!b.consent?.storage, deletion: !!b.consent?.deletion, future: !!b.consent?.future }
  if (!consent.storage || !consent.deletion) return NextResponse.json({ error: 'Required consents not given' }, { status: 400 })

  // Resolve identity: locked to the invitee when eid is present; otherwise the typed email.
  let tester: any = null
  if (b.eid && /^[0-9a-f-]{36}$/i.test(b.eid)) {
    const { data } = await db.from('research_testers').select('*').eq('invite_token', b.eid).maybeSingle(); tester = data
  }
  const email = String(tester?.email || b.email || '').trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  const full_name = String(b.full_name || '').trim().slice(0, 120)

  // Validate required answers up to the first disqualifier (later ones are never shown).
  const { qualified, disqualified_by } = evaluate(questions, answers)
  for (const q of questions) {
    const a = answers[q.id]
    const empty = a == null || a === '' || (Array.isArray(a) && !a.length)
    if (q.required !== false && empty) return NextResponse.json({ error: `Question "${q.prompt}" is required` }, { status: 400 })
    if (q.id === disqualified_by) break
  }

  // Map answers onto the tester profile (creates the tester for open links).
  const mapped: Record<string, any> = {}
  for (const q of questions) {
    const a = answers[q.id]; if (a == null || a === '') continue
    if (q.maps_to === 'state') mapped.state = stateAbbr(String(a))
    if (q.maps_to === 'first_name') mapped.first_name = String(a).slice(0, 80)
    if (q.maps_to === 'last_name') mapped.last_name = String(a).slice(0, 80)
    if (q.maps_to === 'phone') mapped.phone = normalizePhone(String(a))
    if (q.maps_to === 'platforms') mapped.platforms = (Array.isArray(a) ? a : [a]).filter((x) => x !== q.exclusive && x !== 'Other').map(platformSlug)
  }
  if (!tester) {
    const { data: existing } = await db.from('research_testers').select('*').eq('email', email).maybeSingle()
    tester = existing
  }
  if (!tester) {
    const [fn, ...rest] = full_name.split(' ')
    const row = { email, first_name: mapped.first_name || fn || 'Tester', last_name: mapped.last_name || rest.join(' ') || null,
      state: mapped.state || '??', age_bucket: '21+', platforms: mapped.platforms || [], phone: mapped.phone || null,
      referral_source: `screener:${sc.slug}`, consent_storage: true, consent_future_studies: consent.future }
    const { data, error } = await db.from('research_testers').insert(row).select().single()
    if (error) return NextResponse.json({ error: 'Could not save' }, { status: 500 })
    tester = data
  } else {
    // Invited tester: safe to update because identity is proven by the token / they own the email on record.
    const patch: Record<string, any> = { consent_storage: true, consent_future_studies: consent.future }
    if (b.eid) Object.assign(patch, mapped)
    await db.from('research_testers').update(patch).eq('id', tester.id)
  }

  const { error } = await db.from('research_screener_responses').upsert(
    { screener_id: sc.id, tester_id: tester.id, email, full_name: full_name || null, answers, qualified, disqualified_by, consent },
    { onConflict: 'screener_id,email' })
  if (error) return NextResponse.json({ error: 'Could not save response' }, { status: 500 })

  if (qualified && sc.test_id) {
    await db.from('research_assignments').upsert({ test_id: sc.test_id, tester_id: tester.id }, { onConflict: 'test_id,tester_id', ignoreDuplicates: true })
  }
  await notifySlack(`📋 *Screener ${sc.slug}*: ${full_name || email} — ${qualified ? '✅ qualified' : `❌ out at "${disqualified_by}"`}`)
  return NextResponse.json({ success: true, qualified })
}
