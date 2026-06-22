'use client'
import styles from '../chip.module.css'
import type { BeatProps } from './types'

// The shared traveling quarter spins through here — this beat is copy only.
export default function MorphBeat(_props: BeatProps) {
  return (
    <section className={styles.beat} aria-label="Becomes a position">
      <div className={styles.beatInner}>
        <h2 className={styles.title}>Your 25¢ becomes a real position.</h2>
        <p className={styles.sub}>Polymarket. Kalshi. Real venues.</p>
      </div>
    </section>
  )
}
