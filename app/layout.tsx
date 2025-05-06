import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hedge Payments',
  description: 'Payments, made fun.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}