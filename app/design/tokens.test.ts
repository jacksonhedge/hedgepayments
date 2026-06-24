import { describe, it, expect } from 'vitest'
import { palette } from './tokens'

describe('palette tokens', () => {
  it('holds the exact Old-Vegas hex values', () => {
    expect(palette).toEqual({
      cream: '#fbf3db',
      ink: '#1b1c22',
      red: '#fa1007',
      cyan: '#05abd0',
      orange: '#f99a0b',
      sky: '#b1edf9',
    })
  })
})
