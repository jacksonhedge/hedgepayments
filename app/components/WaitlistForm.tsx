import React, { useState } from 'react';
import styles from './WaitlistForm.module.css';

type Sportsbook = 'FanDuel' | 'DraftKings' | 'Caesars' | 'BetMGM' | 'Fanatics';

interface WaitlistFormProps {
  onSuccess?: () => void;
}

export default function WaitlistForm({ onSuccess }: WaitlistFormProps) {
  const [email, setEmail] = useState('');
  const [selectedBooks, setSelectedBooks] = useState<Sportsbook[]>([]);
  const [submitted, setSubmitted] = useState(false);
  
  const sportsbookOptions: Sportsbook[] = ['FanDuel', 'DraftKings', 'Caesars', 'BetMGM', 'Fanatics'];
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  
  const toggleSportsbook = (book: Sportsbook) => {
    if (selectedBooks.includes(book)) {
      setSelectedBooks(selectedBooks.filter(item => item !== book));
    } else {
      setSelectedBooks([...selectedBooks, book]);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          sportsbooks: selectedBooks
        }),
      });
      
      if (response.ok) {
        setSubmitted(true);
        setEmail('');
        setSelectedBooks([]);
        
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
    }
  };
  
  if (submitted && !onSuccess) {
    return (
      <div className={styles.formContainer}>
        <h2 className={styles.thankYouTitle}>Thank you for joining our waitlist!</h2>
        <p className={styles.thankYouMessage}>
          We've recorded your sportsbook preferences and will notify you when we launch.
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
        
        {email && (
          <>
            <p className={styles.selectPrompt}>
              Please select which site(s) you would like a free $10 on:
            </p>
            
            <div className={styles.sportsbooksContainer}>
              {sportsbookOptions.map((book) => (
                <div key={book} className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    id={`sportsbook-${book}`}
                    checked={selectedBooks.includes(book)}
                    onChange={() => toggleSportsbook(book)}
                    className={styles.checkbox}
                  />
                  <label 
                    htmlFor={`sportsbook-${book}`}
                    className={selectedBooks.includes(book) ? styles.selectedLabel : styles.label}
                  >
                    {book}
                  </label>
                </div>
              ))}
            </div>
            
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={selectedBooks.length === 0}
            >
              Submit for free $10 gift cards
            </button>
          </>
        )}
      </form>
    </div>
  );
} 