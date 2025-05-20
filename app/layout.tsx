import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SideBet - Turn Spare Change Into Winnings',
  description: 'Swipe your card, and in moments, see if your round-ups won you money on your favorite sportsbooks.',
  metadataBase: new URL('https://www.sidebet.io'),
  openGraph: {
    title: 'SideBet - Turn Spare Change Into Winnings',
    description: 'Swipe your card, and in moments, see if your round-ups won you money on your favorite sportsbooks.',
    url: 'https://www.sidebet.io',
    siteName: 'SideBet',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'SideBet - Turn Spare Change Into Winnings',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SideBet - Turn Spare Change Into Winnings',
    description: 'Swipe your card, and in moments, see if your round-ups won you money on your favorite sportsbooks.',
    images: ['/twitter-image'],
    creator: '@sidebetapp',
  },
  icons: {
    icon: '/icon',
    apple: '/apple-icon',
  },
  alternates: {
    canonical: 'https://www.sidebet.io',
  },
  keywords: ['SideBet', 'betting', 'gambling', 'round-ups', 'DraftKings', 'FanDuel', 'sportsbook'],
  authors: [{ name: 'SideBet Team' }],
  creator: 'SideBet',
  publisher: 'SideBet',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#132A45" />
        <meta name="color-scheme" content="light" />
        <meta property="fb:app_id" content="your-fb-app-id" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="canonical" href="https://www.sidebet.io" />
      </head>
      <body>{children}</body>
    </html>
  )
}