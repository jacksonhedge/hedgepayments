import React from 'react'
import Image from 'next/image'
import styles from './page.module.css'

export default function SideBet() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <Image 
          src="/images/sidebet-logo.svg" 
          alt="SideBet by Hedge Payments" 
          width={600} 
          height={200} 
          className={styles.logo}
        />
        <h1 className={styles.title}>Sports betting, simplified.</h1>
        <p className={styles.description}>
          SideBet provides the fastest and most user-friendly sports betting experience, 
          with real-time odds and instant payouts.
        </p>
        <div className={styles.buttonGroup}>
          <a href="#download" className={styles.primaryButton}>Download App</a>
          <a href="#learn-more" className={styles.secondaryButton}>Learn More</a>
        </div>
      </div>
      
      <div className={styles.features}>
        <h2 className={styles.sectionTitle}>Features</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.iconContainer}>
              <span className={styles.icon}>🏆</span>
            </div>
            <h3 className={styles.featureTitle}>All Major Sports</h3>
            <p className={styles.featureDescription}>
              Bet on NFL, NBA, MLB, NHL, and all other major sports leagues worldwide.
            </p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.iconContainer}>
              <span className={styles.icon}>⚡</span>
            </div>
            <h3 className={styles.featureTitle}>Instant Payouts</h3>
            <p className={styles.featureDescription}>
              Receive your winnings instantly, with no delays or complicated withdrawal processes.
            </p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.iconContainer}>
              <span className={styles.icon}>🔒</span>
            </div>
            <h3 className={styles.featureTitle}>Secure Platform</h3>
            <p className={styles.featureDescription}>
              Industry-leading security measures to protect your information and funds.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 