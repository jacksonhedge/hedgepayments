'use client'

import Link from 'next/link'

export default function DocsPage() {
  return (
    <div className="prose prose-lg max-w-none">
      {/* Header */}
      <div className="mb-12">
        <h1
          className="text-5xl text-[#2C2416] mb-4 tracking-tight"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400, letterSpacing: '-0.02em' }}
        >
          Documentation
        </h1>
        <p
          className="text-xl text-[#6B5D4F] leading-relaxed mb-6"
          style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
        >
          Everything you need to integrate Hedge Payments into your application
        </p>

        <div className="bg-[#E8F5E9] border border-[#4CAF50] p-6 rounded">
          <p className="text-[#2C2416] text-base mb-2">
            <strong style={{ fontFamily: 'Georgia, serif' }}>🤖 Built for AI:</strong>
          </p>
          <p className="text-[#6B5D4F] text-base mb-0">
            Hedge Payments works seamlessly with <strong>Claude</strong>, <strong>Claude Code</strong>, <strong>ChatGPT</strong>, <strong>OpenAI Codex</strong>, <strong>Gemini</strong>, and all major AI platforms.
            Our API is designed for AI agents to process payments autonomously with minimal configuration.
          </p>
        </div>
      </div>

      {/* Quick Start Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-16 not-prose">
        <Link
          href="/docs/quickstart"
          className="block p-6 bg-white border border-[#D4C5B0] hover:border-[#2C2416] transition-all hover:shadow-md"
        >
          <h3
            className="text-xl text-[#2C2416] mb-2"
            style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
          >
            🚀 Quick Start
          </h3>
          <p
            className="text-sm text-[#6B5D4F]"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Get up and running in 5 minutes with our simple integration guide
          </p>
        </Link>

        <Link
          href="/docs/authentication"
          className="block p-6 bg-white border border-[#D4C5B0] hover:border-[#2C2416] transition-all hover:shadow-md"
        >
          <h3
            className="text-xl text-[#2C2416] mb-2"
            style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
          >
            🔐 Authentication
          </h3>
          <p
            className="text-sm text-[#6B5D4F]"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Learn how to authenticate your API requests with JWT tokens
          </p>
        </Link>

        <Link
          href="/docs/payments/create"
          className="block p-6 bg-white border border-[#D4C5B0] hover:border-[#2C2416] transition-all hover:shadow-md"
        >
          <h3
            className="text-xl text-[#2C2416] mb-2"
            style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
          >
            💳 Accept Payments
          </h3>
          <p
            className="text-sm text-[#6B5D4F]"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Start accepting crypto and fiat payments in your application
          </p>
        </Link>

        <Link
          href="/docs/guides/ai-integration"
          className="block p-6 bg-white border border-[#D4C5B0] hover:border-[#2C2416] transition-all hover:shadow-md"
        >
          <h3
            className="text-xl text-[#2C2416] mb-2"
            style={{ fontFamily: 'Georgia, serif', fontWeight: 500 }}
          >
            🤖 AI Integration
          </h3>
          <p
            className="text-sm text-[#6B5D4F]"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Integrate with Claude, ChatGPT, and other AI agents
          </p>
        </Link>
      </div>

      {/* Main Content */}
      <div
        className="border-t border-[#D4C5B0] pt-12"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        <h2
          className="text-3xl text-[#2C2416] mb-6"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Introduction
        </h2>

        <p className="text-[#2C2416] text-lg leading-relaxed mb-6">
          Hedge Payments is a modern payment infrastructure designed for AI agents, crypto companies, and the autonomous economy. Built on top of Coinflow, we provide a simple, developer-friendly API for accepting payments globally.
        </p>

        <h3
          className="text-2xl text-[#2C2416] mt-10 mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Key Features
        </h3>

        <ul className="text-[#2C2416] text-lg leading-relaxed space-y-3 mb-8">
          <li>🤖 <strong>AI-First Design:</strong> Works seamlessly with Claude, Claude Code, ChatGPT, Codex, and all major AI platforms</li>
          <li>💰 Accept 50+ cryptocurrencies and fiat currencies</li>
          <li>🔐 Secure JWT-based authentication with simple API keys</li>
          <li>🌍 Global payment support in 180+ countries</li>
          <li>⚡ Real-time transaction tracking and webhooks</li>
          <li>📊 Complete balance and payout management</li>
        </ul>

        <h3
          className="text-2xl text-[#2C2416] mt-10 mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Base URLs
        </h3>

        <div className="bg-white border border-[#D4C5B0] p-6 mb-8">
          <div className="mb-4">
            <p className="text-sm text-[#8B7E6E] mb-1">Production</p>
            <code className="text-[#2C2416] bg-[#FAF8F5] px-3 py-1 rounded">
              https://api.hedgepayments.com
            </code>
          </div>
          <div>
            <p className="text-sm text-[#8B7E6E] mb-1">Sandbox</p>
            <code className="text-[#2C2416] bg-[#FAF8F5] px-3 py-1 rounded">
              https://api-sandbox.hedgepayments.com
            </code>
          </div>
        </div>

        <h3
          className="text-2xl text-[#2C2416] mt-10 mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Example Request
        </h3>

        <pre className="bg-[#2C2416] text-[#FAF8F5] p-6 rounded overflow-x-auto mb-8">
          <code>{`curl -X POST https://api.hedgepayments.com/api/payments \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 100.00,
    "currency": "USD",
    "customerEmail": "user@example.com"
  }'`}</code>
        </pre>

        <div className="bg-[#FFF4E6] border border-[#F59E0B] p-6 rounded mt-8">
          <p className="text-[#2C2416] text-base">
            <strong style={{ fontFamily: 'Georgia, serif' }}>💡 Need help?</strong><br />
            Check out our <Link href="/docs/guides/ai-integration" className="text-[#2C2416] underline">AI Integration Guide</Link> or{' '}
            <Link href="/contact" className="text-[#2C2416] underline">contact our team</Link> for personalized support.
          </p>
        </div>
      </div>
    </div>
  )
}
