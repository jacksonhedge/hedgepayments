'use client'
import { useTransform, type MotionValue } from 'framer-motion'
import { motion } from 'framer-motion'
import { useBeatProgress } from '../useBeatProgress'
import styles from '../chip.module.css'
import type { BeatProps } from './types'

// Seeded, deterministic stations for the cinematic (live data is a later enhancement).
const STATIONS = [
  { kind: 'market', label: 'Will it rain in NYC Saturday?', result: 'YES', gain: 0.4 },
  { kind: 'table', label: 'Roulette', result: '17 red', gain: 1.1 },
  { kind: 'market', label: 'Fed holds rates in July?', result: 'YES', gain: 0.8 },
  { kind: 'table', label: 'Roulette', result: '00 green', gain: 2.0 },
  { kind: 'market', label: 'Home team wins tonight?', result: 'YES', gain: 0.6 },
] as const

export default function ConveyorBeat({ progress, count, reduced }: BeatProps) {
  const p = useBeatProgress(progress, 4, count)
  // Belt slides left as you scroll through this beat.
  const x = useTransform(p, [0, 1], ['10%', '-60%'])

  return (
    <section className={styles.beat} aria-label="The factory floor">
      <div className={styles.beatInner}>
        <h2 className={styles.title}>A floor full of opportunities.</h2>
      </div>
      <div className={styles.beltViewport} aria-hidden={reduced ? undefined : true}>
        <motion.div className={styles.belt} style={reduced ? undefined : { x }}>
          {STATIONS.map((s, i) => (
            <div key={i} className={`${styles.station} ${s.kind === 'table' ? styles.stationTable : styles.stationMarket}`}>
              <span className={styles.stationKind}>{s.kind === 'table' ? 'TABLE' : 'MARKET'}</span>
              <span className={styles.stationLabel}>{s.label}</span>
              <span className={styles.stationResult}>{s.result} · +${s.gain.toFixed(2)}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
