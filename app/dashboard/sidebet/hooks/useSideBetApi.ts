'use client'

import { useState, useEffect, useCallback } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

interface Stats {
  totalRoundupsCents: number
  settledCents: number
  pendingCents: number
  totalCount: number
}

interface Transaction {
  id: string
  merchant: string
  amount: number
  roundUp: number
  category: string
  date: string
  status: 'collected' | 'pending' | 'settled'
}

interface BankConnection {
  id: string
  institutionName: string
  institutionLogo?: string
  status: string
  accounts: {
    id: string
    name: string
    mask: string
    isMonitored: boolean
  }[]
}

interface CasinoAccount {
  id: string
  provider: string
  displayName: string
  username: string
  isPrimary: boolean
  totalDepositedCents: number
}

export function useSideBetApi(userId: string | null) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [bankConnections, setBankConnections] = useState<BankConnection[]>([])
  const [casinoAccounts, setCasinoAccounts] = useState<CasinoAccount[]>([])
  const [userSettings, setUserSettings] = useState<any>(null)

  const fetchData = useCallback(async () => {
    if (!userId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Fetch all data in parallel
      const [userRes, roundupsRes, banksRes, casinosRes] = await Promise.all([
        fetch(`${API_BASE}/sidebet/users/${userId}`),
        fetch(`${API_BASE}/sidebet/roundups?userId=${userId}&limit=20`),
        fetch(`${API_BASE}/sidebet/banks?userId=${userId}`),
        fetch(`${API_BASE}/sidebet/casinos?userId=${userId}`)
      ])

      // Process user data
      if (userRes.ok) {
        const userData = await userRes.json()
        if (userData.success) {
          setStats({
            totalRoundupsCents: userData.data.balance?.totalRoundupsCents || 0,
            settledCents: userData.data.balance?.totalSettledCents || 0,
            pendingCents: userData.data.balance?.pendingCents || 0,
            totalCount: userData.data.stats?.totalCount || 0
          })
          setUserSettings(userData.data.settings)
        }
      }

      // Process roundups
      if (roundupsRes.ok) {
        const roundupsData = await roundupsRes.json()
        if (roundupsData.success) {
          setTransactions(roundupsData.data.roundups.map((r: any) => ({
            id: r.id,
            merchant: r.transaction?.merchantName || 'Unknown',
            amount: (r.originalAmountCents || 0) / 100,
            roundUp: (r.finalRoundupCents || 0) / 100,
            category: r.transaction?.category?.[0] || 'Other',
            date: r.transaction?.date || r.createdAt?.split('T')[0],
            status: r.status
          })))
        }
      }

      // Process bank connections
      if (banksRes.ok) {
        const banksData = await banksRes.json()
        if (banksData.success) {
          setBankConnections(banksData.data.connections.map((c: any) => ({
            id: c.id,
            institutionName: c.institution?.name || 'Bank',
            institutionLogo: c.institution?.logo,
            status: c.status,
            accounts: c.accounts || []
          })))
        }
      }

      // Process casino accounts
      if (casinosRes.ok) {
        const casinosData = await casinosRes.json()
        if (casinosData.success) {
          setCasinoAccounts(casinosData.data.accounts.map((a: any) => ({
            id: a.id,
            provider: a.provider,
            displayName: a.displayName,
            username: a.username,
            isPrimary: a.isPrimary,
            totalDepositedCents: a.totalDepositedCents || 0
          })))
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const triggerSettlement = useCallback(async () => {
    if (!userId) return

    try {
      const response = await fetch(`${API_BASE}/sidebet/settlements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })

      if (!response.ok) {
        throw new Error('Settlement failed')
      }

      const data = await response.json()
      // Refresh data after settlement
      await fetchData()
      return data
    } catch (err: any) {
      throw err
    }
  }, [userId, fetchData])

  const updateSettings = useCallback(async (updates: any) => {
    if (!userId) return

    try {
      const response = await fetch(`${API_BASE}/sidebet/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        throw new Error('Failed to update settings')
      }

      await fetchData()
    } catch (err: any) {
      throw err
    }
  }, [userId, fetchData])

  const pauseRoundups = useCallback(async (reason?: string) => {
    if (!userId) return

    try {
      const response = await fetch(`${API_BASE}/sidebet/users/${userId}/pause`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      })

      if (!response.ok) {
        throw new Error('Failed to pause roundups')
      }

      await fetchData()
    } catch (err: any) {
      throw err
    }
  }, [userId, fetchData])

  const resumeRoundups = useCallback(async () => {
    if (!userId) return

    try {
      const response = await fetch(`${API_BASE}/sidebet/users/${userId}/resume`, {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error('Failed to resume roundups')
      }

      await fetchData()
    } catch (err: any) {
      throw err
    }
  }, [userId, fetchData])

  const exchangeBankToken = useCallback(async (publicToken: string, accountIds?: string[]) => {
    if (!userId) return

    try {
      const response = await fetch(`${API_BASE}/sidebet/banks/exchange`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          publicToken,
          accountIds
        })
      })

      if (!response.ok) {
        throw new Error('Failed to link bank account')
      }

      await fetchData()
      return await response.json()
    } catch (err: any) {
      throw err
    }
  }, [userId, fetchData])

  const removeBankConnection = useCallback(async (connectionId: string) => {
    try {
      const response = await fetch(`${API_BASE}/sidebet/banks/${connectionId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to remove bank connection')
      }

      await fetchData()
    } catch (err: any) {
      throw err
    }
  }, [fetchData])

  const setPrimaryCasino = useCallback(async (accountId: string) => {
    if (!userId) return

    try {
      const response = await fetch(`${API_BASE}/sidebet/casinos/${accountId}/primary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })

      if (!response.ok) {
        throw new Error('Failed to set primary casino')
      }

      await fetchData()
    } catch (err: any) {
      throw err
    }
  }, [userId, fetchData])

  return {
    isLoading,
    error,
    stats,
    transactions,
    bankConnections,
    casinoAccounts,
    userSettings,
    refresh: fetchData,
    triggerSettlement,
    updateSettings,
    pauseRoundups,
    resumeRoundups,
    exchangeBankToken,
    removeBankConnection,
    setPrimaryCasino
  }
}
