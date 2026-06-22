'use client'

/**
 * SVG filter that powers the "liquid glass" refraction. Applied via
 * `backdrop-filter: ... url(#liquid-glass)` so the glass panels bend the
 * coin/background behind them (feTurbulence -> feDisplacementMap), like the
 * iOS-26 / Jesse Vermeulen reference. Rendered once at the app root.
 */
export default function GlassDefs() {
  return (
    <svg aria-hidden width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }}>
      <defs>
        <filter id="liquid-glass" x="-35%" y="-35%" width="170%" height="170%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.005 0.008" numOctaves="2" seed="17" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="2.5" result="softNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softNoise"
            scale="14"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  )
}
