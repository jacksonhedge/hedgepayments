'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const slides = [
  {
    id: 'title',
    type: 'title',
  },
  {
    id: 'problem',
    type: 'problem',
  },
  {
    id: 'solution',
    type: 'solution',
  },
  {
    id: 'product',
    type: 'product',
  },
  {
    id: 'market',
    type: 'market',
  },
  {
    id: 'business-model',
    type: 'business-model',
  },
  {
    id: 'go-to-market',
    type: 'go-to-market',
  },
  {
    id: 'traction',
    type: 'traction',
  },
  {
    id: 'vision',
    type: 'vision',
  },
  {
    id: 'why-now',
    type: 'why-now',
  },
  {
    id: 'team',
    type: 'team',
  },
  {
    id: 'ask',
    type: 'ask',
  },
]

function EmailGate({ onAccess }: { onAccess: (email: string) => void }) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)

    // Store email in localStorage and optionally send to your backend
    try {
      // Save to localStorage
      localStorage.setItem('deck_access_email', email)
      localStorage.setItem('deck_access_time', new Date().toISOString())

      // Optional: Send to your API/database
      // await fetch('/api/deck-access', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, accessedAt: new Date().toISOString() })
      // })

      onAccess(email)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-6" style={{ fontFamily: 'Georgia, serif' }}>
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <Image
            src="/images/bankroll-logo.png"
            alt="Bankroll"
            width={120}
            height={120}
            className="w-24 h-24 mx-auto"
          />
        </div>

        <h1 className="text-4xl md:text-5xl text-[#2C2416] mb-4 tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
          Bankroll
        </h1>

        <p className="text-xl text-[#6B5D4F] mb-2" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
          Investor Deck
        </p>

        <div className="w-16 h-px bg-[#D4C5B0] mx-auto mb-8"></div>

        <p className="text-[#6B5D4F] mb-8" style={{ fontFamily: 'Georgia, serif' }}>
          Enter your email to view our seed round deck
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@firm.com"
              className="w-full px-4 py-3 border border-[#D4C5B0] bg-white/50 text-[#2C2416] placeholder-[#8B7E6E] focus:outline-none focus:border-[#2C2416] transition-colors"
              style={{ fontFamily: 'Georgia, serif' }}
              required
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm" style={{ fontFamily: 'Georgia, serif' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 text-[#FAF8F5] bg-[#2C2416] border border-[#2C2416] hover:bg-[#3D3024] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {isSubmitting ? 'Loading...' : 'View Deck'}
          </button>
        </form>

        <p className="text-xs text-[#8B7E6E] mt-6" style={{ fontFamily: 'Georgia, serif' }}>
          We'll only use your email to follow up about Bankroll
        </p>
      </div>
    </div>
  )
}

export default function DeckPage() {
  const [hasAccess, setHasAccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0)

  // Check if user already has access
  useEffect(() => {
    const savedEmail = localStorage.getItem('deck_access_email')
    if (savedEmail) {
      setHasAccess(true)
    }
    setIsLoading(false)
  }, [])

  const nextSlide = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setDirection(1)
      setCurrentSlide(prev => prev + 1)
    }
  }, [currentSlide])

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setDirection(-1)
      setCurrentSlide(prev => prev - 1)
    }
  }, [currentSlide])

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1)
    setCurrentSlide(index)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        nextSlide()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prevSlide()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextSlide, prevSlide])

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  }

  const renderSlide = () => {
    const slide = slides[currentSlide]

    switch (slide.type) {
      case 'title':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <div className="mb-10">
              <Image
                src="/images/bankroll-logo.png"
                alt="Bankroll"
                width={200}
                height={200}
                className="w-40 h-40 md:w-52 md:h-52"
              />
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl text-[#2C2416] mb-6 tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Bankroll
            </h1>
            <div className="w-16 h-px bg-[#D4C5B0] mb-6"></div>
            <p className="text-2xl md:text-3xl text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              Fraternity Finances Made Easy
            </p>
          </div>
        )

      case 'problem':
        return (
          <div className="flex flex-col justify-center h-full px-8 md:px-16 lg:px-24">
            <p className="text-sm text-[#8B7E6E] tracking-widest uppercase mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              The Problem
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-[#2C2416] mb-12 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Collecting dues is broken
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">😤</span>
                  <div>
                    <h3 className="text-xl text-[#2C2416] mb-2" style={{ fontFamily: 'Georgia, serif' }}>Treasurers drowning in spreadsheets</h3>
                    <p className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Chasing payments via Venmo, texts, and awkward conversations</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-3xl">💸</span>
                  <div>
                    <h3 className="text-xl text-[#2C2416] mb-2" style={{ fontFamily: 'Georgia, serif' }}>Members can't afford lump sums</h3>
                    <p className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>$500-2,000 dues hit all at once — tough for college students</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">📉</span>
                  <div>
                    <h3 className="text-xl text-[#2C2416] mb-2" style={{ fontFamily: 'Georgia, serif' }}>30-40% pay late</h3>
                    <p className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Chapters lose thousands and strain brotherhood</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-3xl">🏚️</span>
                  <div>
                    <h3 className="text-xl text-[#2C2416] mb-2" style={{ fontFamily: 'Georgia, serif' }}>Legacy tools are outdated</h3>
                    <p className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Built in 2005, clunky UX, no mobile, no flexibility</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'solution':
        return (
          <div className="flex flex-col justify-center h-full px-8 md:px-16 lg:px-24">
            <p className="text-sm text-[#8B7E6E] tracking-widest uppercase mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              The Solution
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-[#2C2416] mb-8 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Modern payments + BNPL<br />for Greek life
            </h2>
            <p className="text-xl text-[#6B5D4F] mb-12 max-w-2xl" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              Bankroll gives chapters a beautiful dashboard to manage dues, while members get flexible payment plans that fit their budget.
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl">
              <div className="bg-white/50 border border-[#D4C5B0] p-6">
                <div className="text-3xl mb-4">📱</div>
                <h3 className="text-lg text-[#2C2416] mb-2" style={{ fontFamily: 'Georgia, serif' }}>Mobile-first</h3>
                <p className="text-[#6B5D4F] text-sm" style={{ fontFamily: 'Georgia, serif' }}>Pay dues in 30 seconds from your phone</p>
              </div>
              <div className="bg-white/50 border border-[#D4C5B0] p-6">
                <div className="text-3xl mb-4">🏦</div>
                <h3 className="text-lg text-[#2C2416] mb-2" style={{ fontFamily: 'Georgia, serif' }}>Built-in BNPL</h3>
                <p className="text-[#6B5D4F] text-sm" style={{ fontFamily: 'Georgia, serif' }}>Split dues into 4-6 payments, chapter gets paid upfront</p>
              </div>
              <div className="bg-white/50 border border-[#D4C5B0] p-6">
                <div className="text-3xl mb-4">📊</div>
                <h3 className="text-lg text-[#2C2416] mb-2" style={{ fontFamily: 'Georgia, serif' }}>Real-time dashboard</h3>
                <p className="text-[#6B5D4F] text-sm" style={{ fontFamily: 'Georgia, serif' }}>Treasurers see who paid instantly — no more guessing</p>
              </div>
            </div>
          </div>
        )

      case 'product':
        return (
          <div className="flex flex-col justify-center h-full px-8 md:px-16 lg:px-24">
            <p className="text-sm text-[#8B7E6E] tracking-widest uppercase mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              The Product
            </p>
            <h2 className="text-4xl md:text-5xl text-[#2C2416] mb-12 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Simple for members.<br />Powerful for treasurers.
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl text-[#2C2416] mb-2" style={{ fontFamily: 'Georgia, serif' }}>For Members</h3>
                  <ul className="space-y-2 text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
                    <li>• See all dues and deadlines in one place</li>
                    <li>• Pay instantly or split into installments</li>
                    <li>• Automatic reminders before due dates</li>
                    <li>• Payment history and receipts</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl text-[#2C2416] mb-2" style={{ fontFamily: 'Georgia, serif' }}>For Treasurers</h3>
                  <ul className="space-y-2 text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
                    <li>• One dashboard for all chapter finances</li>
                    <li>• Create custom dues, events, and fees</li>
                    <li>• Export reports for nationals</li>
                    <li>• Get paid upfront even with BNPL</li>
                  </ul>
                </div>
              </div>
              <div className="bg-[#2C2416] rounded-2xl p-8 flex items-center justify-center min-h-[400px]">
                <p className="text-[#D4C5B0] text-center" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                  [Product screenshots / demo]
                </p>
              </div>
            </div>
          </div>
        )

      case 'market':
        return (
          <div className="flex flex-col justify-center h-full px-8 md:px-16 lg:px-24">
            <p className="text-sm text-[#8B7E6E] tracking-widest uppercase mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Market Opportunity
            </p>
            <h2 className="text-4xl md:text-5xl text-[#2C2416] mb-10 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Bottoms-up: $750M in annual dues
            </h2>
            <div className="grid md:grid-cols-2 gap-12 max-w-5xl">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#D4C5B0] pb-4">
                  <span className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Active undergrad members</span>
                  <span className="text-2xl text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>750K</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#D4C5B0] pb-4">
                  <span className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Chapters nationwide</span>
                  <span className="text-2xl text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>12,000</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#D4C5B0] pb-4">
                  <span className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Social dues per semester</span>
                  <span className="text-2xl text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>$500</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#D4C5B0] pb-4">
                  <span className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Annual dues per member</span>
                  <span className="text-2xl text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>$1,000</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xl text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Total Addressable Market</span>
                  <span className="text-3xl text-[#2C2416] font-semibold" style={{ fontFamily: 'Georgia, serif' }}>$750M</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-5 bg-[#2C2416] text-[#FAF8F5]">
                  <p className="text-sm text-[#D4C5B0] mb-1">TAM · Total dues payments</p>
                  <p className="text-3xl" style={{ fontFamily: 'Georgia, serif' }}>$750M</p>
                </div>
                <div className="p-5 bg-white/50 border border-[#D4C5B0]">
                  <p className="text-sm text-[#8B7E6E] mb-1">SAM · Chapters we can reach</p>
                  <p className="text-3xl text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>$225M</p>
                  <p className="text-xs text-[#6B5D4F] mt-1">30% of market (large/mid-size chapters)</p>
                </div>
                <div className="p-5 bg-white/50 border border-[#D4C5B0]">
                  <p className="text-sm text-[#8B7E6E] mb-1">SOM · Year 3 target</p>
                  <p className="text-3xl text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>$50M</p>
                  <p className="text-xs text-[#6B5D4F] mt-1">500 chapters × 100 members × $1K</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'business-model':
        return (
          <div className="flex flex-col justify-center h-full px-8 md:px-16 lg:px-24">
            <p className="text-sm text-[#8B7E6E] tracking-widest uppercase mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Business Model
            </p>
            <h2 className="text-4xl md:text-5xl text-[#2C2416] mb-12 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Revenue from every transaction
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
              <div className="bg-white/50 border border-[#D4C5B0] p-8">
                <h3 className="text-2xl text-[#2C2416] mb-4" style={{ fontFamily: 'Georgia, serif' }}>Payment Processing</h3>
                <p className="text-4xl text-[#2C2416] mb-2" style={{ fontFamily: 'Georgia, serif' }}>2.9% + $0.30</p>
                <p className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Per transaction — competitive with Stripe/Square</p>
              </div>
              <div className="bg-[#2C2416] p-8">
                <h3 className="text-2xl text-[#FAF8F5] mb-4" style={{ fontFamily: 'Georgia, serif' }}>BNPL Financing</h3>
                <p className="text-4xl text-[#FAF8F5] mb-2" style={{ fontFamily: 'Georgia, serif' }}>5-8%</p>
                <p className="text-[#D4C5B0]" style={{ fontFamily: 'Georgia, serif' }}>Fee on financed dues — members pay over time, chapter gets paid now</p>
              </div>
            </div>
            <div className="mt-8 max-w-4xl">
              <p className="text-lg text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                High BNPL adoption expected — 40%+ of members struggle with lump sum payments.
                Our proprietary BNPL gives us better margins and full control over the experience.
              </p>
            </div>
          </div>
        )

      case 'go-to-market':
        return (
          <div className="flex flex-col justify-center h-full px-8 md:px-16 lg:px-24">
            <p className="text-sm text-[#8B7E6E] tracking-widest uppercase mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Go-to-Market
            </p>
            <h2 className="text-4xl md:text-5xl text-[#2C2416] mb-8 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              FraternityBase is our unfair advantage
            </h2>
            <p className="text-xl text-[#6B5D4F] mb-10 max-w-2xl" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              We built Crunchbase for fraternities — now we're monetizing it with payments
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mb-10">
              <div className="p-6 bg-[#2C2416] text-[#FAF8F5]">
                <p className="text-xs tracking-widest uppercase mb-4 text-[#D4C5B0]">Phase 1</p>
                <h3 className="text-xl mb-3" style={{ fontFamily: 'Georgia, serif' }}>FraternityBase</h3>
                <p className="text-sm text-[#D4C5B0]" style={{ fontFamily: 'Georgia, serif' }}>Database of every chapter, treasurer contact, dues structure, and payment provider</p>
                <p className="text-lg mt-4 text-[#D4C5B0]" style={{ fontFamily: 'Georgia, serif' }}>Built ✓</p>
              </div>
              <div className="p-6 bg-white/50 border border-[#D4C5B0]">
                <p className="text-xs tracking-widest uppercase mb-4 text-[#8B7E6E]">Phase 2</p>
                <h3 className="text-xl text-[#2C2416] mb-3" style={{ fontFamily: 'Georgia, serif' }}>Direct Outreach</h3>
                <p className="text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Target chapters with high dues + outdated payment tools. Warm intros through Greek network</p>
                <p className="text-lg text-[#2C2416] mt-4" style={{ fontFamily: 'Georgia, serif' }}>Now</p>
              </div>
              <div className="p-6 bg-white/50 border border-[#D4C5B0]">
                <p className="text-xs tracking-widest uppercase mb-4 text-[#8B7E6E]">Phase 3</p>
                <h3 className="text-xl text-[#2C2416] mb-3" style={{ fontFamily: 'Georgia, serif' }}>National Partnerships</h3>
                <p className="text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Partner with fraternity nationals for top-down rollout across all chapters</p>
                <p className="text-lg text-[#2C2416] mt-4" style={{ fontFamily: 'Georgia, serif' }}>2026</p>
              </div>
            </div>
            <div className="flex items-center gap-8 max-w-3xl">
              <div className="text-center">
                <p className="text-4xl text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>12K+</p>
                <p className="text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Chapters mapped</p>
              </div>
              <div className="h-12 w-px bg-[#D4C5B0]"></div>
              <div className="text-center">
                <p className="text-4xl text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>5K+</p>
                <p className="text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Treasurer contacts</p>
              </div>
              <div className="h-12 w-px bg-[#D4C5B0]"></div>
              <div className="text-center">
                <p className="text-4xl text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>$0</p>
                <p className="text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>CAC with owned data</p>
              </div>
            </div>
          </div>
        )

      case 'traction':
        return (
          <div className="flex flex-col justify-center h-full px-8 md:px-16 lg:px-24">
            <p className="text-sm text-[#8B7E6E] tracking-widest uppercase mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Traction
            </p>
            <h2 className="text-4xl md:text-5xl text-[#2C2416] mb-12 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Early momentum
            </h2>
            <div className="grid md:grid-cols-2 gap-12 max-w-4xl">
              <div>
                <p className="text-7xl md:text-8xl text-[#2C2416] mb-4" style={{ fontFamily: 'Georgia, serif' }}>50</p>
                <p className="text-xl text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Chapters on waitlist</p>
                <div className="w-16 h-px bg-[#D4C5B0] my-6"></div>
                <p className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
                  Strong inbound interest from fraternities frustrated with current solutions
                </p>
              </div>
              <div className="space-y-6">
                <div className="p-6 bg-white/50 border border-[#D4C5B0]">
                  <p className="text-[#2C2416] mb-2" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                    "Our treasurer spends 10+ hours a month chasing payments. We need this."
                  </p>
                  <p className="text-sm text-[#8B7E6E]">— Chapter President, SEC school</p>
                </div>
                <div className="p-6 bg-white/50 border border-[#D4C5B0]">
                  <p className="text-[#2C2416] mb-2" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                    "Payment plans would be a game changer. Half our guys can't pay $800 at once."
                  </p>
                  <p className="text-sm text-[#8B7E6E]">— Treasurer, Big Ten chapter</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'vision':
        return (
          <div className="flex flex-col justify-center h-full px-8 md:px-16 lg:px-24">
            <p className="text-sm text-[#8B7E6E] tracking-widest uppercase mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              The Vision
            </p>
            <h2 className="text-4xl md:text-5xl text-[#2C2416] mb-8 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Greek life is just the start
            </h2>
            <p className="text-xl text-[#6B5D4F] mb-12 max-w-2xl" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              We're building BNPL infrastructure for all peer-to-peer payments
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl">
              <div className="p-6 bg-[#2C2416] text-[#FAF8F5]">
                <p className="text-xs tracking-widest uppercase mb-4 text-[#D4C5B0]">Now</p>
                <h3 className="text-xl mb-3" style={{ fontFamily: 'Georgia, serif' }}>Greek Life</h3>
                <p className="text-sm text-[#D4C5B0]" style={{ fontFamily: 'Georgia, serif' }}>Fraternities & sororities — dues, events, housing</p>
                <p className="text-2xl mt-4" style={{ fontFamily: 'Georgia, serif' }}>$3B+</p>
              </div>
              <div className="p-6 bg-white/50 border border-[#D4C5B0]">
                <p className="text-xs tracking-widest uppercase mb-4 text-[#8B7E6E]">Next</p>
                <h3 className="text-xl text-[#2C2416] mb-3" style={{ fontFamily: 'Georgia, serif' }}>Student Organizations</h3>
                <p className="text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Clubs, club sports, student government, honor societies</p>
                <p className="text-2xl text-[#2C2416] mt-4" style={{ fontFamily: 'Georgia, serif' }}>$10B+</p>
              </div>
              <div className="p-6 bg-white/50 border border-[#D4C5B0]">
                <p className="text-xs tracking-widest uppercase mb-4 text-[#8B7E6E]">Future</p>
                <h3 className="text-xl text-[#2C2416] mb-3" style={{ fontFamily: 'Georgia, serif' }}>All P2P Payments</h3>
                <p className="text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Rent splits, group trips, shared expenses — BNPL for any group payment</p>
                <p className="text-2xl text-[#2C2416] mt-4" style={{ fontFamily: 'Georgia, serif' }}>$500B+</p>
              </div>
            </div>
            <p className="text-[#6B5D4F] mt-8 max-w-2xl" style={{ fontFamily: 'Georgia, serif' }}>
              Venmo and Cash App move money. We make it affordable.
            </p>
          </div>
        )

      case 'why-now':
        return (
          <div className="flex flex-col justify-center h-full px-8 md:px-16 lg:px-24">
            <p className="text-sm text-[#8B7E6E] tracking-widest uppercase mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Why Now
            </p>
            <h2 className="text-4xl md:text-5xl text-[#2C2416] mb-12 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              The perfect storm
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#2C2416] text-[#FAF8F5] flex items-center justify-center flex-shrink-0" style={{ fontFamily: 'Georgia, serif' }}>1</div>
                  <div>
                    <h3 className="text-xl text-[#2C2416] mb-2" style={{ fontFamily: 'Georgia, serif' }}>BNPL is normalized</h3>
                    <p className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Gen Z expects flexible payment options everywhere — except their dues</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#2C2416] text-[#FAF8F5] flex items-center justify-center flex-shrink-0" style={{ fontFamily: 'Georgia, serif' }}>2</div>
                  <div>
                    <h3 className="text-xl text-[#2C2416] mb-2" style={{ fontFamily: 'Georgia, serif' }}>Incumbents are stagnant</h3>
                    <p className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>OmegaFi, GreekBill built 15+ years ago — no innovation, poor mobile UX</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#2C2416] text-[#FAF8F5] flex items-center justify-center flex-shrink-0" style={{ fontFamily: 'Georgia, serif' }}>3</div>
                  <div>
                    <h3 className="text-xl text-[#2C2416] mb-2" style={{ fontFamily: 'Georgia, serif' }}>Chapter autonomy increasing</h3>
                    <p className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>More chapters choosing their own tools vs. national mandates</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#2C2416] text-[#FAF8F5] flex items-center justify-center flex-shrink-0" style={{ fontFamily: 'Georgia, serif' }}>4</div>
                  <div>
                    <h3 className="text-xl text-[#2C2416] mb-2" style={{ fontFamily: 'Georgia, serif' }}>Rising costs</h3>
                    <p className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Dues up 30%+ over 5 years — affordability is a real problem</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'team':
        return (
          <div className="flex flex-col justify-center h-full px-8 md:px-16 lg:px-24">
            <p className="text-sm text-[#8B7E6E] tracking-widest uppercase mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Team
            </p>
            <h2 className="text-4xl md:text-5xl text-[#2C2416] mb-12 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Built by someone who lived it
            </h2>
            <div className="max-w-3xl">
              <div className="flex items-start gap-8 mb-10">
                <div className="w-28 h-28 rounded-full bg-[#D4C5B0] flex-shrink-0"></div>
                <div>
                  <h3 className="text-3xl text-[#2C2416] mb-1" style={{ fontFamily: 'Georgia, serif' }}>Jackson Fitzgerald</h3>
                  <p className="text-lg text-[#6B5D4F] mb-6" style={{ fontFamily: 'Georgia, serif' }}>Founder & CEO</p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#2C2416]"></div>
                      <p className="text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>
                        <span className="font-semibold">Hedge Payments</span> — AI-native payment infrastructure
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#2C2416]"></div>
                      <p className="text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>
                        <span className="font-semibold">FraternityBase</span> — Crunchbase for fraternities
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#2C2416]"></div>
                      <p className="text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>
                        Former fraternity member — experienced the dues problem firsthand
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-white/50 border border-[#D4C5B0]">
                <p className="text-[#2C2416]" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                  "I watched our chapter lose thousands every semester to late payments. Guys wanted to pay — they just couldn't afford it all at once. I'm building the solution I wish we had."
                </p>
              </div>
            </div>
          </div>
        )

      case 'ask':
        return (
          <div className="flex flex-col justify-center h-full px-8 md:px-16 lg:px-24 text-center">
            <p className="text-sm text-[#8B7E6E] tracking-widest uppercase mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              The Ask
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl text-[#2C2416] mb-8 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Raising $2-3M Seed
            </h2>
            <p className="text-xl text-[#6B5D4F] mb-12 max-w-2xl mx-auto" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              To scale from 50 chapters to 500, process $100M+ in payments, and build the BNPL infrastructure
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
              <div className="p-6 bg-white/50 border border-[#D4C5B0]">
                <p className="text-2xl text-[#2C2416] mb-2" style={{ fontFamily: 'Georgia, serif' }}>40%</p>
                <p className="text-[#6B5D4F] text-sm" style={{ fontFamily: 'Georgia, serif' }}>Engineering & Product</p>
              </div>
              <div className="p-6 bg-white/50 border border-[#D4C5B0]">
                <p className="text-2xl text-[#2C2416] mb-2" style={{ fontFamily: 'Georgia, serif' }}>35%</p>
                <p className="text-[#6B5D4F] text-sm" style={{ fontFamily: 'Georgia, serif' }}>BNPL Capital & Licensing</p>
              </div>
              <div className="p-6 bg-white/50 border border-[#D4C5B0]">
                <p className="text-2xl text-[#2C2416] mb-2" style={{ fontFamily: 'Georgia, serif' }}>25%</p>
                <p className="text-[#6B5D4F] text-sm" style={{ fontFamily: 'Georgia, serif' }}>Sales & Growth</p>
              </div>
            </div>
            <div className="w-16 h-px bg-[#D4C5B0] mx-auto mb-8"></div>
            <div className="space-y-4">
              <p className="text-xl text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>
                jackson@bankroll.com
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-10 py-4 text-base tracking-wide text-[#FAF8F5] bg-[#2C2416] border border-[#2C2416] hover:bg-[#3D3024] transition-all"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Let's Talk
              </Link>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#D4C5B0] border-t-[#2C2416] rounded-full animate-spin"></div>
      </div>
    )
  }

  // Show email gate if no access
  if (!hasAccess) {
    return <EmailGate onAccess={() => setHasAccess(true)} />
  }

  return (
    <div className="h-screen bg-[#FAF8F5] overflow-hidden" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Slide Content */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 500, damping: 35 },
            opacity: { duration: 0.15 },
          }}
          className="h-full"
        >
          {renderSlide()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-10">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="w-10 h-10 rounded-full border border-[#D4C5B0] flex items-center justify-center text-[#2C2416] hover:bg-[#2C2416] hover:text-[#FAF8F5] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ←
        </button>

        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide ? 'bg-[#2C2416] w-6' : 'bg-[#D4C5B0] hover:bg-[#8B7E6E]'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="w-10 h-10 rounded-full border border-[#D4C5B0] flex items-center justify-center text-[#2C2416] hover:bg-[#2C2416] hover:text-[#FAF8F5] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          →
        </button>
      </div>

      {/* Slide Counter */}
      <div className="fixed top-8 right-8 text-sm text-[#8B7E6E] z-10" style={{ fontFamily: 'Georgia, serif' }}>
        {currentSlide + 1} / {slides.length}
      </div>

      {/* Keyboard hint */}
      <div className="fixed bottom-8 right-8 text-xs text-[#8B7E6E] hidden md:block" style={{ fontFamily: 'Georgia, serif' }}>
        Use ← → or Space to navigate
      </div>

      {/* Back to home */}
      <Link
        href="/"
        className="fixed top-8 left-8 text-sm text-[#8B7E6E] hover:text-[#2C2416] transition-colors z-10"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        ← Back
      </Link>
    </div>
  )
}
