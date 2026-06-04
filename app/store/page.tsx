'use client'

import { useState } from 'react'
import styles from './store.module.css'

// ---- catalog (keyboard is the default) ----
const PRODUCTS = [
  {
    id: 'kb',
    emoji: '⌨️',
    name: 'Lumen 75% Mechanical Keyboard',
    price: 85,
    desc: 'Hot-swappable, gasket-mounted, PBT keycaps. The everyday driver that actually feels good to type on.',
    bg: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
  },
  {
    id: 'hp',
    emoji: '🎧',
    name: 'Lumen Studio Headphones',
    price: 129,
    desc: 'Closed-back 40mm drivers, 40-hour battery, USB-C. Mix, game, or zone all the way out.',
    bg: 'linear-gradient(135deg, #fff1f2, #ffe4e6)',
  },
  {
    id: 'lp',
    emoji: '💡',
    name: 'Lumen Desk Lamp',
    price: 45,
    desc: 'Warm-to-cool dimming, USB-C passthrough, zero flicker. Light that works as late as you do.',
    bg: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
  },
]

// ---- real prediction markets (frac = portion of the order you'd win back) ----
const MARKETS = [
  { venue: 'kalshi', q: 'Will the S&P 500 close green today?', chance: 52, frac: 0.3 },
  { venue: 'polymarket', q: 'Lakers to beat the Celtics tonight', chance: 45, frac: 0.4 },
  { venue: 'kalshi', q: 'Will NYC hit 90°F this week?', chance: 33, frac: 0.55 },
  { venue: 'kalshi', q: 'Will the Fed cut rates this month?', chance: 28, frac: 0.65 },
  { venue: 'polymarket', q: 'Will Bitcoin top $125k in June?', chance: 20, frac: 0.78 },
  { venue: 'polymarket', q: 'Will Solana flip $250 this month?', chance: 13, frac: 1.0 },
]

type View = 'product' | 'checkout' | 'chance' | 'result'
type Pay = 'debit' | 'credit' | 'venmo' | 'klarna' | 'chance'

const METHOD_NAME: Record<Pay, string> = {
  debit: 'Debit card',
  credit: 'Credit card',
  venmo: 'Venmo',
  klarna: 'Klarna',
  chance: 'Chance',
}

function VenueTag({ venue }: { venue: string }) {
  if (venue === 'kalshi') {
    return (
      <span className={`${styles.venue} ${styles.venueKalshi}`}>
        <span className={styles.kalshiIcon}>K</span>
        <span className={styles.venueNameK}>Kalshi</span>
      </span>
    )
  }
  return (
    <span className={`${styles.venue} ${styles.venuePoly}`}>
      <img src="/logos/polymarket.png" alt="Polymarket" className={styles.venueLogoSq} />
      <span className={styles.venueName}>Polymarket</span>
    </span>
  )
}

export default function StorePage() {
  const [view, setView] = useState<View>('product')
  const [prodIdx, setProdIdx] = useState(0)
  const [pay, setPay] = useState<Pay>('chance')
  const [picked, setPicked] = useState<number | null>(null)
  const [resolving, setResolving] = useState(false)
  const [outcome, setOutcome] = useState<'win' | 'lose' | 'card' | null>(null)

  const product = PRODUCTS[prodIdx]
  const order = product.price

  const METHODS: { id: Pay; meta: string; color: string; darkText?: boolean; btn: string }[] = [
    { id: 'debit', meta: 'Visa · Mastercard', color: '#1a1a1f', btn: '💳 Debit' },
    { id: 'credit', meta: 'Visa · Mastercard · Amex', color: '#1a1a1f', btn: '💳 Credit' },
    { id: 'venmo', meta: 'Confirm in the Venmo app', color: '#008cff', btn: 'Venmo' },
    { id: 'klarna', meta: '4 interest-free payments', color: '#ffb3c7', darkText: true, btn: 'Klarna' },
    { id: 'chance', meta: `win up to $${order} back`, color: '#0e9f6e', btn: '✦ Chance' },
  ]
  const mkt = picked != null ? MARKETS[picked] : null
  const winBack = mkt ? Math.round(order * mkt.frac) : 0
  const finalPrice = outcome === 'win' ? order - winBack : order

  function reset() {
    setView('product')
    setPicked(null)
    setOutcome(null)
    setResolving(false)
    setPay('chance')
  }

  function payCard() {
    setOutcome('card')
    setView('result')
  }

  function placeBet() {
    if (mkt == null) return
    setView('result')
    setResolving(true)
    setOutcome(null)
    window.setTimeout(() => {
      setOutcome(Math.random() * 100 < mkt!.chance ? 'win' : 'lose')
      setResolving(false)
    }, 1900)
  }

  return (
    <div className={styles.root}>
      {/* store header */}
      <div className={styles.storeBar}>
        <div className={styles.storeBarIn}>
          <div className={styles.brand}>
            <span className={styles.brandDot}>L</span> LUMEN
          </div>
          <div className={styles.barLinks}>
            <span>Keyboards</span>
            <span>Audio</span>
            <span>Desk</span>
            <span>Sale</span>
          </div>
          <div className={styles.cart}>🛒 1</div>
        </div>
      </div>

      <div className={styles.wrap}>
        {/* ============ PRODUCT ============ */}
        {view === 'product' && (
          <div className={styles.product}>
            <div>
              <div className={styles.shot} style={{ background: product.bg }}>
                {product.emoji}
              </div>
              <div className={styles.thumbs}>
                {PRODUCTS.map((p, i) => (
                  <button
                    key={p.id}
                    className={`${styles.thumb} ${i === prodIdx ? styles.thumbOn : ''}`}
                    style={{ background: p.bg }}
                    onClick={() => setProdIdx(i)}
                  >
                    {p.emoji}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.pInfo}>
              <div className={styles.pEyebrow}>Lumen · Free shipping</div>
              <h1 className={styles.pTitle}>{product.name}</h1>
              <div className={styles.pStars}>
                ★★★★★ <span>(312 reviews)</span>
              </div>
              <div className={styles.pPrice}>${order}.00</div>
              <p className={styles.pDesc}>{product.desc}</p>
              <button className={styles.buy} onClick={() => setView('checkout')}>
                Buy it now
              </button>

              <div className={styles.expressLabel}>
                <span>Express checkout</span>
              </div>
              <div className={styles.expressGrid}>
                {METHODS.map((m) => (
                  <button
                    key={m.id}
                    className={`${styles.pmBtn} ${m.id === 'chance' ? styles.chanceShine : ''}`}
                    style={{ background: m.color, color: m.darkText ? '#0a0a0a' : '#fff' }}
                    onClick={() => {
                      setPay(m.id)
                      setView(m.id === 'chance' ? 'chance' : 'checkout')
                    }}
                  >
                    {m.id === 'chance' ? (
                      <>
                        ✦ <span className={styles.script}>Chance</span>
                      </>
                    ) : (
                      m.btn
                    )}
                  </button>
                ))}
              </div>
              <div className={styles.buyNote}>
                ✦ <span className={styles.chanceTease}>Chance</span> lets you win up to ${order} of this purchase back.
              </div>
            </div>
          </div>
        )}

        {/* ============ CHECKOUT ============ */}
        {view === 'checkout' && (
          <>
            <button className={styles.coBack} onClick={() => setView('product')}>
              ← Back to product
            </button>
            <div className={styles.coGrid}>
              <div>
                <div className={styles.coSection}>
                  <h3 className={styles.coH}>Contact</h3>
                  <div className={styles.field}>
                    <label>Email</label>
                    <input className={styles.input} defaultValue="alex@example.com" />
                  </div>
                </div>

                <div className={styles.coSection}>
                  <h3 className={styles.coH}>Delivery</h3>
                  <div className={styles.two}>
                    <div className={styles.field}>
                      <label>First name</label>
                      <input className={styles.input} defaultValue="Alex" />
                    </div>
                    <div className={styles.field}>
                      <label>Last name</label>
                      <input className={styles.input} defaultValue="Rivera" />
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label>Address</label>
                    <input className={styles.input} defaultValue="220 Market St, Apt 4" />
                  </div>
                  <div className={styles.two}>
                    <div className={styles.field}>
                      <label>City</label>
                      <input className={styles.input} defaultValue="San Francisco" />
                    </div>
                    <div className={styles.field}>
                      <label>ZIP</label>
                      <input className={styles.input} defaultValue="94103" />
                    </div>
                  </div>
                </div>

                <div className={styles.coSection}>
                  <h3 className={styles.coH}>Payment</h3>
                  <div className={styles.pm}>
                    {METHODS.map((m) => {
                      const sel = pay === m.id
                      const isChance = m.id === 'chance'
                      return (
                        <div key={m.id}>
                          <div
                            className={`${styles.pmRow} ${sel ? (isChance ? styles.pmSelChance : styles.pmSel) : ''}`}
                            onClick={() => setPay(m.id)}
                          >
                            <span
                              className={`${styles.radio} ${sel ? (isChance ? styles.radioOnChance : styles.radioOn) : ''}`}
                            />
                            <span className={styles.pmName}>
                              {m.id === 'venmo' ? (
                                <span style={{ color: '#008cff', fontWeight: 800 }}>Venmo</span>
                              ) : m.id === 'klarna' ? (
                                <span
                                  style={{
                                    background: '#ffb3c7',
                                    color: '#0a0a0a',
                                    fontWeight: 800,
                                    padding: '2px 9px',
                                    borderRadius: 6,
                                  }}
                                >
                                  Klarna.
                                </span>
                              ) : isChance ? (
                                <>
                                  <span className={styles.script}>Chance</span>{' '}
                                  <span className={styles.chanceBadge}>Win it back</span>
                                </>
                              ) : (
                                <>💳 {METHOD_NAME[m.id]}</>
                              )}
                            </span>
                            <span className={styles.pmMeta}>{m.meta}</span>
                          </div>
                          {sel && (m.id === 'debit' || m.id === 'credit') && (
                            <div className={styles.cardFields}>
                              <div className={styles.field}>
                                <input className={styles.input} defaultValue="4242 4242 4242 4242" />
                              </div>
                              <div className={styles.two}>
                                <input className={styles.input} defaultValue="12 / 28" />
                                <input className={styles.input} defaultValue="CVC" />
                              </div>
                            </div>
                          )}
                          {sel && m.id === 'venmo' && (
                            <div className={styles.methodNote}>
                              You’ll approve ${order}.00 in the Venmo app.
                            </div>
                          )}
                          {sel && m.id === 'klarna' && (
                            <div className={styles.methodNote}>
                              4 payments of ${(order / 4).toFixed(2)} every 2 weeks · 0% interest.
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* order summary */}
              <div className={styles.summary}>
                <div className={styles.sumItem}>
                  <div className={styles.sumShot} style={{ background: product.bg }}>
                    {product.emoji}
                    <span className={styles.sumQty}>1</span>
                  </div>
                  <span className={styles.sumName}>
                    {product.name}
                    <small>Qty 1</small>
                  </span>
                  <span>${order}.00</span>
                </div>
                <div className={styles.sumLine}>
                  <span>Subtotal</span>
                  <span>${order}.00</span>
                </div>
                <div className={styles.sumLine}>
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className={styles.sumTotal}>
                  <span>Total</span>
                  <span>${order}.00 USD</span>
                </div>

                {pay === 'chance' ? (
                  <button className={`${styles.pay} ${styles.payChance}`} onClick={() => setView('chance')}>
                    Continue with <span className={styles.script}>Chance</span> →
                  </button>
                ) : (
                  <button className={styles.pay} onClick={payCard}>
                    Pay ${order}.00
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {/* ============ CHANCE ============ */}
        {view === 'chance' && (
          <>
            <button className={styles.coBack} onClick={() => setView('checkout')}>
              ← Back to checkout
            </button>
            <div className={styles.chanceHead}>
              <span className={styles.chancePill}>
                ✦ <span className={styles.script}>Chance</span> by Hedge
              </span>
              <h2 className={styles.chanceTitle}>Win back your {product.name.split(' ').slice(-1)[0]}</h2>
              <p className={styles.chanceSub}>
                Pick a real market on Polymarket or Kalshi. If it hits, we put a slice of your ${order} order
                back in your pocket — on the house. Either way, your order ships.
              </p>
            </div>

            <div className={styles.mkts}>
              {MARKETS.map((m, i) => {
                const wb = Math.round(order * m.frac)
                return (
                  <button
                    key={i}
                    className={`${styles.mkt} ${picked === i ? styles.mktOn : ''}`}
                    onClick={() => setPicked(i)}
                  >
                    <div className={styles.mktTop}>
                      <VenueTag venue={m.venue} />
                      <span className={styles.mktChance}>{m.chance}% chance</span>
                    </div>
                    <div className={styles.mktQ}>{m.q}</div>
                    <div className={styles.mktBot}>
                      <span className={styles.mktYes}>Yes {m.chance}¢</span>
                      <span className={styles.mktWin}>
                        ${wb} back
                        <small>{wb >= order ? 'whole order' : `of $${order}`}</small>
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className={styles.chanceActions}>
              <button className={styles.ghost} onClick={() => setView('checkout')}>
                Pay ${order} as usual
              </button>
              <button
                className={`${styles.pay} ${styles.payChance}`}
                style={{ marginTop: 0, flex: 1 }}
                disabled={mkt == null}
                onClick={placeBet}
              >
                {mkt ? `Place to win back $${winBack}` : 'Pick a market to play'}
              </button>
            </div>
          </>
        )}

        {/* ============ RESULT ============ */}
        {view === 'result' && (
          <div className={styles.result}>
            {outcome === 'card' && (
              <>
                <div className={styles.resEmoji}>✅</div>
                <h2 className={styles.resTitle}>Order confirmed</h2>
                <p className={styles.resSub}>
                  Thanks, Alex! Your {product.name} is on the way. You paid ${order}.00 with{' '}
                  {METHOD_NAME[pay]}.
                </p>
                <div className={styles.foot}>
                  Next time, try <b>Chance</b> at checkout for a shot at winning it back.
                </div>
                <button className={styles.pay} onClick={reset}>
                  Back to store
                </button>
              </>
            )}

            {outcome !== 'card' && resolving && (
              <div className={styles.resolving}>
                <div className={styles.spinner} />
                <h2 className={styles.resTitle}>Resolving on {mkt?.venue === 'kalshi' ? 'Kalshi' : 'Polymarket'}…</h2>
                <p className={styles.resSub}>“{mkt?.q}”</p>
                <div className={styles.resVenue}>
                  <VenueTag venue={mkt?.venue ?? 'polymarket'} />
                </div>
              </div>
            )}

            {outcome === 'win' && (
              <>
                <div className={styles.resEmoji}>🎉</div>
                <h2 className={`${styles.resTitle} ${styles.resTitleWin}`}>You won ${winBack} back!</h2>
                <p className={styles.resSub}>
                  “{mkt?.q}” resolved <b>Yes</b>. We credited ${winBack} toward your order.
                </p>
                <div className={styles.resVenue}>
                  Settled on <VenueTag venue={mkt?.venue ?? 'polymarket'} />
                </div>
                <div className={styles.resBreak}>
                  <div>
                    <span>{product.name}</span>
                    <span>${order}.00</span>
                  </div>
                  <div>
                    <span>Chance win-back</span>
                    <span className={styles.sumWin}>−${winBack}.00</span>
                  </div>
                  <div className={`${styles.resFinal} ${styles.resFinalWin}`}>
                    <span>You paid</span>
                    <span>${finalPrice}.00</span>
                  </div>
                </div>
                <button className={`${styles.pay} ${styles.payChance}`} onClick={reset}>
                  Done — back to store
                </button>
              </>
            )}

            {outcome === 'lose' && (
              <>
                <div className={styles.resEmoji}>🪙</div>
                <h2 className={styles.resTitle}>So close!</h2>
                <p className={styles.resSub}>
                  “{mkt?.q}” resolved <b>No</b> this time — but your {product.name} still ships, and you paid ${order}.00.
                  No harm in the swing.
                </p>
                <div className={styles.resVenue}>
                  Settled on <VenueTag venue={mkt?.venue ?? 'polymarket'} />
                </div>
                <button className={styles.pay} onClick={reset}>
                  Back to store
                </button>
              </>
            )}

            <div className={styles.foot}>
              Powered by <b>Hedge</b> · markets via Polymarket &amp; Kalshi ·{' '}
              <a href="/">hedge</a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
