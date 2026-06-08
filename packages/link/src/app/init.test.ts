import { describe, it, expect, vi } from 'vitest'
import { handleInit } from './init'

function fakeBridge() { return { emit: vi.fn(), success: vi.fn(), exit: vi.fn() } }

describe('handleInit', () => {
  it('on a valid token: emits OPEN and mounts the flow with the session config', async () => {
    const bridge = fakeBridge()
    const mount = vi.fn()
    const root = document.createElement('div')
    const exchange = vi.fn().mockResolvedValue({ product: 'chance', config: { amount: 85 }, env: 'sandbox' })
    await handleInit(root, { token: 'lt_1' }, bridge as any, { exchange, mount })
    expect(bridge.emit).toHaveBeenCalledWith('OPEN')
    expect(mount).toHaveBeenCalledWith(root, expect.objectContaining({ config: { amount: 85 } }))
    expect(bridge.exit).not.toHaveBeenCalled()
  })
  it('on an invalid token: exits with INVALID_LINK_TOKEN and does not mount', async () => {
    const bridge = fakeBridge()
    const mount = vi.fn()
    const err: any = new Error('bad'); err.error_code = 'INVALID_LINK_TOKEN'
    const exchange = vi.fn().mockRejectedValue(err)
    await handleInit(document.createElement('div'), { token: 'bad' }, bridge as any, { exchange, mount })
    expect(mount).not.toHaveBeenCalled()
    expect(bridge.exit).toHaveBeenCalledWith(expect.objectContaining({ error_code: 'INVALID_LINK_TOKEN', error_type: 'LINK_ERROR' }))
  })
})
