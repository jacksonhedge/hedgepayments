import { NextRequest, NextResponse } from 'next/server'
import { researchAdminClient, requireAdmin, noDb } from '@/lib/research/server'
import { BETTING_HERO_TEMPLATE } from '@/lib/research/screeners'

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req); if (denied) return denied
  const db = researchAdminClient(); if (!db) return noDb()
  const { data, error } = await db.from('research_screeners')
    .select('*, research_tests(title), research_screener_responses(id,tester_id,email,full_name,answers,qualified,disqualified_by,created_at)')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ screeners: data })
}

// POST { slug, title, intro, test_id, questions } | { template: 'betting_hero', slug, test_id }
export async function POST(req: NextRequest) {
  const denied = requireAdmin(req); if (denied) return denied
  const db = researchAdminClient(); if (!db) return noDb()
  const b = await req.json()
  const base = b.template === 'betting_hero' ? BETTING_HERO_TEMPLATE : { title: b.title, intro: b.intro || null, questions: b.questions || [] }
  const slug = String(b.slug || '').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '')
  if (!slug || !base.title) return NextResponse.json({ error: 'slug and title required' }, { status: 400 })
  const { data, error } = await db.from('research_screeners').insert({ slug, title: base.title, intro: base.intro, questions: base.questions, test_id: b.test_id || null, status: b.status || 'open' }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ screener: data })
}

export async function PATCH(req: NextRequest) {
  const denied = requireAdmin(req); if (denied) return denied
  const db = researchAdminClient(); if (!db) return noDb()
  const b = await req.json()
  if (!b.id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const patch: Record<string, any> = {}
  for (const k of ['title', 'intro', 'questions', 'status', 'test_id', 'is_onboarding']) if (k in b) patch[k] = b[k]
  // Only one screener can be the post-signup onboarding screener.
  if (patch.is_onboarding === true) await db.from('research_screeners').update({ is_onboarding: false }).eq('is_onboarding', true)
  const { error } = await db.from('research_screeners').update(patch).eq('id', b.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
