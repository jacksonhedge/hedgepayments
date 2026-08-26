'use client'

import { useState } from 'react'
import s from './research.module.css'
import { ReviewTicker } from './ReviewTicker'

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

const VERTICALS = ['Prediction markets', 'Sports betting', 'Fantasy sports', 'Crypto', 'Investing', 'Payments']

const BUCKETS = [
  { n: '20,000+', label: 'Total testers', note: 'Opted-in, identity-verified users across the Hedge network.' },
  { n: '10,000+', label: 'Age 21+', note: 'Eligible for real-money sportsbook, casino and prediction-market testing in licensed states.' },
  { n: '18+', label: 'Remaining cohort', note: 'Fantasy, crypto, investing and payments testing where 18+ is the threshold.' },
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
  { n: '02', title: 'Recruit', desc: 'Matched from the network by vertical and age bucket; verified for location and eligibility.' },
  { n: '03', title: 'Test', desc: 'Real accounts, real money. Screen-recorded, timestamped, scored.' },
  { n: '04', title: 'Report', desc: 'Benchmarks, findings and a prioritized fix list.' },
]

const PLATFORMS = [
  { name: 'Polymarket', logo: '/logos/polymarket.png', kind: 'Prediction markets' },
  { name: 'Kalshi', logo: '/logos/kalshi.png', kind: 'Prediction markets' },
  { name: 'DraftKings', logo: '/logos/draftkings.png', kind: 'Sportsbook' },
  { name: 'FanDuel', logo: '/logos/fanduel.avif', kind: 'Sportsbook' },
  { name: 'Evolution', logo: null, kind: 'Live casino' },
]

const USER_STEPS = [
  { n: '01', title: 'Apply', desc: 'Tell us your age, state and which apps you already use. Must be 21+ for sportsbook, casino and prediction-market tests.' },
  { n: '02', title: 'Get matched', desc: 'We match you to paid tests by platform and location, then verify eligibility.' },
  { n: '03', title: 'Test', desc: 'Complete a scripted session — sign up, deposit, place bets, cash out — with a screen recording and a short survey.' },
  { n: '04', title: 'Get paid', desc: '$10–$100 per completed test depending on length and requirements, paid to Venmo, Cash App, PayPal or Zelle — plus you keep what you win.' },
]

const LOGOS = [
  { name: 'DraftKings', src: '/logos/draftkings.png' },
  { name: 'FanDuel', src: '/logos/fanduel.avif' },
  { name: 'Polymarket', src: '/logos/polymarket.png' },
  { name: 'Kalshi', src: '/logos/kalshi.png' },
  { name: 'ProphetX', src: '/logos/prophetx.png' },
  { name: 'FOMO', src: '/logos/fomo.png' },
  { name: 'Splash Sports', src: '/logos/splash-white.png' },
  { name: 'Underdog', src: '/logos/underdog.png' },
  { name: 'BetMGM', src: '/logos/betmgm.png' },
  { name: 'Caesars', src: '/logos/caesars.png' },
  { name: 'Fanatics', src: '/logos/fanatics.png' },
]

type Audience = 'businesses' | 'users'

type FormState = { name: string; email: string; company: string; title: string; message: string }
const EMPTY: FormState = { name: '', email: '', company: '', title: '', message: '' }

export default function ResearchPage() {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [audience, setAudience] = useState<Audience>('users')

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
          <a href="/" className={s.logo}>
            <img src="/logos/hedge-hedgehog.png" alt="" className={s.logoMark} />
            <span>HEDGE</span>
            <span className={s.logoSub}>Research</span>
          </a>
          <div className={s.toggle} role="tablist" aria-label="Audience">
            <button
              role="tab"
              aria-selected={audience === 'businesses'}
              className={`${s.toggleBtn} ${audience === 'businesses' ? s.toggleActive : ''}`}
              onClick={() => setAudience('businesses')}
            >
              For Businesses
            </button>
            <button
              role="tab"
              aria-selected={audience === 'users'}
              className={`${s.toggleBtn} ${audience === 'users' ? s.toggleActive : ''}`}
              onClick={() => setAudience('users')}
            >
              For Users
            </button>
          </div>
          <a href="/" className={s.back}>← Back to Hedge</a>
        </div>
      </nav>

      {audience === 'users' ? (
        <UsersView />
      ) : (
      <>
      <header className={`${s.shell} ${s.hero}`}>
        <span className={s.eyebrow}>Hedge Research</span>
        <h1 className={s.h1}>Consumer research from 20,000+ real testers.</h1>
        <p className={s.lede}>
          Product testing, consumer insights and competitive benchmarks across prediction markets, sports betting,
          fantasy sports, crypto, investing and payments — run with real money by real users drawn from the
          communities Hedge already operates.
        </p>
        <div className={s.row}>
          <a className={`${s.btn} ${s.btnPrimary}`} href="#contact">Request a proposal</a>
          <a className={s.btn} href="#network">See the network</a>
        </div>
      </header>

      <section id="network" className={s.section}>
        <div className={s.shell}>
          <span className={s.eyebrow}>The tester network</span>
          <div className={s.buckets}>
            {BUCKETS.map((b) => (
              <div key={b.label} className={s.bucket}>
                <p className={s.bucketNum}>{b.n}</p>
                <p className={s.bucketLabel}>{b.label}</p>
                <p className={s.itemDesc}>{b.note}</p>
              </div>
            ))}
          </div>
          <div className={s.network}>
            <div>
              <p className={s.sub}>
                We don&apos;t rent a panel. The testers are the users of the products and communities we already
                run — so they&apos;re already depositing, trading, betting and cashing out on live platforms.
              </p>
              <p className={s.bucketLabel} style={{ marginTop: 28 }}>Verticals covered</p>
              <ul className={s.tags}>
                {VERTICALS.map((v) => (
                  <li key={v} className={s.tag}>{v}</li>
                ))}
              </ul>
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
      </>
      )}

      <section className={s.logos} aria-label="Platforms we test on">
        <p className={s.tickerLabel}>Tested on the platforms that matter</p>
        <ul className={s.logoRow}>
          {LOGOS.map((l) => (
            <li key={l.name} className={s.logoItem}>
              <img src={l.src} alt={l.name} title={l.name} />
            </li>
          ))}
        </ul>
      </section>

      <ReviewTicker />

      <footer className={s.footer}>
        <div className={s.shell}>
          © {new Date().getFullYear()} Hedge · <a href="/">hedgepayments.com</a>
        </div>
      </footer>
    </div>
  )
}

function Subscribe() {
  const [f, setF] = useState({ name: '', email: '', phone: '', channel: 'text' as 'text' | 'email' | 'both' })
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [err, setErr] = useState('')
  const up = (k: 'name' | 'email' | 'phone') => (e: React.ChangeEvent<HTMLInputElement>) => setF((x) => ({ ...x, [k]: e.target.value }))
  const go = async (e: React.FormEvent) => {
    e.preventDefault()
    setState('sending')
    setErr('')
    try {
      const res = await fetch('/api/research/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(f),
      })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(j.error || 'bad')
      setState('done')
    } catch (e) {
      setErr(e instanceof Error && e.message !== 'bad' ? e.message : '')
      setState('error')
    }
  }
  const needsPhone = f.channel !== 'email'
  return (
    <div className={s.subscribe}>
      <p className={s.subscribeTitle}>Get notified about paid tests</p>
      <p className={s.subscribeSub}>We&apos;ll text or email you when a paid test opens in your state. No spam.</p>
      {state === 'done' ? (
        <p className={s.subscribeDone}>You&apos;re on the list — we&apos;ll reach out when the next paid test opens.</p>
      ) : (
        <form onSubmit={go} className={s.subscribeForm}>
          <div className={s.subscribeRow}>
            <input type="text" required value={f.name} onChange={up('name')} placeholder="Name" className={s.input} aria-label="Name" />
            <input type="email" required value={f.email} onChange={up('email')} placeholder="Email" className={s.input} aria-label="Email" />
            <input type="tel" required={needsPhone} value={f.phone} onChange={up('phone')} placeholder="Mobile number" className={s.input} aria-label="Mobile number" />
          </div>
          <div className={s.subscribeRow}>
            <div className={s.channel} role="radiogroup" aria-label="Notify me by">
              {(['text', 'email', 'both'] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  role="radio"
                  aria-checked={f.channel === c}
                  className={`${s.channelBtn} ${f.channel === c ? s.channelActive : ''}`}
                  onClick={() => setF((x) => ({ ...x, channel: c }))}
                >
                  {c === 'text' ? 'Text me' : c === 'email' ? 'Email me' : 'Both'}
                </button>
              ))}
            </div>
            <button type="submit" disabled={state === 'sending'} className={`${s.btn} ${s.btnPrimary}`}>
              {state === 'sending' ? 'Subscribing…' : 'Subscribe'}
            </button>
          </div>
          {state === 'error' && <p className={s.err}>{err || 'Couldn\u2019t subscribe — try again or email research@hedgepayments.com.'}</p>}
        </form>
      )}
    </div>
  )
}

function UsersView() {
  return (
    <>
      <header className={`${s.shell} ${s.hero}`}>
        <span className={s.eyebrow}>Hedge Research · For Users</span>
        <h1 className={s.h1}>Get paid to test the apps you already use.</h1>
        <p className={s.lede}>
          Join 20,000+ testers running real-money sessions on sportsbooks, prediction markets and casino games.
          Every test pays $10–$100, and you keep your winnings.
        </p>
        <div className={s.row}>
          <a className={`${s.btn} ${s.btnPrimary}`} href="/research/signup">Apply to test</a>
          <a className={s.btn} href="#platforms">Where you&apos;ll test</a>
        </div>
        <Subscribe />
      </header>

      <section id="platforms" className={s.section}>
        <div className={s.shell}>
          <span className={s.eyebrow}>Where you&apos;ll be testing</span>
          <h2 className={s.h2}>Real accounts on real platforms.</h2>
          <p className={s.sub} style={{ marginBottom: 32 }}>
            Tests run on the live apps below — not sandboxes. You&apos;ll sign up, deposit, play and cash out just
            like any other customer, and we pay you for the session.
          </p>
          <ul className={s.platforms}>
            {PLATFORMS.map((p) => (
              <li key={p.name} className={s.platform}>
                <div className={s.platformLogo}>
                  {p.logo ? (
                    <img src={p.logo} alt={p.name} />
                  ) : (
                    <span className={s.platformWordmark}>{p.name}</span>
                  )}
                </div>
                <p className={s.itemName}>{p.name}</p>
                <p className={s.itemDesc}>{p.kind}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.shell}>
          <h2 className={s.h2} style={{ marginBottom: 32 }}>How it works</h2>
          <div className={s.steps}>
            {USER_STEPS.map((st) => (
              <div key={st.n}>
                <div className={s.stepNum}>{st.n}</div>
                <h3 className={s.stepTitle}>{st.title}</h3>
                <p className={s.cardDesc}>{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.shell}>
          <h2 className={s.h2}>Ready to start?</h2>
          <p className={s.sub} style={{ marginBottom: 24 }}>
            Must be 18+ (21+ for sportsbook, casino and prediction-market tests) and located in a licensed state.
          </p>
          <a className={`${s.btn} ${s.btnPrimary}`} href="/research/signup">Apply to test</a>
        </div>
      </section>
    </>
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
