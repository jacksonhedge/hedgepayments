'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

interface DocsHeaderProps {
  onToggleSidebar?: () => void
}

export default function DocsHeader({ onToggleSidebar }: DocsHeaderProps) {
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  const isApiRef = pathname.startsWith('/docs/reference') || pathname.startsWith('/docs/sidebet/api')

  // Cmd+K to open search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setSearchQuery('')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus()
    }
  }, [searchOpen])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAF8F5]/95 backdrop-blur-sm border-b border-[#D4C5B0]">
        <div className="h-14 px-4 lg:px-6 flex items-center justify-between gap-4">
          {/* Left: Logo + back link + mobile menu */}
          <div className="flex items-center gap-3">
            {/* Mobile sidebar toggle */}
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-1.5 -ml-1.5 rounded-md text-[#6B5D4F] hover:text-[#2C2416] hover:bg-[#D4C5B0]/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CAF50]/40"
              aria-label="Toggle sidebar navigation"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group" aria-label="Hedge Payments home">
              <Image
                src="/images/hedge-inc-logo.png"
                alt=""
                width={28}
                height={28}
                className="w-7 h-7 opacity-85 group-hover:opacity-100 transition-opacity"
              />
              <span
                className="hidden sm:inline text-sm font-semibold text-[#2C2416] tracking-tight"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Hedge
              </span>
            </Link>

            {/* Separator */}
            <span className="hidden sm:block w-px h-5 bg-[#D4C5B0]" />

            {/* Docs nav tabs */}
            <nav className="hidden sm:flex items-center gap-1" aria-label="Documentation sections">
              <Link
                href="/docs"
                className={`px-3 py-1.5 rounded-md text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CAF50]/40 ${
                  !isApiRef
                    ? 'text-[#2C2416] font-medium bg-[#D4C5B0]/25'
                    : 'text-[#6B5D4F] hover:text-[#2C2416] hover:bg-[#D4C5B0]/15'
                }`}
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Docs
              </Link>
              <Link
                href="/docs/reference"
                className={`px-3 py-1.5 rounded-md text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CAF50]/40 ${
                  isApiRef
                    ? 'text-[#2C2416] font-medium bg-[#D4C5B0]/25'
                    : 'text-[#6B5D4F] hover:text-[#2C2416] hover:bg-[#D4C5B0]/15'
                }`}
                style={{ fontFamily: 'Georgia, serif' }}
              >
                API Reference
              </Link>
            </nav>
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-md mx-auto">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-[#D4C5B0] bg-white/60 text-[#8B7E6E] text-sm hover:border-[#8B7E6E] hover:bg-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CAF50]/40"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 opacity-50">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span className="flex-1 text-left" style={{ fontFamily: 'Georgia, serif' }}>Search docs...</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono text-[#8B7E6E] bg-[#FAF8F5] border border-[#D4C5B0]">
                <span className="text-xs">&#8984;</span>K
              </kbd>
            </button>
          </div>

          {/* Right: Links */}
          <div className="flex items-center gap-2">
            <Link
              href="https://github.com/jacksonhedge"
              className="hidden sm:flex p-2 rounded-md text-[#8B7E6E] hover:text-[#2C2416] hover:bg-[#D4C5B0]/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CAF50]/40"
              aria-label="GitHub"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </Link>
            <Link
              href="/get-started"
              className="px-3.5 py-1.5 rounded-md text-sm font-medium text-white bg-[#2C2416] hover:bg-[#3D3024] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CAF50]/40"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100]" role="dialog" aria-label="Search documentation" aria-modal="true">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => { setSearchOpen(false); setSearchQuery('') }} />
          <div className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-lg mx-4">
            <div className="bg-white rounded-xl shadow-2xl border border-[#D4C5B0] overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[#D4C5B0]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B7E6E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search documentation..."
                  className="flex-1 text-sm text-[#2C2416] placeholder-[#8B7E6E] bg-transparent border-none outline-none"
                  style={{ fontFamily: 'Georgia, serif' }}
                />
                <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono text-[#8B7E6E] bg-[#FAF8F5] border border-[#D4C5B0]">
                  ESC
                </kbd>
              </div>
              <div className="p-6 text-center">
                <p className="text-sm text-[#8B7E6E]" style={{ fontFamily: 'Georgia, serif' }}>
                  {searchQuery ? `No results for "${searchQuery}"` : 'Start typing to search...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
