'use client'
import styles from '../chip.module.css'
import type { BeatProps } from './types'

export default function WinningsBeat(_props: BeatProps) {
  return (
    <section className={styles.beat} aria-label="The winnings">
      <div className={styles.beatInner}>
        <h2 className={styles.title}>This is how far a quarter can go.</h2>
      </div>
    </section>
  )
}
