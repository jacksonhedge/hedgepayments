'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './Navbar.module.css'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Hedge Payments
        </Link>
        
        <div className={styles.menuButton} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        <div className={`${styles.navLinks} ${isMenuOpen ? styles.active : ''}`}>
          <Link href="/testing" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
            App Testing
          </Link>
          <Link href="/business-login" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
            Login for Business
          </Link>
          <Link href="/user-login" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
            Login for Users
          </Link>
          <Link href="/signup" className={`${styles.navLink} ${styles.signupBtn}`} onClick={() => setIsMenuOpen(false)}>
            Sign Up
          </Link>
          <Link href="/sidebet" className={styles.sidebetButton} onClick={() => setIsMenuOpen(false)}>
            <Image 
              src="/images/sidebet-logo.svg" 
              alt="SideBet by Hedge Payments" 
              width={120} 
              height={30} 
              className={styles.sidebetLogo} 
            />
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar