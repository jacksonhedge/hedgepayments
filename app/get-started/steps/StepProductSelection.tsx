'use client'

import { useState } from 'react'
import { OnboardingData } from '../page'

interface StepProductSelectionProps {
  data: OnboardingData
  updateData: (data: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

const BNPL_PROVIDERS = [
  { value: 'klarna', label: 'Klarna', logo: '/providers/klarna.svg' },
  { value: 'affirm', label: 'Affirm', logo: '/providers/affirm.svg' },
  { value: 'afterpay', label: 'Afterpay', logo: '/providers/afterpay.svg' },
  { value: 'sezzle', label: 'Sezzle', logo: '/providers/sezzle.svg' },
  { value: 'zip', label: 'Zip', logo: '/providers/zip.svg' },
  { value: 'paypal', label: 'PayPal Pay Later', logo: '/providers/paypal.svg' },
  { value: 'stripe_bnpl', label: 'Stripe BNPL', logo: '/providers/stripe.svg' }
]

const PAYMENT_METHODS = [
  { value: 'cards', label: 'Credit/Debit Cards' },
  { value: 'ach', label: 'ACH Bank Transfer' },
  { value: 'crypto', label: 'Cryptocurrency' },
  { value: 'apple_pay', label: 'Apple Pay' },
  { value: 'google_pay', label: 'Google Pay' },
  { value: 'venmo', label: 'Venmo' }
]

const PLATFORMS = [
  { value: 'ios', label: 'iOS' },
  { value: 'android', label: 'Android' },
  { value: 'web', label: 'Web' },
  { value: 'react_native', label: 'React Native' },
  { value: 'flutter', label: 'Flutter' }
]

const COVERPAY_USE_CASES = [
  { value: 'checkout', label: 'Checkout Financing' },
  { value: 'subscription', label: 'Subscription Payments' },
  { value: 'deposit', label: 'Deposit Financing' },
  { value: 'wallet_funding', label: 'Wallet Funding' },
  { value: 'in_game', label: 'In-Game Purchases' }
]

const VOLUME_RANGES = [
  { value: '0-50k', label: '$0 - $50K' },
  { value: '50k-100k', label: '$50K - $100K' },
  { value: '100k-500k', label: '$100K - $500K' },
  { value: '500k-1m', label: '$500K - $1M' },
  { value: '1m+', label: '$1M+' }
]

const BANK_PROVIDERS = [
  { value: 'plaid', label: 'Plaid' },
  { value: 'meld', label: 'Meld' },
  { value: 'finicity', label: 'Finicity' },
  { value: 'yodlee', label: 'Yodlee' },
  { value: 'mx', label: 'MX' }
]

const ROUND_UP_DESTINATIONS = [
  { value: 'savings', label: 'Savings Account' },
  { value: 'investment', label: 'Investment Account' },
  { value: 'charity', label: 'Charity' },
  { value: 'crypto', label: 'Cryptocurrency' },
  { value: 'rewards', label: 'Rewards/Points' },
  { value: 'gaming_wallet', label: 'Gaming Wallet' }
]

export default function StepProductSelection({
  data,
  updateData,
  onNext,
  onBack
}: StepProductSelectionProps) {
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null)

  const toggleProduct = (product: 'coverpay' | 'gateway' | 'sidebet') => {
    updateData({
      products: {
        ...data.products,
        [product]: !data.products[product]
      }
    })
    // Expand configuration when selected
    if (!data.products[product]) {
      setExpandedProduct(product)
    }
  }

  const updateProductDetails = (
    product: 'coverpay' | 'gateway' | 'sidebet',
    details: any
  ) => {
    updateData({
      productDetails: {
        ...data.productDetails,
        [product]: {
          ...data.productDetails[product],
          ...details
        }
      }
    })
  }

  const toggleArrayItem = (
    product: 'coverpay' | 'gateway' | 'sidebet',
    field: string,
    value: string
  ) => {
    const current = (data.productDetails[product] as any)[field] || []
    const updated = current.includes(value)
      ? current.filter((v: string) => v !== value)
      : [...current, value]
    updateProductDetails(product, { [field]: updated })
  }

  const atLeastOneSelected = data.products.coverpay || data.products.gateway || data.products.sidebet

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Select Products</h2>
        <p className="text-gray-400">Choose the Hedge Payments products you're interested in</p>
      </div>

      <div className="space-y-4">
        {/* CoverPay Card */}
        <div className={`rounded-xl border transition-all ${
          data.products.coverpay
            ? 'border-purple-500 bg-purple-500/10'
            : 'border-white/10 bg-white/5 hover:border-white/20'
        }`}>
          <div
            className="p-6 cursor-pointer"
            onClick={() => toggleProduct('coverpay')}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  data.products.coverpay ? 'bg-purple-600' : 'bg-white/10'
                }`}>
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">CoverPay</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    BNPL orchestration platform. Route customers to the best Buy Now Pay Later provider with waterfall logic.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {BNPL_PROVIDERS.slice(0, 4).map(provider => (
                      <span key={provider.value} className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400">
                        {provider.label}
                      </span>
                    ))}
                    <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400">+3 more</span>
                  </div>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                data.products.coverpay
                  ? 'border-purple-500 bg-purple-500'
                  : 'border-white/30'
              }`}>
                {data.products.coverpay && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
          </div>

          {/* CoverPay Configuration */}
          {data.products.coverpay && (
            <div className="border-t border-white/10 p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  What will you use CoverPay for?
                </label>
                <div className="flex flex-wrap gap-2">
                  {COVERPAY_USE_CASES.map(useCase => (
                    <button
                      key={useCase.value}
                      type="button"
                      onClick={() => toggleArrayItem('coverpay', 'useCases', useCase.value)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        data.productDetails.coverpay.useCases.includes(useCase.value)
                          ? 'bg-purple-600 text-white'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {useCase.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Which BNPL providers do you want to integrate?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {BNPL_PROVIDERS.map(provider => (
                    <button
                      key={provider.value}
                      type="button"
                      onClick={() => toggleArrayItem('coverpay', 'bnplProviders', provider.value)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        data.productDetails.coverpay.bnplProviders.includes(provider.value)
                          ? 'bg-purple-600 text-white'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {provider.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Expected Monthly BNPL Volume
                </label>
                <select
                  value={data.productDetails.coverpay.expectedVolume}
                  onChange={(e) => updateProductDetails('coverpay', { expectedVolume: e.target.value })}
                  className="w-full md:w-1/2 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="" className="bg-slate-800">Select range...</option>
                  {VOLUME_RANGES.map(range => (
                    <option key={range.value} value={range.value} className="bg-slate-800">
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Bankroll Gateway Card */}
        <div className={`rounded-xl border transition-all ${
          data.products.gateway
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-white/10 bg-white/5 hover:border-white/20'
        }`}>
          <div
            className="p-6 cursor-pointer"
            onClick={() => toggleProduct('gateway')}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  data.products.gateway ? 'bg-blue-600' : 'bg-white/10'
                }`}>
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Bankroll Gateway</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Full-featured payment gateway. Accept cards, ACH, crypto, and digital wallets with a single integration.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {PAYMENT_METHODS.slice(0, 4).map(method => (
                      <span key={method.value} className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400">
                        {method.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                data.products.gateway
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-white/30'
              }`}>
                {data.products.gateway && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
          </div>

          {/* Gateway Configuration */}
          {data.products.gateway && (
            <div className="border-t border-white/10 p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Payment methods you need
                </label>
                <div className="flex flex-wrap gap-2">
                  {PAYMENT_METHODS.map(method => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => toggleArrayItem('gateway', 'paymentMethods', method.value)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        data.productDetails.gateway.paymentMethods.includes(method.value)
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Platforms
                </label>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map(platform => (
                    <button
                      key={platform.value}
                      type="button"
                      onClick={() => toggleArrayItem('gateway', 'platforms', platform.value)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        data.productDetails.gateway.platforms.includes(platform.value)
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {platform.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SideBet Card */}
        <div className={`rounded-xl border transition-all ${
          data.products.sidebet
            ? 'border-green-500 bg-green-500/10'
            : 'border-white/10 bg-white/5 hover:border-white/20'
        }`}>
          <div
            className="p-6 cursor-pointer"
            onClick={() => toggleProduct('sidebet')}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  data.products.sidebet ? 'bg-green-600' : 'bg-white/10'
                }`}>
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">SideBet</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Round-ups as a service. Let your users automatically round up transactions and fund gaming wallets, savings, or investments.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400">Bank Linking</span>
                    <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400">Auto Round-ups</span>
                    <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400">Plaid Integration</span>
                  </div>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                data.products.sidebet
                  ? 'border-green-500 bg-green-500'
                  : 'border-white/30'
              }`}>
                {data.products.sidebet && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
          </div>

          {/* SideBet Configuration */}
          {data.products.sidebet && (
            <div className="border-t border-white/10 p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Preferred Bank Connection Provider
                </label>
                <select
                  value={data.productDetails.sidebet.bankProvider}
                  onChange={(e) => updateProductDetails('sidebet', { bankProvider: e.target.value })}
                  className="w-full md:w-1/2 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="" className="bg-slate-800">Select provider...</option>
                  {BANK_PROVIDERS.map(provider => (
                    <option key={provider.value} value={provider.value} className="bg-slate-800">
                      {provider.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Where will round-ups be deposited?
                </label>
                <select
                  value={data.productDetails.sidebet.roundUpDestination}
                  onChange={(e) => updateProductDetails('sidebet', { roundUpDestination: e.target.value })}
                  className="w-full md:w-1/2 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="" className="bg-slate-800">Select destination...</option>
                  {ROUND_UP_DESTINATIONS.map(dest => (
                    <option key={dest.value} value={dest.value} className="bg-slate-800">
                      {dest.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Validation Message */}
      {!atLeastOneSelected && (
        <p className="mt-4 text-sm text-amber-400">
          Please select at least one product to continue
        </p>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!atLeastOneSelected}
          className={`px-8 py-3 font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            atLeastOneSelected
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-white/10 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
