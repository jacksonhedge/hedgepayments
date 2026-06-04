import type { Metadata } from 'next'

const title = 'Buy it. Then win it back. — Chance by Hedge'
const description =
  'A live demo: buy a product, then bet a real Polymarket or Kalshi market at checkout and win part — or all — of your order back. Powered by Hedge.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: 'https://hedgepayments.com/store' },
  openGraph: {
    title: 'Buy it. Then win it back.',
    description,
    url: 'https://hedgepayments.com/store',
    siteName: 'Hedge',
    type: 'website',
    images: [
      {
        url: '/og/store.png',
        width: 1200,
        height: 630,
        alt: 'Chance by Hedge — buy it, then win it back',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buy it. Then win it back.',
    description: 'Pay with Chance at checkout — bet a real Polymarket or Kalshi market and win money back.',
    images: ['/og/store.png'],
  },
}

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return children
}
