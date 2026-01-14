'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import BookstoreNavbar from './BookstoreNavbar'

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

      const deltaX = e.clientX - centerX
      const deltaY = e.clientY - centerY

      // Calculate rotation with sensitivity but clamped to max angle
      const sensitivity = 2.5
      const maxAngle = 25
      let rotateY = (deltaX / window.innerWidth) * 45 * sensitivity
      let rotateX = -(deltaY / window.innerHeight) * 45 * sensitivity

      // Clamp rotation
      rotateX = Math.max(-maxAngle, Math.min(maxAngle, rotateX))
      rotateY = Math.max(-maxAngle, Math.min(maxAngle, rotateY))

      setRotation({ x: rotateX, y: rotateY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      ref={containerRef}
      className="mb-16 animate-fadeIn"
      style={{ perspective: '1000px' }}
    >
      <div
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: 'transform 0.1s ease-out',
          transformStyle: 'preserve-3d',
        }}
      >
        <Image
          src="/images/hedge-inc-logo.png"
          alt="Hedge Payments"
          width={200}
          height={200}
          className="w-44 h-44 md:w-52 md:h-52 opacity-90"
          style={{ filter: 'drop-shadow(0 20px 40px rgba(44, 36, 22, 0.25))' }}
          priority
        />
      </div>
    </div>
  )
}

export default function NewLandingPage() {

  return (
    <div className="min-h-screen bg-[#FAF8F5]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
      {/* Always-visible Navbar */}
      <BookstoreNavbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-32">
        {/* Hedgehog Logo - 3D Interactive */}
        <Logo3D />

        {/* Decorative line */}
        <div className="w-16 h-px bg-[#D4C5B0] mb-10 animate-fadeIn animation-delay-100"></div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl text-[#2C2416] text-center mb-8 tracking-tight leading-tight animate-fadeIn animation-delay-200" style={{ fontFamily: 'Georgia, "Palatino Linotype", "Book Antiqua", serif', fontWeight: 400, letterSpacing: '-0.02em' }}>
          Money in an AI World
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-[#6B5D4F] text-center mb-6 max-w-2xl tracking-wide leading-relaxed animate-fadeIn animation-delay-400" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
          Launch payments fast, grow faster
        </p>

        {/* AI Integration Badge */}
        <div className="text-center mb-14 animate-fadeIn animation-delay-500">
          <p className="text-sm text-[#8B7E6E] tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>
            Works seamlessly with Claude, Claude Code, ChatGPT, Codex & AI agents
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-5 animate-fadeIn animation-delay-600">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-10 py-4 text-base tracking-wide text-[#FAF8F5] bg-[#2C2416] border border-[#2C2416] hover:bg-[#3D3024] transition-all"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Start Building
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center justify-center px-10 py-4 text-base tracking-wide text-[#2C2416] bg-transparent border border-[#D4C5B0] hover:border-[#2C2416] transition-all"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Read our docs
          </Link>
        </div>
      </section>

      {/* Logo Ticker */}
      <section className="py-20 border-t border-[#D4C5B0]">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs text-[#8B7E6E] mb-12 tracking-widest uppercase" style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.2em' }}>
            Trusted by AI-first companies
          </p>

          {/* Ticker Animation */}
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll">
              {/* First set of logos */}
              <div className="flex items-center space-x-20 px-8">
                <div className="flex-shrink-0 flex items-center justify-center w-36 h-16">
                  <span className="text-2xl text-[#2C2416] tracking-wide" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>Claude</span>
                </div>
                <div className="flex-shrink-0 flex items-center justify-center w-36 h-16">
                  <span className="text-2xl text-[#2C2416] tracking-wide" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>Gemini</span>
                </div>
                <div className="flex-shrink-0 flex items-center justify-center w-36 h-16">
                  <span className="text-2xl text-[#2C2416] tracking-wide" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>ChatGPT</span>
                </div>
                <div className="flex-shrink-0 flex items-center justify-center w-36 h-16">
                  <Image
                    src="/images/bankroll-logo.png"
                    alt="Bankroll"
                    width={100}
                    height={40}
                    className="h-10 w-auto opacity-60 grayscale"
                  />
                </div>
                <div className="flex-shrink-0 flex items-center justify-center w-36 h-16">
                  <Image
                    src="/sidebet-logo.png"
                    alt="SideBet"
                    width={100}
                    height={40}
                    className="h-10 w-auto opacity-60 grayscale"
                  />
                </div>
                <div className="flex-shrink-0 flex items-center justify-center w-36 h-16">
                  <Image
                    src="/images/hedgepay-new-logo.png"
                    alt="Hedge Pay"
                    width={100}
                    height={40}
                    className="h-10 w-auto opacity-60 grayscale"
                  />
                </div>
              </div>

              {/* Duplicate set for seamless loop */}
              <div className="flex items-center space-x-20 px-8">
                <div className="flex-shrink-0 flex items-center justify-center w-36 h-16">
                  <span className="text-2xl text-[#2C2416] tracking-wide" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>Claude</span>
                </div>
                <div className="flex-shrink-0 flex items-center justify-center w-36 h-16">
                  <span className="text-2xl text-[#2C2416] tracking-wide" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>Gemini</span>
                </div>
                <div className="flex-shrink-0 flex items-center justify-center w-36 h-16">
                  <span className="text-2xl text-[#2C2416] tracking-wide" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>ChatGPT</span>
                </div>
                <div className="flex-shrink-0 flex items-center justify-center w-36 h-16">
                  <Image
                    src="/images/bankroll-logo.png"
                    alt="Bankroll"
                    width={100}
                    height={40}
                    className="h-10 w-auto opacity-60 grayscale"
                  />
                </div>
                <div className="flex-shrink-0 flex items-center justify-center w-36 h-16">
                  <Image
                    src="/sidebet-logo.png"
                    alt="SideBet"
                    width={100}
                    height={40}
                    className="h-10 w-auto opacity-60 grayscale"
                  />
                </div>
                <div className="flex-shrink-0 flex items-center justify-center w-36 h-16">
                  <Image
                    src="/images/hedgepay-new-logo.png"
                    alt="Hedge Pay"
                    width={100}
                    height={40}
                    className="h-10 w-auto opacity-60 grayscale"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
