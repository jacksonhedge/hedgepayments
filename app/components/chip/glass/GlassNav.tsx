'use client'

import GlassPanel from './GlassPanel'
import styles from './glass.module.css'
import CoinLogo from '../brand/CoinLogo'

type NavGroup = { label: string; items: { label: string; href: string }[] }

const GROUPS: NavGroup[] = [
  {
    label: 'Products',
    items: [
      { label: 'Chance', href: '/chance' },
      { label: 'SideBet', href: '/sidebet' },
      { label: 'Payments', href: '/products' },
    ],
  },
]
const TOP_LINKS = [
  { label: 'For Users', href: '#users' },
  { label: 'For Businesses', href: '#businesses' },
]
const TRAIL_LINKS = [
  { label: 'Developers', href: '/developers' },
  { label: 'Company', href: '/contact' },
]

export default function GlassNav() {
  return (
    <nav className={styles.nav} aria-label="Primary">
      <GlassPanel className={styles.navShell} contentClassName={styles.navBar} reactive>
        <a className={styles.brand} href="/"><CoinLogo /> Hedge</a>
        <div className={styles.navLinks}>
          {TOP_LINKS.map((l) => (
            <a key={l.label} className={styles.navTrigger} href={l.href}>{l.label}</a>
          ))}
          {GROUPS.map((g) => (
            <div key={g.label} className={styles.navItem}>
              <button type="button" className={styles.navTrigger} aria-haspopup="true">
                {g.label} <span className={styles.chev} aria-hidden>▾</span>
              </button>
              <GlassPanel className={styles.navMenu} as="div">
                {g.items.map((it) => (
                  <a key={it.label} className={styles.navMenuLink} href={it.href}>{it.label}</a>
                ))}
              </GlassPanel>
            </div>
          ))}
          {TRAIL_LINKS.map((l) => (
            <a key={l.label} className={styles.navTrigger} href={l.href}>{l.label}</a>
          ))}
        </div>
        <a className={styles.navCta} href="#claim">Get a free quarter</a>
      </GlassPanel>
    </nav>
  )
}
