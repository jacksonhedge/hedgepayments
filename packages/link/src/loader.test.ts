import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createLink } from './loader'

const APP = 'http://localhost:5174'
const APP_ORIGIN = 'http://localhost:5174'

function fromIframe(handlerIframe: HTMLIFrameElement, data: any) {
  window.dispatchEvent(new MessageEvent('message', { data, origin: APP_ORIGIN, source: handlerIframe.contentWindow as Window }))
}
function theIframe() { return document.querySelector('iframe[data-hedge-link="iframe"]') as HTMLIFrameElement }
function overlay() { return document.querySelector('[data-hedge-link="overlay"]') as HTMLElement }

beforeEach(() => {
  document.body.innerHTML = ''
  ;(window as any).__HEDGE_LINK_APP_BASE = APP
})

describe('createLink', () => {
  it('pre-warms a sandboxed iframe inside a hidden overlay', () => {
    createLink({ token: 't' })
    const f = theIframe()
    expect(f).toBeTruthy()
    expect(f.getAttribute('sandbox')).toContain('allow-scripts')
    expect(overlay().style.display).toBe('none')
  })

  it('queues open() until READY, then reveals + sends INIT and OPEN', () => {
    const sent: any[] = []
    const h = createLink({ token: 'tok', env: 'sandbox', onLoad: vi.fn() })
    const f = theIframe()
    ;(f.contentWindow as any).postMessage = (m: any) => sent.push(m)
    h.open()
    expect(overlay().style.display).toBe('none')
    fromIframe(f, { hedge: true, type: 'READY' })
    expect(sent.some((m) => m.type === 'INIT' && m.token === 'tok' && m.env === 'sandbox')).toBe(true)
    expect(sent.some((m) => m.type === 'OPEN')).toBe(true)
    expect(overlay().style.display).toBe('block')
  })

  it('relays SUCCESS to onSuccess and hides the overlay', () => {
    const onSuccess = vi.fn()
    const h = createLink({ token: 't', onSuccess })
    const f = theIframe()
    ;(f.contentWindow as any).postMessage = () => {}
    fromIframe(f, { hedge: true, type: 'READY' })
    h.open()
    fromIframe(f, { hedge: true, type: 'SUCCESS', result: { ok: true }, meta: { session_id: 's', request_id: 'r', timestamp: 't' } })
    expect(onSuccess).toHaveBeenCalledWith({ ok: true }, expect.objectContaining({ session_id: 's' }))
    expect(overlay().style.display).toBe('none')
  })

  it('ignores messages from an unknown origin', () => {
    const onEvent = vi.fn()
    createLink({ token: 't', onEvent })
    const f = theIframe()
    ;(f.contentWindow as any).postMessage = () => {}
    window.dispatchEvent(new MessageEvent('message', { data: { hedge: true, type: 'EVENT', name: 'OPEN', meta: {} }, origin: 'https://evil.example', source: f.contentWindow as Window }))
    expect(onEvent).not.toHaveBeenCalled()
  })

  it('destroy() removes the overlay/iframe and stops relaying', () => {
    const onEvent = vi.fn()
    const h = createLink({ token: 't', onEvent })
    const f = theIframe()
    h.destroy()
    expect(overlay()).toBeNull()
    fromIframe(f, { hedge: true, type: 'EVENT', name: 'OPEN', meta: {} })
    expect(onEvent).not.toHaveBeenCalled()
  })
})
