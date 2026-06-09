import { describe, it, expect, vi } from 'vitest'
import { handleInit } from './init'

function fakeBridge() { return { emit: vi.fn(), success: vi.fn(), exit: vi.fn() } }
const noopConsume = vi.fn().mockResolvedValue(undefined)

describe('handleInit', () => {
  it('on a valid token: emits OPEN and mounts the flow with config, product, and consume', async () => {
    const bridge = fakeBridge()
    const mount = vi.fn()
    const root = document.createElement('div')
    const exchange = vi.fn().mockResolvedValue({ product: 'chance', config: { amount: 85 }, env: 'sandbox' })
    await handleInit(root, { token: 'lt_1' }, bridge as any, { exchange, consumeFn: noopConsume, mount })
    expect(bridge.emit).toHaveBeenCalledWith('OPEN')
    expect(mount).toHaveBeenCalledWith(
      root,
      expect.objectContaining({ config: { amount: 85 }, product: 'chance', consume: expect.any(Function) }),
    )
    expect(bridge.exit).not.toHaveBeenCalled()
  })

  it('consume in ctx delegates to deps.consumeFn with the session token', async () => {
    const bridge = fakeBridge()
    const mount = vi.fn()
    const consumeFn = vi.fn().mockResolvedValue(undefined)
    const exchange = vi.fn().mockResolvedValue({ product: 'chance', config: {}, env: 'sandbox' })
    await handleInit(document.createElement('div'), { token: 'lt_tok' }, bridge as any, { exchange, consumeFn, mount })
    const ctx = mount.mock.calls[0][1]
    await ctx.consume({ won: true })
    expect(consumeFn).toHaveBeenCalledWith('lt_tok', { won: true })
  })

  it('on an invalid token: exits with INVALID_LINK_TOKEN and does not mount', async () => {
    const bridge = fakeBridge()
    const mount = vi.fn()
    const err: any = new Error('bad'); err.error_code = 'INVALID_LINK_TOKEN'
    const exchange = vi.fn().mockRejectedValue(err)
    await handleInit(document.createElement('div'), { token: 'bad' }, bridge as any, { exchange, consumeFn: noopConsume, mount })
    expect(mount).not.toHaveBeenCalled()
    expect(bridge.exit).toHaveBeenCalledWith(expect.objectContaining({ error_code: 'INVALID_LINK_TOKEN', error_type: 'LINK_ERROR' }))
  })
})
