'use client'
import styles from '../chip.module.css'
import type { BeatProps } from './types'

export default function SunBeat(_props: BeatProps) {
  return (
    <section className={styles.beat} aria-label="The Sun">
      <div className={styles.beatInner}>
        <h1 className={styles.title}>A Chip and a Chair.</h1>
        <p className={styles.sub}>It only takes a quarter.</p>
      </div>
    </section>
  )
}
