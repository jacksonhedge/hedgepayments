'use client'

import React, { useState, useEffect, FormEvent } from 'react'
import styles from './page.module.css'
import { notifyWaitlistUsers, getWaitlistCount } from '../../utils/emailService'

const WaitlistAdmin = () => {
  const [waitlistCount, setWaitlistCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendSuccess, setSendSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchWaitlistCount = async () => {
      try {
        const count = await getWaitlistCount();
        setWaitlistCount(count);
      } catch (error) {
        console.error('Failed to fetch waitlist count:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWaitlistCount();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!subject.trim() || !message.trim()) {
      alert('Please fill in both subject and message fields');
      return;
    }
    
    setIsSending(true);
    setSendSuccess(null);
    
    try {
      const success = await notifyWaitlistUsers(subject, message);
      setSendSuccess(success);
      
      if (success) {
        // Clear form if successful
        setSubject('');
        setMessage('');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      setSendSuccess(false);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Waitlist Administration</h1>
        <p className={styles.subtitle}>Manage and communicate with your waitlist subscribers</p>
      </div>
      
      <div className={styles.statsCard}>
        <div className={styles.stat}>
          <h2 className={styles.statNumber}>{isLoading ? '...' : waitlistCount}</h2>
          <p className={styles.statLabel}>Total subscribers</p>
        </div>
      </div>
      
      <div className={styles.notificationCard}>
        <h2 className={styles.cardTitle}>Send a Notification</h2>
        <p className={styles.cardDescription}>
          Send an email notification to all users on the waitlist
        </p>
        
        <form className={styles.notificationForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="subject" className={styles.formLabel}>Email Subject</label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={styles.formInput}
              placeholder="e.g., Important SideBet Update"
              disabled={isSending}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="message" className={styles.formLabel}>Email Message</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={styles.formTextarea}
              placeholder="Enter your message to waitlist subscribers..."
              rows={6}
              disabled={isSending}
            />
          </div>
          
          <button
            type="submit"
            className={styles.sendButton}
            disabled={isSending || !subject.trim() || !message.trim()}
          >
            {isSending ? 'Sending...' : 'Send Notification'}
          </button>
        </form>
        
        {sendSuccess === true && (
          <div className={styles.successMessage}>
            Notification sent successfully to all {waitlistCount} subscribers.
          </div>
        )}
        
        {sendSuccess === false && (
          <div className={styles.errorMessage}>
            Error sending notification. Please try again.
          </div>
        )}
      </div>
      
      <div className={styles.templateCard}>
        <h2 className={styles.cardTitle}>Email Templates</h2>
        <p className={styles.cardDescription}>
          Quick templates to send common notifications to your waitlist
        </p>
        
        <div className={styles.templateButtons}>
          <button 
            className={styles.templateButton}
            onClick={() => {
              setSubject('SideBet is Almost Here - Get Ready!');
              setMessage(`Hello,

We're excited to announce that SideBet will be launching soon! We're putting the finishing touches on the platform and can't wait for you to try it.

As an early waitlist member, you'll be among the first to experience SideBet when we go live in the coming weeks.

Stay tuned for more updates!

The SideBet Team`);
            }}
          >
            Launch Announcement
          </button>
          
          <button 
            className={styles.templateButton}
            onClick={() => {
              setSubject('Thank You for Joining the SideBet Waitlist');
              setMessage(`Hello,

We wanted to take a moment to thank you for joining the SideBet waitlist. We're working hard to create an amazing platform that will revolutionize how you interact with your favorite casinos.

With SideBet, every 10¢ of your spare change could win you thousands!

We'll keep you updated on our progress.

The SideBet Team`);
            }}
          >
            Thank You
          </button>
          
          <button 
            className={styles.templateButton}
            onClick={() => {
              setSubject('SideBet Update - New Features Coming Soon');
              setMessage(`Hello,

We wanted to share an exciting update about SideBet. We're adding new casinos and features that will make your experience even better:

- More casino partnerships
- Enhanced winnings potential
- Improved user interface
- New payment options

Stay tuned for more updates as we get closer to launch!

The SideBet Team`);
            }}
          >
            Feature Update
          </button>
        </div>
      </div>
    </div>
  )
}

export default WaitlistAdmin