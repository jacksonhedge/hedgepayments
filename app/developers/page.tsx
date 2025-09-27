'use client'

import { useState } from 'react'
import { ChevronRightIcon, CodeBracketIcon, DocumentTextIcon, CommandLineIcon, CubeIcon, RocketLaunchIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

export default function DeveloperPortal() {
  const [activeTab, setActiveTab] = useState<'quickstart' | 'api' | 'sdk' | 'widget' | 'mcp'>('quickstart')
  const [selectedLanguage, setSelectedLanguage] = useState<'javascript' | 'python' | 'curl'>('javascript')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const codeExamples = {
    javascript: {
      install: `npm install @hedgepayments/sdk`,
      quickstart: `import HedgePayments from '@hedgepayments/sdk'

const hedge = new HedgePayments({
  apiKey: 'YOUR_API_KEY',
  sandbox: true // Use sandbox environment
})

// Create a wallet
const wallet = await hedge.wallets.create({
  userId: 'user_123',
  currency: 'USD'
})

// Process a payment
const payment = await hedge.transactions.create({
  amount: 50.00,
  currency: 'USD',
  method: 'card',
  paymentMethodId: 'pm_123',
  description: 'Order #12345'
})

console.log('Payment processed:', payment.id)`,
      widget: `<!-- Add to your HTML -->
<script src="https://js.hedgepayments.com/v1/hedge-widget.js"></script>
<div id="hedge-checkout"></div>

<script>
  HedgeWidget.createCheckout({
    apiKey: 'YOUR_API_KEY',
    amount: 50.00,
    currency: 'USD',
    methods: ['card', 'paypal', 'crypto'],
    onSuccess: (payment) => {
      console.log('Payment successful:', payment)
    }
  }).mount('#hedge-checkout')
</script>`
    },
    python: {
      install: `pip install hedgepayments`,
      quickstart: `from hedgepayments import HedgePayments

hedge = HedgePayments(
    api_key='YOUR_API_KEY',
    sandbox=True
)

# Create a wallet
wallet = hedge.wallets.create(
    user_id='user_123',
    currency='USD'
)

# Process a payment
payment = hedge.transactions.create(
    amount=50.00,
    currency='USD',
    method='card',
    payment_method_id='pm_123',
    description='Order #12345'
)

print(f'Payment processed: {payment.id}')`,
      widget: `# Generate payment link
payment_link = hedge.create_payment_link(
    amount=50.00,
    currency='USD',
    description='Order #12345'
)

print(f'Payment link: {payment_link}')`
    },
    curl: {
      install: `# No installation needed`,
      quickstart: `# Create a wallet
curl -X POST https://api.hedgepayments.com/v1/wallets \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "userId": "user_123",
    "currency": "USD"
  }'

# Process a payment
curl -X POST https://api.hedgepayments.com/v1/transactions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 50.00,
    "currency": "USD",
    "method": "card",
    "paymentMethodId": "pm_123",
    "description": "Order #12345"
  }'`,
      widget: `# Use payment links for no-code integration
https://pay.hedgepayments.com/?amount=50&currency=USD&description=Order`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <span className="text-4xl mr-3">🦔</span>
                HedgePayments Developer Portal
              </h1>
              <p className="text-slate-400 mt-2">Build payment experiences with our powerful APIs</p>
            </div>
            <div className="flex space-x-4">
              <a
                href="/api-spec/openapi.yaml"
                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                OpenAPI Spec
              </a>
              <a
                href="https://github.com/hedgepayments"
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 mb-8">
          <div className="flex overflow-x-auto">
            {[
              { id: 'quickstart', label: 'Quick Start', icon: RocketLaunchIcon },
              { id: 'api', label: 'API Reference', icon: DocumentTextIcon },
              { id: 'sdk', label: 'SDKs', icon: CubeIcon },
              { id: 'widget', label: 'Low-Code Widget', icon: CodeBracketIcon },
              { id: 'mcp', label: 'MCP / AI Integration', icon: CommandLineIcon }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-white bg-slate-700/50'
                    : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-700/30'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'quickstart' && (
              <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Get Started in 5 Minutes</h2>

                {/* Language Selector */}
                <div className="flex space-x-2 mb-6">
                  {['javascript', 'python', 'curl'].map(lang => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang as any)}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        selectedLanguage === lang
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {lang === 'javascript' ? 'JavaScript' : lang === 'python' ? 'Python' : 'cURL'}
                    </button>
                  ))}
                </div>

                {/* Step 1: Install */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-3">1. Install the SDK</h3>
                  <div className="relative bg-slate-900 rounded-lg p-4">
                    <pre className="text-green-400 overflow-x-auto">
                      <code>{codeExamples[selectedLanguage].install}</code>
                    </pre>
                    <button
                      onClick={() => copyCode(codeExamples[selectedLanguage].install, 'install')}
                      className="absolute top-2 right-2 px-3 py-1 bg-slate-700 text-white text-sm rounded hover:bg-slate-600"
                    >
                      {copiedCode === 'install' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Step 2: Initialize */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-3">2. Start Processing Payments</h3>
                  <div className="relative bg-slate-900 rounded-lg p-4">
                    <pre className="text-green-400 overflow-x-auto text-sm">
                      <code>{codeExamples[selectedLanguage].quickstart}</code>
                    </pre>
                    <button
                      onClick={() => copyCode(codeExamples[selectedLanguage].quickstart, 'quickstart')}
                      className="absolute top-2 right-2 px-3 py-1 bg-slate-700 text-white text-sm rounded hover:bg-slate-600"
                    >
                      {copiedCode === 'quickstart' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Features */}
                <div className="border-t border-slate-700 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">What You Can Build</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      'Multi-currency wallets',
                      'P2P payments',
                      'Subscription billing',
                      'Marketplace payouts',
                      'Crypto payments',
                      'BNPL integrations'
                    ].map(feature => (
                      <div key={feature} className="flex items-center space-x-2">
                        <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
                        <span className="text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6">
                <h2 className="text-2xl font-bold text-white mb-6">API Reference</h2>

                <div className="space-y-6">
                  {/* Endpoints */}
                  {[
                    {
                      method: 'POST',
                      path: '/wallets',
                      description: 'Create a new wallet',
                      color: 'bg-green-500'
                    },
                    {
                      method: 'GET',
                      path: '/wallets/{id}',
                      description: 'Get wallet details',
                      color: 'bg-blue-500'
                    },
                    {
                      method: 'POST',
                      path: '/transactions',
                      description: 'Process a payment',
                      color: 'bg-green-500'
                    },
                    {
                      method: 'POST',
                      path: '/transactions/{id}/refund',
                      description: 'Refund a transaction',
                      color: 'bg-green-500'
                    },
                    {
                      method: 'GET',
                      path: '/transactions',
                      description: 'List transactions',
                      color: 'bg-blue-500'
                    }
                  ].map(endpoint => (
                    <div key={endpoint.path} className="border border-slate-700 rounded-lg p-4 hover:bg-slate-700/30 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className={`${endpoint.color} text-white text-xs font-bold px-2 py-1 rounded`}>
                            {endpoint.method}
                          </span>
                          <code className="text-emerald-400 font-mono">{endpoint.path}</code>
                        </div>
                        <ChevronRightIcon className="w-5 h-5 text-slate-400" />
                      </div>
                      <p className="text-slate-400">{endpoint.description}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
                  <p className="text-slate-300">
                    📚 Full API documentation available in our{' '}
                    <a href="/api-spec/openapi.yaml" className="text-emerald-400 hover:text-emerald-300">
                      OpenAPI specification
                    </a>
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'widget' && (
              <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Low-Code Payment Widget</h2>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-3">Embed in 30 Seconds</h3>
                  <div className="relative bg-slate-900 rounded-lg p-4">
                    <pre className="text-green-400 overflow-x-auto text-sm">
                      <code>{codeExamples.javascript.widget}</code>
                    </pre>
                    <button
                      onClick={() => copyCode(codeExamples.javascript.widget, 'widget')}
                      className="absolute top-2 right-2 px-3 py-1 bg-slate-700 text-white text-sm rounded hover:bg-slate-600"
                    >
                      {copiedCode === 'widget' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Live Preview */}
                <div className="border-t border-slate-700 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Live Preview</h3>
                  <div className="bg-white rounded-lg p-8">
                    <div id="hedge-checkout-demo">
                      {/* Widget would render here */}
                      <div className="text-center">
                        <div className="text-4xl mb-4">🦔</div>
                        <p className="text-gray-600">Payment widget loads here</p>
                        <button className="mt-4 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold">
                          Pay $50.00
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">🎨 Customizable</h4>
                    <p className="text-slate-400 text-sm">Match your brand with themes and custom CSS</p>
                  </div>
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">🔒 PCI Compliant</h4>
                    <p className="text-slate-400 text-sm">We handle all sensitive payment data</p>
                  </div>
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">📱 Mobile Ready</h4>
                    <p className="text-slate-400 text-sm">Responsive design for all devices</p>
                  </div>
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">🌍 Multi-Currency</h4>
                    <p className="text-slate-400 text-sm">Support 150+ currencies</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'mcp' && (
              <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6">
                <h2 className="text-2xl font-bold text-white mb-6">MCP & AI Integration</h2>

                <div className="mb-8">
                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-6 border border-purple-500/30">
                    <h3 className="text-xl font-semibold text-white mb-3">
                      🤖 First Payment Gateway for AI Agents
                    </h3>
                    <p className="text-slate-300">
                      Enable Claude, ChatGPT, and other AI assistants to process payments directly through natural language.
                    </p>
                  </div>
                </div>

                {/* Claude Integration */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-3">Claude Desktop Integration</h3>
                  <div className="relative bg-slate-900 rounded-lg p-4">
                    <pre className="text-green-400 overflow-x-auto text-sm">
                      <code>{`// Add to ~/Library/Application Support/Claude/claude_desktop_config.json
{
  "mcpServers": {
    "hedge-payments": {
      "command": "node",
      "args": ["/path/to/mcp-server/dist/index.js"],
      "env": {
        "STRIPE_SECRET_KEY": "your_key"
      }
    }
  }
}`}</code>
                    </pre>
                  </div>
                </div>

                {/* ChatGPT Integration */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-3">ChatGPT Custom Actions</h3>
                  <div className="relative bg-slate-900 rounded-lg p-4">
                    <pre className="text-green-400 overflow-x-auto text-sm">
                      <code>{`// Add to your Custom GPT
{
  "name": "process_payment",
  "description": "Process a payment transaction",
  "parameters": {
    "amount": "number",
    "recipient": "string",
    "method": "string"
  }
}`}</code>
                    </pre>
                  </div>
                </div>

                {/* Example Conversations */}
                <div className="border-t border-slate-700 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Example AI Conversations</h3>
                  <div className="space-y-4">
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <p className="text-blue-400 mb-2">User: "Send $50 to john@example.com"</p>
                      <p className="text-green-400">Claude: "I'll process that payment for you. Payment of $50.00 sent successfully! Transaction ID: tx_abc123"</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <p className="text-blue-400 mb-2">User: "What's my wallet balance?"</p>
                      <p className="text-green-400">Claude: "Your wallet balance is $1,234.56 with $100 pending."</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sdk' && (
              <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Official SDKs</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      name: 'JavaScript/TypeScript',
                      package: '@hedgepayments/sdk',
                      icon: '📦',
                      status: 'Stable',
                      link: 'npm install @hedgepayments/sdk'
                    },
                    {
                      name: 'Python',
                      package: 'hedgepayments',
                      icon: '🐍',
                      status: 'Stable',
                      link: 'pip install hedgepayments'
                    },
                    {
                      name: 'Ruby',
                      package: 'hedgepayments',
                      icon: '💎',
                      status: 'Beta',
                      link: 'gem install hedgepayments'
                    },
                    {
                      name: 'Go',
                      package: 'github.com/hedgepayments/go',
                      icon: '🐹',
                      status: 'Beta',
                      link: 'go get github.com/hedgepayments/go'
                    },
                    {
                      name: 'PHP',
                      package: 'hedgepayments/php',
                      icon: '🐘',
                      status: 'Coming Soon',
                      link: 'composer require hedgepayments/php'
                    },
                    {
                      name: 'Java',
                      package: 'com.hedgepayments',
                      icon: '☕',
                      status: 'Coming Soon',
                      link: 'Maven/Gradle'
                    }
                  ].map(sdk => (
                    <div key={sdk.name} className="border border-slate-700 rounded-lg p-5 hover:bg-slate-700/30 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-3xl">{sdk.icon}</span>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{sdk.name}</h3>
                            <code className="text-emerald-400 text-sm">{sdk.package}</code>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          sdk.status === 'Stable' ? 'bg-green-500/20 text-green-400' :
                          sdk.status === 'Beta' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-slate-600 text-slate-400'
                        }`}>
                          {sdk.status}
                        </span>
                      </div>
                      <div className="bg-slate-900 rounded p-2 mt-3">
                        <code className="text-green-400 text-xs">{sdk.link}</code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* API Keys */}
            <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Test API Keys</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-slate-400 text-sm">Public Key</label>
                  <div className="bg-slate-900 rounded p-2 mt-1">
                    <code className="text-emerald-400 text-xs break-all">pk_test_4242424242424242</code>
                  </div>
                </div>
                <div>
                  <label className="text-slate-400 text-sm">Secret Key</label>
                  <div className="bg-slate-900 rounded p-2 mt-1">
                    <code className="text-emerald-400 text-xs break-all">sk_test_••••••••••••4242</code>
                  </div>
                </div>
                <p className="text-slate-500 text-xs mt-3">
                  Use test keys to explore the API without real transactions
                </p>
              </div>
            </div>

            {/* Resources */}
            <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
              <div className="space-y-3">
                <a href="#" className="flex items-center justify-between text-slate-300 hover:text-white transition-colors">
                  <span>Documentation</span>
                  <ChevronRightIcon className="w-4 h-4" />
                </a>
                <a href="#" className="flex items-center justify-between text-slate-300 hover:text-white transition-colors">
                  <span>API Status</span>
                  <ChevronRightIcon className="w-4 h-4" />
                </a>
                <a href="#" className="flex items-center justify-between text-slate-300 hover:text-white transition-colors">
                  <span>Postman Collection</span>
                  <ChevronRightIcon className="w-4 h-4" />
                </a>
                <a href="#" className="flex items-center justify-between text-slate-300 hover:text-white transition-colors">
                  <span>Webhook Testing</span>
                  <ChevronRightIcon className="w-4 h-4" />
                </a>
                <a href="#" className="flex items-center justify-between text-slate-300 hover:text-white transition-colors">
                  <span>Discord Community</span>
                  <ChevronRightIcon className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Support */}
            <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl border border-emerald-500/30 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Need Help?</h3>
              <p className="text-slate-300 text-sm mb-4">
                Our team is here to help you integrate HedgePayments
              </p>
              <button className="w-full bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition-colors font-semibold">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}