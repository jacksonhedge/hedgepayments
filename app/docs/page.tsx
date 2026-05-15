'use client'

import Link from 'next/link'
import { CodeBlock, Callout, NavCards } from './components'

export default function DocsPage() {
  return (
    <div className="prose prose-lg max-w-none">
      {/* Hero Header */}
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

        <Callout variant="info" title="Built for AI">
          <p>
            Hedge Payments works seamlessly with <strong>Claude</strong>, <strong>Claude Code</strong>, <strong>ChatGPT</strong>, <strong>OpenAI Codex</strong>, <strong>Gemini</strong>, and all major AI platforms.
            Our API is designed for AI agents to process payments autonomously with minimal configuration.
          </p>
        </Callout>
      </div>

      {/* Quick Start Cards */}
      <div className="mb-16 not-prose">
        <NavCards
          cards={[
            {
              title: 'Quick Start',
              description: 'Get up and running in 5 minutes with our simple integration guide',
              href: '/docs/quickstart',
            },
            {
              title: 'Authentication',
              description: 'Learn how to authenticate your API requests with JWT tokens',
              href: '/docs/authentication',
            },
            {
              title: 'Accept Payments',
              description: 'Start accepting crypto and fiat payments in your application',
              href: '/docs/payments/create',
            },
            {
              title: 'AI Integration',
              description: 'Integrate with Claude, ChatGPT, and other AI agents',
              href: '/docs/guides/ai-integration',
            },
          ]}
        />
      </div>

      {/* Introduction */}
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
          <li><strong>AI-First Design</strong> -- Works seamlessly with Claude, Claude Code, ChatGPT, Codex, and all major AI platforms</li>
          <li><strong>Multi-Currency Support</strong> -- Accept 50+ cryptocurrencies and fiat currencies</li>
          <li><strong>Secure Authentication</strong> -- JWT-based authentication with simple API keys</li>
          <li><strong>Global Reach</strong> -- Payment support in 180+ countries</li>
          <li><strong>Real-Time Tracking</strong> -- Live transaction tracking and webhooks</li>
          <li><strong>Complete Management</strong> -- Full balance and payout management</li>
        </ul>

        <h3
          className="text-2xl text-[#2C2416] mt-10 mb-4"
          style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}
        >
          Base URLs
        </h3>

        <div className="bg-white border border-[#D4C5B0] rounded-lg p-6 mb-8">
          <div className="mb-4">
            <p className="text-sm text-[#8B7E6E] mb-1">Production</p>
            <code className="text-[#2C2416] bg-[#FAF8F5] px-3 py-1 rounded font-mono text-sm">
              https://api.hedgepayments.com
            </code>
          </div>
          <div>
            <p className="text-sm text-[#8B7E6E] mb-1">Sandbox</p>
            <code className="text-[#2C2416] bg-[#FAF8F5] px-3 py-1 rounded font-mono text-sm">
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

        <CodeBlock
          language="bash"
          title="Example Request"
          code={`curl -X POST https://api.hedgepayments.com/api/payments \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 100.00,
    "currency": "USD",
    "customerEmail": "user@example.com"
  }'`}
        />

        <div className="mt-8">
          <Callout variant="warning" title="Need help?">
            <p>
              Check out our <Link href="/docs/guides/ai-integration" className="text-[#2C2416] underline font-semibold">AI Integration Guide</Link> or{' '}
              <Link href="/contact" className="text-[#2C2416] underline font-semibold">contact our team</Link> for personalized support.
            </p>
          </Callout>
        </div>
      </div>
    </div>
  )
}
