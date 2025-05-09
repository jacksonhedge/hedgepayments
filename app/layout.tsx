import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hedge Payments',
  description: 'Payments, made fun.',
  icons: {
    icon: [
      {
        url: '/favicon/favicon.ico',
        sizes: '16x16',
        type: 'image/x-icon',
      },
      {
        url: '/favicon/logo-icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
    apple: {
      url: '/favicon/hedge-logo.svg',
      sizes: '180x180',
      type: 'image/svg+xml',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}