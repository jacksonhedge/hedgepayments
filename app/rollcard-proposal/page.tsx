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
  ['Payments', 'Separate track — see Payment options & perks. Priced independently of the acquisition deal'],
  ['Affiliate', 'Revenue share on net interchange from every Hedge-referred cardholder, for the life of the account'],
  ['Marketing', 'Separate marketing budget for the testing group, campus campaigns, live events, tournaments and content'],
  ['Attribution', 'Referral codes + links per chapter, ambassador and event; monthly reconciliation'],
  ['Term', '12 months, renewable; 60-day out for either side'],
  ['Timeline', 'Integration in 2 weeks · testing group live the following month'],
]

const DB_STATS = [
  { n: '20,000+', label: 'verified members' },
  { n: '1,000+', label: 'chapters' },
  { n: '150+', label: 'universities' },
  { n: '21+', label: 'age-gated cohort' },
]

const DB_FEATURES = [
  { name: 'Officer-level contacts', desc: 'Presidents, social chairs and treasurers per chapter — the people who decide what the house signs up for.' },
  { name: 'Deals tab placement', desc: 'Rollcard listed in the FraternityBase Deals tab every member sees, with chapter-specific referral codes.' },
  { name: 'Ambassador program', desc: 'One paid ambassador per chapter driving signups, tracked by code and paid on funded accounts.' },
  { name: 'Testing group', desc: 'The same members become the Rollcard testing group — real cardholders, structured feedback, growing through Q1.' },
]

const SCC_STATS = [
  { n: '1.3B+', l: 'views across platforms' },
  { n: '11', l: 'cities filmed' },
  { n: 'Daily', l: 'new drops' },
  { n: '0', l: 'scripted lines' },
]

const CLIPS = [
  { src: '/scc/featured.mp4', poster: '/scc/featured.jpg', views: '2.4M', caption: 'Grandma doubles down.' },
  { src: '/scc/clip-02.mp4', poster: '/scc/clip-02.jpg', views: '1.1M', caption: 'The 19 dilemma.' },
]

const SCC_TEAM = [
  'Weekly campus shoots with Rollcard as the prize',
  'Casino nights + tournaments, signup at the door',
  'Vertical edits for Reels, Shorts and TikTok within 48h',
  'Clips co-owned by Rollcard, cleared for paid use',
  'Referral codes on every clip and every table',
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
        <h1 className={s.h1}>Distribution, Content, and Payment Tools — wrapped into one.</h1>
        <p className={s.lede}>
          Rollcard adds Hedge payment solutions to how cardholders fund and cash out. In return, Hedge puts Rollcard
          in front of the 21+ college bettor through <b>FraternityBase</b> and <b>Street Corner Casino</b> — chapter
          promos, campus events and the content that comes out of them — paid on a revenue share, not a flat fee.
        </p>
        <div className={s.row}>
          <a className={`${s.btn} ${s.btnPrimary}`} href="#database">Our group database</a>
          <a className={`${s.btn} ${s.btnGreen}`} href="#content">Our content</a>
          <a className={`${s.btn} ${s.btnOutline}`} href="/rollcard-proposal/payments">Payment options &amp; perks</a>
        </div>
      </header>

      {/* ---------- DATABASE ---------- */}
      <section id="database" className={s.section}>
        <div className={s.shell}>
          <span className={s.eyebrow}>01 · Our group database</span>
          <h2 className={s.h2}>The 21+ college bettor, chapter by chapter.</h2>
          <p className={s.sub} style={{ marginBottom: 32 }}>
            FraternityBase is a verified database of fraternity chapters, officers and members across the US —
            the cohort that opens the most gaming accounts and hasn&apos;t picked a card yet. Every member is
            reachable by chapter, campus and role.
          </p>
          <div className={s.dbStats}>
            {DB_STATS.map((d) => (
              <div key={d.label} className={s.dbStat}>
                <p className={s.channelStat}>{d.n}</p>
                <p className={s.channelStatLabel}>{d.label}</p>
              </div>
            ))}
          </div>
          <div className={s.grid}>
            {DB_FEATURES.map((f) => (
              <div key={f.name} className={s.card}>
                <h3 className={s.cardTitle}>{f.name}</h3>
                <p className={s.cardDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CONTENT (Street Corner Casino) ---------- */}
      <section id="content" className={s.scc}>
        <div className={s.shell}>
          <div className={s.sccHead}>
            <img src="/scc/logo-white.png" alt="Street Corner Casino" className={s.sccLogo} />
            <span className={s.sccEyebrow}>02 · Our content · Street-corner user acquisition</span>
          </div>
          <h2 className={s.sccH2}>
            <span>Acquire users</span>
            <span>with gamified</span>
            <span className={s.sccGreen}>product usage.</span>
          </h2>
          <p className={s.sccLead}>
            We put Rollcard on a busy corner, get real strangers competing on it on camera, then cut the moment
            into vertical clips built to convert. The street game is the hook — the card is the prize, and the
            internet does the sign-ups.
          </p>
          <ul className={s.sccStats}>
            {SCC_STATS.map((st) => (
              <li key={st.l} className={s.sccStat}>
                <span className={s.sccStatN}>{st.n}</span>
                <span className={s.sccStatL}>{st.l}</span>
              </li>
            ))}
          </ul>
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
          <div className={s.sccTeam}>
            <div>
              <p className={s.sccTeamTitle}>Your embedded street marketing team</p>
              <p className={s.cardDesc}>
                Hosts, dealers, camera and editors — a Hedge crew that lives on campus and at the events, shooting
                Rollcard content weekly and running signups at the door. Rollcard gets the clips, the accounts and
                the co-ownership of everything we shoot.
              </p>
            </div>
            <ul className={s.sccList}>
              {SCC_TEAM.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div className={s.row} style={{ marginTop: 24 }}>
            <a className={`${s.btn} ${s.btnGreen}`} href="/rollcard-proposal/street-corner">
              How Street Corner onboards users &amp; pays winnings to Rollcard →
            </a>
          </div>
        </div>
      </section>

      <section id="rails" className={s.section}>
        <div className={s.shell}>
          <span className={s.eyebrow}>03 · Payment rails</span>
          <h2 className={s.h2}>A separate track: Rollcard on-ramp &amp; withdrawal.</h2>
          <p className={s.sub} style={{ marginBottom: 24 }}>
            Everything above is user acquisition. Independently of that, Hedge can supply Edge Boost-grade funding
            and withdrawal rails to Rollcard — RTP ACH-in, T+1 ACH, OAuth bank linking for every bank size,
            stablecoin ramp, push-to-card payouts — plus the perks that ride on them. Full spec on its own page.
          </p>
          <a className={`${s.btn} ${s.btnPrimary}`} href="/rollcard-proposal/payments">Payment options &amp; perks →</a>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.shell}>
          <span className={s.eyebrow}>How it rolls out</span>
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
