'use client'
import Link from 'next/link'
import type { ReactNode } from 'react'
import CoinLogo from '../chip/brand/CoinLogo'
import styles from './auth.module.css'

interface Props {
  eyebrow?: string
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}

/** Centered glass auth card on the Old-Vegas cream canvas — clean, Stripe-simple,
 *  brand-warm. Shared by the user + business login pages. */
export default function AuthShell({ eyebrow, title, subtitle, children, footer }: Props) {
  return (
    <main className={styles.root}>
      <div className={styles.blooms} aria-hidden />
      <Link href="/" className={styles.brand}><CoinLogo /> Hedge</Link>
      <div className={styles.cardWrap}>
        <div className={styles.card}>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          {children}
        </div>
        {footer && <div className={styles.belowCard}>{footer}</div>}
        <Link href="/" className={styles.back}>← Back to home</Link>
      </div>
    </main>
  )
}
