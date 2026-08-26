'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import s from '../../research.module.css'
import { evaluate, type Screener, type Question, type Answers } from '@/lib/research/screeners'
import { captureAttribution } from '@/lib/research/attribution'

// One-question-at-a-time screener (Great Question style): earlier answers stay
// visible above, greyed out; "X of N" counter; details + consent on the last step.
export default function ScreenerPage() {
  const { slug } = useParams<{ slug: string }>()
  const eid = useSearchParams().get('eid')
  const [sc, setSc] = useState<Screener | null>(null)
  const [invitee, setInvitee] = useState<{ email: string; full_name: string; already: boolean } | null>(null)
  const [loadErr, setLoadErr] = useState('')
  const [answers, setAnswers] = useState<Answers>({})
  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState<string | string[]>('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState({ storage: false, deletion: false, future: false })
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [result, setResult] = useState<{ qualified: boolean } | null>(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    fetch(`/api/research/screener/${slug}${eid ? `?eid=${eid}` : ''}`).then(async (r) => {
      const j = await r.json()
      if (!r.ok) return setLoadErr(j.error || 'Not available')
      setSc(j.screener); setInvitee(j.invitee)
      if (j.invitee) { setFullName(j.invitee.full_name); setEmail(j.invitee.email) }
    }).catch(() => setLoadErr('Could not load'))
  }, [slug, eid])

  const qs: Question[] = sc?.questions || []
  const total = qs.length
  const disq = useMemo(() => evaluate(qs, answers), [qs, answers])
  const ended = !disq.qualified   // hit a disqualifying answer → skip to consent/submit
  const q = qs[step]
  const onLast = ended || step >= total - 1

  const resetDraft = (nq?: Question) => setDraft(nq?.type === 'multi' ? [] : '')
  const commit = () => {
    if (!q) return
    const empty = draft === '' || (Array.isArray(draft) && !draft.length)
    if (q.required !== false && empty) return setErr('This question is required')
    setErr('')
    const next = { ...answers, [q.id]: draft }
    setAnswers(next)
    if (step < total - 1 && evaluate(qs, next).qualified) { setStep(step + 1); resetDraft(qs[step + 1]) }
    else setStep(Math.min(step + 1, total))
  }
  const toggleMulti = (opt: string) => {
    const cur = Array.isArray(draft) ? draft : []
    if (q?.exclusive && opt === q.exclusive) return setDraft(cur.includes(opt) ? [] : [opt])
    const without = cur.filter((x) => x !== q?.exclusive)
    setDraft(without.includes(opt) ? without.filter((x) => x !== opt) : [...without, opt])
  }

  const submit = async () => {
    if (!consent.storage || !consent.deletion) return setErr('Please confirm the two required consents')
    if (!invitee && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setErr('Valid email required')
    setState('sending'); setErr('')
    try {
      const r = await fetch(`/api/research/screener/${slug}`, { method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ eid, email, full_name: fullName, answers, consent, attribution: captureAttribution() }) })
      const j = await r.json()
      if (!r.ok) throw new Error(j.error || 'Could not submit')
      setResult({ qualified: j.qualified }); setState('done')
    } catch (e: any) { setErr(e.message); setState('error') }
  }

  const Nav = (
    <nav className={s.nav}><div className={s.navInner}>
      <a href="/research" className={s.logo}><img src="/favicon/hedge-logo.svg" alt="" className={s.logoMark} /><span>HEDGE</span><span className={s.logoSub}>Research</span></a>
      {sc && step < total && !ended && <span className={s.small}>{step + 1} of {total}</span>}
    </div></nav>
  )

  if (loadErr) return <div className={s.root}>{Nav}<div className={s.narrow}><h1 className={s.h2}>{loadErr}</h1><p className={s.lede}>This questionnaire isn&apos;t taking responses right now.</p></div></div>
  if (!sc) return <div className={s.root}>{Nav}<div className={s.narrow}><p className={s.small}>Loading…</p></div></div>
  if (invitee?.already && state !== 'done') return <div className={s.root}>{Nav}<div className={s.narrow}><h1 className={s.h2}>You&apos;ve already completed this.</h1><p className={s.lede}>We have your answers on file. If you were selected, a scheduling email is on its way.</p><a className={s.btn} href="/research/dashboard">Go to dashboard →</a></div></div>

  if (state === 'done' && result) {
    return <div className={s.root}>{Nav}<div className={s.narrow}>
      <span className={s.eyebrow}>{result.qualified ? 'Submitted' : 'Thanks'}</span>
      <h1 className={s.h2}>{result.qualified ? 'You qualify — watch for a scheduling text or email.' : 'Not a match for this study.'}</h1>
      <p className={s.lede}>{result.qualified ? 'Slots are first-come, first-served. The test now shows in your dashboard.' : 'You didn\'t meet the criteria for this one, but we\'ll keep you in the pool for future paid tests that fit.'}</p>
      <a className={`${s.btn} ${s.btnPrimary}`} href="/research/dashboard">Tester dashboard →</a>
    </div></div>
  }

  const answeredIds = qs.slice(0, ended ? total : step).filter((x) => x.id in answers)

  return (
    <div className={s.root}>{Nav}
      <div className={s.narrow}>
        <span className={s.eyebrow}>Screener</span>
        <h1 className={s.h2} style={{ marginBottom: 24 }}>{sc.title}</h1>
        {step === 0 && sc.intro && <div className={s.notice} style={{ marginBottom: 24, whiteSpace: 'pre-wrap' }}>{sc.intro}</div>}

        {answeredIds.map((x, i) => (
          <div key={x.id} className={s.answered}>
            <div className={s.small}>{i + 1}. {x.prompt}</div>
            <div className={s.answeredVal}>{Array.isArray(answers[x.id]) ? (answers[x.id] as string[]).join(', ') : answers[x.id]}</div>
          </div>
        ))}

        {!ended && q && (
          <div className={s.qCard}>
            <div className={s.small} style={{ marginBottom: 6 }}>{step + 1} of {total} · {q.required !== false ? 'Required' : 'Optional'}</div>
            <div className={s.qPrompt}>{q.prompt}</div>
            {q.help && <p className={s.small}>{q.help}</p>}
            {q.type === 'text' && <input className={s.input} value={draft as string} onChange={(e) => setDraft(e.target.value)} autoFocus onKeyDown={(e) => e.key === 'Enter' && commit()} />}
            {q.type === 'yesno' && <div className={s.chips}>{['Yes', 'No'].map((o) => <button key={o} type="button" className={`${s.chip} ${draft === o ? s.chipOn : ''}`} onClick={() => setDraft(o)}>{o}</button>)}</div>}
            {q.type === 'single' && <div className={s.optList}>{(q.options || []).map((o) => (
              <label key={o} className={`${s.opt} ${draft === o ? s.optOn : ''}`}><input type="radio" name={q.id} checked={draft === o} onChange={() => setDraft(o)} /> {o}</label>))}</div>}
            {q.type === 'multi' && <div className={s.optList}>{(q.options || []).map((o) => {
              const on = Array.isArray(draft) && draft.includes(o); const isEx = q.exclusive === o
              return <label key={o} className={`${s.opt} ${on ? s.optOn : ''} ${isEx ? s.optEx : ''}`}><input type={isEx ? 'radio' : 'checkbox'} checked={on} onChange={() => toggleMulti(o)} /> {o}</label>
            })}</div>}
            {err && <p className={s.err}>{err}</p>}
            <div><button className={`${s.btn} ${s.btnPrimary}`} onClick={commit}>Continue</button></div>
          </div>
        )}

        {onLast && (step >= total || ended) && (
          <div className={s.qCard}>
            <div className={s.qPrompt}>Your details</div>
            <div><label className={s.label}>Your full name</label><input className={s.input} value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
            <div><label className={s.label}>Your email address</label><input className={s.input} type="email" value={email} readOnly={!!invitee} onChange={(e) => setEmail(e.target.value)} style={invitee ? { opacity: 0.6 } : undefined} />
              {invitee && <p className={s.small}>Locked to the invitation this link was sent to.</p>}</div>
            <label className={s.check}><input type="checkbox" checked={consent.storage} onChange={(e) => setConsent({ ...consent, storage: e.target.checked })} /><span>I understand that my data is stored for research purposes by Hedge Research. <em>(required)</em></span></label>
            <label className={s.check}><input type="checkbox" checked={consent.deletion} onChange={(e) => setConsent({ ...consent, deletion: e.target.checked })} /><span>I understand that I can request my research participation data be deleted at any time. <em>(required)</em></span></label>
            <label className={s.check}><input type="checkbox" checked={consent.future} onChange={(e) => setConsent({ ...consent, future: e.target.checked })} /><span>I opt in to being contacted for future paid studies.</span></label>
            {err && <p className={s.err}>{err}</p>}
            <div><button className={`${s.btn} ${s.btnPrimary}`} disabled={state === 'sending'} onClick={submit}>{state === 'sending' ? 'Submitting…' : 'Submit'}</button></div>
          </div>
        )}
      </div>
    </div>
  )
}
