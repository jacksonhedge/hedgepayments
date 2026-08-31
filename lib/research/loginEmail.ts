import { SupabaseClient } from '@supabase/supabase-js'
import { sendEmail } from '@/lib/sendgrid'
import { renderResearchEmail } from './email'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://hedgepayments.com'

export function emailConfigured() {
  return !!process.env.SENDGRID_API_KEY
}

// Server-side replacement for client signInWithOtp: generate the Supabase magic
// link ourselves and wrap it in the branded Hedge Research email, so testers
// never see the default Supabase template. Logs to research_messages (without
// the one-time link) when tester_id is known.
export async function sendMagicLinkEmail(
  db: SupabaseClient,
  t: { email: string; first_name?: string | null; tester_id?: string | null },
  kind: 'welcome' | 'login',
): Promise<{ ok: boolean; reason?: string }> {
  // generateLink(type: 'magiclink') requires the auth user to exist already.
  await db.auth.admin.createUser({ email: t.email, email_confirm: true })

  const { data, error } = await db.auth.admin.generateLink({
    type: 'magiclink',
    email: t.email,
    options: { redirectTo: `${SITE}/research/dashboard` },
  })
  const url = data?.properties?.action_link
  if (error || !url) {
    console.error('generateLink failed:', error?.message)
    return { ok: false, reason: error?.message || 'could not generate login link' }
  }

  const first = (t.first_name || '').trim()
  const hey = first ? `Hey ${first} —` : 'Hey —'
  const welcome = kind === 'welcome'
  const subject = welcome
    ? 'Welcome to Hedge Research — your dashboard is ready'
    : 'Your Hedge Research login link'
  const body = welcome
    ? `${hey} welcome to Hedge Research. You're on the tester panel.\n\nWhen a paid test matches your apps, age and state, we'll text or email you. Every completed test pays $10–$100 depending on how long it takes and what it requires.\n\nYour dashboard shows the tests you're matched to, your payouts and your profile. The button below logs you in — no password needed.`
    : `${hey} here's your one-time login link for your Hedge Research dashboard. No password needed. It expires in about an hour; request a new one from the dashboard any time.`
  const html = renderResearchEmail({
    body,
    preheader: welcome ? "You're on the panel — open your tester dashboard." : 'One-time login link for your tester dashboard.',
    eyebrow: welcome ? "You're in" : 'Log in',
    cta: { label: 'Open your tester dashboard', url },
  })
  const ok = await sendEmail({ to: t.email, subject, text: `${body}\n\n${url}`, html, fromName: 'Hedge Research', disableClickTracking: true })

  if (t.tester_id) {
    await db.from('research_messages').insert({
      tester_id: t.tester_id,
      channel: 'email',
      subject,
      body: welcome ? 'Welcome email with dashboard login button.' : 'Login link email.',
      status: ok ? 'sent' : 'failed',
      error: ok ? null : 'sendgrid send failed (check SENDGRID_* env)',
    })
  }
  return ok ? { ok: true } : { ok: false, reason: 'sendgrid send failed (check SENDGRID_* env)' }
}
