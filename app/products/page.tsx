'use client'

import BookstoreNavbar from '../components/BookstoreNavbar'
import Link from 'next/link'
import Image from 'next/image'

export default function ProductsPage() {
  const products = [
    {
      id: 1,
      name: 'Bankroll',
      tagline: 'Consumer Wallet',
      description: 'Digital wallet for everyday payments and financial management',
      image: '/images/bankroll-logo.png',
      link: 'https://bankroll.live',
      color: '#4A90E2'
    },
    {
      id: 2,
      name: 'SideBet',
      tagline: 'Spare Change Wagering',
      description: 'Round up your purchases and turn spare change into winnings',
      image: '/sidebet-logo.png',
      link: '/sidebet',
      color: '#E94B3C',
      comingSoon: true
    },
    {
      id: 3,
      name: 'Hedge Pay',
      tagline: 'Payment Infrastructure',
      description: 'API-first payment processing for AI agents and crypto companies',
      image: '/images/hedgepay-new-logo.png',
      link: 'https://hedgepayments.com',
      color: '#2C2416'
    },
    {
      id: 4,
      name: 'Hedge API',
      tagline: 'Developer Tools',
      description: 'RESTful API and SDKs for seamless payment integration',
      image: '/images/hedge-inc-logo.png',
      link: '/developers',
      color: '#6B5D4F'
    },
    {
      id: 5,
      name: 'FraternityBase',
      tagline: 'Greek Life Platform',
      description: 'Modern platform for fraternity and sorority management',
      image: '/images/fraternity-base-logo.png',
      link: 'https://fraternitybase.com',
      color: '#1E3A8A'
    },
    {
      id: 6,
      name: 'College Casino Tour',
      tagline: 'Campus Outreach',
      description: 'Marketing and outreach platform for the college market',
      image: '/images/fraternity-base-logo.png',
      link: 'https://collegecasinotour.com',
      color: '#F59E0B'
    }
  ]

  return (
    <div className="min-h-screen bg-[#FAF8F5]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
      <BookstoreNavbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1
            className="text-5xl md:text-6xl text-[#2C2416] mb-6 tracking-tight"
            style={{ fontFamily: 'Georgia, serif', fontWeight: 400, letterSpacing: '-0.02em' }}
          >
            Our Products
          </h1>
          <p
            className="text-xl text-[#6B5D4F] max-w-2xl mx-auto tracking-wide leading-relaxed"
            style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
          >
            Payment solutions for the modern world
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <Link
                key={product.id}
                href={product.link}
                target={product.link.startsWith('http') ? '_blank' : '_self'}
                rel={product.link.startsWith('http') ? 'noopener noreferrer' : ''}
                className="group cursor-pointer"
              >
                {/* Card Container */}
                <div className="relative">
                  {/* Product Cover/Image */}
                  <div className="relative aspect-[3/4] bg-white rounded-lg shadow-sm overflow-hidden mb-3 transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.02]">
                    <div className="absolute inset-0 flex items-center justify-center p-8" style={{ backgroundColor: `${product.color}10` }}>
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={200}
                        height={200}
                        className="w-full h-auto object-contain opacity-90"
                      />
                    </div>

                    {/* Coming Soon Badge */}
                    {product.comingSoon && (
                      <div className="absolute top-3 right-3 bg-[#2C2416] text-[#FAF8F5] px-3 py-1 text-xs tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
                        COMING SOON
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="space-y-1">
                    <h3
                      className="text-lg text-[#2C2416] tracking-wide"
                      style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
                    >
                      {product.name}
                    </h3>
                    <p
                      className="text-sm text-[#8B7E6E] tracking-wide"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      {product.tagline}
                    </p>
                    <p
                      className="text-xs text-[#A8998A] leading-relaxed pt-1"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      {product.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center border-t border-[#D4C5B0] pt-16">
          <h2
            className="text-3xl md:text-4xl text-[#2C2416] mb-6 tracking-tight"
            style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
          >
            Ready to start building?
          </h2>
          <p
            className="text-lg text-[#6B5D4F] mb-8 tracking-wide"
            style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
          >
            Join thousands of developers building with Hedge
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-10 py-4 text-base tracking-wide text-[#FAF8F5] bg-[#2C2416] border border-[#2C2416] hover:bg-[#3D3024] transition-all"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Get Started
            </Link>
            <Link
              href="/developers"
              className="inline-flex items-center justify-center px-10 py-4 text-base tracking-wide text-[#2C2416] bg-transparent border border-[#D4C5B0] hover:border-[#2C2416] transition-all"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              View Documentation
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
