import type { Metadata } from 'next'

const title = 'Hedge Payments — Payments people actually enjoy'
const description =
  'A white-label payment gateway with native payment experiences built in. Deposits, checkout, payouts and wallets under your brand — with payment moments your users love.'

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: false },
  openGraph: {
    title,
    description,
    url: '/pitch',
    type: 'website',
    images: [{ url: '/images/HedgeLogo3D.png', width: 800, height: 800, alt: 'Hedge Payments' }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/images/HedgeLogo3D.png'],
  },
}

export default function PitchLayout({ children }: { children: React.ReactNode }) {
  return children
}
