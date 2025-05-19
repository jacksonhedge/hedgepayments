'use client'

import React, { useState } from 'react'
import styles from './SubscriptionPage.module.css'
import WaitlistForm from './WaitlistForm'

const ModifiedSubscriptionPage: React.FC = () => {
  const [isSubscribed, setIsSubscribed] = useState(false)

  // Partner logos and jackpot information
  const partnerInfo = [
    { 
      src: '/images/assets/draftkings-casino-alt 3.png', 
      alt: 'DraftKings',
      jackpot: 'DraftKings Jackpot',
      comingSoon: false 
    },
    { 
      src: '/images/assets/fanduel-casino.jpg', 
      alt: 'FanDuel',
      jackpot: 'FanDuel Jackpot',
      comingSoon: false  
    },
    { 
      src: '/images/assets/betmgm 2.png', 
      alt: 'BetMGM',
      jackpot: 'BetMGM Jackpot',
      comingSoon: true  
    },
    { 
      src: '/images/assets/caesarsCasino 2.png', 
      alt: 'Caesars',
      jackpot: 'Caesars Casino Jackpot',
      comingSoon: true 
    },
    { 
      src: '/images/assets/fanatics.png', 
      alt: 'Fanatics',
      jackpot: 'Fanatics Casino Jackpot',
      comingSoon: true 
    },
  ]

  // This function will be called when the WaitlistForm is successfully submitted
  const handleWaitlistSubmitted = () => {
    setIsSubscribed(true);
  };

  const resetForm = () => {
    setIsSubscribed(false)
  }

  return (
    <div className={styles.container}>
      <video
        className={styles.videoBackground}
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/videos/background.mp4" type="video/mp4" />
      </video>
      <div className={styles.overlay}></div>
      
      {!isSubscribed ? (
        <div className={styles.content}>
          <div className={styles.logoContainer}>
            <img 
              src="/images/assets/SideBet Logo.png"
              alt="SideBet Logo"
              className={styles.logo}
            />
          </div>
          
          {/* Modified section - use WaitlistForm instead of the original form */}
          <h2 className={styles.title}>Join our waitlist for a free $10 on your favorite sportsbook</h2>
          
          <div className={styles.waitlistFormWrapper}>
            <WaitlistForm onSuccess={handleWaitlistSubmitted} />
          </div>
          
          <p className={styles.description}>
            Turn spare change into winnings with SideBet! Sign up to get early access.
          </p>
          
          {/* Partner Logos */}
          <div className={styles.partnersSection}>
            <p className={styles.partnersTitle}>Our Marketing Partners</p>
            <div className={styles.partnerLogos}>
              {partnerInfo.map((partner, index) => (
                <div key={index} className={styles.partnerLogo}>
                  <img src={partner.src} alt={partner.alt} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.successMessage}>
          <h2 className={styles.successTitle}>Thank you for joining our waitlist!</h2>
          <p className={styles.successText}>
            We've recorded your sportsbook preferences and will notify you when SideBet is ready to launch.
          </p>
          
          {/* Jackpot information */}
          <div className={styles.jackpotSection}>
            <h3 className={styles.jackpotTitle}>Available Jackpots</h3>
            <div className={styles.jackpotList}>
              {partnerInfo.map((partner, index) => (
                <div key={index} className={styles.jackpotItem}>
                  <div className={styles.jackpotLogoContainer}>
                    <img src={partner.src} alt={partner.alt} className={styles.jackpotLogo} />
                  </div>
                  <div className={styles.jackpotInfo}>
                    <p className={styles.jackpotName}>{partner.jackpot}</p>
                    {partner.comingSoon && 
                      <span className={styles.comingSoonBadge}>Coming Soon</span>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button onClick={resetForm} className={styles.resetButton}>
            Subscribe another email
          </button>
          
          {/* Partner Logos */}
          <div className={styles.partnersSection}>
            <p className={styles.partnersTitle}>Our Marketing Partners</p>
            <div className={styles.partnerLogos}>
              {partnerInfo.map((partner, index) => (
                <div key={index} className={styles.partnerLogo}>
                  <img src={partner.src} alt={partner.alt} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ModifiedSubscriptionPage 