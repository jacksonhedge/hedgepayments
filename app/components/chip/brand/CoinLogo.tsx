'use client'
import styles from './coinLogo.module.css'

/** Brand mark: a quarter that flips on hover. Both faces are heads — the coin
 *  always lands heads ("create your own luck"). Decorative; label lives beside it. */
export default function CoinLogo() {
  return (
    <span className={styles.coin} aria-hidden>
      <span className={styles.inner}>
        <span className={`${styles.face} ${styles.front}`} />
        <span className={`${styles.face} ${styles.back}`} />
      </span>
    </span>
  )
}
