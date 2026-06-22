import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import ClaimBeat from '../beats/ClaimBeat'

describe('ClaimBeat', () => {
  beforeEach(() => {
    // @ts-expect-error test stub
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) })
  })

  it('reveals the email-capture card after a chance:result', async () => {
    const { container } = render(<ClaimBeat />)
    const host = container.querySelector('chance-checkout')!
    expect(host).toBeTruthy()
    // capture card hidden until a result fires
    expect(screen.queryByPlaceholderText(/email/i)).not.toBeInTheDocument()
    act(() => {
      host.dispatchEvent(new CustomEvent('chance:result', { detail: { won: true, amountBack: 0.5 }, bubbles: true }))
    })
    expect(await screen.findByPlaceholderText(/email/i)).toBeInTheDocument()
  })

  it('posts to /api/subscribe and shows the reserved state on submit', async () => {
    const { container } = render(<ClaimBeat />)
    const host = container.querySelector('chance-checkout')!
    act(() => {
      host.dispatchEvent(new CustomEvent('chance:result', { detail: { won: true }, bubbles: true }))
    })
    const input = await screen.findByPlaceholderText(/email/i)
    fireEvent.change(input, { target: { value: 'player@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /reserve|save|keep/i }))
    await waitFor(() => {
      const [url, init] = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0]
      expect(url).toBe('/api/subscribe')
      expect(init).toMatchObject({ method: 'POST' })
      const body = JSON.parse(init.body as string)
      expect(body).toMatchObject({ email: 'player@example.com', name: expect.any(String) })
    })
    expect(await screen.findByText(/reserved/i)).toBeInTheDocument()
  })
})
