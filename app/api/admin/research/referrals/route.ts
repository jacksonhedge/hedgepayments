import { NextRequest, NextResponse } from 'next/server'
import { researchAdminClient, requireAdmin, noDb } from '@/lib/research/server'
import { cleanCode } from '@/lib/research/referrals'

// GET → { stats: [...per-code counts], unknown: [...codes used but not registered], recent: [...last 100 events] }
export async function GET(req: NextRequest) {
  const denied = requireAdmin(req); if (denied) return denied
  const db = researchAdminClient(); if (!db) return noDb()
  const [stats, recent] = await Promise.all([
    db.from('research_referral_stats').select('*').order('total', { ascending: false }),
    db.from('research_referrals').select('id, code, code_known, event, referred_email, created_at').order('created_at', { ascending: false }).limit(100),
  ])
  if (stats.error) return NextResponse.json({ error: stats.error.message }, { status: 500 })
  if (recent.error) return NextResponse.json({ error: recent.error.message }, { status: 500 })
  const unknown: Record<string, number> = {}
  for (const r of recent.data || []) if (!r.code_known) unknown[r.code] = (unknown[r.code] || 0) + 1
  return NextResponse.json({ stats: stats.data, recent: recent.data, unknown: Object.entries(unknown).map(([code, n]) => ({ code, n })) })
}

// POST { code, owner_name, owner_email?, owner_type?, notes? } → register a chapter/ambassador/partner code
export async function POST(req: NextRequest) {
  const denied = requireAdmin(req); if (denied) return denied
  const db = researchAdminClient(); if (!db) return noDb()
  const b = await req.json()
  const code = cleanCode(b.code)
  const owner_name = String(b.owner_name || '').trim()
  const owner_type = ['chapter', 'ambassador', 'tester', 'partner', 'campaign'].includes(b.owner_type) ? b.owner_type : 'ambassador'
  if (!code || !owner_name) return NextResponse.json({ error: 'code and owner_name required' }, { status: 400 })
  const { data, error } = await db.from('research_referral_codes')
    .insert({ code, owner_name, owner_email: b.owner_email ? String(b.owner_email).trim().toLowerCase() : null, owner_type, notes: b.notes ? String(b.notes).slice(0, 500) : null })
    .select().single()
  if (error) return NextResponse.json({ error: error.code === '23505' ? 'Code already exists' : error.message }, { status: error.code === '23505' ? 409 : 500 })
  return NextResponse.json({ code: data })
}

// PATCH { code, active?, owner_name?, owner_email?, owner_type?, notes? }
export async function PATCH(req: NextRequest) {
  const denied = requireAdmin(req); if (denied) return denied
  const db = researchAdminClient(); if (!db) return noDb()
  const b = await req.json()
  const code = cleanCode(b.code)
  if (!code) return NextResponse.json({ error: 'code required' }, { status: 400 })
  const patch: Record<string, any> = {}
  for (const k of ['active', 'owner_name', 'owner_email', 'owner_type', 'notes']) if (k in b) patch[k] = b[k]
  const { error } = await db.from('research_referral_codes').update(patch).eq('code', code)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
