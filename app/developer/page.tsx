'use client'

import { useState } from 'react'

export default function DeveloperPage() {
  const [showDocs, setShowDocs] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const checkPassword = () => {
    if (inputValue === 'HedgeAccess') {
      setShowDocs(true)
    } else {
      alert('Invalid password. Please enter: HedgeAccess')
    }
  }

  if (!showDocs) {
    return (
      <div className="min-h-screen bg-[#071b1d] flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-[#0a2b2e] rounded-2xl p-8 border border-[#163e44]">
            <h1 className="text-3xl font-bold text-[#5bf2c9] mb-6 text-center">
              Developer Access
            </h1>
            <div className="space-y-4">
              <div>
                <label className="block text-[#93e8d5] mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      checkPassword()
                    }
                  }}
                  className="w-full px-4 py-3 bg-[#071b1d] border border-[#163e44] rounded-lg text-white focus:outline-none focus:border-[#5bf2c9] transition-colors"
                  placeholder="Enter access code"
                />
              </div>
              <button
                onClick={checkPassword}
                className="w-full py-3 bg-gradient-to-r from-[#5bf2c9] to-[#79e1ff] text-[#071b1d] font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                Access Documentation
              </button>
              <p className="text-[#93e8d5] text-sm text-center opacity-70">
                Hint: The password is HedgeAccess
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#071b1d] text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-[#5bf2c9] mb-2">
            Hedge Payments API Documentation
          </h1>
          <p className="text-[#93e8d5]">Round-Ups API Integration Guide</p>
        </header>

        <div className="space-y-8">
          {/* Overview Section */}
          <section className="bg-[#0a2b2e] rounded-2xl p-8 border border-[#163e44]">
            <h2 className="text-2xl font-bold text-[#79e1ff] mb-4">Overview</h2>
            <p className="text-[#c9fff0] mb-4">
              The Hedge Payments Round-Ups API enables seamless integration of automated savings
              and micro-investment features into your application. Round up transactions to the
              nearest dollar and automatically transfer the difference to savings or investment accounts.
            </p>
            <div className="bg-[#071b1d] rounded-lg p-4">
              <code className="text-[#5bf2c9]">
                Base URL: https://api.hedgepayments.com/v1
              </code>
            </div>
          </section>

          {/* Authentication */}
          <section className="bg-[#0a2b2e] rounded-2xl p-8 border border-[#163e44]">
            <h2 className="text-2xl font-bold text-[#79e1ff] mb-4">Authentication</h2>
            <p className="text-[#c9fff0] mb-4">
              All API requests require authentication using an API key in the header:
            </p>
            <div className="bg-[#071b1d] rounded-lg p-4 overflow-x-auto">
              <pre className="text-[#5bf2c9]">
{`Authorization: Bearer YOUR_API_KEY
Content-Type: application/json`}
              </pre>
            </div>
          </section>

          {/* Core Endpoints */}
          <section className="bg-[#0a2b2e] rounded-2xl p-8 border border-[#163e44]">
            <h2 className="text-2xl font-bold text-[#79e1ff] mb-6">Core Endpoints</h2>

            {/* Settings Management */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-[#5bf2c9] mb-3">Settings Management</h3>

              <div className="space-y-4">
                <div className="bg-[#071b1d] rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-green-400 font-mono">GET</span>
                    <code className="text-[#93e8d5]">/users/{'{userId}'}/roundups/settings</code>
                  </div>
                  <p className="text-[#c9fff0] text-sm">Retrieve round-up settings for a user</p>
                </div>

                <div className="bg-[#071b1d] rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-blue-400 font-mono">POST</span>
                    <code className="text-[#93e8d5]">/roundups/settings</code>
                  </div>
                  <p className="text-[#c9fff0] text-sm mb-3">Create round-up settings</p>
                  <pre className="text-[#5bf2c9] text-xs overflow-x-auto">
{`{
  "userId": "string",
  "enabled": true,
  "roundupType": "nearest_dollar",
  "customAmount": 5.00,
  "minimumPurchase": 1.00,
  "maximumRoundup": 10.00,
  "destinationAccountId": "string"
}`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Round-Up Operations */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-[#5bf2c9] mb-3">Round-Up Operations</h3>

              <div className="space-y-4">
                <div className="bg-[#071b1d] rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-green-400 font-mono">GET</span>
                    <code className="text-[#93e8d5]">/users/{'{userId}'}/roundups</code>
                  </div>
                  <p className="text-[#c9fff0] text-sm mb-3">List all round-ups for a user</p>
                  <p className="text-[#93e8d5] text-xs">Query params: page, limit, status, startDate, endDate</p>
                </div>

                <div className="bg-[#071b1d] rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-blue-400 font-mono">POST</span>
                    <code className="text-[#93e8d5]">/users/{'{userId}'}/roundups/process</code>
                  </div>
                  <p className="text-[#c9fff0] text-sm">Process pending round-ups</p>
                </div>
              </div>
            </div>
          </section>

          {/* SDK Integration */}
          <section className="bg-[#0a2b2e] rounded-2xl p-8 border border-[#163e44]">
            <h2 className="text-2xl font-bold text-[#79e1ff] mb-4">SDK Integration</h2>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#5bf2c9] mb-3">Installation</h3>
              <div className="bg-[#071b1d] rounded-lg p-4">
                <pre className="text-[#5bf2c9]">
{`npm install @hedge/sdk-core @hedge/sdk-react`}
                </pre>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#5bf2c9] mb-3">TypeScript Example</h3>
              <div className="bg-[#071b1d] rounded-lg p-4 overflow-x-auto">
                <pre className="text-[#5bf2c9] text-sm">
{`import { RoundupsApi } from '@hedge/sdk-core';

const roundupsApi = new RoundupsApi({
  apiKey: 'YOUR_API_KEY',
  environment: 'production'
});

// Enable round-ups for a user
async function enableRoundups(userId: string) {
  const settings = await roundupsApi.enable(userId);
  console.log('Round-ups enabled:', settings);
}`}
                </pre>
              </div>
            </div>
          </section>

          {/* Live Demo */}
          <section className="bg-[#0a2b2e] rounded-2xl p-8 border border-[#163e44]">
            <h2 className="text-2xl font-bold text-[#79e1ff] mb-4">Live Demo</h2>
            <p className="text-[#c9fff0] mb-6">
              Experience the Round-Ups configuration interface that your users will see:
            </p>
            <a
              href="/demo/roundups"
              target="_blank"
              className="inline-block px-6 py-3 bg-gradient-to-r from-[#5bf2c9] to-[#79e1ff] text-[#071b1d] font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              View Interactive Demo →
            </a>
            <p className="text-sm text-[#93e8d5] mt-4">
              This demo shows the exact UI component that can be embedded in your application
            </p>
          </section>

          {/* Support */}
          <section className="bg-[#0a2b2e] rounded-2xl p-8 border border-[#163e44]">
            <h2 className="text-2xl font-bold text-[#79e1ff] mb-4">Support</h2>
            <p className="text-[#c9fff0] mb-4">
              For API support and questions:
            </p>
            <div className="space-y-2 text-[#5bf2c9]">
              <p>Email: api@hedgepayments.com</p>
              <p>Documentation: developers.hedgepayments.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}