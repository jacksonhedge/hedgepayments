'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
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
    tag: 'P1 · THE RAILS',
    name: 'HedgePay',
    accent: 'var(--cyan)',
    desc: 'B2B payments, wallets & payouts. The money backbone every Hedge product runs on.',
    href: '/products',
  },
  {
    tag: 'P2 · SPORTSBOOKS',
    name: 'SideBet',
    accent: 'var(--magenta)',
    desc: 'A round-up plugin for sportsbooks. Turn spare change into the next bit of side action.',
    href: '/sidebet',
  },
  {
    tag: 'P3 · CHECKOUT',
    name: 'Chance™',
    accent: 'var(--lime)',
    desc: 'Let shoppers pay a little more for a real shot at paying $0 — a prediction-market chance, built into checkout.',
    href: '/chance',
  },
  {
    tag: 'P4 · GREEK LIFE',
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

export default function ArcadeLanding() {
  const [flipping, setFlipping] = useState(false)
  const [result, setResult] = useState<'idle' | 'win' | 'lose'>('idle')
  const [score, setScore] = useState(0)
  const [method, setMethod] = useState<'card' | 'apple' | 'chance'>('chance')

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
              Hedge is the fun, easy money layer behind your favorite products —
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
                    {result === 'idle' ? (
                      <button
                        className={styles.payBtn}
                        onClick={() => play(WIN_PROB)}
                        disabled={flipping}
                      >
                        Add Chance · Pay ${PAY_WITH_CHANCE} →
                      </button>
                    ) : (
                      <button className={styles.payBtn} onClick={reset}>
                        ↺ Try again
                      </button>
                    )}
                  </div>
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
              {['HEDGEPAY', 'SIDEBET', 'CHANCE™', 'FRATERNITYBASE', 'POWERED BY HEDGE'].map(
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
              Four ways to play.
            </h2>
            <p className={styles.sectionLede}>
              Every product rides the same Hedge rails — accounts, ledger, wallet,
              payouts. The fun lives up front; the money plumbing is shared and
              boring (on purpose).
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
                Fun, easy payments for the people who use them. The money layer behind
                HedgePay, SideBet, Chance™ &amp; FraternityBase.
              </p>
            </div>
            <div className={styles.footCol}>
              <h4>Products</h4>
              <a href="/products">HedgePay</a>
              <a href="/sidebet">SideBet</a>
              <a href="/chance">Chance™</a>
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
