'use client'

import React from 'react'
import styles from './LogoTicker.module.css'

interface Logo {
  src: string;
  alt: string;
  text?: string;
}

interface LogoTickerProps {
  logos: Logo[];
}

const LogoTicker: React.FC<LogoTickerProps> = ({ logos }) => {
  return (
    <div className={styles.tickerContainer}>
      <div className={styles.tickerWrapper}>
        <div className={styles.tickerContent}>
          {logos.map((logo, index) => (
            <div key={index} className={styles.logoWrapper}>
              {logo.src !== '#' ? (
                <img 
                  src={logo.src} 
                  alt={logo.alt} 
                  className={styles.logo}
                  onError={(e) => {
                    // Fall back to text if image can't be loaded
                    const target = e.target as HTMLImageElement;
                    const parent = target.parentNode as HTMLElement;
                    if (parent) {
                      parent.textContent = logo.text || logo.alt;
                      parent.classList.add(styles.logoText);
                    }
                  }}
                />
              ) : (
                <div className={styles.logoText}>{logo.text || logo.alt}</div>
              )}
            </div>
          ))}
          {/* Duplicate logos for continuous scrolling effect */}
          {logos.map((logo, index) => (
            <div key={`duplicate-${index}`} className={styles.logoWrapper}>
              {logo.src !== '#' ? (
                <img 
                  src={logo.src} 
                  alt={logo.alt} 
                  className={styles.logo}
                  onError={(e) => {
                    // Fall back to text if image can't be loaded
                    const target = e.target as HTMLImageElement;
                    const parent = target.parentNode as HTMLElement;
                    if (parent) {
                      parent.textContent = logo.text || logo.alt;
                      parent.classList.add(styles.logoText);
                    }
                  }}
                />
              ) : (
                <div className={styles.logoText}>{logo.text || logo.alt}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LogoTicker