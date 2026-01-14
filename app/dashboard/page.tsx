'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@/app/utils/supabase-client'

interface BusinessAccount {
  id: string
  business_name: string
  contact_first_name: string
  contact_last_name: string
  contact_email: string
  business_type: string
  onboarding_status: string
  onboarding_step: number
  coverpay_status: string
  gateway_status: string
  sidebet_status: string
  api_key_test: string
  api_secret_test: string
  webhook_secret: string
  created_at: string
}

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  started: { label: 'Started', color: 'bg-gray-500' },
  profile_complete: { label: 'Profile Complete', color: 'bg-blue-500' },
  products_selected: { label: 'Products Selected', color: 'bg-indigo-500' },
  underwriting: { label: 'Underwriting', color: 'bg-yellow-500' },
  documents_pending: { label: 'Documents Pending', color: 'bg-orange-500' },
  under_review: { label: 'Under Review', color: 'bg-purple-500' },
  approved: { label: 'Approved', color: 'bg-green-500' },
  rejected: { label: 'Rejected', color: 'bg-red-500' },
  suspended: { label: 'Suspended', color: 'bg-red-700' }
}

const PRODUCT_STATUS_BADGES: Record<string, { label: string; color: string }> = {
  not_requested: { label: 'Not Requested', color: 'bg-gray-600' },
  requested: { label: 'Requested', color: 'bg-blue-500' },
  pending_underwriting: { label: 'Underwriting', color: 'bg-yellow-500' },
  pending_documents: { label: 'Documents Needed', color: 'bg-orange-500' },
  under_review: { label: 'Under Review', color: 'bg-purple-500' },
  approved: { label: 'Approved', color: 'bg-green-500' },
  rejected: { label: 'Rejected', color: 'bg-red-500' },
  active: { label: 'Active', color: 'bg-emerald-500' },
  suspended: { label: 'Suspended', color: 'bg-red-700' }
}

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()

  const [account, setAccount] = useState<BusinessAccount | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showApiKeys, setShowApiKeys] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const isWelcome = searchParams.get('welcome') === 'true'

  useEffect(() => {
    const fetchAccount = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/business-login')
        return
      }

      const { data: businessAccount, error } = await supabase
        .from('business_accounts')
        .select('*')
        .eq('auth_user_id', user.id)
        .single()

      if (error || !businessAccount) {
        // No business account found, redirect to signup
        router.push('/get-started')
        return
      }

      setAccount(businessAccount)
      setIsLoading(false)
    }

    fetchAccount()
  }, [router, supabase])

  const copyToClipboard = async (text: string, keyType: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedKey(keyType)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="text-white font-semibold text-xl">Hedge Payments</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm hidden md:block">
              {account?.contact_email}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-300 hover:text-white text-sm transition-colors"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Banner */}
        {isWelcome && (
          <div className="mb-8 p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Welcome to Hedge Payments!</h2>
                <p className="text-green-200 mt-1">
                  Your application has been submitted. Our team will review it and get back to you within 1-2 business days.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {account?.contact_first_name}
          </h1>
          <p className="text-gray-400 mt-1">{account?.business_name}</p>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Onboarding Status */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <p className="text-gray-400 text-sm mb-2">Application Status</p>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                STATUS_BADGES[account?.onboarding_status || 'started']?.color || 'bg-gray-500'
              }`}>
                {STATUS_BADGES[account?.onboarding_status || 'started']?.label || account?.onboarding_status}
              </span>
            </div>
          </div>

          {/* CoverPay Status */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <p className="text-gray-400 text-sm mb-2">CoverPay</p>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                PRODUCT_STATUS_BADGES[account?.coverpay_status || 'not_requested']?.color || 'bg-gray-600'
              }`}>
                {PRODUCT_STATUS_BADGES[account?.coverpay_status || 'not_requested']?.label}
              </span>
            </div>
          </div>

          {/* Gateway Status */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <p className="text-gray-400 text-sm mb-2">Bankroll Gateway</p>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                PRODUCT_STATUS_BADGES[account?.gateway_status || 'not_requested']?.color || 'bg-gray-600'
              }`}>
                {PRODUCT_STATUS_BADGES[account?.gateway_status || 'not_requested']?.label}
              </span>
            </div>
          </div>

          {/* SideBet Status */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <p className="text-gray-400 text-sm mb-2">SideBet</p>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                PRODUCT_STATUS_BADGES[account?.sidebet_status || 'not_requested']?.color || 'bg-gray-600'
              }`}>
                {PRODUCT_STATUS_BADGES[account?.sidebet_status || 'not_requested']?.label}
              </span>
            </div>
          </div>
        </div>

        {/* API Keys Section */}
        <div className="bg-white/5 rounded-xl border border-white/10 mb-8">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">API Keys</h2>
                <p className="text-gray-400 text-sm mt-1">Use these keys to integrate with our APIs</p>
              </div>
              <button
                onClick={() => setShowApiKeys(!showApiKeys)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-sm"
              >
                {showApiKeys ? 'Hide Keys' : 'Show Keys'}
              </button>
            </div>
          </div>

          {showApiKeys && (
            <div className="p-6 space-y-4">
              {/* Test API Key */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Test Publishable Key
                </label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-green-400 font-mono text-sm overflow-x-auto">
                    {account?.api_key_test}
                  </code>
                  <button
                    onClick={() => copyToClipboard(account?.api_key_test || '', 'pk_test')}
                    className="px-3 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {copiedKey === 'pk_test' ? (
                      <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Test Secret Key */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Test Secret Key
                </label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-red-400 font-mono text-sm overflow-x-auto">
                    {account?.api_secret_test}
                  </code>
                  <button
                    onClick={() => copyToClipboard(account?.api_secret_test || '', 'sk_test')}
                    className="px-3 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {copiedKey === 'sk_test' ? (
                      <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-xs text-red-400 mt-1">Never share your secret key publicly</p>
              </div>

              {/* Webhook Secret */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Webhook Secret
                </label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-amber-400 font-mono text-sm overflow-x-auto">
                    {account?.webhook_secret}
                  </code>
                  <button
                    onClick={() => copyToClipboard(account?.webhook_secret || '', 'whsec')}
                    className="px-3 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {copiedKey === 'whsec' ? (
                      <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-gray-400 text-sm">
                  Live API keys will be available once your application is approved.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Product Dashboards */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Your Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* CoverPay */}
            <Link
              href="/dashboard/coverpay"
              className={`rounded-xl p-6 border transition-all group ${
                account?.coverpay_status !== 'not_requested'
                  ? 'bg-purple-500/10 border-purple-500/30 hover:border-purple-500/60'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  PRODUCT_STATUS_BADGES[account?.coverpay_status || 'not_requested']?.color || 'bg-gray-600'
                } text-white`}>
                  {PRODUCT_STATUS_BADGES[account?.coverpay_status || 'not_requested']?.label}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">CoverPay</h3>
              <p className="text-gray-400 text-sm mb-3">BNPL orchestration with waterfall routing</p>
              <div className="flex items-center text-purple-400 text-sm group-hover:text-purple-300">
                <span>Open Dashboard</span>
                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            {/* Bankroll Gateway */}
            <div
              className={`rounded-xl p-6 border ${
                account?.gateway_status !== 'not_requested'
                  ? 'bg-blue-500/10 border-blue-500/30'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  PRODUCT_STATUS_BADGES[account?.gateway_status || 'not_requested']?.color || 'bg-gray-600'
                } text-white`}>
                  {PRODUCT_STATUS_BADGES[account?.gateway_status || 'not_requested']?.label}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Bankroll Gateway</h3>
              <p className="text-gray-400 text-sm mb-3">Full-featured payment gateway</p>
              <div className="flex items-center text-gray-500 text-sm">
                <span>Coming Soon</span>
              </div>
            </div>

            {/* SideBet */}
            <Link
              href="/dashboard/sidebet"
              className={`rounded-xl p-6 border transition-all group ${
                account?.sidebet_status !== 'not_requested'
                  ? 'bg-green-500/10 border-green-500/30 hover:border-green-500/60'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  PRODUCT_STATUS_BADGES[account?.sidebet_status || 'not_requested']?.color || 'bg-gray-600'
                } text-white`}>
                  {PRODUCT_STATUS_BADGES[account?.sidebet_status || 'not_requested']?.label}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">SideBet</h3>
              <p className="text-gray-400 text-sm mb-3">Round-ups as a service with Stripe</p>
              <div className="flex items-center text-green-400 text-sm group-hover:text-green-300">
                <span>Open Dashboard</span>
                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/docs"
            className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-colors group"
          >
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-colors">
              <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Documentation</h3>
            <p className="text-gray-400 text-sm">Learn how to integrate our APIs</p>
          </Link>

          <Link
            href="/support"
            className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-colors group"
          >
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors">
              <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Support</h3>
            <p className="text-gray-400 text-sm">Get help from our team</p>
          </Link>

          <Link
            href="/settings"
            className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-green-500/50 transition-colors group"
          >
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500/30 transition-colors">
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Settings</h3>
            <p className="text-gray-400 text-sm">Manage your account</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
      <DashboardContent />
    </Suspense>
  )
}
