'use client'

import React, { useState, ChangeEvent, FormEvent } from 'react'
import Image from 'next/image'
import styles from './page.module.css'

type FormData = {
  name: string;
  email: string;
  selectedCasinos: string[];
}

type FormErrors = {
  name: string;
  email: string;
  selectedCasinos?: string;
}

// Casino site options with their logos and prize amounts
const casinoSites = [
  { value: 'DraftKings Casino', logo: '/images/casino-logos/draftkings.svg', prize: '$4,000' },
  { value: 'FanDuel Casino', logo: '/images/casino-logos/fanduel.svg', prize: '$3,500' },
  { value: 'Caesars Casino', logo: '/images/casino-logos/caesars.svg', prize: '$2,500' },
  { value: 'BetMGM Casino', logo: '/images/casino-logos/mgm.svg', prize: '$5,000' },
  { value: 'PokerStars Casino', logo: '/images/casino-logos/pokerstars.svg', prize: '$3,200' },
  { value: 'Fanatics Casino', logo: '/images/casino-logos/fanatics.svg', prize: '$2,800' },
  { value: 'BetRivers Casino', logo: '/images/casino-logos/betrivers.svg', prize: '$1,700' }
];

export default function SideBet() {
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    selectedCasinos: ['DraftKings Casino']
  });
  const [errors, setErrors] = useState<FormErrors>({
    name: '',
    email: '',
    selectedCasinos: ''
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
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

  // Handle casino selection toggle
  const handleCasinoToggle = (casinoValue: string) => {
    let updatedCasinos;

    if (formData.selectedCasinos.includes(casinoValue)) {
      // Remove casino if already selected
      updatedCasinos = formData.selectedCasinos.filter(casino => casino !== casinoValue);
    } else {
      // Add casino if not already selected
      updatedCasinos = [...formData.selectedCasinos, casinoValue];
    }

    setFormData({
      ...formData,
      selectedCasinos: updatedCasinos
    });

    // Clear any error
    if (errors.selectedCasinos) {
      setErrors({
        ...errors,
        selectedCasinos: ''
      });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: '', email: '', selectedCasinos: '' };

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

    if (formData.selectedCasinos.length === 0) {
      newErrors.selectedCasinos = 'Please select at least one casino';
      valid = false;
    }

    setErrors(newErrors as FormErrors);
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
        <p className={styles.vegasSignSubtext}>Spare Change put to your favorite Casino</p>
      </div>

      {/* Waitlist Form Section */}
      <div className={styles.waitlistSection}>
        <div className={styles.waitlistHeader}>
          <Image
            src="/images/sidebet-text-logo.svg"
            alt="SideBet by Hedge Payments"
            width={400}
            height={100}
            className={styles.waitlistLogo}
          />

          <div className={styles.waitlistHeaderText}>
            <span className={styles.waitlistTagline}>Save 10¢. Win Big.</span>
          </div>
        </div>
        
        <div className={styles.waitlistContent}>
          <h2 className={styles.waitlistTitle}>Join the Exclusive Waitlist</h2>
          <p className={styles.waitlistDescription}>
            Be the first to experience the future of sports betting. Sign up now for early access.
          </p>
          
          <form className={styles.waitlistForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Select Your Preferred Casinos</label>
              <p className={styles.casinoSelectionHint}>
                Each $0.10 round-up can win you the prize amount shown below.
              </p>

              <div className={styles.casinoSelectionGrid}>
                {casinoSites.map((site) => (
                  <div
                    key={site.value}
                    className={`${styles.casinoSelectionCard} ${formData.selectedCasinos.includes(site.value) ? styles.casinoSelected : ''}`}
                    onClick={() => handleCasinoToggle(site.value)}
                  >
                    <div className={styles.casinoLogoContainer}>
                      <Image
                        src={site.logo}
                        alt={site.value}
                        width={80}
                        height={80}
                        className={styles.casinoSelectionLogo}
                      />
                    </div>
                    <p className={styles.casinoSelectionName}>{site.value}</p>
                    <p className={styles.casinoSelectionPrize}>
                      <span className={styles.prizeLabel}>Win up to</span>
                      <span className={styles.prizeAmount}>{site.prize}</span>
                    </p>
                    <div className={styles.checkmark}></div>
                  </div>
                ))}
              </div>
              {errors.selectedCasinos && <span className={styles.errorMessage}>{errors.selectedCasinos}</span>}
            </div>

            <div className={styles.personalInfoSection}>
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

            <div className={styles.popupLogos}>
              <Image
                src="/images/sidebet-text-logo.svg"
                alt="SideBet by Hedge Payments"
                width={300}
                height={80}
                className={styles.popupLogo}
              />
            </div>

            <h3 className={styles.popupTitle}>
              You're on the List!
            </h3>

            <p className={styles.popupMessage}>
              We'll notify you when SideBet is live with your selected casinos:
            </p>

            <div className={styles.selectedCasinosContainer}>
              {formData.selectedCasinos.map(selectedCasinoValue => {
                const site = casinoSites.find(site => site.value === selectedCasinoValue);
                if (!site) return null;

                return (
                  <div key={site.value} className={styles.selectedCasinoItem}>
                    <div className={styles.selectedCasinoLogo}>
                      <Image
                        src={site.logo}
                        alt={site.value}
                        width={40}
                        height={40}
                        className={styles.popupCasinoLogo}
                      />
                    </div>
                    <div className={styles.selectedCasinoInfo}>
                      <span className={styles.selectedCasinoName}>{site.value}</span>
                      <span className={styles.selectedCasinoPrize}>Prize up to {site.prize}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.popupDivider}></div>

            <p className={styles.totalPrizeMessage}>
              You could win up to <span className={styles.totalPrizeAmount}>
                {formData.selectedCasinos.reduce((total, selectedCasinoValue) => {
                  const site = casinoSites.find(site => site.value === selectedCasinoValue);
                  // Extract numeric value from prize string (e.g. '$4,000' -> 4000)
                  if (site) {
                    const prizeValue = parseInt(site.prize.replace(/[^0-9]/g, ''), 10);
                    return total + prizeValue;
                  }
                  return total;
                }, 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </span> in total prizes!
            </p>
            <p className={styles.popupNoteText}>
              Each $0.10 round-up can win you a different prize at each casino.
            </p>
          </div>
        </div>
      )}
    </div>
  )
} 