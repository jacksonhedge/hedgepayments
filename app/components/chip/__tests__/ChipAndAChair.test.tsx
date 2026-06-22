import { render, screen } from '@testing-library/react'
import ChipAndAChair from '../ChipAndAChair'

describe('ChipAndAChair (stub)', () => {
  it('renders the hero headline server-side text', () => {
    render(<ChipAndAChair />)
    expect(screen.getByText(/A Chip and a Chair/i)).toBeInTheDocument()
  })
})
