'use client'
import styles from '../chip.module.css'
import type { ClaimBeatProps } from './types'

export default function ClaimBeat(_props: ClaimBeatProps) {
  return (
    <section id="claim" className={styles.beat} aria-label="Take your free quarter">
      <div className={styles.beatInner}>
        <h2 className={styles.title}>Take your free quarter.</h2>
      </div>
    </section>
  )
}
