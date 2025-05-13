import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import styles from './page.module.css'

export default function BusinessLogin() {
  return (
    <main>
      <Navbar />
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <h1 className={styles.loginTitle}>Business Login</h1>
          <p className={styles.loginSubtitle}>Access your Hedge Round-ups dashboard</p>
          
          <form className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" placeholder="your@company.com" required />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input type="password" id="password" placeholder="••••••••" required />
            </div>
            
            <div className={styles.formOptions}>
              <div className={styles.rememberMe}>
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <a href="/forgot-password" className={styles.forgotPassword}>Forgot password?</a>
            </div>
            
            <button type="submit" className={styles.loginButton}>Log In</button>
          </form>
          
          <p className={styles.signupPrompt}>
            Don&#39;t have an account yet? <a href="/signup">Sign up</a>
          </p>
        </div>
      </div>
      <Footer />
    </main>
  )
}