'use client'
import { useRef } from 'react'
import styles from '../chip.module.css'
import { usePrefersReducedMotion } from '../usePrefersReducedMotion'

function magnetize(e: React.PointerEvent<HTMLAnchorElement>, on: boolean) {
  const el = e.currentTarget
  if (!on) { el.style.transform = ''; return }
  const r = el.getBoundingClientRect()
  const dx = (e.clientX - (r.left + r.width / 2)) * 0.25
  const dy = (e.clientY - (r.top + r.height / 2)) * 0.25
  el.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`
}

export default function AudienceButtons() {
  const reduced = usePrefersReducedMotion()
  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => { if (!reduced) magnetize(e, true) }
  const onLeave = (e: React.PointerEvent<HTMLAnchorElement>) => magnetize(e, false)
  return (
    <div className={styles.audienceBtns}>
      <a href="#users" className={`${styles.audienceBtn} ${styles.audiencePrimary}`}
         onPointerMove={onMove} onPointerLeave={onLeave}>For Users</a>
      <a href="#businesses" className={`${styles.audienceBtn} ${styles.audienceSecondary}`}
         onPointerMove={onMove} onPointerLeave={onLeave}>For Businesses</a>
    </div>
  )
}
