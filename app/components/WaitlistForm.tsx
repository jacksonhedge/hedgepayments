import React, { useState, useEffect } from 'react';
import styles from './WaitlistForm.module.css';

type Sportsbook = 'FanDuel' | 'DraftKings' | 'Caesars' | 'BetMGM' | 'Fanatics';

interface WaitlistFormProps {
  onSuccess?: () => void;
  initialReferralCode?: string;
}

export default function WaitlistForm({ onSuccess, initialReferralCode }: WaitlistFormProps) {
  const [email, setEmail] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [userReferralCode, setUserReferralCode] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  
  const sportsbookOptions: Sportsbook[] = ['FanDuel', 'DraftKings', 'Caesars', 'BetMGM', 'Fanatics'];
  
  // Set initial referral code if provided
  useEffect(() => {
    if (initialReferralCode) {
      setReferralCode(initialReferralCode);
    }
  }, [initialReferralCode]);
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  
  const handleReferralCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReferralCode(e.target.value);
  };
  
  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(userReferralCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
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
      
      const data = await response.json();
      
      if (response.ok) {
        setSubmitted(true);
        if (data.referralCode) {
          setUserReferralCode(data.referralCode);
        }
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
        
        {userReferralCode && (
          <div className={styles.referralCodeSection}>
            <p className={styles.referralCodeLabel}>Your referral code to share:</p>
            <div className={styles.referralCodeBox}>
              <span className={styles.referralCodeText}>{userReferralCode}</span>
              <button
                type="button"
                onClick={copyReferralCode}
                className={styles.copyButton}
              >
                {isCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className={styles.referralInstructions}>
              Share this code with friends to earn rewards when they sign up!
            </p>
          </div>
        )}
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
            placeholder="Referral Code or User Email (optional)"
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