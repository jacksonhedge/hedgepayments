'use client'

import React, { useState, ChangeEvent, FormEvent } from 'react'
import Image from 'next/image'
import styles from './page.module.css'

type FormData = {
  name: string;
  email: string;
  site: string;
  selectedSites: string[];
}

type FormErrors = {
  name: string;
  email: string;
}

// Casino site options with their logos
const casinoSites = [
  { value: 'DraftKings Casino', logo: '/images/casino-logos/draftkings.svg' },
  { value: 'FanDuel Casino', logo: '/images/casino-logos/fanduel.svg' },
  { value: 'BetMGM Casino', logo: '/images/casino-logos/mgm.svg' },
  { value: 'BetRivers Casino', logo: '/images/casino-logos/betrivers.svg' },
  { value: 'Fanatics Casino', logo: '/images/casino-logos/fanatics.svg' }
];

export default function SideBet() {
  const [showPopup, setShowPopup] = useState(false);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    site: 'DraftKings Casino',
    selectedSites: ['DraftKings Casino']
  });
  const [errors, setErrors] = useState<FormErrors>({
    name: '',
    email: ''
  });
  
  // Get the selected casino site information
  const selectedSite = casinoSites.find(site => site.value === formData.site) || casinoSites[0];

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

  const toggleMultiSelect = () => {
    const newMultiSelectMode = !multiSelectMode;
    setMultiSelectMode(newMultiSelectMode);
    
    // If turning off multi-select, reset to just primary selection
    if (!newMultiSelectMode) {
      setFormData(prev => ({
        ...prev,
        selectedSites: [prev.site]
      }));
    } else {
      // If turning on multi-select, initialize with current selection
      setFormData(prev => ({
        ...prev,
        selectedSites: prev.selectedSites.includes(prev.site) ? 
          prev.selectedSites : [...prev.selectedSites, prev.site]
      }));
    }
  };

  const toggleSiteSelection = (siteValue: string) => {
    if (!multiSelectMode) {
      // In single select mode, just set the site
      setFormData(prev => ({
        ...prev,
        site: siteValue,
        selectedSites: [siteValue]
      }));
      return;
    }

    // In multi-select mode, toggle the site in the array
    setFormData(prev => {
      const newSelectedSites = prev.selectedSites.includes(siteValue)
        ? prev.selectedSites.filter(s => s !== siteValue)
        : [...prev.selectedSites, siteValue];
      
      // If nothing selected, keep at least the main site
      if (newSelectedSites.length === 0) {
        return prev;
      }
      
      // Update primary site if it was deselected
      const newSite = newSelectedSites.includes(prev.site) 
        ? prev.site 
        : newSelectedSites[0];
      
      return {
        ...prev,
        site: newSite,
        selectedSites: newSelectedSites
      };
    });
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
        <div className={styles.waitlistHeader}>
          <Image 
            src="/images/sidebet-text-logo.svg" 
            alt="SideBet by Hedge Payments" 
            width={400} 
            height={100} 
            className={styles.waitlistLogo}
          />
          
          {/* Display the selected casino logo or multi-select crown */}
          <div className={styles.selectedCasinoLogo}>
            {formData.selectedSites.length > 1 ? (
              <Image 
                src="/images/casino-logos/draftkings-crown.svg"
                alt="Multiple casinos selected"
                width={80}
                height={80}
                className={styles.casinoLogo}
              />
            ) : (
              <Image 
                src={selectedSite.logo}
                alt={selectedSite.value}
                width={80}
                height={80}
                className={styles.casinoLogo}
              />
            )}
          </div>
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
              <div className={styles.siteSelectHeader}>
                <label htmlFor="site" className={styles.formLabel}>Preferred Casino Site</label>
                <button 
                  type="button" 
                  onClick={toggleMultiSelect}
                  className={`${styles.multiSelectToggle} ${multiSelectMode ? styles.active : ''}`}
                >
                  {multiSelectMode ? 'Select Multiple' : 'Select One'}
                </button>
              </div>
              
              {!multiSelectMode && (
                <select
                  id="site"
                  name="site"
                  value={formData.site}
                  onChange={handleInputChange}
                  className={styles.formSelect}
                >
                  {casinoSites.map((site) => (
                    <option key={site.value} value={site.value}>{site.value}</option>
                  ))}
                </select>
              )}
            </div>
            
            <button type="submit" className={styles.joinButton}>
              Join Waitlist
            </button>
          </form>
        </div>
      </div>
      
      {/* Casino Logo Grid */}
      <div className={styles.casinoLogosSection}>
        <h3 className={styles.casinoLogosTitle}>
          {multiSelectMode ? 'Select Your Preferred Casinos' : 'Our Casino Partners'}
        </h3>
        <div className={styles.casinoLogosGrid}>
          {casinoSites.map((site) => (
            <div 
              key={site.value}
              className={`${styles.casinoLogoCard} ${formData.selectedSites.includes(site.value) ? styles.selected : ''}`}
              onClick={() => toggleSiteSelection(site.value)}
            >
              <Image 
                src={site.logo}
                alt={site.value}
                width={100}
                height={100}
                className={styles.partnerLogo}
              />
              <p className={styles.partnerName}>{site.value}</p>
              {multiSelectMode && (
                <div className={styles.checkmark}>
                  {formData.selectedSites.includes(site.value) && '✓'}
                </div>
              )}
            </div>
          ))}
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
              
              {/* Display the selected casino logo or multi-select crown */}
              {formData.selectedSites.length > 1 ? (
                <Image 
                  src="/images/casino-logos/draftkings-crown.svg"
                  alt="Multiple casinos selected"
                  width={80}
                  height={80}
                  className={styles.popupCasinoLogo}
                />
              ) : (
                <Image 
                  src={selectedSite.logo}
                  alt={selectedSite.value}
                  width={80}
                  height={80}
                  className={styles.popupCasinoLogo}
                />
              )}
            </div>
            
            <h3 className={styles.popupTitle}>
              You're on the List!
            </h3>
            
            <p className={styles.popupMessage}>
              {formData.selectedSites.length > 1 
                ? `We'll notify you when SideBet is live with your selected casinos!` 
                : `We'll notify you when SideBet is live with ${formData.site}!`}
            </p>
            
            {formData.selectedSites.length > 1 && (
              <div className={styles.selectedCasinosContainer}>
                {formData.selectedSites.map(selectedCasinoValue => {
                  const site = casinoSites.find(site => site.value === selectedCasinoValue);
                  if (!site) return null;
                  
                  return (
                    <div key={site.value} className={styles.selectedCasinoItem}>
                      <Image
                        src={site.logo}
                        alt={site.value}
                        width={40}
                        height={40}
                        className={styles.selectedCasinoItemLogo}
                      />
                      <span className={styles.selectedCasinoName}>{site.value}</span>
                    </div>
                  );
                })}
              </div>
            )}
            
            <div className={styles.popupDivider}></div>
            
            {formData.selectedSites.length <= 1 && (
              <>
                <p className={styles.otherSitesText}>Want to be notified about other sites too?</p>
                <div className={styles.otherSitesButtons}>
                  {casinoSites.filter(site => site.value !== formData.site).map((site) => (
                    <button 
                      key={site.value}
                      className={styles.siteButton} 
                      onClick={() => toggleSiteSelection(site.value)}
                    >
                      {site.value}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 