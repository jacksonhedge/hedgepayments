'use client'

import React, { useState, useEffect } from 'react'
import styles from './JackpotDisplay.module.css'
import Image from 'next/image'

const JackpotDisplay: React.FC = () => {
  const [amount, setAmount] = useState(500000);

  // Simulate increasing jackpot
  useEffect(() => {
    const interval = setInterval(() => {
      setAmount(prev => prev + Math.floor(Math.random() * 50) + 10);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Format number as currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <section className={styles.jackpotSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Current Jackpot Pool</h2>
        <div className={styles.jackpotDisplay}>
          <div className={styles.jackpotAmount}>
            {formatCurrency(amount)}
          </div>
          <p className={styles.jackpotDescription}>
            Join now to participate in our growing pool of available funds.
            The earlier you join, the better your position!
          </p>
          <button className={styles.joinButton}>
            Join Waitlist Today
          </button>
        </div>
      </div>
    </section>
  )
}

export default JackpotDisplay