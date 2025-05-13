'use client'

import React from 'react'
import styles from './Features.module.css'

const Features: React.FC = () => {
  const features = [
    {
      title: 'Fast Payments',
      description: 'Process transactions quickly and securely with our cutting-edge payment solutions.',
      icon: '💸'
    },
    {
      title: 'Low Fees',
      description: 'Competitive rates that help you maximize your profits and reduce transaction costs.',
      icon: '💰'
    },
    {
      title: 'Secure Platform',
      description: 'Enterprise-grade security keeping your data and transactions safe at all times.',
      icon: '🔒'
    }
  ]

  return (
    <section className={styles.featuresSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Why Choose HedgePay</h2>
        
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features