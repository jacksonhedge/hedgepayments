'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
// 3D Logo component that follows cursor
function Logo3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      // Calculate distance from center of logo to cursor
      const deltaX = e.clientX - centerX
      const deltaY = e.clientY - centerY

      // Calculate rotation (max ~45 degrees for pronounced effect)
      const maxRotation = 45
      const rotateY = (deltaX / window.innerWidth) * maxRotation * 3
      const rotateX = -(deltaY / window.innerHeight) * maxRotation * 3

      setRotation({ x: rotateX, y: rotateY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      ref={containerRef}
      className="mb-10"
      style={{
        perspective: '1000px',
      }}
    >
      <div
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: 'transform 0.1s ease-out',
          transformStyle: 'preserve-3d',
        }}
      >
        <Image
          src="/images/HedgeLogo3D.png"
          alt="Hedge Payments"
          width={400}
          height={400}
          className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96"
          style={{
            filter: 'drop-shadow(0 25px 50px rgba(44, 36, 22, 0.35))',
          }}
        />
      </div>
    </div>
  )
}

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
    id: 'market',
    type: 'market',
  },
  {
    id: 'solution',
    type: 'solution',
  },
  {
    id: 'product-overview',
    type: 'product-overview',
  },
  {
    id: 'product-coverpay',
    type: 'product-coverpay',
  },
  {
    id: 'product-bankroll',
    type: 'product-bankroll',
  },
  {
    id: 'why-now',
    type: 'why-now',
  },
  {
    id: 'distribution',
    type: 'distribution',
  },
  {
    id: 'business-model',
    type: 'business-model',
  },
  {
    id: 'competition',
    type: 'competition',
  },
  {
    id: 'competition-users',
    type: 'competition-users',
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
    id: 'team',
    type: 'team',
  },
  {
    id: 'ask',
    type: 'ask',
  },
]

// Smaller 3D Logo for email gate
function Logo3DSmall() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const deltaX = e.clientX - centerX
      const deltaY = e.clientY - centerY

      const maxRotation = 45
      const rotateY = (deltaX / window.innerWidth) * maxRotation * 3
      const rotateX = -(deltaY / window.innerHeight) * maxRotation * 3

      setRotation({ x: rotateX, y: rotateY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      ref={containerRef}
      className="mb-8"
      style={{ perspective: '800px' }}
    >
      <div
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: 'transform 0.1s ease-out',
          transformStyle: 'preserve-3d',
        }}
      >
        <Image
          src="/images/HedgeLogo3D.png"
          alt="Hedge Payments"
          width={200}
          height={200}
          className="w-40 h-40 mx-auto"
          style={{ filter: 'drop-shadow(0 15px 30px rgba(44, 36, 22, 0.3))' }}
        />
      </div>
    </div>
  )
}

function Logo3DTiny({ show }: { show: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const deltaX = e.clientX - centerX
      const deltaY = e.clientY - centerY

      const maxRotation = 35
      const rotateY = (deltaX / window.innerWidth) * maxRotation * 2
      const rotateX = -(deltaY / window.innerHeight) * maxRotation * 2

      setRotation({ x: rotateX, y: rotateY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  if (!show) return null

  return (
    <div
      ref={containerRef}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
      style={{ perspective: '500px' }}
    >
      <div
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: 'transform 0.1s ease-out',
          transformStyle: 'preserve-3d',
        }}
      >
        <Image
          src="/images/HedgeLogo3D.png"
          alt="Hedge Payments"
          width={48}
          height={48}
          className="w-10 h-10 sm:w-12 sm:h-12"
          style={{ filter: 'drop-shadow(0 4px 8px rgba(44, 36, 22, 0.25))' }}
        />
      </div>
    </div>
  )
}

// App Screenshot Carousel
function AppCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const screenshots = [
    { src: '/images/bankroll-dashboard.png', label: 'Dashboard' },
    { src: '/images/bankroll-pay-screen.png', label: 'Pay' },
    { src: '/images/coverpay-modal.png', label: 'CoverPay' },
  ]

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-56 sm:w-80 h-[440px] sm:h-[640px]">
        {screenshots.map((screenshot, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-300 ${
              index === activeIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D4A853]/30">
              <Image
                src={screenshot.src}
                alt={screenshot.label}
                width={320}
                height={640}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
      {/* Navigation dots */}
      <div className="flex items-center gap-3 mt-4">
        {screenshots.map((screenshot, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`transition-all ${
              index === activeIndex
                ? 'w-6 h-2 bg-[#D4A853] rounded-full'
                : 'w-2 h-2 bg-[#D4C5B0] rounded-full hover:bg-[#8B7E6E]'
            }`}
            aria-label={screenshot.label}
          />
        ))}
      </div>
      <p className="text-xs text-[#6B5D4F] mt-2" style={{ fontFamily: 'Georgia, serif' }}>
        {screenshots[activeIndex].label}
      </p>
    </div>
  )
}

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

    try {
      // Save to localStorage
      localStorage.setItem('deck_access_email', email)
      localStorage.setItem('deck_access_time', new Date().toISOString())

      // Call API to save to database and send email with Bankroll link
      await fetch('/api/deck-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      onAccess(email)
    } catch (err) {
      // Still grant access even if API fails
      onAccess(email)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-6" style={{ fontFamily: 'Georgia, serif' }}>
      <div className="max-w-md w-full text-center">
        <Logo3DSmall />

        <h1 className="text-4xl md:text-5xl text-[#2C2416] mb-4 tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
          Hedge Payments
        </h1>

        <p className="text-xl text-[#6B5D4F] mb-2" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
          Easy Money
        </p>

        <div className="w-16 h-px bg-[#D4C5B0] mx-auto mb-8"></div>

        <p className="text-[#6B5D4F] mb-8" style={{ fontFamily: 'Georgia, serif' }}>
          Enter your email to view our investor deck
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
          We'll only use your email to follow up about Hedge Payments
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
            <Logo3D />
            <h1 className="text-5xl md:text-7xl lg:text-8xl text-[#2C2416] mb-6 tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Hedge Payments
            </h1>
            <div className="w-16 h-px bg-[#D4C5B0] mb-6"></div>
            <p className="text-2xl md:text-3xl text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              Easy Money
            </p>
            <p className="text-xs text-[#B8A99A] mt-8" style={{ fontFamily: 'Georgia, serif' }}>
              Last updated: January 13, 2026
            </p>
          </div>
        )

      case 'problem':
        return (
          <div className="flex flex-col justify-start sm:justify-center h-full px-4 sm:px-8 md:px-16 lg:px-24 pt-20 pb-16 sm:py-8 overflow-y-auto bg-gradient-to-br from-[#2C2416] via-[#3D3225] to-[#2C2416]">
            <p className="text-xs sm:text-sm text-[#D4A853] tracking-widest uppercase mb-4 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              The Problem
            </p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-[#FAF8F5] mb-6 sm:mb-12 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Payments Cause Stress
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 max-w-5xl">
              <div className="p-6 sm:p-8 bg-black/20 border border-[#4A3D2F]">
                <p className="text-xs sm:text-sm text-[#D4A853] tracking-widest uppercase mb-3" style={{ fontFamily: 'Georgia, serif' }}>For Businesses</p>
                <h3 className="text-xl sm:text-2xl text-[#FAF8F5] mb-3" style={{ fontFamily: 'Georgia, serif' }}>Payments only matter when they fail</h3>
                <p className="text-sm sm:text-base text-[#D4C5B0] mb-4" style={{ fontFamily: 'Georgia, serif' }}>Lost sales, abandoned carts, angry customers. Every failed transaction is a headache that demands attention.</p>
                <div className="flex items-center gap-4 sm:gap-6 pt-3 border-t border-[#4A3D2F]">
                  <div className="h-6 flex items-center"><Image src="/logos/amazon.png" alt="Amazon" width={70} height={24} className="h-5 w-auto object-contain" style={{ filter: 'brightness(0) invert(1)', opacity: 0.6 }} /></div>
                  <div className="h-6 flex items-center"><Image src="/logos/etsy.png" alt="Etsy" width={50} height={24} className="h-5 w-auto object-contain" style={{ filter: 'brightness(0) invert(1)', opacity: 0.6 }} /></div>
                  <div className="h-6 flex items-center"><Image src="/logos/draftkings.png" alt="DraftKings" width={24} height={24} className="h-5 w-auto object-contain" style={{ filter: 'brightness(0) invert(1)', opacity: 0.6 }} /></div>
                  <div className="h-6 flex items-center"><Image src="/logos/coinbase.png" alt="Coinbase" width={80} height={24} className="h-4 w-auto object-contain" style={{ filter: 'brightness(0) invert(1)', opacity: 0.6 }} /></div>
                  <div className="h-6 flex items-center"><Image src="/logos/apple.png" alt="Apple" width={20} height={24} className="h-5 w-auto object-contain" style={{ filter: 'brightness(0) invert(1)', opacity: 0.6 }} /></div>
                </div>
              </div>
              <div className="p-6 sm:p-8 bg-[#FAF8F5]/10 border border-[#D4C5B0]/30">
                <p className="text-xs sm:text-sm text-[#D4A853] tracking-widest uppercase mb-3" style={{ fontFamily: 'Georgia, serif' }}>For Users</p>
                <h3 className="text-xl sm:text-2xl text-[#FAF8F5] mb-3" style={{ fontFamily: 'Georgia, serif' }}>Every transaction is a stress point</h3>
                <p className="text-sm sm:text-base text-[#D4C5B0]" style={{ fontFamily: 'Georgia, serif' }}>Watching money leave your account feels painful. The notification, the balance drop, the anxiety.</p>
              </div>
            </div>
            <div className="mt-6 sm:mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-5xl">
              <div className="p-4 sm:p-6 bg-[#D4A853]/10 border border-[#D4A853]/30">
                <p className="text-xs sm:text-sm text-[#D4A853] tracking-widest uppercase mb-2" style={{ fontFamily: 'Georgia, serif' }}>Business Cost</p>
                <p className="text-3xl sm:text-4xl text-[#D4A853] mb-2" style={{ fontFamily: 'Georgia, serif' }}>$117B+</p>
                <p className="text-sm text-[#D4C5B0]" style={{ fontFamily: 'Georgia, serif' }}>lost annually to chargebacks and failed payments. Every decline is revenue walking out the door.</p>
              </div>
              <div className="p-4 sm:p-6 bg-[#FAF8F5]/10 border border-[#D4C5B0]/30">
                <p className="text-xs sm:text-sm text-[#D4A853] tracking-widest uppercase mb-2" style={{ fontFamily: 'Georgia, serif' }}>Payment Choice Fracture</p>
                <p className="text-lg sm:text-xl text-[#FAF8F5] mb-2" style={{ fontFamily: 'Georgia, serif' }}>30 years ago: cash or check.</p>
                <p className="text-sm text-[#D4C5B0]" style={{ fontFamily: 'Georgia, serif' }}>Now: P2P apps, debit, credit, neobanks, BNPL, crypto wallets, self-banking. Payments fractured into a dozen confusing options.</p>
              </div>
            </div>
          </div>
        )

      case 'solution':
        return (
          <div className="flex flex-col justify-start sm:justify-center h-full px-4 sm:px-8 md:px-16 lg:px-24 pt-20 pb-16 sm:py-8 overflow-y-auto bg-gradient-to-tr from-[#FAF8F5] via-[#F5F0E8] to-[#EDE5D8]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center max-w-6xl">
              {/* Left side - Content */}
              <div className="lg:col-span-2">
                <p className="text-xs sm:text-sm text-[#D4A853] tracking-widest uppercase mb-4 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                  The Solution
                </p>
                <h2 className="text-3xl sm:text-4xl md:text-5xl text-[#2C2416] mb-2 sm:mb-4 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                  Hedge Payments: <span className="text-[#D4A853]">Easy Money</span>
                </h2>
                <p className="text-base sm:text-lg text-[#6B5D4F] mb-6 sm:mb-8 max-w-xl" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                  The goal: You forget you're even paying
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-6">
                  <div className="p-4 sm:p-6 bg-gradient-to-br from-[#2C2416] to-[#3D3225] shadow-xl">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] sm:text-xs text-[#D4A853] tracking-widest uppercase" style={{ fontFamily: 'Georgia, serif' }}>For Businesses</p>
                      <span className="text-[8px] sm:text-[10px] px-2 py-0.5 bg-[#D4A853]/20 text-[#D4A853] rounded-full border border-[#D4A853]/40">On-Chain</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Image src="/images/HedgeLogo3D.png" alt="Hedge Pay" width={32} height={32} className="w-8 h-8" />
                      <h3 className="text-lg sm:text-xl text-[#FAF8F5]" style={{ fontFamily: 'Georgia, serif' }}>Hedge Pay PSP</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-[#D4C5B0] mb-3" style={{ fontFamily: 'Georgia, serif' }}>Stablecoin-settled payments. Instant settlement, intelligent routing.</p>
                    <div className="pt-2 border-t border-[#4A3D2F] flex items-center justify-between">
                      <p className="text-[10px] text-[#D4C5B0]" style={{ fontFamily: 'Georgia, serif' }}>USDC · Multi-chain</p>
                      <div className="flex items-center gap-1">
                        <Image src="/logos/CoverPayLogo.png" alt="CoverPay" width={12} height={12} className="w-3 h-3" />
                        <span className="text-[8px] text-[#D4A853]">CoverPay inside</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6 bg-white shadow-xl border border-[#D4C5B0]">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] sm:text-xs text-[#D4A853] tracking-widest uppercase" style={{ fontFamily: 'Georgia, serif' }}>For Users</p>
                      <span className="text-[8px] sm:text-[10px] px-2 py-0.5 bg-[#2C2416]/10 text-[#2C2416] rounded-full border border-[#2C2416]/30">On-Chain</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Image src="/images/bankroll-icon-new.png" alt="Bankroll" width={32} height={32} className="w-8 h-8 rounded-lg" />
                      <h3 className="text-lg sm:text-xl text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Bankroll</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-[#6B5D4F] mb-3" style={{ fontFamily: 'Georgia, serif' }}>Seamless, invisible, stress-free. Spending without the anxiety.</p>
                    <div className="pt-2 border-t border-[#D4C5B0] flex items-center justify-between">
                      <p className="text-[10px] text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Stablecoin wallet · P2P</p>
                      <div className="flex items-center gap-1">
                        <Image src="/logos/CoverPayLogo.png" alt="CoverPay" width={12} height={12} className="w-3 h-3" />
                        <span className="text-[8px] text-[#D4A853]">CoverPay inside</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* CoverPay Innovation Layer */}
                <div className="p-3 sm:p-4 bg-gradient-to-r from-[#2C2416] to-[#3D3225] shadow-lg">
                  <div className="flex items-center gap-3">
                    <Image src="/logos/CoverPayLogo.png" alt="CoverPay" width={28} height={28} className="w-7 h-7" />
                    <div className="flex-1">
                      <p className="text-[10px] text-[#D4A853] tracking-widest uppercase mb-0.5" style={{ fontFamily: 'Georgia, serif' }}>New Payment Method</p>
                      <p className="text-xs sm:text-sm text-[#FAF8F5]" style={{ fontFamily: 'Georgia, serif' }}>
                        <span className="text-[#D4A853] font-semibold">CoverPay</span> — BNPL orchestration baked into both products.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Right side - App Carousel */}
              <div className="hidden lg:flex justify-end pr-4">
                <AppCarousel />
              </div>
            </div>
          </div>
        )

      case 'product-overview':
        return (
          <div className="flex flex-col justify-start sm:justify-center h-full px-4 sm:px-8 md:px-16 lg:px-24 pt-20 pb-16 sm:py-8 overflow-y-auto bg-gradient-to-tr from-[#FAF8F5] via-[#F5F0E8] to-[#EDE5D8]">
            <p className="text-xs sm:text-sm text-[#D4A853] tracking-widest uppercase mb-4 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              The Products
            </p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-[#2C2416] mb-4 sm:mb-8 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Complexity hidden, simplicity delivered
            </h2>
            <p className="text-base sm:text-xl text-[#6B5D4F] mb-8 sm:mb-12 max-w-2xl" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              Two products, one mission: make payments invisible
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl items-start">
              {/* CoverPay - Card */}
              <div className="p-5 sm:p-6 bg-[#2C2416]">
                <div className="flex items-center gap-3 mb-3">
                  <Image src="/logos/CoverPayLogo.png" alt="CoverPay" width={36} height={36} className="w-9 h-9" />
                  <h3 className="text-xl sm:text-2xl text-[#FAF8F5]" style={{ fontFamily: 'Georgia, serif' }}>CoverPay</h3>
                </div>
                <p className="text-[10px] sm:text-xs text-[#D4C5B0] tracking-widest uppercase mb-2">For Businesses</p>
                <p className="text-xs sm:text-sm text-[#FAF8F5] mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                  BNPL orchestration that makes checkout invisible. One API, zero failed payments.
                </p>
                <div className="pt-3 border-t border-[#4A3D2F]">
                  <p className="text-xs text-[#D4C5B0]" style={{ fontFamily: 'Georgia, serif' }}>We find the BNPL that says yes.</p>
                </div>
              </div>

              {/* CoverPay Hub with Rotating Logos */}
              <div className="flex flex-col items-center justify-center p-2">
                <p className="text-[10px] text-[#8B7E6E] tracking-widest uppercase mb-3" style={{ fontFamily: 'Georgia, serif' }}>Powered By</p>
                <div className="relative w-[180px] h-[180px] sm:w-[200px] sm:h-[200px]">
                  {/* Connecting circle */}
                  <div className="absolute inset-3 border-2 border-dashed border-[#D4C5B0] rounded-full opacity-50"></div>
                  {/* Center CoverPay logo */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 bg-[#2C2416] rounded-full flex items-center justify-center z-10 shadow-lg">
                    <Image src="/logos/CoverPayLogo.png" alt="CoverPay" width={40} height={40} className="w-9 h-9 sm:w-10 sm:h-10" />
                  </div>
                  {/* Rotating container for BNPL providers */}
                  <div className="absolute inset-0 animate-spin-slow">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-full shadow-md flex items-center justify-center p-1.5 animate-counter-spin">
                      <Image src="/logos/affirmLogo.avif" alt="Affirm" width={28} height={28} className="w-full h-full object-contain" />
                    </div>
                    <div className="absolute top-[15%] right-[3%] w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-full shadow-md flex items-center justify-center overflow-hidden animate-counter-spin">
                      <Image src="/logos/KlarnaLogo.jpeg" alt="Klarna" width={40} height={40} className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute bottom-[15%] right-[3%] w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-full shadow-md flex items-center justify-center overflow-hidden animate-counter-spin">
                      <Image src="/logos/afterPayLogo.jpg" alt="Afterpay" width={40} height={40} className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-full shadow-md flex items-center justify-center overflow-hidden animate-counter-spin">
                      <Image src="/logos/PayPalLogo.jpg" alt="PayPal" width={40} height={40} className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute bottom-[15%] left-[3%] w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-full shadow-md flex items-center justify-center p-1.5 animate-counter-spin">
                      <Image src="/logos/zipLogo.png" alt="Zip" width={28} height={28} className="w-full h-full object-contain" />
                    </div>
                    <div className="absolute top-[15%] left-[3%] w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-full shadow-md flex items-center justify-center p-1.5 animate-counter-spin">
                      <Image src="/logos/sezzleLogo.png" alt="Sezzle" width={28} height={28} className="w-full h-full object-contain" />
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-[#6B5D4F] mt-3 text-center" style={{ fontFamily: 'Georgia, serif' }}>One integration, all BNPL</p>
              </div>

              {/* Bankroll Hub with Rotating Logos */}
              <div className="flex flex-col items-center justify-center p-2">
                <p className="text-[10px] text-[#8B7E6E] tracking-widest uppercase mb-3" style={{ fontFamily: 'Georgia, serif' }}>Powered By</p>
                <div className="relative w-[180px] h-[180px] sm:w-[200px] sm:h-[200px]">
                  {/* Connecting circle */}
                  <div className="absolute inset-3 border-2 border-dashed border-[#1E3A5F]/30 rounded-full opacity-50"></div>
                  {/* Center Bankroll logo */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#1E3A5F] to-[#0A1628] rounded-full flex items-center justify-center z-10 shadow-lg border-2 border-[#F5B041]/30">
                    <Image src="/images/bankroll-icon-new.png" alt="Bankroll" width={40} height={40} className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg" />
                  </div>
                  {/* Rotating container for payment rails */}
                  <div className="absolute inset-0 animate-spin-slow">
                    {/* Top */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-full shadow-md flex items-center justify-center p-1 animate-counter-spin">
                      <Image src="/logos/stripe-new.png" alt="Stripe" width={28} height={28} className="w-full h-full object-contain" />
                    </div>
                    {/* Top-right */}
                    <div className="absolute top-[8%] right-[8%] w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-full shadow-md flex items-center justify-center p-1 animate-counter-spin">
                      <Image src="/logos/coinflow-new.jpg" alt="Coinflow" width={28} height={28} className="w-full h-full object-contain" />
                    </div>
                    {/* Right */}
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-full shadow-md flex items-center justify-center p-1 animate-counter-spin">
                      <Image src="/logos/usdc-new.png" alt="USDC" width={28} height={28} className="w-full h-full object-contain" />
                    </div>
                    {/* Bottom-right */}
                    <div className="absolute bottom-[8%] right-[8%] w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-full shadow-md flex items-center justify-center p-1 animate-counter-spin">
                      <Image src="/logos/metamask.webp" alt="MetaMask" width={28} height={28} className="w-full h-full object-contain" />
                    </div>
                    {/* Bottom */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-full shadow-md flex items-center justify-center p-1 animate-counter-spin">
                      <Image src="/logos/rain-new.jpeg" alt="Rain" width={28} height={28} className="w-full h-full object-contain" />
                    </div>
                    {/* Bottom-left */}
                    <div className="absolute bottom-[8%] left-[8%] w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-full shadow-md flex items-center justify-center p-1 animate-counter-spin">
                      <Image src="/logos/coinbase-new.webp" alt="Coinbase" width={28} height={28} className="w-full h-full object-contain" />
                    </div>
                    {/* Left */}
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 bg-[#2C2416] rounded-full shadow-md flex items-center justify-center p-1 animate-counter-spin">
                      <Image src="/logos/CoverPayLogo.png" alt="CoverPay" width={28} height={28} className="w-full h-full object-contain" />
                    </div>
                    {/* Top-left */}
                    <div className="absolute top-[8%] left-[8%] w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-full shadow-md flex items-center justify-center p-1 animate-counter-spin">
                      <Image src="/logos/edge-boost.png" alt="EdgeBoost" width={28} height={28} className="w-full h-full object-contain" />
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-[#6B5D4F] mt-3 text-center" style={{ fontFamily: 'Georgia, serif' }}>Multi-rail orchestration</p>
              </div>

              {/* Bankroll - Card */}
              <div className="p-5 sm:p-6 bg-white/50 border border-[#D4C5B0]">
                <div className="flex items-center gap-3 mb-3">
                  <Image src="/images/bankroll-icon-new.png" alt="Bankroll" width={36} height={36} className="w-9 h-9 rounded-lg" />
                  <h3 className="text-xl sm:text-2xl text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Bankroll</h3>
                </div>
                <p className="text-[10px] sm:text-xs text-[#8B7E6E] tracking-widest uppercase mb-2">For Users</p>
                <p className="text-xs sm:text-sm text-[#2C2416] mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                  Money that feels like cash. Seamless P2P, invisible transactions, zero payment anxiety.
                </p>
                <div className="pt-3 border-t border-[#D4C5B0]">
                  <p className="text-xs text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Users forget they're even spending</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'product-coverpay':
        return (
          <div className="flex flex-col justify-start sm:justify-center h-full px-4 sm:px-8 md:px-16 lg:px-24 pt-20 pb-16 sm:py-8 overflow-y-auto bg-gradient-to-br from-[#2C2416] via-[#3D3225] to-[#2C2416]">
            <p className="text-xs sm:text-sm text-[#D4A853] tracking-widest uppercase mb-4 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              CoverPay
            </p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl text-[#FAF8F5] mb-6 sm:mb-10 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              The invisible split
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12 items-center">
              <div className="space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-4 bg-[#D4A853]/20 border border-[#D4A853]/40">
                  <p className="text-xs text-[#D4A853] mb-1">THE MAGIC</p>
                  <p className="text-sm sm:text-base text-[#FAF8F5]" style={{ fontFamily: 'Georgia, serif' }}>User sees <span className="font-semibold text-[#D4A853]">one payment</span>. Behind the scenes, we orchestrate everything.</p>
                </div>
                <div className="p-3 sm:p-4 bg-[#FAF8F5]/10 border border-[#D4C5B0]/30">
                  <p className="text-xs text-[#D4A853] mb-1">STEP 1</p>
                  <p className="text-sm sm:text-base text-[#FAF8F5]" style={{ fontFamily: 'Georgia, serif' }}>User checks out for <span className="font-semibold text-[#D4A853]">$600</span></p>
                </div>
                <div className="p-3 sm:p-4 bg-[#FAF8F5]/10 border border-[#D4C5B0]/30">
                  <p className="text-xs text-[#D4A853] mb-1">STEP 2 (INVISIBLE)</p>
                  <p className="text-sm sm:text-base text-[#FAF8F5]" style={{ fontFamily: 'Georgia, serif' }}>CoverPay pre-checks: Klarna = $300, Affirm = $300</p>
                </div>
                <div className="p-3 sm:p-4 bg-[#FAF8F5]/10 border border-[#D4C5B0]/30">
                  <p className="text-xs text-[#D4A853] mb-1">STEP 3 (INVISIBLE)</p>
                  <p className="text-sm sm:text-base text-[#FAF8F5]" style={{ fontFamily: 'Georgia, serif' }}>Auto-splits across providers in milliseconds</p>
                </div>
                <div className="p-3 sm:p-4 bg-[#D4A853]/20 border border-[#D4A853]/40">
                  <p className="text-xs text-[#D4A853] mb-1">USER EXPERIENCE</p>
                  <p className="text-sm sm:text-base text-[#FAF8F5]" style={{ fontFamily: 'Georgia, serif' }}>"Payment approved" — <span className="font-semibold text-[#D4A853]">that's all they see</span></p>
                </div>
              </div>
              <div className="bg-black/30 border border-[#D4A853]/30 rounded-2xl p-6 sm:p-8 flex items-center justify-center min-h-[200px] sm:min-h-[400px] shadow-xl">
                <div className="flex flex-col items-center w-full">
                  <div className="text-4xl sm:text-5xl text-[#D4A853] mb-4 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>$600</div>
                  <div className="text-[#D4C5B0] text-sm mb-4">invisibly becomes</div>
                  <div className="flex items-center gap-4 sm:gap-8 mb-6">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-[#FAF8F5] flex items-center justify-center mb-2 p-2">
                        <Image src="/logos/KlarnaLogo.jpeg" alt="Klarna" width={60} height={40} className="w-full h-auto" />
                      </div>
                      <span className="text-[#D4A853] text-lg sm:text-xl font-semibold" style={{ fontFamily: 'Georgia, serif' }}>$300</span>
                    </div>
                    <div className="text-[#D4A853] text-2xl">+</div>
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-[#FAF8F5] flex items-center justify-center mb-2 p-2">
                        <Image src="/logos/affirmLogo.avif" alt="Affirm" width={60} height={40} className="w-full h-auto" />
                      </div>
                      <span className="text-[#D4A853] text-lg sm:text-xl font-semibold" style={{ fontFamily: 'Georgia, serif' }}>$300</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-[#D4C5B0] text-sm mb-2">User never knows. Merchant doesn't care.</p>
                    <p className="text-[#D4A853] text-lg font-semibold" style={{ fontFamily: 'Georgia, serif' }}>Payment just works.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'product-bankroll':
        return (
          <div className="flex flex-col justify-start sm:justify-center h-full px-4 sm:px-8 md:px-16 lg:px-24 pt-20 pb-16 sm:py-8 overflow-y-auto bg-gradient-to-br from-[#0A1628] via-[#1E3A5F] to-[#0A1628]">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <p className="text-xs sm:text-sm text-[#F5B041] tracking-widest uppercase" style={{ fontFamily: 'Georgia, serif' }}>
                Bankroll Infrastructure
              </p>
              <span className="text-[10px] px-2 py-1 bg-[#F5B041]/20 text-[#F5B041] rounded-full border border-[#F5B041]/40">On-Chain · USDC</span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl text-[#FAF8F5] mb-4 sm:mb-6 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              One app, <span className="text-[#F5B041]">infinite rails</span>
            </h2>
            <p className="text-base sm:text-lg text-[#B8C5D6] mb-6 sm:mb-8 max-w-xl" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              Bankroll orchestrates the best payment path automatically
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 max-w-5xl items-center">
              {/* Orbital Visual */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-[300px] h-[300px] sm:w-[360px] sm:h-[360px]">
                  {/* Outer ring track */}
                  <div className="absolute inset-0 border-2 border-dashed border-[#F5B041]/20 rounded-full"></div>
                  {/* Inner ring track */}
                  <div className="absolute inset-12 sm:inset-14 border-2 border-dashed border-[#F5B041]/30 rounded-full"></div>

                  {/* Center Bankroll logo */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#1E3A5F] to-[#0A1628] rounded-full flex items-center justify-center z-20 shadow-xl border-2 border-[#F5B041]/50">
                    <Image src="/images/bankroll-icon-new.png" alt="Bankroll" width={64} height={64} className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl" />
                  </div>

                  {/* Inner rotating ring - Primary partners */}
                  <div className="absolute inset-12 sm:inset-14 animate-spin-slow">
                    {/* Hedge Payments - top */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-11 h-11 sm:w-12 sm:h-12 bg-[#FAF8F5] rounded-full shadow-lg flex items-center justify-center p-1.5 animate-counter-spin">
                      <Image src="/images/HedgeLogo3D.png" alt="Hedge" width={36} height={36} className="w-full h-full object-contain" />
                    </div>
                    {/* Stripe - top right */}
                    <div className="absolute top-[12%] right-[2%] w-11 h-11 sm:w-12 sm:h-12 bg-[#FAF8F5] rounded-full shadow-lg flex items-center justify-center p-2 animate-counter-spin">
                      <Image src="/logos/stripe-new.png" alt="Stripe" width={32} height={32} className="w-full h-full object-contain" />
                    </div>
                    {/* Coinflow - bottom right */}
                    <div className="absolute bottom-[12%] right-[2%] w-11 h-11 sm:w-12 sm:h-12 bg-[#FAF8F5] rounded-full shadow-lg flex items-center justify-center p-1.5 animate-counter-spin">
                      <Image src="/logos/coinflow-new.jpg" alt="Coinflow" width={36} height={36} className="w-full h-full object-contain" />
                    </div>
                    {/* USDC - bottom */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-11 h-11 sm:w-12 sm:h-12 bg-[#FAF8F5] rounded-full shadow-lg flex items-center justify-center overflow-hidden animate-counter-spin">
                      <Image src="/logos/usdc-new.png" alt="USDC" width={48} height={48} className="w-full h-full object-contain" />
                    </div>
                    {/* Rain - bottom left */}
                    <div className="absolute bottom-[12%] left-[2%] w-11 h-11 sm:w-12 sm:h-12 bg-[#FAF8F5] rounded-full shadow-lg flex items-center justify-center p-1.5 animate-counter-spin">
                      <Image src="/logos/rain-new.jpeg" alt="Rain" width={36} height={36} className="w-full h-full object-contain" />
                    </div>
                    {/* CoverPay - top left */}
                    <div className="absolute top-[12%] left-[2%] w-11 h-11 sm:w-12 sm:h-12 bg-[#2C2416] rounded-full shadow-lg flex items-center justify-center p-1.5 animate-counter-spin">
                      <Image src="/logos/CoverPayLogo.png" alt="CoverPay" width={36} height={36} className="w-full h-full object-contain" />
                    </div>
                  </div>

                  {/* Outer rotating ring - Redundancy partners */}
                  <div className="absolute inset-0 animate-spin-slower">
                    {/* Edge Boost - top */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 sm:w-11 sm:h-11 bg-[#FAF8F5] rounded-full shadow-md flex items-center justify-center p-1.5 animate-counter-spin-slow">
                      <Image src="/logos/edge-boost.png" alt="EDGE" width={32} height={32} className="w-full h-full object-contain" />
                    </div>
                    {/* Venmo - bottom right */}
                    <div className="absolute bottom-[20%] right-[5%] w-10 h-10 sm:w-11 sm:h-11 bg-[#FAF8F5] rounded-full shadow-md flex items-center justify-center p-1.5 animate-counter-spin-slow">
                      <Image src="/logos/venmo.svg" alt="Venmo" width={32} height={32} className="w-full h-full object-contain" />
                    </div>
                    {/* Braintree - bottom left */}
                    <div className="absolute bottom-[20%] left-[5%] w-10 h-10 sm:w-11 sm:h-11 bg-[#FAF8F5] rounded-full shadow-md flex items-center justify-center p-1.5 animate-counter-spin-slow">
                      <Image src="/logos/braintree.svg" alt="Braintree" width={32} height={32} className="w-full h-full object-contain" />
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-xs text-[#B8C5D6]" style={{ fontFamily: 'Georgia, serif' }}>Inner: Core rails · Outer: Redundancy</p>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <div className="p-4 bg-[#F5B041]/10 border border-[#F5B041]/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🔗</span>
                    <h3 className="text-lg text-[#FAF8F5]" style={{ fontFamily: 'Georgia, serif' }}>Multi-Rail Orchestration</h3>
                  </div>
                  <p className="text-sm text-[#B8C5D6]" style={{ fontFamily: 'Georgia, serif' }}>Stripe, Coinflow, Rain — we route to the optimal path automatically</p>
                </div>
                <div className="p-4 bg-[#FAF8F5]/10 border border-[#FAF8F5]/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">💎</span>
                    <h3 className="text-lg text-[#FAF8F5]" style={{ fontFamily: 'Georgia, serif' }}>USDC Settlement</h3>
                  </div>
                  <p className="text-sm text-[#B8C5D6]" style={{ fontFamily: 'Georgia, serif' }}>Stablecoin-native. Instant, borderless, always liquid.</p>
                </div>
                <div className="p-4 bg-[#FAF8F5]/10 border border-[#FAF8F5]/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🛡️</span>
                    <h3 className="text-lg text-[#FAF8F5]" style={{ fontFamily: 'Georgia, serif' }}>Built-in Redundancy</h3>
                  </div>
                  <p className="text-sm text-[#B8C5D6]" style={{ fontFamily: 'Georgia, serif' }}>Venmo, Braintree, EDGE Boost as fallbacks. Never miss a payment.</p>
                </div>
                <a
                  href="https://bankroll.live"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-[#F5B041] hover:text-[#FAF8F5] transition-colors mt-2"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Try Bankroll → bankroll.live
                </a>
              </div>
            </div>
          </div>
        )

      case 'market':
        return (
          <div className="flex flex-col justify-start sm:justify-center h-full px-4 sm:px-8 md:px-16 lg:px-24 pt-20 pb-16 sm:py-8 overflow-y-auto bg-gradient-to-bl from-[#FAF8F5] via-[#F0EBE0] to-[#E8E0D0]">
            <p className="text-xs sm:text-sm text-[#D4A853] tracking-widest uppercase mb-4 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              The Opportunity
            </p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-[#2C2416] mb-4 sm:mb-8 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Make Payments a forgotten stress
            </h2>
            <p className="text-base sm:text-xl text-[#6B5D4F] mb-6 sm:mb-12 max-w-3xl" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              The best payment is one you don't think about
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mb-8">
              <div className="p-5 sm:p-6 bg-gradient-to-br from-[#2C2416] to-[#3D3225] shadow-lg">
                <p className="text-3xl sm:text-4xl text-[#D4A853] mb-2" style={{ fontFamily: 'Georgia, serif' }}>$2.8T</p>
                <p className="text-sm text-[#D4C5B0]" style={{ fontFamily: 'Georgia, serif' }}>flows through payment rails that add friction instead of removing it</p>
              </div>
              <div className="p-5 sm:p-6 bg-white shadow-lg border border-[#D4C5B0]">
                <p className="text-3xl sm:text-4xl text-[#D4A853] mb-2" style={{ fontFamily: 'Georgia, serif' }}>73%</p>
                <p className="text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>of Gen Z report financial anxiety around digital transactions</p>
              </div>
              <div className="p-5 sm:p-6 bg-white shadow-lg border border-[#D4C5B0]">
                <p className="text-3xl sm:text-4xl text-[#D4A853] mb-2" style={{ fontFamily: 'Georgia, serif' }}>$145B</p>
                <p className="text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>in purchases declined annually — friction that shouldn't exist</p>
              </div>
            </div>
            <div className="p-5 sm:p-8 bg-gradient-to-r from-[#2C2416] to-[#3D3225] max-w-4xl shadow-xl">
              <p className="text-xs sm:text-sm text-[#D4A853] tracking-widest uppercase mb-3" style={{ fontFamily: 'Georgia, serif' }}>The Shift</p>
              <p className="text-lg sm:text-2xl text-[#FAF8F5] mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                Gen Z & Millennials want money to feel effortless, not anxiety-inducing
              </p>
              <p className="text-sm sm:text-base text-[#D4C5B0]" style={{ fontFamily: 'Georgia, serif' }}>
                They're choosing BNPL over credit cards, cash apps over banks, anything that makes spending feel less like losing.
              </p>
            </div>
          </div>
        )

      case 'business-model':
        return (
          <div className="flex flex-col justify-start sm:justify-center h-full px-4 sm:px-8 md:px-16 lg:px-24 pt-20 pb-16 sm:py-8 overflow-y-auto bg-gradient-to-tr from-[#FAF8F5] via-[#F5F0E8] to-[#EDE5D8]">
            <p className="text-xs sm:text-sm text-[#D4A853] tracking-widest uppercase mb-4 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Business Model
            </p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl text-[#2C2416] mb-6 sm:mb-12 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Simple, scalable revenue
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl">
              <div className="bg-gradient-to-br from-[#2C2416] to-[#3D3225] p-6 sm:p-8 shadow-lg">
                <h3 className="text-base sm:text-xl text-[#FAF8F5] mb-2 sm:mb-3" style={{ fontFamily: 'Georgia, serif' }}>Hedge PSP</h3>
                <p className="text-3xl sm:text-4xl text-[#D4A853] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>1%</p>
                <p className="text-[#D4C5B0] text-xs sm:text-sm" style={{ fontFamily: 'Georgia, serif' }}>of all processed payment volume</p>
              </div>
              <div className="bg-gradient-to-br from-[#2C2416] to-[#3D3225] p-6 sm:p-8 shadow-lg">
                <h3 className="text-base sm:text-xl text-[#FAF8F5] mb-2 sm:mb-3" style={{ fontFamily: 'Georgia, serif' }}>CoverPay</h3>
                <p className="text-3xl sm:text-4xl text-[#D4A853] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>2.5%</p>
                <p className="text-[#D4C5B0] text-xs sm:text-sm" style={{ fontFamily: 'Georgia, serif' }}>of BNPL orchestration volume</p>
              </div>
            </div>
            <div className="mt-4 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
              <div className="p-4 sm:p-5 bg-white border border-[#D4C5B0] shadow-md">
                <p className="text-xs text-[#D4A853] mb-2">Example: Hedge PSP</p>
                <p className="text-sm sm:text-base text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>
                  $10,000 payment volume → <span className="font-semibold text-[#D4A853]">$100 revenue</span>
                </p>
              </div>
              <div className="p-4 sm:p-5 bg-gradient-to-r from-[#2C2416] to-[#3D3225] shadow-md">
                <p className="text-xs text-[#D4A853] mb-2">Example: CoverPay</p>
                <p className="text-sm sm:text-base text-[#FAF8F5]" style={{ fontFamily: 'Georgia, serif' }}>
                  $10,000 BNPL volume → <span className="font-semibold text-[#D4A853]">$250 revenue</span>
                </p>
              </div>
            </div>
          </div>
        )

      case 'competition':
        return (
          <div className="flex flex-col justify-start sm:justify-center h-full px-4 sm:px-8 md:px-16 lg:px-24 pt-20 pb-16 sm:py-8 overflow-y-auto bg-gradient-to-br from-[#2C2416] via-[#3D3225] to-[#2C2416]">
            <p className="text-xs sm:text-sm text-[#D4A853] tracking-widest uppercase mb-4 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Competition
            </p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl text-[#FAF8F5] mb-4 sm:mb-8 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              They compete. <span className="text-[#D4A853]">We orchestrate.</span>
            </h2>
            <p className="text-base sm:text-lg text-[#D4C5B0] mb-6 sm:mb-10 max-w-2xl" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              BNPL providers fight for exclusive deals. We make them all work together.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl">
              {/* CoverPay Competition */}
              <div className="bg-[#FAF8F5]/5 border border-[#D4C5B0]/30 p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Image src="/logos/CoverPayLogo.png" alt="CoverPay" width={28} height={28} className="w-7 h-7" />
                  <h3 className="text-lg sm:text-xl text-[#FAF8F5]" style={{ fontFamily: 'Georgia, serif' }}>CoverPay vs BNPL Providers</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex gap-1 mt-1 flex-shrink-0">
                      <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center">
                        <Image src="/logos/affirmLogo.avif" alt="Affirm" width={16} height={16} className="w-4 h-4" />
                      </div>
                      <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center overflow-hidden">
                        <Image src="/logos/KlarnaLogo.jpeg" alt="Klarna" width={24} height={24} className="w-full h-full object-cover" />
                      </div>
                      <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center overflow-hidden">
                        <Image src="/logos/afterPayLogo.jpg" alt="Afterpay" width={24} height={24} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-[#FAF8F5]" style={{ fontFamily: 'Georgia, serif' }}>Single provider = single approval criteria</p>
                      <p className="text-xs text-[#8B7E6E]">User denied? Sale lost. No fallback.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-[86px] flex-shrink-0 flex items-center justify-center">
                      <div className="w-8 h-8 rounded bg-[#D4A853]/20 border border-[#D4A853]/40 flex items-center justify-center">
                        <Image src="/logos/CoverPayLogo.png" alt="CoverPay" width={20} height={20} className="w-5 h-5" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-[#D4A853] font-semibold" style={{ fontFamily: 'Georgia, serif' }}>CoverPay: Orchestrate all providers</p>
                      <p className="text-xs text-[#D4C5B0]">Denied by Klarna? Route to Affirm. Still denied? Split across both. We find the yes.</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-[#D4C5B0]/20">
                  <p className="text-xs text-[#D4A853] mb-2">THE MOAT</p>
                  <p className="text-sm text-[#D4C5B0]" style={{ fontFamily: 'Georgia, serif' }}>
                    <span className="text-[#D4A853]">Distribution advantage.</span> FraternityBase gives us 750K+ captive users. Network effects spread adoption organically. We own the relationship.
                  </p>
                </div>
              </div>

              {/* Bankroll Competition */}
              <div className="bg-[#FAF8F5]/5 border border-[#D4C5B0]/30 p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Image src="/images/bankroll-icon-new.png" alt="Bankroll" width={28} height={28} className="w-7 h-7 rounded-lg" />
                  <h3 className="text-lg sm:text-xl text-[#FAF8F5]" style={{ fontFamily: 'Georgia, serif' }}>Bankroll vs P2P & Neobanks</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-[#D4C5B0]/30">
                        <th className="text-left py-2 text-[#8B7E6E] font-normal"></th>
                        <th className="text-center py-2 px-2 text-[#8B7E6E] font-normal">P2P</th>
                        <th className="text-center py-2 px-2 text-[#8B7E6E] font-normal">BNPL</th>
                        <th className="text-center py-2 px-2 text-[#8B7E6E] font-normal">On-Chain</th>
                      </tr>
                    </thead>
                    <tbody style={{ fontFamily: 'Georgia, serif' }}>
                      <tr className="border-b border-[#D4C5B0]/20">
                        <td className="py-2 text-[#D4C5B0]">Venmo / Cash App</td>
                        <td className="text-center py-2 text-[#D4A853]">✓</td>
                        <td className="text-center py-2 text-[#6B5D4F]">✗</td>
                        <td className="text-center py-2 text-[#6B5D4F]">✗</td>
                      </tr>
                      <tr className="border-b border-[#D4C5B0]/20">
                        <td className="py-2 text-[#D4C5B0]">Apple Pay Later</td>
                        <td className="text-center py-2 text-[#6B5D4F]">✗</td>
                        <td className="text-center py-2 text-[#D4A853]">✓</td>
                        <td className="text-center py-2 text-[#6B5D4F]">✗</td>
                      </tr>
                      <tr className="border-b border-[#D4C5B0]/20">
                        <td className="py-2 text-[#D4C5B0]">Chime / Current</td>
                        <td className="text-center py-2 text-[#D4A853]">✓</td>
                        <td className="text-center py-2 text-[#6B5D4F]">✗</td>
                        <td className="text-center py-2 text-[#6B5D4F]">✗</td>
                      </tr>
                      <tr className="border-b border-[#D4C5B0]/20">
                        <td className="py-2 text-[#D4C5B0]">Coinbase / Phantom</td>
                        <td className="text-center py-2 text-[#D4A853]">✓</td>
                        <td className="text-center py-2 text-[#6B5D4F]">✗</td>
                        <td className="text-center py-2 text-[#D4A853]">✓</td>
                      </tr>
                      <tr className="bg-[#D4A853]/10">
                        <td className="py-2 text-[#D4A853] font-semibold">Bankroll</td>
                        <td className="text-center py-2 text-[#D4A853]">✓</td>
                        <td className="text-center py-2 text-[#D4A853]">✓</td>
                        <td className="text-center py-2 text-[#D4A853]">✓</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 pt-4 border-t border-[#D4C5B0]/20">
                  <p className="text-xs text-[#D4A853] mb-2">THE MOAT</p>
                  <p className="text-sm text-[#D4C5B0]" style={{ fontFamily: 'Georgia, serif' }}>
                    <span className="text-[#D4A853]">Distribution advantage.</span> Affiliate partnerships turn user acquisition into profit. Each user brings their network. We grow while getting paid.
                  </p>
                </div>
              </div>
            </div>

            {/* Why We Win - Businesses */}
            <div className="mt-6 sm:mt-8 p-4 sm:p-5 bg-[#D4A853]/10 border border-[#D4A853]/30 max-w-6xl">
              <p className="text-xs text-[#D4A853] tracking-widest uppercase mb-2" style={{ fontFamily: 'Georgia, serif' }}>Why Businesses Choose Us</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-[#FAF8F5] font-semibold" style={{ fontFamily: 'Georgia, serif' }}>Network Effects</p>
                  <p className="text-xs text-[#D4C5B0]">More BNPL partners = higher approval rates = more merchants = more partners</p>
                </div>
                <div>
                  <p className="text-sm text-[#FAF8F5] font-semibold" style={{ fontFamily: 'Georgia, serif' }}>Data Advantage</p>
                  <p className="text-xs text-[#D4C5B0]">We see approval patterns across ALL providers — no single BNPL has this view</p>
                </div>
                <div>
                  <p className="text-sm text-[#FAF8F5] font-semibold" style={{ fontFamily: 'Georgia, serif' }}>Switching Cost</p>
                  <p className="text-xs text-[#D4C5B0]">Once merchants integrate CoverPay, why manage 6 separate BNPL APIs again?</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'competition-users':
        return (
          <div className="flex flex-col justify-start sm:justify-center h-full px-4 sm:px-8 md:px-16 lg:px-24 pt-20 pb-16 sm:py-8 overflow-y-auto bg-gradient-to-br from-[#2C2416] via-[#3D3225] to-[#2C2416]">
            <p className="text-xs sm:text-sm text-[#D4A853] tracking-widest uppercase mb-4 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Competition
            </p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl text-[#FAF8F5] mb-4 sm:mb-8 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              They move money. <span className="text-[#D4A853]">We remove anxiety.</span>
            </h2>
            <p className="text-base sm:text-lg text-[#D4C5B0] mb-6 sm:mb-10 max-w-2xl" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              P2P apps make transfers easy. Bankroll makes them stress-free.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl">
              {/* Bankroll vs Venmo/Cash App */}
              <div className="bg-[#FAF8F5]/5 border border-[#D4C5B0]/30 p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Image src="/images/bankroll-icon-new.png" alt="Bankroll" width={28} height={28} className="w-7 h-7 rounded-lg" />
                  <h3 className="text-lg sm:text-xl text-[#FAF8F5]" style={{ fontFamily: 'Georgia, serif' }}>vs Venmo & Cash App</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">💸</span>
                    </div>
                    <div>
                      <p className="text-sm text-[#8B7E6E]" style={{ fontFamily: 'Georgia, serif' }}>Venmo / Cash App</p>
                      <p className="text-xs text-[#6B5D4F]">Owe your friend $50? Pay now or awkwardly delay. No flexibility.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-[#D4A853]/20 border border-[#D4A853]/40 flex items-center justify-center flex-shrink-0">
                      <Image src="/images/bankroll-icon-new.png" alt="Bankroll" width={20} height={20} className="w-5 h-5 rounded" />
                    </div>
                    <div>
                      <p className="text-sm text-[#D4A853] font-semibold" style={{ fontFamily: 'Georgia, serif' }}>Bankroll</p>
                      <p className="text-xs text-[#D4C5B0]"><span className="text-[#D4A853]">Pay your friend back immediately.</span> They get $50 now. You pay $12.50/week. Everyone wins.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bankroll vs Neobanks */}
              <div className="bg-[#FAF8F5]/5 border border-[#D4C5B0]/30 p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Image src="/images/bankroll-icon-new.png" alt="Bankroll" width={28} height={28} className="w-7 h-7 rounded-lg" />
                  <h3 className="text-lg sm:text-xl text-[#FAF8F5]" style={{ fontFamily: 'Georgia, serif' }}>vs Neobanks & Crypto</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">🏦</span>
                    </div>
                    <div>
                      <p className="text-sm text-[#8B7E6E]" style={{ fontFamily: 'Georgia, serif' }}>Chime / Current</p>
                      <p className="text-xs text-[#6B5D4F]">Great for banking. No BNPL. No stablecoin settlement. Traditional rails = slow.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">🪙</span>
                    </div>
                    <div>
                      <p className="text-sm text-[#8B7E6E]" style={{ fontFamily: 'Georgia, serif' }}>Coinbase / Phantom</p>
                      <p className="text-xs text-[#6B5D4F]">On-chain, but no credit. Can't "send now, pay later." Complex for normies.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-[#D4A853]/20 border border-[#D4A853]/40 flex items-center justify-center flex-shrink-0">
                      <Image src="/images/bankroll-icon-new.png" alt="Bankroll" width={20} height={20} className="w-5 h-5 rounded" />
                    </div>
                    <div>
                      <p className="text-sm text-[#D4A853] font-semibold" style={{ fontFamily: 'Georgia, serif' }}>Bankroll</p>
                      <p className="text-xs text-[#D4C5B0]">On-chain simplicity + CoverPay credit. <span className="text-[#D4A853]">Crypto rails, consumer UX.</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Users Choose Us */}
            <div className="mt-6 sm:mt-8 p-4 sm:p-5 bg-[#D4A853]/10 border border-[#D4A853]/30 max-w-6xl">
              <p className="text-xs text-[#D4A853] tracking-widest uppercase mb-2" style={{ fontFamily: 'Georgia, serif' }}>Why Users Choose Us</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-[#FAF8F5] font-semibold" style={{ fontFamily: 'Georgia, serif' }}>Zero Payment Anxiety</p>
                  <p className="text-xs text-[#D4C5B0]">Split any P2P payment into installments. Send money without the "I'm broke now" feeling.</p>
                </div>
                <div>
                  <p className="text-sm text-[#FAF8F5] font-semibold" style={{ fontFamily: 'Georgia, serif' }}>Instant for Recipients</p>
                  <p className="text-xs text-[#D4C5B0]">Your friend gets paid immediately. They don't wait for your installments to clear.</p>
                </div>
                <div>
                  <p className="text-sm text-[#FAF8F5] font-semibold" style={{ fontFamily: 'Georgia, serif' }}>One App, All Rails</p>
                  <p className="text-xs text-[#D4C5B0]">USDC, bank transfer, or card — we route through the cheapest, fastest option automatically.</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'traction':
        return (
          <div className="flex flex-col justify-start sm:justify-center h-full px-4 sm:px-8 md:px-16 lg:px-24 pt-20 pb-16 sm:py-8 overflow-y-auto bg-gradient-to-bl from-[#FAF8F5] via-[#F0EBE0] to-[#E8E0D0]">
            <p className="text-xs sm:text-sm text-[#D4A853] tracking-widest uppercase mb-4 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>
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
                <div className="p-3 sm:p-6 bg-gradient-to-br from-[#2C2416] to-[#3D3225] shadow-lg">
                  <p className="text-2xl sm:text-5xl text-[#D4A853] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>6</p>
                  <p className="text-xs sm:text-base text-[#D4C5B0]" style={{ fontFamily: 'Georgia, serif' }}>BNPL Providers</p>
                </div>
                <div className="p-3 sm:p-6 bg-white border border-[#D4C5B0] shadow-lg">
                  <p className="text-2xl sm:text-5xl text-[#D4A853] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>2</p>
                  <p className="text-xs sm:text-base text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Routing strategies</p>
                </div>
                <div className="p-3 sm:p-6 bg-white border border-[#D4C5B0] shadow-lg">
                  <p className="text-2xl sm:text-5xl text-[#D4A853] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>Live</p>
                  <p className="text-xs sm:text-base text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>REST API</p>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-6">
                <div className="p-3 sm:p-6 bg-gradient-to-r from-[#2C2416] to-[#3D3225] shadow-lg">
                  <p className="text-xs sm:text-sm text-[#D4A853] mb-2">Waterfall Strategy</p>
                  <p className="text-sm sm:text-base text-[#FAF8F5]" style={{ fontFamily: 'Georgia, serif' }}>
                    Routes through providers sequentially until approval — maximizes success rate
                  </p>
                </div>
                <div className="p-3 sm:p-6 bg-gradient-to-r from-[#2C2416] to-[#3D3225] shadow-lg">
                  <p className="text-xs sm:text-sm text-[#D4A853] mb-2">Split Strategy</p>
                  <p className="text-sm sm:text-base text-[#FAF8F5]" style={{ fontFamily: 'Georgia, serif' }}>
                    Divides payment across 2 providers when partial approvals occur — unlocks larger purchases
                  </p>
                </div>
                <div className="p-3 sm:p-6 bg-white border border-[#D4C5B0] shadow-lg">
                  <p className="text-xs sm:text-sm text-[#D4A853] mb-3">Integrated Providers</p>
                  <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                    <Image src="/logos/KlarnaLogo.jpeg" alt="Klarna" width={60} height={24} className="h-6 sm:h-8 w-auto" />
                    <Image src="/logos/affirmLogo.avif" alt="Affirm" width={60} height={24} className="h-6 sm:h-8 w-auto" />
                    <Image src="/logos/afterPayLogo.jpg" alt="Afterpay" width={60} height={24} className="h-6 sm:h-8 w-auto" />
                    <Image src="/logos/sezzleLogo.png" alt="Sezzle" width={60} height={24} className="h-6 sm:h-8 w-auto" />
                    <Image src="/logos/zipLogo.png" alt="Zip" width={60} height={24} className="h-6 sm:h-8 w-auto" />
                    <Image src="/logos/PayPalLogo.jpg" alt="PayPal" width={60} height={24} className="h-6 sm:h-8 w-auto" />
                  </div>
                </div>
              </div>
            </div>
            <a
              href="https://hedgepayments.com/coverpay"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 sm:mt-6 text-xs sm:text-sm text-[#D4A853] hover:text-[#2C2416] transition-colors"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              See CoverPay Demo →
            </a>
          </div>
        )

      case 'vision':
        return (
          <div className="flex flex-col justify-start sm:justify-center h-full px-4 sm:px-8 md:px-16 lg:px-24 pt-20 pb-16 sm:py-8 overflow-y-auto bg-gradient-to-bl from-[#FAF8F5] via-[#F0EBE0] to-[#E8E0D0]">
            <p className="text-xs sm:text-sm text-[#D4A853] tracking-widest uppercase mb-4 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              The Vision
            </p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl text-[#2C2416] mb-4 sm:mb-8 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              The Stripe for BNPL
            </h2>
            <p className="text-sm sm:text-xl text-[#6B5D4F] mb-6 sm:mb-12 max-w-2xl" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              One API to rule all BNPL providers — merchants integrate once, we optimize forever
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl">
              <div className="p-4 sm:p-6 bg-gradient-to-br from-[#2C2416] to-[#3D3225] text-[#FAF8F5] shadow-xl">
                <p className="text-xs tracking-widest uppercase mb-2 sm:mb-4 text-[#D4A853]">Now</p>
                <h3 className="text-base sm:text-xl mb-2 sm:mb-3" style={{ fontFamily: 'Georgia, serif' }}>E-Commerce</h3>
                <p className="text-xs sm:text-sm text-[#D4C5B0]" style={{ fontFamily: 'Georgia, serif' }}>DTC brands, high-AOV merchants losing sales to BNPL declines</p>
                <p className="text-xl sm:text-2xl text-[#D4A853] mt-2 sm:mt-4" style={{ fontFamily: 'Georgia, serif' }}>$25B</p>
              </div>
              <div className="p-4 sm:p-6 bg-white shadow-lg border border-[#D4C5B0]">
                <p className="text-xs tracking-widest uppercase mb-2 sm:mb-4 text-[#D4A853]">Next</p>
                <h3 className="text-base sm:text-xl text-[#2C2416] mb-2 sm:mb-3" style={{ fontFamily: 'Georgia, serif' }}>Travel & Services</h3>
                <p className="text-xs sm:text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Flights, hotels, healthcare — high-ticket services need flexibility</p>
                <p className="text-xl sm:text-2xl text-[#D4A853] mt-2 sm:mt-4" style={{ fontFamily: 'Georgia, serif' }}>$50B+</p>
              </div>
              <div className="p-4 sm:p-6 bg-white shadow-lg border border-[#D4C5B0]">
                <p className="text-xs tracking-widest uppercase mb-2 sm:mb-4 text-[#D4A853]">Expand</p>
                <h3 className="text-base sm:text-xl text-[#2C2416] mb-2 sm:mb-3" style={{ fontFamily: 'Georgia, serif' }}>B2B Payments</h3>
                <p className="text-xs sm:text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Net-30/60/90 terms orchestrated across lending providers</p>
                <p className="text-xl sm:text-2xl text-[#D4A853] mt-2 sm:mt-4" style={{ fontFamily: 'Georgia, serif' }}>$200B+</p>
              </div>
              <div className="p-4 sm:p-6 bg-white shadow-lg border border-[#D4C5B0]">
                <p className="text-xs tracking-widest uppercase mb-2 sm:mb-4 text-[#D4A853]">Future</p>
                <h3 className="text-base sm:text-xl text-[#2C2416] mb-2 sm:mb-3" style={{ fontFamily: 'Georgia, serif' }}>Global BNPL</h3>
                <p className="text-xs sm:text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Unified checkout across all markets, all providers, all currencies</p>
                <p className="text-xl sm:text-2xl text-[#D4A853] mt-2 sm:mt-4" style={{ fontFamily: 'Georgia, serif' }}>$500B+</p>
              </div>
            </div>
            <p className="text-sm sm:text-base text-[#6B5D4F] mt-4 sm:mt-8 max-w-2xl" style={{ fontFamily: 'Georgia, serif' }}>
              Klarna, Affirm, Afterpay compete. <span className="text-[#D4A853] font-semibold">We orchestrate.</span>
            </p>
          </div>
        )

      case 'why-now':
        return (
          <div className="flex flex-col justify-start sm:justify-center h-full px-4 sm:px-8 md:px-16 lg:px-24 pt-20 pb-16 sm:py-8 overflow-y-auto bg-gradient-to-br from-[#2C2416] via-[#3D3225] to-[#2C2416]">
            <p className="text-xs sm:text-sm text-[#D4A853] tracking-widest uppercase mb-4 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Why Now
            </p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl text-[#FAF8F5] mb-4 sm:mb-8 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Users are done with payment stress
            </h2>
            <p className="text-base sm:text-xl text-[#D4C5B0] mb-6 sm:mb-10 max-w-2xl" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              A generational shift in how people want to feel about money
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 max-w-5xl mb-8">
              <div className="p-5 sm:p-8 bg-black/20 border border-[#4A3D2F]">
                <p className="text-xs sm:text-sm text-[#D4A853] tracking-widest uppercase mb-4" style={{ fontFamily: 'Georgia, serif' }}>The Sentiment</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl sm:text-4xl text-[#D4A853]" style={{ fontFamily: 'Georgia, serif' }}>73%</span>
                    <p className="text-sm text-[#D4C5B0]" style={{ fontFamily: 'Georgia, serif' }}>of Gen Z report financial anxiety around digital transactions</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl sm:text-4xl text-[#D4A853]" style={{ fontFamily: 'Georgia, serif' }}>54%</span>
                    <p className="text-sm text-[#D4C5B0]" style={{ fontFamily: 'Georgia, serif' }}>chose BNPL over credit cards in 2024 — first time ever</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl sm:text-4xl text-[#D4A853]" style={{ fontFamily: 'Georgia, serif' }}>40%</span>
                    <p className="text-sm text-[#D4C5B0]" style={{ fontFamily: 'Georgia, serif' }}>of Gen Z use BNPL weekly — it's not occasional, it's lifestyle</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4 sm:space-y-6">
                <div className="p-4 sm:p-6 bg-[#FAF8F5]/10 border border-[#D4C5B0]/30">
                  <h3 className="text-lg sm:text-xl text-[#FAF8F5] mb-2" style={{ fontFamily: 'Georgia, serif' }}>Cash is making a comeback</h3>
                  <p className="text-sm text-[#D4C5B0]" style={{ fontFamily: 'Georgia, serif' }}>Young people are returning to cash because it doesn't trigger the "losing money" feeling. We're bringing that freedom to digital.</p>
                </div>
                <div className="p-4 sm:p-6 bg-[#FAF8F5]/10 border border-[#D4C5B0]/30">
                  <h3 className="text-lg sm:text-xl text-[#FAF8F5] mb-2" style={{ fontFamily: 'Georgia, serif' }}>Notification fatigue is real</h3>
                  <p className="text-sm text-[#D4C5B0]" style={{ fontFamily: 'Georgia, serif' }}>Every payment = a notification = a reminder of money leaving. Users want to stop thinking about it.</p>
                </div>
                <div className="p-4 sm:p-6 bg-[#FAF8F5]/10 border border-[#D4C5B0]/30">
                  <h3 className="text-lg sm:text-xl text-[#FAF8F5] mb-2" style={{ fontFamily: 'Georgia, serif' }}>Flexibility is non-negotiable</h3>
                  <p className="text-sm text-[#D4C5B0]" style={{ fontFamily: 'Georgia, serif' }}>71% of BNPL users have 2+ active loans. They expect payment flexibility everywhere.</p>
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6 bg-[#D4A853]/20 border border-[#D4A853]/40 max-w-3xl">
              <p className="text-lg sm:text-xl text-[#FAF8F5]" style={{ fontFamily: 'Georgia, serif' }}>
                "I want to spend without feeling like I'm losing something."
              </p>
              <p className="text-sm text-[#D4A853] mt-2" style={{ fontFamily: 'Georgia, serif' }}>— The user we're building for</p>
            </div>
          </div>
        )

      case 'distribution':
        return (
          <div className="flex flex-col justify-start sm:justify-center h-full px-4 sm:px-8 md:px-16 lg:px-24 pt-20 pb-16 sm:py-8 overflow-y-auto bg-gradient-to-tr from-[#FAF8F5] via-[#F5F0E8] to-[#EDE5D8]">
            <p className="text-xs sm:text-sm text-[#D4A853] tracking-widest uppercase mb-4 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Distribution Advantage
            </p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl text-[#2C2416] mb-4 sm:mb-8 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Scale, ownership, and profitable user acquisition
            </h2>
            <p className="text-base sm:text-xl text-[#6B5D4F] mb-6 sm:mb-10 max-w-2xl" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              FraternityBase gives us direct access to our ideal users
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 max-w-5xl">
              <div className="p-6 sm:p-10 bg-gradient-to-br from-[#2C2416] to-[#3D3225] shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <Image src="/images/fraternity-base-logo.png" alt="FraternityBase" width={48} height={48} className="w-12 h-12 rounded-lg" />
                  <div>
                    <h3 className="text-2xl sm:text-3xl text-[#FAF8F5]" style={{ fontFamily: 'Georgia, serif' }}>FraternityBase</h3>
                    <p className="text-sm text-[#D4C5B0]">Greek organization management</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl sm:text-3xl text-[#D4A853]" style={{ fontFamily: 'Georgia, serif' }}>750K+</span>
                    <p className="text-sm text-[#D4C5B0]" style={{ fontFamily: 'Georgia, serif' }}>active Greek members annually</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl sm:text-3xl text-[#D4A853]" style={{ fontFamily: 'Georgia, serif' }}>18-22</span>
                    <p className="text-sm text-[#D4C5B0]" style={{ fontFamily: 'Georgia, serif' }}>age range — peak BNPL adoption demographic</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl sm:text-3xl text-[#D4A853]" style={{ fontFamily: 'Georgia, serif' }}>20%</span>
                      <p className="text-sm text-[#D4C5B0]" style={{ fontFamily: 'Georgia, serif' }}>of budget goes to P2P payments</p>
                    </div>
                    <div className="flex flex-wrap gap-2 ml-1">
                      <span className="text-xs text-[#D4C5B0] bg-[#FAF8F5]/10 px-2 py-1 rounded">Rent</span>
                      <span className="text-xs text-[#D4C5B0] bg-[#FAF8F5]/10 px-2 py-1 rounded">Fantasy Leagues</span>
                      <span className="text-xs text-[#D4C5B0] bg-[#FAF8F5]/10 px-2 py-1 rounded">Weekend Spend</span>
                      <span className="text-xs text-[#D4C5B0] bg-[#FAF8F5]/10 px-2 py-1 rounded">Group Trips</span>
                    </div>
                  </div>
                </div>
                <a
                  href="https://fraternitybase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center text-sm text-[#FAF8F5] hover:text-[#D4C5B0] transition-colors"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  fraternitybase.com →
                </a>
              </div>
              <div className="space-y-4 sm:space-y-6">
                <div className="p-4 sm:p-6 bg-white shadow-lg border border-[#D4C5B0]">
                  <h3 className="text-lg sm:text-xl text-[#2C2416] mb-2" style={{ fontFamily: 'Georgia, serif' }}>Ideal User Audience</h3>
                  <p className="text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Every chapter member needs to pay dues. FraternityBase manages that workflow — Bankroll powers the payments.</p>
                </div>
                <div className="p-4 sm:p-6 bg-white shadow-lg border border-[#D4C5B0]">
                  <h3 className="text-lg sm:text-xl text-[#2C2416] mb-2" style={{ fontFamily: 'Georgia, serif' }}>Network Effects</h3>
                  <p className="text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>One member joins → friends see it → chapter adopts it → spreads to other chapters. Built-in virality.</p>
                </div>
                <div className="p-4 sm:p-6 bg-white shadow-lg border border-[#D4C5B0]">
                  <h3 className="text-lg sm:text-xl text-[#2C2416] mb-2" style={{ fontFamily: 'Georgia, serif' }}>Lifetime Value</h3>
                  <p className="text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Users acquired in college stay post-graduation. Early adoption = long-term retention.</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'team':
        return (
          <div className="flex flex-col justify-start sm:justify-center h-full px-4 sm:px-8 md:px-16 lg:px-24 pt-20 pb-16 sm:py-8 overflow-y-auto bg-gradient-to-br from-[#2C2416] via-[#3D3225] to-[#2C2416]">
            <p className="text-xs sm:text-sm text-[#D4A853] tracking-widest uppercase mb-4 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Team
            </p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl text-[#FAF8F5] mb-6 sm:mb-12 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Builder. Operator. <span className="text-[#D4A853]">Owner.</span>
            </h2>
            <div className="max-w-3xl">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-8 mb-6 sm:mb-10">
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden flex-shrink-0 ring-4 ring-[#D4A853]/30">
                  <Image
                    src="/images/Jackson_Hedgshot.jpg"
                    alt="Jackson Fitzgerald"
                    width={112}
                    height={112}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-xl sm:text-3xl text-[#FAF8F5] mb-1" style={{ fontFamily: 'Georgia, serif' }}>Jackson Fitzgerald</h3>
                  <p className="text-sm sm:text-lg text-[#D4A853] mb-4 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>CEO & CTO</p>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center gap-3 sm:gap-4 justify-center sm:justify-start">
                      <Image
                        src="/logos/CoverPayLogo.png"
                        alt="CoverPay"
                        width={24}
                        height={24}
                        className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                      />
                      <p className="text-sm sm:text-base text-[#FAF8F5]" style={{ fontFamily: 'Georgia, serif' }}>
                        <span className="font-semibold text-[#D4A853]">CoverPay</span> — BNPL orchestration API, 6 providers
                      </p>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4 justify-center sm:justify-start">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-[#F5B041] flex items-center justify-center text-[#0A1628] text-xs font-bold">B</div>
                      <p className="text-sm sm:text-base text-[#FAF8F5]" style={{ fontFamily: 'Georgia, serif' }}>
                        <span className="font-semibold text-[#D4A853]">Bankroll</span> — Consumer P2P payment platform
                      </p>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4 justify-center sm:justify-start">
                      <Image src="/images/fraternity-base-logo.png" alt="FraternityBase" width={24} height={24} className="w-5 h-5 sm:w-6 sm:h-6 rounded" />
                      <p className="text-sm sm:text-base text-[#FAF8F5]" style={{ fontFamily: 'Georgia, serif' }}>
                        <span className="font-semibold text-[#D4A853]">FraternityBase</span> — Greek organization management platform
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
                      <p className="text-sm sm:text-base text-[#FAF8F5]" style={{ fontFamily: 'Georgia, serif' }}>
                        <span className="font-semibold text-[#D4A853]">Hedge Payments</span> — AI-native payment infrastructure
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'ask':
        return (
          <div className="flex flex-col justify-start sm:justify-center h-full px-4 sm:px-8 md:px-16 lg:px-24 pt-20 pb-16 sm:py-8 overflow-y-auto text-center bg-gradient-to-br from-[#2C2416] via-[#3D3225] to-[#1A1610]">
            <p className="text-xs sm:text-sm text-[#D4A853] tracking-widest uppercase mb-4 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              The Ask
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#FAF8F5] mb-4 sm:mb-8 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Raising <span className="text-[#D4A853]">$4.12M</span> Seed
            </h2>
            <p className="text-sm sm:text-xl text-[#D4C5B0] mb-6 sm:mb-12 max-w-2xl mx-auto" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              To scale CoverPay to 200+ merchants and $100M+ in BNPL volume
            </p>
            <div className="grid grid-cols-3 gap-2 sm:gap-6 max-w-3xl mx-auto mb-6 sm:mb-12">
              <div className="p-3 sm:p-6 bg-[#FAF8F5]/10 border border-[#D4C5B0]/30">
                <p className="text-xl sm:text-2xl text-[#D4A853] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>50%</p>
                <p className="text-[#D4C5B0] text-xs sm:text-sm" style={{ fontFamily: 'Georgia, serif' }}>Engineering (3-4 hires)</p>
              </div>
              <div className="p-3 sm:p-6 bg-[#FAF8F5]/10 border border-[#D4C5B0]/30">
                <p className="text-xl sm:text-2xl text-[#D4A853] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>30%</p>
                <p className="text-[#D4C5B0] text-xs sm:text-sm" style={{ fontFamily: 'Georgia, serif' }}>Sales Lead + Growth</p>
              </div>
              <div className="p-3 sm:p-6 bg-[#FAF8F5]/10 border border-[#D4C5B0]/30">
                <p className="text-xl sm:text-2xl text-[#D4A853] mb-1 sm:mb-2" style={{ fontFamily: 'Georgia, serif' }}>20%</p>
                <p className="text-[#D4C5B0] text-xs sm:text-sm" style={{ fontFamily: 'Georgia, serif' }}>Provider Integrations</p>
              </div>
            </div>
            <div className="w-12 sm:w-16 h-px bg-[#D4A853] mx-auto mb-4 sm:mb-8"></div>
            <div className="space-y-3 sm:space-y-4">
              <p className="text-base sm:text-xl text-[#FAF8F5]" style={{ fontFamily: 'Georgia, serif' }}>
                jackson@hedgepayments.com
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 sm:px-10 py-3 sm:py-4 text-sm sm:text-base tracking-wide text-[#2C2416] bg-[#D4A853] border border-[#D4A853] hover:bg-[#E5B964] transition-all shadow-lg"
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
      {/* Persistent 3D Logo - shows on slides 2-14 (index 1+) */}
      <Logo3DTiny show={currentSlide > 0} />

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
