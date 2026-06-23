'use client'

import type { CSSProperties, ReactNode } from 'react'
import { Glass } from '@samasante/liquid-glass'
import styles from './glass.module.css'

interface GlassPanelProps {
  children: ReactNode
  className?: string
  /** Class for the inner content box (e.g. flex layout for a nav). */
  contentClassName?: string
  /** Override/extend the lens optics (frost, dispersion, sheen, glow, …). */
  optics?: Record<string, number>
  /** Accepted for backward-compat; the lens refracts the live DOM continuously,
   *  so the old cursor-tracked sheen is no longer needed. */
  reactive?: boolean
  /** Accepted for backward-compat; <Glass> always renders a div container. */
  as?: unknown
  style?: CSSProperties
  [key: string]: unknown
}

/**
 * Reusable liquid-glass surface, backed by @samasante/liquid-glass.
 *
 * A bare wrap becomes a glass MATERIAL: it frosts + tints + edge-lights the page
 * behind it everywhere, and bends the live DOM through it in Chrome/Edge. The
 * translucent background (set in `.glass`) is the tint; `children` render crisp
 * on top. `width:100%` keeps the lens filling our sized containers (the nav pill,
 * grid cards) instead of shrink-wrapping to content.
 */
export default function GlassPanel({
  children,
  className = '',
  contentClassName = '',
  optics,
  reactive: _reactive,
  as: _as,
  style,
  ...rest
}: GlassPanelProps) {
  return (
    <Glass
      className={`${styles.glass} ${className}`}
      style={{ width: '100%', ...style }}
      optics={{ frost: 7, dispersion: 0.35, ...optics }}
      {...rest}
    >
      <span className={`${styles.glassContent} ${contentClassName}`}>{children}</span>
    </Glass>
  )
}
