import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/preact'
import { h } from 'preact'
import { Chance } from './Chance'
import type { FlowCtx } from '../flowCtx'
import { ConsumeConflictError } from '../../linkClient'

function mockCtx(config: Record<string, unknown> = {}): FlowCtx {
  return {
    token: 'lt_test',
    product: 'chance',
    config: { amount: 100, mode: 'flip-to-free', ...config },
    emit:    vi.fn(),
    success: vi.fn(),
    exit:    vi.fn(),
    consume: vi.fn().mockResolvedValue(undefined),
  }
}

beforeEach(() => { vi.spyOn(console, 'error').mockImplementation(() => {}) })

describe('Chance — intro view', () => {
  it('renders the amount from config', () => {
    render(h(Chance, { ctx: mockCtx({ amount: 49.99 }) }))
    expect(screen.getByText(/\$49.99/)).toBeTruthy()
  })

  it('shows "Get started" CTA', () => {
    render(h(Chance, { ctx: mockCtx() }))
    expect(screen.getByText('Get started →')).toBeTruthy()
  })

  it('calls ctx.exit on "Maybe next time"', () => {
    const ctx = mockCtx()
    render(h(Chance, { ctx }))
    fireEvent.click(screen.getByText('Maybe next time'))
    expect(ctx.exit).toHaveBeenCalled()
  })

  it('shows ineligible message for a blocked state', () => {
    const { container } = render(h(Chance, { ctx: mockCtx({ country: 'US', region: 'WA' }) }))
    expect(container.textContent!.toLowerCase().includes('not available in your area')).toBe(true)
  })

  it('transitions to config on "Get started"', async () => {
    render(h(Chance, { ctx: mockCtx() }))
    fireEvent.click(screen.getByText('Get started →'))
    await waitFor(() => expect(screen.getByText('Set your bet')).toBeTruthy())
  })
})

describe('Chance — config view', () => {
  it('shows the chance percentage readout', async () => {
    render(h(Chance, { ctx: mockCtx({ amount: 100 }) }))
    fireEvent.click(screen.getByText('Get started →'))
    await waitFor(() => {
      expect(screen.getAllByText(/\d+%/).length).toBeGreaterThan(0)
    })
  })

  it('back button returns to intro', async () => {
    render(h(Chance, { ctx: mockCtx() }))
    fireEvent.click(screen.getByText('Get started →'))
    await waitFor(() => screen.getByText('Set your bet'))
    fireEvent.click(screen.getByText('‹'))
    await waitFor(() => expect(screen.getByText('Get started →')).toBeTruthy())
  })
})
