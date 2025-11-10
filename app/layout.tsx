import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hedge Payments - Money in an AI World',
  description: 'Launch payments fast, grow faster. Payment infrastructure for AI agents, crypto companies, and the autonomous economy.',
  metadataBase: new URL('https://hedgepayments.com'),
  openGraph: {
    title: 'Hedge Payments - Money in an AI World',
    description: 'Launch payments fast, grow faster. Payment infrastructure for AI agents, crypto companies, and the autonomous economy.',
    url: 'https://hedgepayments.com',
    siteName: 'Hedge Payments',
    images: [
      {
        url: '/images/hedge-inc-logo.png',
        width: 1200,
        height: 1200,
        alt: 'Hedge Payments - Money in an AI World',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hedge Payments - Money in an AI World',
    description: 'Launch payments fast, grow faster. Payment infrastructure for AI agents, crypto companies, and the autonomous economy.',
    images: ['/images/hedge-inc-logo.png'],
    creator: '@hedgepayments',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/images/hedge-inc-logo.png', sizes: 'any' },
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
    canonical: 'https://hedgepayments.com',
  },
  keywords: ['Hedge Payments', 'AI payments', 'crypto payments', 'payment infrastructure', 'AI agents', 'Web3', 'payment processing', 'Coinflow'],
  authors: [{ name: 'Hedge Payments Team' }],
  creator: 'Hedge Payments',
  publisher: 'Hedge Payments',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#FAF8F5" />
        <meta name="color-scheme" content="light" />
        <meta property="fb:app_id" content="your-fb-app-id" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="canonical" href="https://hedgepayments.com" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon-precomposed" href="/apple-touch-icon.png" />
        <meta property="og:image" content="https://hedgepayments.com/images/hedge-inc-logo.png" />
        <meta name="twitter:image" content="https://hedgepayments.com/images/hedge-inc-logo.png" />
        <meta property="og:title" content="Hedge Payments - Money in an AI World" />
        <meta property="og:description" content="Launch payments fast, grow faster. Payment infrastructure for AI agents, crypto companies, and the autonomous economy." />
        <meta name="twitter:title" content="Hedge Payments - Money in an AI World" />
        <meta name="twitter:description" content="Launch payments fast, grow faster. Payment infrastructure for AI agents, crypto companies, and the autonomous economy." />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}