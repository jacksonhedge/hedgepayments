'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import styles from './ArcadeLanding.module.css'

/* ---- Reveal-on-scroll wrapper ---- */
function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 26 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* ---- Product cabinets ---- */
const PRODUCTS = [
  {
    tag: 'OUR PRODUCT · CHECKOUT',
    name: 'Chance™',
    accent: 'var(--lime)',
    desc: 'Let shoppers pay a little more for a real shot at paying $0 — a prediction-market chance, built into checkout. Powered by Hedge Payments.',
    href: '/chance',
  },
  {
    tag: 'OUR PRODUCT · SPORTSBOOKS',
    name: 'SideBet',
    accent: 'var(--magenta)',
    desc: 'A round-up plugin for sportsbooks. Turn spare change into the next bit of side action. Powered by Hedge Payments.',
    href: '/sidebet',
  },
  {
    tag: 'CLIENT · BNPL',
    name: 'CoverPay',
    accent: 'var(--cyan)',
    desc: 'BNPL aggregation over Klarna, Affirm, Afterpay & more — one of the teams running their checkout on Hedge rails.',
    href: '/demo/coverpay',
  },
  {
    tag: 'CLIENT · GREEK LIFE',
    name: 'FraternityBase',
    accent: 'var(--gold)',
    desc: 'Group commerce for fraternities — mockups to chapter orders, paid out on Hedge rails.',
    href: 'https://fraternitybase.com',
  },
]

// The hero checkout demo: a $50 order, pay +$5 for a ~10-to-1 shot at $0.
const ITEM = 50
const PREMIUM = 5
const PAY_WITH_CHANCE = ITEM + PREMIUM // 55
const WIN_PROB = 0.1

// Pay more at checkout → better odds the whole order is refunded.
const CHANCE_TIERS = [
  { add: '+$5', odds: '10 : 1', note: '1 in 11' },
  { add: '+$10', odds: '5 : 1', note: '1 in 6' },
  { add: '+$25', odds: '2 : 1', note: '1 in 3' },
]

// ---- Market-picker screen ----
// "Pick a price" (your stake) and "pick a percent" (the odds), then pick a real
// prediction-market bet to try to break even on the order.
const STAKE_OPTIONS = [5, 10, 25]
const PCT_OPTIONS = [8, 17, 33, 50] // implied % to win → longer to shorter odds

// Representative markets (the live picker pulls real ones via the Chance engine).
const PICKER_MARKETS = [
  // ~8% — longshots
  { venue: 'Polymarket', q: 'Spurs cover -22.5 vs Knicks', pct: 8, resolvesIn: '8h' },
  { venue: 'Polymarket', q: 'Solana between $50–$60 Friday', pct: 8, resolvesIn: '2d' },
  { venue: 'Kalshi', q: 'NYC high above 95°F this week', pct: 8, resolvesIn: '3d' },
  { venue: 'Polymarket', q: 'Any MLB no-hitter this weekend', pct: 8, resolvesIn: '3d' },
  { venue: 'Kalshi', q: 'Bitcoin above $130k by Sunday', pct: 8, resolvesIn: '4d' },
  // ~17%
  { venue: 'Kalshi', q: 'NYC high above 90°F tomorrow', pct: 17, resolvesIn: '1d' },
  { venue: 'Polymarket', q: 'Knicks/Spurs total Under 202.5', pct: 17, resolvesIn: '8h' },
  { venue: 'Polymarket', q: 'ETH above $4,000 Friday', pct: 17, resolvesIn: '2d' },
  { venue: 'Kalshi', q: 'Jobless claims above 250k', pct: 17, resolvesIn: '4d' },
  { venue: 'Polymarket', q: 'Yankees sweep the series', pct: 17, resolvesIn: '3d' },
  // ~33%
  { venue: 'Kalshi', q: 'Fed holds rates at June meeting', pct: 33, resolvesIn: '5d' },
  { venue: 'Polymarket', q: 'BTC above $120k this week', pct: 33, resolvesIn: '4d' },
  { venue: 'Polymarket', q: 'Yankees win tonight vs Red Sox', pct: 33, resolvesIn: '6h' },
  { venue: 'Kalshi', q: 'S&P 500 down on the week', pct: 33, resolvesIn: '2d' },
  { venue: 'Polymarket', q: 'Lakers cover -6.5', pct: 33, resolvesIn: '5h' },
  // ~50% — coin flips
  { venue: 'Kalshi', q: 'S&P 500 closes green today', pct: 50, resolvesIn: '6h' },
  { venue: 'Polymarket', q: 'Lakers win tonight', pct: 50, resolvesIn: '5h' },
  { venue: 'Polymarket', q: 'Bitcoin up on the day', pct: 50, resolvesIn: '10h' },
  { venue: 'Kalshi', q: 'Rain in Chicago tomorrow', pct: 50, resolvesIn: '1d' },
  { venue: 'Polymarket', q: 'Mets beat the Braves', pct: 50, resolvesIn: '7h' },
]

// Representative 24h volumes, for the prediction-market card look.
const MKT_VOL = ['2.4M', '1.1M', '840K', '3.2M', '560K', '1.7M', '920K']

export default function ArcadeLanding() {
  const [flipping, setFlipping] = useState(false)
  const [result, setResult] = useState<'idle' | 'win' | 'lose'>('idle')
  const [score, setScore] = useState(0)
  const [method, setMethod] = useState<'card' | 'apple' | 'chance'>('chance')

  // Market-picker screen
  const [pickerOpen, setPickerOpen] = useState(false)
  const [stake, setStake] = useState(5)
  const [winBack, setWinBack] = useState(PAY_WITH_CHANCE) // default: win back the whole order
  const [pickedMarket, setPickedMarket] = useState<number | null>(null)
  const [step, setStep] = useState(1) // 1 price · 2 win-back · 3 market

  function play(prob: number) {
    if (flipping) return
    setFlipping(true)
    setResult('idle')
    window.setTimeout(() => {
      const win = Math.random() < prob
      setResult(win ? 'win' : 'lose')
      setFlipping(false)
      if (win) setScore((s) => s + 1)
    }, 950)
  }

  function reset() {
    setResult('idle')
    setFlipping(false)
  }

  const priceText = result === 'win' ? '$0.00' : `$${PAY_WITH_CHANCE}.00`
  const priceClass =
    result === 'win' ? styles.win : result === 'lose' ? styles.lose : ''
  const caption =
    result === 'win'
      ? 'WINNER · FULLY REFUNDED'
      : result === 'lose'
      ? 'NO LUCK — TRY AGAIN'
      : flipping
      ? 'ROLLING…'
      : '1 IN 10 TO PAY $0'

  // Market-picker derived values (rendered inside the checkout screen)
  const pOrder = PAY_WITH_CHANCE
  const pTotal = pOrder + stake
  const pMarket = pickedMarket != null ? PICKER_MARKETS[pickedMarket] : null
  const pPayout = pMarket ? stake / (pMarket.pct / 100) : 0 // actual win-back if it hits
  const winsFull = pPayout >= pOrder
  const winBackOptions = [PAY_WITH_CHANCE, 35, 25].filter((w) => w > stake)
  const sortedMarkets = PICKER_MARKETS.map((m, i) => ({
    m,
    i,
    payout: stake / (m.pct / 100),
  }))
    .sort((a, b) => Math.abs(a.payout - winBack) - Math.abs(b.payout - winBack))
    .slice(0, 7)

  return (
    <div className={styles.root}>
      <div className={styles.grid} aria-hidden />
      <div className={styles.scanlines} aria-hidden />
      <div className={styles.vignette} aria-hidden />

      {/* NAV */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <a href="/" className={styles.logo}>
            HEDGE
          </a>
          <div className={styles.navLinks}>
            <a className={styles.navLink} href="#products">
              Products
            </a>
            <a className={styles.navLink} href="#rails">
              The Rails
            </a>
            <a className={styles.navLink} href="#chance">
              Chance
            </a>
            <a className={styles.navLink} href="/developers">
              Developers
            </a>
          </div>
          <div className={styles.navCtas}>
            <a className={`${styles.btn} ${styles.btnGhost} ${styles.btnSmall}`} href="/business-login">
              Log in
            </a>
            <a className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSmall}`} href="/get-started">
              Insert Coin ▸
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className={styles.shell}>
        <div className={styles.hero}>
          <div>
            <motion.div
              className={styles.eyebrow}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className={styles.dot} /> NOW PLAYING · FUN MONEY
            </motion.div>

            <motion.h1
              className={styles.h1}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              Payments
              <br />
              made <span className={styles.lineMag}>fun</span>
              <span className={styles.lineCyan}>.</span>
            </motion.h1>

            <motion.p
              className={styles.sub}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22 }}
            >
              Hedge is the white-label money layer behind your favorite products —
              <strong> wallets, round-ups, and flip-to-win checkout.</strong> You
              bring the users. We bring the rails.
            </motion.p>

            <motion.div
              className={styles.heroCtas}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32 }}
            >
              <a className={`${styles.btn} ${styles.btnPrimary}`} href="/get-started">
                Start Free
              </a>
              <a className={`${styles.btn} ${styles.btnGhost}`} href="/contact">
                Talk to Sales
              </a>
            </motion.div>

            <motion.div
              className={styles.heroNote}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <span className={styles.neonLime}>◆</span> Built on a real ledger ·
              white-label today, our own rails tomorrow.
            </motion.div>
          </div>

          {/* Arcade cabinet hero visual = checkout with Chance */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.cabinet}>
              <div className={styles.screen}>
                <div className={styles.screenHead}>
                  <span>CHECKOUT</span>
                  <span>
                    SCORE <span className={styles.scoreVal}>{String(score).padStart(4, '0')}</span>
                  </span>
                </div>

                <div className={styles.coRow}>
                  <span>Campus Hoodie</span>
                  <span className={styles.coTotal}>
                    {method === 'chance' ? `$${PAY_WITH_CHANCE}.00` : `$${ITEM}.00`}
                  </span>
                </div>

                <div className={styles.coLabel}>Pay with</div>
                <div className={styles.coOptions}>
                  <button
                    className={`${styles.coOpt} ${method === 'card' ? styles.coOptSel : ''}`}
                    onClick={() => {
                      setMethod('card')
                      reset()
                    }}
                  >
                    <span className={styles.radio} />
                    <span className={styles.coName}>Card ···· 4242</span>
                    <span className={styles.coMeta}>${ITEM}.00</span>
                  </button>
                  <button
                    className={`${styles.coOpt} ${method === 'apple' ? styles.coOptSel : ''}`}
                    onClick={() => {
                      setMethod('apple')
                      reset()
                    }}
                  >
                    <span className={styles.radio} />
                    <span className={styles.coName}>Apple Pay</span>
                    <span className={styles.coMeta}>${ITEM}.00</span>
                  </button>
                  <button
                    className={`${styles.coOpt} ${styles.coOptFlip} ${
                      method === 'chance' ? styles.coOptSel : ''
                    }`}
                    onClick={() => setMethod('chance')}
                  >
                    <span className={styles.radio} />
                    <span className={styles.coName}>
                      Chance™ <span className={styles.coBadge}>FUN</span>
                    </span>
                    <span className={styles.coMeta}>pay ${PAY_WITH_CHANCE} · win it free</span>
                  </button>
                </div>

                {method === 'chance' ? (
                  <>
                    <div className={styles.coFlip}>
                      <div
                        className={`${styles.coin} ${flipping ? styles.coinFlip : styles.coinIdle}`}
                        style={{ width: 64, height: 64 }}
                      >
                        <div className={styles.coinFace}>${PAY_WITH_CHANCE}</div>
                        <div className={`${styles.coinFace} ${styles.coinBack}`}>$0</div>
                      </div>
                      <div className={`${styles.priceTag} ${priceClass}`} style={{ fontSize: 34 }}>
                        {priceText}
                      </div>
                      <div className={styles.priceCaption}>{caption}</div>
                      <button
                        className={styles.payBtn}
                        onClick={() => {
                          setStep(1)
                          setWinBack(PAY_WITH_CHANCE)
                          setPickedMarket(null)
                          setPickerOpen((o) => !o)
                        }}
                      >
                        {pickerOpen ? 'Hide markets ↑' : 'Pick your market →'}
                      </button>
                    </div>

                    <AnimatePresence initial={false}>
                      {pickerOpen && (
                        <motion.div
                          key="picker-drawer"
                          className={styles.pickerOverlayInScreen}
                          initial={{ y: '100%' }}
                          animate={{ y: 0 }}
                          exit={{ y: '100%' }}
                          transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <div className={styles.pickerWiz}>
                            <div className={styles.wizTop}>
                              <button
                                className={styles.pickerBack}
                                onClick={() => (step > 1 ? setStep((s) => s - 1) : setPickerOpen(false))}
                                aria-label="Back"
                              >
                                ←
                              </button>
                              <div className={styles.wizDots}>
                                {[1, 2, 3].map((n) => (
                                  <span
                                    key={n}
                                    className={`${styles.wizDot} ${step >= n ? styles.wizDotOn : ''}`}
                                  />
                                ))}
                              </div>
                              <div className={styles.pickerVenues}>
                                <span className={styles.vChip}>POLY</span>
                                <span className={styles.vChip}>KALSHI</span>
                              </div>
                            </div>

                            {step === 1 && (
                              <div className={styles.wizBody}>
                                <div className={styles.wizKicker}>Step 1 of 3</div>
                                <h3 className={styles.wizTitle}>Pick your price</h3>
                                <p className={styles.wizSub}>
                                  How much do you want to risk for a shot at paying $0?
                                </p>
                                <div className={styles.wizBigNum}>${stake}</div>
                                <div className={styles.wizChoices}>
                                  {STAKE_OPTIONS.map((s) => (
                                    <button
                                      key={s}
                                      className={`${styles.chip} ${stake === s ? styles.chipSel : ''}`}
                                      onClick={() => {
                                        setStake(s)
                                        setWinBack(PAY_WITH_CHANCE)
                                        setPickedMarket(null)
                                      }}
                                    >
                                      Bet ${s}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {step === 2 && (
                              <div className={styles.wizBody}>
                                <div className={styles.wizKicker}>Step 2 of 3</div>
                                <h3 className={styles.wizTitle}>Win back</h3>
                                <p className={styles.wizSub}>
                                  How much of your ${pOrder} order do you want a shot at? Less = better odds.
                                </p>
                                <div className={styles.wizBigNum}>
                                  ${winBack}
                                  {winBack >= pOrder && <span className={styles.wizBigSub}>ALL</span>}
                                </div>
                                <div className={styles.wizChoices}>
                                  {winBackOptions.map((w) => (
                                    <button
                                      key={w}
                                      className={`${styles.chip} ${winBack === w ? styles.chipSel : ''}`}
                                      onClick={() => {
                                        setWinBack(w)
                                        setPickedMarket(null)
                                      }}
                                    >
                                      <b>{w >= pOrder ? `All $${w}` : `$${w}`}</b>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {step === 3 && (
                              <div className={styles.wizBody}>
                                <div className={styles.wizKicker}>Step 3 of 3</div>
                                <h3 className={styles.wizTitle}>Pick a market</h3>
                                <p className={styles.wizSub}>
                                  Bet ${stake} to win back{' '}
                                  {winBack >= pOrder ? 'your full' : `~$${winBack} of your`} ${pOrder} order.
                                </p>
                                <div className={styles.marketList}>
                                  {sortedMarkets.map(({ m, i, payout }) => (
                                    <button
                                      key={i}
                                      className={`${styles.market} ${pickedMarket === i ? styles.marketSel : ''}`}
                                      onClick={() => setPickedMarket(i)}
                                    >
                                      <div className={styles.mTop}>
                                        <span
                                          className={`${styles.mVenue} ${m.venue === 'Kalshi' ? styles.mKalshi : styles.mPoly}`}
                                        >
                                          {m.venue}
                                        </span>
                                        <span className={styles.mVol}>
                                          ${MKT_VOL[i % MKT_VOL.length]} Vol
                                        </span>
                                      </div>
                                      <div className={styles.mQ}>{m.q}</div>
                                      <div className={styles.mBot}>
                                        <span className={styles.mYes}>Yes {m.pct}¢</span>
                                        <span className={styles.mNo}>No {100 - m.pct}¢</span>
                                        <span className={styles.mWin}>win ${payout.toFixed(0)}</span>
                                        <span className={styles.mTime}>{m.resolvesIn}</span>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className={styles.wizFoot}>
                              {step < 3 ? (
                                <button
                                  className={styles.payBtn}
                                  onClick={() => setStep((s) => s + 1)}
                                >
                                  Next →
                                </button>
                              ) : (
                                <>
                                  <div
                                    className={`${styles.pickerMath} ${pMarket ? styles.mathWin : ''}`}
                                  >
                                    {!pMarket ? (
                                      <span>Pick a market to see your win-back.</span>
                                    ) : winsFull ? (
                                      <span>
                                        If it hits → win back <b>${pPayout.toFixed(0)}</b> — your order’s <b>free</b>.
                                      </span>
                                    ) : (
                                      <span>
                                        If it hits → win back <b>${pPayout.toFixed(0)}</b> of your ${pOrder}.
                                      </span>
                                    )}
                                  </div>
                                  <button
                                    className={styles.payBtn}
                                    disabled={!pMarket}
                                    onClick={() => setPickerOpen(false)}
                                  >
                                    Place bet · Pay ${pTotal}
                                  </button>
                                  <button
                                    className={styles.pickerAsIs}
                                    onClick={() => setPickerOpen(false)}
                                  >
                                    Pay ${pOrder} as is
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <button className={styles.payBtn}>Pay ${ITEM}.00</button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* TICKER */}
      <div className={styles.ticker} aria-hidden>
        <div className={styles.tickerTrack}>
          {[0, 1].map((dup) => (
            <span key={dup} style={{ display: 'inline-flex' }}>
              {['HEDGE PAYMENTS', 'SIDEBET', 'CHANCE™', 'COVERPAY', 'POWERED BY HEDGE'].map(
                (w) => (
                  <span className={styles.tickerItem} key={w + dup}>
                    <em>{w}</em> <span className={styles.tickerStar}>✦</span>
                  </span>
                ),
              )}
            </span>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <section className={styles.section} id="products">
        <div className={styles.shell}>
          <Reveal className={styles.sectionHead}>
            <span className={styles.kicker}>Choose your player</span>
            <h2 className={styles.h2}>
              One backbone.
              <br />
              Built on Hedge.
            </h2>
            <p className={styles.sectionLede}>
              Hedge Payments is the white-label money layer — accounts, ledger,
              wallet, payouts. We build our own products on it, and so do our
              clients. The fun lives up front; the plumbing is shared and boring
              (on purpose).
            </p>
          </Reveal>

          <div className={styles.cabGrid}>
            {PRODUCTS.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.08}>
                <div className={styles.cab} style={{ '--accent': p.accent } as React.CSSProperties}>
                  <div className={styles.cabTag}>{p.tag}</div>
                  <h3 className={styles.cabName}>{p.name}</h3>
                  <p className={styles.cabDesc}>{p.desc}</p>
                  <a className={styles.cabLink} href={p.href}>
                    Learn more ▸
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CHANCE BAND (signature) */}
      <section id="chance">
        <Reveal>
          <div className={styles.flipBand}>
            <div>
              <span className={styles.kicker}>The signature move</span>
              <h2 className={styles.h2}>
                Pay a little more.
                <br />
                <span className={styles.neonLime}>Maybe nothing.</span>
              </h2>
              <p className={styles.sectionLede}>
                Chance™ adds a small premium at checkout — say $5 on a $50 order. That
                $5 rides a real prediction-market position at about 10-to-1. If it
                hits, the whole order is refunded and your shopper pays $0. Add more
                for better odds. Hedge routes to a live market — never the house — so
                you carry no book risk.
              </p>
              <div className={styles.heroCtas} style={{ marginTop: 28 }}>
                <a className={`${styles.btn} ${styles.btnGhost}`} href="/chance">
                  See Chance ▸
                </a>
              </div>
            </div>
            <div className={styles.cabinet}>
              <div className={styles.screen}>
                <div className={styles.screenHead}>
                  <span>CHANCE LADDER</span>
                  <span>$50 ORDER</span>
                </div>
                <div className={styles.ladder} style={{ flexDirection: 'column', gap: 10 }}>
                  {CHANCE_TIERS.map((t) => (
                    <div
                      key={t.add}
                      className={styles.stake}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'default' }}
                    >
                      <b style={{ display: 'inline' }}>Pay {t.add}</b>
                      <span>
                        {t.odds} → {t.note} to pay $0
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* RAILS / credibility */}
      <section className={styles.section} id="rails">
        <div className={styles.shell}>
          <div className={styles.rails}>
            <Reveal>
              <div>
                <span className={styles.kicker}>Behind the fun</span>
                <h2 className={styles.h2}>Serious rails.</h2>
                <ul className={styles.railList}>
                  <li>
                    <span className={styles.railBullet}>01</span>
                    <span>
                      <b>One ledger.</b> Double-entry record of every cent across every
                      product — the asset we own from day one.
                    </span>
                  </li>
                  <li>
                    <span className={styles.railBullet}>02</span>
                    <span>
                      <b>Wallet &amp; payouts.</b> Hold balances, run holds, settle to
                      banks — executed through Stripe today, our own processor tomorrow.
                    </span>
                  </li>
                  <li>
                    <span className={styles.railBullet}>03</span>
                    <span>
                      <b>One API.</b> Anything that touches money or identity, your app
                      calls once. The fun stays yours.
                    </span>
                  </li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <div className={styles.scoreboard}>
                <div className={styles.scoreRow}>
                  <span className={styles.scoreLabel}>Products on the rails</span>
                  <span className={`${styles.scoreNum} ${styles.neon}`}>04</span>
                </div>
                <div className={styles.scoreRow}>
                  <span className={styles.scoreLabel}>Shared money concerns</span>
                  <span className={`${styles.scoreNum} ${styles.neonMag}`}>04</span>
                </div>
                <div className={styles.scoreRow}>
                  <span className={styles.scoreLabel}>Lines to integrate</span>
                  <span className={`${styles.scoreNum} ${styles.neonLime}`}>~12</span>
                </div>
                <div className={styles.scoreRow}>
                  <span className={styles.scoreLabel}>Book risk you carry</span>
                  <span className={`${styles.scoreNum} ${styles.neon}`}>00</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaBand}>
        <Reveal>
          <span className={styles.kicker}>Insert coin to continue</span>
          <h2 className={styles.ctaH}>
            Add <span className={styles.neonMag}>fun payments</span> to your product.
          </h2>
          <p className={styles.ctaSub}>
            Drop in a few lines. Your users get the delight; you get the revenue. Hedge
            handles the money underneath.
          </p>
          <div className={styles.ctaRow}>
            <a className={`${styles.btn} ${styles.btnPrimary}`} href="/get-started">
              Start Free
            </a>
            <a className={`${styles.btn} ${styles.btnGhost}`} href="/developers">
              Read the Docs
            </a>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.shell}>
          <div className={styles.footGrid}>
            <div className={styles.footCol}>
              <a href="/" className={styles.logo}>
                HEDGE
              </a>
              <p className={styles.footBlurb}>
                White-label payments infrastructure. The money layer behind
                SideBet, Chance™ &amp; the products our clients build.
              </p>
            </div>
            <div className={styles.footCol}>
              <h4>Products</h4>
              <a href="/chance">Chance™</a>
              <a href="/sidebet">SideBet</a>
              <h4 style={{ marginTop: 14 }}>Clients</h4>
              <a href="/demo/coverpay">CoverPay</a>
              <a href="https://fraternitybase.com">FraternityBase</a>
            </div>
            <div className={styles.footCol}>
              <h4>Build</h4>
              <a href="/developers">Developers</a>
              <a href="/docs">API Docs</a>
              <a href="/get-started">Get Started</a>
              <a href="/business-login">Log In</a>
            </div>
            <div className={styles.footCol}>
              <h4>Company</h4>
              <a href="/partners">Partners</a>
              <a href="/contact">Contact</a>
              <a href="/blog">Blog</a>
            </div>
          </div>
          <div className={styles.footBottom}>
            <span>© 2026 HEDGE · ALL RIGHTS RESERVED</span>
            <span className={styles.neonMag}>★ INSERT COIN TO CONTINUE ★</span>
          </div>
        </div>
      </footer>

    </div>
  )
}
