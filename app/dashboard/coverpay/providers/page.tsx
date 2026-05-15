'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@/app/utils/supabase-client'
import { Card, CardTitle, CardDescription } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

// Provider SVG logos
const ProviderLogo = ({ provider, size = 'md' }: { provider: string, size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-16 h-16' }

  switch (provider) {
    case 'klarna':
      return (
        <div className={`${sizeClasses[size]} rounded-xl overflow-hidden flex items-center justify-center`} style={{ backgroundColor: '#FFB3C7' }}>
          <svg viewBox="0 0 24 24" className="w-3/4 h-3/4" fill="black">
            <path d="M4.592 2H0v20h4.592V2zm6.44 0a9.5 9.5 0 01-3.17 7.078L12.776 22h5.463l-5.306-12.222A14.286 14.286 0 0016.144 2h-5.112zm8.476 16.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z"/>
          </svg>
        </div>
      )
    case 'affirm':
      return (
        <div className={`${sizeClasses[size]} rounded-xl overflow-hidden flex items-center justify-center`} style={{ backgroundColor: '#0FA0EA' }}>
          <svg viewBox="0 0 24 24" className="w-3/4 h-3/4" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 16h2v-6h-2v6zm0-8h2V8h-2v2z"/>
          </svg>
        </div>
      )
    case 'afterpay':
      return (
        <div className={`${sizeClasses[size]} rounded-xl overflow-hidden flex items-center justify-center`} style={{ backgroundColor: '#B2FCE4' }}>
          <svg viewBox="0 0 24 24" className="w-3/4 h-3/4" fill="#000">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
      )
    case 'sezzle':
      return (
        <div className={`${sizeClasses[size]} rounded-xl overflow-hidden flex items-center justify-center`} style={{ backgroundColor: '#382757' }}>
          <span className="text-white font-bold text-lg">S</span>
        </div>
      )
    default:
      return null
  }
}

// Provider definitions with credential field configurations
const PROVIDER_CONFIGS = {
  klarna: {
    id: 'klarna',
    name: 'Klarna',
    color: '#FFB3C7',
    logo: '/logos/KlarnaLogo.jpeg',
    description: 'Pay in 4, Pay in 30 days, Financing',
    supportedPlans: ['Pay in 4', 'Pay in 30 days', 'Financing up to 36 months'],
    limits: { min: 35, max: 10000 },
    fields: [
      { key: 'username', label: 'Username (API Key)', type: 'text', placeholder: 'PK12345_abcd1234...', required: true, validation: /^PK[0-9a-zA-Z_]+$/, validationMessage: 'Must start with PK' },
      { key: 'password', label: 'Password (API Secret)', type: 'password', placeholder: 'Enter API password', required: true },
      { key: 'merchantId', label: 'Merchant ID', type: 'text', placeholder: 'K12345678', required: true, validation: /^K[0-9]+$/, validationMessage: 'Must start with K followed by numbers' },
    ],
    testEndpoint: 'https://api.playground.klarna.com/payments/v1/sessions',
    setupGuide: {
      steps: [
        'Log in to the Klarna Merchant Portal',
        'Navigate to Settings → API Credentials',
        'Create new API credentials',
        'Copy Username (API Key) and Password (Secret)',
        'Find your Merchant ID in Account Settings',
      ],
      docsUrl: 'https://docs.klarna.com/klarna-payments/get-started/',
      sandboxUrl: 'https://portal.playground.klarna.com',
    },
  },
  affirm: {
    id: 'affirm',
    name: 'Affirm',
    color: '#0FA0EA',
    logo: '/logos/affirmLogo.avif',
    description: 'Pay over time, 0% APR financing',
    supportedPlans: ['Pay in 4', '3 Months', '6 Months', '12 Months'],
    limits: { min: 50, max: 17500 },
    fields: [
      { key: 'publicKey', label: 'Public API Key', type: 'text', placeholder: 'public_xxx...', required: true, validation: /^public_/, validationMessage: 'Must start with public_' },
      { key: 'secretKey', label: 'Private API Key', type: 'password', placeholder: 'Enter private key', required: true },
      { key: 'merchantId', label: 'Merchant ID (optional)', type: 'text', placeholder: 'merchant_xxx', required: false },
    ],
    testEndpoint: 'https://sandbox.affirm.com/api/v2/checkout/',
    setupGuide: {
      steps: [
        'Log in to the Affirm Merchant Dashboard',
        'Go to Developer → API Keys',
        'Copy your Public and Private API keys',
        'Merchant ID is only needed for multi-merchant setups',
      ],
      docsUrl: 'https://docs.affirm.com/affirm-developers/docs',
      sandboxUrl: 'https://sandbox.affirm.com',
    },
  },
  afterpay: {
    id: 'afterpay',
    name: 'Afterpay',
    color: '#B2FCE4',
    logo: '/logos/afterPayLogo.jpg',
    description: 'Pay in 4 interest-free payments',
    supportedPlans: ['Pay in 4'],
    limits: { min: 35, max: 2000 },
    fields: [
      { key: 'merchantId', label: 'Merchant ID', type: 'text', placeholder: 'Enter merchant ID', required: true },
      { key: 'secretKey', label: 'Secret Key', type: 'password', placeholder: 'Enter secret key', required: true },
    ],
    testEndpoint: 'https://api-sandbox.afterpay.com/v2/checkouts',
    setupGuide: {
      steps: [
        'Log in to the Afterpay Merchant Portal',
        'Navigate to Settings → API',
        'Generate or view your API credentials',
        'Copy your Merchant ID and Secret Key',
      ],
      docsUrl: 'https://developers.afterpay.com/afterpay-online/docs',
      sandboxUrl: 'https://portal-sandbox.afterpay.com',
    },
  },
  sezzle: {
    id: 'sezzle',
    name: 'Sezzle',
    color: '#382757',
    logo: '/logos/sezzleLogo.png',
    description: 'Pay in 4, interest-free',
    supportedPlans: ['Pay in 4'],
    limits: { min: 35, max: 2500 },
    fields: [
      { key: 'publicKey', label: 'Public Key', type: 'text', placeholder: 'sz_pub_xxx...', required: true, validation: /^sz_pub_/, validationMessage: 'Must start with sz_pub_' },
      { key: 'secretKey', label: 'Private Key', type: 'password', placeholder: 'Enter private key', required: true },
      { key: 'merchantId', label: 'Merchant UUID', type: 'text', placeholder: 'uuid-xxx-xxx', required: true },
    ],
    testEndpoint: 'https://sandbox.gateway.sezzle.com/v2/session',
    setupGuide: {
      steps: [
        'Log in to the Sezzle Merchant Dashboard',
        'Go to Settings → API Keys',
        'Copy your Public Key, Private Key, and Merchant UUID',
        'Ensure sandbox mode is enabled for testing',
      ],
      docsUrl: 'https://docs.sezzle.com/',
      sandboxUrl: 'https://sandbox.dashboard.sezzle.com',
    },
  },
} as const

type ProviderId = keyof typeof PROVIDER_CONFIGS

interface ProviderData {
  id: string
  provider_id: ProviderId
  provider_name: string
  enabled: boolean
  test_mode: boolean
  priority: number
  credentials_encrypted: Record<string, string>
  last_test_at: string | null
  last_test_success: boolean | null
  last_test_error: string | null
}

export default function CoverPayProvidersPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [businessId, setBusinessId] = useState<string | null>(null)
  const [providers, setProviders] = useState<ProviderData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [savingProvider, setSavingProvider] = useState<string | null>(null)
  const [testingProvider, setTestingProvider] = useState<string | null>(null)
  const [expandedProvider, setExpandedProvider] = useState<string | null>(null)
  const [credentialInputs, setCredentialInputs] = useState<Record<string, Record<string, string>>>({})
  const [testModes, setTestModes] = useState<Record<string, boolean>>({})
  const [draggedProvider, setDraggedProvider] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, Record<string, string>>>({})
  const [showSetupGuide, setShowSetupGuide] = useState<string | null>(null)

  // Fetch business account and providers
  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/business-login')
        return
      }

      // Get business account
      const { data: business } = await supabase
        .from('business_accounts')
        .select('id')
        .eq('auth_user_id', user.id)
        .single()

      if (!business) {
        router.push('/get-started')
        return
      }

      setBusinessId(business.id)

      // Get existing provider configurations
      const { data: existingProviders } = await supabase
        .from('coverpay_merchant_providers')
        .select('*')
        .eq('business_id', business.id)
        .order('priority')

      // Initialize providers - merge existing with defaults
      const allProviders: ProviderData[] = Object.keys(PROVIDER_CONFIGS).map((providerId, index) => {
        const existing = existingProviders?.find(p => p.provider_id === providerId)
        if (existing) {
          return existing as ProviderData
        }
        return {
          id: '',
          provider_id: providerId as ProviderId,
          provider_name: PROVIDER_CONFIGS[providerId as ProviderId].name,
          enabled: false,
          test_mode: true,
          priority: index + 1,
          credentials_encrypted: {},
          last_test_at: null,
          last_test_success: null,
          last_test_error: null,
        }
      })

      // Sort by priority
      allProviders.sort((a, b) => a.priority - b.priority)
      setProviders(allProviders)

      // Initialize credential inputs and test modes
      const inputs: Record<string, Record<string, string>> = {}
      const modes: Record<string, boolean> = {}
      allProviders.forEach(p => {
        inputs[p.provider_id] = { ...p.credentials_encrypted }
        modes[p.provider_id] = p.test_mode
      })
      setCredentialInputs(inputs)
      setTestModes(modes)

      setIsLoading(false)
    }

    fetchData()
  }, [router, supabase])

  // Validate a single field
  const validateField = (providerId: ProviderId, fieldKey: string, value: string): string | null => {
    const config = PROVIDER_CONFIGS[providerId]
    const field = (config.fields as unknown as Array<{key: string; label: string; type: string; placeholder: string; required: boolean; validation?: RegExp; validationMessage?: string}>).find(f => f.key === fieldKey)
    if (!field) return null

    if (field.required && !value?.trim()) {
      return `${field.label} is required`
    }

    if (value && field.validation && !field.validation.test(value)) {
      return field.validationMessage || 'Invalid format'
    }

    return null
  }

  // Validate all fields for a provider
  const validateProvider = (providerId: ProviderId): boolean => {
    const config = PROVIDER_CONFIGS[providerId]
    const credentials = credentialInputs[providerId] || {}
    const errors: Record<string, string> = {}
    let isValid = true

    ;(config.fields as unknown as Array<{key: string; label: string; type: string; required: boolean; placeholder: string}>).forEach(field => {
      const error = validateField(providerId, field.key, credentials[field.key])
      if (error) {
        errors[field.key] = error
        isValid = false
      }
    })

    setValidationErrors(prev => ({ ...prev, [providerId]: errors }))
    return isValid
  }

  // Handle credential input change
  const handleCredentialChange = (providerId: string, field: string, value: string) => {
    setCredentialInputs(prev => ({
      ...prev,
      [providerId]: {
        ...prev[providerId],
        [field]: value,
      },
    }))

    // Clear validation error for this field when user starts typing
    if (validationErrors[providerId]?.[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [providerId]: {
          ...prev[providerId],
          [field]: '',
        },
      }))
    }
  }

  // Save provider credentials
  const saveProvider = async (providerId: ProviderId) => {
    if (!businessId) return

    // Validate before saving
    if (!validateProvider(providerId)) {
      return
    }

    setSavingProvider(providerId)
    const config = PROVIDER_CONFIGS[providerId]
    const credentials = credentialInputs[providerId] || {}
    const testMode = testModes[providerId] ?? true
    const provider = providers.find(p => p.provider_id === providerId)

    try {
      if (provider?.id) {
        // Update existing
        const { error } = await supabase
          .from('coverpay_merchant_providers')
          .update({
            credentials_encrypted: credentials,
            test_mode: testMode,
            updated_at: new Date().toISOString(),
          })
          .eq('id', provider.id)

        if (error) throw error
      } else {
        // Insert new
        const { error } = await supabase
          .from('coverpay_merchant_providers')
          .insert({
            business_id: businessId,
            provider_id: providerId,
            provider_name: config.name,
            credentials_encrypted: credentials,
            test_mode: testMode,
            priority: provider?.priority || providers.length + 1,
            enabled: false,
          })

        if (error) throw error
      }

      // Refresh providers
      const { data: updated } = await supabase
        .from('coverpay_merchant_providers')
        .select('*')
        .eq('business_id', businessId)
        .order('priority')

      if (updated) {
        const merged = Object.keys(PROVIDER_CONFIGS).map((pid, index) => {
          const existing = updated.find(p => p.provider_id === pid)
          if (existing) return existing as ProviderData
          return providers.find(p => p.provider_id === pid) || {
            id: '',
            provider_id: pid as ProviderId,
            provider_name: PROVIDER_CONFIGS[pid as ProviderId].name,
            enabled: false,
            test_mode: true,
            priority: index + 1,
            credentials_encrypted: {},
            last_test_at: null,
            last_test_success: null,
            last_test_error: null,
          }
        })
        merged.sort((a, b) => a.priority - b.priority)
        setProviders(merged)
      }
    } catch (error) {
      console.error('Error saving provider:', error)
    } finally {
      setSavingProvider(null)
    }
  }

  // Test provider connection
  const testConnection = async (providerId: ProviderId) => {
    setTestingProvider(providerId)
    const provider = providers.find(p => p.provider_id === providerId)

    try {
      // Simulate test connection (in production, this would call an API endpoint)
      await new Promise(resolve => setTimeout(resolve, 2000))

      // For demo, randomly succeed or fail
      const success = Math.random() > 0.3

      if (provider?.id) {
        await supabase
          .from('coverpay_merchant_providers')
          .update({
            last_test_at: new Date().toISOString(),
            last_test_success: success,
            last_test_error: success ? null : 'Invalid API credentials',
          })
          .eq('id', provider.id)

        // Update local state
        setProviders(prev => prev.map(p =>
          p.provider_id === providerId
            ? {
                ...p,
                last_test_at: new Date().toISOString(),
                last_test_success: success,
                last_test_error: success ? null : 'Invalid API credentials',
              }
            : p
        ))
      }
    } catch (error) {
      console.error('Error testing connection:', error)
    } finally {
      setTestingProvider(null)
    }
  }

  // Toggle provider enabled state
  const toggleProvider = async (providerId: ProviderId) => {
    const provider = providers.find(p => p.provider_id === providerId)
    if (!provider?.id) return

    const newEnabled = !provider.enabled

    await supabase
      .from('coverpay_merchant_providers')
      .update({ enabled: newEnabled })
      .eq('id', provider.id)

    setProviders(prev => prev.map(p =>
      p.provider_id === providerId ? { ...p, enabled: newEnabled } : p
    ))
  }

  // Handle drag start
  const handleDragStart = (providerId: string) => {
    setDraggedProvider(providerId)
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, targetProviderId: string) => {
    e.preventDefault()
    if (!draggedProvider || draggedProvider === targetProviderId) return
  }

  // Handle drop - reorder providers
  const handleDrop = async (targetProviderId: string) => {
    if (!draggedProvider || draggedProvider === targetProviderId || !businessId) return

    const draggedIndex = providers.findIndex(p => p.provider_id === draggedProvider)
    const targetIndex = providers.findIndex(p => p.provider_id === targetProviderId)

    const newProviders = [...providers]
    const [removed] = newProviders.splice(draggedIndex, 1)
    newProviders.splice(targetIndex, 0, removed)

    // Update priorities
    newProviders.forEach((p, i) => {
      p.priority = i + 1
    })

    setProviders(newProviders)
    setDraggedProvider(null)

    // Save new priorities to database
    for (const provider of newProviders) {
      if (provider.id) {
        await supabase
          .from('coverpay_merchant_providers')
          .update({ priority: provider.priority })
          .eq('id', provider.id)
      }
    }
  }

  // Check if provider has credentials configured
  const hasCredentials = (providerId: ProviderId) => {
    const creds = credentialInputs[providerId] || {}
    const config = PROVIDER_CONFIGS[providerId]
    return (config.fields as unknown as Array<{key: string; label: string; type: string; required: boolean; placeholder: string}>).every(f => creds[f.key]?.length > 0)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-dash-primary-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/coverpay" className="text-dash-text-muted hover:text-dash-text-primary">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-dash-text-primary">Provider Credentials</h1>
            <p className="text-dash-text-secondary">Configure your BNPL provider API keys</p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <Card className="bg-dash-primary-500/5 border-dash-primary-500/20">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-dash-primary-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-dash-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-dash-text-primary">Bring Your Own Credentials</h3>
            <p className="text-dash-text-secondary text-sm mt-1">
              Add your existing BNPL provider API credentials. CoverPay will route checkouts through your
              providers in priority order until one approves. Drag providers to reorder priority.
            </p>
          </div>
        </div>
      </Card>

      {/* Provider List */}
      <div className="space-y-4">
        {providers.map((provider) => {
          const config = PROVIDER_CONFIGS[provider.provider_id]
          const isExpanded = expandedProvider === provider.provider_id
          const credentials = credentialInputs[provider.provider_id] || {}
          const configured = hasCredentials(provider.provider_id)

          return (
            <Card
              key={provider.provider_id}
              padding="none"
              className={`transition-all ${
                provider.enabled ? 'ring-2 ring-dash-primary-500/30' : ''
              } ${draggedProvider === provider.provider_id ? 'opacity-50' : ''}`}
              draggable
              onDragStart={() => handleDragStart(provider.provider_id)}
              onDragOver={(e) => handleDragOver(e, provider.provider_id)}
              onDrop={() => handleDrop(provider.provider_id)}
              onDragEnd={() => setDraggedProvider(null)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Drag Handle */}
                    <div className="cursor-grab text-dash-text-muted hover:text-dash-text-secondary">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                      </svg>
                    </div>

                    {/* Priority Badge */}
                    <div className="w-8 h-8 bg-dash-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {provider.priority}
                    </div>

                    {/* Provider Logo */}
                    <ProviderLogo provider={provider.provider_id} size="md" />

                    {/* Provider Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-dash-text-primary font-semibold">{config.name}</h3>
                        {/* Connection Status Indicator */}
                        {provider.last_test_success === true && (
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-green-500 text-xs font-medium">Connected</span>
                          </div>
                        )}
                        {provider.last_test_success === false && (
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 bg-red-500 rounded-full" />
                            <span className="text-red-500 text-xs font-medium">Failed</span>
                          </div>
                        )}
                      </div>
                      <p className="text-dash-text-muted text-sm">{config.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {configured ? (
                          <Badge variant="success">Configured</Badge>
                        ) : (
                          <Badge variant="default">Not Configured</Badge>
                        )}
                        {provider.test_mode && configured && (
                          <Badge variant="warning">Sandbox</Badge>
                        )}
                        {!provider.test_mode && configured && (
                          <Badge variant="info">Live</Badge>
                        )}
                      </div>
                      {/* Supported Plans Preview */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {config.supportedPlans.slice(0, 3).map(plan => (
                          <span key={plan} className="text-xs text-dash-text-muted bg-dash-surface-bg px-2 py-0.5 rounded">
                            {plan}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Configure Button */}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setExpandedProvider(isExpanded ? null : provider.provider_id)}
                    >
                      {isExpanded ? 'Hide' : 'Configure'}
                    </Button>

                    {/* Enable Toggle */}
                    <button
                      onClick={() => toggleProvider(provider.provider_id)}
                      disabled={!configured || !provider.id}
                      className={`relative w-12 h-6 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        provider.enabled ? 'bg-dash-primary-500' : 'bg-dash-surface-border'
                      }`}
                      title={!configured ? 'Configure credentials first' : provider.enabled ? 'Disable provider' : 'Enable provider'}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${
                          provider.enabled ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Expanded Configuration Panel */}
                {isExpanded && (
                  <div className="mt-6 pt-6 border-t border-dash-surface-border">
                    {/* Provider Limits Info */}
                    <div className="flex items-center gap-6 mb-6 p-4 bg-dash-surface-bg rounded-lg">
                      <div>
                        <p className="text-dash-text-muted text-xs uppercase tracking-wide">Min Order</p>
                        <p className="text-dash-text-primary font-semibold">${config.limits.min}</p>
                      </div>
                      <div className="w-px h-8 bg-dash-surface-border" />
                      <div>
                        <p className="text-dash-text-muted text-xs uppercase tracking-wide">Max Order</p>
                        <p className="text-dash-text-primary font-semibold">${config.limits.max.toLocaleString()}</p>
                      </div>
                      <div className="w-px h-8 bg-dash-surface-border" />
                      <div>
                        <p className="text-dash-text-muted text-xs uppercase tracking-wide">Payment Plans</p>
                        <p className="text-dash-text-primary font-semibold">{config.supportedPlans.length} options</p>
                      </div>
                    </div>

                    {/* Quick Setup Guide Toggle */}
                    <button
                      onClick={() => setShowSetupGuide(showSetupGuide === provider.provider_id ? null : provider.provider_id)}
                      className="flex items-center gap-2 text-dash-primary-500 text-sm font-medium mb-4 hover:text-dash-primary-400 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {showSetupGuide === provider.provider_id ? 'Hide Setup Guide' : 'Show Quick Setup Guide'}
                    </button>

                    {/* Setup Guide */}
                    {showSetupGuide === provider.provider_id && (
                      <div className="mb-6 p-4 bg-dash-primary-500/5 border border-dash-primary-500/20 rounded-lg">
                        <h4 className="text-dash-text-primary font-semibold mb-3">Quick Setup Guide</h4>
                        <ol className="space-y-2">
                          {config.setupGuide.steps.map((step, index) => (
                            <li key={index} className="flex items-start gap-3 text-sm">
                              <span className="w-5 h-5 bg-dash-primary-500/20 text-dash-primary-500 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                                {index + 1}
                              </span>
                              <span className="text-dash-text-secondary">{step}</span>
                            </li>
                          ))}
                        </ol>
                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-dash-primary-500/20">
                          <a
                            href={config.setupGuide.docsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-dash-primary-500 text-sm hover:underline"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            Documentation
                          </a>
                          <a
                            href={config.setupGuide.sandboxUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-dash-primary-500 text-sm hover:underline"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Sandbox Portal
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Credential Fields with Validation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(config.fields as unknown as Array<{key: string; label: string; type: string; required: boolean; placeholder: string}>).map((field) => {
                        const error = validationErrors[provider.provider_id]?.[field.key]
                        return (
                          <div key={field.key}>
                            <label className="block text-sm font-medium text-dash-text-secondary mb-2">
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            <input
                              type={field.type}
                              value={credentials[field.key] || ''}
                              onChange={(e) => handleCredentialChange(provider.provider_id, field.key, e.target.value)}
                              placeholder={field.placeholder}
                              className={`w-full px-4 py-3 bg-dash-surface-bg border rounded-lg text-dash-text-primary placeholder-dash-text-muted focus:outline-none focus:ring-2 transition-colors ${
                                error
                                  ? 'border-red-500 focus:ring-red-500/30'
                                  : 'border-dash-surface-border focus:ring-dash-primary-500'
                              }`}
                            />
                            {error && (
                              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                {error}
                              </p>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={testModes[provider.provider_id] ?? true}
                          onChange={(e) => setTestModes(prev => ({ ...prev, [provider.provider_id]: e.target.checked }))}
                          className="w-4 h-4 rounded border-dash-surface-border text-dash-primary-500 focus:ring-dash-primary-500"
                        />
                        <span className="text-dash-text-secondary text-sm">Test Mode (Sandbox)</span>
                      </label>

                      <div className="flex items-center gap-3">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => testConnection(provider.provider_id)}
                          loading={testingProvider === provider.provider_id}
                          disabled={!hasCredentials(provider.provider_id)}
                        >
                          Test Connection
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => saveProvider(provider.provider_id)}
                          loading={savingProvider === provider.provider_id}
                        >
                          Save Credentials
                        </Button>
                      </div>
                    </div>

                    {/* Last Test Result */}
                    {provider.last_test_at && (
                      <div className={`mt-4 p-4 rounded-lg flex items-start gap-3 ${
                        provider.last_test_success
                          ? 'bg-green-500/10 border border-green-500/20'
                          : 'bg-red-500/10 border border-red-500/20'
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          provider.last_test_success ? 'bg-green-500/20' : 'bg-red-500/20'
                        }`}>
                          {provider.last_test_success ? (
                            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${
                            provider.last_test_success ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {provider.last_test_success
                              ? 'Connection Successful'
                              : 'Connection Failed'
                            }
                          </p>
                          {!provider.last_test_success && provider.last_test_error && (
                            <p className="text-red-400/80 text-sm mt-0.5">{provider.last_test_error}</p>
                          )}
                          <p className="text-dash-text-muted text-xs mt-1">
                            Last tested: {new Date(provider.last_test_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          )
        })}
      </div>

      {/* Waterfall Preview */}
      <Card>
        <CardTitle>Waterfall Preview</CardTitle>
        <CardDescription>
          When a customer checks out, providers will be tried in this order until one approves.
        </CardDescription>
        <div className="flex items-center justify-center gap-4 overflow-x-auto pb-4 mt-6">
          {providers
            .filter(p => p.enabled && hasCredentials(p.provider_id))
            .map((provider, index, arr) => {
              const config = PROVIDER_CONFIGS[provider.provider_id]
              return (
                <div key={provider.provider_id} className="flex items-center gap-4 flex-shrink-0">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center font-bold border-2"
                      style={{ backgroundColor: config.color + '30', borderColor: config.color }}
                    >
                      {config.name.charAt(0)}
                    </div>
                    <span className="text-dash-text-primary text-sm mt-2 font-medium">{config.name}</span>
                    <span className="text-dash-text-muted text-xs">#{index + 1}</span>
                  </div>
                  {index < arr.length - 1 && (
                    <div className="flex items-center gap-2 text-dash-text-muted">
                      <span className="text-xs">if declined</span>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              )
            })}
          {providers.filter(p => p.enabled && hasCredentials(p.provider_id)).length === 0 && (
            <p className="text-dash-text-muted text-sm py-8">
              Configure and enable at least one provider to see the waterfall preview.
            </p>
          )}
        </div>
      </Card>

      {/* Integration Code */}
      <Card>
        <CardTitle>Widget Integration</CardTitle>
        <CardDescription>Add this code to your checkout page</CardDescription>
        <pre className="mt-4 p-4 bg-dash-surface-bg rounded-lg overflow-x-auto text-sm">
          <code className="text-dash-status-success">{`<script src="https://js.hedgepayments.com/coverpay/v1.js"></script>
<script>
  CoverPay.init({
    publishableKey: 'YOUR_PUBLISHABLE_KEY',
    amount: 249.99,
    orderId: 'order_123',
    customer: { email: 'customer@example.com' },
    onSuccess: (result) => {
      console.log('Approved by:', result.provider);
      // Redirect to success page
    },
    onDeclined: (reason) => {
      console.log('All providers declined');
    }
  });
  CoverPay.mount('#coverpay-checkout');
</script>`}</code>
        </pre>
        <Button variant="secondary" size="sm" className="mt-4">
          Copy Code
        </Button>
      </Card>
    </div>
  )
}
