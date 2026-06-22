'use client'
import styles from '../chip.module.css'
import type { BeatProps } from './types'

export default function MorphBeat(_props: BeatProps) {
  return (
    <section className={styles.beat} aria-label="Becomes a position">
      <div className={styles.beatInner}>
        <h2 className={styles.title}>Your 25¢ becomes a real position.</h2>
      </div>
    </section>
  )
}
