'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './Navbar.module.css'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDevelopersDropdownOpen, setIsDevelopersDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDevelopersDropdown = () => {
    setIsDevelopersDropdownOpen(!isDevelopersDropdownOpen);
  };

  const closeAllDropdowns = () => {
    setIsMenuOpen(false);
    setIsDevelopersDropdownOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>Hedge Payments</span>
        </Link>
        
        <div className={styles.menuButton} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        <div className={`${styles.navLinks} ${isMenuOpen ? styles.active : ''}`}>
          {/* Home Link */}
          <Link href="/" className={styles.navLink} onClick={closeAllDropdowns}>
            Home
          </Link>

          {/* SideBet Link */}
          <Link href="/sidebet" className={styles.navLink} onClick={closeAllDropdowns}>
            SideBet
          </Link>

          {/* Chance Link */}
          <Link href="/chance" className={styles.navLink} onClick={closeAllDropdowns}>
            Chance™
          </Link>

          {/* FantasyLink Link */}
          <Link href="/fantasylink" className={styles.navLink} onClick={closeAllDropdowns}>
            FantasyLink
          </Link>

          {/* Research Link */}
          <Link href="/research" className={styles.navLink} onClick={closeAllDropdowns}>
            Research
          </Link>

          {/* Developers Dropdown */}
          <div className={styles.dropdown}>
            <button 
              className={`${styles.navLink} ${styles.dropdownToggle}`}
              onClick={toggleDevelopersDropdown}
              onMouseEnter={() => setIsDevelopersDropdownOpen(true)}
            >
              Developers
              <svg className={styles.chevron} width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4.427 7.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 7H4.604a.25.25 0 00-.177.427z"/>
              </svg>
            </button>
            <div 
              className={`${styles.dropdownMenu} ${isDevelopersDropdownOpen ? styles.show : ''}`}
              onMouseLeave={() => setIsDevelopersDropdownOpen(false)}
            >
              <Link href="/developers" className={styles.dropdownItem} onClick={closeAllDropdowns}>
                <div className={styles.dropdownItemContent}>
                  <span className={styles.dropdownItemTitle}>🚀 API Overview</span>
                  <span className={styles.dropdownItemDesc}>Get started with Round-Up API</span>
                </div>
              </Link>
              <Link href="/docs" className={styles.dropdownItem} onClick={closeAllDropdowns}>
                <div className={styles.dropdownItemContent}>
                  <span className={styles.dropdownItemTitle}>📚 Documentation</span>
                  <span className={styles.dropdownItemDesc}>Complete API reference & guides</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Partners Link */}
          <Link href="/partners" className={styles.navLink} onClick={closeAllDropdowns}>
            Partners
          </Link>

          {/* Support Link */}
          <Link href="#support" className={styles.navLink} onClick={closeAllDropdowns}>
            Support
          </Link>

          {/* Business Login Button */}
          <Link href="/business-login" className={`${styles.navLink} ${styles.getStartedBtn}`} onClick={closeAllDropdowns}>
            Business Login
          </Link>

          {/* Visit Bankroll Button */}
          <a href="https://bankroll.live" target="_blank" rel="noopener noreferrer" className={`${styles.navLink} ${styles.bankrollBtn}`} onClick={closeAllDropdowns}>
            Visit Bankroll
          </a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar