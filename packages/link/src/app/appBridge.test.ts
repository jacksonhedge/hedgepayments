import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createAppBridge } from './appBridge'

const HOST_ORIGIN = 'http://localhost:3000'

beforeEach(() => {
  ;(window as any).__HEDGE_LINK_HOST_ORIGIN = HOST_ORIGIN
  ;(window as any).__HEDGE_LINK_PARENT = undefined
})

describe('createAppBridge', () => {
  it('calls onInit when an INIT arrives from the host origin and posts READY on start', () => {
    const posted: any[] = []
    ;(window as any).__HEDGE_LINK_PARENT = { postMessage: (m: any) => posted.push(m) }
    const onInit = vi.fn()
    const bridge = createAppBridge({ onInit })
    bridge.start()
    expect(posted.some((m) => m.type === 'READY')).toBe(true)
    window.dispatchEvent(new MessageEvent('message', { data: { hedge: true, type: 'INIT', token: 'tok', env: 'sandbox' }, origin: HOST_ORIGIN }))
    expect(onInit).toHaveBeenCalledWith(expect.objectContaining({ token: 'tok' }))
  })

  it('emit() posts an EVENT with a metadata envelope', () => {
    const posted: any[] = []
    ;(window as any).__HEDGE_LINK_PARENT = { postMessage: (m: any) => posted.push(m) }
    const bridge = createAppBridge({ onInit: vi.fn() })
    bridge.emit('OPEN', { view: 'hello' })
    const ev = posted.find((m) => m.type === 'EVENT')
    expect(ev.name).toBe('OPEN')
    expect(ev.meta.session_id).toBeTruthy()
    expect(ev.meta.timestamp).toBeTruthy()
    expect(ev.meta.view).toBe('hello')
  })

  it('success() posts SUCCESS with result + meta', () => {
    const posted: any[] = []
    ;(window as any).__HEDGE_LINK_PARENT = { postMessage: (m: any) => posted.push(m) }
    const bridge = createAppBridge({ onInit: vi.fn() })
    bridge.success({ ok: true })
    const s = posted.find((m) => m.type === 'SUCCESS')
    expect(s.result).toEqual({ ok: true })
    expect(s.meta.session_id).toBeTruthy()
  })
})
