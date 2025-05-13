import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import styles from './page.module.css'

export default function Signup() {
  return (
    <main>
      <Navbar />
      <div className={styles.signupContainer}>
        <div className={styles.signupCard}>
          <h1 className={styles.signupTitle}>Create an Account</h1>
          <p className={styles.signupSubtitle}>Join Hedge Payments and experience payments, made fun.</p>
          
          <form className={styles.signupForm}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="firstName">First Name</label>
                <input type="text" id="firstName" placeholder="John" required />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="lastName">Last Name</label>
                <input type="text" id="lastName" placeholder="Doe" required />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" placeholder="your@email.com" required />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input type="password" id="password" placeholder="Create a password" required />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input type="password" id="confirmPassword" placeholder="Confirm your password" required />
            </div>
            
            <div className={styles.accountType}>
              <p className={styles.accountTypeLabel}>Account Type</p>
              <div className={styles.accountOptions}>
                <div className={styles.accountOption}>
                  <input type="radio" id="personal" name="accountType" value="personal" />
                  <label htmlFor="personal">
                    <span className={styles.optionTitle}>Personal</span>
                    <span className={styles.optionDesc}>Use Bankroll for personal payments</span>
                  </label>
                </div>
                
                <div className={styles.accountOption}>
                  <input type="radio" id="business" name="accountType" value="business" />
                  <label htmlFor="business">
                    <span className={styles.optionTitle}>Business</span>
                    <span className={styles.optionDesc}>Use Hedge Round-ups for business</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className={styles.termsCheck}>
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
              </label>
            </div>
            
            <button type="submit" className={styles.signupButton}>Create Account</button>
          </form>
          
          <p className={styles.loginPrompt}>
            Already have an account? <a href="/user-login">Log in</a>
          </p>
        </div>
      </div>
      <Footer />
    </main>
  )
}