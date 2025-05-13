import React from 'react'

export default function TestRoute() {
  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '600px', 
      margin: '0 auto', 
      textAlign: 'center' 
    }}>
      <h1>Test Route is Working!</h1>
      <p>This is a simple test page to verify routing is working correctly.</p>
      <p>If you can see this page, then the server is functioning properly.</p>
      <div style={{ marginTop: '2rem' }}>
        <a href="/sidebet" style={{ 
          padding: '0.5rem 1rem', 
          background: 'blue', 
          color: 'white', 
          textDecoration: 'none', 
          borderRadius: '4px'
        }}>
          Try accessing SideBet page from here
        </a>
      </div>
    </div>
  )
} 