'use client'

import React, { useState } from 'react'

interface Provider {
  id: string
  name: string
  color: string
  enabled: boolean
  plans: string[]
}

interface WaterfallConfiguratorProps {
  onConfigChange?: (providers: Provider[]) => void
}

const DEFAULT_PROVIDERS: Provider[] = [
  { id: 'klarna', name: 'Klarna', color: '#FFB3C7', enabled: true, plans: ['Pay in 4', 'Pay in 30 days'] },
  { id: 'affirm', name: 'Affirm', color: '#0FA0EA', enabled: true, plans: ['Pay in 4', '6 Months', '12 Months'] },
  { id: 'afterpay', name: 'Afterpay', color: '#B2FCE4', enabled: false, plans: ['Pay in 4'] },
  { id: 'sezzle', name: 'Sezzle', color: '#382757', enabled: false, plans: ['Pay in 4'] },
]

export default function WaterfallConfigurator({ onConfigChange }: WaterfallConfiguratorProps) {
  const [providers, setProviders] = useState<Provider[]>(DEFAULT_PROVIDERS)
  const [routingMode, setRoutingMode] = useState<'waterfall' | 'cheapest' | 'highest-approval'>('waterfall')
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const updateProviders = (updated: Provider[]) => {
    setProviders(updated)
    onConfigChange?.(updated)
  }

  const toggleProvider = (id: string) => {
    const updated = providers.map(p =>
      p.id === id ? { ...p, enabled: !p.enabled } : p
    )
    updateProviders(updated)
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleDrop = (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }
    const updated = [...providers]
    const [removed] = updated.splice(draggedIndex, 1)
    updated.splice(targetIndex, 0, removed)
    updateProviders(updated)
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const enabledProviders = providers.filter(p => p.enabled)

  return (
    <div>
      {/* Routing Mode Selector */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
          Routing Strategy
        </label>
        <div style={{ display: 'flex', gap: 0, borderRadius: 8, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          {[
            { value: 'waterfall' as const, label: 'Waterfall' },
            { value: 'cheapest' as const, label: 'Cheapest' },
            { value: 'highest-approval' as const, label: 'Best Approval' },
          ].map((mode) => (
            <button
              key={mode.value}
              onClick={() => setRoutingMode(mode.value)}
              style={{
                flex: 1,
                padding: '10px 12px',
                fontSize: 13,
                fontWeight: routingMode === mode.value ? 600 : 400,
                backgroundColor: routingMode === mode.value ? '#1e293b' : '#fff',
                color: routingMode === mode.value ? '#fff' : '#64748b',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {mode.label}
            </button>
          ))}
        </div>
        <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>
          {routingMode === 'waterfall' && 'Try providers in order until one approves.'}
          {routingMode === 'cheapest' && 'Route to the provider with lowest fees.'}
          {routingMode === 'highest-approval' && 'Route to the provider with highest approval rate.'}
        </p>
      </div>

      {/* Provider Priority List */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
          Provider Priority
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {providers.map((provider, index) => (
            <div
              key={provider.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={() => handleDrop(index)}
              onDragEnd={() => { setDraggedIndex(null); setDragOverIndex(null) }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                backgroundColor: dragOverIndex === index ? '#f1f5f9' : '#fff',
                border: `1.5px solid ${provider.enabled ? provider.color + '60' : '#e2e8f0'}`,
                borderRadius: 10,
                cursor: 'grab',
                opacity: draggedIndex === index ? 0.4 : 1,
                transition: 'all 0.2s',
              }}
            >
              {/* Drag Handle */}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="#94a3b8">
                <circle cx="5" cy="3" r="1.5" />
                <circle cx="11" cy="3" r="1.5" />
                <circle cx="5" cy="8" r="1.5" />
                <circle cx="11" cy="8" r="1.5" />
                <circle cx="5" cy="13" r="1.5" />
                <circle cx="11" cy="13" r="1.5" />
              </svg>

              {/* Priority Number */}
              <div style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: provider.enabled ? '#1e293b' : '#e2e8f0',
                color: provider.enabled ? '#fff' : '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
                flexShrink: 0,
              }}>
                {index + 1}
              </div>

              {/* Provider Logo */}
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                backgroundColor: provider.color + '25',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 16,
                color: provider.id === 'sezzle' ? '#fff' : provider.color,
                ...(provider.id === 'sezzle' ? { backgroundColor: provider.color } : {}),
                flexShrink: 0,
              }}>
                {provider.name.charAt(0)}
              </div>

              {/* Provider Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>
                  {provider.name}
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {provider.plans.join(' · ')}
                </div>
              </div>

              {/* Toggle */}
              <button
                onClick={(e) => { e.stopPropagation(); toggleProvider(provider.id) }}
                style={{
                  width: 40,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: provider.enabled ? '#22c55e' : '#e2e8f0',
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background-color 0.2s',
                  flexShrink: 0,
                }}
              >
                <div style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  backgroundColor: '#fff',
                  position: 'absolute',
                  top: 3,
                  left: provider.enabled ? 21 : 3,
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                }} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Waterfall Preview */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
          Active Waterfall
        </label>
        {enabledProviders.length === 0 ? (
          <div style={{ padding: 16, textAlign: 'center', color: '#94a3b8', fontSize: 13, border: '1px dashed #e2e8f0', borderRadius: 8 }}>
            Enable at least one provider
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {enabledProviders.map((provider, index) => (
              <React.Fragment key={provider.id}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    backgroundColor: provider.color + '25',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 18,
                    color: provider.id === 'sezzle' ? '#fff' : provider.color,
                    border: `2px solid ${provider.color}`,
                    ...(provider.id === 'sezzle' ? { backgroundColor: provider.color } : {}),
                  }}>
                    {provider.name.charAt(0)}
                  </div>
                  <span style={{ fontSize: 10, color: '#64748b', fontWeight: 500 }}>{provider.name}</span>
                </div>
                {index < enabledProviders.length - 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
                      <path d="M1 6h14M12 2l4 4-4 4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{ fontSize: 9, color: '#cbd5e1' }}>decline</span>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Configuration Summary */}
      <div style={{
        padding: 12,
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        border: '1px solid #e2e8f0',
        fontSize: 12,
        color: '#64748b',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span>Active Providers</span>
          <span style={{ fontWeight: 600, color: '#1e293b' }}>{enabledProviders.length} of {providers.length}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span>Routing Mode</span>
          <span style={{ fontWeight: 600, color: '#1e293b', textTransform: 'capitalize' }}>{routingMode.replace('-', ' ')}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Estimated Approval</span>
          <span style={{ fontWeight: 600, color: '#22c55e' }}>
            {enabledProviders.length === 0 ? '0%' : enabledProviders.length === 1 ? '~72%' : enabledProviders.length === 2 ? '~89%' : enabledProviders.length === 3 ? '~95%' : '~98%'}
          </span>
        </div>
      </div>
    </div>
  )
}
