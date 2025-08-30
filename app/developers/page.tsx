'use client';

import Link from 'next/link';

export default function DevelopersPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            Build with Round-Ups
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Transform spare change into investment opportunities with our white-label API and SDKs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Link href="/docs" className="group">
            <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-emerald-500 transition-all">
              <div className="text-emerald-400 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Documentation</h3>
              <p className="text-gray-400 mb-4">
                Comprehensive guides and API reference to get you started quickly
              </p>
              <span className="text-emerald-400 group-hover:text-emerald-300 font-medium">
                View Docs →
              </span>
            </div>
          </Link>

          <Link href="/docs/api-reference/introduction" className="group">
            <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-emerald-500 transition-all">
              <div className="text-emerald-400 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">API Reference</h3>
              <p className="text-gray-400 mb-4">
                RESTful API with interactive playground for testing endpoints
              </p>
              <span className="text-emerald-400 group-hover:text-emerald-300 font-medium">
                Explore API →
              </span>
            </div>
          </Link>

          <Link href="/docs/sdks/javascript/installation" className="group">
            <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-emerald-500 transition-all">
              <div className="text-emerald-400 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">SDKs</h3>
              <p className="text-gray-400 mb-4">
                Native SDKs for JavaScript, React, Python, and more
              </p>
              <span className="text-emerald-400 group-hover:text-emerald-300 font-medium">
                Get SDKs →
              </span>
            </div>
          </Link>
        </div>

        <div className="bg-gradient-to-r from-emerald-900/20 to-teal-900/20 rounded-3xl p-12 border border-emerald-900/50">
          <h2 className="text-3xl font-bold text-white mb-6">Quick Start</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-emerald-400 mb-3">1. Install the SDK</h3>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
                <code className="text-gray-300">npm install @hedge/sdk-core</code>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-emerald-400 mb-3">2. Initialize</h3>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <pre className="text-gray-300">{`import { HedgeSDK } from '@hedge/sdk-core';

const hedge = new HedgeSDK({
  apiKey: 'your-api-key',
  partnerId: 'your-partner-id'
});`}</pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-emerald-400 mb-3">3. Enable Round-ups</h3>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <pre className="text-gray-300">{`// Create user
const user = await hedge.users.create({
  email: 'user@example.com'
});

// Enable round-ups
await hedge.roundups.enable(user.id);`}</pre>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <Link 
              href="/docs/quickstart"
              className="inline-flex items-center px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
            >
              View Full Tutorial
            </Link>
            <Link 
              href="/signup"
              className="inline-flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors"
            >
              Get API Keys
            </Link>
          </div>
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <h3 className="text-2xl font-bold text-white mb-4">Provider Flexibility</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span className="text-gray-300">OAuth: Meld, Plaid, Finicity</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span className="text-gray-300">ACH: Dwolla, Stripe, Modern Treasury</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span className="text-gray-300">Switch providers without code changes</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <h3 className="text-2xl font-bold text-white mb-4">Enterprise Ready</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span className="text-gray-300">PCI compliant infrastructure</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span className="text-gray-300">99.9% uptime SLA</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span className="text-gray-300">Dedicated support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}