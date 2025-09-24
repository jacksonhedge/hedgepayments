'use client'

import { useState, useEffect } from 'react'
import HedgePaymentsHubGraphic from './components/HedgePaymentsHubGraphic'

export default function Home() {
  const [reveal, setReveal] = useState(false)

  useEffect(() => {
    // Trigger reveal animation after a short delay
    const timer = setTimeout(() => setReveal(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 bg-[#071b1d] flex flex-col items-center justify-center">
      <div
        className={`w-full flex-1 transition-all duration-1500 ease-out ${
          reveal ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <HedgePaymentsHubGraphic
          payments={["Bankroll", "Visa", "Venmo", "PayPal", "Kalshi"]}
          title=""
          subtitle=""
        />
      </div>
      <div
        className={`pb-12 transition-all duration-1500 delay-700 ease-out ${
          reveal ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <h2 className="text-4xl font-bold text-[#5bf2c9] tracking-wider">
          Coming October 2025
        </h2>
      </div>
    </div>
  )
}