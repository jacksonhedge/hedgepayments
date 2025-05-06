'use client'

import React from 'react'
import styles from './Features.module.css'

const features = [
  {
    title: 'Hedge Round-ups',
    description: 'A B2B payment solution that streamlines transactions and improves financial management for businesses.',
    icon: '💼'
  },
  {
    title: 'Bankroll',
    description: 'A consumer wallet similar to Venmo that makes peer-to-peer payments simple, fast, and secure.',
    icon: '💰'
  },
  {
    title: 'Secure Transactions',
    description: 'Advanced security features to protect your financial information and transactions.',
    icon: '🔒'
  },
]

const Features = () => {
  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Our Products</h2>
        <div className={styles.featureGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.iconContainer}>
                <span className={styles.icon}>{feature.icon}</span>
              </div>
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