import s from './research.module.css'
import { TESTIMONIALS, ILLUSTRATIVE } from './testimonials'

// Infinite horizontal marquee of tester reviews. CSS-only animation; the track
// is duplicated so the loop is seamless. Pauses on hover, static when the user
// prefers reduced motion. Renders nothing until testimonials.ts has entries.
export function ReviewTicker() {
  if (TESTIMONIALS.length === 0) return null
  const items = [...TESTIMONIALS, ...TESTIMONIALS]

  return (
    <section className={s.ticker} aria-label="Tester notes">
      <div className={s.tickerLabel}>
        {ILLUSTRATIVE ? 'Sample tester notes · illustrative' : 'What testers report'}
      </div>
      <div className={s.tickerTrack} style={{ animationDuration: `${TESTIMONIALS.length * 6}s` }}>
        {items.map((t, i) => (
          <figure key={`${t.name}-${i}`} className={s.review} aria-hidden={i >= TESTIMONIALS.length}>
            <div className={s.reviewHead}>
              {t.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.avatar} alt="" className={s.avatar} />
              ) : (
                <span className={s.avatar}>{initials(t.name)}</span>
              )}
              <div>
                <div className={s.reviewName}>{t.name}</div>
                <div className={s.reviewMeta}>
                  {t.segment} · tested {t.app}
                </div>
              </div>
            </div>
            <blockquote className={s.reviewQuote}>“{t.quote}”</blockquote>
          </figure>
        ))}
      </div>
    </section>
  )
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
