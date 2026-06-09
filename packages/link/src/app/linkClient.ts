export interface LinkSession { product: string; config: Record<string, unknown>; env: string }

function apiBase(): string {
  return (typeof window !== 'undefined' && (window as any).__HEDGE_LINK_API_BASE) || 'https://api.hedgepayments.com/api/v1/link'
}

export async function exchangeToken(token: string): Promise<LinkSession> {
  const res = await fetch(apiBase() + '/sessions/' + encodeURIComponent(token) + '/exchange', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
  })
  if (!res.ok) {
    const err: any = new Error('INVALID_LINK_TOKEN')
    err.error_code = 'INVALID_LINK_TOKEN'
    throw err
  }
  return res.json()
}

export class ConsumeConflictError extends Error {
  readonly error_code = 'ALREADY_CONSUMED'
  constructor(message = 'already_consumed') { super(message) }
}

export async function consumeSession(token: string, result: unknown): Promise<void> {
  const res = await fetch(
    apiBase() + '/sessions/' + encodeURIComponent(token) + '/consume',
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ result }),
    },
  )
  if (res.status === 409) throw new ConsumeConflictError()
  if (!res.ok) {
    const err: any = new Error('INVALID_LINK_TOKEN')
    err.error_code = 'INVALID_LINK_TOKEN'
    throw err
  }
}
