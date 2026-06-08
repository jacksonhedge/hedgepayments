import { InboundMessage, OutboundMessage, makeMeta } from '../protocol'

function hostOrigin(): string {
  if (typeof window !== 'undefined') {
    const override = (window as any).__HEDGE_LINK_HOST_ORIGIN
    if (override) return override
    try {
      const ho = new URLSearchParams(window.location.search).get('ho')
      if (ho) return ho
    } catch (e) { /* ignore */ }
  }
  return '*'
}

/** Returns the parent target. In tests jsdom makes window.parent read-only (=== window),
 *  so tests inject __HEDGE_LINK_PARENT instead of trying to reassign window.parent. */
function parentTarget(): { postMessage: (msg: any, origin: string) => void } {
  if (typeof window !== 'undefined' && (window as any).__HEDGE_LINK_PARENT) {
    return (window as any).__HEDGE_LINK_PARENT
  }
  return window.parent
}

export interface InitPayload {
  token: string
  env: string
  theme?: any
  receivedRedirectUri?: string
}

export interface AppBridge {
  start(): void
  emit(name: string, extra?: Record<string, unknown>): void
  success(result: unknown): void
  exit(error?: any): void
  readonly sessionId: string
}

export function createAppBridge(opts: { onInit: (init: InitPayload) => void }): AppBridge {
  const sessionId = 'sess_' + Math.random().toString(36).slice(2, 12)

  function send(msg: InboundMessage): void {
    parentTarget().postMessage(msg, hostOrigin())
  }

  function onMessage(e: MessageEvent): void {
    if (hostOrigin() !== '*' && e.origin !== hostOrigin()) return
    const d = e.data
    if (!d || d.hedge !== true) return
    const m = d as OutboundMessage
    if (m.type === 'INIT') {
      opts.onInit({
        token: m.token,
        env: m.env,
        theme: m.theme,
        receivedRedirectUri: m.receivedRedirectUri,
      })
    }
  }

  return {
    start() {
      window.addEventListener('message', onMessage)
      send({ hedge: true, type: 'READY' })
    },
    emit(name, extra?) {
      send({ hedge: true, type: 'EVENT', name, meta: makeMeta(sessionId, extra) })
    },
    success(result) {
      send({ hedge: true, type: 'SUCCESS', result, meta: makeMeta(sessionId) })
    },
    exit(error?) {
      send({ hedge: true, type: 'EXIT', error: error ?? null, meta: makeMeta(sessionId) })
    },
    get sessionId() {
      return sessionId
    },
  }
}
