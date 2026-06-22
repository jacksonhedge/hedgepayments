'use client'

import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import GlassPanel from '../glass/GlassPanel'
import styles from './tube.module.css'

// Winding "coin-sorter" path in a 1000 x 1360 viewBox: switchbacks down + around.
const TUBE =
  'M 520 -40 C 520 90 500 150 400 210 C 250 290 180 340 180 440 ' +
  'C 180 540 340 580 520 580 C 700 580 840 540 840 660 ' +
  'C 840 780 690 820 520 820 C 350 820 190 860 190 970 ' +
  'C 190 1070 350 1110 520 1110 C 660 1110 770 1140 770 1240 ' +
  'C 770 1330 640 1360 520 1370'

const VIEW_W = 1000
const VIEW_H = 1360
const COIN = 96 // coin diameter in viewBox units

type Station = { key: string; at: number; pos: string; title: string; body: string }

// Info that pops in as the coin reaches each bend (reuses the journey copy).
const STATIONS: Station[] = [
  { key: 'deposit', at: 0.14, pos: 'topRight', title: 'DEPOSIT QUARTER', body: 'Your 25¢ drops into the machine.' },
  { key: 'position', at: 0.4, pos: 'left', title: 'Your 25¢ becomes a real position.', body: 'Polymarket. Kalshi. Real venues.' },
  { key: 'floor', at: 0.62, pos: 'right', title: 'A floor full of opportunities.', body: 'Markets resolve. Tables land. It rides on.' },
  { key: 'winnings', at: 0.85, pos: 'bottomLeft', title: 'This is how far a quarter can go.', body: '$18.75' },
]

export default function TubeJourney() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const coinRef = useRef<SVGGElement>(null)

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })

  // Move the coin along the tube as you scroll the section.
  const place = (p: number) => {
    const path = pathRef.current
    const coin = coinRef.current
    if (!path || !coin || typeof path.getTotalLength !== 'function') return
    const len = path.getTotalLength()
    const t = Math.min(1, Math.max(0, (p - 0.04) / 0.9))
    const pt = path.getPointAtLength(t * len)
    coin.setAttribute('transform', `translate(${pt.x} ${pt.y}) rotate(${t * 900})`)
  }
  useEffect(() => { place(scrollYProgress.get()) }, []) // eslint-disable-line react-hooks/exhaustive-deps
  useMotionValueEvent(scrollYProgress, 'change', place)

  return (
    <section ref={sectionRef} className={styles.section} aria-label="The machine">
      <div className={styles.sticky}>
        <div className={styles.stage}>
          <svg className={styles.svg} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} aria-hidden>
            <path d={TUBE} className={styles.tubeWall} />
            <path d={TUBE} className={styles.tubeChannel} />
            <path d={TUBE} className={styles.tubeRim} />
            {/* invisible measuring path == the visible one */}
            <path ref={pathRef} d={TUBE} fill="none" stroke="none" />
            <g ref={coinRef}>
              <image
                href="/images/chip/quarter.png"
                x={-COIN / 2}
                y={-COIN / 2}
                width={COIN}
                height={COIN}
                style={{ filter: 'drop-shadow(0 8px 14px rgba(0,0,0,.5))' }}
              />
            </g>
          </svg>

          {STATIONS.map((s) => (
            <StationCard key={s.key} station={s} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StationCard({ station, progress }: { station: Station; progress: ReturnType<typeof useScroll>['scrollYProgress'] }) {
  const opacity = useTransform(progress, [station.at - 0.1, station.at - 0.02, station.at + 0.12, station.at + 0.2], [0, 1, 1, 0])
  const y = useTransform(progress, [station.at - 0.1, station.at - 0.02], [26, 0])

  return (
    <motion.div className={`${styles.card} ${styles[station.pos]}`} style={{ opacity, y }}>
      <GlassPanel contentClassName={styles.cardBody}>
        <h3 className={styles.cardTitle}>{station.title}</h3>
        <p className={styles.cardBodyText}>{station.body}</p>
      </GlassPanel>
    </motion.div>
  )
}
