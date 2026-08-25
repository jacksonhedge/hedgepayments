import data from './map-data.json'
import s from '../rollcard.module.css'

const CORE = new Set(['42', '34', '39', '26', '17', '18'])
const LABEL_ABOVE = new Set(['Northern NJ', 'Buffalo', 'Milwaukee', 'Detroit', 'Cleveland'])

export function FootprintMap() {
  return (
    <figure className={s.mapWrap}>
      <svg viewBox={`0 0 ${data.W} ${data.H}`} className={s.map} role="img" aria-label="Street Corner Casino footprint: Philadelphia, Northern New Jersey, Pittsburgh, Detroit, Chicago, Cleveland, Cincinnati and more">
        <g>
          {data.states.map((st) => (
            <path key={st.id} d={st.d} className={CORE.has(st.id) ? s.mapStateCore : s.mapState} />
          ))}
        </g>
        <g>
          {data.cities.map((c) => (
            <g key={c.n} transform={`translate(${c.x} ${c.y})`}>
              <circle r="14" className={s.mapPulse} />
              <circle r="5" className={s.mapDot} />
              <text y={LABEL_ABOVE.has(c.n) ? -12 : 22} className={s.mapLabel} textAnchor="middle">{c.n}</text>
            </g>
          ))}
        </g>
      </svg>
      <figcaption className={s.mapCaption}>
        <span className={s.sccEyebrow}>Where we shoot</span>
        Philly · Northern NJ · Pittsburgh · Detroit · Chicago · Cleveland · Cincinnati · Columbus · Indy · Buffalo · Milwaukee · Baltimore
      </figcaption>
    </figure>
  )
}
