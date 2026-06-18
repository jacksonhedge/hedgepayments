import type { Metadata } from 'next'
import styles from './novig.module.css'

const title = 'Street Corner Sports × Novig — Street Team Launch Proposal'
const description =
  'Acquire users and acquire content, all in one — Novig’s July 19 launch in New York, New Jersey & California, the day the World Cup Final lands at MetLife. Powered by Hedge Payments.'
const ogImage = '/og/novig-streetcorner.png'

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: false },
  openGraph: {
    title,
    description,
    url: '/novig-streetcorner-proposal',
    type: 'website',
    images: [{ url: ogImage, width: 1200, height: 630, alt: 'Street Corner Sports × Novig' }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [ogImage],
  },
}

const SCS_LOGO = '/images/street-corner-black.png'
const NOVIG_LOGO = '/images/novig-wordmark.jpg'

export default function NovigProposalPage() {
  return (
    <main className={styles.page}>
      {/* ---------------- HERO ---------------- */}
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <div>
            <div className={styles.suits}>
              <span>♠</span>
              <span>♥</span>
              <span>♦</span>
              <span>♣</span>
            </div>
            <h1 className={styles.wordmarkWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={SCS_LOGO} alt="Street Corner Sports" className={styles.scsLogo} />
            </h1>
            <div className={styles.lockup}>
              <span className={styles.sportsMono}>SPORTS</span>
              <span className={styles.xMark}>×</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={NOVIG_LOGO} alt="Novig" className={styles.novigLogo} />
            </div>

            <p className={styles.lede}>
              Acquire users and acquire content, all in one — for your{' '}
              <b>July&nbsp;19 launch</b> in New York, New Jersey &amp; California,
              the day the <b>World Cup Final lands at MetLife.</b>
            </p>

            <div className={styles.rule} />

            <div className={styles.heroMeta}>
              <div>Street Team Launch Proposal</div>
              <div>
                Prepared for <b>Novig</b> &nbsp;·&nbsp; June 18, 2026
              </div>
            </div>

            <p className={styles.poweredBy}>
              Powered by <b>Street Corner</b>, a Hedge Brand
            </p>
          </div>

          <div className={styles.dateBlock}>
            <span className={styles.dateBlockDay}>
              Jul<br />19
            </span>
            <p className={styles.dateBlockLabel}>Goes Live</p>
            <p className={styles.dateBlockSub}>NY · NJ · CA</p>
          </div>
        </div>
      </header>

      {/* ---------------- PRICING SNAPSHOT (3 boxes) ---------------- */}
      <div className={styles.priceWrap}>
        <div className={styles.priceBoxes}>
          <div className={styles.priceBox}>
            <p className={styles.priceBoxKicker}>Entry · Launch SKU</p>
            <p className={styles.priceBoxName}>Package 1</p>
            <p className={styles.priceBoxPrice}>$8–15K</p>
            <p className={styles.priceBoxSub}>Media only · Target $12K</p>
            <p className={styles.priceBoxDesc}>
              New Jersey · World Cup Final — 2 street teams gathering content.
            </p>
          </div>
          <div className={styles.priceBox}>
            <p className={styles.priceBoxKicker}>Growth</p>
            <p className={styles.priceBoxName}>Package 2</p>
            <p className={styles.priceBoxPrice}>$35–50K</p>
            <p className={styles.priceBoxSub}>Media only · Target $40K</p>
            <p className={styles.priceBoxDesc}>
              ~8 sporting events — mainly Mets, Yankees &amp; the Jersey Shore.
            </p>
          </div>
          <div className={`${styles.priceBox} ${styles.priceBoxAnchor}`}>
            <p className={styles.priceBoxKicker}>Flagship · Anchor</p>
            <p className={styles.priceBoxName}>Package 3</p>
            <p className={styles.priceBoxPrice}>$100K+</p>
            <p className={styles.priceBoxSub}>Media only · Target $125–150K</p>
            <p className={styles.priceBoxDesc}>
              NY + NJ + CA · ~$4K per street-team day — content fully sponsored &amp; co-owned by Novig.
            </p>
          </div>
        </div>
      </div>

      {/* ---------------- THE OPPORTUNITY ---------------- */}
      <section className={`${styles.section} ${styles.sectionInvert}`}>
        <span className={styles.sectionNum}>01</span>
        <p className={styles.eyebrow}>Why now — and why this window can’t be replicated</p>
        <h2 className={styles.h2}>You go live July 19.</h2>
        <p className={styles.intro}>
          Your CFTC approval flips New York, New Jersey, and California on the same day the single
          biggest sporting event on U.S. soil lands at MetLife. In this category, distribution
          is the entire war right now — and there is no more demo-dense launch moment anyone in
          prediction markets will get this decade.
        </p>

        <div className={`${styles.cards} ${styles.cards4}`}>
          <div className={styles.card}>
            <p className={styles.cardKicker}>Jul 15–17</p>
            <p className={styles.cardBody}>Crews staged; teaser content rolls as MLB resumes — Mets &amp; Yankees</p>
            <p className={styles.cardTag}>Pre-launch</p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardKicker}>Jul 18</p>
            <p className={styles.cardBody}>World Cup third-place match — the metro fills up</p>
            <p className={styles.cardTag}>Build-up</p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardKicker}>Jul 19</p>
            <p className={styles.cardBody}>Novig goes live across NY · NJ · CA</p>
            <p className={styles.cardTag}>Go-live</p>
          </div>
          <div className={`${styles.card} ${styles.cardFeatured}`}>
            <p className={styles.cardKicker}>Jul 19</p>
            <p className={styles.cardBody}>
              <strong style={{ color: 'var(--ink)' }}>World Cup Final</strong> — MetLife, East
              Rutherford, NJ
            </p>
            <p className={styles.cardTag}>Launch day = your debut</p>
          </div>
        </div>

        <div className={`${styles.callout} ${styles.calloutGold}`}>
          <p className={styles.calloutLabel}>The thesis</p>
          <p className={styles.calloutText}>
            Novig is racing Kalshi, Polymarket, ProphetX, and Betr for the same users. The brand
            that owns the on-the-ground demo at launch owns the market. Street Corner Sports puts
            your table — and your $5-for-$50 offer — physically in front of your exact 21+ audience
            the moment you can legally convert them.
          </p>
        </div>
      </section>

      {/* ---------------- THE MODEL ---------------- */}
      <section className={styles.section}>
        <span className={styles.sectionNum}>02</span>
        <p className={styles.eyebrow}>One crew, three businesses stacked</p>
        <h2 className={styles.h2}>What a Street Team day delivers</h2>
        <p className={styles.intro}>
          Each capture day is one team — a host plus a filmer — working a single high-density venue
          for about 3 hours (closer to 6 for a World Cup–scale day), at roughly $4K a team. That one
          day is monetized three ways at once — you’re buying the deliverable, the attention, and the
          conversion in a single motion.
        </p>

        <div className={`${styles.cards} ${styles.cards3}`}>
          <div className={styles.card}>
            <p className={`${styles.cardKicker} ${styles.pink}`}>01</p>
            <p className={styles.cardTitle}>Street interviews</p>
            <p className={styles.cardBody}>
              Authentic, on-the-street reactions from your exact 21+ sports-trader demo — the kind of
              content a studio shoot can’t fake and an agency can’t replicate at this density.
            </p>
          </div>
          <div className={styles.card}>
            <p className={`${styles.cardKicker} ${styles.pink}`}>02</p>
            <p className={styles.cardTitle}>Branded content + logo</p>
            <p className={styles.cardBody}>
              Novig branding everywhere it’s seen on camera and in person: logos on the felt and
              table, on-camera <strong>mic flags and microphones</strong>, the scan cards, branded
              apparel on the crew, and a content bug on every clip — plus <strong>Novig merch
              handed out</strong> to the crowd. IRL impressions multiplied by the reach of the
              footage — jersey-patch economics for the prediction-market era.
            </p>
          </div>
          <div className={styles.card}>
            <p className={`${styles.cardKicker} ${styles.pink}`}>03</p>
            <p className={styles.cardTitle}>On-table conversion</p>
            <p className={styles.cardBody}>
              The team walks people through scan → download → fund right at the table. Real, tracked
              signups the moment your offer hits — every funded account attributable back to a
              specific day and market.
            </p>
          </div>
        </div>

        <div className={styles.callout}>
          <p className={styles.calloutLabel}>The content angle writes itself</p>
          <p className={styles.calloutText}>
            Novig’s whole pitch is “the house always wins — we’re rendering sportsbooks obsolete.”
            That’s a perfect street hook: <em>“Did you know the sportsbook is built so you lose? What
            if there were no house edge?”</em> It doubles as financial-literacy framing, which keeps
            every piece defensible and brand-safe.
          </p>
        </div>
      </section>

      {/* ---------------- THE MARKETS ---------------- */}
      <section className={styles.section}>
        <span className={styles.sectionNum}>03</span>
        <p className={styles.eyebrow}>Three launch states, three distinct plays</p>
        <h2 className={styles.h2}>Where we deploy</h2>
        <p className={styles.intro}>
          You picked the three biggest, most-contested markets in the country — which is exactly why
          a launch-day presence matters. Each has a different character, and the packages are tuned
          to it.
        </p>

        <div className={styles.marketStack}>
          <div className={styles.market}>
            <div className={styles.marketHead}>
              <h3 className={styles.marketName}>New York</h3>
              <span className={styles.marketTag}>High-frequency workhorse</span>
            </div>
            <p className={styles.cardBody}>
              Yankee Stadium (Bronx) and Citi Field (Queens) give a dozen-plus home dates a month
              with zero travel — the lowest cost-per-day buy and immediate volume from launch week.
              US Open in Queens (Aug 30–Sep 13) stacks on a second marquee crowd. Legal
              sports-betting state, so the no-vig angle is the differentiator.
            </p>
          </div>
          <div className={styles.market}>
            <div className={styles.marketHead}>
              <h3 className={styles.marketName}>New Jersey</h3>
              <span className={styles.marketTag}>Highest-converting</span>
            </div>
            <p className={styles.cardBody}>
              The most betting-native audience in America, so conversion — and CPA upside — pops
              hardest here. Home to the launch detonator: the World Cup Final at MetLife, plus Red
              Bull soccer, the Giants/Jets, Prudential Center, and Army–Navy in December. This is
              your flagship, not your mid-tier.
            </p>
          </div>
          <div className={styles.market}>
            <div className={styles.marketHead}>
              <h3 className={styles.marketName}>California</h3>
              <span className={styles.marketTag}>Scale &amp; reach</span>
            </div>
            <p className={styles.cardBody}>
              The largest reach play across LA and the Bay Area. Because California has no legal
              sportsbooks, Novig’s no-vig category stands almost alone — a genuinely differentiated
              story. Anchored on Dodgers / Giants / Padres home stands from Jul 16 and college
              football from late August. (World Cup matches in CA conclude before go-live, so they’re
              pre-launch teaser content only.)
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- THE PACKAGES ---------------- */}
      <section className={styles.section}>
        <span className={styles.sectionNum}>04</span>
        <p className={styles.eyebrow}>Three ways in — all CPAs separate &amp; on top</p>
        <h2 className={styles.h2}>The packages</h2>
        <p className={styles.intro}>
          Each price below is <strong>guaranteed launch media</strong> — a fixed volume of branded
          content in front of your demo, delivered regardless of conversion. Every funded signup is
          billed separately as upside. Billing is launch-triggered per state: you pay for no day
          before Novig can convert in that market.
        </p>

        <div className={styles.pkgStack}>
          {/* Package 1 */}
          <article className={styles.pkg}>
            <div className={styles.pkgHead}>
              <div>
                <p className={styles.pkgKicker}>Entry · Launch SKU</p>
                <h3 className={styles.pkgName}>Package 1</h3>
                <p className={styles.pkgTagline}>Own the launch moment</p>
              </div>
              <div className={styles.pkgPriceWrap}>
                <div className={styles.pkgPrice}>$8–15K</div>
                <p className={styles.pkgPriceSub}>Media only · Target $12K</p>
              </div>
            </div>
            <div className={styles.specGrid}>
              <Spec k="Region" v="New Jersey" />
              <Spec k="Events" v="1 — World Cup Final" />
              <Spec k="Teams" v="2 — 1 marquee + 1 support" />
              <Spec k="Per team" v="~$4K" />
              <Spec k="Ground work" v="~6 hrs — World Cup (≈3 a normal event)" />
              <Spec k="Interviews" v="20–30" />
              <Spec k="Curated" v="6 clips + 1 hero" />
              <Spec k="Logo" v="Felt, mic flags + content bug" />
              <Spec k="Rights" v="Organic + paid" />
              <Spec k="Best for" v="A fast, high-impact debut" />
            </div>
            <span className={styles.cpaPill}>+ CPAs billed separately, on top</span>
          </article>

          {/* Package 2 */}
          <article className={styles.pkg}>
            <div className={styles.pkgHead}>
              <div>
                <p className={styles.pkgKicker}>Growth</p>
                <h3 className={styles.pkgName}>Package 2</h3>
                <p className={styles.pkgTagline}>Launch + a real New York month</p>
              </div>
              <div className={styles.pkgPriceWrap}>
                <div className={styles.pkgPrice}>$35–50K</div>
                <p className={styles.pkgPriceSub}>Media only · Target $40K</p>
              </div>
            </div>
            <div className={styles.specGrid}>
              <Spec k="Regions" v="NJ + New York" />
              <Spec k="Events" v="~8 — Mets, Yankees & Jersey Shore" />
              <Spec k="Field days" v="8" />
              <Spec k="Interviews" v="75–100" />
              <Spec k="Curated" v="18 clips + 2 heroes" />
              <Spec k="Logo" v="Felt, table skirt, mic flags, QR + merch" />
              <Spec k="Rights" v="Organic + paid" />
              <Spec k="Exclusivity" v="♣ NY/NJ category lock" />
            </div>
            <span className={styles.cpaPill}>+ CPAs billed separately, on top</span>
          </article>

          {/* Package 3 */}
          <article className={`${styles.pkg} ${styles.pkgAnchor}`}>
            <div className={styles.pkgHead}>
              <div>
                <p className={styles.pkgKicker}>Flagship · Anchor</p>
                <h3 className={styles.pkgName}>Package 3</h3>
                <p className={styles.pkgTagline}>Three-state land-grab</p>
              </div>
              <div className={styles.pkgPriceWrap}>
                <div className={styles.pkgPrice}>$100K+</div>
                <p className={styles.pkgPriceSub}>Media only · Target $125–150K</p>
              </div>
            </div>
            <div className={styles.specGrid}>
              <Spec k="Regions" v="NY + NJ + CA" />
              <Spec k="Events" v="20 across all three states" />
              <Spec k="Field days" v="20 · ~$4K/day" />
              <Spec k="Interviews" v="300–400" />
              <Spec k="Curated" v="20 curated + WC Final flagship film + 4 heroes" />
              <Spec k="Logo" v="Full suite — apparel, mic flags, merch, all markets" />
              <Spec k="Rights" v="Co-owned with Novig — fully sponsored" />
              <Spec k="Exclusivity" v="♣ 3-state category lockout" />
            </div>
            <span className={styles.cpaPill}>+ CPAs billed separately, on top</span>
          </article>
        </div>

        <div className={`${styles.callout} ${styles.calloutGold}`}>
          <p className={styles.calloutLabel}>What you’re really buying</p>
          <p className={styles.calloutText}>
            The category lockout is the line that matters: across NY, NJ &amp; CA during your launch
            window, no Kalshi and no Polymarket on a Street Corner Sports table. A funded competitor
            will pay specifically to deny rivals this demo — which is why the exclusivity, not the
            day count, is the price.
          </p>
        </div>
      </section>

      {/* ---------------- CPA UPSIDE ---------------- */}
      <section className={`${styles.section} ${styles.cpaSection}`}>
        <span className={styles.sectionNum}>05</span>
        <p className={styles.eyebrow}>100% of conversion is upside</p>
        <h2 className={styles.h2}>CPA — billed separately, on top of every package</h2>
        <p className={styles.intro}>
          You buy guaranteed media in the packages. You pay for performance only when it happens:
          funded, 21+, net-new accounts — verified, tracked, and deduped against your existing base.
        </p>

        <div className={`${styles.cards} ${styles.cards2}`}>
          <div className={styles.card}>
            <p className={`${styles.cardKicker} ${styles.pink}`} style={{ fontSize: '11.5px', letterSpacing: '0.16em' }}>
              Rate card — funded 21+ net-new
            </p>
            <div className={styles.rate}>
              <div className={styles.rateRow}>
                <div>
                  <div className={styles.rateName}>In-person verified</div>
                  <div className={styles.rateDesc}>walked through at the table — highest intent</div>
                </div>
                <div className={styles.ratePrice}>$40–50</div>
              </div>
              <div className={styles.rateRow}>
                <div>
                  <div className={styles.rateName}>Content-attributed</div>
                  <div className={styles.rateDesc}>signup driven by a clip</div>
                </div>
                <div className={styles.ratePrice}>$20–25</div>
              </div>
            </div>
            <p className={styles.note}>
              Tracked via per-region promo codes + Novig server-to-server postbacks + dedup. No
              tracking, no billing — clean attribution both ways.
            </p>
          </div>

          <div className={styles.card}>
            <p className={`${styles.cardKicker} ${styles.pink}`} style={{ fontSize: '11.5px', letterSpacing: '0.16em' }}>
              Projected funded volume — all three states / mo
            </p>
            <table className={styles.projTable}>
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th>Funded</th>
                  <th>CPA value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Conservative</td>
                  <td>~420</td>
                  <td>~$10.5K</td>
                </tr>
                <tr className={styles.baseRow}>
                  <td>Base</td>
                  <td>~980</td>
                  <td>~$24.5K</td>
                </tr>
                <tr>
                  <td>Aggressive</td>
                  <td>~1,950</td>
                  <td>~$49K</td>
                </tr>
              </tbody>
            </table>
            <p className={styles.note}>
              Modeled at a conservative ~$25 blended per funded account; in-person verified signups
              bill at the $40–50 premium, so realized CPA value typically runs higher. Plus a
              one-time launch-week spike of ~$15–40K concentrated in NJ around the World Cup Final.
            </p>
          </div>
        </div>

        <div className={`${styles.callout} ${styles.calloutGreen}`}>
          <p className={styles.calloutLabel}>The tailwind</p>
          <p className={styles.calloutText}>
            Novig’s $5-for-$50 offer sets a low funding bar — people will absolutely spend $5 to get
            $50 — which pushes conversion toward the top of these ranges. Recommend anchoring the
            qualifying definition on “funded 21+ net-new,” with the in-person premium reflecting
            higher intent and LTV.
          </p>
        </div>
      </section>

      {/* ---------------- CURATED VIDEO ---------------- */}
      <section className={styles.section}>
        <span className={styles.sectionNum}>06</span>
        <p className={styles.eyebrow}>À la carte — add to any package</p>
        <h2 className={styles.h2}>Curated video menu</h2>
        <p className={styles.intro}>
          Priced by production level and usage rights. Paid-ad rights are the biggest lever — a clip
          you can run as ad creative is worth multiples of the organic-only version, because it’s ad
          creative you didn’t have to produce.
        </p>

        <div className={`${styles.cards} ${styles.cards4}`}>
          <div className={styles.card}>
            <p className={styles.cardTitle}>Edited cutdown</p>
            <p className={styles.cardKicker}>$250–500</p>
            <p className={styles.cardBody}>Clean vertical edit from captured footage, organic use.</p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardTitle}>Branded edit + paid rights</p>
            <p className={styles.cardKicker}>$1–2K</p>
            <p className={styles.cardBody}>Run it as Meta / TikTok ad creative — your highest-leverage tier.</p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardTitle}>Hero piece</p>
            <p className={styles.cardKicker}>$3–6K</p>
            <p className={styles.cardBody}>Produced narrative — story arc, graphics, music, full + paid rights.</p>
          </div>
          <div className={`${styles.card} ${styles.cardFeatured}`}>
            <p className={styles.cardTitle}>Flagship film</p>
            <p className={styles.cardKicker}>$8–20K</p>
            <p className={styles.cardBody}>Tentpole, exclusive — the World Cup Final launch film.</p>
          </div>
        </div>

        <div className={`${styles.callout} ${styles.calloutPink}`}>
          <p className={styles.calloutLabel}>Don’t discount this one</p>
          <p className={styles.calloutText}>
            The World Cup Final launch film is the single highest-value asset in the entire campaign
            — your debut weekend, the biggest event on U.S. soil, in your flagship state, with
            category exclusivity. Price it at the top of the flagship range.
          </p>
        </div>
      </section>

      {/* ---------------- THE FRAME ---------------- */}
      <section className={styles.section}>
        <span className={styles.sectionNum}>07</span>
        <p className={styles.eyebrow}>How we keep it clean</p>
        <h2 className={styles.h2}>The frame</h2>
        <p className={styles.intro}>
          Three commitments that protect the brand and the spend on both sides.
        </p>

        <div className={`${styles.cards} ${styles.cards3}`}>
          <div className={styles.card}>
            <p className={styles.cardKicker}>21+, always</p>
            <p className={styles.cardBody}>
              Every venue is a verified 21+ crowd, matching Novig’s age requirement. No campus, no
              underage exposure — pristine, brand-safe inventory throughout.
            </p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardKicker}>Category exclusivity</p>
            <p className={styles.cardBody}>
              Lock the prediction-market slot. On Package 3, no competitor stands on a Street
              Corner Sports table across NY, NJ &amp; CA during your launch window.
            </p>
          </div>
          <div className={styles.card}>
            <p className={styles.cardKicker}>Launch-triggered</p>
            <p className={styles.cardBody}>
              Billing activates per state on go-live. If a date slips under regulatory pressure, you
              front nothing before you can convert there.
            </p>
          </div>
        </div>

        <div className={`${styles.callout} ${styles.calloutMuted}`}>
          <p className={styles.calloutLabel}>One honest note</p>
          <p className={styles.calloutText}>
            CFTC designation does not fully end the state-level fight — California, New York, and New
            Jersey regulators have been the most aggressive on prediction markets. Launch-triggered
            terms exist precisely so a moving go-live date never costs you. Final terms, rates, and
            the qualifying-account definition to be set by mutual agreement.
          </p>
        </div>
      </section>

      {/* ---------------- NEXT STEPS ---------------- */}
      <section className={styles.section}>
        <span className={styles.sectionNum}>08</span>
        <p className={styles.eyebrow}>The clock is already running</p>
        <h2 className={styles.h2}>From signature to launch week</h2>
        <p className={styles.intro}>
          It’s June. To capture launch week, the New Jersey crew has to be locked, briefed, and
          credentialed for World Cup Final weekend. Here’s the runway.
        </p>

        <ul className={styles.steps}>
          <li className={styles.step}>
            <span className={styles.stepText}>
              <b>Weeks 1–2 — Close.</b> Select a package, agree CPA rate definitions, paper the
              exclusivity and launch-trigger terms.
            </span>
          </li>
          <li className={styles.step}>
            <span className={styles.stepText}>
              <b>Week 3 — Stage.</b> Staff and brief street teams in the chosen metros; produce
              branded table kit, scan cards, and tracking codes.
            </span>
          </li>
          <li className={styles.step}>
            <span className={styles.stepText}>
              <b>Week 4 — Credential.</b> Lock NJ crew for World Cup Final weekend; confirm venue
              access and fan-zone positioning.
            </span>
          </li>
          <li className={styles.step}>
            <span className={styles.stepText}>
              <b>Jul 19 — Go live.</b> Launch day is the World Cup Final at MetLife — capture begins
              the moment Novig can convert, in front of the biggest crowd of the year.
            </span>
          </li>
          <li className={styles.step}>
            <span className={styles.stepText}>
              <b>Aug → Dec — Scale.</b> Roll into the monthly cadence: MLB, US Open, college
              football, NFL, World Series, NASCAR.
            </span>
          </li>
        </ul>

        <div className={styles.cta}>
          <div className={styles.ctaInner}>
            <p className={styles.ctaLabel}>Let’s build the deal this week</p>
            <a className={styles.ctaEmail} href="mailto:jackson@hedgepayments.com">
              jackson@hedgepayments.com
            </a>
            <p className={styles.ctaWho}>Jackson Fitzgerald · Hedge Payments · Street Corner Sports</p>
          </div>
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className={styles.footer}>
        <p className={styles.footerLogo}>
          Powered by <b>Street Corner</b>, a Hedge Brand
        </p>
        <p className={styles.disclaimer}>
          Proposal prepared for Novig, June 18, 2026. Pricing reflects guaranteed media; CPA figures are
          projections based on stated assumptions and are not guarantees of performance. All capture
          conducted at 21+ venues. Final terms, rates, and the definition of a qualifying funded
          account subject to mutual agreement. Event dates subject to league scheduling and
          regulatory go-live timing.
        </p>
      </footer>
    </main>
  )
}

function Spec({ k, v }: { k: string; v: string }) {
  const club = v.startsWith('♣ ')
  return (
    <div className={styles.specRow}>
      <span className={styles.specKey}>{k}</span>
      <span className={styles.specVal}>
        {club ? (
          <>
            <span className={styles.club}>♣</span>
            {v.slice(1)}
          </>
        ) : (
          v
        )}
      </span>
    </div>
  )
}
