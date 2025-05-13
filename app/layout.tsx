import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SideBet - Turn Spare Change Into Winnings',
  description: 'Swipe your card, and in moments, see if your round-ups won you money on your favorite online casinos.',
  icons: {
    icon: [
      {
        url: '/favicon/sidebet-icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
    apple: {
      url: '/favicon/sidebet-icon.svg',
      sizes: 'any',
      type: 'image/svg+xml',
    },
  },
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