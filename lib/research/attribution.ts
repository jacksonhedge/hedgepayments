// First-touch attribution for the research funnel. Client-safe (no server imports).
// Captured once per browser on the first /research* page view and sent with every
// signup/screener/subscribe POST so we can see where a tester came from.
export type Attribution = {
  utm_source?: string; utm_medium?: string; utm_campaign?: string; utm_content?: string; utm_term?: string
  ref?: string                 // referral code from ?ref=
  src?: string                 // short-hand ?src=ig_story etc.
  referrer?: string            // document.referrer host
  landing_path?: string
  first_seen_at?: string
  device?: 'mobile' | 'desktop'
  test?: boolean               // set by stress tests so rows can be cleaned up
}

const KEY = 'hr_attr_v1'
const UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const

export function captureAttribution(): Attribution {
  if (typeof window === 'undefined') return {}
  try {
    const existing = window.localStorage.getItem(KEY)
    if (existing) return JSON.parse(existing)
  } catch {}
  const q = new URLSearchParams(window.location.search)
  const a: Attribution = { landing_path: window.location.pathname, first_seen_at: new Date().toISOString(),
    device: /Mobi|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop' }
  for (const k of UTM) { const v = q.get(k); if (v) a[k] = v.slice(0, 100) }
  const ref = q.get('ref'); if (ref) a.ref = ref.toUpperCase().slice(0, 40)
  const src = q.get('src'); if (src) a.src = src.slice(0, 60)
  if (q.get('hr_test') === '1') a.test = true
  try { if (document.referrer) a.referrer = new URL(document.referrer).host } catch {}
  try { window.localStorage.setItem(KEY, JSON.stringify(a)) } catch {}
  return a
}

// Human label used for the admin "Source" column / filter.
export function sourceLabel(a: Attribution | null | undefined): string {
  if (!a) return 'direct'
  if (a.utm_source) return [a.utm_source, a.utm_campaign || a.utm_medium].filter(Boolean).join(' / ')
  if (a.src) return a.src
  if (a.ref) return `ref:${a.ref}`
  if (a.referrer && !/hedgepayments\.com$/.test(a.referrer)) return a.referrer.replace(/^www\./, '')
  return 'direct'
}

// Server-side sanitizer for whatever the client posted.
export function cleanAttribution(raw: any): Attribution {
  if (!raw || typeof raw !== 'object') return {}
  const out: Attribution = {}
  const str = (k: keyof Attribution, max = 100) => { const v = raw[k]; if (typeof v === 'string' && v.trim()) (out as any)[k] = v.trim().slice(0, max) }
  for (const k of UTM) str(k)
  str('ref', 40); str('src', 60); str('referrer', 120); str('landing_path', 200); str('first_seen_at', 40)
  if (raw.device === 'mobile' || raw.device === 'desktop') out.device = raw.device
  if (raw.test === true) out.test = true
  return out
}
