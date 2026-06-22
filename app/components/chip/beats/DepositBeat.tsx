'use client'
import styles from '../chip.module.css'
import type { BeatProps } from './types'

export default function DepositBeat(_props: BeatProps) {
  return (
    <section className={styles.beat} aria-label="Deposit">
      <div className={styles.beatInner}>
        <h2 className={styles.title}>DEPOSIT QUARTER</h2>
        <p className={styles.sub}>Insert coin to begin.</p>
      </div>
    </section>
  )
}
