import { describe, it, expect } from 'vitest'
import { makeMeta, isInbound } from './protocol'

describe('makeMeta', () => {
  it('stamps session_id, request_id, ISO timestamp, and merges extra', () => {
    const m = makeMeta('sess_1', { view: 'hello' })
    expect(m.session_id).toBe('sess_1')
    expect(m.request_id).toMatch(/^req_/)
    expect(() => new Date(m.timestamp).toISOString()).not.toThrow()
    expect(m.view).toBe('hello')
  })
})

describe('isInbound', () => {
  it('accepts a tagged hedge message and rejects anything else', () => {
    expect(isInbound({ hedge: true, type: 'READY' })).toBe(true)
    expect(isInbound({ type: 'READY' })).toBe(false)
    expect(isInbound(null)).toBe(false)
    expect(isInbound('READY')).toBe(false)
  })
})
