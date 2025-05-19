'use client'

import React from 'react'
import PartnerLogos from '../components/PartnerLogos'

export default function PartnersPage() {
  const partnerLogos = [
    { src: '/images/assets/draftkings-casino-alt 3.png', alt: 'DraftKings' },
    { src: '/images/assets/fanduel-casino.jpg', alt: 'FanDuel' },
    { src: '/images/assets/betmgm 2.png', alt: 'BetMGM' },
    { src: '/images/assets/caesarsCasino 2.png', alt: 'Caesars' },
    { src: '/images/assets/fanatics.png', alt: 'Fanatics' }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Partners Test Page</h1>
      <PartnerLogos logos={partnerLogos} />
      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <a href="/" style={{ color: 'blue', textDecoration: 'underline' }}>Go to home page</a>
      </div>
    </div>
  )
} 