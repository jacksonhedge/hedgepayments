import { describe, it, expect, vi } from 'vitest'
import { mountHello } from './hello'

describe('mountHello', () => {
  it('renders a confirm button that emits SUCCESS', () => {
    const root = document.createElement('div')
    const ctx = { token: 't', config: {}, emit: vi.fn(), success: vi.fn(), exit: vi.fn() }
    mountHello(root, ctx as any)
    const btn = root.querySelector('button[data-act="confirm"]') as HTMLButtonElement
    expect(btn).toBeTruthy()
    btn.click()
    expect(ctx.success).toHaveBeenCalledWith(expect.objectContaining({ flow: 'hello' }))
  })
})
