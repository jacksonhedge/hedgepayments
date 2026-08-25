import type { Metadata } from 'next'
import s from './rollcard.module.css'

const title = 'Hedge Payments × Rollcard — Payments + Distribution Partnership'
const description =
  'Put Hedge payment solutions inside Rollcard, and Hedge promotes Rollcard across FraternityBase and Street Corner Casino on a revenue share.'

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: false },
  openGraph: { title, description, url: '/rollcard-proposal', type: 'website' },
}

const RAILS = [
  { name: 'Instant account funding', desc: 'RTP/FedNow-backed bank transfers that land in the Rollcard account in seconds instead of the 1–3 business days ACH takes today. Faster funding = more spend on the card.' },
  { name: 'Stablecoin on/off-ramp', desc: 'USDC in, USDC out. Let cardholders fund from crypto and cash out to stablecoin — the fastest-growing balance source among younger bettors.' },
  { name: 'Push-to-card payouts', desc: 'Operators on Hedge rails pay winnings straight to the Rollcard in the same session. Rollcard becomes the default place winnings live.' },
  { name: 'Rollcard as a Hedge method', desc: 'Every operator on Hedge (SideBet, Chance™, partner sportsbooks and casinos) lists Rollcard as a preferred deposit method — more acceptance points, more interchange.' },
]

const CHANNELS = [
  {
    phase: 'Phase 1',
    name: 'Testing group',
    stat: '20,000+',
    statLabel: 'verified members · growing through Q1',
    desc: 'FraternityBase members become the Rollcard testing group: real cardholders funding, betting and cashing out, with structured feedback on the card and the Hedge rails. The group keeps growing chapter by chapter through Q1.',
  },
  {
    phase: 'Phase 2',
    name: 'Ongoing user acquisition',
    stat: 'Always-on',
    statLabel: 'across the network',
    desc: 'Rollcard in the FraternityBase Deals tab, chapter-level signup drives and ambassador referral codes — a steady stream of new cardholders from the 21+ college cohort, tracked by code.',
  },
  {
    phase: 'Phase 3',
    name: 'Live events & tournaments',
    stat: 'On-campus',
    statLabel: 'Street Corner Casino',
    desc: 'Casino nights, host-run tournaments and content shot on site across college towns. Rollcard as the official card at every event, signup at the door, and clips that run back through the network.',
  },
]

const DEAL = [
  { n: '01', title: 'Integrate', desc: 'Rollcard adds Hedge rails (instant funding, stablecoin ramp, push-to-card) to its funding and withdrawal flows. Drop-in API; ~2 weeks to first live transaction.' },
  { n: '02', title: 'Distribute', desc: 'Rollcard is listed as a preferred deposit method on every Hedge-powered operator, and Hedge runs Rollcard placements across FraternityBase and Street Corner Casino.' },
  { n: '03', title: 'Share', desc: 'Revenue share on interchange and cashback-program economics from Hedge-referred cardholders, tracked by referral code. Rails processed at standard Hedge rates.' },
  { n: '04', title: 'Scale', desc: 'Monthly reporting on referred cardholders, funded accounts and card spend. Expand campus by campus as the numbers prove out.' },
]

const TERMS = [
  ['Payments', 'Hedge rails added to Rollcard funding + withdrawals; Rollcard listed on all Hedge operators'],
  ['Distribution', 'Rollcard promoted across FraternityBase + Street Corner Casino'],
  ['Economics', 'Revenue share on net interchange from Hedge-referred cardholders (proposed 25–30%) + per-funded-account bounty'],
  ['Attribution', 'Referral codes + links; monthly reconciliation'],
  ['Term', '12 months, renewable; 60-day out for either side'],
  ['Timeline', 'Integration in 2 weeks · first campus campaign the following month'],
]

export default function RollcardProposalPage() {
  return (
    <main className={s.root}>
      <nav className={s.nav}>
        <div className={s.navInner}>
          <a href="/" className={s.logo}>
            <img src="/favicon/hedge-logo.svg" alt="" className={s.logoMark} />
            <span>HEDGE</span>
            <span className={s.logoSub}>Payments</span>
          </a>
          <span className={s.confidential}>Confidential · Prepared for Rollcard</span>
        </div>
      </nav>

      <header className={`${s.shell} ${s.hero}`}>
        <div className={s.lockup}>
          <span className={s.lockupHedge}>Hedge</span>
          <span className={s.x}>×</span>
          <span className={s.lockupRollcard}>Rollcard</span>
        </div>
        <h1 className={s.h1}>Distribution and content, wrapped into one.</h1>
        <p className={s.lede}>
          Rollcard adds Hedge payment solutions to how cardholders fund and cash out. In return, Hedge puts Rollcard
          in front of the 21+ college bettor through <b>FraternityBase</b> and <b>Street Corner Casino</b> — chapter
          promos, campus events and the content that comes out of them — paid on a revenue share, not a flat fee.
        </p>
        <div className={s.row}>
          <a className={`${s.btn} ${s.btnPrimary}`} href="mailto:jackson@hedgepayments.com?subject=Rollcard%20x%20Hedge">Book a call</a>
          <a className={s.btn} href="#terms">See proposed terms</a>
        </div>
      </header>

      <section className={s.section}>
        <div className={s.shell}>
          <span className={s.eyebrow}>Part one · Payments</span>
          <h2 className={s.h2}>What Hedge adds to Rollcard</h2>
          <p className={s.sub} style={{ marginBottom: 32 }}>
            Hedge builds payment infrastructure for sportsbooks, casinos and prediction markets. Rollcard already
            solved the bank side (Cross River, FDIC, $1M daily limits) — Hedge makes money move into and out of the
            account faster, and puts the card in front of every operator we power.
          </p>
          <div className={s.grid}>
            {RAILS.map((r) => (
              <div key={r.name} className={s.card}>
                <h3 className={s.cardTitle}>{r.name}</h3>
                <p className={s.cardDesc}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.shell}>
          <span className={s.eyebrow}>Part two · Distribution</span>
          <h2 className={s.h2}>How we grow Rollcard</h2>
          <p className={s.sub} style={{ marginBottom: 32 }}>
            We don&apos;t buy ads. We own the communities. Rollcard gets placement in front of the 21+ college
            bettor — the demographic that opens the most gaming accounts and hasn&apos;t picked a card yet.
          </p>
          <div className={s.channels}>
            {CHANNELS.map((c) => (
              <div key={c.name} className={s.channel}>
                <span className={s.eyebrow}>{c.phase}</span>
                <p className={s.channelStat}>{c.stat}</p>
                <p className={s.channelStatLabel}>{c.statLabel}</p>
                <h3 className={s.cardTitle}>{c.name}</h3>
                <p className={s.cardDesc}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.shell}>
          <h2 className={s.h2} style={{ marginBottom: 32 }}>How the deal works</h2>
          <div className={s.steps}>
            {DEAL.map((d) => (
              <div key={d.n}>
                <div className={s.stepNum}>{d.n}</div>
                <h3 className={s.stepTitle}>{d.title}</h3>
                <p className={s.cardDesc}>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="terms" className={s.section}>
        <div className={s.shell}>
          <span className={s.eyebrow}>Proposed terms</span>
          <h2 className={s.h2}>Simple, performance-based</h2>
          <dl className={s.terms}>
            {TERMS.map(([k, v]) => (
              <div key={k} className={s.term}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <p className={s.sub} style={{ marginTop: 24 }}>
            Why it works for Rollcard: zero upfront marketing spend, faster funding from day one, more acceptance
            points across Hedge operators, and a cardholder acquisition channel that only costs money when it
            produces spend.
          </p>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.shell}>
          <h2 className={s.h2}>Next step</h2>
          <p className={s.sub} style={{ marginBottom: 24 }}>
            30-minute call to walk through the funding integration and pick the first campus campaign.
          </p>
          <a className={`${s.btn} ${s.btnPrimary}`} href="mailto:jackson@hedgepayments.com?subject=Rollcard%20x%20Hedge">
            jackson@hedgepayments.com
          </a>
        </div>
      </section>

      <footer className={s.footer}>
        <div className={s.shell}>
          © {new Date().getFullYear()} Hedge · <a href="/">hedgepayments.com</a> · Confidential
        </div>
      </footer>
    </main>
  )
}
