'use client'

import { OnboardingData } from '../page'

interface StepReviewProps {
  data: OnboardingData
  onBack: () => void
  onSubmit: () => void
  isLoading: boolean
}

const BUSINESS_TYPE_LABELS: Record<string, string> = {
  fintech: 'Fintech',
  gaming: 'Gaming',
  sports_betting: 'Sports Betting',
  daily_fantasy: 'Daily Fantasy Sports',
  ecommerce: 'E-Commerce',
  saas: 'SaaS',
  marketplace: 'Marketplace',
  hospitality: 'Hospitality',
  real_money_gaming: 'Real Money Gaming',
  sweepstakes: 'Sweepstakes',
  other: 'Other'
}

const BUSINESS_STRUCTURE_LABELS: Record<string, string> = {
  sole_proprietorship: 'Sole Proprietorship',
  llc: 'LLC',
  corporation: 'Corporation',
  partnership: 'Partnership',
  s_corp: 'S-Corp',
  non_profit: 'Non-Profit',
  other: 'Other'
}

const BNPL_PROVIDER_LABELS: Record<string, string> = {
  klarna: 'Klarna',
  affirm: 'Affirm',
  afterpay: 'Afterpay',
  sezzle: 'Sezzle',
  zip: 'Zip',
  paypal: 'PayPal Pay Later',
  stripe_bnpl: 'Stripe BNPL'
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cards: 'Credit/Debit Cards',
  ach: 'ACH Bank Transfer',
  crypto: 'Cryptocurrency',
  apple_pay: 'Apple Pay',
  google_pay: 'Google Pay',
  venmo: 'Venmo'
}

export default function StepReview({
  data,
  onBack,
  onSubmit,
  isLoading
}: StepReviewProps) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Review & Submit</h2>
        <p className="text-gray-400">Please review your information before submitting</p>
      </div>

      <div className="space-y-6">
        {/* Account Information */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Account Information</h3>
            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">Step 1</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Business Name</span>
              <p className="text-white">{data.businessName}</p>
            </div>
            <div>
              <span className="text-gray-500">Contact Name</span>
              <p className="text-white">{data.contactFirstName} {data.contactLastName}</p>
            </div>
            <div>
              <span className="text-gray-500">Email</span>
              <p className="text-white">{data.contactEmail}</p>
            </div>
            <div>
              <span className="text-gray-500">Phone</span>
              <p className="text-white">{data.contactPhone}</p>
            </div>
          </div>
        </div>

        {/* Business Details */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Business Details</h3>
            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">Step 2</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Business Type</span>
              <p className="text-white">{BUSINESS_TYPE_LABELS[data.businessType] || data.businessType}</p>
            </div>
            <div>
              <span className="text-gray-500">Business Structure</span>
              <p className="text-white">{BUSINESS_STRUCTURE_LABELS[data.businessStructure] || data.businessStructure}</p>
            </div>
            {data.dbaName && (
              <div>
                <span className="text-gray-500">DBA Name</span>
                <p className="text-white">{data.dbaName}</p>
              </div>
            )}
            {data.website && (
              <div>
                <span className="text-gray-500">Website</span>
                <p className="text-white">{data.website}</p>
              </div>
            )}
            <div className="md:col-span-2">
              <span className="text-gray-500">Address</span>
              <p className="text-white">
                {data.addressLine1}
                {data.addressLine2 && `, ${data.addressLine2}`}
                <br />
                {data.city}, {data.state} {data.postalCode}
              </p>
            </div>
            {data.ein && (
              <div>
                <span className="text-gray-500">EIN</span>
                <p className="text-white">{data.ein}</p>
              </div>
            )}
            {data.stateOfIncorporation && (
              <div>
                <span className="text-gray-500">State of Incorporation</span>
                <p className="text-white">{data.stateOfIncorporation}</p>
              </div>
            )}
            <div className="md:col-span-2">
              <span className="text-gray-500">Business Description</span>
              <p className="text-white">{data.businessDescription}</p>
            </div>
            {data.employeeCount && (
              <div>
                <span className="text-gray-500">Employees</span>
                <p className="text-white">{data.employeeCount}</p>
              </div>
            )}
            {data.annualRevenue && (
              <div>
                <span className="text-gray-500">Annual Revenue</span>
                <p className="text-white">{data.annualRevenue}</p>
              </div>
            )}
            <div>
              <span className="text-gray-500">Expected Monthly Volume</span>
              <p className="text-white">{data.expectedMonthlyVolume}</p>
            </div>
            {data.averageTransactionSize && (
              <div>
                <span className="text-gray-500">Avg Transaction Size</span>
                <p className="text-white">{data.averageTransactionSize}</p>
              </div>
            )}
            {data.isLicensed && data.gamingLicenses.length > 0 && (
              <div className="md:col-span-2">
                <span className="text-gray-500">Gaming Licenses</span>
                <p className="text-white">{data.gamingLicenses.map(l => l.toUpperCase()).join(', ')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Selected Products */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Selected Products</h3>
            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">Step 3</span>
          </div>

          <div className="space-y-4">
            {/* CoverPay */}
            {data.products.coverpay && (
              <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded bg-purple-600 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <span className="text-white font-semibold">CoverPay</span>
                </div>
                <div className="text-sm space-y-1">
                  {data.productDetails.coverpay.useCases.length > 0 && (
                    <p className="text-gray-400">
                      <span className="text-gray-500">Use Cases:</span> {data.productDetails.coverpay.useCases.join(', ')}
                    </p>
                  )}
                  {data.productDetails.coverpay.bnplProviders.length > 0 && (
                    <p className="text-gray-400">
                      <span className="text-gray-500">BNPL Providers:</span>{' '}
                      {data.productDetails.coverpay.bnplProviders.map(p => BNPL_PROVIDER_LABELS[p] || p).join(', ')}
                    </p>
                  )}
                  {data.productDetails.coverpay.expectedVolume && (
                    <p className="text-gray-400">
                      <span className="text-gray-500">Expected Volume:</span> {data.productDetails.coverpay.expectedVolume}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Bankroll Gateway */}
            {data.products.gateway && (
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <span className="text-white font-semibold">Bankroll Gateway</span>
                </div>
                <div className="text-sm space-y-1">
                  {data.productDetails.gateway.paymentMethods.length > 0 && (
                    <p className="text-gray-400">
                      <span className="text-gray-500">Payment Methods:</span>{' '}
                      {data.productDetails.gateway.paymentMethods.map(m => PAYMENT_METHOD_LABELS[m] || m).join(', ')}
                    </p>
                  )}
                  {data.productDetails.gateway.platforms.length > 0 && (
                    <p className="text-gray-400">
                      <span className="text-gray-500">Platforms:</span> {data.productDetails.gateway.platforms.join(', ')}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* SideBet */}
            {data.products.sidebet && (
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded bg-green-600 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-white font-semibold">SideBet</span>
                </div>
                <div className="text-sm space-y-1">
                  {data.productDetails.sidebet.bankProvider && (
                    <p className="text-gray-400">
                      <span className="text-gray-500">Bank Provider:</span> {data.productDetails.sidebet.bankProvider}
                    </p>
                  )}
                  {data.productDetails.sidebet.roundUpDestination && (
                    <p className="text-gray-400">
                      <span className="text-gray-500">Round-up Destination:</span> {data.productDetails.sidebet.roundUpDestination}
                    </p>
                  )}
                </div>
              </div>
            )}

            {!data.products.coverpay && !data.products.gateway && !data.products.sidebet && (
              <p className="text-gray-400 text-sm">No products selected</p>
            )}
          </div>
        </div>

        {/* Terms Notice */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm">
              <p className="text-amber-200 font-medium">Before you submit</p>
              <p className="text-amber-300/80 mt-1">
                By submitting this application, you agree to our Terms of Service and Privacy Policy.
                Our team will review your application and contact you within 1-2 business days.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Submitting...
            </>
          ) : (
            <>
              Submit Application
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
