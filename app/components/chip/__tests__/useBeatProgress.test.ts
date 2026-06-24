import { beatProgress } from '../useBeatProgress'

describe('beatProgress', () => {
  const COUNT = 7
  it('is 0 before the beat starts', () => {
    expect(beatProgress(0, 3, COUNT)).toBe(0)
  })
  it('is 1 after the beat ends', () => {
    expect(beatProgress(1, 0, COUNT)).toBe(1)
  })
  it('is 0.5 at the midpoint of a beat slice', () => {
    // beat 0 slice is [0, 1/7]; midpoint = 1/14
    expect(beatProgress(1 / 14, 0, COUNT)).toBeCloseTo(0.5, 5)
  })
  it('clamps below 0 and above 1', () => {
    expect(beatProgress(-0.2, 2, COUNT)).toBe(0)
    expect(beatProgress(2, 2, COUNT)).toBe(1)
  })
  it('maps the start of beat index to 0', () => {
    expect(beatProgress(2 / COUNT, 2, COUNT)).toBeCloseTo(0, 5)
  })
})
