import { NextRequest, NextResponse } from 'next/server'
import { researchAdminClient, requireAdmin, noDb } from '@/lib/research/server'

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req); if (denied) return denied
  const db = researchAdminClient(); if (!db) return noDb()
  const { data, error } = await db
    .from('research_testers')
    .select('*, research_assignments(id,status,test_id), research_messages(id,channel,sent_at)')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ testers: data })
}

// PATCH { id, status?, notes? }
export async function PATCH(req: NextRequest) {
  const denied = requireAdmin(req); if (denied) return denied
  const db = researchAdminClient(); if (!db) return noDb()
  const b = await req.json()
  const patch: Record<string, any> = {}
  if (b.status) patch.status = b.status
  if (typeof b.notes === 'string') patch.notes = b.notes
  if (!b.id || !Object.keys(patch).length) return NextResponse.json({ error: 'id and a field to update required' }, { status: 400 })
  const { error } = await db.from('research_testers').update(patch).eq('id', b.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
