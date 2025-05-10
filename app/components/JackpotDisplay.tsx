'use client'

import React, { useState, useEffect } from 'react'
import styles from './JackpotDisplay.module.css'
import Image from 'next/image'

const JackpotDisplay = () => {
  // Mock jackpot values with animation
  const [megaJackpot, setMegaJackpot] = useState(53923.59);
  const [majorJackpot, setMajorJackpot] = useState(7273.72);
  const [minorJackpot, setMinorJackpot] = useState(1400.62);
  const [miniJackpot, setMiniJackpot] = useState(284.21);

  // Animate jackpot values slowly increasing
  useEffect(() => {
    const interval = setInterval(() => {
      setMegaJackpot(prev => +(prev + Math.random() * 0.5).toFixed(2));
      setMajorJackpot(prev => +(prev + Math.random() * 0.1).toFixed(2));
      setMinorJackpot(prev => +(prev + Math.random() * 0.05).toFixed(2));
      setMiniJackpot(prev => +(prev + Math.random() * 0.01).toFixed(2));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.jackpotContainer}>
      <div className={styles.roundupSection}>
        <h2 className={styles.heading}>Spare change<br />round-ups add up!</h2>
        <p className={styles.subheading}>$0.10 will be added to your round-up balance</p>
        
        <div className={styles.coffeeExample}>
          <div className={styles.coffeeImageWrapper}>
            <div className={styles.coffeeImage}></div>
            <div className={styles.arrowAmount}>
              <div className={styles.arrow}></div>
              <span className={styles.amountText}>$ 0.40</span>
            </div>
          </div>

          <div className={styles.purchaseDetail}>
            <div className={styles.purchaseIcon}>
              <div className={styles.iconCircle}>
                <span className={styles.iconContent}>☕</span>
              </div>
            </div>
            <div className={styles.purchaseInfo}>
              <div className={styles.purchaseName}>Coffee</div>
              <div className={styles.purchaseDate}>1/1/21</div>
            </div>
            <div className={styles.purchaseAmount}>$3.60</div>
          </div>

          <div className={styles.roundupButton}>
            <div className={styles.roundupIcon}>
              <div className={styles.roundupCircle}>
                <span className={styles.roundupContent}>↑</span>
              </div>
            </div>
            <div className={styles.roundupText}>Round-Up</div>
            <div className={styles.roundupAmount}>+$0.40</div>
          </div>
        </div>
      </div>

      <div className={styles.jackpotsSection}>
        <div className={styles.jackpotsHeading}>
          <div className={styles.jackpotsTitle}>JACKPOTS</div>
        </div>

        <div className={styles.jackpotInfo}>
          <h3 className={styles.jackpotChance}>$0.10 gives you a chance to<br />win 1 of the 4 jackpots!</h3>
          <p className={styles.jackpotSubtext}>The more people play, higher the jackpots grow</p>
        </div>

        <div className={styles.jackpotTiers}>
          <div className={styles.jackpotTier}>
            <div className={styles.jackpotBadge} style={{backgroundColor: '#9f3ed5'}}>
              <span className={styles.jackpotName}>MEGA</span>
            </div>
            <div className={styles.tierInfo}>
              <div className={styles.tierName}>MEGA JACKPOT</div>
              <div className={styles.tierAmount}>${megaJackpot.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
          </div>

          <div className={styles.jackpotTier}>
            <div className={styles.jackpotBadge} style={{backgroundColor: '#e03e9a'}}>
              <span className={styles.jackpotName}>MAJOR</span>
            </div>
            <div className={styles.tierInfo}>
              <div className={styles.tierName}>MAJOR JACKPOT</div>
              <div className={styles.tierAmount}>${majorJackpot.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
          </div>

          <div className={styles.jackpotTier}>
            <div className={styles.jackpotBadge} style={{backgroundColor: '#07c9c3'}}>
              <span className={styles.jackpotName}>MINOR</span>
            </div>
            <div className={styles.tierInfo}>
              <div className={styles.tierName}>MINOR JACKPOT</div>
              <div className={styles.tierAmount}>${minorJackpot.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
          </div>

          <div className={styles.jackpotTier}>
            <div className={styles.jackpotBadge} style={{backgroundColor: '#ff3a8c'}}>
              <span className={styles.jackpotName}>MINI</span>
            </div>
            <div className={styles.tierInfo}>
              <div className={styles.tierName}>MINI JACKPOT</div>
              <div className={styles.tierAmount}>${miniJackpot.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JackpotDisplay