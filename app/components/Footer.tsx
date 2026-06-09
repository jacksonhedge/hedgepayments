'use client'

import React from 'react'
import Link from 'next/link'
import styles from './Footer.module.css'

const Footer: React.FC = () => {
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h4 className={styles.footerHeading}>Round-Ups</h4>
          <p className={styles.footerText}>
            Turn spare change into winnings. Automatically round up your purchases and play on your favorite platforms.
          </p>
        </div>

        <div className={styles.footerSection}>
          <h4 className={styles.footerHeading}>Quick Links</h4>
          <ul className={styles.footerLinks}>
            <li><a href="/" className={styles.footerLink}>Home</a></li>
            <li><a href="/developers" className={styles.footerLink}>Developers</a></li>
            <li><a href="/contact" className={styles.footerLink}>Support</a></li>
            <li><a href="/contact" className={styles.footerLink}>Contact</a></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h4 className={styles.footerHeading}>Our Products</h4>
          <ul className={styles.footerLinks}>
            <li><a href="/chance" className={styles.footerLink}>Chance™</a></li>
            <li><a href="/sidebet" className={styles.footerLink}>SideBet</a></li>
            <li><a href="https://bankroll.live" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>Bankroll</a></li>
            <li><a href="https://fraternitybase.com" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>FraternityBase</a></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h4 className={styles.footerHeading}>Legal</h4>
          <ul className={styles.footerLinks}>
            <li><a href="#" className={styles.footerLink}>Privacy Policy</a></li>
            <li><a href="#" className={styles.footerLink}>Terms of Service</a></li>
            <li><a href="#" className={styles.footerLink}>Responsible Gaming</a></li>
          </ul>
        </div>

      </div>
      <div className={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()} Hedge Payments. All rights reserved.</p>
        <p>If you or someone you know has a gambling problem, call 1-800-GAMBLER.</p>
      </div>
    </footer>
  )
}

export default Footer