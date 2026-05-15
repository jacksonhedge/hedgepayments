'use client'

import { useState } from 'react'

interface CasinoProvider {
  name: string
  displayName: string
  logoUrl?: string
  primaryColor: string
}

const CASINO_PROVIDERS: CasinoProvider[] = [
  { name: 'fanduel', displayName: 'FanDuel', primaryColor: '#1493FF' },
  { name: 'draftkings', displayName: 'DraftKings', primaryColor: '#6EE038' },
  { name: 'betmgm', displayName: 'BetMGM', primaryColor: '#C4A962' },
  { name: 'caesars', displayName: 'Caesars', primaryColor: '#9B1B30' },
  { name: 'fanatics', displayName: 'Fanatics', primaryColor: '#0052CC' }
]

interface CasinoLinkButtonProps {
  userId: string
  provider?: string
  onSuccess?: (accountId: string) => void
  onError?: (error: string) => void
  showSelector?: boolean
  className?: string
}

export default function CasinoLinkButton({
  userId,
  provider: initialProvider,
  onSuccess,
  onError,
  showSelector = false,
  className = ''
}: CasinoLinkButtonProps) {
  const [selectedProvider, setSelectedProvider] = useState(initialProvider || 'fanduel')
  const [isLoading, setIsLoading] = useState(false)
  const [showProviderSelect, setShowProviderSelect] = useState(showSelector)

  const handleLink = async (providerName: string) => {
    setIsLoading(true)

    try {
      const redirectUri = `${window.location.origin}/api/sidebet/casinos/callback/${providerName}`

      const response = await fetch('/api/sidebet/casinos/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          provider: providerName,
          redirectUri
        })
      })

      if (!response.ok) {
        throw new Error('Failed to start casino linking')
      }

      const { data } = await response.json()

      // Redirect to casino OAuth
      window.location.href = data.authUrl
    } catch (err: any) {
      onError?.(err.message || 'Failed to link casino account')
      setIsLoading(false)
    }
  }

  const currentProvider = CASINO_PROVIDERS.find(p => p.name === selectedProvider) || CASINO_PROVIDERS[0]

  if (showProviderSelect) {
    return (
      <div className={`space-y-3 ${className}`}>
        <p className="text-gray-400 text-sm">Select a casino to link:</p>
        <div className="grid grid-cols-2 gap-2">
          {CASINO_PROVIDERS.map(provider => (
            <button
              key={provider.name}
              onClick={() => handleLink(provider.name)}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
              style={{ borderColor: isLoading ? undefined : provider.primaryColor + '40' }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: provider.primaryColor }}
              >
                {provider.displayName.charAt(0)}
              </div>
              <span className="text-white text-sm">{provider.displayName}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => handleLink(selectedProvider)}
      disabled={isLoading}
      className={`px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 ${className}`}
      style={{ backgroundColor: currentProvider.primaryColor }}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Connecting...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          Link {currentProvider.displayName}
        </span>
      )}
    </button>
  )
}
