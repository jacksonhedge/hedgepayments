import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, mergeTemplate } from '@/lib/research/server'
import { renderResearchEmail } from '@/lib/research/email'

// POST { body, eyebrow?, cta_label?, cta_url? } → rendered HTML with sample merge values
export async function POST(req: NextRequest) {
  const denied = requireAdmin(req); if (denied) return denied
  const b = await req.json()
  const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://hedgepayments.com'
  const vars = { first_name: 'Jordan', last_name: 'Lee', email: 'jordan@example.com', state: 'PA', test: 'FanDuel deposit + cash-out', dashboard_url: `${SITE}/research/dashboard`, screener_url: `${SITE}/research/s/example?eid=…` }
  const m = (x: any) => (x ? mergeTemplate(String(x), vars) : '')
  const html = renderResearchEmail({ body: m(b.body || ''), eyebrow: m(b.eyebrow) || undefined, cta: b.cta_url ? { label: m(b.cta_label || 'Open'), url: m(b.cta_url) } : null })
  return NextResponse.json({ html })
}
