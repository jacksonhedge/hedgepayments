'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Dynamic animated gradient background matching the logo */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-950/20 via-purple-950/10 to-blue-950/20 animate-gradient" />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <div className={`text-center transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Main Hedge Logo - Larger */}
          <div className="mb-8 mt-16 animate-rgb-glow">
            <img
              src="/images/hedge-inc-logo.png"
              alt="Hedge Inc"
              className="h-48 md:h-64 w-auto mx-auto"
            />
          </div>

          {/* HEDGE Text Logo */}
          <div className="mb-12 animate-rgb-glow-delayed">
            <img
              src="/images/hedge-text-logo.png"
              alt="HEDGE"
              className="h-16 md:h-20 w-auto mx-auto"
            />
          </div>

          {/* Main Text */}
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-20">
            <span className="block bg-gradient-to-r from-orange-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Onward and Upward
            </span>
          </h1>

          {/* Our Brands Section */}
          <h2 className="text-2xl md:text-3xl font-semibold text-white/80 mb-8">Our Brands</h2>

          {/* 5 Brand Logos */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16 max-w-6xl mx-auto">
            {/* Bankroll */}
            <Link href="https://bankroll.live" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 cursor-pointer">
                <img src="/images/bankroll-logo.png" alt="Bankroll" className="h-20 w-auto mx-auto mb-3" />
                <p className="text-sm text-white/70">Bankroll</p>
              </div>
            </Link>

            {/* SideBet */}
            <div className="flex flex-col items-center">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 cursor-not-allowed opacity-90">
                <img src="/sidebet-logo.png" alt="SideBet" className="h-20 w-auto mx-auto mb-3" />
                <p className="text-sm text-white/70">SideBet</p>
                <p className="text-xs text-white/40 mt-1">Coming Soon</p>
              </div>
            </div>

            {/* Hedge Pay */}
            <Link href="https://hedgepayments.com" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 cursor-pointer">
                <img src="/images/hedgepay-new-logo.png" alt="Hedge Pay" className="h-20 w-auto mx-auto mb-3" />
                <p className="text-sm text-white/70">Hedge Pay</p>
              </div>
            </Link>

            {/* College Casino Tour */}
            <Link href="https://collegecasinotour.com" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 cursor-pointer">
                <div className="h-20 w-20 mx-auto mb-3 bg-gradient-to-br from-orange-400 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-3xl">🎰</span>
                </div>
                <p className="text-sm text-white/70">College Casino Tour</p>
              </div>
            </Link>

            {/* Fraternity Base */}
            <Link href="https://fraternitybase.com" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 cursor-pointer">
                <img src="/images/fraternity-base-logo.png" alt="Fraternity Base" className="h-20 w-auto mx-auto mb-3" />
                <p className="text-sm text-white/70">Fraternity Base</p>
              </div>
            </Link>
          </div>

          {/* Subtle links */}
          <div className="mt-16">
            <div className="flex gap-6 justify-center text-sm text-white/40">
              <Link href="/wallet" className="hover:text-white transition-colors">Wallet</Link>
              <span>·</span>
              <Link href="/developers" className="hover:text-white transition-colors">Developers</Link>
              <span>·</span>
              <Link href="https://github.com/hedgepayments" className="hover:text-white transition-colors">GitHub</Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-8 text-center text-white/20 text-xs">
          <p>© 2024 Hedge Inc. · Building the Future of Finance</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes rgb-glow {
          0% { filter: drop-shadow(0 0 40px rgba(255, 0, 0, 0.6)); }
          16% { filter: drop-shadow(0 0 45px rgba(255, 165, 0, 0.6)); }
          33% { filter: drop-shadow(0 0 40px rgba(255, 255, 0, 0.6)); }
          50% { filter: drop-shadow(0 0 45px rgba(0, 255, 0, 0.6)); }
          66% { filter: drop-shadow(0 0 40px rgba(0, 255, 255, 0.6)); }
          83% { filter: drop-shadow(0 0 45px rgba(255, 0, 255, 0.6)); }
          100% { filter: drop-shadow(0 0 40px rgba(255, 0, 0, 0.6)); }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 15s ease infinite;
        }

        .animate-rgb-glow {
          animation: rgb-glow 4s linear infinite;
        }

        .animate-rgb-glow-delayed {
          animation: rgb-glow 4s linear infinite;
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}