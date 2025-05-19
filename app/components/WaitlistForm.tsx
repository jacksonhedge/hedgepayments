import React, { useState } from 'react';
import styles from './WaitlistForm.module.css';

type Sportsbook = 'FanDuel' | 'DraftKings' | 'Caesars' | 'BetMGM' | 'Fanatics';

interface WaitlistFormProps {
  onSuccess?: () => void;
}

export default function WaitlistForm({ onSuccess }: WaitlistFormProps) {
  const [email, setEmail] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const sportsbookOptions: Sportsbook[] = ['FanDuel', 'DraftKings', 'Caesars', 'BetMGM', 'Fanatics'];
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  
  const handleReferralCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReferralCode(e.target.value);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          referralCode: referralCode || null,
          sportsbooks: sportsbookOptions // Include all sportsbook options by default
        }),
      });
      
      if (response.ok) {
        setSubmitted(true);
        setEmail('');
        setReferralCode('');
        
        // Call the onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }
      } else {
        alert('There was an error submitting your information. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (submitted && !onSuccess) {
    return (
      <div className={styles.formContainer}>
        <h2 className={styles.thankYouTitle}>Thank you for joining our waitlist!</h2>
        <p className={styles.thankYouMessage}>
          We've recorded your information and will notify you when we launch.
        </p>
      </div>
    );
  }
  
  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Your email address"
            required
            className={styles.emailInput}
          />
        </div>
        
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={referralCode}
            onChange={handleReferralCodeChange}
            placeholder="Referral code (optional)"
            className={styles.referralInput}
          />
        </div>
        
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isSubmitting || !email}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Email'}
        </button>
      </form>
    </div>
  );
} 