'use client'

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import styles from './Hero.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { subscribeToWaitlist, getWaitlistCount } from '../utils/emailService'
import { states } from '../utils/statesList'
import { casinos } from '../utils/casinosList'

type FormData = {
  name: string;
  email: string;
  state: string;
  selectedCasinos: string[];
  referralCode: string;
}

type FormErrors = {
  name: string;
  email: string;
  state: string;
  selectedCasinos: string;
  referralCode: string;
}

const Hero = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    state: '',
    selectedCasinos: [],
    referralCode: '',
  });
  const [errors, setErrors] = useState<FormErrors>({
    name: '',
    email: '',
    state: '',
    selectedCasinos: '',
    referralCode: '',
  });
  const [waitlistCount, setWaitlistCount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch waitlist count on component mount
  useEffect(() => {
    const fetchWaitlistCount = async () => {
      try {
        const count = await getWaitlistCount();
        setWaitlistCount(count);
      } catch (error) {
        console.error('Failed to fetch waitlist count:', error);
        // Fallback to a default count if the fetch fails
        setWaitlistCount(523);
      }
    };

    fetchWaitlistCount();
  }, []);

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

  // Handle checkbox toggle for casino selection
  const handleCasinoToggle = (casinoId: string) => {
    const updatedCasinos = [...formData.selectedCasinos];
    
    if (updatedCasinos.includes(casinoId)) {
      // Remove casino if already selected
      const index = updatedCasinos.indexOf(casinoId);
      if (index > -1) {
        updatedCasinos.splice(index, 1);
      }
    } else {
      // Add casino if not already selected
      updatedCasinos.push(casinoId);
    }
    
    setFormData({
      ...formData,
      selectedCasinos: updatedCasinos
    });
    
    // Clear error if any casinos are selected
    if (updatedCasinos.length > 0 && errors.selectedCasinos) {
      setErrors({
        ...errors,
        selectedCasinos: ''
      });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: '', email: '', state: '', selectedCasinos: '', referralCode: '' };

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

    if (!formData.state) {
      newErrors.state = 'State is required';
      valid = false;
    }

    if (formData.selectedCasinos.length === 0) {
      newErrors.selectedCasinos = 'Please select at least one casino';
      valid = false;
    }

    // Note: Referral code is optional, so no validation required

    setErrors(newErrors as FormErrors);
    return valid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Subscribe user to waitlist
        const success = await subscribeToWaitlist({
          name: formData.name,
          email: formData.email,
          state: formData.state,
          selectedCasinos: formData.selectedCasinos,
          referralCode: formData.referralCode
        });
        
        if (success) {
          setSubmitSuccess(true);
          // Increment waitlist count locally
          setWaitlistCount(prevCount => prevCount + 1);
          // Show success popup
          setShowPopup(true);
          // Reset form
          setFormData({ name: '', email: '', state: '', selectedCasinos: [], referralCode: '' });
        } else {
          // Handle subscription failure
          console.error('Failed to subscribe to waitlist');
          setSubmitSuccess(false);
        }
      } catch (error) {
        console.error('Error subscribing to waitlist:', error);
        setSubmitSuccess(false);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <section className={styles.hero}>
      <div className={styles.snowContainer}>
        {[...Array(100)].map((_, index) => (
          <div key={index} className={styles.snowflake} style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 10 + 5}s`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: Math.random() * 0.7 + 0.3
          }} />
        ))}
      </div>
      <div className={styles.container}>
        {/* Waitlist Form */}
        <div className={styles.waitlistContainer}>
          <div className={styles.waitlistHeader}>
            <Image
              src="/images/sidebet-text-logo.svg"
              alt="SideBet by Hedge Payments"
              width={300}
              height={80}
              className={styles.waitlistLogo}
            />
            <div className={styles.waitlistHeaderText}>
              <span className={styles.waitlistTagline}>Spare Change Wagering</span>
            </div>
          </div>
          
          <div className={styles.waitlistContent}>
            <h2 className={styles.waitlistTitle}>Join the Exclusive Waitlist</h2>
            <p className={styles.waitlistDescription}>
              Be the first to experience the future of sports betting. Sign up now for early access and get notified when we launch!
            </p>
            
            <form className={styles.waitlistForm} onSubmit={handleSubmit}>
              <div className={styles.formFields}>
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />
                  {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="state" className={styles.formLabel}>Your State</label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`${styles.formSelect} ${errors.state ? styles.inputError : ''}`}
                    disabled={isSubmitting}
                  >
                    <option value="">Select your state</option>
                    {states.map(state => (
                      <option key={state.value} value={state.value}>
                        {state.label} ({state.value})
                      </option>
                    ))}
                  </select>
                  {errors.state && <span className={styles.errorMessage}>{errors.state}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="referralCode" className={styles.formLabel}>Referral Code <span className={styles.optionalLabel}>(optional)</span></label>
                  <input
                    type="text"
                    id="referralCode"
                    name="referralCode"
                    value={formData.referralCode}
                    onChange={handleInputChange}
                    className={`${styles.formInput} ${errors.referralCode ? styles.inputError : ''}`}
                    placeholder="Enter code if you have one"
                    disabled={isSubmitting}
                  />
                  {errors.referralCode && <span className={styles.errorMessage}>{errors.referralCode}</span>}
                </div>
              </div>
              
              <div className={styles.casinoSelectContainer}>
                <h3 className={styles.casinoSelectTitle}>Select Casinos to be notified for:</h3>
                <div className={styles.casinosGrid}>
                  {casinos.map(casino => (
                    <div 
                      key={casino.id}
                      className={`${styles.casinoOption} ${formData.selectedCasinos.includes(casino.id) ? styles.casinoSelected : ''}`}
                      onClick={() => handleCasinoToggle(casino.id)}
                    >
                      <div className={styles.casinoCheckbox}>
                        {formData.selectedCasinos.includes(casino.id) && (
                          <div className={styles.checkboxInner}></div>
                        )}
                      </div>
                      <span className={styles.casinoName}>{casino.name}</span>
                    </div>
                  ))}
                </div>
                {errors.selectedCasinos && <span className={styles.errorMessage}>{errors.selectedCasinos}</span>}
              </div>

              <button 
                type="submit" 
                className={styles.joinButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Joining...' : 'Join Waitlist'}
              </button>
            </form>
            
            <div className={styles.waitlistStats}>
              <div className={styles.statCounter}>
                <span className={styles.statNumber}>{waitlistCount}</span>
                <span className={styles.statLabel}>People on Waitlist</span>
              </div>
            </div>
          </div>
        </div>

        {/* Original Hero Content */}
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Payments, made fun.</h1>
          <p className={styles.subtitle}>
            Simplifying financial transactions with innovative payment solutions for businesses and consumers.
          </p>
          <div className={styles.buttonGroup}>
            <Link href="/signup" className={styles.primaryBtn}>
              Get Started
            </Link>
            <Link href="/learn-more" className={styles.secondaryBtn}>
              Learn More
            </Link>
          </div>
        </div>
        
        {/* Success Popup */}
        {showPopup && (
          <div className={styles.popupOverlay}>
            <div className={styles.popup}>
              <button className={styles.closeButton} onClick={closePopup}>×</button>

              <div className={styles.popupContent}>
                <Image
                  src="/images/sidebet-text-logo.svg"
                  alt="SideBet by Hedge Payments"
                  width={200}
                  height={50}
                  className={styles.popupLogo}
                />

                <h3 className={styles.popupTitle}>
                  You're on the List!
                </h3>

                <p className={styles.popupMessage}>
                  We'll notify you when SideBet is live. You're now part of our exclusive community of <span className={styles.highlightText}>{waitlistCount}</span> early adopters!
                </p>

                <p className={styles.popupDescription}>
                  SideBet allows you to round up your spare change and turn it into casino winnings. 
                  Every 10¢ can win you thousands!
                </p>

                <div className={styles.popupStateInfo}>
                  <p className={styles.popupStateMessage}>
                    We'll prioritize launching in <span className={styles.highlightText}>{formData.state || 'your state'}</span> based on your location.
                  </p>
                  {formData.referralCode && (
                    <p className={styles.popupReferralMessage}>
                      Referral code <span className={styles.highlightText}>{formData.referralCode}</span> applied!
                    </p>
                  )}
                </div>
                
                <div className={styles.popupCasinosInfo}>
                  <p className={styles.popupCasinosMessage}>
                    You'll be notified when we launch with the following casinos:
                  </p>
                  <div className={styles.popupCasinosList}>
                    {formData.selectedCasinos.map(casinoId => {
                      const casino = casinos.find(c => c.id === casinoId);
                      return casino ? (
                        <div key={casinoId} className={styles.popupCasinoItem}>
                          {casino.name}
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>

                <div className={styles.popupFooter}>
                  <p className={styles.popupNote}>
                    Check your email for a confirmation message from us. Be sure to add us to your contacts to ensure you don't miss any updates!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Hero