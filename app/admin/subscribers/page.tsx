'use client'

import React, { useEffect, useState } from 'react'
import { supabaseAdmin } from '../../utils/supabase'

interface Subscriber {
  id: number
  email: string
  name: string
  subscribed_at: string
  created_at: string
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSubscribers() {
      try {
        setLoading(true)
        const { data, error } = await supabaseAdmin
          .from('subscribers')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          throw error
        }

        setSubscribers(data || [])
      } catch (err: any) {
        console.error('Error fetching subscribers:', err)
        setError(err.message || 'Failed to load subscribers')
      } finally {
        setLoading(false)
      }
    }

    fetchSubscribers()
  }, [])

  if (loading) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h1>Loading subscribers...</h1>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '50px', textAlign: 'center', color: 'red' }}>
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px' }}>Subscribers ({subscribers.length})</h1>
      
      {subscribers.length === 0 ? (
        <p>No subscribers found in the database.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ddd', background: '#f5f5f5' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Subscribed At</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((subscriber) => (
              <tr key={subscriber.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>{subscriber.name}</td>
                <td style={{ padding: '10px' }}>{subscriber.email}</td>
                <td style={{ padding: '10px' }}>
                  {new Date(subscriber.subscribed_at || subscriber.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
} 