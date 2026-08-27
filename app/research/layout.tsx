import type { Metadata } from 'next'

const title = 'Get Paid to Beta Test Apps and Features'
const description =
  'Hedge Research pays real users to test sportsbooks, prediction markets, casino games and payment features — DraftKings, FanDuel, Polymarket, Kalshi and more. Every test pays, and you keep your winnings.'

export const metadata: Metadata = {
  title: `${title} | Hedge Research`,
  description,
  openGraph: {
    title,
    description,
    url: '/research',
    siteName: 'Hedge Research',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
}

export default function ResearchLayout({ children }: { children: React.ReactNode }) {
  return children
}
