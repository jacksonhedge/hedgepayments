import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CountUp from './CountUp'

describe('CountUp', () => {
  it('renders the final formatted value (reduced-motion / no IO)', () => {
    render(<CountUp to={1200} prefix="$" />)
    expect(screen.getByText('$1,200')).toBeInTheDocument()
  })
  it('supports decimals and suffix', () => {
    render(<CountUp to={32.5} suffix="%" decimals={1} />)
    expect(screen.getByText('32.5%')).toBeInTheDocument()
  })
})
