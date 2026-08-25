import type { Metadata } from 'next'
import s from '../rollcard.module.css'

const title = 'Street Corner Casino × Rollcard — Onboarding & Winnings'
const description =
  'How Street Corner Casino events onboard players to Rollcard at the table and pay their winnings straight to the card.'

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: false },
  openGraph: { title, description, url: '/rollcard-proposal/street-corner', type: 'website' },
}

const STATS = [
  { n: '1.3B+', l: 'views across platforms' },
  { n: '11', l: 'cities filmed' },
  { n: 'ID-verified', l: 'every player at the table' },
  { n: '21+', l: 'licensed states only' },
]

const ONBOARD = [
  { n: '01', title: 'Buy-in with Rollcard', desc: 'Every table has a Rollcard QR. Players open a Rollcard at the door (instant virtual card), fund it over RTP in seconds, and buy in with the card. First Rollcard buy-in is boosted.' },
  { n: '02', title: 'Play on camera', desc: 'The street game runs as usual — blackjack, hold’em, trivia, sports props — with the Rollcard in frame at the buy-in and the cash-out. Zero scripted lines.' },
  { n: '03', title: 'Winnings paid to the card', desc: 'Winners get paid out to their Rollcard on the spot via push-to-card. No cash, no Venmo, no 1–3 day wait — the balance is spendable at any sportsbook before they leave the event.' },
  { n: '04', title: 'Keep them on the card', desc: 'The clip goes up within 48h with the player’s referral code. Rollcard cashback and winnings-to-card streaks give them a reason to fund the next buy-in from the same card.' },
]

const FLOWS = [
  {
    name: 'Onboarding: signup at the table',
    items: [
      'Rollcard QR on every table, banner and dealer tee',
      'Hosts walk players through signup — ~90 seconds with OAuth bank link',
      'Instant virtual card usable for the buy-in immediately',
      'First-buy-in boost funded from the marketing budget',
      'Chapter + event referral codes tracked per signup',
    ],
  },
  {
    name: 'Withdrawals: winnings to Rollcard',
    items: [
      'Push-to-card payout at the table in minutes',
      'No withdrawal cap; RTP out to the bank if they want cash',
      'Winnings land as a Rollcard balance → immediately spendable at any sportsbook',
      'Payout streak perks for three events running',
      'Every payout is a clip: “paid out to my Rollcard” in frame',
    ],
  },
]

const FORMATS = [
  { name: 'Casino nights', desc: 'On-campus blackjack and hold’em nights hosted with the chapter. Rollcard is the buy-in and the payout.' },
  { name: 'Tournaments', desc: 'Bracketed poker and trivia tournaments across campuses. Prize pools paid to the winners’ Rollcards, leaderboard on the clips.' },
  { name: 'Street corner shoots', desc: 'The core format: a busy corner, real strangers, a game, a prize. The prize is paid to a Rollcard opened on the spot.' },
  { name: 'Sportsbook watch parties', desc: 'Game-day parties where the Rollcard funds the sportsbook deposit live and the winnings come back to the card the same night.' },
]

const METRICS = [
  ['Cards opened', 'Signups at the door per event, by chapter and campus'],
  ['Funded accounts', 'Cards that completed an RTP deposit at the event'],
  ['Winnings paid', 'Push-to-card payouts and total $ landed on Rollcards'],
  ['Retained spend', '30/60/90-day card spend from event-acquired cardholders'],
  ['Content', 'Clips shipped, views, and signups attributed to each clip’s code'],
]

export default function RollcardStreetCornerPage() {
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

      <section className={s.scc} style={{ borderTop: 0, paddingTop: 88 }}>
        <div className={s.shell}>
          <div className={s.sccHead}>
            <img src="/scc/logo-white.png" alt="Street Corner Casino" className={s.sccLogo} />
            <span className={s.x}>×</span>
            <img src="/logos/rollcard.webp" alt="Rollcard" className={s.sccRollcard} />
          </div>
          <span className={s.sccEyebrow}>How Street Corner Casino benefits Rollcard</span>
          <h2 className={s.sccH2}>
            <span>Open the card</span>
            <span>at the table.</span>
            <span className={s.sccGreen}>Pay the winnings to it.</span>
          </h2>
          <p className={s.sccLead}>
            Street Corner Casino is a live event and content engine already running on campuses. Plugging Rollcard
            into it does two things: every player who sits down becomes a cardholder, and every payout lands on
            that card — on camera.
          </p>
          <div className={s.row} style={{ marginBottom: 36 }}>
            <a className={`${s.btn} ${s.btnGreen}`} href="#onboard">Onboarding</a>
            <a className={`${s.btn} ${s.btnPrimary}`} href="#withdraw">Winnings to Rollcard</a>
            <a className={`${s.btn} ${s.btnOutline}`} href="#formats">Event formats</a>
          </div>
          <ul className={s.sccStats}>
            {STATS.map((st) => (
              <li key={st.l} className={s.sccStat}>
                <span className={s.sccStatN}>{st.n}</span>
                <span className={s.sccStatL}>{st.l}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="onboard" className={s.section}>
        <div className={s.shell}>
          <span className={s.eyebrow}>The loop</span>
          <h2 className={s.h2} style={{ marginBottom: 32 }}>Buy in with Rollcard. Get paid to Rollcard.</h2>
          <div className={s.steps}>
            {ONBOARD.map((st) => (
              <div key={st.n}>
                <div className={s.stepNum}>{st.n}</div>
                <h3 className={s.stepTitle}>{st.title}</h3>
                <p className={s.cardDesc}>{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="withdraw" className={s.section}>
        <div className={s.shell}>
          <span className={s.eyebrow}>Two flows, one card</span>
          <h2 className={s.h2} style={{ marginBottom: 32 }}>Onboarding and withdrawals, in detail</h2>
          <div className={s.channels} style={{ gridTemplateColumns: '1fr 1fr' }}>
            {FLOWS.map((f) => (
              <div key={f.name} className={s.sccTeam} style={{ gridTemplateColumns: '1fr', gap: 12 }}>
                <p className={s.sccTeamTitle}>{f.name}</p>
                <ul className={s.sccList}>
                  {f.items.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="formats" className={s.section}>
        <div className={s.shell}>
          <span className={s.eyebrow}>Event formats</span>
          <h2 className={s.h2} style={{ marginBottom: 32 }}>Where Rollcard shows up</h2>
          <div className={s.grid}>
            {FORMATS.map((f) => (
              <div key={f.name} className={s.card}>
                <h3 className={s.cardTitle}>{f.name}</h3>
                <p className={s.cardDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.shell}>
          <span className={s.eyebrow}>What Rollcard sees</span>
          <h2 className={s.h2}>Reporting after every event</h2>
          <dl className={s.terms}>
            {METRICS.map(([k, v]) => (
              <div key={k} className={s.term}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.shell}>
          <h2 className={s.h2}>Next step</h2>
          <p className={s.sub} style={{ marginBottom: 24 }}>
            Pick the first campus and event date. Rollcard signup + push-to-card payout live at the first table.
          </p>
          <div className={s.row}>
            <a className={`${s.btn} ${s.btnPrimary}`} href="mailto:jackson@hedgepayments.com?subject=Street%20Corner%20x%20Rollcard">
              jackson@hedgepayments.com
            </a>
            <a className={s.btn} href="/rollcard-proposal/payments">Payment options &amp; perks →</a>
          </div>
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
