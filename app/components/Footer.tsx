'use client'

import React from 'react'
import Link from 'next/link'
import styles from './Footer.module.css'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <h3 className={styles.footerLogo}>Hedge Payments</h3>
            <p className={styles.footerTagline}>Payments, made fun.</p>
          </div>
          
          <div className={styles.footerLinks}>
            <div className={styles.linkColumn}>
              <h4 className={styles.linkTitle}>Products</h4>
              <Link href="/hedge-roundups" className={styles.link}>Hedge Round-ups</Link>
              <Link href="/bankroll" className={styles.link}>Bankroll</Link>
              <Link href="/testing" className={styles.link}>App Testing</Link>
            </div>
            
            <div className={styles.linkColumn}>
              <h4 className={styles.linkTitle}>Company</h4>
              <Link href="/about" className={styles.link}>About Us</Link>
              <Link href="/careers" className={styles.link}>Careers</Link>
              <Link href="/contact" className={styles.link}>Contact</Link>
            </div>
            
            <div className={styles.linkColumn}>
              <h4 className={styles.linkTitle}>Resources</h4>
              <Link href="/blog" className={styles.link}>Blog</Link>
              <Link href="/support" className={styles.link}>Support</Link>
              <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
              <Link href="/terms" className={styles.link}>Terms of Service</Link>
            </div>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <p className={styles.copyright}>© {new Date().getFullYear()} Hedge Payments. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer