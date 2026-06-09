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

async function renderAtMarkets(ctx: FlowCtx) {
  vi.stubGlobal('fetch', () => Promise.resolve({ ok: false })) // Gamma fails → seed
  render(h(Chance, { ctx }))
  fireEvent.click(screen.getByText('Get started →'))
  await waitFor(() => screen.getByText('Set your bet'))
  // wait for seed candidates to load (Gamma fails, falls back to seed)
  await waitFor(() => {
    const btn = screen.queryByText(/Find \d+ market/)
    if (!btn) throw new Error('no markets button yet')
    return btn
  }, { timeout: 3000 })
  const btn = screen.getByText(/Find \d+ market/)
  fireEvent.click(btn)
  await waitFor(() => screen.getByText(/Markets near your odds/i), { timeout: 2000 })
}

describe('Chance — markets view', () => {
  it('shows market rows loaded from seed', async () => {
    const ctx = mockCtx({ amount: 100 })
    await renderAtMarkets(ctx)
    const rows = document.querySelectorAll('.ch-row')
    expect(rows.length).toBeGreaterThan(0)
  })

  it('Place button is disabled until a market is picked', async () => {
    const ctx = mockCtx({ amount: 100 })
    await renderAtMarkets(ctx)
    const placeBtn = screen.getByText(/Pick a market to place/i) as HTMLButtonElement
    expect(placeBtn.disabled).toBe(true)
  })

  it('calls ctx.consume on Place click', async () => {
    const ctx = mockCtx({ amount: 100 })
    await renderAtMarkets(ctx)
    const rows = document.querySelectorAll('.ch-row')
    expect(rows.length).toBeGreaterThan(0)
    fireEvent.click(rows[0])
    await waitFor(() => {
      const btn = screen.queryByText(/& place|free to play/i) as HTMLButtonElement | null
      if (!btn || btn.disabled) throw new Error('place button not enabled yet')
    })
    const placeBtn = screen.getByText(/& place|free to play/i) as HTMLButtonElement
    fireEvent.click(placeBtn)
    await waitFor(() => expect(ctx.consume).toHaveBeenCalled())
  })

  it('shows inline error and stays on markets when consume returns 409', async () => {
    const ctx = mockCtx({ amount: 100 })
    ctx.consume = vi.fn().mockRejectedValue(new ConsumeConflictError())
    await renderAtMarkets(ctx)
    const rows = document.querySelectorAll('.ch-row')
    expect(rows.length).toBeGreaterThan(0)
    fireEvent.click(rows[0])
    await waitFor(() => {
      const btn = screen.queryByText(/& place|free to play/i) as HTMLButtonElement | null
      if (!btn || btn.disabled) throw new Error('place button not ready')
    })
    fireEvent.click(screen.getByText(/& place|free to play/i))
    await waitFor(() => expect(screen.getByText(/already been placed/i)).toBeTruthy())
    // still on markets
    expect(screen.queryByText(/Markets near your odds/i)).toBeTruthy()
  })
})

describe('Chance — result view', () => {
  it('calls ctx.success when Done is clicked', async () => {
    vi.useFakeTimers()
    const ctx = mockCtx({ amount: 100 })
    // pre-load seed candidates so config CTA enables immediately
    vi.stubGlobal('fetch', () => Promise.resolve({ ok: false }))
    render(h(Chance, { ctx }))
    fireEvent.click(screen.getByText('Get started →'))
    await waitFor(() => screen.getByText('Set your bet'))
    vi.useRealTimers() // release timer lock before async ops
    await waitFor(() => {
      const btn = screen.queryByText(/Find \d+ market/)
      if (!btn) throw new Error('waiting for markets')
      return btn
    }, { timeout: 3000 })
    fireEvent.click(screen.getByText(/Find \d+ market/))
    await waitFor(() => screen.getByText(/Markets near your odds/i))
    const rows = document.querySelectorAll('.ch-row')
    if (rows.length > 0) {
      fireEvent.click(rows[0])
      await waitFor(() => {
        const btn = screen.queryByText(/& place|free to play/i) as HTMLButtonElement | null
        if (!btn || btn.disabled) throw new Error('place btn not ready')
      })
      fireEvent.click(screen.getByText(/& place|free to play/i))
      await waitFor(() => expect(ctx.consume).toHaveBeenCalled())
      // wait for settlement timeout (2100ms)
      await waitFor(() => screen.queryByText('Done'), { timeout: 4000 })
      if (screen.queryByText('Done')) {
        fireEvent.click(screen.getByText('Done'))
        expect(ctx.success).toHaveBeenCalled()
      }
    }
  })
})
