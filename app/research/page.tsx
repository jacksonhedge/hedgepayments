'use client'

import { useState } from 'react'
import arcade from '../components/ArcadeLanding.module.css'
import s from './research.module.css'

// Hedge Research — sportsbook, casino & payments product research, run on a
// network of 20,000+ real users across the products and communities Hedge
// already operates. Same arcade-neon theme as the homepage; the header is just
// the HEDGE mark linking home.

const SOURCES = [
  {
    name: 'FraternityBase network',
    accent: 'var(--gold)',
    desc: 'Chapter members across hundreds of fraternities and universities nationwide — the 21+ college cohort every sportsbook is fighting to acquire. Recruited chapter-by-chapter, verified by roster.',
  },
  {
    name: 'SideBet & Chance™ users',
    accent: 'var(--violet)',
    desc: 'Live users of the products built on Hedge rails: people who already deposit, wager, cash out and win-it-back on real money, every week.',
  },
  {
    name: 'Street Corner Casino',
    accent: 'var(--magenta)',
    desc: 'Participants and hosts from our on-campus casino-night events — opted in, ID-verified and located in licensed states.',
  },
  {
    name: 'FantasyLink connectors',
    accent: 'var(--cyan)',
    desc: 'Fantasy players who have linked Sleeper, ESPN and Yahoo leagues through FantasyLink — engaged, multi-app sports users.',
  },
]

const SERVICES = [
  {
    tag: 'QA · END TO END',
    name: 'Product Testing',
    accent: 'var(--cyan)',
    desc: 'Scripted tests of your app against industry benchmarks across the whole journey — registration, KYC, deposit, bet placement, cash-out, withdrawal.',
  },
  {
    tag: 'PAYMENTS · RAILS',
    name: 'Wallet Benchmarks',
    accent: 'var(--lime)',
    desc: 'Deposit/withdrawal speed, approval rates, fees and rail coverage measured side-by-side with competitors. We run payments rails — we know where money gets stuck.',
  },
  {
    tag: 'MARKET · CONSUMER',
    name: 'Competitive Analysis',
    accent: 'var(--magenta)',
    desc: 'Surveys, interviews and journey evaluations from the network that show where you sit in the market and why users pick someone else.',
  },
  {
    tag: 'MONTHLY · REPORTS',
    name: 'Subscription Research',
    accent: 'var(--gold)',
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
    <div className={arcade.root}>
      <div className={arcade.scanlines} aria-hidden />
      <div className={arcade.vignette} aria-hidden />

      {/* Header: logo only, links home */}
      <nav className={arcade.nav}>
        <div className={arcade.navInner}>
          <a href="/" className={arcade.logo}>HEDGE</a>
          <a href="/" className={arcade.navLink}>← Back to Hedge</a>
        </div>
      </nav>

      {/* Hero */}
      <header className={`${arcade.shell} ${s.heroCenter}`}>
        <span className={arcade.eyebrow}>
          <span className={arcade.dot} /> Hedge Research
        </span>
        <h1 className={arcade.h1}>
          Sportsbook &amp; Casino <span className={arcade.neonMag}>research</span>
          <br />
          from <span className={arcade.neonLime}>20,000+</span> real testers.
        </h1>
        <p className={s.lede}>
          Market research, consumer insights and competitive benchmarks — run on real products, with real money,
          by real users drawn from the communities Hedge already operates.
        </p>
        <div className={s.heroRow}>
          <a className={`${arcade.btn} ${arcade.btnPrimary}`} href="#contact">Request a proposal</a>
          <a className={`${arcade.btn} ${arcade.btnGhost}`} href="#network">See the network</a>
        </div>
      </header>

      {/* The network */}
      <section id="network" className={arcade.section}>
        <div className={arcade.shell}>
          <div className={s.bigStat}>
            <div>
              <span className={arcade.kicker}>The tester network</span>
              <p className={s.bigNum}>20,000+</p>
              <div className={s.bigLabel}>Verified, 21+, opted-in testers</div>
              <p className={s.bigSub}>
                We don&apos;t rent a panel. The testers are the users of the products and communities we
                already run — so they&apos;re already depositing, betting and cashing out on live operators.
              </p>
            </div>
            <ul className={s.sources}>
              {SOURCES.map((src) => (
                <li key={src.name} className={s.source} style={{ ['--accent' as string]: src.accent }}>
                  <span className={s.sourceDot} />
                  <div>
                    <p className={s.sourceName}>{src.name}</p>
                    <p className={s.sourceDesc}>{src.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className={arcade.section}>
        <div className={arcade.shell}>
          <div className={arcade.sectionHead}>
            <span className={arcade.kicker}>Select a game</span>
            <h2 className={arcade.h2}>What Hedge Research does for you</h2>
            <p className={arcade.sectionLede}>
              Four engagements, every one run on the network above and delivered with benchmarks you can act on.
            </p>
          </div>
          <div className={arcade.cabGrid}>
            {SERVICES.map((svc) => (
              <div key={svc.name} className={arcade.cab} style={{ ['--accent' as string]: svc.accent }}>
                <div className={arcade.cabTag}>{svc.tag}</div>
                <h3 className={arcade.cabName}>{svc.name}</h3>
                <p className={arcade.cabDesc}>{svc.desc}</p>
                <a className={arcade.cabLink} href="#contact">Get a quote →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className={arcade.section}>
        <div className={arcade.shell}>
          <div className={arcade.sectionHead}>
            <span className={arcade.kicker}>How to play</span>
            <h2 className={arcade.h2}>How an engagement works</h2>
          </div>
          <div className={s.steps}>
            {STEPS.map((st) => (
              <div key={st.n}>
                <div className={s.stepNum}>{st.n}</div>
                <h3 className={s.stepTitle}>{st.title}</h3>
                <p className={s.stepDesc}>{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className={arcade.section}>
        <div className={arcade.shell}>
          <div className={arcade.sectionHead} style={{ textAlign: 'center' }}>
            <span className={arcade.kicker}>Insert coin</span>
            <h2 className={arcade.h2}>Talk to the research team</h2>
            <p className={arcade.sectionLede} style={{ margin: '16px auto 0' }}>
              Tell us what you want to learn and we&apos;ll come back with a scope and a quote.
            </p>
          </div>

          {status === 'sent' ? (
            <div className={s.sent}>
              <span className={arcade.kicker} style={{ color: 'var(--lime)' }}>High score</span>
              <p style={{ margin: 0 }}>Thanks — we&apos;ll be in touch within one business day.</p>
            </div>
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
                <button type="submit" disabled={status === 'sending'} className={`${arcade.btn} ${arcade.btnPrimary}`}>
                  {status === 'sending' ? 'Sending…' : 'Submit'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      <footer className={s.miniFooter}>
        © {new Date().getFullYear()} Hedge · <a href="/">hedgepayments.com</a>
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
