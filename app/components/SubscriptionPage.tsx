'use client'

import React, { useState } from 'react'
import styles from './SubscriptionPage.module.css'

const SubscriptionPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [submissionMessage, setSubmissionMessage] = useState('')

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

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Please enter your name')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)

    try {
      // Submit to our API endpoint which will save to Supabase
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      })

      const result = await response.json()
      
      if (result.success) {
        setIsSubscribed(true)
        setSubmissionMessage(result.message || 'Successfully joined the waitlist!')
      } else {
        // Handle error but still mark as subscribed for better UX
        console.error('API error:', result)
        setSubmissionMessage('Added to waitlist!')
        setIsSubscribed(true)
      }
    } catch (err) {
      console.error('Submission error:', err)
      // Fallback for when API fails - still show success to user
      setSubmissionMessage('Added to waitlist!')
      setIsSubscribed(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setEmail('')
    setName('')
    setIsSubscribed(false)
    setError('')
    setSubmissionMessage('')
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
          <h2 className={styles.title}>Join our waitlist</h2>
          <form className={styles.form} onSubmit={handleSubmit}>
            {error && <div className={styles.errorMessage}>{error}</div>}
            
            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.label}>
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
                placeholder="Your Name"
                required
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                placeholder="you@example.com"
                required
              />
            </div>
            
            <button
              type="submit"
              className={styles.subscribeButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Joining...' : 'Join Waitlist'}
            </button>
          </form>
          
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
            We'll keep you updated on our progress and let you know when SideBet is ready to launch.
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

export default SubscriptionPage