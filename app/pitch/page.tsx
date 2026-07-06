'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

/* ----------------------------------------------------------------
   Hedge Payments — partner pitch deck
   Cream-on-ink, Fraunces display, one signature moment: the coin.
----------------------------------------------------------------- */

const INK = '#171D1B'
const CREAM = '#FBF3DB'
const GREEN = '#4CAF50'
const GREEN_DEEP = '#2E7D32'
const MUTED = 'rgba(251, 243, 219, 0.68)'
const FAINT = 'rgba(251, 243, 219, 0.2)'

const SLIDE_COUNT = 7

/* ------------------------- shared bits ------------------------- */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="font-mono text-xs md:text-sm tracking-[0.3em] uppercase mb-6"
      style={{ color: GREEN }}
    >
      {children}
    </div>
  )
}

function Headline({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.05] mb-8"
      style={{ color: CREAM, fontWeight: 500 }}
    >
      {children}
    </h2>
  )
}

/* --------------------------- the coin --------------------------- */

function FlipCoin() {
  const [spins, setSpins] = useState(0)
  const [flipping, setFlipping] = useState(false)
  const [landed, setLanded] = useState(false)

  const flip = () => {
    if (flipping) return
    setFlipping(true)
    setLanded(false)
    setSpins(s => s + 5) // odd number of half-turns → always lands on FREE
    setTimeout(() => {
      setFlipping(false)
      setLanded(true)
    }, 1300)
  }

  return (
    <div className="flex flex-col items-center gap-5 select-none">
      <div className="relative" style={{ perspective: '900px' }}>
        {/* glow lives on a sibling — a filter on the coin itself would flatten preserve-3d */}
        <div
          aria-hidden
          className="absolute -inset-8 rounded-full transition-opacity duration-500"
          style={{
            background: 'radial-gradient(circle, rgba(76,175,80,0.4), transparent 70%)',
            opacity: landed ? 1 : 0,
          }}
        />
        <button
          onClick={flip}
          aria-label="Flip the coin"
          className="relative block h-36 w-36 md:h-44 md:w-44 rounded-full focus:outline-none focus-visible:ring-2"
          style={{
            transformStyle: 'preserve-3d',
            transition: 'transform 1.25s cubic-bezier(0.2, 0.7, 0.25, 1)',
            transform: `rotateY(${spins * 180}deg)`,
          }}
        >
          {/* front — HEDGE */}
          <span
            className="absolute inset-0 flex items-center justify-center rounded-full font-serif text-xl md:text-2xl"
            style={{
              backfaceVisibility: 'hidden',
              background: `radial-gradient(circle at 35% 30%, #f6e9c5, ${CREAM} 45%, #d8cba2)`,
              color: INK,
              border: '3px solid rgba(11,13,16,0.25)',
              boxShadow: 'inset 0 -6px 14px rgba(0,0,0,0.18)',
            }}
          >
            HEDGE
          </span>
          {/* back — FREE */}
          <span
            className="absolute inset-0 flex items-center justify-center rounded-full font-serif text-2xl md:text-3xl tracking-wide"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              background: `radial-gradient(circle at 35% 30%, #66bb6a, ${GREEN} 45%, ${GREEN_DEEP})`,
              color: CREAM,
              border: '3px solid rgba(251,243,219,0.3)',
              boxShadow: 'inset 0 -6px 14px rgba(0,0,0,0.3)',
            }}
          >
            FREE
          </span>
        </button>
      </div>
      <div className="font-mono text-xs tracking-[0.2em] uppercase" style={{ color: landed ? GREEN : MUTED }}>
        {landed ? 'Order: free. Customer: hooked.' : flipping ? 'Flipping…' : '↑ Click the coin'}
      </div>
    </div>
  )
}

/* --------------------------- slides ----------------------------- */

function SlideTitle() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center px-6">
      <Image
        src="/images/HedgeLogo3D.png"
        alt="Hedge Payments"
        width={140}
        height={140}
        className="mb-10"
        priority
      />
      <h1
        className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.02] max-w-5xl"
        style={{ color: CREAM, fontWeight: 500 }}
      >
        Payments people{' '}
        <em style={{ color: GREEN, fontStyle: 'italic' }}>actually enjoy.</em>
      </h1>
      <p className="mt-8 max-w-xl text-base md:text-lg leading-relaxed" style={{ color: MUTED }}>
        Hedge is a white-label payment gateway with native payment experiences
        built in — under your brand, inside your product.
      </p>
      <div className="mt-14 font-mono text-xs tracking-[0.25em] uppercase" style={{ color: MUTED }}>
        hedgepayments.com
      </div>
    </div>
  )
}

function SlideProblem() {
  const points = [
    {
      k: 'Friction',
      body: 'The most important moment in your product — the payment — is outsourced to the most generic form on the internet.',
    },
    {
      k: 'Forgettable',
      body: 'Every checkout looks the same. Nobody has ever told a friend about a payment form.',
    },
    {
      k: 'Someone else’s brand',
      body: 'Your customer’s money moment happens on a processor’s terms, with a processor’s logo, at a processor’s pace.',
    },
  ]
  return (
    <div className="flex h-full flex-col justify-center px-8 md:px-24 max-w-6xl mx-auto w-full">
      <Eyebrow>The problem</Eyebrow>
      <Headline>Checkout is where you lose them.</Headline>
      <div className="grid gap-6 md:grid-cols-3 mt-2">
        {points.map(p => (
          <div key={p.k} className="border-t pt-5" style={{ borderColor: FAINT }}>
            <div className="font-mono text-xs tracking-[0.2em] uppercase mb-3" style={{ color: CREAM }}>
              {p.k}
            </div>
            <p className="text-sm md:text-base leading-relaxed" style={{ color: MUTED }}>
              {p.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function SlideWhat() {
  const pillars = [
    { k: 'Deposits', body: 'Cards, wallets and modern rails, tuned for your vertical.' },
    { k: 'Checkout', body: 'A drop-in component that lives in your UI, not a redirect.' },
    { k: 'Payouts', body: 'Withdrawals your users brag about — fast, visible, done.' },
    { k: 'Wallet', body: 'A branded balance your customers keep coming back to.' },
  ]
  return (
    <div className="flex h-full flex-col justify-center px-8 md:px-24 max-w-6xl mx-auto w-full">
      <Eyebrow>What Hedge is</Eyebrow>
      <Headline>
        One gateway.
        <br />
        Your brand on every screen.
      </Headline>
      <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4 mt-2" style={{ background: FAINT }}>
        {pillars.map(p => (
          <div key={p.k} className="p-6" style={{ background: INK }}>
            <div className="font-serif text-xl md:text-2xl mb-3" style={{ color: GREEN }}>
              {p.k}
            </div>
            <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
              {p.body}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm md:text-base" style={{ color: MUTED }}>
        One integration. White-label end to end — your customers never leave your world.
      </p>
    </div>
  )
}

function SlideExperiences() {
  const mechanics = [
    { k: 'Flip to free', body: 'Customers flip a coin at checkout for a shot at a free order. Chance turns paying into playing.' },
    { k: 'Win it back', body: 'Paid full price? One tap for a chance to win the purchase back — after the sale.' },
    { k: 'Round-ups', body: 'Spare change stacks toward a free order. Every payment builds toward the next win.' },
  ]
  return (
    <div className="flex h-full flex-col justify-center px-8 md:px-24 max-w-6xl mx-auto w-full">
      <div className="grid gap-12 md:grid-cols-[1.2fr_1fr] items-center">
        <div>
          <Eyebrow>The difference</Eyebrow>
          <Headline>Native experiences users love.</Headline>
          <div className="space-y-5">
            {mechanics.map(m => (
              <div key={m.k} className="flex gap-4 items-baseline">
                <div className="font-mono text-xs tracking-[0.15em] uppercase whitespace-nowrap w-28 shrink-0" style={{ color: CREAM }}>
                  {m.k}
                </div>
                <p className="text-sm md:text-base leading-relaxed" style={{ color: MUTED }}>
                  {m.body}
                </p>
              </div>
            ))}
          </div>
        </div>
        <FlipCoin />
      </div>
    </div>
  )
}

function SlideLive() {
  const demos = [
    {
      k: 'Chance drop-in',
      body: 'The embeddable checkout game, live on our site. One script tag.',
      href: '/chance',
    },
    {
      k: 'Storefront checkout',
      body: 'A full e-commerce checkout with Chance built into the payment step.',
      href: '/store',
    },
    {
      k: 'Sportsbook deposits',
      body: 'A DraftKings-style deposit flow, white-labeled end to end.',
      href: '/draftkings-demo',
    },
  ]
  return (
    <div className="flex h-full flex-col justify-center px-8 md:px-24 max-w-6xl mx-auto w-full">
      <Eyebrow>Proof</Eyebrow>
      <Headline>Don’t take the slide’s word for it.</Headline>
      <div className="grid gap-5 md:grid-cols-3 mt-2">
        {demos.map(d => (
          <a
            key={d.k}
            href={d.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group border p-6 transition-colors duration-200"
            style={{ borderColor: FAINT }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="font-serif text-xl md:text-2xl" style={{ color: CREAM }}>
                {d.k}
              </div>
              <span
                className="font-mono text-sm transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
                style={{ color: GREEN }}
              >
                ↗
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
              {d.body}
            </p>
            <div className="mt-5 font-mono text-xs tracking-[0.15em] uppercase" style={{ color: GREEN }}>
              Open live demo
            </div>
          </a>
        ))}
      </div>
      <p className="mt-8 font-mono text-xs tracking-[0.2em] uppercase" style={{ color: MUTED }}>
        Every card opens a working product — not a mockup
      </p>
    </div>
  )
}

function SlideWhy() {
  const wins = [
    {
      k: '01',
      title: 'Fun converts',
      body: 'A checkout customers want to reach changes the math on abandonment, repeat rate and word of mouth.',
    },
    {
      k: '02',
      title: 'Your brand, end to end',
      body: 'Deposits, payouts and wallets carry your name. Hedge stays invisible; the loyalty compounds to you.',
    },
    {
      k: '03',
      title: 'One drop-in',
      body: 'A script tag and a config — not a payments rebuild. Ship a native payment experience this quarter.',
    },
  ]
  return (
    <div className="flex h-full flex-col justify-center px-8 md:px-24 max-w-6xl mx-auto w-full">
      <Eyebrow>Why it wins</Eyebrow>
      <Headline>Payments as a product, not a tollbooth.</Headline>
      <div className="grid gap-8 md:grid-cols-3 mt-2">
        {wins.map(w => (
          <div key={w.k}>
            <div className="font-mono text-xs mb-4" style={{ color: GREEN }}>
              {w.k}
            </div>
            <div className="font-serif text-xl md:text-2xl mb-3" style={{ color: CREAM }}>
              {w.title}
            </div>
            <p className="text-sm md:text-base leading-relaxed" style={{ color: MUTED }}>
              {w.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function SlideClose() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center px-6">
      <Eyebrow>Next step</Eyebrow>
      <h2
        className="font-serif text-5xl md:text-7xl leading-[1.05] max-w-4xl"
        style={{ color: CREAM, fontWeight: 500 }}
      >
        Let’s build the checkout your users tell their friends about.
      </h2>
      <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
        <a
          href="mailto:jackson@hedgepayments.com"
          className="px-8 py-4 font-mono text-sm tracking-[0.15em] uppercase transition-opacity hover:opacity-85"
          style={{ background: GREEN, color: INK }}
        >
          jackson@hedgepayments.com
        </a>
        <a
          href="https://hedgepayments.com"
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-4 font-mono text-sm tracking-[0.15em] uppercase border transition-colors hover:border-current"
          style={{ borderColor: FAINT, color: CREAM }}
        >
          hedgepayments.com
        </a>
      </div>
    </div>
  )
}

const SLIDES = [
  SlideTitle,
  SlideProblem,
  SlideWhat,
  SlideExperiences,
  SlideLive,
  SlideWhy,
  SlideClose,
]

/* ---------------------------- deck ------------------------------ */

export default function PitchDeck() {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  const go = useCallback(
    (next: number) => {
      if (next < 0 || next >= SLIDE_COUNT) return
      setDirection(next > index ? 1 : -1)
      setIndex(next)
    },
    [index]
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') go(index + 1)
      if (e.key === 'ArrowLeft') go(index - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, index])

  const Slide = SLIDES[index]

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ background: INK, color: CREAM }}
    >
      {/* faint radial glow, top center */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 75% 50% at 50% -10%, rgba(76,175,80,0.16), transparent)',
        }}
      />

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          initial={{ opacity: 0, x: direction * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -40 }}
          transition={{ duration: 0.35, ease: [0.25, 0.8, 0.3, 1] }}
          className="absolute inset-0 pb-20"
        >
          <Slide />
        </motion.div>
      </AnimatePresence>

      {/* chrome: counter, dots, arrows */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 md:px-12 py-5">
        <div className="font-mono text-xs tracking-[0.25em]" style={{ color: MUTED }}>
          {String(index + 1).padStart(2, '0')} / {String(SLIDE_COUNT).padStart(2, '0')}
        </div>

        <div className="flex gap-2.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === index ? 28 : 10,
                background: i === index ? GREEN : FAINT,
              }}
            />
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => go(index - 1)}
            disabled={index === 0}
            aria-label="Previous slide"
            className="h-10 w-10 border font-mono transition-opacity disabled:opacity-25 hover:opacity-80"
            style={{ borderColor: FAINT, color: CREAM }}
          >
            ←
          </button>
          <button
            onClick={() => go(index + 1)}
            disabled={index === SLIDE_COUNT - 1}
            aria-label="Next slide"
            className="h-10 w-10 border font-mono transition-opacity disabled:opacity-25 hover:opacity-80"
            style={{ borderColor: FAINT, color: CREAM }}
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}
