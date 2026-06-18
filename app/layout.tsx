import type { Metadata } from 'next'
import { Inter, Fraunces, Anton, Press_Start_2P, Sora, Pacifico, Space_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz', 'SOFT'],
})

// Arcade-Neon display system for the marketing site
const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-anton',
  display: 'swap',
})

const pressStart = Press_Start_2P({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-pixel',
  display: 'swap',
})

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
})

// Cursive script for the Chance wordmark
const pacifico = Pacifico({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-script',
  display: 'swap',
})

// Monospace for labels, eyebrows, and spec tables (proposal pages)
const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
})

const title = 'Hedge — Fun, easy payments for the people who use them'
const description =
  'Hedge is the fun money layer behind your favorite products: wallets, round-ups, and pay-a-little-more-to-win-it-free checkout. You bring the users — we bring the rails. Powering HedgePay, SideBet, Chance™, and FraternityBase.'

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL('https://hedgepayments.com'),
  openGraph: {
    title,
    description,
    url: 'https://hedgepayments.com',
    siteName: 'Hedge Payments',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    creator: '@hedgepayments',
  },
  alternates: {
    canonical: 'https://hedgepayments.com',
  },
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
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${anton.variable} ${pressStart.variable} ${sora.variable} ${pacifico.variable} ${spaceMono.variable}`}
    >
      <head>
        <meta name="theme-color" content="#07060e" />
        <meta name="color-scheme" content="dark" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
