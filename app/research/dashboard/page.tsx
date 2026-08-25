'use client'

import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import s from '../research.module.css'
import { supabaseBrowser } from '../../utils/supabase-browser'
import { ASSIGNMENT_LABEL, TESTER_STATUS_LABEL } from '../testerConfig'

type Tester = { id: string; first_name: string; email: string; phone: string | null; state: string; age_bucket: string; platforms: string[]; status: string; sms_opt_in: boolean; email_opt_in: boolean }
type Assignment = { id: string; status: string; submission_url: string | null; tester_notes: string | null; paid_at: string | null; research_tests: { id: string; title: string; description: string | null; instructions: string | null; payout_cents: number; status: string; starts_at: string | null; ends_at: string | null; research_platforms: { name: string; kind: string } | null } }
type Platform = { slug: string; name: string; kind: string }
type Msg = { id: string; channel: string; subject: string | null; body: string; sent_at: string }

export default function TesterDashboard() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [tester, setTester] = useState<Tester | null>(null)
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [messages, setMessages] = useState<Msg[]>([])
  const [loginEmail, setLoginEmail] = useState('')
  const [loginState, setLoginState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [busy, setBusy] = useState<string | null>(null)

  useEffect(() => {
    supabaseBrowser.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabaseBrowser.auth.onAuthStateChange((_e, sess) => setSession(sess))
    return () => sub.subscription.unsubscribe()
  }, [])

  const load = async () => {
    const [t, a, p, m] = await Promise.all([
      supabaseBrowser.from('research_testers').select('*').maybeSingle(),
      supabaseBrowser.from('research_assignments').select('*, research_tests(*, research_platforms(name,kind))').order('created_at', { ascending: false }),
      supabaseBrowser.from('research_platforms').select('slug,name,kind').eq('active', true).order('name'),
      supabaseBrowser.from('research_messages').select('id,channel,subject,body,sent_at').order('sent_at', { ascending: false }).limit(20),
    ])
    setTester(t.data as Tester | null)
    setAssignments((a.data || []) as Assignment[])
    setPlatforms(p.data || [])
    setMessages(m.data || [])
  }
  useEffect(() => { if (session) load() }, [session])

  const sendLink = async (e: React.FormEvent) => {
    e.preventDefault(); setLoginState('sending')
    const { error } = await supabaseBrowser.auth.signInWithOtp({ email: loginEmail.trim().toLowerCase(), options: { emailRedirectTo: `${window.location.origin}/research/dashboard` } })
    setLoginState(error ? 'error' : 'sent')
  }

  const setAssignment = async (id: string, patch: Partial<Assignment>) => {
    setBusy(id)
    await supabaseBrowser.from('research_assignments').update(patch).eq('id', id)
    await load(); setBusy(null)
  }
  const togglePlatform = async (slug: string) => {
    if (!tester) return
    const next = tester.platforms.includes(slug) ? tester.platforms.filter((x) => x !== slug) : [...tester.platforms, slug]
    await supabaseBrowser.from('research_testers').update({ platforms: next }).eq('id', tester.id)
    setTester({ ...tester, platforms: next })
  }
  const toggleOpt = async (k: 'sms_opt_in' | 'email_opt_in') => {
    if (!tester) return
    await supabaseBrowser.from('research_testers').update({ [k]: !tester[k] }).eq('id', tester.id)
    setTester({ ...tester, [k]: !tester[k] })
  }

  const Nav = (
    <nav className={s.nav}>
      <div className={s.navInner}>
        <a href="/research" className={s.logo}>
          <img src="/favicon/hedge-logo.svg" alt="" className={s.logoMark} />
          <span>HEDGE</span><span className={s.logoSub}>Research</span>
        </a>
        {session ? (
          <button className={s.back} style={{ background: 'none', border: 0, cursor: 'pointer', font: 'inherit' }} onClick={() => supabaseBrowser.auth.signOut()}>Log out</button>
        ) : <a href="/research/signup" className={s.back}>New here? Apply →</a>}
      </div>
    </nav>
  )

  if (session === undefined) return <div className={s.root}>{Nav}<div className={s.narrow}><p className={s.small}>Loading…</p></div></div>

  if (!session) {
    return (
      <div className={s.root}>{Nav}
        <div className={s.narrow}>
          <span className={s.eyebrow}>Tester login</span>
          <h1 className={s.h2}>Sign in with a magic link.</h1>
          <p className={s.lede}>No password. Enter the email you applied with and we&apos;ll send a one-tap login link.</p>
          {loginState === 'sent' ? (
            <div className={`${s.notice} ${s.noticeOk}`}>Link sent to {loginEmail}. Open it on this device to land in your dashboard.</div>
          ) : (
            <form className={s.form} onSubmit={sendLink}>
              <div><label className={s.label}>Email</label><input type="email" required className={s.input} value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} /></div>
              {loginState === 'error' && <p className={s.err}>Couldn&apos;t send the link. Check the address and try again.</p>}
              <button className={`${s.btn} ${s.btnPrimary}`} disabled={loginState === 'sending'}>{loginState === 'sending' ? 'Sending…' : 'Email me a link'}</button>
            </form>
          )}
        </div>
      </div>
    )
  }

  if (tester === null) {
    return (
      <div className={s.root}>{Nav}
        <div className={s.narrow}>
          <h1 className={s.h2}>No tester profile for {session.user.email}.</h1>
          <p className={s.lede}>You&apos;re logged in, but haven&apos;t applied with this email yet.</p>
          <a className={`${s.btn} ${s.btnPrimary}`} href="/research/signup">Apply to test</a>
        </div>
      </div>
    )
  }

  const active = assignments.filter((a) => !['paid', 'declined'].includes(a.status))
  const paidCents = assignments.filter((a) => a.status === 'paid').reduce((n, a) => n + (a.research_tests?.payout_cents || 0), 0)
  const money = (c: number) => `$${(c / 100).toFixed(0)}`

  return (
    <div className={s.root}>{Nav}
      <div className={s.narrow} style={{ maxWidth: 760 }}>
        <span className={s.eyebrow}>{TESTER_STATUS_LABEL[tester.status] || tester.status}</span>
        <h1 className={s.h2}>Hey {tester.first_name}.</h1>
        <p className={s.sub}>{tester.state} · {tester.age_bucket} · {tester.phone ? 'Text alerts ' + (tester.sms_opt_in ? 'on' : 'off') : 'No phone on file'}</p>

        <div className={s.stats}>
          <div className={s.stat}><div className={s.statNum}>{active.length}</div><div className={s.statLabel}>Open tests</div></div>
          <div className={s.stat}><div className={s.statNum}>{assignments.filter((a) => ['approved', 'paid'].includes(a.status)).length}</div><div className={s.statLabel}>Completed</div></div>
          <div className={s.stat}><div className={s.statNum}>{money(paidCents)}</div><div className={s.statLabel}>Paid out</div></div>
        </div>

        <h2 className={s.h2} style={{ fontSize: 20 }}>Your tests</h2>
        {assignments.length === 0 && <div className={s.notice}>Nothing yet. We&apos;ll text or email you when a paid test matches your platforms and state.</div>}
        {assignments.map((a) => {
          const t = a.research_tests
          return (
            <div key={a.id} className={s.testCard}>
              <div className={s.testHead}>
                <div>
                  <div className={s.itemName}>{t.title}</div>
                  <div className={s.small}>{t.research_platforms?.name || 'Platform TBD'} · {money(t.payout_cents)} payout{t.ends_at ? ` · due ${new Date(t.ends_at).toLocaleDateString()}` : ''}</div>
                </div>
                <span className={`${s.pill} ${a.status === 'paid' ? s.pillPaid : ['accepted', 'in_progress'].includes(a.status) ? s.pillLive : ''}`}>{ASSIGNMENT_LABEL[a.status] || a.status}</span>
              </div>
              {t.description && <p className={s.small}>{t.description}</p>}
              {['accepted', 'in_progress'].includes(a.status) && t.instructions && (
                <div className={s.notice}><strong style={{ color: 'var(--ink)' }}>Instructions</strong><br />{t.instructions}</div>
              )}
              <div className={s.row} style={{ gap: 8 }}>
                {a.status === 'invited' && <>
                  <button className={`${s.btnSm} ${s.btnSmPrimary}`} disabled={busy === a.id} onClick={() => setAssignment(a.id, { status: 'accepted' })}>Accept</button>
                  <button className={s.btnSm} disabled={busy === a.id} onClick={() => setAssignment(a.id, { status: 'declined' })}>Decline</button>
                </>}
                {a.status === 'accepted' && <button className={`${s.btnSm} ${s.btnSmPrimary}`} disabled={busy === a.id} onClick={() => setAssignment(a.id, { status: 'in_progress' })}>Start test</button>}
                {a.status === 'in_progress' && <SubmitForm busy={busy === a.id} onSubmit={(url, notes) => setAssignment(a.id, { status: 'submitted', submission_url: url, tester_notes: notes })} />}
                {a.status === 'submitted' && <span className={s.small}>Under review — we&apos;ll approve and pay within a few days.</span>}
                {a.status === 'paid' && a.paid_at && <span className={s.small}>Paid {new Date(a.paid_at).toLocaleDateString()}</span>}
              </div>
            </div>
          )
        })}

        <h2 className={s.h2} style={{ fontSize: 20, marginTop: 40 }}>Your platforms</h2>
        <p className={s.small} style={{ marginBottom: 8 }}>Tap to update which apps you have accounts on — it changes which tests you get matched to.</p>
        <div className={s.chips}>
          {platforms.map((p) => (
            <button key={p.slug} className={`${s.chip} ${tester.platforms.includes(p.slug) ? s.chipOn : ''}`} onClick={() => togglePlatform(p.slug)}>{p.name} <span style={{ opacity: 0.6 }}>· {p.kind}</span></button>
          ))}
        </div>

        <h2 className={s.h2} style={{ fontSize: 20, marginTop: 40 }}>Notifications</h2>
        <label className={s.check}><input type="checkbox" checked={tester.email_opt_in} onChange={() => toggleOpt('email_opt_in')} /><span>Email me about new tests</span></label>
        <label className={s.check}><input type="checkbox" checked={tester.sms_opt_in} disabled={!tester.phone} onChange={() => toggleOpt('sms_opt_in')} /><span>Text me about new tests{!tester.phone && ' (no phone on file)'}</span></label>

        {messages.length > 0 && <>
          <h2 className={s.h2} style={{ fontSize: 20, marginTop: 40 }}>Recent messages from Hedge</h2>
          {messages.map((m) => (
            <div key={m.id} className={s.testCard} style={{ gap: 4 }}>
              <div className={s.small}><span className={s.pill}>{m.channel}</span> &nbsp;{new Date(m.sent_at).toLocaleString()}</div>
              {m.subject && <div className={s.itemName}>{m.subject}</div>}
              <div className={s.small} style={{ color: 'var(--ink)', whiteSpace: 'pre-wrap' }}>{m.body}</div>
            </div>
          ))}
        </>}
      </div>
    </div>
  )
}

function SubmitForm({ busy, onSubmit }: { busy: boolean; onSubmit: (url: string, notes: string) => void }) {
  const [url, setUrl] = useState(''); const [notes, setNotes] = useState('')
  return (
    <div style={{ display: 'grid', gap: 8, width: '100%' }}>
      <input className={s.input} placeholder="Screen recording link (Drive, Loom, iCloud…)" value={url} onChange={(e) => setUrl(e.target.value)} />
      <input className={s.input} placeholder="Anything we should know? (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
      <div><button className={`${s.btnSm} ${s.btnSmPrimary}`} disabled={busy || !url} onClick={() => onSubmit(url, notes)}>Submit test</button></div>
    </div>
  )
}
