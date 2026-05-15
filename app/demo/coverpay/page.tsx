'use client'

import { useState, useEffect } from 'react'

// Mock product data
const PRODUCT = {
  name: 'Sony WH-1000XM5 Wireless Headphones',
  description: 'Industry-leading noise cancellation, exceptional sound quality, and up to 30 hours of battery life.',
  price: 349.99,
  originalPrice: 399.99,
  image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
  features: [
    'Industry-leading noise cancellation',
    '30-hour battery life',
    'Crystal clear hands-free calling',
    'Multipoint connection',
  ],
}

// Provider colors
const PROVIDER_COLORS: Record<string, string> = {
  klarna: '#FFB3C7',
  affirm: '#0FA0EA',
  afterpay: '#B2FCE4',
  sezzle: '#382757',
}

// Mock eligibility data
const MOCK_ELIGIBILITY = {
  eligible: true,
  providers: [
    {
      id: 'klarna',
      name: 'Klarna',
      plans: [
        { id: 'klarna_pay4', name: 'Pay in 4', installments: 4, amount: 87.50, apr: 0 },
      ],
    },
    {
      id: 'affirm',
      name: 'Affirm',
      plans: [
        { id: 'affirm_pay4', name: 'Pay in 4', installments: 4, amount: 87.50, apr: 0 },
        { id: 'affirm_6mo', name: '6 Monthly', installments: 6, amount: 58.33, apr: 0 },
      ],
    },
    {
      id: 'afterpay',
      name: 'Afterpay',
      plans: [
        { id: 'afterpay_pay4', name: 'Pay in 4', installments: 4, amount: 87.50, apr: 0 },
      ],
    },
    {
      id: 'sezzle',
      name: 'Sezzle',
      plans: [
        { id: 'sezzle_pay4', name: 'Pay in 4', installments: 4, amount: 87.50, apr: 0 },
      ],
    },
  ],
}

type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'coverpay' | 'processing' | 'success'

export default function CoverPayDemoPage() {
  const [step, setStep] = useState<CheckoutStep>('cart')
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'coverpay' | null>(null)
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const subtotal = PRODUCT.price * quantity
  const shipping = 0 // Free shipping
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const handleCoverPaySelect = () => {
    setPaymentMethod('coverpay')
    setStep('coverpay')
  }

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId)
    const provider = MOCK_ELIGIBILITY.providers.find(p => p.id === providerId)
    if (provider && provider.plans.length > 0) {
      setSelectedPlan(provider.plans[0].id)
    }
  }

  const handleCheckout = async () => {
    setIsLoading(true)
    setStep('processing')

    // Simulate provider redirect and approval
    await new Promise(resolve => setTimeout(resolve, 2500))

    setStep('success')
    setIsLoading(false)
  }

  const resetDemo = () => {
    setStep('cart')
    setPaymentMethod(null)
    setSelectedProvider(null)
    setSelectedPlan(null)
    setQuantity(1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">CP</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Demo Store</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm rounded-full font-medium">
              Demo Mode
            </span>
            <button
              onClick={resetDemo}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Reset Demo
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {['Cart', 'Shipping', 'Payment', 'Confirmation'].map((label, index) => {
            const stepIndex = ['cart', 'shipping', 'payment', 'success'].indexOf(step)
            const isActive = index <= stepIndex || step === 'coverpay' || step === 'processing'
            return (
              <div key={label} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  isActive ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {index + 1}
                </div>
                <span className={`ml-2 text-sm ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                  {label}
                </span>
                {index < 3 && (
                  <div className={`w-12 h-0.5 mx-4 ${isActive ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Cart Step */}
            {step === 'cart' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Shopping Cart</h2>

                <div className="flex gap-6 pb-6 border-b">
                  <img
                    src={PRODUCT.image}
                    alt={PRODUCT.name}
                    className="w-32 h-32 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{PRODUCT.name}</h3>
                    <p className="text-gray-500 text-sm mt-1">{PRODUCT.description}</p>
                    <ul className="mt-3 space-y-1">
                      {PRODUCT.features.slice(0, 2).map(f => (
                        <li key={f} className="text-sm text-gray-600 flex items-center gap-2">
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{formatCurrency(PRODUCT.price)}</div>
                    <div className="text-sm text-gray-400 line-through">{formatCurrency(PRODUCT.originalPrice)}</div>
                    <div className="mt-4 flex items-center gap-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setStep('shipping')}
                    className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
                  >
                    Continue to Shipping
                  </button>
                </div>
              </div>
            )}

            {/* Shipping Step */}
            {step === 'shipping' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Information</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      defaultValue="John"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      defaultValue="Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      defaultValue="john.doe@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      defaultValue="123 Main Street"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      defaultValue="San Francisco"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                    <input
                      type="text"
                      defaultValue="94102"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() => setStep('cart')}
                    className="px-6 py-3 text-gray-600 hover:text-gray-900"
                  >
                    Back to Cart
                  </button>
                  <button
                    onClick={() => setStep('payment')}
                    className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Payment Step */}
            {step === 'payment' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>

                <div className="space-y-4">
                  {/* Credit Card Option */}
                  <label
                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                      paymentMethod === 'card' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="w-5 h-5 text-green-500"
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex items-center gap-3">
                        <svg className="w-8 h-5" viewBox="0 0 32 20">
                          <rect width="32" height="20" rx="2" fill="#1A1F71"/>
                          <text x="16" y="13" fontSize="8" fill="white" textAnchor="middle" fontWeight="bold">VISA</text>
                        </svg>
                        <svg className="w-8 h-5" viewBox="0 0 32 20">
                          <rect width="32" height="20" rx="2" fill="#EB001B"/>
                          <circle cx="12" cy="10" r="6" fill="#EB001B"/>
                          <circle cx="20" cy="10" r="6" fill="#F79E1B"/>
                        </svg>
                        <span className="font-medium text-gray-900">Credit / Debit Card</span>
                      </div>
                    </div>
                  </label>

                  {/* CoverPay BNPL Option */}
                  <div
                    className={`border-2 rounded-xl overflow-hidden transition-colors ${
                      paymentMethod === 'coverpay' ? 'border-green-500' : 'border-gray-200'
                    }`}
                  >
                    <label
                      className={`flex items-center p-4 cursor-pointer ${
                        paymentMethod === 'coverpay' ? 'bg-green-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={handleCoverPaySelect}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'coverpay'}
                        onChange={handleCoverPaySelect}
                        className="w-5 h-5 text-green-500"
                      />
                      <div className="ml-4 flex-1">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xs">CP</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">Pay in Installments</span>
                            <span className="ml-2 text-green-600 text-sm">Powered by CoverPay</span>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-500 ml-11">
                          Split into 4 interest-free payments of {formatCurrency(total / 4)}
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {paymentMethod === 'card' && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                        <input
                          type="text"
                          placeholder="4242 4242 4242 4242"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() => setStep('shipping')}
                    className="px-6 py-3 text-gray-600 hover:text-gray-900"
                  >
                    Back to Shipping
                  </button>
                  {paymentMethod === 'card' && (
                    <button
                      onClick={() => {
                        setStep('processing')
                        setTimeout(() => setStep('success'), 2000)
                      }}
                      className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
                    >
                      Pay {formatCurrency(total)}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* CoverPay Provider Selection */}
            {step === 'coverpay' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold">CP</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Choose Your Provider</h2>
                    <p className="text-gray-500 text-sm">Select how you'd like to pay over time</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {MOCK_ELIGIBILITY.providers.map((provider) => {
                    const isSelected = selectedProvider === provider.id
                    const color = PROVIDER_COLORS[provider.id]

                    return (
                      <div
                        key={provider.id}
                        onClick={() => handleProviderSelect(provider.id)}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          isSelected
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg"
                            style={{ backgroundColor: `${color}30`, color }}
                          >
                            {provider.name.charAt(0)}
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="font-semibold text-gray-900">{provider.name}</div>
                            <div className="text-sm text-gray-500">
                              {provider.plans[0].installments} payments of {formatCurrency(provider.plans[0].amount)}
                            </div>
                          </div>
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              isSelected ? 'border-green-500 bg-green-500' : 'border-gray-300'
                            }`}
                          >
                            {isSelected && (
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </div>

                        {/* Plan options for providers with multiple plans */}
                        {isSelected && provider.plans.length > 1 && (
                          <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                            {provider.plans.map((plan) => (
                              <label
                                key={plan.id}
                                className={`flex items-center p-3 rounded-lg cursor-pointer ${
                                  selectedPlan === plan.id ? 'bg-green-100' : 'hover:bg-gray-50'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="plan"
                                  checked={selectedPlan === plan.id}
                                  onChange={() => setSelectedPlan(plan.id)}
                                  className="w-4 h-4 text-green-500"
                                />
                                <span className="ml-3 text-sm text-gray-700">{plan.name}</span>
                                <span className="ml-auto text-sm font-medium text-gray-900">
                                  {formatCurrency(plan.amount)}/mo
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() => {
                      setStep('payment')
                      setPaymentMethod(null)
                    }}
                    className="px-6 py-3 text-gray-600 hover:text-gray-900"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCheckout}
                    disabled={!selectedProvider}
                    className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
                      selectedProvider
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Continue with {selectedProvider ? MOCK_ELIGIBILITY.providers.find(p => p.id === selectedProvider)?.name : 'Provider'}
                  </button>
                </div>
              </div>
            )}

            {/* Processing Step */}
            {step === 'processing' && (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">Processing Your Order</h2>
                <p className="text-gray-500">
                  {paymentMethod === 'coverpay'
                    ? `Connecting to ${MOCK_ELIGIBILITY.providers.find(p => p.id === selectedProvider)?.name}...`
                    : 'Processing payment...'}
                </p>
              </div>
            )}

            {/* Success Step */}
            {step === 'success' && (
              <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
                <p className="text-gray-500 mb-6">
                  Thank you for your purchase. Your order #ORD-{Date.now().toString(36).toUpperCase()} has been confirmed.
                </p>

                {paymentMethod === 'coverpay' && selectedProvider && (
                  <div className="bg-green-50 rounded-xl p-4 mb-6 inline-block">
                    <p className="text-green-700 text-sm">
                      Payment plan activated with{' '}
                      <span className="font-semibold">
                        {MOCK_ELIGIBILITY.providers.find(p => p.id === selectedProvider)?.name}
                      </span>
                    </p>
                    <p className="text-green-600 text-sm mt-1">
                      4 payments of {formatCurrency(total / 4)} • First payment today
                    </p>
                  </div>
                )}

                <div className="bg-gray-50 rounded-xl p-4 text-left max-w-sm mx-auto">
                  <div className="flex gap-4">
                    <img
                      src={PRODUCT.image}
                      alt={PRODUCT.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{PRODUCT.name}</p>
                      <p className="text-gray-500 text-sm">Qty: {quantity}</p>
                      <p className="text-gray-900 font-semibold text-sm">{formatCurrency(total)}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={resetDemo}
                  className="mt-6 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
                >
                  Start New Demo
                </button>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>

              <div className="flex gap-4 pb-4 border-b">
                <img
                  src={PRODUCT.image}
                  alt={PRODUCT.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm line-clamp-2">{PRODUCT.name}</p>
                  <p className="text-gray-500 text-sm">Qty: {quantity}</p>
                </div>
              </div>

              <div className="py-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax</span>
                  <span className="text-gray-900">{formatCurrency(tax)}</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-xl text-gray-900">{formatCurrency(total)}</span>
                </div>

                {step !== 'success' && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-green-700 text-sm font-medium">
                      Or pay {formatCurrency(total / 4)}/mo with CoverPay
                    </p>
                    <p className="text-green-600 text-xs mt-1">
                      4 interest-free payments
                    </p>
                  </div>
                )}
              </div>

              {/* CoverPay Info */}
              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="w-5 h-5 bg-gradient-to-br from-green-400 to-green-600 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-[8px]">CP</span>
                  </div>
                  <span>Powered by CoverPay</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
