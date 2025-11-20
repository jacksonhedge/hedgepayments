'use client'

import { useState } from 'react'
import BookstoreNavbar from '../components/BookstoreNavbar'
import Link from 'next/link'

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    {
      title: 'Getting Started',
      items: [
        { name: 'Introduction', href: '/docs' },
        { name: 'Quick Start', href: '/docs/quickstart' },
        { name: 'Authentication', href: '/docs/authentication' },
      ],
    },
    {
      title: 'Payments',
      items: [
        { name: 'Create Payment', href: '/docs/payments/create' },
        { name: 'Get Payment', href: '/docs/payments/get' },
        { name: 'Cancel Payment', href: '/docs/payments/cancel' },
        { name: 'Refund Payment', href: '/docs/payments/refund' },
      ],
    },
    {
      title: 'Balance & Payouts',
      items: [
        { name: 'Check Balance', href: '/docs/balance/check' },
        { name: 'Create Payout', href: '/docs/balance/payout' },
        { name: 'Balance History', href: '/docs/balance/history' },
      ],
    },
    {
      title: 'Guides',
      items: [
        { name: 'AI Agent Integration', href: '/docs/guides/ai-integration' },
        { name: 'Crypto Payments', href: '/docs/guides/crypto' },
        { name: 'Webhooks', href: '/docs/guides/webhooks' },
      ],
    },
    {
      title: 'API Reference',
      items: [
        { name: 'Base URLs', href: '/docs/reference/base-urls' },
        { name: 'Endpoints', href: '/docs/reference/endpoints' },
        { name: 'Errors', href: '/docs/reference/errors' },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-[#FAF8F5]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
      <BookstoreNavbar />

      <div className="pt-20 flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 fixed left-0 top-20 bottom-0 overflow-y-auto border-r border-[#D4C5B0] bg-[#FAF8F5] p-6">
          <nav className="space-y-8">
            {navigation.map((section) => (
              <div key={section.title}>
                <h3
                  className="text-xs tracking-widest uppercase text-[#8B7E6E] mb-3"
                  style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.1em' }}
                >
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="block text-sm text-[#2C2416] hover:text-[#6B5D4F] transition-colors py-1"
                        style={{ fontFamily: 'Georgia, serif' }}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64">
          <div className="max-w-4xl mx-auto px-6 py-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
