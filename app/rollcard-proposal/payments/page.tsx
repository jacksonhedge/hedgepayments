import type { Metadata } from 'next'
import s from '../rollcard.module.css'

const title = 'Rollcard × Hedge — Payment Options & Perks'
const description = 'Edge Boost-grade on-ramp and withdrawal rails for Rollcard, plus the perks that ride on them.'

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: false },
  openGraph: { title, description, url: '/rollcard-proposal/payments', type: 'website' },
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

const PERKS = [
  { name: 'Deposit cashback', desc: 'Tiered cashback on card spend and deposits (Edge Boost runs 0.25–0.50%), partly funded by the interchange Hedge routes to Rollcard from its operators.' },
  { name: 'Instant-fund bonus', desc: 'First RTP deposit boosted — the same-session "money on the card in seconds" moment is the hook for the college cohort.' },
  { name: 'Preferred-method boosts', desc: 'Every Hedge operator lists Rollcard first in the cashier with a deposit match funded by the operator, not Rollcard.' },
  { name: 'Winnings-to-card streaks', desc: 'Payout streak rewards when winnings land on the Rollcard three sessions running — keeps the balance (and spend) on the card.' },
  { name: 'Referral credits', desc: 'Cardholder-to-cardholder referral credit tied into FraternityBase chapter codes, so the perk and the acquisition engine share one ledger.' },
  { name: 'Responsible-play tools', desc: 'Deposit caps, cool-offs and session limits surfaced at funding time — matching the discipline tooling Rollcard already markets.' },
]

const COMPARE = [
  ['Bank pull speed', '1–3 business days (ACH)', 'Seconds via RTP / FedNow; T+1 ACH fallback'],
  ['Bank linking', 'Standard aggregator', 'OAuth for major banks + credential fallback for community banks & CUs'],
  ['Crypto funding', '—', 'USDC on-ramp, auto-converted to USD on the card'],
  ['Withdrawals', 'ACH, up to $250k/day', 'Minutes via RTP / push-to-debit, no cap'],
  ['Operator payouts', 'Operator → bank → card', 'Push-to-card in-session from every Hedge operator'],
  ['Acceptance', 'Wherever Visa is accepted', 'Plus featured deposit method on all Hedge operators'],
]

export default function RollcardPaymentsPage() {
  return (
    <main className={s.root}>
      <nav className={s.nav}>
        <div className={s.navInner}>
          <a href="/" className={s.logo}>
            <img src="/logos/hedge-hedgehog.png" alt="" className={s.logoMark} />
            <span>HEDGE</span>
            <span className={s.logoSub}>Payments</span>
          </a>
          <a href="/rollcard-proposal" className={s.back}>← Back to the Rollcard proposal</a>
        </div>
      </nav>

      <header className={`${s.shell} ${s.hero}`}>
        <div className={s.lockup}>
          <img src="/logos/hedge-hedgehog.png" alt="Hedge Payments" className={s.lockupLogo} />
          <span className={s.x}>×</span>
          <img src="/logos/rollcard.webp" alt="Rollcard" className={s.lockupLogo} />
        </div>
        <span className={s.eyebrow}>Payment options &amp; perks · separate from the acquisition deal</span>
        <h1 className={s.h1}>Edge Boost-grade on-ramp and withdrawal, inside Rollcard.</h1>
        <p className={s.lede}>
          Rollcard already has the bank side — Cross River, FDIC, $1M daily limits. Hedge supplies the rails that
          make money move in and out faster than any card in the category, and the perks that make cardholders keep
          their balance there. Priced on its own, independent of the FraternityBase / Street Corner deal.
        </p>
        <div className={s.row}>
          <a className={`${s.btn} ${s.btnPrimary}`} href="#onramp">On-ramp</a>
          <a className={`${s.btn} ${s.btnGreen}`} href="#offramp">Withdrawal</a>
          <a className={`${s.btn} ${s.btnOutline}`} href="#perks">Perks</a>
        </div>
      </header>

      <section id="onramp" className={s.section}>
        <div className={s.shell}>
          <span className={s.eyebrow}>On-ramp · funding the card</span>
          <h2 className={s.h2}>Money on the card in seconds, from any bank.</h2>
          <div className={s.grid} style={{ marginTop: 32 }}>
            {ONRAMP.map((r) => (
              <div key={r.name} className={s.card}>
                <h3 className={s.cardTitle}>{r.name}</h3>
                <p className={s.cardDesc} dangerouslySetInnerHTML={{ __html: r.desc }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="offramp" className={s.section}>
        <div className={s.shell}>
          <span className={s.eyebrow}>Withdrawal · getting paid and spending</span>
          <h2 className={s.h2}>Winnings land on the card, and leave in minutes.</h2>
          <div className={s.grid} style={{ marginTop: 32 }}>
            {OFFRAMP.map((r) => (
              <div key={r.name} className={s.card}>
                <h3 className={s.cardTitle}>{r.name}</h3>
                <p className={s.cardDesc}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="perks" className={s.section}>
        <div className={s.shell}>
          <span className={s.eyebrow}>Perks · what rides on the rails</span>
          <h2 className={s.h2}>Reasons to keep the balance on Rollcard.</h2>
          <div className={s.grid} style={{ marginTop: 32 }}>
            {PERKS.map((r) => (
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
          <span className={s.eyebrow}>Today vs. with Hedge</span>
          <h2 className={s.h2}>Side by side</h2>
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr><th></th><th>Rollcard today</th><th>Rollcard + Hedge</th></tr>
              </thead>
              <tbody>
                {COMPARE.map(([k, a, b]) => (
                  <tr key={k}><th>{k}</th><td>{a}</td><td className={s.tdGreen}>{b}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.shell}>
          <h2 className={s.h2}>Next step</h2>
          <p className={s.sub} style={{ marginBottom: 24 }}>
            30-minute call to walk through the funding integration. ~2 weeks to first live transaction.
          </p>
          <a className={`${s.btn} ${s.btnPrimary}`} href="mailto:jackson@hedgepayments.com?subject=Rollcard%20payments">
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
