import { describe, it, expect, vi, beforeEach } from 'vitest'
import { exchangeToken, consumeSession, ConsumeConflictError } from './linkClient'

beforeEach(() => { (window as any).__HEDGE_LINK_API_BASE = 'http://api.test/api/v1/link' })

describe('exchangeToken', () => {
  it('POSTs to the exchange endpoint and returns the session on 200', async () => {
    const calls: any[] = []
    ;(globalThis as any).fetch = (url: string, opts: any) => { calls.push({ url, opts }); return Promise.resolve({ ok: true, json: () => Promise.resolve({ product: 'chance', config: { amount: 85 }, env: 'sandbox' }) }) }
    const s = await exchangeToken('lt_1')
    expect(calls[0].url).toBe('http://api.test/api/v1/link/sessions/lt_1/exchange')
    expect(calls[0].opts.method).toBe('POST')
    expect(s).toEqual({ product: 'chance', config: { amount: 85 }, env: 'sandbox' })
  })
  it('throws INVALID_LINK_TOKEN on a non-200', async () => {
    ;(globalThis as any).fetch = () => Promise.resolve({ ok: false, status: 410, json: () => Promise.resolve({ error_code: 'INVALID_LINK_TOKEN' }) })
    await expect(exchangeToken('bad')).rejects.toMatchObject({ error_code: 'INVALID_LINK_TOKEN' })
  })
})

describe('consumeSession', () => {
  it('resolves on 200', async () => {
    ;(globalThis as any).fetch = () =>
      Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ ok: true }) })
    await expect(consumeSession('lt_1', { won: true })).resolves.toBeUndefined()
  })

  it('throws ConsumeConflictError on 409', async () => {
    ;(globalThis as any).fetch = () =>
      Promise.resolve({ ok: false, status: 409, json: () => Promise.resolve({ error_code: 'ALREADY_CONSUMED' }) })
    await expect(consumeSession('lt_1', { won: true })).rejects.toBeInstanceOf(ConsumeConflictError)
  })

  it('throws INVALID_LINK_TOKEN error on 410', async () => {
    ;(globalThis as any).fetch = () =>
      Promise.resolve({ ok: false, status: 410, json: () => Promise.resolve({ error_code: 'INVALID_LINK_TOKEN' }) })
    await expect(consumeSession('lt_1', { won: false })).rejects.toMatchObject({ error_code: 'INVALID_LINK_TOKEN' })
  })

  it('POSTs to the correct endpoint with the result payload', async () => {
    const calls: any[] = []
    ;(globalThis as any).fetch = (url: string, opts: any) => {
      calls.push({ url, opts })
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ ok: true }) })
    }
    await consumeSession('lt_abc', { won: false, finalPrice: 49.99 })
    expect(calls[0].url).toBe('http://api.test/api/v1/link/sessions/lt_abc/consume')
    expect(calls[0].opts.method).toBe('POST')
    expect(JSON.parse(calls[0].opts.body)).toEqual({ result: { won: false, finalPrice: 49.99 } })
  })
})
