'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClientComponentClient } from '@/app/utils/supabase-client'
import { useMode } from '../../contexts/ModeContext'

interface HeaderProps {
  businessName?: string
  userEmail?: string
  businessLogo?: string
}

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const BellIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
  </svg>
)

const ChevronDownIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
)

export default function Header({ businessName, userEmail, businessLogo }: HeaderProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { mode, isTestMode } = useMode()

  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCommandPalette, setShowCommandPalette] = useState(false)

  const userMenuRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Command palette keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        setShowCommandPalette(true)
      }
      if (event.key === 'Escape') {
        setShowCommandPalette(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const notifications = [
    { id: 1, title: 'New transaction', message: 'Payment of $125.00 received', time: '5m ago', unread: true },
    { id: 2, title: 'Webhook delivered', message: 'payment.completed sent successfully', time: '1h ago', unread: true },
    { id: 3, title: 'API key created', message: 'New test key pk_test_xxx created', time: '3h ago', unread: false },
  ]

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <>
      <header className="h-16 bg-dash-surface-card border-b border-dash-surface-border flex items-center justify-between px-6">
        {/* Left: Breadcrumb / Title */}
        <div className="flex items-center gap-4">
          {/* Test Mode Banner */}
          {isTestMode && (
            <div className="px-3 py-1 bg-dash-mode-test/10 border border-dash-mode-test/30 rounded-lg">
              <span className="text-dash-mode-test text-xs font-medium">TEST MODE</span>
            </div>
          )}
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-xl mx-8">
          <button
            onClick={() => setShowCommandPalette(true)}
            className="w-full flex items-center gap-3 px-4 py-2 bg-dash-surface-bg border border-dash-surface-border rounded-lg text-dash-text-muted hover:border-dash-text-muted/50 transition-colors"
          >
            <SearchIcon />
            <span className="flex-1 text-left text-sm">Search transactions, customers, docs...</span>
            <kbd className="hidden sm:flex items-center gap-1 px-2 py-0.5 bg-dash-surface-card border border-dash-surface-border rounded text-xs">
              <span>&#8984;</span>K
            </kbd>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-dash-text-secondary hover:bg-dash-surface-hover transition-colors"
            >
              <BellIcon />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-dash-status-error rounded-full" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-dash-surface-card border border-dash-surface-border rounded-xl shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b border-dash-surface-border">
                  <h3 className="text-sm font-semibold text-dash-text-primary">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-dash-surface-hover cursor-pointer ${
                        notification.unread ? 'bg-dash-primary-500/5' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {notification.unread && (
                          <span className="mt-1.5 w-2 h-2 bg-dash-primary-500 rounded-full flex-shrink-0" />
                        )}
                        <div className={notification.unread ? '' : 'ml-5'}>
                          <p className="text-sm font-medium text-dash-text-primary">{notification.title}</p>
                          <p className="text-xs text-dash-text-secondary mt-0.5">{notification.message}</p>
                          <p className="text-xs text-dash-text-muted mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-dash-surface-border">
                  <Link
                    href="/dashboard/notifications"
                    className="text-sm text-dash-primary-500 hover:text-dash-primary-600 font-medium"
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-dash-surface-hover transition-colors"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden bg-dash-primary-500">
                {businessLogo ? (
                  <Image
                    src={businessLogo}
                    alt={businessName || 'Company'}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-sm font-medium">
                    {businessName ? businessName.charAt(0).toUpperCase() : 'H'}
                  </span>
                )}
              </div>
              <ChevronDownIcon />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-dash-surface-card border border-dash-surface-border rounded-xl shadow-lg py-2 z-50">
                <div className="px-4 py-3 border-b border-dash-surface-border">
                  <p className="text-sm font-semibold text-dash-text-primary">{businessName || 'Your Business'}</p>
                  <p className="text-xs text-dash-text-secondary truncate">{userEmail}</p>
                </div>
                <div className="py-1">
                  <Link
                    href="/dashboard/settings/account"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-dash-text-secondary hover:bg-dash-surface-hover hover:text-dash-text-primary transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Account settings
                  </Link>
                  <Link
                    href="/dashboard/settings/team"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-dash-text-secondary hover:bg-dash-surface-hover hover:text-dash-text-primary transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                    Team members
                  </Link>
                  <Link
                    href="/dashboard/settings/billing"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-dash-text-secondary hover:bg-dash-surface-hover hover:text-dash-text-primary transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                    </svg>
                    Billing
                  </Link>
                  <Link
                    href="/dashboard/settings/branding"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-dash-text-secondary hover:bg-dash-surface-hover hover:text-dash-text-primary transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                    </svg>
                    Company branding
                  </Link>
                </div>
                <div className="border-t border-dash-surface-border pt-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-dash-status-error hover:bg-dash-surface-hover transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Command Palette Modal */}
      {showCommandPalette && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/50" onClick={() => setShowCommandPalette(false)}>
          <div
            className="w-full max-w-xl bg-dash-surface-card border border-dash-surface-border rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-dash-surface-border">
              <SearchIcon />
              <input
                type="text"
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent text-dash-text-primary placeholder-dash-text-muted outline-none text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <kbd className="px-2 py-0.5 bg-dash-surface-bg border border-dash-surface-border rounded text-xs text-dash-text-muted">
                ESC
              </kbd>
            </div>
            <div className="max-h-80 overflow-y-auto py-2">
              <div className="px-3 py-1.5">
                <span className="text-xs font-medium text-dash-text-muted uppercase">Quick Actions</span>
              </div>
              {[
                { label: 'Go to Transactions', href: '/dashboard/transactions', icon: '📋' },
                { label: 'View API Keys', href: '/dashboard/developers/api-keys', icon: '🔑' },
                { label: 'Create Webhook', href: '/dashboard/developers/webhooks', icon: '🔗' },
                { label: 'View Documentation', href: '/docs', icon: '📚' },
              ].map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 mx-1 rounded-lg hover:bg-dash-surface-hover transition-colors"
                  onClick={() => setShowCommandPalette(false)}
                >
                  <span>{item.icon}</span>
                  <span className="text-sm text-dash-text-primary">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
