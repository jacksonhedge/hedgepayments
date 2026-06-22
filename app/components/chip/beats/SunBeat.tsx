'use client'
import styles from '../chip.module.css'
import type { BeatProps } from './types'

// Hero: big quarter bleeding off the bottom-right (Robinhood proportion) with a slow
// idle spin (CSS). The coin then "drops into the machine" — the tube journey below.
export default function SunBeat(_props: BeatProps) {
  return (
    <section className={styles.beat} aria-label="Fun Payments">
      <div className={styles.heroCoin} aria-hidden />
      <div className={`${styles.beatInner} ${styles.heroInner}`}>
        <h1 className={styles.heroTitle}>Fun Payments.</h1>
        <p className={styles.sub}>It only takes a quarter.</p>
        <p className={styles.scrollCue} aria-hidden>scroll ↓</p>
      </div>
    </section>
  )
}
