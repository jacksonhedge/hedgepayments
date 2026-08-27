import type { Metadata } from 'next'

const title = 'Get Paid to Beta Test Apps and Features'
const description =
  'Apply in two minutes. We match you to paid tests on DraftKings, FanDuel, Polymarket, Kalshi and more by platform, age and state — every test pays, and you keep your winnings.'

export const metadata: Metadata = {
  title: `${title} | Hedge Research`,
  description,
  openGraph: { title, description, url: '/research/signup', siteName: 'Hedge Research', type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
}

export default function ResearchSignupLayout({ children }: { children: React.ReactNode }) {
  return children
}
