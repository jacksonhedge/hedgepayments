'use client'

import React, { useState, ChangeEvent, FormEvent } from 'react'
import Image from 'next/image'
import styles from './page.module.css'

type FormData = {
  name: string;
  email: string;
  site: string;
}

type FormErrors = {
  name: string;
  email: string;
}

export default function SideBet() {
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    site: 'BetMGM Casino'
  });
  const [errors, setErrors] = useState<FormErrors>({
    name: '',
    email: ''
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: ''
      } as FormErrors);
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: '', email: '' };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setShowPopup(true);
      // In a real application, you would also send the data to a server here
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className={styles.container}>
      {/* Vegas-style Welcome Sign */}
      <div className={styles.vegasSign}>
        <h1 className={styles.vegasSignText}>SideBet</h1>
        <p className={styles.vegasSignSubtext}>Where sports betting meets fun</p>
      </div>

      {/* Waitlist Form Section */}
      <div className={styles.waitlistSection}>
        <div className={styles.waitlistImageContainer}>
          <Image 
            src="/images/sidebet-icon.svg" 
            alt="SideBet Logo" 
            width={200} 
            height={200} 
            className={styles.waitlistImage}
          />
        </div>
        
        <div className={styles.waitlistContent}>
          <h2 className={styles.waitlistTitle}>Join the Exclusive Waitlist</h2>
          <p className={styles.waitlistDescription}>
            Be the first to experience the future of sports betting. Sign up now for early access.
          </p>
          
          <form className={styles.waitlistForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.formLabel}>Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`${styles.formInput} ${errors.name ? styles.inputError : ''}`}
                placeholder="Your name"
              />
              {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`${styles.formInput} ${errors.email ? styles.inputError : ''}`}
                placeholder="your.email@example.com"
              />
              {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="site" className={styles.formLabel}>Preferred Casino Site</label>
              <select
                id="site"
                name="site"
                value={formData.site}
                onChange={handleInputChange}
                className={styles.formSelect}
              >
                <option value="BetMGM Casino">BetMGM Casino</option>
                <option value="DraftKings Casino">DraftKings Casino</option>
                <option value="FanDuel Casino">FanDuel Casino</option>
              </select>
            </div>
            
            <button type="submit" className={styles.joinButton}>
              Join Waitlist
            </button>
          </form>
        </div>
      </div>
      
      {/* Features Section */}
      <div className={styles.features}>
        <h2 className={styles.sectionTitle}>Why Choose SideBet</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.iconContainer}>
              <span className={styles.icon}>🏆</span>
            </div>
            <h3 className={styles.featureTitle}>All Major Sports</h3>
            <p className={styles.featureDescription}>
              Bet on NFL, NBA, MLB, NHL, and all other major sports leagues worldwide with competitive odds.
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
              Industry-leading security measures to protect your information and funds at all times.
            </p>
          </div>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <button className={styles.closeButton} onClick={closePopup}>×</button>
            <Image 
              src="/images/sidebet-logo.svg" 
              alt="SideBet by Hedge Payments" 
              width={300} 
              height={100} 
              className={styles.popupLogo}
            />
            <h3 className={styles.popupTitle}>
              You're on the List!
            </h3>
            <p className={styles.popupMessage}>
              We'll notify you when SideBet is live with <strong>{formData.site}</strong>
            </p>
            <div className={styles.popupDivider}></div>
            <p className={styles.otherSitesText}>Want to be notified about other sites too?</p>
            <div className={styles.otherSitesButtons}>
              {formData.site !== 'BetMGM Casino' && (
                <button className={styles.siteButton} onClick={() => setFormData({...formData, site: 'BetMGM Casino'})}>
                  BetMGM Casino
                </button>
              )}
              {formData.site !== 'DraftKings Casino' && (
                <button className={styles.siteButton} onClick={() => setFormData({...formData, site: 'DraftKings Casino'})}>
                  DraftKings Casino
                </button>
              )}
              {formData.site !== 'FanDuel Casino' && (
                <button className={styles.siteButton} onClick={() => setFormData({...formData, site: 'FanDuel Casino'})}>
                  FanDuel Casino
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 