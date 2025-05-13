import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import styles from './page.module.css'

export default function Contact() {
  return (
    <main>
      <Navbar />
      <div className={styles.contactContainer}>
        <div className={styles.contactHeader}>
          <h1 className={styles.contactTitle}>Get in Touch</h1>
          <p className={styles.contactSubtitle}>
            Have questions about our products or services? We're here to help!
          </p>
        </div>
        
        <div className={styles.contactContent}>
          <div className={styles.contactForm}>
            <h2 className={styles.formTitle}>Send us a message</h2>
            <form>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="firstName">First Name*</label>
                  <input type="text" id="firstName" placeholder="Your first name" required />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="lastName">Last Name*</label>
                  <input type="text" id="lastName" placeholder="Your last name" required />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="email">Email Address*</label>
                <input type="email" id="email" placeholder="your@email.com" required />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="subject">Subject*</label>
                <input type="text" id="subject" placeholder="How can we help you?" required />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="message">Message*</label>
                <textarea id="message" placeholder="Please describe your inquiry in detail..." rows={5} required></textarea>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" required />
                  <span>I agree to the privacy policy and terms of service</span>
                </label>
              </div>
              
              <button type="submit" className={styles.submitButton}>Send Message</button>
            </form>
          </div>
          
          <div className={styles.contactInfo}>
            <div className={styles.infoCard}>
              <h3 className={styles.infoTitle}>Contact Information</h3>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>📧</div>
                <div className={styles.infoContent}>
                  <h4>Email</h4>
                  <p>info@hedgepayments.com</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>📱</div>
                <div className={styles.infoContent}>
                  <h4>Phone</h4>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>🏢</div>
                <div className={styles.infoContent}>
                  <h4>Address</h4>
                  <p>123 Financial District<br />New York, NY 10001</p>
                </div>
              </div>
            </div>
            
            <div className={styles.infoCard}>
              <h3 className={styles.infoTitle}>Business Hours</h3>
              <p className={styles.hoursText}>Monday - Friday: 9AM - 5PM EST</p>
              <p className={styles.hoursText}>Saturday - Sunday: Closed</p>
              <p className={styles.supportText}>24/7 Support for existing customers</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}