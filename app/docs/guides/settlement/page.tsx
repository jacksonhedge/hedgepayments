'use client'

import Link from 'next/link'

export default function SettlementGuidePage() {
  return (
    <div className="prose prose-lg max-w-none">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 text-sm text-[#6B5D4F] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          <Link href="/docs" className="hover:text-[#2C2416]">Guides</Link>
          <span>/</span>
          <span>Settlement</span>
        </div>
        <h1
          className="text-5xl text-[#2C2416] mb-4 tracking-tight"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400, letterSpacing: '-0.02em' }}
        >
          Settlement
        </h1>
        <p
          className="text-xl text-[#6B5D4F] leading-relaxed"
          style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
        >
          Understand how and when funds reach your account
        </p>
      </div>

      {/* Overview */}
      <div className="bg-[#E8F5E9] border border-[#4CAF50] p-6 rounded mb-8">
        <p className="text-[#2C2416] text-base mb-2">
          <strong style={{ fontFamily: 'Georgia, serif' }}>Two Settlement Options</strong>
        </p>
        <p className="text-[#6B5D4F] text-base mb-0">
          Hedge Payments offers two settlement methods: <strong>USDC</strong> for instant settlement on the Solana blockchain, and <strong>USD</strong> for traditional bank settlement via ACH. You can configure your preferred method per merchant account.
        </p>
      </div>

      {/* Settlement Types Comparison */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Settlement Types
        </h2>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D4C5B0]">
                <th className="py-3 pr-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Feature</th>
                <th className="py-3 px-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>USDC (Solana)</th>
                <th className="py-3 pl-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>USD (ACH)</th>
              </tr>
            </thead>
            <tbody className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-semibold text-[#2C2416]">Settlement Speed</td>
                <td className="py-3 px-4 text-[#4CAF50] font-semibold">Instant (seconds)</td>
                <td className="py-3 pl-4">3 business days</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-semibold text-[#2C2416]">Settlement Fee</td>
                <td className="py-3 px-4">0.5%</td>
                <td className="py-3 pl-4">0.25%</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-semibold text-[#2C2416]">Currency</td>
                <td className="py-3 px-4">USDC (stablecoin)</td>
                <td className="py-3 pl-4">US Dollars</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-semibold text-[#2C2416]">Destination</td>
                <td className="py-3 px-4">Solana wallet address</td>
                <td className="py-3 pl-4">Bank account (routing + account number)</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4 font-semibold text-[#2C2416]">Minimum Payout</td>
                <td className="py-3 px-4">$1.00</td>
                <td className="py-3 pl-4">$25.00</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-semibold text-[#2C2416]">Availability</td>
                <td className="py-3 px-4">24/7/365</td>
                <td className="py-3 pl-4">Business days only</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Settlement Timeline */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Settlement Timeline
        </h2>

        <h3
          className="text-xl text-[#2C2416] mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
        >
          USDC Settlement Flow
        </h3>

        <div className="space-y-3 not-prose mb-8">
          <div className="flex items-center gap-4 p-4 bg-white border border-[#D4C5B0] rounded">
            <div className="w-8 h-8 rounded-full bg-[#E8F5E9] text-[#4CAF50] flex items-center justify-center font-bold">1</div>
            <div>
              <p className="font-semibold text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Payment Confirmed</p>
              <p className="text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Customer payment is successfully processed</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-white border border-[#D4C5B0] rounded">
            <div className="w-8 h-8 rounded-full bg-[#E8F5E9] text-[#4CAF50] flex items-center justify-center font-bold">2</div>
            <div>
              <p className="font-semibold text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>USDC Converted</p>
              <p className="text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>USD is converted to USDC at 1:1 peg (minus settlement fee)</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-[#E8F5E9]/30 border border-[#4CAF50] rounded">
            <div className="w-8 h-8 rounded-full bg-[#E8F5E9] text-[#4CAF50] flex items-center justify-center font-bold">3</div>
            <div>
              <p className="font-semibold text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Instant Transfer</p>
              <p className="text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>USDC is sent to your Solana wallet within seconds</p>
            </div>
          </div>
        </div>

        <h3
          className="text-xl text-[#2C2416] mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
        >
          USD Settlement Flow
        </h3>

        <div className="space-y-3 not-prose mb-8">
          <div className="flex items-center gap-4 p-4 bg-white border border-[#D4C5B0] rounded">
            <div className="w-8 h-8 rounded-full bg-[#FFF4E6] text-[#F59E0B] flex items-center justify-center font-bold">1</div>
            <div>
              <p className="font-semibold text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Payment Confirmed</p>
              <p className="text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Customer payment is successfully processed</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-white border border-[#D4C5B0] rounded">
            <div className="w-8 h-8 rounded-full bg-[#FFF4E6] text-[#F59E0B] flex items-center justify-center font-bold">2</div>
            <div>
              <p className="font-semibold text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Funds Held</p>
              <p className="text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Funds are held in your Hedge Payments balance (1-2 business days)</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-white border border-[#D4C5B0] rounded">
            <div className="w-8 h-8 rounded-full bg-[#FFF4E6] text-[#F59E0B] flex items-center justify-center font-bold">3</div>
            <div>
              <p className="font-semibold text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>ACH Initiated</p>
              <p className="text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>ACH transfer is initiated to your bank account</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-white border border-[#D4C5B0] rounded">
            <div className="w-8 h-8 rounded-full bg-[#E3F2FD] text-[#2196F3] flex items-center justify-center font-bold">4</div>
            <div>
              <p className="font-semibold text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Bank Deposit</p>
              <p className="text-sm text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>Funds arrive in your bank account (total: ~3 business days)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Configure Settlement
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Set the settlement method per merchant via the API or dashboard:
        </p>

        <div className="space-y-4 mb-6">
          <div>
            <p className="text-sm text-[#8B7E6E] mb-2" style={{ fontFamily: 'Georgia, serif' }}>Node.js</p>
            <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto">
              <code>{`// Configure USDC settlement
await hedge.merchants.update('merch_abc123', {
  settlement: {
    method: 'usdc',
    solana_wallet: 'YourSolanaWalletAddressHere',
    auto_settle: true  // Settle after every transaction
  }
})

// Configure USD (ACH) settlement
await hedge.merchants.update('merch_abc123', {
  settlement: {
    method: 'usd',
    bank_account: {
      routing_number: '021000021',
      account_number: '123456789',
      account_type: 'checking'
    },
    schedule: 'daily'  // Options: 'daily', 'weekly', 'manual'
  }
})`}</code>
            </pre>
          </div>

          <div>
            <p className="text-sm text-[#8B7E6E] mb-2" style={{ fontFamily: 'Georgia, serif' }}>cURL</p>
            <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto">
              <code>{`curl -X PATCH https://api.hedgepayments.com/v1/merchants/merch_abc123 \\
  -H "Authorization: Bearer sk_live_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "settlement": {
      "method": "usdc",
      "solana_wallet": "YourSolanaWalletAddressHere",
      "auto_settle": true
    }
  }'`}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Fee Comparison */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Fee Comparison
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Here is how settlement fees compare for a $1,000 payment:
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D4C5B0]">
                <th className="py-3 pr-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>Component</th>
                <th className="py-3 px-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>USDC Settlement</th>
                <th className="py-3 pl-4 text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>USD Settlement</th>
              </tr>
            </thead>
            <tbody className="text-[#6B5D4F]" style={{ fontFamily: 'Georgia, serif' }}>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4">Payment processing</td>
                <td className="py-3 px-4">2.9% + $0.30 = $29.30</td>
                <td className="py-3 pl-4">2.9% + $0.30 = $29.30</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50">
                <td className="py-3 pr-4">Settlement fee</td>
                <td className="py-3 px-4">0.5% = $5.00</td>
                <td className="py-3 pl-4">0.25% = $2.50</td>
              </tr>
              <tr className="border-b border-[#D4C5B0]/50 font-semibold text-[#2C2416]">
                <td className="py-3 pr-4">Total fees</td>
                <td className="py-3 px-4">$34.30</td>
                <td className="py-3 pl-4">$31.80</td>
              </tr>
              <tr className="font-semibold text-[#2C2416]">
                <td className="py-3 pr-4">You receive</td>
                <td className="py-3 px-4">$965.70 USDC</td>
                <td className="py-3 pl-4">$968.20 USD</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* When to Use Each */}
      <div className="border-t border-[#D4C5B0] pt-8 mb-10">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          When to Use Each
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#E8F5E9] border border-[#4CAF50] p-6 rounded">
            <h3 className="text-lg text-[#2C2416] mb-3" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
              Choose USDC When
            </h3>
            <ul className="text-[#2C2416] text-base space-y-2 mb-0">
              <li>You need immediate access to funds</li>
              <li>You operate on weekends or holidays</li>
              <li>You want to avoid banking delays</li>
              <li>You already use crypto for operations</li>
              <li>You pay international suppliers in stablecoins</li>
            </ul>
          </div>

          <div className="bg-white border border-[#D4C5B0] p-6 rounded">
            <h3 className="text-lg text-[#2C2416] mb-3" style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}>
              Choose USD When
            </h3>
            <ul className="text-[#2C2416] text-base space-y-2 mb-0">
              <li>You prefer traditional banking</li>
              <li>Lower settlement fees matter most</li>
              <li>3-day settlement is acceptable</li>
              <li>You want funds directly in your bank</li>
              <li>Your accounting is purely USD-based</li>
            </ul>
          </div>
        </div>

        <div className="bg-[#FFF4E6] border border-[#F59E0B] p-6 rounded">
          <p className="text-[#2C2416] text-base mb-0">
            <strong style={{ fontFamily: 'Georgia, serif' }}>You can switch settlement methods at any time.</strong> Changes take effect on the next settlement cycle. In-progress settlements will complete using the previous method.
          </p>
        </div>
      </div>

      {/* What's Next */}
      <div className="border-t border-[#D4C5B0] pt-8">
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          What's Next?
        </h2>

        <div className="grid md:grid-cols-2 gap-6 not-prose">
          <Link
            href="/docs/reference"
            className="block p-6 bg-white border border-[#D4C5B0] hover:border-[#2C2416] transition-all hover:shadow-md"
          >
            <h3
              className="text-xl text-[#2C2416] mb-2"
              style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
            >
              API Reference
            </h3>
            <p
              className="text-sm text-[#6B5D4F]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Explore the full merchant and settlement endpoints
            </p>
          </Link>

          <Link
            href="/docs/guides/webhooks"
            className="block p-6 bg-white border border-[#D4C5B0] hover:border-[#2C2416] transition-all hover:shadow-md"
          >
            <h3
              className="text-xl text-[#2C2416] mb-2"
              style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
            >
              Webhooks
            </h3>
            <p
              className="text-sm text-[#6B5D4F]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Get notified when settlements complete
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}
