'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './Navbar.module.css'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBusinessDropdownOpen, setIsBusinessDropdownOpen] = useState(false);
  const [isDevelopersDropdownOpen, setIsDevelopersDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleBusinessDropdown = () => {
    setIsBusinessDropdownOpen(!isBusinessDropdownOpen);
  };

  const toggleDevelopersDropdown = () => {
    setIsDevelopersDropdownOpen(!isDevelopersDropdownOpen);
  };

  const closeAllDropdowns = () => {
    setIsMenuOpen(false);
    setIsBusinessDropdownOpen(false);
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

          {/* For Business Dropdown */}
          <div className={styles.dropdown}>
            <button 
              className={`${styles.navLink} ${styles.dropdownToggle}`}
              onClick={toggleBusinessDropdown}
              onMouseEnter={() => setIsBusinessDropdownOpen(true)}
            >
              For Business
              <svg className={styles.chevron} width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4.427 7.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 7H4.604a.25.25 0 00-.177.427z"/>
              </svg>
            </button>
            <div 
              className={`${styles.dropdownMenu} ${isBusinessDropdownOpen ? styles.show : ''}`}
              onMouseLeave={() => setIsBusinessDropdownOpen(false)}
            >
              <Link href="/business/overview" className={styles.dropdownItem} onClick={closeAllDropdowns}>
                <div className={styles.dropdownItemContent}>
                  <span className={styles.dropdownItemTitle}>Business Solutions</span>
                  <span className={styles.dropdownItemDesc}>Round-up savings for your customers</span>
                </div>
              </Link>
              <Link href="/business/gaming" className={styles.dropdownItem} onClick={closeAllDropdowns}>
                <div className={styles.dropdownItemContent}>
                  <span className={styles.dropdownItemTitle}>Gaming & Sports Betting</span>
                  <span className={styles.dropdownItemDesc}>Boost engagement with micro-savings</span>
                </div>
              </Link>
              <Link href="/business/banking" className={styles.dropdownItem} onClick={closeAllDropdowns}>
                <div className={styles.dropdownItemContent}>
                  <span className={styles.dropdownItemTitle}>Banking & Fintech</span>
                  <span className={styles.dropdownItemDesc}>White-label savings solutions</span>
                </div>
              </Link>
              <Link href="/business/case-studies" className={styles.dropdownItem} onClick={closeAllDropdowns}>
                <div className={styles.dropdownItemContent}>
                  <span className={styles.dropdownItemTitle}>Case Studies</span>
                  <span className={styles.dropdownItemDesc}>See real results from partners</span>
                </div>
              </Link>
            </div>
          </div>

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
              <Link href="/developers/playground" className={styles.dropdownItem} onClick={closeAllDropdowns}>
                <div className={styles.dropdownItemContent}>
                  <span className={styles.dropdownItemTitle}>🎮 API Playground</span>
                  <span className={styles.dropdownItemDesc}>Test endpoints in real-time</span>
                </div>
              </Link>
              <Link href="/developers/mcp" className={styles.dropdownItem} onClick={closeAllDropdowns}>
                <div className={styles.dropdownItemContent}>
                  <span className={styles.dropdownItemTitle}>🤖 AI Integration</span>
                  <span className={styles.dropdownItemDesc}>MCP server for AI agents</span>
                </div>
              </Link>
              <Link href="/developers/examples" className={styles.dropdownItem} onClick={closeAllDropdowns}>
                <div className={styles.dropdownItemContent}>
                  <span className={styles.dropdownItemTitle}>💻 Code Examples</span>
                  <span className={styles.dropdownItemDesc}>SDKs & integration samples</span>
                </div>
              </Link>
              <Link href="/developers/pricing" className={styles.dropdownItem} onClick={closeAllDropdowns}>
                <div className={styles.dropdownItemContent}>
                  <span className={styles.dropdownItemTitle}>💰 API Pricing</span>
                  <span className={styles.dropdownItemDesc}>Flexible usage-based plans</span>
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