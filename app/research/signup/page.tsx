'use client'

import { useEffect, useState } from 'react'
import s from '../research.module.css'
import { supabaseBrowser } from '../../utils/supabase-browser'
import { US_STATES, VERTICALS, PAYOUT_TIERS, PAYOUT_METHODS } from '../testerConfig'
import { captureAttribution } from '@/lib/research/attribution'

type Platform = { slug: string; name: string; kind: string; min_age: number }

export default function ResearchSignup() {
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [f, setF] = useState({ first_name: '', last_name: '', email: '', phone: '', state: '', age_bucket: '', sms_opt_in: true, referral_source: '', referral_code: '', payout_method: '', payout_handle: '' })
  const [picked, setPicked] = useState<string[]>([])
  const [verts, setVerts] = useState<string[]>([])
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [err, setErr] = useState('')
  const [screener, setScreener] = useState<{ url: string; title: string | null } | null>(null)
  const [code, setCode] = useState('')
  const [verify, setVerify] = useState<'idle' | 'checking' | 'verified' | 'error'>('idle')

  useEffect(() => {
    supabaseBrowser.from('research_platforms').select('slug,name,kind,min_age').eq('active', true).order('name')
      .then(({ data }) => setPlatforms(data || []))
    try {
      const ref = new URLSearchParams(window.location.search).get('ref')
      if (ref) setF((x) => ({ ...x, referral_code: ref.toUpperCase() }))
    } catch {}
  }, [])

  const toggle = (list: string[], set: (v: string[]) => void, v: string) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v])
  const up = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF((o) => ({ ...o, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending'); setErr('')
    try {
      const res = await fetch('/api/research/apply', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...f, platforms: picked, verticals: verts, attribution: captureAttribution() }),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || 'Something went wrong')
      // Signup succeeds regardless of email delivery — the welcome email (sent
      // server-side) is a courtesy, not a confirmation step.
      if (j.screener_url) setScreener({ url: j.screener_url, title: j.screener_title || null })
      setStatus('sent')
    } catch (e: any) {
      setErr(e.message || 'Something went wrong'); setStatus('error')
    }
  }

  // Optional email verification: the 6-digit code from the welcome email is the
  // same one-time token as its button. Verifying also logs the tester in.
  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setVerify('checking')
    const email = f.email.trim().toLowerCase()
    const { error } = await supabaseBrowser.auth.verifyOtp({ email, token: code.trim(), type: 'email' })
    if (error) { setVerify('error'); return }
    await supabaseBrowser.from('research_testers').update({ email_verified_at: new Date().toISOString() }).eq('email', email)
    setVerify('verified')
  }

  return (
    <div className={s.root}>
      <nav className={s.nav}>
        <div className={s.navInner}>
          <a href="/research" className={s.logo}>
            <img src="/favicon/hedge-logo.svg" alt="" className={s.logoMark} />
            <span>HEDGE</span><span className={s.logoSub}>Research</span>
          </a>
          <a href="/research/dashboard" className={s.back}>Already a tester? Log in →</a>
        </div>
      </nav>

      <div className={s.narrow}>
        {status === 'sent' ? (
          <>
            <span className={s.eyebrow}>Application received</span>
            <h1 className={s.h2}>You&apos;re in{f.first_name ? `, ${f.first_name.trim()}` : ''}.</h1>
            <p className={s.lede}>Welcome to the tester panel. We sent a welcome email to <strong style={{ color: 'var(--ink)' }}>{f.email}</strong> with a one-click link to your dashboard, where you&apos;ll see the tests you&apos;re matched to and get paid for.</p>

            {screener && (
              <div style={{ margin: '20px 0' }}>
                <a href={screener.url} className={`${s.btn} ${s.btnPrimary}`} style={{ display: 'inline-block', textDecoration: 'none' }}>
                  Start the qualifying screener →
                </a>
                <p className={s.small} style={{ marginTop: 8 }}>{screener.title ? `“${screener.title}” — a` : 'A'} couple of quick questions that match you to your first paid tests.</p>
              </div>
            )}

            <div className={`${s.notice} ${s.noticeOk}`}>We&apos;ll text or email you when a paid test matches your platforms and state. Nothing else to do until then.</div>

            <div style={{ marginTop: 24 }}>
              {verify === 'verified' ? (
                <div className={`${s.notice} ${s.noticeOk}`}>Email verified ✓ &nbsp;You&apos;re logged in — <a href="/research/dashboard" style={{ color: 'inherit', fontWeight: 700 }}>open your dashboard →</a></div>
              ) : (
                <form onSubmit={verifyCode}>
                  <label className={s.label}>Verify your email now (optional) — enter the 6-digit code from the welcome email</label>
                  <div className={s.formRow}>
                    <input className={s.input} inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="123456" value={code}
                      onChange={(e) => { setCode(e.target.value.replace(/\D/g, '')); if (verify === 'error') setVerify('idle') }} />
                    <button type="submit" className={`${s.btn} ${s.btnPrimary}`} disabled={code.trim().length !== 6 || verify === 'checking'}>
                      {verify === 'checking' ? 'Checking…' : 'Verify'}
                    </button>
                  </div>
                  {verify === 'error' && <p className={s.err}>That code didn&apos;t work — it may have expired or already been used. The email button works just as well.</p>}
                </form>
              )}
            </div>
          </>
        ) : (
          <>
            <span className={s.eyebrow}>Apply to test</span>
            <h1 className={s.h2}>Get paid $10–$100 per test.</h1>
            <p className={s.lede} style={{ marginBottom: 20 }}>Two minutes to apply. We match you to paid tests by platform, age and state, then text or email you when one is ready. Payout depends on how long the test takes and what it requires:</p>
            <div className={s.tiers}>
              {PAYOUT_TIERS.map((t) => (
                <div key={t.key} className={s.tier}>
                  <div className={s.tierPay}>${t.pay}{t.max > t.pay ? `–$${t.max}` : ''}</div>
                  <div className={s.itemName}>{t.label}</div>
                  <div className={s.small}>~{t.minutes} min · {t.desc}</div>
                </div>
              ))}
            </div>

            <form className={s.form} onSubmit={submit}>
              <div className={s.formRow}>
                <Field label="First name" value={f.first_name} onChange={up('first_name')} required />
                <Field label="Last name" value={f.last_name} onChange={up('last_name')} />
              </div>
              <Field label="Email" type="email" value={f.email} onChange={up('email')} required />
              <Field label="Mobile number (for text alerts)" type="tel" value={f.phone} onChange={up('phone')} placeholder="(555) 555-5555" />
              <div className={s.formRow}>
                <div>
                  <label className={s.label}>State</label>
                  <select className={s.select} value={f.state} onChange={up('state')} required>
                    <option value="">Select…</option>
                    {US_STATES.map((st) => <option key={st} value={st}>{st}</option>)}
                  </select>
                </div>
                <div>
                  <label className={s.label}>Age</label>
                  <select className={s.select} value={f.age_bucket} onChange={up('age_bucket')} required>
                    <option value="">Select…</option>
                    <option value="21+">21 or older</option>
                    <option value="18-20">18–20</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={s.label}>Apps you already have an account on</label>
                <div className={s.chips}>
                  {platforms.map((p) => (
                    <button type="button" key={p.slug} className={`${s.chip} ${picked.includes(p.slug) ? s.chipOn : ''}`} onClick={() => toggle(picked, setPicked, p.slug)}>
                      {p.name} <span style={{ opacity: 0.6 }}>· {p.kind}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={s.label}>What are you into?</label>
                <div className={s.chips}>
                  {VERTICALS.map((v) => (
                    <button type="button" key={v} className={`${s.chip} ${verts.includes(v) ? s.chipOn : ''}`} onClick={() => toggle(verts, setVerts, v)}>{v}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className={s.label}>How should we pay you? (can add later)</label>
                <div className={s.formRow}>
                  <select className={s.select} value={f.payout_method} onChange={up('payout_method')}>
                    <option value="">Choose…</option>
                    {PAYOUT_METHODS.map((m) => <option key={m.key} value={m.key}>{m.label}</option>)}
                  </select>
                  <input className={s.input} value={f.payout_handle} onChange={up('payout_handle')} placeholder={PAYOUT_METHODS.find((m) => m.key === f.payout_method)?.hint || 'Handle'} disabled={!f.payout_method} />
                </div>
              </div>
              <Field label="How did you hear about us? (optional)" value={f.referral_source} onChange={up('referral_source')} />
              <Field label="Referral code (optional)" value={f.referral_code} onChange={up('referral_code')} placeholder="e.g. SIGMACHI-PSU" />

              <label className={s.check}>
                <input type="checkbox" checked={f.sms_opt_in} onChange={up('sms_opt_in')} />
                <span>Text me when a paid test is available. Msg &amp; data rates may apply; reply STOP to opt out.</span>
              </label>

              {err && <p className={s.err}>{err}</p>}
              <button type="submit" className={`${s.btn} ${s.btnPrimary}`} disabled={status === 'sending'}>
                {status === 'sending' ? 'Submitting…' : 'Apply to test'}
              </button>
              <p className={s.small}>Must be 18+ (21+ for sportsbook, casino and prediction-market tests). Real-money tests only run in states where the platform is licensed.</p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

function Field({ label, type = 'text', value, onChange, required, placeholder }: {
  label: string; type?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean; placeholder?: string
}) {
  return (
    <div>
      <label className={s.label}>{label}</label>
      <input type={type} required={required} value={value} onChange={onChange} placeholder={placeholder} className={s.input} />
    </div>
  )
}
