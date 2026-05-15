import type { Metadata } from 'next'
import { Inter, Fraunces } from 'next/font/google'
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

const title = 'Hedge Payments — A small portfolio of focused products'
const description =
  'Hedge Payments builds and operates a handful of independent consumer products: FraternityBase, Sneakers, SideBet, and Vernacular.'

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
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <head>
        <meta name="theme-color" content="#f4efe6" />
        <meta name="color-scheme" content="light" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
