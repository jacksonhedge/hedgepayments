'use client'
import styles from '../chip.module.css'
import type { BeatProps } from './types'

// The shared traveling quarter rolls into this slot — this beat renders the slot
// scenery + copy only.
export default function DepositBeat(_props: BeatProps) {
  return (
    <section className={styles.beat} aria-label="Deposit">
      <div className={styles.beatInner}>
        <div className={styles.slot}>
          <span className={styles.slotLabel}>DEPOSIT QUARTER</span>
          <span className={styles.slotMouth} aria-hidden />
        </div>
        <p className={styles.sub}>Insert coin to begin.</p>
      </div>
    </section>
  )
}
