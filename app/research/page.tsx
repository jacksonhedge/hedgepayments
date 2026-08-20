'use client'

import { useState } from 'react'
import s from './research.module.css'

// Hedge Research — sportsbook, casino & payments product research, run on a
// network of 20,000+ real users across the products and communities Hedge
// already operates. Deliberately simple & monochrome (unlike the arcade homepage);
// the header is just the HEDGE mark linking home.

const SOURCES = [
  {
    name: 'FraternityBase network',
    desc: 'Chapter members across hundreds of fraternities and universities nationwide — the 21+ college cohort every sportsbook is fighting to acquire. Recruited chapter-by-chapter, verified by roster.',
  },
  {
    name: 'SideBet & Chance™ users',
    desc: 'Live users of the products built on Hedge rails: people who already deposit, wager, cash out and win-it-back on real money, every week.',
  },
  {
    name: 'Street Corner Casino',
    desc: 'Participants and hosts from our on-campus casino-night events — opted in, ID-verified and located in licensed states.',
  },
  {
    name: 'FantasyLink connectors',
    desc: 'Fantasy players who have linked Sleeper, ESPN and Yahoo leagues through FantasyLink — engaged, multi-app sports users.',
  },
]

const SERVICES = [
  {
    name: 'Product Testing',
    desc: 'Scripted tests of your app against industry benchmarks across the whole journey — registration, KYC, deposit, bet placement, cash-out, withdrawal.',
  },
  {
    name: 'Wallet Benchmarks',
    desc: 'Deposit/withdrawal speed, approval rates, fees and rail coverage measured side-by-side with competitors. We run payments rails — we know where money gets stuck.',
  },
  {
    name: 'Competitive Analysis',
    desc: 'Surveys, interviews and journey evaluations from the network that show where you sit in the market and why users pick someone else.',
  },
  {
    name: 'Subscription Research',
    desc: 'Recurring reports on online performance, promo effectiveness and payments UX, sourced directly from sports betting and iGaming customer behavior.',
  },
]

const STEPS = [
  { n: '01', title: 'Scope', desc: 'Journeys, operators, states and the tester segments you want.' },
  { n: '02', title: 'Recruit', desc: 'Matched from the 20,000+ network and verified for age, location and eligibility.' },
  { n: '03', title: 'Test', desc: 'Real accounts, real money. Screen-recorded, timestamped, scored.' },
  { n: '04', title: 'Report', desc: 'Benchmarks, findings and a prioritized fix list.' },
]

type FormState = { name: string; email: string; company: string; title: string; message: string }
const EMPTY: FormState = { name: '', email: '', company: '', title: '', message: '' }

export default function ResearchPage() {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const update = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/research-inquiry', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('bad status')
      setStatus('sent')
      setForm(EMPTY)
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className={s.root}>
      <nav className={s.nav}>
        <div className={s.navInner}>
          <a href="/" className={s.logo}>HEDGE</a>
          <a href="/" className={s.back}>← Back to Hedge</a>
        </div>
      </nav>

      <header className={`${s.shell} ${s.hero}`}>
        <span className={s.eyebrow}>Hedge Research</span>
        <h1 className={s.h1}>Sportsbook &amp; casino research from 20,000+ real testers.</h1>
        <p className={s.lede}>
          Market research, consumer insights and competitive benchmarks — run on real products, with real money,
          by real users drawn from the communities Hedge already operates.
        </p>
        <div className={s.row}>
          <a className={`${s.btn} ${s.btnPrimary}`} href="#contact">Request a proposal</a>
          <a className={s.btn} href="#network">See the network</a>
        </div>
      </header>

      <section id="network" className={s.section}>
        <div className={`${s.shell} ${s.network}`}>
          <div>
            <span className={s.eyebrow}>The tester network</span>
            <p className={s.bigNum}>20,000+</p>
            <p className={s.bigLabel}>Verified, 21+, opted-in testers</p>
            <p className={s.sub}>
              We don&apos;t rent a panel. The testers are the users of the products and communities we already
              run — so they&apos;re already depositing, betting and cashing out on live operators.
            </p>
          </div>
          <ul className={s.list}>
            {SOURCES.map((src) => (
              <li key={src.name} className={s.item}>
                <p className={s.itemName}>{src.name}</p>
                <p className={s.itemDesc}>{src.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.shell}>
          <h2 className={s.h2}>What Hedge Research does for you</h2>
          <p className={s.sub} style={{ marginBottom: 32 }}>
            Four engagements, every one run on the network above and delivered with benchmarks you can act on.
          </p>
          <div className={s.grid}>
            {SERVICES.map((svc) => (
              <div key={svc.name} className={s.card}>
                <h3 className={s.cardTitle}>{svc.name}</h3>
                <p className={s.cardDesc}>{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.shell}>
          <h2 className={s.h2} style={{ marginBottom: 32 }}>How an engagement works</h2>
          <div className={s.steps}>
            {STEPS.map((st) => (
              <div key={st.n}>
                <div className={s.stepNum}>{st.n}</div>
                <h3 className={s.stepTitle}>{st.title}</h3>
                <p className={s.cardDesc}>{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className={s.section}>
        <div className={s.shell}>
          <h2 className={s.h2}>Talk to the research team</h2>
          <p className={s.sub}>Tell us what you want to learn and we&apos;ll come back with a scope and a quote.</p>

          {status === 'sent' ? (
            <div className={s.sent}>Thanks — we&apos;ll be in touch within one business day.</div>
          ) : (
            <form onSubmit={submit} className={s.form}>
              <div className={s.formRow}>
                <Field label="Name*" value={form.name} onChange={update('name')} required />
                <Field label="Work email*" type="email" value={form.email} onChange={update('email')} required />
              </div>
              <div className={s.formRow}>
                <Field label="Company*" value={form.company} onChange={update('company')} required />
                <Field label="Title" value={form.title} onChange={update('title')} />
              </div>
              <div>
                <label className={s.label}>Message*</label>
                <textarea
                  rows={5}
                  required
                  value={form.message}
                  onChange={update('message')}
                  className={s.input}
                  placeholder="What product, markets and journeys do you want tested?"
                />
              </div>
              {status === 'error' && (
                <p className={s.err}>Something went wrong — email research@hedgepayments.com instead.</p>
              )}
              <div>
                <button type="submit" disabled={status === 'sending'} className={`${s.btn} ${s.btnPrimary}`}>
                  {status === 'sending' ? 'Sending…' : 'Submit'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      <footer className={s.footer}>
        <div className={s.shell}>
          © {new Date().getFullYear()} Hedge · <a href="/">hedgepayments.com</a>
        </div>
      </footer>
    </div>
  )
}

function Field({
  label,
  type = 'text',
  value,
  onChange,
  required,
}: {
  label: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
}) {
  return (
    <div>
      <label className={s.label}>{label}</label>
      <input type={type} required={required} value={value} onChange={onChange} className={s.input} />
    </div>
  )
}
