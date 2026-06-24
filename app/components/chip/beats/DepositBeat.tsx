'use client'
import GlassPanel from '../glass/GlassPanel'
import styles from '../chip.module.css'
import type { BeatProps } from './types'

// The shared traveling quarter rolls into this slot — this beat renders the slot
// scenery + copy only.
export default function DepositBeat(_props: BeatProps) {
  return (
    <section className={styles.beat} aria-label="Deposit">
      <div className={styles.beatInner}>
        <GlassPanel className={styles.slot} contentClassName={styles.slotBody}>
          <span className={styles.slotLabel}>DEPOSIT QUARTER</span>
          <span className={styles.slotMouth} aria-hidden />
        </GlassPanel>
        <p className={styles.sub}>Insert coin to begin.</p>
      </div>
    </section>
  )
}
