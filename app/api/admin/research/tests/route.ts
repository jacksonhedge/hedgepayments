import { NextRequest, NextResponse } from 'next/server'
import { researchAdminClient, requireAdmin, noDb } from '@/lib/research/server'

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req); if (denied) return denied
  const db = researchAdminClient(); if (!db) return noDb()
  const [tests, platforms] = await Promise.all([
    db.from('research_tests').select('*, research_platforms(name,kind), research_assignments(id,status,tester_id)').order('created_at', { ascending: false }),
    db.from('research_platforms').select('*').order('name'),
  ])
  if (tests.error) return NextResponse.json({ error: tests.error.message }, { status: 500 })
  return NextResponse.json({ tests: tests.data, platforms: platforms.data || [] })
}

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req); if (denied) return denied
  const db = researchAdminClient(); if (!db) return noDb()
  const b = await req.json()
  if (!b.title) return NextResponse.json({ error: 'title required' }, { status: 400 })
  const { data, error } = await db.from('research_tests').insert({
    title: String(b.title).slice(0, 200),
    platform_id: b.platform_id || null,
    description: b.description || null,
    instructions: b.instructions || null,
    payout_cents: Math.round(Number(b.payout_dollars || 10) * 100),
    payout_max_cents: b.payout_max_dollars ? Math.round(Number(b.payout_max_dollars) * 100) : null,
    tier: b.tier || 'standard',
    est_minutes: b.est_minutes ? Number(b.est_minutes) : null,
    status: b.status || 'draft',
    starts_at: b.starts_at || null,
    ends_at: b.ends_at || null,
  }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ test: data })
}

export async function PATCH(req: NextRequest) {
  const denied = requireAdmin(req); if (denied) return denied
  const db = researchAdminClient(); if (!db) return noDb()
  const b = await req.json()
  if (!b.id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const patch: Record<string, any> = {}
  for (const k of ['title', 'description', 'instructions', 'status', 'starts_at', 'ends_at', 'platform_id', 'tier', 'est_minutes']) if (k in b) patch[k] = b[k]
  if ('payout_dollars' in b) patch.payout_cents = Math.round(Number(b.payout_dollars) * 100)
  if ('payout_max_dollars' in b) patch.payout_max_cents = b.payout_max_dollars ? Math.round(Number(b.payout_max_dollars) * 100) : null
  const { error } = await db.from('research_tests').update(patch).eq('id', b.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
