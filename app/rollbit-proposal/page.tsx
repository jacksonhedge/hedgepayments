import type { Metadata } from 'next'
import s from './rollbit.module.css'

const title = 'Hedge Payments × Rollbit — Payments + Distribution Partnership'
const description =
  'Add Hedge payment rails inside Rollbit, and Hedge promotes Rollbit across FraternityBase and Street Corner Casino on a revenue share.'

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: false },
  openGraph: { title, description, url: '/rollbit-proposal', type: 'website' },
}

const RAILS = [
  { name: 'Instant bank deposits', desc: 'ACH + RTP/FedNow-backed deposits that settle in seconds, with approval rates tuned for gaming traffic.' },
  { name: 'Card acquiring', desc: 'Debit and credit acceptance with gaming-friendly MCC routing and cascading retries to lift approval rates.' },
  { name: 'Stablecoin on/off-ramp', desc: 'USDC in, USDC out. Fiat-to-crypto onramp so Rollbit users can fund from a US bank account without leaving the product.' },
  { name: 'Fast payouts', desc: 'Push-to-debit and stablecoin withdrawals, same session. Withdrawal speed is the #1 driver of retention we measure.' },
]

const CHANNELS = [
  {
    name: 'FraternityBase',
    stat: '20,000+',
    statLabel: 'verified members',
    desc: 'The largest network of fraternity chapters in the US — the 21+ college cohort every operator pays $300–$600 CPA to reach. Chapter-level promos, deals tab placement, and ambassador programs.',
  },
  {
    name: 'Street Corner Casino',
    stat: 'On-campus',
    statLabel: 'live events',
    desc: 'Casino-night events and host network across college towns. Opted-in, ID-verified participants who already play — Rollbit as the featured online destination at every event.',
  },
]

const DEAL = [
  { n: '01', title: 'Integrate', desc: 'Rollbit adds Hedge rails (deposits, cards, stablecoin ramp, payouts) alongside existing methods. Drop-in API + hosted checkout; ~2 weeks to first live transaction.' },
  { n: '02', title: 'Promote', desc: 'Hedge runs Rollbit placements across FraternityBase and Street Corner Casino: deals tab, chapter promos, event sponsorship, ambassador codes.' },
  { n: '03', title: 'Share', desc: 'Revenue share on net gaming revenue from Hedge-referred users, tracked by promo code and referral link. Payments processed at standard Hedge rates.' },
  { n: '04', title: 'Scale', desc: 'Monthly reporting on referred users, deposits and NGR. Expand into new campuses and event markets as the numbers prove out.' },
]

const TERMS = [
  ['Payments', 'Hedge rails added as deposit + payout options inside Rollbit'],
  ['Distribution', 'Rollbit promoted across FraternityBase + Street Corner Casino'],
  ['Economics', 'Revenue share on NGR from Hedge-referred users (proposed 25–30%)'],
  ['Attribution', 'Promo codes + referral links; monthly reconciliation'],
  ['Term', '12 months, renewable; 60-day out for either side'],
  ['Timeline', 'Integration in 2 weeks · first campus campaign the following month'],
]

export default function RollbitProposalPage() {
  return (
    <main className={s.root}>
      <nav className={s.nav}>
        <div className={s.navInner}>
          <a href="/" className={s.logo}>
            <img src="/favicon/hedge-logo.svg" alt="" className={s.logoMark} />
            <span>HEDGE</span>
            <span className={s.logoSub}>Payments</span>
          </a>
          <span className={s.confidential}>Confidential · Prepared for Rollbit</span>
        </div>
      </nav>

      <header className={`${s.shell} ${s.hero}`}>
        <div className={s.lockup}>
          <span className={s.lockupHedge}>Hedge</span>
          <span className={s.x}>×</span>
          <span className={s.lockupRollbit}>Rollbit</span>
        </div>
        <h1 className={s.h1}>Better rails inside Rollbit. New players from the networks we run.</h1>
        <p className={s.lede}>
          A two-sided partnership: Rollbit adds Hedge payment solutions to its cashier, and Hedge promotes Rollbit
          across <b>FraternityBase</b> and <b>Street Corner Casino</b> — paid on a revenue share, not a flat fee.
        </p>
        <div className={s.row}>
          <a className={`${s.btn} ${s.btnPrimary}`} href="mailto:jackson@hedgepayments.com?subject=Rollbit%20x%20Hedge">Book a call</a>
          <a className={s.btn} href="#terms">See proposed terms</a>
        </div>
      </header>

      <section className={s.section}>
        <div className={s.shell}>
          <span className={s.eyebrow}>Part one · Payments</span>
          <h2 className={s.h2}>What Hedge adds to the Rollbit cashier</h2>
          <p className={s.sub} style={{ marginBottom: 32 }}>
            Hedge builds payment infrastructure for sportsbooks, casinos and prediction markets. The rails below run
            today on our own products (SideBet, Chance™) and process real gaming volume.
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
          <h2 className={s.h2}>Where we promote Rollbit</h2>
          <p className={s.sub} style={{ marginBottom: 32 }}>
            We don&apos;t buy ads. We own the communities. Rollbit gets placement in front of the highest-value
            demographic in online gaming — through channels no other operator can access.
          </p>
          <div className={s.channels}>
            {CHANNELS.map((c) => (
              <div key={c.name} className={s.channel}>
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
            Why it works for Rollbit: zero upfront marketing spend, higher deposit conversion from day one, and a
            new acquisition channel that only costs money when it produces revenue.
          </p>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.shell}>
          <h2 className={s.h2}>Next step</h2>
          <p className={s.sub} style={{ marginBottom: 24 }}>
            30-minute call to walk through the cashier integration and pick the first campus campaign.
          </p>
          <a className={`${s.btn} ${s.btnPrimary}`} href="mailto:jackson@hedgepayments.com?subject=Rollbit%20x%20Hedge">
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
