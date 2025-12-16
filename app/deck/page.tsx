'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client for direct browser access
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cferwghhtstkxdiqhfqj.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmZXJ3Z2hodHN0a3hkaXFoZnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNDQ3NTUsImV4cCI6MjA2MDkyMDc1NX0.gG4SShzGpb-l_3BWDhhPZ7Vjk5ib0G_2ifWmqNajBm4'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
    id: 'usage-analysis',
    type: 'usage-analysis',
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

    // Store email in localStorage and save to Supabase directly
    try {
      // Save to localStorage
      localStorage.setItem('deck_access_email', email)
      localStorage.setItem('deck_access_time', new Date().toISOString())

      // Insert directly into Supabase
      const { error: insertError } = await supabase
        .from('deck_viewers')
        .insert([{ email, viewed_at: new Date().toISOString() }])

      // If duplicate email (error code 23505), update the timestamp instead
      if (insertError?.code === '23505') {
        await supabase
          .from('deck_viewers')
          .update({ viewed_at: new Date().toISOString() })
          .eq('email', email)
      }

      onAccess(email)
    } catch (err) {
      // Still grant access even if database fails
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
            src="/logos/CoverPayLogo.png"
            alt="CoverPay"
            width={120}
            height={120}
            className="w-24 h-24 mx-auto"
          />
        </div>

        <h1 className="text-4xl md:text-5xl text-[#2C2416] mb-4 tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
          CoverPay
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
          We'll only use your email to follow up about CoverPay
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
                src="/logos/CoverPayLogo.png"
                alt="CoverPay"
                width={200}
                height={200}
                className="w-40 h-40 md:w-52 md:h-52"
              />
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl text-[#2C2416] mb-6 tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
              CoverPay
            </h1>
            <div className="w-16 h-px bg-[#D4C5B0] mb-6"></div>
            <p className="text-2xl md:text-3xl text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              The Payment Orchestration Layer for BNPL
            </p>
            <p className="text-lg md:text-xl text-[#8B7E6E] mt-4" style={{ fontFamily: 'Georgia, serif' }}>
              6 providers. One API. Rescue 40% of abandoned checkouts.
            </p>
          </div>
        )

      case 'problem':
        return (
          <div className="flex flex-col justify-start sm:justify-center h-full px-4 sm:px-8 md:px-16 lg:px-24 pt-20 pb-16 sm:py-8 overflow-y-auto">
            <p className="text-xs sm:text-sm text-[#8B7E6E] tracking-widest uppercase mb-4 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              The Problem
            </p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-[#2C2416] mb-6 sm:mb-12 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              40% of users abandon carts<br className="hidden sm:block" /><span className="sm:hidden"> </span>when BNPL fails
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 max-w-5xl">
              <div className="flex items-start gap-3 sm:gap-4">
                <span className="text-2xl sm:text-3xl">❌</span>
                <div>
                  <h3 className="text-base sm:text-xl text-[#2C2416] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>Single-provider gamble</h3>
                  <p className="text-sm sm:text-base text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Merchants pick one BNPL — if it declines, 35% never return</p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:gap-4">
                <span className="text-2xl sm:text-3xl">💸</span>
                <div>
                  <h3 className="text-base sm:text-xl text-[#2C2416] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>85% are real customers</h3>
                  <p className="text-sm sm:text-base text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Only 15% of declines are fraud — the rest are lost legitimate sales</p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:gap-4">
                <span className="text-2xl sm:text-3xl">🔀</span>
                <div>
                  <h3 className="text-base sm:text-xl text-[#2C2416] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>No intelligent routing</h3>
                  <p className="text-sm sm:text-base text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Each provider has different approval criteria — no one combines them</p>
                </div>
              </div>
            </div>
            <div className="mt-6 sm:mt-10 p-4 sm:p-6 bg-[#2C2416] max-w-2xl">
              <p className="text-[#D4C5B0] text-sm sm:text-base" style={{ fontFamily: 'Georgia, serif' }}>
                <span className="text-[#FAF8F5] font-semibold">$145B+ in online purchases declined annually</span> — more than half of these customers never come back
              </p>
            </div>
          </div>
        )

      case 'usage-analysis':
        return (
          <div className="flex flex-col justify-start sm:justify-center h-full px-4 sm:px-8 md:px-16 lg:px-24 pt-16 pb-20 sm:py-8 overflow-y-auto">
            <p className="text-xs sm:text-sm text-[#8B7E6E] tracking-widest uppercase mb-2 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Usage Analysis
            </p>
            <h2 className="text-xl sm:text-4xl md:text-5xl text-[#2C2416] mb-4 sm:mb-10 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Gen Z chose BNPL over credit cards
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-12 max-w-5xl">
              {/* Gen Z BNPL Stats */}
              <div>
                <h3 className="text-base sm:text-xl text-[#2C2416] mb-3 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                  Gen Z BNPL Adoption (2024)
                </h3>
                <div className="space-y-2 sm:space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs sm:text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Holiday BNPL usage</span>
                      <span className="text-xs sm:text-sm text-[#2C2416] font-semibold" style={{ fontFamily: 'Georgia, serif' }}>54% (vs 50% credit)</span>
                    </div>
                    <div className="h-5 sm:h-8 bg-[#E8E2D9] overflow-hidden">
                      <div className="h-full bg-[#2C2416]" style={{ width: '54%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs sm:text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Annual BNPL users</span>
                      <span className="text-xs sm:text-sm text-[#2C2416] font-semibold" style={{ fontFamily: 'Georgia, serif' }}>44% of Gen Z</span>
                    </div>
                    <div className="h-5 sm:h-8 bg-[#E8E2D9] overflow-hidden">
                      <div className="h-full bg-[#6B5D4F]" style={{ width: '44%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs sm:text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Weekly BNPL users</span>
                      <span className="text-xs sm:text-sm text-[#2C2416] font-semibold" style={{ fontFamily: 'Georgia, serif' }}>40% of Gen Z</span>
                    </div>
                    <div className="h-5 sm:h-8 bg-[#E8E2D9] overflow-hidden">
                      <div className="h-full bg-[#8B7E6E]" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs sm:text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Multi-loan users</span>
                      <span className="text-xs sm:text-sm text-[#2C2416] font-semibold" style={{ fontFamily: 'Georgia, serif' }}>71% have 2+ active</span>
                    </div>
                    <div className="h-5 sm:h-8 bg-[#E8E2D9] overflow-hidden">
                      <div className="h-full bg-[#2C2416]" style={{ width: '71%' }}></div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-[#8B7E6E] mt-2 sm:mt-4" style={{ fontFamily: 'Georgia, serif' }}>
                  Source: J.D. Power 2024 — first year BNPL overtook credit cards for Gen Z
                </p>
              </div>

              {/* Top Categories */}
              <div>
                <h3 className="text-base sm:text-xl text-[#2C2416] mb-3 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                  Top BNPL Categories (% of purchases)
                </h3>
                <div className="space-y-2 sm:space-y-4">
                  <div className="p-2 sm:p-4 bg-[#2C2416]">
                    <div className="flex justify-between items-center mb-1 sm:mb-2">
                      <span className="text-sm sm:text-base text-[#FAF8F5]" style={{ fontFamily: 'Georgia, serif' }}>Fashion & Apparel</span>
                      <span className="text-base sm:text-xl text-[#FAF8F5] font-semibold" style={{ fontFamily: 'Georgia, serif' }}>42%</span>
                    </div>
                    <div className="h-2 sm:h-3 bg-[#4A3D2F] rounded-full overflow-hidden">
                      <div className="h-full bg-[#D4C5B0] rounded-full" style={{ width: '84%' }}></div>
                    </div>
                    <p className="text-xs text-[#D4C5B0] mt-1 hidden sm:block">Women 58% use BNPL for fashion</p>
                  </div>
                  <div className="p-2 sm:p-4 bg-white/50 border border-[#D4C5B0]">
                    <div className="flex justify-between items-center mb-1 sm:mb-2">
                      <span className="text-sm sm:text-base text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Electronics & Gaming</span>
                      <span className="text-base sm:text-xl text-[#2C2416] font-semibold" style={{ fontFamily: 'Georgia, serif' }}>32%</span>
                    </div>
                    <div className="h-2 sm:h-3 bg-[#E8E2D9] rounded-full overflow-hidden">
                      <div className="h-full bg-[#2C2416] rounded-full" style={{ width: '64%' }}></div>
                    </div>
                    <p className="text-xs text-[#8B7E6E] mt-1 hidden sm:block">62% of 18-24 use BNPL for gaming consoles</p>
                  </div>
                  <div className="p-2 sm:p-4 bg-white/50 border border-[#D4C5B0]">
                    <div className="flex justify-between items-center mb-1 sm:mb-2">
                      <span className="text-sm sm:text-base text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Furniture & Home</span>
                      <span className="text-base sm:text-xl text-[#2C2416] font-semibold" style={{ fontFamily: 'Georgia, serif' }}>26%</span>
                    </div>
                    <div className="h-2 sm:h-3 bg-[#E8E2D9] rounded-full overflow-hidden">
                      <div className="h-full bg-[#6B5D4F] rounded-full" style={{ width: '52%' }}></div>
                    </div>
                    <p className="text-xs text-[#8B7E6E] mt-1 hidden sm:block">High AOV — avg $500+ purchases</p>
                  </div>
                  <div className="p-2 sm:p-4 bg-white/50 border border-[#D4C5B0]">
                    <div className="flex justify-between items-center mb-1 sm:mb-2">
                      <span className="text-sm sm:text-base text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Travel & Experiences</span>
                      <span className="text-base sm:text-xl text-[#2C2416] font-semibold" style={{ fontFamily: 'Georgia, serif' }}>17%</span>
                    </div>
                    <div className="h-2 sm:h-3 bg-[#E8E2D9] rounded-full overflow-hidden">
                      <div className="h-full bg-[#8B7E6E] rounded-full" style={{ width: '34%' }}></div>
                    </div>
                    <p className="text-xs text-[#8B7E6E] mt-1 hidden sm:block">Gen Z 50% more likely for concerts/festivals</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 sm:mt-8 p-3 sm:p-4 bg-[#2C2416] max-w-xl">
              <p className="text-[#D4C5B0] text-xs sm:text-sm" style={{ fontFamily: 'Georgia, serif' }}>
                <span className="text-[#FAF8F5] font-semibold">86.5M Americans used BNPL in 2024</span> — growing 7% YoY. 64% of Gen Z (18-28) have used BNPL vs only 29% of boomers.
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
              CoverPay: Payment Orchestration for BNPL
            </h2>
            <p className="text-sm sm:text-lg text-[#8B7E6E] mb-4 sm:mb-8" style={{ fontFamily: 'Georgia, serif' }}>by Hedge Payments</p>
            <p className="text-base sm:text-xl text-[#6B5D4F] mb-6 sm:mb-12 max-w-2xl" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              One API that aggregates the top 5 providers (52% market share) + more — merchants integrate once
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl">
              <div className="bg-[#2C2416] p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl mb-2 sm:mb-4">🔄</div>
                <h3 className="text-base sm:text-lg text-[#FAF8F5] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>Waterfall routing</h3>
                <p className="text-[#D4C5B0] text-xs sm:text-sm" style={{ fontFamily: 'Georgia, serif' }}>Declined by Klarna? Auto-routes to Affirm, then Afterpay, until approved</p>
              </div>
              <div className="bg-[#2C2416] p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl mb-2 sm:mb-4">✂️</div>
                <h3 className="text-base sm:text-lg text-[#FAF8F5] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>Split payments</h3>
                <p className="text-[#D4C5B0] text-xs sm:text-sm" style={{ fontFamily: 'Georgia, serif' }}>$600 purchase? $300 on Klarna + $300 on Affirm — abstracted to one payment</p>
              </div>
              <div className="bg-white/50 border border-[#D4C5B0] p-4 sm:p-6 sm:col-span-2 md:col-span-1">
                <div className="text-2xl sm:text-3xl mb-2 sm:mb-4">🤖</div>
                <h3 className="text-base sm:text-lg text-[#2C2416] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>AI-optimized</h3>
                <p className="text-[#6B5D4F] text-xs sm:text-sm" style={{ fontFamily: 'Georgia, serif' }}>Machine learning predicts the best provider order per user</p>
              </div>
            </div>
            {/* Provider logos */}
            <div className="mt-6 sm:mt-10 flex flex-wrap items-center gap-4 sm:gap-6">
              <span className="text-xs sm:text-sm text-[#8B7E6E]" style={{ fontFamily: 'Georgia, serif' }}>Integrated:</span>
              <div className="flex items-center gap-3 sm:gap-4">
                <Image src="/logos/KlarnaLogo.jpeg" alt="Klarna" width={60} height={24} className="h-5 sm:h-6 w-auto opacity-70" />
                <Image src="/logos/affirmLogo.avif" alt="Affirm" width={60} height={24} className="h-5 sm:h-6 w-auto opacity-70" />
                <Image src="/logos/afterPayLogo.jpg" alt="Afterpay" width={60} height={24} className="h-5 sm:h-6 w-auto opacity-70" />
                <Image src="/logos/sezzleLogo.png" alt="Sezzle" width={60} height={24} className="h-5 sm:h-6 w-auto opacity-70" />
                <Image src="/logos/zipLogo.png" alt="Zip" width={60} height={24} className="h-5 sm:h-6 w-auto opacity-70" />
                <Image src="/logos/PayPalLogo.jpg" alt="PayPal" width={60} height={24} className="h-5 sm:h-6 w-auto opacity-70" />
              </div>
            </div>
          </div>
        )

      case 'product':
        return (
          <div className="flex flex-col justify-start sm:justify-center h-full px-4 sm:px-8 md:px-16 lg:px-24 pt-20 pb-16 sm:py-8 overflow-y-auto">
            <p className="text-xs sm:text-sm text-[#8B7E6E] tracking-widest uppercase mb-4 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              How It Works
            </p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl text-[#2C2416] mb-6 sm:mb-12 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              The Split Payment Example
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12 items-center">
              <div className="space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-4 bg-[#2C2416]">
                  <p className="text-xs text-[#D4C5B0] mb-1">PRE-CHECK</p>
                  <p className="text-sm sm:text-base text-[#FAF8F5]" style={{ fontFamily: 'Georgia, serif' }}>CoverPay queries each provider's API to get user's <span className="font-semibold">funding ceiling</span> before checkout</p>
                </div>
                <div className="p-3 sm:p-4 bg-white/50 border border-[#D4C5B0]">
                  <p className="text-xs text-[#8B7E6E] mb-1">STEP 1</p>
                  <p className="text-sm sm:text-base text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>User wants to checkout for <span className="font-semibold">$600</span></p>
                </div>
                <div className="p-3 sm:p-4 bg-white/50 border border-[#D4C5B0]">
                  <p className="text-xs text-[#8B7E6E] mb-1">STEP 2</p>
                  <p className="text-sm sm:text-base text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>CoverPay already knows: Klarna ceiling = <span className="font-semibold">$300</span></p>
                </div>
                <div className="p-3 sm:p-4 bg-white/50 border border-[#D4C5B0]">
                  <p className="text-xs text-[#8B7E6E] mb-1">STEP 3</p>
                  <p className="text-sm sm:text-base text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>CoverPay already knows: Affirm ceiling = <span className="font-semibold">$300</span></p>
                </div>
                <div className="p-3 sm:p-4 bg-[#2C2416]">
                  <p className="text-xs text-[#D4C5B0] mb-1">RESULT</p>
                  <p className="text-sm sm:text-base text-[#FAF8F5]" style={{ fontFamily: 'Georgia, serif' }}>Instant split: <span className="font-semibold">$300 + $300 = $600</span> — one unified checkout</p>
                </div>
              </div>
              <div className="bg-[#2C2416] rounded-2xl p-6 sm:p-8 flex items-center justify-center min-h-[200px] sm:min-h-[400px]">
                <div className="flex flex-col items-center w-full">
                  {/* Split Payment Visual */}
                  <div className="text-4xl sm:text-5xl text-[#FAF8F5] mb-4 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>$600</div>
                  <div className="text-[#D4C5B0] text-sm mb-4">splits into</div>
                  <div className="flex items-center gap-4 sm:gap-8 mb-6">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-[#FAF8F5] flex items-center justify-center mb-2 p-2">
                        <Image src="/logos/KlarnaLogo.jpeg" alt="Klarna" width={60} height={40} className="w-full h-auto" />
                      </div>
                      <span className="text-[#FAF8F5] text-lg sm:text-xl font-semibold" style={{ fontFamily: 'Georgia, serif' }}>$300</span>
                    </div>
                    <div className="text-[#D4C5B0] text-2xl">+</div>
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-[#FAF8F5] flex items-center justify-center mb-2 p-2">
                        <Image src="/logos/affirmLogo.avif" alt="Affirm" width={60} height={40} className="w-full h-auto" />
                      </div>
                      <span className="text-[#FAF8F5] text-lg sm:text-xl font-semibold" style={{ fontFamily: 'Georgia, serif' }}>$300</span>
                    </div>
                  </div>
                  {/* Benefits */}
                  <div className="text-center space-y-2">
                    <div className="flex items-center gap-2 text-[#FAF8F5] text-xs sm:text-sm" style={{ fontFamily: 'Georgia, serif' }}>
                      <span className="text-green-400">✓</span> User sees one unified payment
                    </div>
                    <div className="flex items-center gap-2 text-[#FAF8F5] text-xs sm:text-sm" style={{ fontFamily: 'Georgia, serif' }}>
                      <span className="text-green-400">✓</span> Merchant gets full amount
                    </div>
                    <div className="flex items-center gap-2 text-[#FAF8F5] text-xs sm:text-sm" style={{ fontFamily: 'Georgia, serif' }}>
                      <span className="text-green-400">✓</span> CoverPay handles the complexity
                    </div>
                  </div>
                </div>
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
              $560B market, growing to $912B by 2030
            </h2>
            <p className="text-sm sm:text-xl text-[#6B5D4F] mb-6 sm:mb-10 max-w-3xl" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              360M+ users worldwide, projected to 900M by 2027 — but fragmented across 6+ providers
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12 max-w-5xl">
              <div className="space-y-3 sm:space-y-6">
                <div className="flex items-center justify-between border-b border-[#D4C5B0] pb-2 sm:pb-4">
                  <span className="text-xs sm:text-base text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Global BNPL GMV (2025)</span>
                  <span className="text-lg sm:text-2xl text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>$560B</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#D4C5B0] pb-2 sm:pb-4">
                  <span className="text-xs sm:text-base text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Cart abandonment when BNPL fails</span>
                  <span className="text-lg sm:text-2xl text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>40%</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#D4C5B0] pb-2 sm:pb-4">
                  <span className="text-xs sm:text-base text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Online purchases declined annually</span>
                  <span className="text-lg sm:text-2xl text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>$145B+</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#D4C5B0] pb-2 sm:pb-4">
                  <span className="text-xs sm:text-base text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>CAGR through 2030</span>
                  <span className="text-lg sm:text-2xl text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>10.2%</span>
                </div>
                <div className="flex items-center justify-between pt-1 sm:pt-2">
                  <span className="text-sm sm:text-xl text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Rescuable revenue (85% not fraud)</span>
                  <span className="text-xl sm:text-3xl text-[#2C2416] font-semibold" style={{ fontFamily: 'Georgia, serif' }}>$120B+</span>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-5 bg-[#2C2416] text-[#FAF8F5]">
                  <p className="text-xs sm:text-sm text-[#D4C5B0] mb-1">The Gap</p>
                  <p className="text-sm sm:text-lg" style={{ fontFamily: 'Georgia, serif' }}>Top 5 providers hold only 52% share — no one aggregates intelligently</p>
                </div>
                <div className="p-3 sm:p-5 bg-white/50 border border-[#D4C5B0]">
                  <p className="text-xs sm:text-sm text-[#8B7E6E] mb-1">TAM · Global BNPL volume (2030)</p>
                  <p className="text-2xl sm:text-3xl text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>$912B</p>
                </div>
                <div className="p-3 sm:p-5 bg-white/50 border border-[#D4C5B0]">
                  <p className="text-xs sm:text-sm text-[#8B7E6E] mb-1">SAM · Declined BNPL that CoverPay rescues</p>
                  <p className="text-2xl sm:text-3xl text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>$120B</p>
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
              Cheaper than lost sales, cheaper than BNPL fees
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl">
              <div className="bg-[#2C2416] p-4 sm:p-6">
                <h3 className="text-base sm:text-xl text-[#FAF8F5] mb-2 sm:mb-3" style={{ fontFamily: 'Georgia, serif' }}>Orchestration Fee</h3>
                <p className="text-2xl sm:text-3xl text-[#FAF8F5] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>1-2%</p>
                <p className="text-[#D4C5B0] text-xs sm:text-sm" style={{ fontFamily: 'Georgia, serif' }}>vs 5-8% direct BNPL fees — we save merchants money</p>
              </div>
              <div className="bg-[#2C2416] p-4 sm:p-6">
                <h3 className="text-base sm:text-xl text-[#FAF8F5] mb-2 sm:mb-3" style={{ fontFamily: 'Georgia, serif' }}>Split Payment Premium</h3>
                <p className="text-2xl sm:text-3xl text-[#FAF8F5] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>2-3%</p>
                <p className="text-[#D4C5B0] text-xs sm:text-sm" style={{ fontFamily: 'Georgia, serif' }}>Rescues sales that would have been 100% lost</p>
              </div>
              <div className="bg-white/50 border border-[#D4C5B0] p-4 sm:p-6 sm:col-span-2 md:col-span-1">
                <h3 className="text-base sm:text-xl text-[#2C2416] mb-2 sm:mb-3" style={{ fontFamily: 'Georgia, serif' }}>SaaS API Access</h3>
                <p className="text-2xl sm:text-3xl text-[#2C2416] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>$2K+/mo</p>
                <p className="text-[#6B5D4F] text-xs sm:text-sm" style={{ fontFamily: 'Georgia, serif' }}>Enterprise merchants get premium routing + analytics</p>
              </div>
            </div>
            <div className="mt-4 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl">
              <div className="p-4 sm:p-5 bg-white/50 border border-[#D4C5B0]">
                <p className="text-xs text-[#8B7E6E] mb-2">Merchant ROI</p>
                <p className="text-sm sm:text-base text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>
                  BNPL increases AOV by <span className="font-semibold">41-85%</span> and conversion by <span className="font-semibold">30%</span>. CoverPay captures another 40% that would abandon.
                </p>
              </div>
              <div className="p-4 sm:p-5 bg-[#2C2416]">
                <p className="text-xs text-[#D4C5B0] mb-2">Example Unit Economics</p>
                <p className="text-sm sm:text-base text-[#FAF8F5]" style={{ fontFamily: 'Georgia, serif' }}>
                  $600 split payment → $300 Klarna + $300 Affirm → <span className="font-semibold">CoverPay earns ~$18</span> (3%)
                </p>
              </div>
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
              E-commerce merchants are our beachhead
            </h2>
            <p className="text-sm sm:text-xl text-[#6B5D4F] mb-6 sm:mb-10 max-w-2xl" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              Merchants losing sales to BNPL declines are eager for a solution — one API integration
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mb-6 sm:mb-10">
              <div className="p-4 sm:p-6 bg-[#2C2416] text-[#FAF8F5]">
                <p className="text-xs tracking-widest uppercase mb-2 sm:mb-4 text-[#D4C5B0]">Phase 1</p>
                <h3 className="text-base sm:text-xl mb-2 sm:mb-3" style={{ fontFamily: 'Georgia, serif' }}>Mid-Market DTC</h3>
                <p className="text-xs sm:text-sm text-[#D4C5B0]" style={{ fontFamily: 'Georgia, serif' }}>$10-50M GMV brands losing 20%+ to BNPL declines. Quick wins, high intent.</p>
                <p className="text-sm sm:text-lg mt-2 sm:mt-4 text-[#D4C5B0]" style={{ fontFamily: 'Georgia, serif' }}>10K+ merchants</p>
              </div>
              <div className="p-4 sm:p-6 bg-white/50 border border-[#D4C5B0]">
                <p className="text-xs tracking-widest uppercase mb-2 sm:mb-4 text-[#8B7E6E]">Phase 2</p>
                <h3 className="text-base sm:text-xl text-[#2C2416] mb-2 sm:mb-3" style={{ fontFamily: 'Georgia, serif' }}>High-AOV Verticals</h3>
                <p className="text-xs sm:text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Furniture, electronics, travel — $500+ AOV where BNPL matters most.</p>
                <p className="text-sm sm:text-lg text-[#2C2416] mt-2 sm:mt-4" style={{ fontFamily: 'Georgia, serif' }}>$50B+ market</p>
              </div>
              <div className="p-4 sm:p-6 bg-white/50 border border-[#D4C5B0] sm:col-span-2 md:col-span-1">
                <p className="text-xs tracking-widest uppercase mb-2 sm:mb-4 text-[#8B7E6E]">Phase 3</p>
                <h3 className="text-base sm:text-xl text-[#2C2416] mb-2 sm:mb-3" style={{ fontFamily: 'Georgia, serif' }}>Platform Integrations</h3>
                <p className="text-xs sm:text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Shopify, WooCommerce, BigCommerce plugins for instant adoption.</p>
                <p className="text-sm sm:text-lg text-[#2C2416] mt-2 sm:mt-4" style={{ fontFamily: 'Georgia, serif' }}>1M+ stores</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-8 max-w-4xl">
              <div className="text-center">
                <p className="text-2xl sm:text-4xl text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>6</p>
                <p className="text-xs sm:text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>BNPL providers</p>
              </div>
              <div className="hidden sm:block h-12 w-px bg-[#D4C5B0]"></div>
              <div className="text-center">
                <p className="text-2xl sm:text-4xl text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>1</p>
                <p className="text-xs sm:text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>API integration</p>
              </div>
              <div className="hidden sm:block h-12 w-px bg-[#D4C5B0]"></div>
              <div className="text-center">
                <p className="text-2xl sm:text-4xl text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>85%+</p>
                <p className="text-xs sm:text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Approval rate</p>
              </div>
              <div className="hidden sm:block h-12 w-px bg-[#D4C5B0]"></div>
              <div className="text-center">
                <p className="text-2xl sm:text-4xl text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>+25%</p>
                <p className="text-xs sm:text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>More conversions</p>
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
              Built and ready to deploy
            </h2>
            <p className="text-sm sm:text-xl text-[#6B5D4F] mb-6 sm:mb-10 max-w-2xl" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              CoverPay API is live with 6 providers integrated — ready for merchant onboarding
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12 max-w-4xl">
              <div className="grid grid-cols-3 md:grid-cols-1 gap-3 sm:gap-6">
                <div className="p-3 sm:p-6 bg-[#2C2416]">
                  <p className="text-2xl sm:text-5xl text-[#FAF8F5] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>6</p>
                  <p className="text-xs sm:text-base text-[#D4C5B0]" style={{ fontFamily: 'Georgia, serif' }}>BNPL Providers</p>
                </div>
                <div className="p-3 sm:p-6 bg-white/50 border border-[#D4C5B0]">
                  <p className="text-2xl sm:text-5xl text-[#2C2416] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>2</p>
                  <p className="text-xs sm:text-base text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Routing strategies</p>
                </div>
                <div className="p-3 sm:p-6 bg-white/50 border border-[#D4C5B0]">
                  <p className="text-2xl sm:text-5xl text-[#2C2416] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>Live</p>
                  <p className="text-xs sm:text-base text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>REST API</p>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-6">
                <div className="p-3 sm:p-6 bg-[#2C2416]">
                  <p className="text-xs sm:text-sm text-[#D4C5B0] mb-2">Waterfall Strategy</p>
                  <p className="text-sm sm:text-base text-[#FAF8F5]" style={{ fontFamily: 'Georgia, serif' }}>
                    Routes through providers sequentially until approval — maximizes success rate
                  </p>
                </div>
                <div className="p-3 sm:p-6 bg-[#2C2416]">
                  <p className="text-xs sm:text-sm text-[#D4C5B0] mb-2">Split Strategy</p>
                  <p className="text-sm sm:text-base text-[#FAF8F5]" style={{ fontFamily: 'Georgia, serif' }}>
                    Divides payment across 2 providers when partial approvals occur — unlocks larger purchases
                  </p>
                </div>
                <div className="p-3 sm:p-6 bg-white/50 border border-[#D4C5B0]">
                  <p className="text-xs sm:text-sm text-[#8B7E6E] mb-2">Integrated Providers</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-2 py-1 bg-[#2C2416] text-[#FAF8F5]">Klarna</span>
                    <span className="text-xs px-2 py-1 bg-[#2C2416] text-[#FAF8F5]">Affirm</span>
                    <span className="text-xs px-2 py-1 bg-[#2C2416] text-[#FAF8F5]">Afterpay</span>
                    <span className="text-xs px-2 py-1 bg-[#2C2416] text-[#FAF8F5]">Sezzle</span>
                    <span className="text-xs px-2 py-1 bg-[#2C2416] text-[#FAF8F5]">Zip</span>
                    <span className="text-xs px-2 py-1 bg-[#2C2416] text-[#FAF8F5]">PayPal</span>
                  </div>
                </div>
              </div>
            </div>
            <a
              href="https://hedgepayments.com/coverpay"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 sm:mt-6 text-xs sm:text-sm text-[#8B7E6E] hover:text-[#2C2416] transition-colors underline"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              See CoverPay Demo →
            </a>
          </div>
        )

      case 'vision':
        return (
          <div className="flex flex-col justify-start sm:justify-center h-full px-4 sm:px-8 md:px-16 lg:px-24 pt-20 pb-16 sm:py-8 overflow-y-auto">
            <p className="text-xs sm:text-sm text-[#8B7E6E] tracking-widest uppercase mb-4 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              The Vision
            </p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl text-[#2C2416] mb-4 sm:mb-8 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              The Stripe for BNPL
            </h2>
            <p className="text-sm sm:text-xl text-[#6B5D4F] mb-6 sm:mb-12 max-w-2xl" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              One API to rule all BNPL providers — merchants integrate once, we optimize forever
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl">
              <div className="p-4 sm:p-6 bg-[#2C2416] text-[#FAF8F5]">
                <p className="text-xs tracking-widest uppercase mb-2 sm:mb-4 text-[#D4C5B0]">Now</p>
                <h3 className="text-base sm:text-xl mb-2 sm:mb-3" style={{ fontFamily: 'Georgia, serif' }}>E-Commerce</h3>
                <p className="text-xs sm:text-sm text-[#D4C5B0]" style={{ fontFamily: 'Georgia, serif' }}>DTC brands, high-AOV merchants losing sales to BNPL declines</p>
                <p className="text-xl sm:text-2xl mt-2 sm:mt-4" style={{ fontFamily: 'Georgia, serif' }}>$25B</p>
              </div>
              <div className="p-4 sm:p-6 bg-white/50 border border-[#D4C5B0]">
                <p className="text-xs tracking-widest uppercase mb-2 sm:mb-4 text-[#8B7E6E]">Next</p>
                <h3 className="text-base sm:text-xl text-[#2C2416] mb-2 sm:mb-3" style={{ fontFamily: 'Georgia, serif' }}>Travel & Services</h3>
                <p className="text-xs sm:text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Flights, hotels, healthcare — high-ticket services need flexibility</p>
                <p className="text-xl sm:text-2xl text-[#2C2416] mt-2 sm:mt-4" style={{ fontFamily: 'Georgia, serif' }}>$50B+</p>
              </div>
              <div className="p-4 sm:p-6 bg-white/50 border border-[#D4C5B0]">
                <p className="text-xs tracking-widest uppercase mb-2 sm:mb-4 text-[#8B7E6E]">Expand</p>
                <h3 className="text-base sm:text-xl text-[#2C2416] mb-2 sm:mb-3" style={{ fontFamily: 'Georgia, serif' }}>B2B Payments</h3>
                <p className="text-xs sm:text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Net-30/60/90 terms orchestrated across lending providers</p>
                <p className="text-xl sm:text-2xl text-[#2C2416] mt-2 sm:mt-4" style={{ fontFamily: 'Georgia, serif' }}>$200B+</p>
              </div>
              <div className="p-4 sm:p-6 bg-white/50 border border-[#D4C5B0]">
                <p className="text-xs tracking-widest uppercase mb-2 sm:mb-4 text-[#8B7E6E]">Future</p>
                <h3 className="text-base sm:text-xl text-[#2C2416] mb-2 sm:mb-3" style={{ fontFamily: 'Georgia, serif' }}>Global BNPL</h3>
                <p className="text-xs sm:text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Unified checkout across all markets, all providers, all currencies</p>
                <p className="text-xl sm:text-2xl text-[#2C2416] mt-2 sm:mt-4" style={{ fontFamily: 'Georgia, serif' }}>$500B+</p>
              </div>
            </div>
            <p className="text-sm sm:text-base text-[#6B5D4F] mt-4 sm:mt-8 max-w-2xl" style={{ fontFamily: 'Georgia, serif' }}>
              Klarna, Affirm, Afterpay compete. We orchestrate.
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
              Perfect timing for BNPL orchestration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 max-w-4xl">
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#2C2416] text-[#FAF8F5] flex items-center justify-center flex-shrink-0 text-sm sm:text-base" style={{ fontFamily: 'Georgia, serif' }}>1</div>
                  <div>
                    <h3 className="text-base sm:text-xl text-[#2C2416] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>Market matured, now fragmented</h3>
                    <p className="text-sm sm:text-base text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Top 5 hold only 52% share. Klarna, Affirm, Afterpay, PayPal, Zip all competing — no one aggregates</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#2C2416] text-[#FAF8F5] flex items-center justify-center flex-shrink-0 text-sm sm:text-base" style={{ fontFamily: 'Georgia, serif' }}>2</div>
                  <div>
                    <h3 className="text-base sm:text-xl text-[#2C2416] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>Gen Z tipping point</h3>
                    <p className="text-sm sm:text-base text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>2024: First year BNPL overtook credit cards for Gen Z (54% vs 50%). 40% use weekly</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#2C2416] text-[#FAF8F5] flex items-center justify-center flex-shrink-0 text-sm sm:text-base" style={{ fontFamily: 'Georgia, serif' }}>3</div>
                  <div>
                    <h3 className="text-base sm:text-xl text-[#2C2416] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>Regulatory clarity</h3>
                    <p className="text-sm sm:text-base text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>CFPB withdrew credit-card classification in 2025 — BNPL can innovate without heavy regulation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#2C2416] text-[#FAF8F5] flex items-center justify-center flex-shrink-0 text-sm sm:text-base" style={{ fontFamily: 'Georgia, serif' }}>4</div>
                  <div>
                    <h3 className="text-base sm:text-xl text-[#2C2416] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>Providers eager for volume</h3>
                    <p className="text-sm sm:text-base text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Apple partnered with Klarna Oct 2024. All providers racing for merchant distribution</p>
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
              Technical founder, payments obsessed
            </h2>
            <div className="max-w-3xl">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-8 mb-6 sm:mb-10">
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src="/images/Jackson_Hedgshot.jpg"
                    alt="Jackson Fitzgerald"
                    width={112}
                    height={112}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-xl sm:text-3xl text-[#2C2416] mb-1" style={{ fontFamily: 'Georgia, serif' }}>Jackson Fitzgerald</h3>
                  <p className="text-sm sm:text-lg text-[#6B5D4F] mb-4 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>Founder & CEO</p>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3 sm:gap-4 justify-center sm:justify-start">
                      <Image
                        src="/logos/CoverPayLogo.png"
                        alt="CoverPay"
                        width={24}
                        height={24}
                        className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                      />
                      <p className="text-sm sm:text-base text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>
                        <span className="font-semibold">CoverPay</span> — Built the API with 6 providers integrated
                      </p>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4 justify-center sm:justify-start">
                      <Image
                        src="/images/hedgepay-new-logo.png"
                        alt="Hedge Payments"
                        width={24}
                        height={24}
                        className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                      />
                      <p className="text-sm sm:text-base text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>
                        <span className="font-semibold">Hedge Payments</span> — AI-native payment infrastructure
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6 bg-white/50 border border-[#D4C5B0]">
                <p className="text-sm sm:text-base text-[#2C2416]" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                  "I kept seeing merchants lose sales because one BNPL provider declined. The obvious solution: try them all. CoverPay orchestrates 6 providers through one API — maximizing approvals, minimizing abandoned carts."
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
              Raising $3M Seed
            </h2>
            <p className="text-sm sm:text-xl text-[#6B5D4F] mb-6 sm:mb-12 max-w-2xl mx-auto" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              To scale CoverPay to 100+ merchants and $50M+ in BNPL volume
            </p>
            <div className="grid grid-cols-3 gap-2 sm:gap-6 max-w-3xl mx-auto mb-6 sm:mb-12">
              <div className="p-3 sm:p-6 bg-white/50 border border-[#D4C5B0]">
                <p className="text-xl sm:text-2xl text-[#2C2416] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>50%</p>
                <p className="text-[#6B5D4F] text-xs sm:text-sm" style={{ fontFamily: 'Georgia, serif' }}>Engineering & AI/ML</p>
              </div>
              <div className="p-3 sm:p-6 bg-white/50 border border-[#D4C5B0]">
                <p className="text-xl sm:text-2xl text-[#2C2416] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>30%</p>
                <p className="text-[#6B5D4F] text-xs sm:text-sm" style={{ fontFamily: 'Georgia, serif' }}>Sales & Merchant Growth</p>
              </div>
              <div className="p-3 sm:p-6 bg-white/50 border border-[#D4C5B0]">
                <p className="text-xl sm:text-2xl text-[#2C2416] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>20%</p>
                <p className="text-[#6B5D4F] text-xs sm:text-sm" style={{ fontFamily: 'Georgia, serif' }}>Provider Integrations</p>
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
