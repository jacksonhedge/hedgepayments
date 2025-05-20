import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SideBet - Join the Waitlist for Your Favorite Sportsbooks',
  description: 'Turn spare change into winnings! Join the waitlist to automatically round up your purchases and place bets on your favorite sportsbooks.',
  metadataBase: new URL('https://www.sidebet.io'),
  openGraph: {
    title: 'SideBet - Join the Waitlist for Your Favorite Sportsbooks',
    description: 'Turn spare change into winnings! Join the waitlist to automatically round up your purchases and place bets on your favorite sportsbooks.',
    url: 'https://www.sidebet.io',
    siteName: 'SideBet',
    images: [
      {
        url: '/images/social/sidebet-og.png',
        width: 1200,
        height: 1200,
        alt: 'SideBet - Turn Spare Change Into Winnings',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SideBet - Join the Waitlist for Your Favorite Sportsbooks',
    description: 'Turn spare change into winnings! Join the waitlist to automatically round up your purchases and place bets on your favorite sportsbooks.',
    images: ['/images/social/sidebet-og.png'],
    creator: '@sidebetapp',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/sidebet-logo.png', sizes: 'any' },
    ],
    apple: {
      url: '/apple-touch-icon.png',
      sizes: '180x180',
    },
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon.png',
      },
    ],
  },
  alternates: {
    canonical: 'https://www.sidebet.io',
  },
  keywords: ['SideBet', 'betting', 'gambling', 'round-ups', 'DraftKings', 'FanDuel', 'sportsbook', 'waitlist'],
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
        <link rel="icon" href="/sidebet-logo.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon-precomposed" href="/apple-touch-icon.png" />
        <meta property="og:image" content="https://www.sidebet.io/images/social/sidebet-og.png" />
        <meta name="twitter:image" content="https://www.sidebet.io/images/social/sidebet-og.png" />
        <meta property="og:title" content="SideBet - Join the Waitlist for Your Favorite Sportsbooks" />
        <meta property="og:description" content="Turn spare change into winnings! Join the waitlist to automatically round up your purchases and place bets on your favorite sportsbooks." />
        <meta name="twitter:title" content="SideBet - Join the Waitlist for Your Favorite Sportsbooks" />
        <meta name="twitter:description" content="Turn spare change into winnings! Join the waitlist to automatically round up your purchases and place bets on your favorite sportsbooks." />
      </head>
      <body>{children}</body>
    </html>
  )
}