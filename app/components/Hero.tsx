'use client'

import React from 'react'
import styles from './Hero.module.css'
import Link from 'next/link'

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <h1 className={styles.title}>Payments, made fun.</h1>
        <p className={styles.subtitle}>
          Simplifying financial transactions with innovative payment solutions for businesses and consumers.
        </p>
        <div className={styles.buttonGroup}>
          <Link href="/signup" className={styles.primaryBtn}>
            Get Started
          </Link>
          <Link href="/learn-more" className={styles.secondaryBtn}>
            Learn More
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Hero