import type { Metadata } from 'next'
import './layout.css'

export const metadata: Metadata = {
  title: 'SideBet by Hedge Payments',
  description: 'Sports betting, simplified. The fastest and most user-friendly sports betting platform.',
}

export default function SideBetLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="sidebet-layout">
      {children}
    </div>
  )
} 