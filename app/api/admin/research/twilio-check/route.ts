import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/research/server'

// Diagnoses Twilio credentials as the server actually sees them. Never returns secrets —
// only shape info (length, charset, prefix) and Twilio's own response to GET /Accounts/{sid}.json.
export async function GET(req: NextRequest) {
  const denied = requireAdmin(req); if (denied) return denied
  const sidRaw = process.env.TWILIO_ACCOUNT_SID ?? ''
  const tokRaw = process.env.TWILIO_AUTH_TOKEN ?? ''
  const fromRaw = process.env.TWILIO_FROM_NUMBER ?? ''
  const shape = (v: string) => ({
    present: v.length > 0, length: v.length, trimmedLength: v.trim().length,
    prefix: v.slice(0, 2), hexOnly: /^[0-9a-f]+$/.test(v.trim()), hasWhitespace: /\s/.test(v),
    nonAscii: /[^\x20-\x7e]/.test(v),
  })
  const sid = sidRaw.trim(), tok = tokRaw.trim()
  let twilio: any = null
  if (sid && tok) {
    const r = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}.json`, {
      headers: { Authorization: 'Basic ' + Buffer.from(`${sid}:${tok}`).toString('base64') },
    })
    const j: any = await r.json().catch(() => ({}))
    twilio = r.ok
      ? { ok: true, status: r.status, account_status: j.status, type: j.type, friendly_name: j.friendly_name, owner_sid_matches: j.owner_account_sid === j.sid }
      : { ok: false, status: r.status, code: j.code, message: j.message }
  }
  return NextResponse.json({
    env: { TWILIO_ACCOUNT_SID: { ...shape(sidRaw), hexOnly: undefined, expected: 'AC + 32 hex = 34 chars' },
           TWILIO_AUTH_TOKEN: { ...shape(tokRaw), prefix: undefined, expected: '32 hex chars' },
           TWILIO_FROM_NUMBER: { present: !!fromRaw, value: fromRaw, e164: /^\+1\d{10}$/.test(fromRaw.trim()) } },
    twilio,
  })
}
