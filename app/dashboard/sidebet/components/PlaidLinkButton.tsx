'use client'

import { useState, useCallback } from 'react'

interface PlaidLinkButtonProps {
  userId: string
  onSuccess: (publicToken: string, metadata: any) => void
  onExit?: () => void
  className?: string
}

export default function PlaidLinkButton({
  userId,
  onSuccess,
  onExit,
  className = ''
}: PlaidLinkButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Get link token from backend
      const response = await fetch('/api/sidebet/banks/link-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })

      if (!response.ok) {
        throw new Error('Failed to create link token')
      }

      const { data } = await response.json()

      // Load Plaid Link
      const Plaid = (window as any).Plaid
      if (!Plaid) {
        throw new Error('Plaid SDK not loaded')
      }

      const handler = Plaid.create({
        token: data.linkToken,
        onSuccess: (publicToken: string, metadata: any) => {
          onSuccess(publicToken, metadata)
        },
        onExit: (err: any, metadata: any) => {
          if (err) {
            setError(err.display_message || 'Connection cancelled')
          }
          onExit?.()
        }
      })

      handler.open()
    } catch (err: any) {
      setError(err.message || 'Failed to open bank connection')
    } finally {
      setIsLoading(false)
    }
  }, [userId, onSuccess, onExit])

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50 ${className}`}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Connect Bank
          </span>
        )}
      </button>
      {error && (
        <p className="text-red-400 text-sm mt-2">{error}</p>
      )}
    </div>
  )
}
