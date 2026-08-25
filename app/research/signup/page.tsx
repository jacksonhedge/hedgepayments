'use client'

import { useEffect, useState } from 'react'
import s from '../research.module.css'
import { supabaseBrowser } from '../../utils/supabase-browser'
import { US_STATES, VERTICALS } from '../testerConfig'

type Platform = { slug: string; name: string; kind: string; min_age: number }

export default function ResearchSignup() {
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [f, setF] = useState({ first_name: '', last_name: '', email: '', phone: '', state: '', age_bucket: '', sms_opt_in: true, referral_source: '' })
  const [picked, setPicked] = useState<string[]>([])
  const [verts, setVerts] = useState<string[]>([])
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [err, setErr] = useState('')

  useEffect(() => {
    supabaseBrowser.from('research_platforms').select('slug,name,kind,min_age').eq('active', true).order('name')
      .then(({ data }) => setPlatforms(data || []))
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
        body: JSON.stringify({ ...f, platforms: picked, verticals: verts }),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || 'Something went wrong')
      // Passwordless login: magic link drops them on the dashboard.
      const { error } = await supabaseBrowser.auth.signInWithOtp({
        email: f.email.trim().toLowerCase(),
        options: { emailRedirectTo: `${window.location.origin}/research/dashboard` },
      })
      if (error) throw error
      setStatus('sent')
    } catch (e: any) {
      setErr(e.message || 'Something went wrong'); setStatus('error')
    }
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
            <h1 className={s.h2}>Check your email.</h1>
            <p className={s.lede}>We sent a login link to <strong style={{ color: 'var(--ink)' }}>{f.email}</strong>. Open it to reach your tester dashboard, where you&apos;ll see the tests you&apos;re matched to and get paid for.</p>
            <div className={`${s.notice} ${s.noticeOk}`}>We&apos;ll text or email you when a paid test matches your platforms and state. Nothing to do until then.</div>
          </>
        ) : (
          <>
            <span className={s.eyebrow}>Apply to test</span>
            <h1 className={s.h2}>Get paid to test the apps you already use.</h1>
            <p className={s.lede} style={{ marginBottom: 28 }}>Two minutes. We match you to paid tests by platform, age and state, then text or email you when one is ready.</p>

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

              <Field label="How did you hear about us? (optional)" value={f.referral_source} onChange={up('referral_source')} />

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
