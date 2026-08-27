import type { Metadata } from 'next'
import styles from './layout.module.css'

export const metadata: Metadata = {
  title: 'SideBet — Round-ups by Hedge',
  description: 'Plaid Link for round-ups. One script tag links a bank, accrues the cents on every purchase, and moves the money in one ACH debit when it counts. Brands set the rules.',
}

export default function SideBetLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={styles['sidebet-layout']}>
      {children}
    </div>
  )
} 