'use client'
import GlassPanel from '../glass/GlassPanel'
import CountUp from './CountUp'
import styles from './sections.module.css'

export default function UsersSection() {
  return (
    <section id="users" className={styles.section} aria-labelledby="users-h">
      <div className={styles.inner}>
        <p className={styles.kicker}>For Users</p>
        <h2 id="users-h" className={styles.h2}>A daily little something you won&apos;t miss losing.</h2>
        <p className={styles.lead}>
          Small stakes, real upside — it never hurts to lose. Put in a quarter, ride the markets,
          and let the wins stack up in your wallet.
        </p>
        <div className={styles.cards}>
          <GlassPanel className={styles.card} reactive contentClassName={styles.cardBody}>
            <h3 className={styles.cardTitle}>SideBet</h3>
            <p className={styles.cardText}>Tiny side bets on the things you already follow. Win big from a little.</p>
          </GlassPanel>
          <GlassPanel className={styles.card} reactive contentClassName={styles.cardBody}>
            <h3 className={styles.cardTitle}>Chance — the wallet</h3>
            <p className={styles.cardText}>Your quarter, your winnings, one balance. Spend it, stake it, grow it.</p>
          </GlassPanel>
        </div>
        <div className={styles.stat}>
          <span className={styles.statBig}><CountUp to={1000} prefix="$" />+</span>
          <span className={styles.statLabel}>a single quarter could become</span>
        </div>
      </div>
    </section>
  )
}
