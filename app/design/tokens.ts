/** Old-Vegas palette — single source of truth for the Hedge brand colors. */
export const palette = {
  cream: '#fbf3db',
  ink: '#1b1c22',
  red: '#fa1007',
  cyan: '#05abd0',
  orange: '#f99a0b',
  sky: '#b1edf9',
} as const

/** Liquid-glass surface defaults. */
export const glass = {
  radius: '22px',
  blur: '14px',
  saturate: '180%',
} as const

/** Shared motion timings (seconds). */
export const motion = {
  fast: 0.16,
  base: 0.32,
} as const
