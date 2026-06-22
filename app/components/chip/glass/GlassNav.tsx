'use client'

import GlassPanel from './GlassPanel'
import styles from './glass.module.css'

type NavGroup = { label: string; items: { label: string; href: string }[] }

const GROUPS: NavGroup[] = [
  {
    label: 'Product',
    items: [
      { label: 'Payments', href: '#' },
      { label: 'Chance', href: '/chance' },
      { label: 'SideBet', href: '/sidebet' },
    ],
  },
  {
    label: 'Resources',
    items: [
      { label: 'Documentation', href: '/docs' },
      { label: 'Guides', href: '#' },
    ],
  },
  {
    label: 'Company',
    items: [
      { label: 'About', href: '#' },
      { label: 'Careers', href: '#' },
    ],
  },
]

export default function GlassNav() {
  return (
    <nav className={styles.nav} aria-label="Primary">
      <GlassPanel className={styles.navShell} contentClassName={styles.navBar}>
        <a className={styles.brand} href="/">Hedge</a>
        <div className={styles.navLinks}>
          {GROUPS.map((g) => (
            <div key={g.label} className={styles.navItem}>
              <button type="button" className={styles.navTrigger} aria-haspopup="true">
                {g.label} <span className={styles.chev} aria-hidden>▾</span>
              </button>
              <GlassPanel className={styles.navMenu} as="div">
                {g.items.map((it) => (
                  <a key={it.label} className={styles.navMenuLink} href={it.href}>
                    {it.label}
                  </a>
                ))}
              </GlassPanel>
            </div>
          ))}
        </div>
        <a className={styles.navCta} href="#claim">Get a free quarter</a>
      </GlassPanel>
    </nav>
  )
}
