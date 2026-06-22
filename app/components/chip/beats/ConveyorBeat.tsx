'use client'
import styles from '../chip.module.css'
import type { BeatProps } from './types'

export default function ConveyorBeat(_props: BeatProps) {
  return (
    <section className={styles.beat} aria-label="The factory floor">
      <div className={styles.beatInner}>
        <h2 className={styles.title}>A floor full of opportunities.</h2>
      </div>
    </section>
  )
}
