import { render, screen } from '@testing-library/react'
import ChipAndAChair from '../ChipAndAChair'

describe('ChipAndAChair', () => {
  it('renders the hero headline and sub server-side', () => {
    render(<ChipAndAChair />)
    expect(screen.getByText(/A Chip and a Chair/i)).toBeInTheDocument()
    expect(screen.getByText(/It only takes a quarter/i)).toBeInTheDocument()
  })
  it('renders a skip link to the claim beat', () => {
    render(<ChipAndAChair />)
    const skip = screen.getByRole('link', { name: /skip to free quarter/i })
    expect(skip).toHaveAttribute('href', '#claim')
  })
  it('renders all beat copy server-side for SEO', () => {
    render(<ChipAndAChair />)
    expect(screen.getByText(/DEPOSIT QUARTER/i)).toBeInTheDocument()
    expect(screen.getByText(/how far a quarter can go/i)).toBeInTheDocument()
    expect(screen.getByText(/Take your free quarter/i)).toBeInTheDocument()
  })
})
