'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import DocsHeader from './components/DocsHeader'

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const navigation = [
    {
      title: 'Getting Started',
      items: [
        { name: 'Introduction', href: '/docs' },
        { name: 'Quick Start', href: '/docs/quickstart' },
        { name: 'Authentication', href: '/docs/authentication' },
        { name: 'Testing & Sandbox', href: '/docs/testing' },
      ],
    },
    {
      title: 'SideBet (Round-Ups)',
      items: [
        { name: 'Overview', href: '/docs/sidebet' },
        { name: 'Quick Start', href: '/docs/sidebet/quickstart' },
        { name: 'API Reference', href: '/docs/sidebet/api-reference' },
        { name: 'Webhooks', href: '/docs/sidebet/webhooks' },
      ],
    },
    {
      title: 'Checkout',
      items: [
        { name: 'Overview', href: '/docs/checkout' },
        { name: 'Card Checkout', href: '/docs/checkout/card' },
        { name: 'ACH Payments', href: '/docs/checkout/ach' },
        { name: 'Checkout Links', href: '/docs/checkout/checkout-link' },
        { name: 'React SDK', href: '/docs/checkout/react-sdk' },
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
      title: 'Guides',
      items: [
        { name: 'AI Agent Integration', href: '/docs/guides/ai-integration' },
        { name: 'Webhooks', href: '/docs/guides/webhooks' },
        { name: 'Settlement Options', href: '/docs/guides/settlement' },
        { name: 'Payment Flows', href: '/docs/guides/payment-flows' },
      ],
    },
    {
      title: 'API Reference',
      items: [
        { name: 'Overview', href: '/docs/reference' },
        { name: 'Errors', href: '/docs/reference/errors' },
      ],
    },
  ]

  const SidebarContent = () => (
    <nav className="space-y-6" aria-label="Documentation navigation">
      {navigation.map((section) => (
        <div key={section.title}>
          <h3
            className="text-[10px] tracking-widest uppercase text-[#8B7E6E] mb-2 font-semibold"
            style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.12em' }}
          >
            {section.title}
          </h3>
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`block text-[13px] py-1.5 px-2.5 rounded-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CAF50]/40 ${
                      isActive
                        ? 'text-[#2C2416] font-medium bg-[#D4C5B0]/25 border-l-2 border-[#4CAF50] -ml-px'
                        : 'text-[#6B5D4F] hover:text-[#2C2416] hover:bg-[#D4C5B0]/15'
                    }`}
                    style={{ fontFamily: 'Georgia, serif' }}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )

  return (
    <div className="min-h-screen bg-[#FAF8F5]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
      <DocsHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="pt-14 flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-60 fixed left-0 top-14 bottom-0 overflow-y-auto border-r border-[#D4C5B0] bg-[#FAF8F5] px-4 py-6">
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
            <aside className="fixed left-0 top-14 bottom-0 w-72 bg-[#FAF8F5] border-r border-[#D4C5B0] overflow-y-auto px-4 py-6 shadow-xl z-50">
              <SidebarContent />
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-60 min-w-0">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
