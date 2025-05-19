'use client'

import React from 'react';
import styles from './page.module.css';
import WaitlistForm from './components/WaitlistForm';
import JackpotDisplay from './components/JackpotDisplay';
import Features from './components/Features';
import LogoTicker from './components/LogoTicker';
import Footer from './components/Footer';

export default function Home() {
  const partnerLogos = [
    { src: '/images/assets/mgm.svg', alt: 'MGM' },
    { src: '/images/assets/draftkings.svg', alt: 'DraftKings' },
    { src: '/images/assets/fanatics.svg', alt: 'Fanatics' },
    { src: '/images/assets/fanduel.svg', alt: 'FanDuel' },
    { src: '/images/assets/pokerstars.svg', alt: 'PokerStars' },
    { src: '/images/assets/caesars.svg', alt: 'Caesars' },
  ];

  return (
    <main className={styles.main}>
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <h1 className={styles.title}>Hedge Payments</h1>
          <p className={styles.description}>
            The best way to manage payments for sports betting and gaming.
          </p>
          <WaitlistForm />
        </div>
      </section>
      
      <section className={styles.jackpotSection}>
        <div className={styles.container}>
          <JackpotDisplay />
        </div>
      </section>
      
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Why Choose Hedge Payments</h2>
          <Features />
        </div>
      </section>
      
      <section className={styles.partnersSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Our Partners</h2>
          <LogoTicker logos={partnerLogos} />
        </div>
      </section>
      
      <Footer />
    </main>
  );
}