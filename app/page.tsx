'use client'

import SubscriptionPage from './components/SubscriptionPage'
import LogoTicker from './components/LogoTicker'
import Features from './components/Features'
import JackpotDisplay from './components/JackpotDisplay'

export default function Home() {
  // Use the new placeholder images for the ticker
  const casinoLogos = [
    { src: '/images/placeholder-logo-1.png', alt: 'Partner 1' },
    { src: '/images/placeholder-logo-2.png', alt: 'Partner 2' },
    { src: '/images/placeholder-logo-3.png', alt: 'Partner 3' },
    { src: '/images/placeholder-logo-4.png', alt: 'Partner 4' },
    { src: '/images/placeholder-logo-5.png', alt: 'Partner 5' }
  ];

  return (
    <main>
      <SubscriptionPage />
      <LogoTicker logos={casinoLogos} />
      <Features />
      <JackpotDisplay />
    </main>
  )
}