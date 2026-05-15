'use client'

import React, { useState } from 'react'
import WaterfallConfigurator from '../components/WaterfallConfigurator'

type Product = 'coverpay' | 'sidebet' | 'roundups'
type PreviewMode = 'ios' | 'web'

const PRODUCTS = [
  { id: 'coverpay' as const, name: 'CoverPay', description: 'BNPL Aggregator', color: '#22c55e' },
  { id: 'sidebet' as const, name: 'SideBet', description: 'Sports Betting SDK', color: '#6366f1' },
  { id: 'roundups' as const, name: 'Round-Ups', description: 'Spare Change', color: '#f59e0b' },
]

// Mock checkout screen content based on selected providers
function IPhoneFrame({ product, style }: { product: Product; style?: React.CSSProperties }) {
  return (
    <div style={{
      width: 280,
      height: 560,
      backgroundColor: '#000',
      borderRadius: 40,
      padding: 10,
      boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
      position: 'relative',
      ...style,
    }}>
      {/* Notch */}
      <div style={{
        position: 'absolute',
        top: 10,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 100,
        height: 26,
        backgroundColor: '#000',
        borderBottomLeftRadius: 14,
        borderBottomRightRadius: 14,
        zIndex: 10,
      }} />

      {/* Screen */}
      <div style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#f8fafc',
        borderRadius: 30,
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Status Bar */}
        <div style={{
          height: 44,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          paddingBottom: 4,
          fontSize: 11,
          fontWeight: 600,
          color: '#1e293b',
        }}>
          9:41
        </div>

        {/* App Content */}
        <div style={{ padding: '8px 16px' }}>
          {product === 'coverpay' && <CoverPayMobileScreen />}
          {product === 'sidebet' && <SideBetMobileScreen />}
          {product === 'roundups' && <RoundUpsMobileScreen />}
        </div>
      </div>
    </div>
  )
}

function CoverPayMobileScreen() {
  return (
    <>
      <div style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>
        Checkout
      </div>
      {/* Product */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, padding: 10, backgroundColor: '#fff', borderRadius: 10, border: '1px solid #e2e8f0' }}>
        <div style={{ width: 48, height: 48, backgroundColor: '#e2e8f0', borderRadius: 8 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#1e293b' }}>Sony WH-1000XM5</div>
          <div style={{ fontSize: 11, color: '#94a3b8' }}>Wireless Headphones</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginTop: 2 }}>$349.99</div>
        </div>
      </div>
      {/* Payment Method */}
      <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>Payment Method</div>
      {/* Card option */}
      <div style={{ padding: '10px 12px', backgroundColor: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid #cbd5e1' }} />
        <span style={{ fontSize: 12, color: '#1e293b' }}>Credit Card</span>
      </div>
      {/* CoverPay option */}
      <div style={{ padding: '10px 12px', backgroundColor: '#f0fdf4', borderRadius: 8, border: '2px solid #22c55e', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid #22c55e', backgroundColor: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#fff' }} />
        </div>
        <div>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#1e293b' }}>Pay in Installments</span>
          <div style={{ fontSize: 10, color: '#22c55e' }}>Powered by CoverPay</div>
        </div>
      </div>
      {/* Provider Selection */}
      <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Choose Provider</div>
      {[
        { name: 'Klarna', color: '#FFB3C7', amount: '$87.50' },
        { name: 'Affirm', color: '#0FA0EA', amount: '$87.50' },
      ].map(p => (
        <div key={p.name} style={{ padding: '8px 10px', backgroundColor: '#fff', borderRadius: 6, border: '1px solid #e2e8f0', marginBottom: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, backgroundColor: p.color + '30', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: p.color }}>
              {p.name[0]}
            </div>
            <span style={{ fontSize: 11, fontWeight: 500 }}>{p.name}</span>
          </div>
          <span style={{ fontSize: 10, color: '#64748b' }}>4 x {p.amount}</span>
        </div>
      ))}
      {/* Pay Button */}
      <button style={{ width: '100%', padding: '12px', backgroundColor: '#22c55e', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, marginTop: 12, cursor: 'pointer' }}>
        Continue with Klarna
      </button>
    </>
  )
}

function SideBetMobileScreen() {
  return (
    <>
      <div style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>
        SideBet Deposit
      </div>
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ fontSize: 11, color: '#94a3b8' }}>Your Balance</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: '#6366f1' }}>$24.50</div>
      </div>
      <div style={{ padding: 12, backgroundColor: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', marginBottom: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#1e293b', marginBottom: 6 }}>Quick Deposit</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['$5', '$10', '$25', '$50'].map(amt => (
            <button key={amt} style={{ flex: 1, padding: '8px', fontSize: 12, fontWeight: 600, borderRadius: 6, border: '1px solid #e2e8f0', backgroundColor: amt === '$10' ? '#6366f1' : '#fff', color: amt === '$10' ? '#fff' : '#1e293b', cursor: 'pointer' }}>
              {amt}
            </button>
          ))}
        </div>
      </div>
      <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6, fontWeight: 600 }}>Payment Routing</div>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
        {['K', 'A'].map((l, i) => (
          <React.Fragment key={l}>
            <div style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: i === 0 ? '#FFB3C730' : '#0FA0EA30', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: i === 0 ? '#FFB3C7' : '#0FA0EA' }}>{l}</div>
            {i === 0 && <svg width="16" height="8" viewBox="0 0 16 8"><path d="M1 4h10M9 1l3 3-3 3" stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>}
          </React.Fragment>
        ))}
      </div>
      <button style={{ width: '100%', padding: '12px', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
        Deposit $10.00
      </button>
    </>
  )
}

function RoundUpsMobileScreen() {
  return (
    <>
      <div style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>
        Round-Ups
      </div>
      <div style={{ textAlign: 'center', padding: '16px 0' }}>
        <div style={{ fontSize: 11, color: '#94a3b8' }}>Round-Up Balance</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: '#f59e0b' }}>$12.37</div>
      </div>
      <div style={{ padding: 12, backgroundColor: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600 }}>Enable Round-Ups</span>
          <div style={{ width: 36, height: 20, borderRadius: 10, backgroundColor: '#22c55e', position: 'relative' }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#fff', position: 'absolute', top: 3, right: 3 }} />
          </div>
        </div>
        <div style={{ fontSize: 11, color: '#94a3b8' }}>Multiplier: 2X</div>
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Recent Round-Ups</div>
      {[
        { merchant: 'Chipotle', amount: '$11.42', roundup: '+$0.58' },
        { merchant: 'Starbucks', amount: '$5.75', roundup: '+$0.25' },
        { merchant: 'Target', amount: '$23.17', roundup: '+$0.83' },
      ].map(t => (
        <div key={t.merchant} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', backgroundColor: '#fff', borderRadius: 6, border: '1px solid #e2e8f0', marginBottom: 4 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500 }}>{t.merchant}</div>
            <div style={{ fontSize: 10, color: '#94a3b8' }}>{t.amount}</div>
          </div>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#f59e0b' }}>{t.roundup}</span>
        </div>
      ))}
    </>
  )
}

// Web browser frame
function WebBrowserFrame({ product, style }: { product: Product; style?: React.CSSProperties }) {
  const productConfig = PRODUCTS.find(p => p.id === product)!

  return (
    <div style={{
      width: 320,
      height: 560,
      backgroundColor: '#fff',
      borderRadius: 12,
      border: '1px solid #e2e8f0',
      boxShadow: '0 25px 50px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      ...style,
    }}>
      {/* Browser Chrome */}
      <div style={{
        height: 36,
        backgroundColor: '#f1f5f9',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        gap: 8,
      }}>
        {/* Traffic lights */}
        <div style={{ display: 'flex', gap: 5 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ef4444' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#f59e0b' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#22c55e' }} />
        </div>
        {/* URL bar */}
        <div style={{
          flex: 1,
          height: 22,
          backgroundColor: '#fff',
          borderRadius: 4,
          border: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 8,
          fontSize: 10,
          color: '#94a3b8',
        }}>
          <svg width="10" height="10" viewBox="0 0 16 16" fill="#94a3b8" style={{ marginRight: 4 }}>
            <path d="M8 1a5 5 0 015 5v2a5 5 0 01-10 0V6a5 5 0 015-5zm-3 5v2a3 3 0 006 0V6a3 3 0 00-6 0z" />
          </svg>
          checkout.mystore.com
        </div>
      </div>

      {/* Web Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
        {product === 'coverpay' && <CoverPayWebScreen />}
        {product === 'sidebet' && <SideBetWebScreen />}
        {product === 'roundups' && <RoundUpsWebScreen />}
      </div>

      {/* Footer */}
      <div style={{
        height: 28,
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 9,
        color: '#94a3b8',
        gap: 4,
      }}>
        <div style={{ width: 12, height: 12, borderRadius: 3, background: 'linear-gradient(135deg, #22c55e, #16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#fff', fontSize: 7, fontWeight: 700 }}>H</span>
        </div>
        Powered by Hedge Payments
      </div>
    </div>
  )
}

function CoverPayWebScreen() {
  return (
    <>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>
        Payment Options
      </h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <div style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#64748b' }}>Total</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>$349.99</div>
        </div>
        <div style={{ flex: 1, padding: 10, borderRadius: 8, border: '2px solid #22c55e', backgroundColor: '#f0fdf4', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#22c55e' }}>or 4 x</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#22c55e' }}>$87.50</div>
        </div>
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>Select BNPL Provider</div>
      {[
        { name: 'Klarna', color: '#FFB3C7', tag: 'Best Rate' },
        { name: 'Affirm', color: '#0FA0EA', tag: '0% APR' },
        { name: 'Afterpay', color: '#B2FCE4', tag: 'Pay in 4' },
      ].map((p, i) => (
        <div key={p.name} style={{ padding: '10px 12px', borderRadius: 8, border: i === 0 ? '2px solid #22c55e' : '1px solid #e2e8f0', marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: i === 0 ? '#f0fdf4' : '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: p.color + '30', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: p.color }}>{p.name[0]}</div>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</span>
          </div>
          <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, backgroundColor: '#f1f5f9', color: '#64748b', fontWeight: 500 }}>{p.tag}</span>
        </div>
      ))}
      <button style={{ width: '100%', padding: 12, backgroundColor: '#22c55e', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, marginTop: 12, cursor: 'pointer' }}>
        Complete Purchase
      </button>
      <div style={{ textAlign: 'center', marginTop: 8, fontSize: 10, color: '#94a3b8' }}>
        Secured by CoverPay smart routing
      </div>
    </>
  )
}

function SideBetWebScreen() {
  return (
    <>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>
        Fund Your Account
      </h3>
      <div style={{ textAlign: 'center', padding: 16, backgroundColor: '#f8fafc', borderRadius: 10, marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: '#94a3b8' }}>Current Balance</div>
        <div style={{ fontSize: 32, fontWeight: 800, color: '#6366f1' }}>$24.50</div>
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>Deposit Amount</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 16 }}>
        {['$5', '$10', '$25', '$50'].map(amt => (
          <button key={amt} style={{ padding: 10, fontSize: 13, fontWeight: 600, borderRadius: 8, border: amt === '$10' ? '2px solid #6366f1' : '1px solid #e2e8f0', backgroundColor: amt === '$10' ? '#eef2ff' : '#fff', color: amt === '$10' ? '#6366f1' : '#1e293b', cursor: 'pointer' }}>
            {amt}
          </button>
        ))}
      </div>
      <button style={{ width: '100%', padding: 12, backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
        Deposit $10.00
      </button>
    </>
  )
}

function RoundUpsWebScreen() {
  return (
    <>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>
        Round-Up Dashboard
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
        <div style={{ padding: 12, backgroundColor: '#fffbeb', borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: '#92400e' }}>This Month</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#f59e0b' }}>$12.37</div>
        </div>
        <div style={{ padding: 12, backgroundColor: '#f0fdf4', borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: '#166534' }}>All Time</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#22c55e' }}>$147.82</div>
        </div>
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>Settings</div>
      <div style={{ padding: 10, borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12 }}>Round-Up Enabled</span>
        <div style={{ width: 32, height: 18, borderRadius: 9, backgroundColor: '#22c55e', position: 'relative' }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#fff', position: 'absolute', top: 3, right: 3 }} />
        </div>
      </div>
      <div style={{ padding: 10, borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12 }}>Multiplier</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b' }}>2X</span>
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6, marginTop: 12 }}>Recent Activity</div>
      {[
        { merchant: 'Chipotle', roundup: '+$1.16' },
        { merchant: 'Starbucks', roundup: '+$0.50' },
      ].map(t => (
        <div key={t.merchant} style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #e2e8f0', marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11 }}>{t.merchant}</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#f59e0b' }}>{t.roundup}</span>
        </div>
      ))}
    </>
  )
}

// Arrow connector between columns
function ArrowConnector() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 8px',
      minWidth: 60,
    }}>
      <svg width="60" height="40" viewBox="0 0 60 40" fill="none">
        {/* Dashed line */}
        <line x1="0" y1="20" x2="44" y2="20" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6 4" />
        {/* Arrowhead */}
        <path d="M42 12L54 20L42 28" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{
        fontSize: 10,
        fontWeight: 600,
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginTop: 4,
      }}>
        Routes to
      </span>
    </div>
  )
}

export default function DemoPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product>('coverpay')
  const [previewMode, setPreviewMode] = useState<PreviewMode>('ios')

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Nav */}
      <nav style={{
        backgroundColor: '#0f172a',
        color: '#fff',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <a href="/" style={{ color: '#fff', textDecoration: 'none', fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: 'linear-gradient(135deg, #22c55e, #16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: 14, fontWeight: 800 }}>H</span>
          </div>
          Hedge Payments
        </a>
        <span style={{ fontSize: 12, padding: '4px 10px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, color: '#94a3b8' }}>
          Demo Mode
        </span>
      </nav>

      {/* Product Selector */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 12,
        padding: '24px 16px 8px',
      }}>
        {PRODUCTS.map((product) => (
          <button
            key={product.id}
            onClick={() => setSelectedProduct(product.id)}
            style={{
              padding: '12px 24px',
              borderRadius: 10,
              border: selectedProduct === product.id ? `2px solid ${product.color}` : '2px solid #e2e8f0',
              backgroundColor: selectedProduct === product.id ? product.color + '10' : '#fff',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <span style={{
              fontSize: 14,
              fontWeight: 700,
              color: selectedProduct === product.id ? product.color : '#1e293b',
            }}>
              {product.name}
            </span>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>{product.description}</span>
          </button>
        ))}
      </div>

      {/* Two-Column Layout */}
      <div style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '24px 16px',
      }}>
        <div className="demo-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: 16,
          alignItems: 'flex-start',
        }}>
          {/* Left Column: Routing Config */}
          <div style={{
            backgroundColor: '#fff',
            borderRadius: 16,
            padding: 24,
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="#fff">
                  <path d="M2 4h12M2 8h8M2 12h10" strokeWidth="0" />
                  <rect x="1" y="3" width="14" height="2" rx="1" />
                  <rect x="1" y="7" width="10" height="2" rx="1" />
                  <rect x="1" y="11" width="12" height="2" rx="1" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>Routing Configuration</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>Drag to reorder provider priority</div>
              </div>
            </div>
            <WaterfallConfigurator />
          </div>

          {/* Center: Arrow */}
          <ArrowConnector />

          {/* Right Column: Preview */}
          <div>
            {/* iOS / Web Toggle */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: 16,
            }}>
              <div style={{
                display: 'inline-flex',
                borderRadius: 8,
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
              }}>
                <button
                  onClick={() => setPreviewMode('ios')}
                  style={{
                    padding: '8px 20px',
                    fontSize: 13,
                    fontWeight: previewMode === 'ios' ? 600 : 400,
                    backgroundColor: previewMode === 'ios' ? '#1e293b' : '#fff',
                    color: previewMode === 'ios' ? '#fff' : '#64748b',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.2s',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  iOS
                </button>
                <button
                  onClick={() => setPreviewMode('web')}
                  style={{
                    padding: '8px 20px',
                    fontSize: 13,
                    fontWeight: previewMode === 'web' ? 600 : 400,
                    backgroundColor: previewMode === 'web' ? '#1e293b' : '#fff',
                    color: previewMode === 'web' ? '#fff' : '#64748b',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.2s',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                  </svg>
                  Web
                </button>
              </div>
            </div>

            {/* Preview Frame */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
              {previewMode === 'ios' ? (
                <IPhoneFrame product={selectedProduct} />
              ) : (
                <WebBrowserFrame product={selectedProduct} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Responsive styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .demo-grid {
            grid-template-columns: 1fr !important;
          }
          .demo-grid > div:nth-child(2) {
            transform: rotate(90deg);
            margin: 8px auto;
          }
        }
      `}} />
    </div>
  )
}
