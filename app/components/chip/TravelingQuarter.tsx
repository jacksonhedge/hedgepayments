'use client'

import { useEffect, useRef, useState } from 'react'
import {
  animate,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import Quarter from './Quarter'
import styles from './chip.module.css'

export interface TravelingQuarterProps {
  /** Global scroll progress (0..1) across all beats. */
  progress: MotionValue<number>
}

/**
 * ONE silver quarter the user follows the whole way. Driven entirely by global
 * scroll: enters as a HUGE quarter bleeding off the bottom-right (Robinhood
 * proportion), sweeps to centre and fills the screen, rolls into the deposit
 * slot, rides small above the later beats, and is presented at the end.
 *
 * Idle "activation": whenever the visitor stops scrolling (and on first load at
 * the hero), the coin slowly turns on its own to feel alive. Scrolling instantly
 * hands rotation back to the journey.
 */
export default function TravelingQuarter({ progress }: TravelingQuarterProps) {
  const STOPS = [0, 0.06, 0.12, 0.16, 0.22, 0.3, 0.42, 0.62, 0.8, 1]

  const scale = useTransform(progress, STOPS, [2.6, 2.8, 2.9, 3.4, 1, 0.8, 0.55, 0.55, 0.8, 0.8])
  const x = useTransform(progress, STOPS, [
    '34vw', '30vw', '22vw', '0vw', '-10vw', '0vw', '0vw', '0vw', '0vw', '0vw',
  ])
  const y = useTransform(progress, STOPS, [
    '44vh', '30vh', '18vh', '0vh', '6vh', '0vh', '-20vh', '-20vh', '-30vh', '-30vh',
  ])

  // Scroll-driven rotation: upright at the hero + fill frames, one roll into the slot.
  const scrollRotate = useTransform(progress, [0, 0.06, 0.16, 0.22, 0.3, 1], [0, 0, 0, 200, 360, 360])

  // Idle spin layered on top of the scroll rotation. Frozen while scrolling.
  const idleSpin = useMotionValue(0)
  const rotate = useTransform([scrollRotate, idleSpin], ([s, i]: number[]) => s + i)

  // Start idle so the hero coin is alive immediately; any scroll cancels it for ~1.6s.
  const [idle, setIdle] = useState(true)
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useMotionValueEvent(progress, 'change', () => {
    setIdle(false)
    if (idleTimer.current) clearTimeout(idleTimer.current)
    idleTimer.current = setTimeout(() => setIdle(true), 1600)
  })

  useEffect(() => {
    if (!idle) return
    // Slow, ambient full turn; loops seamlessly because 360° ≡ 0°.
    const controls = animate(idleSpin, idleSpin.get() + 360, {
      duration: 12,
      ease: 'linear',
      repeat: Infinity,
      repeatType: 'loop',
    })
    return () => controls.stop()
  }, [idle, idleSpin])

  // Stays a coin throughout — the copy carries "becomes a real position", not a logo swap.
  const morph = useTransform(progress, [0, 1], [0, 0])

  return (
    <div className={styles.travelLayer} aria-hidden>
      <Quarter scale={scale} rotate={rotate} x={x} y={y} morph={morph} variant="silver" />
    </div>
  )
}
