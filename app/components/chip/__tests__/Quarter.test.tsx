import { render, screen } from '@testing-library/react'
import { motionValue } from 'framer-motion'
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
  it('reads data-morph-state correctly from a MotionValue morph=1 (logo)', () => {
    const mv = motionValue(1)
    render(<Quarter scale={1} rotate={0} x={0} y={0} morph={mv} />)
    expect(screen.getByTestId('quarter')).toHaveAttribute('data-morph-state', 'logo')
  })
  it('reads data-morph-state correctly from a MotionValue morph=0 (coin)', () => {
    const mv = motionValue(0)
    render(<Quarter scale={1} rotate={0} x={0} y={0} morph={mv} />)
    expect(screen.getByTestId('quarter')).toHaveAttribute('data-morph-state', 'coin')
  })
})
