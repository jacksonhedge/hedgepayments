import React from 'react';
import PartnerLogos from '../components/PartnerLogos';
import styles from '../page.module.css';

export default function PartnersPage() {
  const partnerLogos = [
    { src: '/images/assets/mgm.svg', alt: 'MGM' },
    { src: '/images/assets/draftkings.svg', alt: 'DraftKings' },
    { src: '/images/assets/fanatics.svg', alt: 'Fanatics' },
    { src: '/images/assets/fanduel.svg', alt: 'FanDuel' },
    { src: '/images/assets/pokerstars.svg', alt: 'PokerStars' },
  ];

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1>Our Partners</h1>
        <p className={styles.description}>
          HedgePayments partners with leading companies in the financial technology space.
        </p>
        <PartnerLogos logos={partnerLogos} />
      </div>
    </main>
  );
} 