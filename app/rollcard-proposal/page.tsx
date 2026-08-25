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

const ONRAMP = [
  { name: 'ACH in via RTP', desc: 'Bank pulls settled over RTP / FedNow — money lands on the Rollcard in seconds, 24/7, not 1–3 business days.' },
  { name: 'T+1 ACH fallback', desc: 'Same-day / next-day ACH for banks not yet on instant rails, with funds made available on the card the moment the pull is authorized.' },
  { name: 'OAuth bank linking, all bank sizes', desc: 'Plaid / MX / Finicity coverage with true OAuth for the big banks and credential-based fallback for the long tail of community banks and credit unions. No bank left out.' },
  { name: 'Instant virtual card', desc: 'Card issued at signup and usable at sportsbooks immediately — the same-session activation Edge Boost is known for.' },
  { name: 'High-volume, gaming-tuned limits', desc: 'Deposit limits sized for high rollers ($250k+/day) with risk rules built for sportsbook cashier traffic, so real players aren&apos;t declined.' },
  { name: 'Stablecoin on-ramp', desc: 'USDC in from any wallet, auto-converted to USD on the card — the funding source younger bettors increasingly start from.' },
]

const OFFRAMP = [
  { name: 'Withdrawals in minutes', desc: 'Operator payouts push to the Rollcard and out to the bank over RTP / push-to-debit — minutes, not days, no withdrawal cap.' },
  { name: 'Push-to-card from every Hedge operator', desc: 'SideBet, Chance™ and partner books pay winnings straight to the Rollcard in-session, so the card becomes where winnings live.' },
  { name: 'Rollcard as a preferred method', desc: 'Every operator on Hedge lists Rollcard as a featured deposit option — more acceptance points, more interchange, more spend.' },
  { name: 'Deposit cashback engine', desc: 'Ledger + reporting to run tiered cashback on card spend and deposits (Edge Boost runs 0.25–0.50%), funded partly by the interchange Hedge routes to Rollcard.' },
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
  { n: '01', title: 'Integrate', desc: 'Rollcard adds Hedge rails (RTP ACH-in, T+1 ACH, OAuth bank linking, stablecoin ramp, push-to-card) to its funding and withdrawal flows. Drop-in API; ~2 weeks to first live transaction.' },
  { n: '02', title: 'Distribute', desc: 'Rollcard is listed as a preferred deposit method on every Hedge-powered operator, and Hedge runs Rollcard placements across FraternityBase and Street Corner Casino.' },
  { n: '03', title: 'Share', desc: 'Two streams: an affiliate revenue share on interchange from every Hedge-referred cardholder, plus marketing revenue for the testing group, campus campaigns, events and content that drive those signups.' },
  { n: '04', title: 'Scale', desc: 'Monthly reporting on referred cardholders, funded accounts and card spend. Expand campus by campus as the numbers prove out.' },
]

const TERMS = [
  ['Payments', 'Hedge rails added to Rollcard funding + withdrawals; Rollcard listed on all Hedge operators'],
  ['Affiliate', 'Revenue share on net interchange from every Hedge-referred cardholder, for the life of the account'],
  ['Marketing', 'Separate marketing budget for the testing group, campus campaigns, live events, tournaments and content'],
  ['Attribution', 'Referral codes + links per chapter, ambassador and event; monthly reconciliation'],
  ['Term', '12 months, renewable; 60-day out for either side'],
  ['Timeline', 'Integration in 2 weeks · testing group live the following month'],
]

export default function RollcardProposalPage() {
  return (
    <main className={s.root}>
      <nav className={s.nav}>
        <div className={s.navInner}>
          <a href="/" className={s.logo}>
            <img src="/logos/hedge-hedgehog.png" alt="" className={s.logoMark} />
            <span>HEDGE</span>
            <span className={s.logoSub}>Payments</span>
          </a>
          <span className={s.confidential}>Confidential · Prepared for Rollcard</span>
        </div>
      </nav>

      <header className={`${s.shell} ${s.hero}`}>
        <div className={s.lockup}>
          <img src="/logos/hedge-hedgehog.png" alt="Hedge Payments" className={s.lockupLogo} />
          <span className={s.x}>×</span>
          <img src="/logos/rollcard.webp" alt="Rollcard" className={s.lockupLogo} />
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
          <h2 className={s.h2}>Edge Boost-grade on-ramp, inside Rollcard</h2>
          <p className={s.sub} style={{ marginBottom: 32 }}>
            Edge Boost set the bar for a bettor&apos;s card: instant funding, every bank linkable, withdrawals in
            minutes. Rollcard already has the bank side (Cross River, FDIC, $1M daily limits). Hedge supplies the
            rails to match Edge Boost feature-for-feature on funding — and then goes past it on distribution.
          </p>
          <p className={s.bucketLabel}>On-ramp · funding the card</p>
          <div className={s.grid} style={{ marginBottom: 40 }}>
            {ONRAMP.map((r) => (
              <div key={r.name} className={s.card}>
                <h3 className={s.cardTitle}>{r.name}</h3>
                <p className={s.cardDesc} dangerouslySetInnerHTML={{ __html: r.desc }} />
              </div>
            ))}
          </div>
          <p className={s.bucketLabel}>Off-ramp · getting paid and spending</p>
          <div className={s.grid}>
            {OFFRAMP.map((r) => (
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
          <h2 className={s.h2}>Affiliate + marketing, two streams</h2>
          <dl className={s.terms}>
            {TERMS.map(([k, v]) => (
              <div key={k} className={s.term}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <p className={s.sub} style={{ marginTop: 24 }}>
            Why it works for Rollcard: the affiliate side only pays when a referred cardholder spends, and the
            marketing side buys what you can&apos;t get elsewhere — a 20,000+ member testing group, on-campus events and
            the content that comes out of them — all pointed at one card.
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
