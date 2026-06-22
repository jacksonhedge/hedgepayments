'use client'

import type { ElementType, ReactNode } from 'react'
import styles from './glass.module.css'

interface GlassPanelProps {
  children: ReactNode
  className?: string
  /** Class for the inner content box (e.g. flex layout for a nav). */
  contentClassName?: string
  /** Render as a different element (e.g. 'nav', 'button', 'li'). */
  as?: ElementType
  [key: string]: unknown
}

/**
 * Reusable liquid-glass surface. Layers:
 *  - filter: backdrop blur + SVG displacement (refracts what's behind)
 *  - tint:   faint translucent fill
 *  - edge:   specular top highlight + inner/outer bevel shadows
 *  - content: the crisp, undistorted children on top
 */
export default function GlassPanel({
  children,
  className = '',
  contentClassName = '',
  as: Tag = 'div',
  ...rest
}: GlassPanelProps) {
  return (
    <Tag className={`${styles.glass} ${className}`} {...rest}>
      <span className={styles.glassFilter} aria-hidden />
      <span className={styles.glassTint} aria-hidden />
      <span className={styles.glassEdge} aria-hidden />
      <span className={`${styles.glassContent} ${contentClassName}`}>{children}</span>
    </Tag>
  )
}
