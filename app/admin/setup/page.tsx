'use client'

import React, { useState } from 'react'
import { supabaseAdmin } from '../../utils/supabase'

export default function SetupPage() {
  const [message, setMessage] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const checkTableExists = async () => {
    setLoading(true)
    setError(null)
    setMessage('')

    try {
      // Check if the table exists
      const { data, error: checkError } = await supabaseAdmin
        .from('subscribers')
        .select('count(*)', { count: 'exact' })
      
      if (checkError) {
        if (checkError.code === '42P01') {
          // Table doesn't exist
          setMessage('The subscribers table does not exist in your Supabase database. Please create it with the following columns: id, email, name, subscribed_at, created_at')
        } else {
          throw checkError
        }
      } else {
        const count = (data as any).count || 0
        setMessage(`Success! The subscribers table exists with ${count} records.`)
      }
    } catch (err: any) {
      console.error('Setup error:', err)
      setError(err.message || 'An error occurred during setup')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '50px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Database Setup</h1>
      
      <div style={{ marginTop: '30px' }}>
        <button 
          onClick={checkTableExists}
          disabled={loading}
          style={{
            padding: '10px 20px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Checking...' : 'Check Subscribers Table'}
        </button>
      </div>
      
      {message && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#E8F5E9', borderRadius: '4px' }}>
          {message}
        </div>
      )}
      
      {error && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#FFEBEE', borderRadius: '4px', color: '#D32F2F' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <div style={{ marginTop: '40px' }}>
        <h2>Setup Instructions</h2>
        <p>If you need to create the subscribers table, you can do so through the Supabase dashboard:</p>
        <ol style={{ lineHeight: '1.6' }}>
          <li>Go to your <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" style={{ color: '#2196F3' }}>Supabase dashboard</a></li>
          <li>Select your project</li>
          <li>Go to the "Table Editor" section</li>
          <li>Click "New Table"</li>
          <li>Name the table "subscribers"</li>
          <li>Add the following columns:
            <ul>
              <li><strong>id</strong>: type int8, primary key (enable "Identity" and "Is Primary Key")</li>
              <li><strong>email</strong>: type text, required, unique</li>
              <li><strong>name</strong>: type text, required</li>
              <li><strong>subscribed_at</strong>: type timestamptz, default: now()</li>
              <li><strong>created_at</strong>: type timestamptz, default: now()</li>
            </ul>
          </li>
          <li>Click "Save" to create the table</li>
        </ol>
      </div>
      
      <div style={{ marginTop: '40px' }}>
        <h2>Navigation</h2>
        <ul>
          <li style={{ marginBottom: '10px' }}>
            <a href="/admin/subscribers" style={{ color: '#2196F3', textDecoration: 'none' }}>
              View Subscribers
            </a>
          </li>
          <li>
            <a href="/" style={{ color: '#2196F3', textDecoration: 'none' }}>
              Back to Home
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
} 