'use client'

import PartnerLogos from './components/PartnerLogos'
import JackpotDisplay from './components/JackpotDisplay'
import ModifiedSubscriptionPage from './components/ModifiedSubscriptionPage'

export default function Home() {
  // Use the actual casino logos from the assets folder
  const partnerLogos = [
    { src: '/images/assets/draftkings-casino-alt 3.png', alt: 'DraftKings' },
    { src: '/images/assets/fanduel-casino.jpg', alt: 'FanDuel' },
    { src: '/images/assets/betmgm 2.png', alt: 'BetMGM' },
    { src: '/images/assets/caesarsCasino 2.png', alt: 'Caesars' },
    { src: '/images/assets/fanatics.png', alt: 'Fanatics' }
  ];

  return (
    <main>
      <ModifiedSubscriptionPage />
      <PartnerLogos logos={partnerLogos} />
      <JackpotDisplay />
    </main>
  )
}