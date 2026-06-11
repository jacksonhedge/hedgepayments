import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../utils/supabase';
import { notifySlack } from '@/lib/slack';

// Sales lead capture for /book. Writes to Supabase `sales_leads` and pings Slack.
// If NEITHER store succeeds (e.g. env not configured), returns 503 so the client
// falls back to a prefilled mailto — a lead is never silently dropped.
export async function POST(req: NextRequest) {
  try {
    const { name, email, company, interest, message } = await req.json();

    if (!email || !name) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    let stored = false;

    if (supabaseAdmin) {
      const { error } = await supabaseAdmin.from('sales_leads').insert({
        name,
        email,
        company: company || null,
        interest: interest || null,
        message: message || null,
        source: 'book-page',
      });
      if (!error) {
        stored = true;
      } else {
        console.error('sales_leads insert failed:', error.message);
      }
    }

    // notifySlack no-ops silently when SLACK_WEBHOOK_URL is unset — only count
    // it as a captured lead when the webhook is actually configured.
    await notifySlack(
      `📅 New sales lead: ${name} <${email}>${company ? ` · ${company}` : ''}${interest ? ` · interested in ${interest}` : ''}${message ? `\n> ${message}` : ''}`,
    );
    if (process.env.SLACK_WEBHOOK_URL) stored = true;

    if (!stored) {
      return NextResponse.json({ error: 'lead capture unavailable' }, { status: 503 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'invalid request' }, { status: 400 });
  }
}
