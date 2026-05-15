'use client'

import Link from 'next/link'

export default function CheckoutOverviewPage() {
  return (
    <div className="prose prose-lg max-w-none">
      {/* Header */}
      <div className="mb-12">
        <h1
          className="text-5xl text-[#2C2416] mb-4 tracking-tight"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400, letterSpacing: '-0.02em' }}
        >
          Getting Started with Checkout
        </h1>
        <p
          className="text-xl text-[#6B5D4F] leading-relaxed"
          style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
        >
          Accept credit cards, bank transfers, digital wallets, and crypto payments with a single integration
        </p>
      </div>

      {/* Overview Card */}
      <div className="bg-[#E8F5E9] border border-[#4CAF50] p-6 rounded mb-8">
        <p className="text-[#2C2416] text-base mb-2">
          <strong style={{ fontFamily: 'Georgia, serif' }}>Welcome to Hedge Payments</strong>
        </p>
        <p className="text-[#6B5D4F] text-base mb-0">
          Hedge Payments is a complete payment infrastructure platform that enables businesses to accept traditional payments (cards, bank transfers) and crypto payments, with instant USDC settlement. Built on top of Coinflow, we provide enterprise-grade payment processing with a simple, developer-friendly API.
        </p>
      </div>

      {/* Integration Paths */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Choose Your Integration Path
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Hedge Payments offers three integration approaches to fit your needs:
        </p>

        <div className="grid md:grid-cols-3 gap-6 not-prose mb-8">
          <Link
            href="/docs/checkout/checkout-link"
            className="block p-6 bg-white border border-[#D4C5B0] hover:border-[#2C2416] transition-all hover:shadow-md"
          >
            <div className="text-3xl mb-3">🔗</div>
            <h3
              className="text-xl text-[#2C2416] mb-2"
              style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
            >
              Checkout Link
            </h3>
            <p
              className="text-sm text-[#6B5D4F] mb-3"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Hosted payment pages with no frontend development required
            </p>
            <span className="inline-block px-2 py-1 bg-[#E8F5E9] text-[#4CAF50] text-xs rounded">
              Easiest
            </span>
          </Link>

          <Link
            href="/docs/checkout/react-sdk"
            className="block p-6 bg-white border border-[#D4C5B0] hover:border-[#2C2416] transition-all hover:shadow-md"
          >
            <div className="text-3xl mb-3">⚛️</div>
            <h3
              className="text-xl text-[#2C2416] mb-2"
              style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
            >
              React SDK
            </h3>
            <p
              className="text-sm text-[#6B5D4F] mb-3"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Embed payment components directly in your React application
            </p>
            <span className="inline-block px-2 py-1 bg-[#FFF4E6] text-[#F59E0B] text-xs rounded">
              Recommended
            </span>
          </Link>

          <Link
            href="/docs/checkout/api"
            className="block p-6 bg-white border border-[#D4C5B0] hover:border-[#2C2416] transition-all hover:shadow-md"
          >
            <div className="text-3xl mb-3">🔧</div>
            <h3
              className="text-xl text-[#2C2416] mb-2"
              style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
            >
              API Integration
            </h3>
            <p
              className="text-sm text-[#6B5D4F] mb-3"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Build a custom checkout UI with direct API access
            </p>
            <span className="inline-block px-2 py-1 bg-[#E3F2FD] text-[#2196F3] text-xs rounded">
              Most Flexible
            </span>
          </Link>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Supported Payment Methods
        </h2>

        <div className="overflow-x-auto mb-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D4C5B0]">
                <th className="py-3 pr-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Payment Method</th>
                <th className="py-3 px-4 text-[#2C2416] text-center" style={{ fontFamily: 'Georgia, serif' }}>US</th>
                <th className="py-3 px-4 text-[#2C2416] text-center" style={{ fontFamily: 'Georgia, serif' }}>EU</th>
                <th className="py-3 px-4 text-[#2C2416] text-center" style={{ fontFamily: 'Georgia, serif' }}>UK</th>
                <th className="py-3 px-4 text-[#2C2416] text-center" style={{ fontFamily: 'Georgia, serif' }}>LATAM</th>
                <th className="py-3 pl-4 text-[#2C2416] text-center" style={{ fontFamily: 'Georgia, serif' }}>Global</th>
              </tr>
            </thead>
            <tbody className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4">Credit/Debit Cards</td>
                <td className="py-3 px-4 text-center text-[#4CAF50]">✓</td>
                <td className="py-3 px-4 text-center text-[#4CAF50]">✓</td>
                <td className="py-3 px-4 text-center text-[#4CAF50]">✓</td>
                <td className="py-3 px-4 text-center text-[#4CAF50]">✓</td>
                <td className="py-3 pl-4 text-center text-[#4CAF50]">✓</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4">Apple Pay / Google Pay</td>
                <td className="py-3 px-4 text-center text-[#4CAF50]">✓</td>
                <td className="py-3 px-4 text-center text-[#4CAF50]">✓</td>
                <td className="py-3 px-4 text-center text-[#4CAF50]">✓</td>
                <td className="py-3 px-4 text-center text-[#4CAF50]">✓</td>
                <td className="py-3 pl-4 text-center text-[#4CAF50]">✓</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4">ACH Bank Transfer</td>
                <td className="py-3 px-4 text-center text-[#4CAF50]">✓</td>
                <td className="py-3 px-4 text-center">—</td>
                <td className="py-3 px-4 text-center">—</td>
                <td className="py-3 px-4 text-center">—</td>
                <td className="py-3 pl-4 text-center">—</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4">SEPA Transfer</td>
                <td className="py-3 px-4 text-center">—</td>
                <td className="py-3 px-4 text-center text-[#4CAF50]">✓</td>
                <td className="py-3 px-4 text-center">—</td>
                <td className="py-3 px-4 text-center">—</td>
                <td className="py-3 pl-4 text-center">—</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4">UK Faster Payments</td>
                <td className="py-3 px-4 text-center">—</td>
                <td className="py-3 px-4 text-center">—</td>
                <td className="py-3 px-4 text-center text-[#4CAF50]">✓</td>
                <td className="py-3 px-4 text-center">—</td>
                <td className="py-3 pl-4 text-center">—</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4">PIX</td>
                <td className="py-3 px-4 text-center">—</td>
                <td className="py-3 px-4 text-center">—</td>
                <td className="py-3 px-4 text-center">—</td>
                <td className="py-3 px-4 text-center text-[#4CAF50]">✓</td>
                <td className="py-3 pl-4 text-center">—</td>
              </tr>
              <tr>
                <td className="py-3 pr-4">USDC / Crypto</td>
                <td className="py-3 px-4 text-center text-[#4CAF50]">✓</td>
                <td className="py-3 px-4 text-center text-[#4CAF50]">✓</td>
                <td className="py-3 px-4 text-center text-[#4CAF50]">✓</td>
                <td className="py-3 px-4 text-center text-[#4CAF50]">✓</td>
                <td className="py-3 pl-4 text-center text-[#4CAF50]">✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Settlement Options */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Settlement Options
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Choose how and where you receive your funds:
        </p>

        <div className="space-y-4 not-prose">
          <div className="p-6 bg-white border border-[#D4C5B0] rounded">
            <h4 className="text-lg text-[#2C2416] mb-2" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
              💳 Hedge Payments Wallet
            </h4>
            <p className="text-[#6B5D4F] text-sm" style={{ fontFamily: 'Georgia, serif' }}>
              Funds settle to your Hedge Payments dashboard wallet. Withdraw anytime to your bank account or crypto wallet.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#D4C5B0] rounded">
            <h4 className="text-lg text-[#2C2416] mb-2" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
              🏦 Direct Bank Settlement
            </h4>
            <p className="text-[#6B5D4F] text-sm" style={{ fontFamily: 'Georgia, serif' }}>
              Automatic daily or weekly settlement directly to your business bank account.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#D4C5B0] rounded">
            <h4 className="text-lg text-[#2C2416] mb-2" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
              ⛓️ USDC Settlement
            </h4>
            <p className="text-[#6B5D4F] text-sm" style={{ fontFamily: 'Georgia, serif' }}>
              Receive all payments as USDC to your Solana, Ethereum, Polygon, Arbitrum, or Base wallet.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#D4C5B0] rounded">
            <h4 className="text-lg text-[#2C2416] mb-2" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
              📜 Smart Contract Settlement
            </h4>
            <p className="text-[#6B5D4F] text-sm" style={{ fontFamily: 'Georgia, serif' }}>
              Settle funds directly to a smart contract for automated distribution, escrow, or DeFi integrations.
            </p>
          </div>
        </div>
      </div>

      {/* Security Features */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Security & Fraud Protection
        </h2>

        <div className="grid md:grid-cols-3 gap-6 not-prose mb-8">
          <div className="p-6 bg-white border border-[#D4C5B0] rounded">
            <div className="text-2xl mb-3">🔒</div>
            <h4 className="text-lg text-[#2C2416] mb-2" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
              3D Secure
            </h4>
            <p className="text-[#6B5D4F] text-sm" style={{ fontFamily: 'Georgia, serif' }}>
              Enhanced card authentication for higher approval rates and reduced fraud
            </p>
          </div>

          <div className="p-6 bg-white border border-[#D4C5B0] rounded">
            <div className="text-2xl mb-3">🛡️</div>
            <h4 className="text-lg text-[#2C2416] mb-2" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
              Chargeback Protection
            </h4>
            <p className="text-[#6B5D4F] text-sm" style={{ fontFamily: 'Georgia, serif' }}>
              AI-powered fraud detection protects against chargebacks and disputes
            </p>
          </div>

          <div className="p-6 bg-white border border-[#D4C5B0] rounded">
            <div className="text-2xl mb-3">✅</div>
            <h4 className="text-lg text-[#2C2416] mb-2" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
              PCI Compliant
            </h4>
            <p className="text-[#6B5D4F] text-sm" style={{ fontFamily: 'Georgia, serif' }}>
              Full PCI DSS Level 1 compliance - we handle all sensitive card data
            </p>
          </div>
        </div>
      </div>

      {/* Getting Started Guides */}
      <div className="border-t border-[#D4C5B0] pt-8">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Getting Started Guides
        </h2>

        <div className="grid md:grid-cols-2 gap-6 not-prose">
          <Link
            href="/docs/checkout/card"
            className="block p-6 bg-white border border-[#D4C5B0] hover:border-[#2C2416] transition-all hover:shadow-md"
          >
            <h3
              className="text-xl text-[#2C2416] mb-2"
              style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
            >
              💳 Card Checkout
            </h3>
            <p
              className="text-sm text-[#6B5D4F]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Accept credit and debit card payments with Apple Pay and Google Pay
            </p>
          </Link>

          <Link
            href="/docs/checkout/ach"
            className="block p-6 bg-white border border-[#D4C5B0] hover:border-[#2C2416] transition-all hover:shadow-md"
          >
            <h3
              className="text-xl text-[#2C2416] mb-2"
              style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
            >
              🏦 ACH Payments
            </h3>
            <p
              className="text-sm text-[#6B5D4F]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Accept bank transfers with lower fees for US customers
            </p>
          </Link>

          <Link
            href="/docs/checkout/crypto"
            className="block p-6 bg-white border border-[#D4C5B0] hover:border-[#2C2416] transition-all hover:shadow-md"
          >
            <h3
              className="text-xl text-[#2C2416] mb-2"
              style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
            >
              ⛓️ Crypto Payments
            </h3>
            <p
              className="text-sm text-[#6B5D4F]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Accept USDC, SOL, ETH, and other cryptocurrencies
            </p>
          </Link>

          <Link
            href="/docs/checkout/subscriptions"
            className="block p-6 bg-white border border-[#D4C5B0] hover:border-[#2C2416] transition-all hover:shadow-md"
          >
            <h3
              className="text-xl text-[#2C2416] mb-2"
              style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
            >
              🔄 Subscriptions
            </h3>
            <p
              className="text-sm text-[#6B5D4F]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Set up recurring billing with automatic payment collection
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}
