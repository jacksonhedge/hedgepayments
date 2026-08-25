import type { Metadata } from 'next'
import s from '../rollcard.module.css'
import { FootprintMap } from './FootprintMap'

const title = 'Street Corner Casino × Rollcard — Onboarding & Winnings'
const description =
  'How Street Corner Casino gets strangers on the street to open a Rollcard on their phone, play on FanDuel, and withdraw their FanDuel winnings to it — on camera.'

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: false },
  openGraph: { title, description, url: '/rollcard-proposal/street-corner', type: 'website' },
}

const STATS = [
  { n: '1.3B+', l: 'views across platforms' },
  { n: '11', l: 'cities filmed' },
  { n: 'On their phone', l: 'every player, every game' },
  { n: '21+', l: 'ID-verified, licensed states' },
]

const CLIPS = [
  { src: '/scc/featured.mp4', poster: '/scc/featured.jpg', views: '2.4M', caption: 'Grandma doubles down.' },
  { src: '/scc/clip-02.mp4', poster: '/scc/clip-02.jpg', views: '1.1M', caption: 'The 19 dilemma.' },
]

const ONBOARD = [
  { n: '01', title: 'Stop a stranger, hand them the game', desc: 'A Street Corner host stops someone on a busy corner. The game is on their own phone — FanDuel, or another sportsbook, casino or prediction-market app. To play, they need money in it.' },
  { n: '02', title: 'Open Rollcard on the phone', desc: 'They scan the host’s QR, open a Rollcard in ~90 seconds (OAuth bank link, instant virtual card), and fund it over RTP. The card is in their Apple Wallet before the host finishes explaining the rules.' },
  { n: '03', title: 'Play, on camera', desc: 'They deposit into FanDuel with the Rollcard and play the prop, the parlay, the hand — right there on the sidewalk, phone in hand, crowd watching. Zero scripted lines.' },
  { n: '04', title: 'Withdraw from FanDuel to Rollcard, on the spot', desc: 'They win, they hit withdraw in FanDuel, and the winnings push to their Rollcard in minutes — while the camera is still rolling. That balance is spendable anywhere Visa is before they walk away.' },
]

const FLOWS = [
  {
    name: 'Onboarding: open Rollcard on the street',
    items: [
      'Host QR → Rollcard signup on the player’s own phone',
      '~90 seconds: OAuth bank link, instant virtual card, Apple / Google Wallet',
      'First deposit over RTP lands in seconds, so the game starts immediately',
      'First-deposit boost funded from the marketing budget',
      'Host + city referral codes tracked on every signup',
    ],
  },
  {
    name: 'Withdrawal: FanDuel winnings to Rollcard, from the phone',
    items: [
      'Player taps withdraw in FanDuel; push-to-card lands on the Rollcard in minutes',
      'Filmed in one take: FanDuel bet → win → withdraw → balance on the Rollcard',
      'No cash handled by the crew, no Venmo, no 1–3 day ACH wait',
      'Balance is instantly spendable at any sportsbook or anywhere Visa is accepted',
      'Every withdrawal becomes a clip: “just cashed out of FanDuel to my Rollcard”',
    ],
  },
]

const FORMATS = [
  { name: 'Street corner shoots', desc: 'The core format: busy corner, real strangers, a game on their phone. They open a Rollcard to play and withdraw the win to it before the clip ends.' },
  { name: 'FanDuel props', desc: 'Host offers a live FanDuel prop on tonight’s game. Player funds FanDuel with a freshly opened Rollcard, the crowd sweats it, the payout is withdrawn from FanDuel back to the card.' },
  { name: 'Prediction markets', desc: 'Kalshi / Polymarket-style “will it happen?” markets settled fast on camera, winnings withdrawn to Rollcard in the same take.' },
  { name: 'Campus + watch parties', desc: 'Same phone-first flow at chapter events and game-day parties — dozens of Rollcards opened and funded in one night, on one hotspot.' },
]

const METRICS = [
  ['Cards opened', 'Rollcards opened on the street, by host, city and clip'],
  ['Funded accounts', 'Cards that completed an RTP deposit before playing'],
  ['FanDuel withdrawals to card', 'Push-to-card payouts from FanDuel and total $ landed on Rollcards'],
  ['Retained spend', '30/60/90-day card spend from street-acquired cardholders'],
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
            <span>Open Rollcard.</span>
            <span>Bet on FanDuel.</span>
            <span className={s.sccGreen}>Withdraw the win to Rollcard.</span>
          </h2>
          <p className={s.sccLead}>
            Street Corner Casino is strangers on the street betting on FanDuel on their own phones, on camera. Plug
            Rollcard in and every player opens a card to fund FanDuel, and every win is withdrawn from FanDuel to
            that card before the clip ends — deposit and withdrawal, both on the phone, both in frame.
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
          <div className={s.clipsMap}>
          <ul className={s.clips}>
            {CLIPS.map((c) => (
              <li key={c.caption} className={s.clip}>
                <video src={c.src} poster={c.poster} muted loop playsInline autoPlay className={s.clipVideo} />
                <div className={s.clipMeta}>
                  <span className={s.clipViews}>{c.views} views</span>
                  <span className={s.clipCaption}>{c.caption}</span>
                </div>
              </li>
            ))}
          </ul>
          <FootprintMap />
          </div>
        </div>
      </section>

      <section id="onboard" className={s.section}>
        <div className={s.shell}>
          <span className={s.eyebrow}>The loop</span>
          <h2 className={s.h2} style={{ marginBottom: 32 }}>Fund FanDuel from the Rollcard. Withdraw FanDuel winnings to it.</h2>
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
            Pick the first city and shoot date. Rollcard signup + FanDuel withdraw-to-card live in the first clip.
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
