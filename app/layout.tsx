import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Round-Ups - Join the Waitlist',
  description: 'Turn spare change into winnings! Join the waitlist to automatically round up your purchases and play on your favorite platforms.',
  metadataBase: new URL('https://www.roundups.io'),
  openGraph: {
    title: 'Round-Ups - Join the Waitlist',
    description: 'Turn spare change into winnings! Join the waitlist to automatically round up your purchases and play on your favorite platforms.',
    url: 'https://www.roundups.io',
    siteName: 'Round-Ups',
    images: [
      {
        url: '/images/social/roundups-og.png',
        width: 1200,
        height: 1200,
        alt: 'Round-Ups - Turn Spare Change Into Winnings',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Round-Ups - Join the Waitlist',
    description: 'Turn spare change into winnings! Join the waitlist to automatically round up your purchases and play on your favorite platforms.',
    images: ['/images/social/roundups-og.png'],
    creator: '@roundupsapp',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/round-ups-logo.png', sizes: 'any' },
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
    canonical: 'https://www.roundups.io',
  },
  keywords: ['Round-Ups', 'betting', 'gambling', 'round-ups', 'DraftKings', 'FanDuel', 'sportsbook', 'waitlist'],
  authors: [{ name: 'Round-Ups Team' }],
  creator: 'Round-Ups',
  publisher: 'Round-Ups',
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
        <link rel="canonical" href="https://www.roundups.io" />
        <link rel="icon" href="/round-ups-logo.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon-precomposed" href="/apple-touch-icon.png" />
        <meta property="og:image" content="https://www.roundups.io/images/social/roundups-og.png" />
        <meta name="twitter:image" content="https://www.roundups.io/images/social/roundups-og.png" />
        <meta property="og:title" content="Round-Ups - Join the Waitlist" />
        <meta property="og:description" content="Turn spare change into winnings! Join the waitlist to automatically round up your purchases and play on your favorite platforms." />
        <meta name="twitter:title" content="Round-Ups - Join the Waitlist" />
        <meta name="twitter:description" content="Turn spare change into winnings! Join the waitlist to automatically round up your purchases and play on your favorite platforms." />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}