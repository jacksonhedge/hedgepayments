'use client'

import SubscriptionPage from './components/SubscriptionPage'
import LogoTicker from './components/LogoTicker'
import Features from './components/Features'
import JackpotDisplay from './components/JackpotDisplay'

export default function Home() {
  // Use the actual casino logos from the assets folder
  const casinoLogos = [
    { src: '/images/assets/draftkings-casino-alt 3.png', alt: 'DraftKings' },
    { src: '/images/assets/fanduel-casino.jpg', alt: 'FanDuel' },
    { src: '/images/assets/betmgm 2.png', alt: 'BetMGM' },
    { src: '/images/assets/caesarsCasino 2.png', alt: 'Caesars' },
    { src: '/images/assets/fanatics.png', alt: 'Fanatics' }
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