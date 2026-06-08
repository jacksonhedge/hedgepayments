import { NextRequest, NextResponse } from 'next/server'
import { notifySlack } from '@/lib/slack'

// Business signup happens client-side via Supabase Auth; the page pings this
// route after a successful signup so we get a Slack notification.
export async function POST(req: NextRequest) {
  try {
    const { businessName, contactName, email, businessType } = await req.json()
    if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })
    await notifySlack(
      `🏢 New business signup: *${businessName || 'Unknown'}* — ${contactName || ''} <${email}>` +
        (businessType ? ` · ${businessType}` : '')
    )
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
