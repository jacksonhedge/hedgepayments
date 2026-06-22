'use client'

import { useTransform, type MotionValue } from 'framer-motion'
import Quarter from './Quarter'
import styles from './chip.module.css'

export interface TravelingQuarterProps {
  /** Global scroll progress (0..1) across all beats. */
  progress: MotionValue<number>
}

/**
 * ONE silver quarter the user follows the whole way. Driven entirely by global
 * scroll, it: enters from below the fold → settles as the hero → scales up to
 * "peak grandeur" → rolls toward the deposit slot → rides above the markets /
 * tables / winnings → and is finally presented as the free quarter. It is a
 * single fixed element so the visitor tracks the same coin end to end.
 *
 * Stops below are global scroll fractions (0..1) across the six sticky beats:
 * Sun ~0–.17 · Deposit ~.17–.33 · Morph ~.33–.50 · Conveyor ~.50–.67 ·
 * Winnings ~.67–.83 · Claim ~.83–1.
 */
export default function TravelingQuarter({ progress }: TravelingQuarterProps) {
  const STOPS = [0, 0.06, 0.12, 0.16, 0.22, 0.3, 0.42, 0.62, 0.8, 1]

  // Hero: a HUGE quarter bleeding off the bottom-right (Robinhood "globe" proportion).
  // Then it sweeps to centre and scales up to fill the screen, shrinks to roll into the
  // deposit slot, rides small above the later beats, and is presented at the end.
  const scale = useTransform(progress, STOPS, [2.6, 2.8, 2.9, 3.4, 1, 0.8, 0.55, 0.55, 0.8, 0.8])

  // Off the right edge for the hero, swings to centre for the fill, rolls left to the slot.
  const x = useTransform(progress, STOPS, [
    '34vw', '30vw', '22vw', '0vw', '-10vw', '0vw', '0vw', '0vw', '0vw', '0vw',
  ])

  // Off the bottom for the hero, centres to fill, then lifts to ride above later copy.
  const y = useTransform(progress, STOPS, [
    '44vh', '30vh', '18vh', '0vh', '6vh', '0vh', '-20vh', '-20vh', '-30vh', '-30vh',
  ])

  // Stays upright at the hero + fill-screen frames (face-up), spins once while rolling
  // into the slot, then settles upright for the rest of the ride.
  const rotate = useTransform(progress, [0, 0.06, 0.16, 0.22, 0.3, 1], [0, 0, 0, 200, 360, 360])

  // Stays a coin throughout — the copy carries "becomes a real position", not a logo swap.
  const morph = useTransform(progress, [0, 1], [0, 0])

  return (
    <div className={styles.travelLayer} aria-hidden>
      <Quarter scale={scale} rotate={rotate} x={x} y={y} morph={morph} variant="silver" />
    </div>
  )
}
