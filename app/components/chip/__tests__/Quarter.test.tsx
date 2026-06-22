import { render, screen } from '@testing-library/react'
import Quarter from '../Quarter'

describe('Quarter', () => {
  it('shows the coin face when morph is 0', () => {
    render(<Quarter scale={1} rotate={0} x={0} y={0} morph={0} />)
    expect(screen.getByTestId('quarter')).toHaveAttribute('data-morph-state', 'coin')
  })
  it('shows the venue logo when morph is 1', () => {
    render(<Quarter scale={1} rotate={0} x={0} y={0} morph={1} />)
    expect(screen.getByTestId('quarter')).toHaveAttribute('data-morph-state', 'logo')
  })
  it('renders a coin label for accessibility', () => {
    render(<Quarter scale={1} rotate={0} x={0} y={0} morph={0} />)
    expect(screen.getByLabelText(/quarter/i)).toBeInTheDocument()
  })
})
