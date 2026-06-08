export type Env = 'sandbox' | 'production'

export interface Theme { accent?: string; logoUrl?: string; radius?: number }

export interface HedgeError {
  error_type: string
  error_code: string
  error_message: string
  display_message?: string | null
}

export interface Meta {
  session_id: string
  request_id: string
  timestamp: string
  [k: string]: unknown
}

// loader -> iframe
export type OutboundMessage =
  | { hedge: true; type: 'INIT'; token: string; env: Env; theme?: Theme; receivedRedirectUri?: string }
  | { hedge: true; type: 'OPEN' }
  | { hedge: true; type: 'REQUEST_EXIT'; force: boolean }

// iframe -> loader
export type InboundMessage =
  | { hedge: true; type: 'READY' }
  | { hedge: true; type: 'RESIZE'; height: number }
  | { hedge: true; type: 'EVENT'; name: string; meta: Meta }
  | { hedge: true; type: 'SUCCESS'; result: unknown; meta: Meta }
  | { hedge: true; type: 'EXIT'; error: HedgeError | null; meta: Meta }

function rand(): string { return Math.random().toString(36).slice(2, 12) }

export function makeMeta(sessionId: string, extra: Record<string, unknown> = {}): Meta {
  return { session_id: sessionId, request_id: 'req_' + rand(), timestamp: new Date().toISOString(), ...extra }
}

export function isInbound(d: unknown): d is InboundMessage {
  return !!d && typeof d === 'object' && (d as any).hedge === true && typeof (d as any).type === 'string'
}
