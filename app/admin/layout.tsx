'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Check if we're on the super-admin page (fullscreen mode)
  const isSuperAdmin = pathname?.includes('/super-admin')

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: '📊',
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: '👥',
    },
    {
      name: 'API Logs',
      href: '/admin/api-logs',
      icon: '📝',
    },
    {
      name: 'Payments',
      href: '/admin/payments',
      icon: '💳',
    },
    {
      name: 'Billing',
      href: '/admin/billing',
      icon: '🧾',
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: '📈',
    },
  ]

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname?.startsWith(href)
  }

  // If on super-admin page, render without layout
  if (isSuperAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#2C2416] border-b border-[#3D3024]">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-[#FAF8F5] hover:text-[#D4C5B0] transition-colors"
            >
              ☰
            </button>
            <Link href="/admin">
              <h1 className="text-xl text-[#FAF8F5] tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>
                Hedge Admin
              </h1>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className="text-sm text-[#D4C5B0] hover:text-[#FAF8F5] transition-colors"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              ← Back to Site
            </Link>
            <div className="text-sm text-[#D4C5B0]" style={{ fontFamily: 'Georgia, serif' }}>
              Admin
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16 flex">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-16 bottom-0 bg-white border-r border-[#D4C5B0] transition-all duration-300 ${
            sidebarOpen ? 'w-64' : 'w-0'
          } overflow-hidden z-40`}
        >
          <nav className="p-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-4 py-3 rounded transition-colors ${
                  isActive(item.href)
                    ? 'bg-[#2C2416] text-[#FAF8F5]'
                    : 'text-[#2C2416] hover:bg-[#FAF8F5]'
                }`}
                style={{ fontFamily: 'Georgia, serif' }}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Divider */}
          <div className="border-t border-[#D4C5B0] mx-6 my-6"></div>

          {/* Quick Stats */}
          <div className="px-6 py-4">
            <p className="text-xs text-[#8B7E6E] uppercase tracking-wider mb-3" style={{ fontFamily: 'Georgia, serif' }}>
              Quick Stats
            </p>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-[#8B7E6E]" style={{ fontFamily: 'Georgia, serif' }}>Active Users</p>
                <p className="text-lg text-[#2C2416]" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
                  --
                </p>
              </div>
              <div>
                <p className="text-xs text-[#8B7E6E]" style={{ fontFamily: 'Georgia, serif' }}>Today's Signups</p>
                <p className="text-lg text-[#2C2416]" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
                  --
                </p>
              </div>
              <div>
                <p className="text-xs text-[#8B7E6E]" style={{ fontFamily: 'Georgia, serif' }}>API Calls Today</p>
                <p className="text-lg text-[#2C2416]" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
                  --
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? 'ml-64' : 'ml-0'
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
