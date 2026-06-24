'use client'

import { useRef, useState } from 'react'
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

// Flat list of all nav destinations for the mobile menu
const MOBILE_LINKS = [
  ...TOP_LINKS,
  ...GROUPS.flatMap((g) => g.items),
  ...TRAIL_LINKS,
]

export default function GlassNav() {
  const [open, setOpen] = useState(false)
  // Which desktop dropdown group is open. JS-controlled (not pure CSS :hover) so a
  // small close-delay forgives the cursor crossing the gap to the menu items.
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const openNow = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpenGroup(label)
  }
  const closeSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpenGroup(null), 180)
  }

  return (
    <nav className={styles.nav} aria-label="Primary">
      <GlassPanel className={styles.navShell} contentClassName={styles.navBar}>
        <a className={styles.brand} href="/"><CoinLogo /> Hedge</a>
        <div className={styles.navLinks}>
          {TOP_LINKS.map((l) => (
            <a key={l.label} className={styles.navTrigger} href={l.href}>{l.label}</a>
          ))}
          {GROUPS.map((g) => (
            <div
              key={g.label}
              className={styles.navItem}
              onMouseEnter={() => openNow(g.label)}
              onMouseLeave={closeSoon}
            >
              <button
                type="button"
                className={styles.navTrigger}
                aria-haspopup="true"
                aria-expanded={openGroup === g.label}
                onClick={() => setOpenGroup((o) => (o === g.label ? null : g.label))}
              >
                {g.label} <span className={styles.chev} aria-hidden>▾</span>
              </button>
              <GlassPanel
                className={`${styles.navMenu} ${openGroup === g.label ? styles.navMenuOpen : ''}`}
                as="div"
              >
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
        <button
          type="button"
          className={styles.navToggle}
          aria-label="Menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? '✕' : '☰'}
        </button>
        <a className={styles.navCta} href="#claim">Get a free quarter</a>
      </GlassPanel>
      {open && (
        <GlassPanel id="mobile-menu" className={styles.mobileMenu} as="div">
          {MOBILE_LINKS.map((l) => (
            <a
              key={l.label}
              className={styles.mobileMenuLink}
              href={l.href}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a
            className={styles.mobileMenuCta}
            href="#claim"
            onClick={() => setOpen(false)}
          >
            Get a free quarter
          </a>
        </GlassPanel>
      )}
    </nav>
  )
}
