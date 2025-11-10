'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface BookstoreNavbarProps {
  scrollTrigger?: boolean // If true, navbar slides in on scroll. If false, always visible.
}

export default function BookstoreNavbar({ scrollTrigger = false }: BookstoreNavbarProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (!scrollTrigger) return // Don't add scroll listener if always visible

    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrollTrigger])

  // For non-scroll-triggered navbar, always show it
  const isVisible = scrollTrigger ? scrolled : true

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        isVisible
          ? 'bg-[#FAF8F5]/95 backdrop-blur-sm border-[#D4C5B0] translate-y-0'
          : 'bg-transparent border-transparent -translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/hedge-inc-logo.png"
              alt="Hedge Payments"
              width={36}
              height={36}
              className="w-9 h-9 opacity-90"
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-10">
            <Link
              href="/"
              className="text-sm tracking-wide text-[#2C2416] hover:text-[#6B5D4F] transition-colors"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-sm tracking-wide text-[#2C2416] hover:text-[#6B5D4F] transition-colors"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Our Products
            </Link>
            <Link
              href="/developers"
              className="text-sm tracking-wide text-[#2C2416] hover:text-[#6B5D4F] transition-colors"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Developers
            </Link>
            <Link
              href="/about"
              className="text-sm tracking-wide text-[#2C2416] hover:text-[#6B5D4F] transition-colors"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="text-sm tracking-wide text-[#2C2416] hover:text-[#6B5D4F] transition-colors"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Contact
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center px-5 py-2 text-sm tracking-wide text-[#FAF8F5] bg-[#2C2416] border border-[#2C2416] hover:bg-[#3D3024] transition-all"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Talk with the team
              <svg
                className="ml-2 w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
