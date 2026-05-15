'use client'

import Link from 'next/link'

export default function CoverPayQuickstartPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/docs/coverpay" className="hover:text-white">CoverPay</Link>
          <span>/</span>
          <span className="text-white">Quick Start</span>
        </div>

        <h1 className="text-4xl font-bold text-white mb-6">Quick Start</h1>
        <p className="text-xl text-gray-300 mb-12">
          Get CoverPay running on your checkout in 5 minutes.
        </p>

        {/* Step 1 */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
              1
            </div>
            <h2 className="text-2xl font-bold text-white">Get your API keys</h2>
          </div>
          <div className="ml-12">
            <p className="text-gray-300 mb-4">
              Sign up for a Hedge Payments account and get your publishable key from the dashboard.
            </p>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">Test Key:</span>
                <code className="text-green-400">pk_test_xxxxxxxxxxxxxxxxxxxx</code>
              </div>
              <div className="flex items-center gap-2 text-sm mt-2">
                <span className="text-gray-400">Live Key:</span>
                <code className="text-green-400">pk_live_xxxxxxxxxxxxxxxxxxxx</code>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
              2
            </div>
            <h2 className="text-2xl font-bold text-white">Configure your BNPL providers</h2>
          </div>
          <div className="ml-12">
            <p className="text-gray-300 mb-4">
              In the dashboard, add your API credentials for each BNPL provider you want to use.
              Set the waterfall priority order.
            </p>
            <Link
              href="/dashboard/coverpay/providers"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Configure Providers
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Step 3 */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
              3
            </div>
            <h2 className="text-2xl font-bold text-white">Add the widget to your checkout</h2>
          </div>
          <div className="ml-12">
            <p className="text-gray-300 mb-4">
              Add the CoverPay script and initialize the widget on your checkout page.
            </p>
            <pre className="bg-black/50 rounded-xl p-6 overflow-x-auto">
              <code className="text-green-400 text-sm">{`<!-- Include the CoverPay script -->
<script src="https://js.hedgepayments.com/coverpay/v1.js"></script>

<!-- Container for the widget -->
<div id="coverpay-checkout"></div>

<script>
  // Initialize CoverPay
  CoverPay.init({
    publishableKey: 'pk_test_your_key_here',
    amount: 249.99,           // Order total
    currency: 'USD',
    orderId: 'order_123',     // Your order reference
    customer: {
      email: 'customer@example.com',
      phone: '+1234567890',   // Optional
      name: 'John Doe'        // Optional
    },
    successUrl: 'https://yoursite.com/success',
    cancelUrl: 'https://yoursite.com/cancel',

    // Callbacks
    onSuccess: (result) => {
      console.log('Payment approved by:', result.provider);
      console.log('Transaction ID:', result.transactionId);
      // Redirect to success page or update UI
      window.location.href = '/order-confirmation';
    },
    onDeclined: (reason) => {
      console.log('All providers declined:', reason);
      // Show alternative payment options
    },
    onError: (error) => {
      console.error('Error:', error.message);
      // Handle error
    }
  });

  // Mount the widget
  CoverPay.mount('#coverpay-checkout');
</script>`}</code>
            </pre>
          </div>
        </div>

        {/* Step 4 */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
              4
            </div>
            <h2 className="text-2xl font-bold text-white">Handle webhooks (recommended)</h2>
          </div>
          <div className="ml-12">
            <p className="text-gray-300 mb-4">
              Set up a webhook endpoint to receive real-time payment status updates.
            </p>
            <pre className="bg-black/50 rounded-xl p-6 overflow-x-auto">
              <code className="text-green-400 text-sm">{`// Example webhook handler (Node.js/Express)
app.post('/webhooks/coverpay', express.json(), (req, res) => {
  const event = req.body;

  switch (event.event) {
    case 'payment.authorized':
      // Payment was authorized - fulfill the order
      console.log('Order approved:', event.session.orderId);
      break;

    case 'payment.captured':
      // Payment was captured
      break;

    case 'payment.declined':
      // All providers declined
      break;
  }

  res.json({ received: true });
});`}</code>
            </pre>
          </div>
        </div>

        {/* Testing */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-12">
          <h3 className="text-xl font-bold text-white mb-4">Testing</h3>
          <p className="text-gray-300 mb-4">
            Use test mode to simulate the checkout flow without processing real payments.
            All providers support sandbox environments.
          </p>
          <ul className="text-gray-300 space-y-2 list-disc ml-6">
            <li>Use your <code className="text-green-400">pk_test_</code> publishable key</li>
            <li>Configure provider credentials in test mode</li>
            <li>The widget will redirect to provider sandboxes</li>
            <li>Use test card numbers provided by each provider</li>
          </ul>
        </div>

        {/* Next Steps */}
        <h2 className="text-2xl font-bold text-white mb-6">Next Steps</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/docs/coverpay/providers"
            className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <h3 className="text-lg font-semibold text-white mb-2">Provider Setup</h3>
            <p className="text-gray-400 text-sm">Learn how to configure each BNPL provider</p>
          </Link>
          <Link
            href="/docs/coverpay/react-sdk"
            className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <h3 className="text-lg font-semibold text-white mb-2">React SDK</h3>
            <p className="text-gray-400 text-sm">Use CoverPay with React components</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
