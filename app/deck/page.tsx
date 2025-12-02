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
    id: 'usage-analysis',
    type: 'usage-analysis',
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

    // Store email in localStorage and send to backend
    try {
      // Save to localStorage
      localStorage.setItem('deck_access_email', email)
      localStorage.setItem('deck_access_time', new Date().toISOString())

      // Send to API to trigger confirmation email
      await fetch('/api/deck-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      onAccess(email)
    } catch (err) {
      // Still grant access even if email fails
      onAccess(email)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-6" style={{ fontFamily: 'Georgia, serif' }}>
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <Image
            src="/images/bankroll-icon-new.png"
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
                src="/images/bankroll-icon-new.png"
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
              Peer-to-Peer payments built for Gen Z
            </p>
          </div>
        )

      case 'problem':
        return (
          <div className="flex flex-col justify-start sm:justify-center h-full px-4 sm:px-8 md:px-16 lg:px-24 pt-20 pb-16 sm:py-8 overflow-y-auto">
            <p className="text-xs sm:text-sm text-[#8B7E6E] tracking-widest uppercase mb-4 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              The Opportunity
            </p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-[#2C2416] mb-6 sm:mb-12 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Gen Z wants flexible funding<br className="hidden sm:block" /><span className="sm:hidden"> </span>for everyday purchases
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 max-w-5xl">
              <div className="flex items-start gap-3 sm:gap-4">
                <span className="text-2xl sm:text-3xl">⚡</span>
                <div>
                  <h3 className="text-base sm:text-xl text-[#2C2416] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>Instant gratification generation</h3>
                  <p className="text-sm sm:text-base text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Users hate waiting to get paid</p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:gap-4">
                <span className="text-2xl sm:text-3xl">💳</span>
                <div>
                  <h3 className="text-base sm:text-xl text-[#2C2416] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>Credit-averse but cash-strapped</h3>
                  <p className="text-sm sm:text-base text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>70% avoid traditional credit — need alternatives for larger purchases</p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:gap-4">
                <span className="text-2xl sm:text-3xl">🎯</span>
                <div>
                  <h3 className="text-base sm:text-xl text-[#2C2416] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>Group payments are taking over</h3>
                  <p className="text-sm sm:text-base text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Splitting costs for trips, events, dues — no BNPL solution exists</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'usage-analysis':
        return (
          <div className="flex flex-col justify-start sm:justify-center h-full px-4 sm:px-8 md:px-16 lg:px-24 pt-20 pb-16 sm:py-8 overflow-y-auto">
            <p className="text-xs sm:text-sm text-[#8B7E6E] tracking-widest uppercase mb-4 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Usage Analysis
            </p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl text-[#2C2416] mb-6 sm:mb-10 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Where Gen Z spends — and where they need BNPL
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12 max-w-5xl">
              {/* P2P Payment Volume Chart */}
              <div>
                <h3 className="text-xl text-[#2C2416] mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                  Annual P2P Payment Volume per User
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Rent & Housing Splits</span>
                      <span className="text-sm text-[#2C2416] font-semibold" style={{ fontFamily: 'Georgia, serif' }}>$4,800</span>
                    </div>
                    <div className="h-8 bg-[#E8E2D9] overflow-hidden">
                      <div className="h-full bg-[#2C2416]" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Group Trips & Events</span>
                      <span className="text-sm text-[#2C2416] font-semibold" style={{ fontFamily: 'Georgia, serif' }}>$1,800</span>
                    </div>
                    <div className="h-8 bg-[#E8E2D9] overflow-hidden">
                      <div className="h-full bg-[#6B5D4F]" style={{ width: '38%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Sports Pools & Betting</span>
                      <span className="text-sm text-[#2C2416] font-semibold" style={{ fontFamily: 'Georgia, serif' }}>$600</span>
                    </div>
                    <div className="h-8 bg-[#E8E2D9] overflow-hidden">
                      <div className="h-full bg-[#8B7E6E]" style={{ width: '13%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Dinners & Nights Out</span>
                      <span className="text-sm text-[#2C2416] font-semibold" style={{ fontFamily: 'Georgia, serif' }}>$1,200</span>
                    </div>
                    <div className="h-8 bg-[#E8E2D9] overflow-hidden">
                      <div className="h-full bg-[#D4C5B0]" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-[#8B7E6E] mt-4" style={{ fontFamily: 'Georgia, serif' }}>
                  Total: ~$8,400/year in P2P payments per college student
                </p>
              </div>

              {/* BNPL Adoption by Type */}
              <div>
                <h3 className="text-xl text-[#2C2416] mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                  BNPL Demand by Payment Type
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-[#2C2416]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[#FAF8F5]" style={{ fontFamily: 'Georgia, serif' }}>Rent & Housing</span>
                      <span className="text-xl text-[#FAF8F5] font-semibold" style={{ fontFamily: 'Georgia, serif' }}>70%</span>
                    </div>
                    <div className="h-3 bg-[#4A3D2F] rounded-full overflow-hidden">
                      <div className="h-full bg-[#D4C5B0] rounded-full" style={{ width: '70%' }}></div>
                    </div>
                    <p className="text-xs text-[#D4C5B0] mt-1">Would use BNPL for rent splits</p>
                  </div>
                  <div className="p-4 bg-white/50 border border-[#D4C5B0]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Group Trips</span>
                      <span className="text-xl text-[#2C2416] font-semibold" style={{ fontFamily: 'Georgia, serif' }}>55%</span>
                    </div>
                    <div className="h-3 bg-[#E8E2D9] rounded-full overflow-hidden">
                      <div className="h-full bg-[#2C2416] rounded-full" style={{ width: '55%' }}></div>
                    </div>
                    <p className="text-xs text-[#8B7E6E] mt-1">Spring break, concerts, road trips</p>
                  </div>
                  <div className="p-4 bg-white/50 border border-[#D4C5B0]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Pools & Group Bets</span>
                      <span className="text-xl text-[#2C2416] font-semibold" style={{ fontFamily: 'Georgia, serif' }}>45%</span>
                    </div>
                    <div className="h-3 bg-[#E8E2D9] rounded-full overflow-hidden">
                      <div className="h-full bg-[#6B5D4F] rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <p className="text-xs text-[#8B7E6E] mt-1">March Madness, fantasy, prop bets</p>
                  </div>
                  <div className="p-4 bg-white/50 border border-[#D4C5B0]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Small Splits</span>
                      <span className="text-xl text-[#2C2416] font-semibold" style={{ fontFamily: 'Georgia, serif' }}>15%</span>
                    </div>
                    <div className="h-3 bg-[#E8E2D9] rounded-full overflow-hidden">
                      <div className="h-full bg-[#8B7E6E] rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <p className="text-xs text-[#8B7E6E] mt-1">Under $50 — instant pay preferred</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 p-4 bg-[#2C2416] max-w-md">
              <p className="text-[#D4C5B0] text-sm" style={{ fontFamily: 'Georgia, serif' }}>
                <span className="text-[#FAF8F5] font-semibold">Key Insight:</span> High-value payments ($200+) have 45-70% BNPL demand — our sweet spot.
              </p>
            </div>
          </div>
        )

      case 'solution':
        return (
          <div className="flex flex-col justify-start sm:justify-center h-full px-4 sm:px-8 md:px-16 lg:px-24 pt-20 pb-16 sm:py-8 overflow-y-auto">
            <p className="text-xs sm:text-sm text-[#8B7E6E] tracking-widest uppercase mb-4 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              The Solution
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#2C2416] mb-2 sm:mb-4 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              CoverPay™
            </h2>
            <p className="text-sm sm:text-lg text-[#8B7E6E] mb-4 sm:mb-8" style={{ fontFamily: 'Georgia, serif' }}>by Hedge Payments</p>
            <p className="text-base sm:text-xl text-[#6B5D4F] mb-6 sm:mb-12 max-w-2xl" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              Send Now, Pay Later — BNPL for P2P payments. Pay back friends on your terms.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl">
              <div className="bg-[#2C2416] p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl mb-2 sm:mb-4">🤝</div>
                <h3 className="text-base sm:text-lg text-[#FAF8F5] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>Pay friends back — flexibly</h3>
                <p className="text-[#D4C5B0] text-xs sm:text-sm" style={{ fontFamily: 'Georgia, serif' }}>Owe someone $200? Pay them now, pay us back over 4-6 weeks</p>
              </div>
              <div className="bg-white/50 border border-[#D4C5B0] p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl mb-2 sm:mb-4">🏀</div>
                <h3 className="text-base sm:text-lg text-[#2C2416] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>Sports pools & group bets</h3>
                <p className="text-[#6B5D4F] text-xs sm:text-sm" style={{ fontFamily: 'Georgia, serif' }}>March Madness bracket? Fantasy league? Pay your buy-in over time</p>
              </div>
              <div className="bg-white/50 border border-[#D4C5B0] p-4 sm:p-6 sm:col-span-2 md:col-span-1">
                <div className="text-2xl sm:text-3xl mb-2 sm:mb-4">✈️</div>
                <h3 className="text-base sm:text-lg text-[#2C2416] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>Group trips & events</h3>
                <p className="text-[#6B5D4F] text-xs sm:text-sm" style={{ fontFamily: 'Georgia, serif' }}>Spring break, concerts, dinners — pay your share over time</p>
              </div>
            </div>
          </div>
        )

      case 'product':
        return (
          <div className="flex flex-col justify-start sm:justify-center h-full px-4 sm:px-8 md:px-16 lg:px-24 pt-20 pb-16 sm:py-8 overflow-y-auto">
            <p className="text-xs sm:text-sm text-[#8B7E6E] tracking-widest uppercase mb-4 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              The Product
            </p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl text-[#2C2416] mb-6 sm:mb-12 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Simple to send.<br />Flexible to pay back.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12 items-center">
              <div className="space-y-6 sm:space-y-8">
                <div>
                  <h3 className="text-lg sm:text-xl text-[#2C2416] mb-2" style={{ fontFamily: 'Georgia, serif' }}>For Senders</h3>
                  <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
                    <li>• Get paid instantly — we cover them</li>
                    <li>• No more chasing friends for money</li>
                    <li>• Request from groups in one tap</li>
                    <li>• Track who's paid and who owes</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl text-[#2C2416] mb-2" style={{ fontFamily: 'Georgia, serif' }}>For Payers</h3>
                  <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
                    <li>• Pay instantly or split into 4-6 weeks</li>
                    <li>• No interest for on-time payments</li>
                    <li>• Automatic reminders before due dates</li>
                    <li>• Build payment history for future credit</li>
                  </ul>
                </div>
              </div>
              <div className="bg-[#2C2416] rounded-2xl p-6 sm:p-8 flex items-center justify-center min-h-[200px] sm:min-h-[400px]">
                <p className="text-[#D4C5B0] text-center text-sm sm:text-base" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                  [Product screenshots / demo]
                </p>
              </div>
            </div>
          </div>
        )

      case 'market':
        return (
          <div className="flex flex-col justify-start sm:justify-center h-full px-4 sm:px-8 md:px-16 lg:px-24 pt-20 pb-16 sm:py-8 overflow-y-auto">
            <p className="text-xs sm:text-sm text-[#8B7E6E] tracking-widest uppercase mb-4 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Market Opportunity
            </p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl text-[#2C2416] mb-2 sm:mb-4 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              P2P dominates consumer payments
            </h2>
            <p className="text-sm sm:text-xl text-[#6B5D4F] mb-6 sm:mb-10 max-w-3xl" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              Rent, travel, bills, and shared expenses — $1.7T flows P2P with zero BNPL option
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12 max-w-5xl">
              <div className="space-y-3 sm:space-y-6">
                <div className="flex items-center justify-between border-b border-[#D4C5B0] pb-2 sm:pb-4">
                  <span className="text-xs sm:text-base text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>US P2P payment volume (2024)</span>
                  <span className="text-lg sm:text-2xl text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>$1.7T</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#D4C5B0] pb-2 sm:pb-4">
                  <span className="text-xs sm:text-base text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Share of consumer payments via P2P</span>
                  <span className="text-lg sm:text-2xl text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>40%</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#D4C5B0] pb-2 sm:pb-4">
                  <span className="text-xs sm:text-base text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Avg transactions needing BNPL ($200+)</span>
                  <span className="text-lg sm:text-2xl text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>28%</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#D4C5B0] pb-2 sm:pb-4">
                  <span className="text-xs sm:text-base text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>BNPL interest (Gen Z)</span>
                  <span className="text-lg sm:text-2xl text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>60%</span>
                </div>
                <div className="flex items-center justify-between pt-1 sm:pt-2">
                  <span className="text-sm sm:text-xl text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Addressable BNPL opportunity</span>
                  <span className="text-xl sm:text-3xl text-[#2C2416] font-semibold" style={{ fontFamily: 'Georgia, serif' }}>$100B+</span>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-5 bg-[#2C2416] text-[#FAF8F5]">
                  <p className="text-xs sm:text-sm text-[#D4C5B0] mb-1">Where P2P is used</p>
                  <p className="text-sm sm:text-lg" style={{ fontFamily: 'Georgia, serif' }}>Rent splits, group travel, shared bills, dues & pools</p>
                </div>
                <div className="p-3 sm:p-5 bg-white/50 border border-[#D4C5B0]">
                  <p className="text-xs sm:text-sm text-[#8B7E6E] mb-1">TAM · Gen Z P2P payments</p>
                  <p className="text-2xl sm:text-3xl text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>$600B</p>
                </div>
                <div className="p-3 sm:p-5 bg-white/50 border border-[#D4C5B0]">
                  <p className="text-xs sm:text-sm text-[#8B7E6E] mb-1">SAM · Payments $200+ needing BNPL</p>
                  <p className="text-2xl sm:text-3xl text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>$100B</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'business-model':
        return (
          <div className="flex flex-col justify-start sm:justify-center h-full px-4 sm:px-8 md:px-16 lg:px-24 pt-20 pb-16 sm:py-8 overflow-y-auto">
            <p className="text-xs sm:text-sm text-[#8B7E6E] tracking-widest uppercase mb-4 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Business Model
            </p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl text-[#2C2416] mb-6 sm:mb-12 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Revenue from every transaction
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl">
              <div className="bg-white/50 border border-[#D4C5B0] p-4 sm:p-6">
                <h3 className="text-base sm:text-xl text-[#2C2416] mb-2 sm:mb-3" style={{ fontFamily: 'Georgia, serif' }}>Instant P2P</h3>
                <p className="text-2xl sm:text-3xl text-[#2C2416] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>Free</p>
                <p className="text-[#6B5D4F] text-xs sm:text-sm" style={{ fontFamily: 'Georgia, serif' }}>Builds habit & network effects</p>
              </div>
              <div className="bg-[#2C2416] p-4 sm:p-6">
                <h3 className="text-base sm:text-xl text-[#FAF8F5] mb-2 sm:mb-3" style={{ fontFamily: 'Georgia, serif' }}>CoverPay™ (BNPL)</h3>
                <p className="text-2xl sm:text-3xl text-[#FAF8F5] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>5-8%</p>
                <p className="text-[#D4C5B0] text-xs sm:text-sm" style={{ fontFamily: 'Georgia, serif' }}>Fee on financed payments</p>
              </div>
              <div className="bg-white/50 border border-[#D4C5B0] p-4 sm:p-6 sm:col-span-2 md:col-span-1">
                <h3 className="text-base sm:text-xl text-[#2C2416] mb-2 sm:mb-3" style={{ fontFamily: 'Georgia, serif' }}>Interchange</h3>
                <p className="text-2xl sm:text-3xl text-[#2C2416] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>1.5-2%</p>
                <p className="text-[#6B5D4F] text-xs sm:text-sm" style={{ fontFamily: 'Georgia, serif' }}>Payment gateway fees on card transactions</p>
              </div>
            </div>
            <div className="mt-4 sm:mt-8 max-w-5xl">
              <p className="text-sm sm:text-lg text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                Venmo/Cash App strategy: free P2P builds network, monetize through CoverPay™ + interchange.
              </p>
            </div>
          </div>
        )

      case 'go-to-market':
        return (
          <div className="flex flex-col justify-start sm:justify-center h-full px-4 sm:px-8 md:px-16 lg:px-24 pt-20 pb-16 sm:py-8 overflow-y-auto">
            <p className="text-xs sm:text-sm text-[#8B7E6E] tracking-widest uppercase mb-4 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Go-to-Market
            </p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl text-[#2C2416] mb-4 sm:mb-8 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Fraternities are our beachhead
            </h2>
            <p className="text-sm sm:text-xl text-[#6B5D4F] mb-6 sm:mb-10 max-w-2xl" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              Dense social networks, recurring payments, high CoverPay™ demand — the perfect wedge
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mb-6 sm:mb-10">
              <div className="p-4 sm:p-6 bg-[#2C2416] text-[#FAF8F5]">
                <p className="text-xs tracking-widest uppercase mb-2 sm:mb-4 text-[#D4C5B0]">Use Case 1</p>
                <h3 className="text-base sm:text-xl mb-2 sm:mb-3" style={{ fontFamily: 'Georgia, serif' }}>Social Dues</h3>
                <p className="text-xs sm:text-sm text-[#D4C5B0]" style={{ fontFamily: 'Georgia, serif' }}>$500/semester dues collected by treasurers — 40% pay late. CoverPay™ solves this.</p>
                <p className="text-sm sm:text-lg mt-2 sm:mt-4 text-[#D4C5B0]" style={{ fontFamily: 'Georgia, serif' }}>$750M/yr market</p>
              </div>
              <div className="p-4 sm:p-6 bg-white/50 border border-[#D4C5B0]">
                <p className="text-xs tracking-widest uppercase mb-2 sm:mb-4 text-[#8B7E6E]">Use Case 2</p>
                <h3 className="text-base sm:text-xl text-[#2C2416] mb-2 sm:mb-3" style={{ fontFamily: 'Georgia, serif' }}>March Madness Pools</h3>
                <p className="text-xs sm:text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>$50-500 buy-ins, everyone wants in but cash-strapped. Perfect for CoverPay™.</p>
                <p className="text-sm sm:text-lg text-[#2C2416] mt-2 sm:mt-4" style={{ fontFamily: 'Georgia, serif' }}>Viral growth</p>
              </div>
              <div className="p-4 sm:p-6 bg-white/50 border border-[#D4C5B0] sm:col-span-2 md:col-span-1">
                <p className="text-xs tracking-widest uppercase mb-2 sm:mb-4 text-[#8B7E6E]">Use Case 3</p>
                <h3 className="text-base sm:text-xl text-[#2C2416] mb-2 sm:mb-3" style={{ fontFamily: 'Georgia, serif' }}>Formals & Trips</h3>
                <p className="text-xs sm:text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Spring break, date parties, ski trips — group payments perfect for CoverPay™.</p>
                <p className="text-sm sm:text-lg text-[#2C2416] mt-2 sm:mt-4" style={{ fontFamily: 'Georgia, serif' }}>Recurring events</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-8 max-w-4xl">
              <div className="text-center">
                <p className="text-2xl sm:text-4xl text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>750K</p>
                <p className="text-xs sm:text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Active members</p>
              </div>
              <div className="hidden sm:block h-12 w-px bg-[#D4C5B0]"></div>
              <div className="text-center">
                <p className="text-2xl sm:text-4xl text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>12K</p>
                <p className="text-xs sm:text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Chapters</p>
              </div>
              <div className="hidden sm:block h-12 w-px bg-[#D4C5B0]"></div>
              <div className="text-center">
                <p className="text-2xl sm:text-4xl text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>60+</p>
                <p className="text-xs sm:text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Per chapter</p>
              </div>
              <div className="hidden sm:block h-12 w-px bg-[#D4C5B0]"></div>
              <div className="text-center">
                <p className="text-2xl sm:text-4xl text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Built-in</p>
                <p className="text-xs sm:text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Virality</p>
              </div>
            </div>
          </div>
        )

      case 'traction':
        return (
          <div className="flex flex-col justify-start sm:justify-center h-full px-4 sm:px-8 md:px-16 lg:px-24 pt-20 pb-16 sm:py-8 overflow-y-auto">
            <p className="text-xs sm:text-sm text-[#8B7E6E] tracking-widest uppercase mb-4 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Traction
            </p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl text-[#2C2416] mb-4 sm:mb-8 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              We built the distribution engine
            </h2>
            <p className="text-sm sm:text-xl text-[#6B5D4F] mb-6 sm:mb-10 max-w-2xl" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              Hedge Payments owns FraternityBase — the Crunchbase for fraternities and sororities in the U.S.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12 max-w-4xl">
              <div className="grid grid-cols-3 md:grid-cols-1 gap-3 sm:gap-6">
                <div className="p-3 sm:p-6 bg-[#2C2416]">
                  <p className="text-2xl sm:text-5xl text-[#FAF8F5] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>12K+</p>
                  <p className="text-xs sm:text-base text-[#D4C5B0]" style={{ fontFamily: 'Georgia, serif' }}>Chapters</p>
                </div>
                <div className="p-3 sm:p-6 bg-white/50 border border-[#D4C5B0]">
                  <p className="text-2xl sm:text-5xl text-[#2C2416] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>5K+</p>
                  <p className="text-xs sm:text-base text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Treasurers</p>
                </div>
                <div className="p-3 sm:p-6 bg-white/50 border border-[#D4C5B0]">
                  <p className="text-2xl sm:text-5xl text-[#2C2416] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>$0</p>
                  <p className="text-xs sm:text-base text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>CAC</p>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-6">
                <div className="p-3 sm:p-6 bg-white/50 border border-[#D4C5B0]">
                  <p className="text-sm sm:text-base text-[#2C2416] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                    "I'd definitely use this for March Madness. $200 buy-in is a lot at once."
                  </p>
                  <p className="text-xs sm:text-sm text-[#8B7E6E]">— College student, 22</p>
                </div>
                <div className="p-3 sm:p-6 bg-white/50 border border-[#D4C5B0]">
                  <p className="text-sm sm:text-base text-[#2C2416] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                    "Payment plans for dues would be huge. Half our guys are always late."
                  </p>
                  <p className="text-xs sm:text-sm text-[#8B7E6E]">— Matt, Penn State ZBT Treasurer</p>
                </div>
                <div className="p-3 sm:p-6 bg-white/50 border border-[#D4C5B0]">
                  <p className="text-sm sm:text-base text-[#2C2416] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                    "Spring break was $400 I didn't have. Would've loved to pay over time."
                  </p>
                  <p className="text-xs sm:text-sm text-[#8B7E6E]">— Recent grad, 23</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'vision':
        return (
          <div className="flex flex-col justify-start sm:justify-center h-full px-4 sm:px-8 md:px-16 lg:px-24 pt-20 pb-16 sm:py-8 overflow-y-auto">
            <p className="text-xs sm:text-sm text-[#8B7E6E] tracking-widest uppercase mb-4 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              The Vision
            </p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl text-[#2C2416] mb-4 sm:mb-8 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              CoverPay™ for all P2P payments
            </h2>
            <p className="text-sm sm:text-xl text-[#6B5D4F] mb-6 sm:mb-12 max-w-2xl" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              Fraternities are the wedge — Gen Z payments is the destination
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl">
              <div className="p-4 sm:p-6 bg-[#2C2416] text-[#FAF8F5]">
                <p className="text-xs tracking-widest uppercase mb-2 sm:mb-4 text-[#D4C5B0]">Now</p>
                <h3 className="text-base sm:text-xl mb-2 sm:mb-3" style={{ fontFamily: 'Georgia, serif' }}>Social Groups</h3>
                <p className="text-xs sm:text-sm text-[#D4C5B0]" style={{ fontFamily: 'Georgia, serif' }}>Fraternities, sororities, sports pools, group trips</p>
                <p className="text-xl sm:text-2xl mt-2 sm:mt-4" style={{ fontFamily: 'Georgia, serif' }}>$3B+</p>
              </div>
              <div className="p-4 sm:p-6 bg-white/50 border border-[#D4C5B0]">
                <p className="text-xs tracking-widest uppercase mb-2 sm:mb-4 text-[#8B7E6E]">Next</p>
                <h3 className="text-base sm:text-xl text-[#2C2416] mb-2 sm:mb-3" style={{ fontFamily: 'Georgia, serif' }}>Roommates & Friends</h3>
                <p className="text-xs sm:text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Rent splits, utilities, shared subscriptions, dinners</p>
                <p className="text-xl sm:text-2xl text-[#2C2416] mt-2 sm:mt-4" style={{ fontFamily: 'Georgia, serif' }}>$50B+</p>
              </div>
              <div className="p-4 sm:p-6 bg-white/50 border border-[#D4C5B0] sm:col-span-2 md:col-span-1">
                <p className="text-xs tracking-widest uppercase mb-2 sm:mb-4 text-[#8B7E6E]">Future</p>
                <h3 className="text-base sm:text-xl text-[#2C2416] mb-2 sm:mb-3" style={{ fontFamily: 'Georgia, serif' }}>All Gen Z P2P</h3>
                <p className="text-xs sm:text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Any payment where someone needs time to pay — we cover them</p>
                <p className="text-xl sm:text-2xl text-[#2C2416] mt-2 sm:mt-4" style={{ fontFamily: 'Georgia, serif' }}>$600B+</p>
              </div>
            </div>
            <p className="text-sm sm:text-base text-[#6B5D4F] mt-4 sm:mt-8 max-w-2xl" style={{ fontFamily: 'Georgia, serif' }}>
              Venmo and Cash App move money. We make it affordable.
            </p>
          </div>
        )

      case 'why-now':
        return (
          <div className="flex flex-col justify-start sm:justify-center h-full px-4 sm:px-8 md:px-16 lg:px-24 pt-20 pb-16 sm:py-8 overflow-y-auto">
            <p className="text-xs sm:text-sm text-[#8B7E6E] tracking-widest uppercase mb-4 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Why Now
            </p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl text-[#2C2416] mb-6 sm:mb-12 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              The perfect storm
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 max-w-4xl">
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#2C2416] text-[#FAF8F5] flex items-center justify-center flex-shrink-0 text-sm sm:text-base" style={{ fontFamily: 'Georgia, serif' }}>1</div>
                  <div>
                    <h3 className="text-base sm:text-xl text-[#2C2416] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>BNPL is Gen Z's default</h3>
                    <p className="text-sm sm:text-base text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>60%+ prefer BNPL over credit cards — but it doesn't exist for P2P</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#2C2416] text-[#FAF8F5] flex items-center justify-center flex-shrink-0 text-sm sm:text-base" style={{ fontFamily: 'Georgia, serif' }}>2</div>
                  <div>
                    <h3 className="text-base sm:text-xl text-[#2C2416] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>Venmo/Cash App hit a ceiling</h3>
                    <p className="text-sm sm:text-base text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Ubiquitous for transfers — but no financing, no flexibility for big payments</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#2C2416] text-[#FAF8F5] flex items-center justify-center flex-shrink-0 text-sm sm:text-base" style={{ fontFamily: 'Georgia, serif' }}>3</div>
                  <div>
                    <h3 className="text-base sm:text-xl text-[#2C2416] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>Social payments are exploding</h3>
                    <p className="text-sm sm:text-base text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Group trips, pools, shared costs — all rising with social media culture</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#2C2416] text-[#FAF8F5] flex items-center justify-center flex-shrink-0 text-sm sm:text-base" style={{ fontFamily: 'Georgia, serif' }}>4</div>
                  <div>
                    <h3 className="text-base sm:text-xl text-[#2C2416] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>Credit card rejection</h3>
                    <p className="text-sm sm:text-base text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>70% of Gen Z avoids traditional credit — but still needs flexibility</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'team':
        return (
          <div className="flex flex-col justify-start sm:justify-center h-full px-4 sm:px-8 md:px-16 lg:px-24 pt-20 pb-16 sm:py-8 overflow-y-auto">
            <p className="text-xs sm:text-sm text-[#8B7E6E] tracking-widest uppercase mb-4 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Team
            </p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl text-[#2C2416] mb-6 sm:mb-12 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Built by someone who lived it
            </h2>
            <div className="max-w-3xl">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-8 mb-6 sm:mb-10">
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-[#D4C5B0] flex-shrink-0"></div>
                <div className="text-center sm:text-left">
                  <h3 className="text-xl sm:text-3xl text-[#2C2416] mb-1" style={{ fontFamily: 'Georgia, serif' }}>Jackson Fitzgerald</h3>
                  <p className="text-sm sm:text-lg text-[#6B5D4F] mb-4 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>Founder & CEO</p>
                  <div className="space-y-2 sm:space-y-4">
                    <div className="flex items-center gap-2 sm:gap-3 justify-center sm:justify-start">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#2C2416]"></div>
                      <p className="text-sm sm:text-base text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>
                        <span className="font-semibold">Hedge Payments</span> — AI-native payment infrastructure
                      </p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 justify-center sm:justify-start">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#2C2416]"></div>
                      <p className="text-sm sm:text-base text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>
                        <span className="font-semibold">FraternityBase</span> — Database of 12K+ chapters
                      </p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 justify-center sm:justify-start">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#2C2416]"></div>
                      <p className="text-sm sm:text-base text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>
                        Deep Greek network + fintech background
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6 bg-white/50 border border-[#D4C5B0]">
                <p className="text-sm sm:text-base text-[#2C2416]" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                  "Every time friends split a trip or I owed someone for a pool, I thought: why can't I just pay this back over time? BNPL works for shopping — why not for paying back friends?"
                </p>
              </div>
            </div>
          </div>
        )

      case 'ask':
        return (
          <div className="flex flex-col justify-start sm:justify-center h-full px-4 sm:px-8 md:px-16 lg:px-24 pt-20 pb-16 sm:py-8 overflow-y-auto text-center">
            <p className="text-xs sm:text-sm text-[#8B7E6E] tracking-widest uppercase mb-4 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              The Ask
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#2C2416] mb-4 sm:mb-8 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Raising $5.25M Seed
            </h2>
            <p className="text-sm sm:text-xl text-[#6B5D4F] mb-6 sm:mb-12 max-w-2xl mx-auto" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              To launch CoverPay™, reach $5.25M MRR, and prove BNPL works for P2P payments
            </p>
            <div className="grid grid-cols-3 gap-2 sm:gap-6 max-w-3xl mx-auto mb-6 sm:mb-12">
              <div className="p-3 sm:p-6 bg-white/50 border border-[#D4C5B0]">
                <p className="text-xl sm:text-2xl text-[#2C2416] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>40%</p>
                <p className="text-[#6B5D4F] text-xs sm:text-sm" style={{ fontFamily: 'Georgia, serif' }}>Engineering & Product</p>
              </div>
              <div className="p-3 sm:p-6 bg-white/50 border border-[#D4C5B0]">
                <p className="text-xl sm:text-2xl text-[#2C2416] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>35%</p>
                <p className="text-[#6B5D4F] text-xs sm:text-sm" style={{ fontFamily: 'Georgia, serif' }}>BNPL Capital & Licensing</p>
              </div>
              <div className="p-3 sm:p-6 bg-white/50 border border-[#D4C5B0]">
                <p className="text-xl sm:text-2xl text-[#2C2416] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>25%</p>
                <p className="text-[#6B5D4F] text-xs sm:text-sm" style={{ fontFamily: 'Georgia, serif' }}>Growth & GTM</p>
              </div>
            </div>
            <div className="w-12 sm:w-16 h-px bg-[#D4C5B0] mx-auto mb-4 sm:mb-8"></div>
            <div className="space-y-3 sm:space-y-4">
              <p className="text-base sm:text-xl text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>
                jackson@hedgepayments.com
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 sm:px-10 py-3 sm:py-4 text-sm sm:text-base tracking-wide text-[#FAF8F5] bg-[#2C2416] border border-[#2C2416] hover:bg-[#3D3024] transition-all"
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
      <div className="fixed bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2 sm:gap-4 z-10">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="w-10 h-10 sm:w-10 sm:h-10 rounded-full border border-[#D4C5B0] flex items-center justify-center text-[#2C2416] hover:bg-[#2C2416] hover:text-[#FAF8F5] transition-all disabled:opacity-30 disabled:cursor-not-allowed active:bg-[#2C2416] active:text-[#FAF8F5]"
        >
          ←
        </button>

        <div className="hidden sm:flex gap-2">
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

        {/* Mobile slide counter (replaces dots) */}
        <div className="sm:hidden text-sm text-[#8B7E6E] min-w-[60px] text-center" style={{ fontFamily: 'Georgia, serif' }}>
          {currentSlide + 1} / {slides.length}
        </div>

        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="w-10 h-10 sm:w-10 sm:h-10 rounded-full border border-[#D4C5B0] flex items-center justify-center text-[#2C2416] hover:bg-[#2C2416] hover:text-[#FAF8F5] transition-all disabled:opacity-30 disabled:cursor-not-allowed active:bg-[#2C2416] active:text-[#FAF8F5]"
        >
          →
        </button>
      </div>

      {/* Slide Counter (desktop only) */}
      <div className="fixed top-4 sm:top-8 right-4 sm:right-8 text-xs sm:text-sm text-[#8B7E6E] z-10 hidden sm:block" style={{ fontFamily: 'Georgia, serif' }}>
        {currentSlide + 1} / {slides.length}
      </div>

      {/* Keyboard hint */}
      <div className="fixed bottom-8 right-8 text-xs text-[#8B7E6E] hidden md:block" style={{ fontFamily: 'Georgia, serif' }}>
        Use ← → or Space to navigate
      </div>

      {/* Back to home */}
      <Link
        href="/"
        className="fixed top-4 sm:top-8 left-4 sm:left-8 text-xs sm:text-sm text-[#8B7E6E] hover:text-[#2C2416] transition-colors z-10"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        ← Back
      </Link>
    </div>
  )
}
