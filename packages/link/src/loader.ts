import type { InboundMessage, OutboundMessage, Env, Theme, HedgeError, Meta } from './protocol'
import { isInbound } from './protocol'

const DEFAULT_APP_BASE = 'https://js.hedgepayments.com/link/app'

function appBase(): string {
  return (typeof window !== 'undefined' && (window as any).__HEDGE_LINK_APP_BASE) || DEFAULT_APP_BASE
}

function appOrigin(): string {
  try { return new URL(appBase()).origin } catch { return '*' }
}

export interface CreateConfig {
  token: string
  env?: Env
  theme?: Theme
  receivedRedirectUri?: string
  onSuccess?: (result: unknown, meta: Meta) => void
  onExit?: (error: HedgeError | null, meta: Meta) => void
  onEvent?: (name: string, meta: Meta) => void
  onLoad?: () => void
}

export interface LinkHandler {
  open(): void
  exit(opts?: { force?: boolean }): void
  destroy(): void
  readonly ready: boolean
  readonly error: Error | null
}

export function createLink(config: CreateConfig): LinkHandler {
  let ready = false
  let error: Error | null = null
  let openQueued = false
  let destroyed = false

  // --- DOM setup ---
  const overlay = document.createElement('div')
  overlay.setAttribute('data-hedge-link', 'overlay')
  overlay.style.cssText = 'position:fixed;inset:0;z-index:2147483600;display:none;background:rgba(8,6,20,.55);'

  const iframe = document.createElement('iframe')
  iframe.setAttribute('data-hedge-link', 'iframe')
  iframe.setAttribute('sandbox', 'allow-scripts allow-forms allow-popups allow-same-origin')
  iframe.setAttribute('allow', 'payment')
  iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;'
  iframe.src = appBase() + '/index.html?ho=' + encodeURIComponent(location.origin)

  overlay.appendChild(iframe)
  document.body.appendChild(overlay)

  // --- messaging helpers ---
  function post(msg: OutboundMessage) {
    const w = iframe.contentWindow
    if (w) w.postMessage(msg, appOrigin())
  }

  function reveal() { overlay.style.display = 'block' }
  function hide()   { overlay.style.display = 'none'  }

  function doOpen() {
    reveal()
    post({ hedge: true, type: 'OPEN' })
  }

  // --- inbound message handler ---
  function onMessage(e: MessageEvent) {
    // Origin guard — always enforced when origin is deterministic
    if (appOrigin() !== '*' && e.origin !== appOrigin()) return
    // Source guard — must come from our iframe
    // NOTE: In jsdom, iframe.contentWindow is a real Window object and
    // MessageEvent.source is set from the `source` option in the test helper,
    // so this check works correctly in both real browsers and jsdom tests.
    if (e.source !== iframe.contentWindow) return
    if (!isInbound(e.data)) return

    const m = e.data as InboundMessage

    if (m.type === 'READY') {
      ready = true
      post({
        hedge: true,
        type: 'INIT',
        token: config.token,
        env: config.env || 'production',
        theme: config.theme,
        receivedRedirectUri: config.receivedRedirectUri,
      })
      config.onLoad?.()
      if (openQueued) { openQueued = false; doOpen() }
    } else if (m.type === 'EVENT') {
      config.onEvent?.(m.name, m.meta)
    } else if (m.type === 'SUCCESS') {
      config.onSuccess?.(m.result, m.meta)
      hide()
    } else if (m.type === 'EXIT') {
      config.onExit?.(m.error, m.meta)
      hide()
    }
    // RESIZE is handled silently (future: adjust iframe height)
  }

  window.addEventListener('message', onMessage)

  // --- public handler ---
  return {
    open() {
      if (destroyed) return
      if (!ready) { openQueued = true; return }
      doOpen()
    },
    exit(opts) {
      post({ hedge: true, type: 'REQUEST_EXIT', force: !!(opts?.force) })
      if (opts?.force) hide()
    },
    destroy() {
      destroyed = true
      window.removeEventListener('message', onMessage)
      overlay.remove()
    },
    get ready() { return ready },
    get error()  { return error },
  }
}

// Expose as Hedge.create on the global for UMD/CDN usage
if (typeof window !== 'undefined') {
  ;(window as any).Hedge = (window as any).Hedge || { create: createLink }
}
