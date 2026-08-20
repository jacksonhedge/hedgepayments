import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { notifySlack } from '@/lib/slack'

// Hedge Research inquiry form. Pings Slack always (when configured) and
// persists to `research_inquiries` when Supabase env is present. Never fails
// the user-facing request because of a missing integration.
export async function POST(request: NextRequest) {
  let body: Record<string, string>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const name = (body.name || '').trim()
  const email = (body.email || '').trim()
  const company = (body.company || '').trim()
  const title = (body.title || '').trim()
  const message = (body.message || '').trim()

  if (!name || !email || !company || !message) {
    return NextResponse.json({ error: 'name, email, company and message are required' }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  await notifySlack(
    `🔬 *Hedge Research inquiry*\n*${name}*${title ? ` (${title})` : ''} — ${company}\n${email}\n> ${message}`
  )

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY
  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey)
      const { error } = await supabase
        .from('research_inquiries')
        .insert({ name, email, company, title: title || null, message })
      if (error) console.error('research_inquiries insert failed:', error.message)
    } catch (e) {
      console.error('research_inquiries insert threw:', e)
    }
  }

  return NextResponse.json({ success: true })
}
