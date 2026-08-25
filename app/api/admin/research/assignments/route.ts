import { NextRequest, NextResponse } from 'next/server'
import { researchAdminClient, requireAdmin, noDb } from '@/lib/research/server'

// POST { test_id, tester_ids[] } — invite testers (idempotent on the unique pair)
export async function POST(req: NextRequest) {
  const denied = requireAdmin(req); if (denied) return denied
  const db = researchAdminClient(); if (!db) return noDb()
  const b = await req.json()
  const ids: string[] = Array.isArray(b.tester_ids) ? b.tester_ids : []
  if (!b.test_id || !ids.length) return NextResponse.json({ error: 'test_id and tester_ids required' }, { status: 400 })
  const { error } = await db
    .from('research_assignments')
    .upsert(ids.map((tester_id) => ({ test_id: b.test_id, tester_id })), { onConflict: 'test_id,tester_id', ignoreDuplicates: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, invited: ids.length })
}

// PATCH { id, status?, admin_notes? }
export async function PATCH(req: NextRequest) {
  const denied = requireAdmin(req); if (denied) return denied
  const db = researchAdminClient(); if (!db) return noDb()
  const b = await req.json()
  if (!b.id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const patch: Record<string, any> = {}
  if (b.status) { patch.status = b.status; if (b.status === 'paid') patch.paid_at = new Date().toISOString() }
  if ('paid_cents' in b) patch.paid_cents = b.paid_cents == null ? null : Math.round(Number(b.paid_cents))
  if (typeof b.admin_notes === 'string') patch.admin_notes = b.admin_notes
  const { error } = await db.from('research_assignments').update(patch).eq('id', b.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
