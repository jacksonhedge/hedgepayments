'use client'

import { useEffect, useRef, useState, createElement } from 'react'

type Mode = 'flip-to-free' | 'win-it-back'
type Theme = 'light' | 'dark'
type LogEntry = { t: string; name: string; detail: string }

const AMOUNTS = [24, 48, 85, 140]

export default function ChanceEmbedDemo() {
  const [amount, setAmount] = useState(85)
  const [mode, setMode] = useState<Mode>('flip-to-free')
  const [theme, setTheme] = useState<Theme>('light')
  const [log, setLog] = useState<LogEntry[]>([])
  const hostRef = useRef<HTMLDivElement>(null)

  // Load the embed exactly as a merchant would — a single <script src> — but in a
  // way that survives client-side navigation (inject once if not already present).
  useEffect(() => {
    if (customElements.get('chance-checkout')) return
    if (document.querySelector('script[data-chance-embed]')) return
    const s = document.createElement('script')
    s.src = '/embed/chance.js'
    s.async = true
    s.setAttribute('data-chance-embed', '')
    document.body.appendChild(s)
  }, [])

  // Wire Chance events from whichever <chance-checkout> is mounted.
  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const push = (name: string) => (e: Event) => {
      const d = (e as CustomEvent).detail
      setLog((l) =>
        [
          { t: new Date().toLocaleTimeString(), name, detail: JSON.stringify(d, (k, v) => (k === 'offer' ? `${v.question}` : v)) },
          ...l,
        ].slice(0, 8),
      )
    }
    const handlers: [string, EventListener][] = [
      ['chance:applied', push('chance:applied')],
      ['chance:result', push('chance:result')],
      ['chance:declined', push('chance:declined')],
    ]
    handlers.forEach(([n, h]) => host.addEventListener(n, h))
    return () => handlers.forEach(([n, h]) => host.removeEventListener(n, h))
  }, [])

  const snippet = `<script src="https://hedgepayments.com/embed/chance.js" async></script>
<chance-checkout amount="${amount}"${mode === 'flip-to-free' ? '' : `\n                mode="${mode}"`}${theme === 'light' ? '' : `\n                theme="${theme}"`}></chance-checkout>`

  return (
    <div style={S.page}>
      <header style={S.topbar}>
        <div style={S.brand}>
          <span style={S.brandDot}>N</span> NORTHWIND&nbsp;GOODS
        </div>
        <span style={S.poweredPill}>
          checkout powered by <b style={{ color: '#0e9f6e' }}>✦ Chance</b> by Hedge
        </span>
      </header>

      <div style={S.grid}>
        {/* ---- the "merchant checkout" ---- */}
        <div style={S.checkout}>
          <h2 style={S.h2}>Checkout</h2>

          <div style={S.lineItem}>
            <div style={S.thumb}>🧶</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700 }}>Hand-thrown Stoneware Mug</div>
              <div style={S.muted}>Qty 1 · Free shipping</div>
            </div>
            <div style={{ fontWeight: 800 }}>${amount}.00</div>
          </div>

          <div style={S.sumLine}>
            <span style={S.muted}>Subtotal</span>
            <span>${amount}.00</span>
          </div>
          <div style={S.sumLine}>
            <span style={S.muted}>Shipping</span>
            <span>Free</span>
          </div>
          <div style={S.total}>
            <span>Total</span>
            <span>${amount}.00 USD</span>
          </div>

          <div style={S.payLabel}>Payment</div>
          <button style={S.payBtn}>💳 Pay ${amount}.00 with card</button>

          <div style={S.orDivider}><span>or take a shot</span></div>

          {/* THE DROP-IN — these are the two lines a merchant pastes */}
          <div ref={hostRef}>
            {createElement('chance-checkout', {
              key: `${amount}-${mode}-${theme}`,
              amount: String(amount),
              currency: 'USD',
              mode,
              theme,
            })}
          </div>

          <p style={S.fineprint}>
            Chance is optional and routes your stake to a real market — Hedge isn’t the house. Settlement is
            simulated in this demo.
          </p>
        </div>

        {/* ---- the "integration" panel (not part of the merchant's page) ---- */}
        <aside style={S.panel}>
          <div style={S.panelTag}>DROP-IN DEMO · not shown to shoppers</div>
          <h3 style={S.panelH}>Two lines into any checkout</h3>

          <div style={S.field}>
            <label style={S.label}>Mode</label>
            <div style={S.seg}>
              {(['flip-to-free', 'win-it-back'] as Mode[]).map((m) => (
                <button key={m} onClick={() => setMode(m)} style={mode === m ? S.segOn : S.segOff}>
                  {m === 'flip-to-free' ? 'Flip to free' : 'Win it back'}
                </button>
              ))}
            </div>
            <p style={S.hint}>
              {mode === 'flip-to-free'
                ? 'Shopper pays a small premium for a shot at $0. Shopper-funded.'
                : 'Shopper buys normally; the house fronts the stake. Zero shopper downside.'}
            </p>
          </div>

          <div style={S.field}>
            <label style={S.label}>Theme</label>
            <div style={S.seg}>
              {(['light', 'dark'] as Theme[]).map((t) => (
                <button key={t} onClick={() => setTheme(t)} style={theme === t ? S.segOn : S.segOff}>
                  {t[0].toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div style={S.field}>
            <label style={S.label}>Order amount</label>
            <div style={S.seg}>
              {AMOUNTS.map((a) => (
                <button key={a} onClick={() => setAmount(a)} style={amount === a ? S.segOn : S.segOff}>
                  ${a}
                </button>
              ))}
            </div>
          </div>

          <div style={S.field}>
            <label style={S.label}>The snippet</label>
            <pre style={S.code}>{snippet}</pre>
          </div>

          <div style={S.field}>
            <label style={S.label}>Live events</label>
            <div style={S.logBox}>
              {log.length === 0 ? (
                <div style={S.muted}>Open Chance and place a bet — events stream here.</div>
              ) : (
                log.map((e, i) => (
                  <div key={i} style={S.logRow}>
                    <span style={S.logName}>{e.name}</span>
                    <code style={S.logDetail}>{e.detail}</code>
                    <span style={S.logTime}>{e.t}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

const S: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#0f1014', color: '#e8e9ee', fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif', padding: '0 0 80px' },
  topbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 28px', borderBottom: '1px solid #21232b', position: 'sticky', top: 0, background: '#0f1014', zIndex: 5 },
  brand: { display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800, letterSpacing: '0.04em', fontSize: 16 },
  brandDot: { width: 26, height: 26, borderRadius: 8, background: 'linear-gradient(135deg,#0e9f6e,#14b8a6)', color: '#04130d', display: 'grid', placeItems: 'center', fontWeight: 900 },
  poweredPill: { fontSize: 12, color: '#9aa0aa' },
  grid: { maxWidth: 1080, margin: '0 auto', padding: '36px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36, alignItems: 'start' },
  checkout: { background: '#fff', color: '#1a1a1f', borderRadius: 18, padding: 26, boxShadow: '0 20px 60px rgba(0,0,0,.4)' },
  h2: { fontSize: 20, fontWeight: 800, margin: '0 0 18px' },
  lineItem: { display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 16, borderBottom: '1px solid #eceef1' },
  thumb: { width: 52, height: 52, borderRadius: 12, background: 'linear-gradient(135deg,#fff1f2,#ffe4e6)', display: 'grid', placeItems: 'center', fontSize: 26, flex: 'none' },
  muted: { color: '#6b7280', fontSize: 13 },
  sumLine: { display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '8px 0' },
  total: { display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 800, padding: '10px 0', borderTop: '1px solid #eceef1', marginTop: 4 },
  payLabel: { fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6b7280', margin: '18px 0 10px' },
  payBtn: { width: '100%', padding: 14, border: 'none', borderRadius: 11, background: '#1a1a1f', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer' },
  orDivider: { display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0', color: '#9aa0aa', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' },
  fineprint: { color: '#9aa0aa', fontSize: 11.5, marginTop: 14, lineHeight: 1.5 },
  panel: { background: '#15171d', border: '1px solid #21232b', borderRadius: 18, padding: 24, position: 'sticky', top: 96 },
  panelTag: { fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: '#6b7280', marginBottom: 8 },
  panelH: { fontSize: 18, fontWeight: 800, margin: '0 0 20px' },
  field: { marginBottom: 18 },
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#9aa0aa', marginBottom: 8 },
  seg: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  segOn: { padding: '8px 14px', borderRadius: 9, border: '1px solid #0e9f6e', background: 'rgba(14,159,110,.16)', color: '#5ee0ad', fontWeight: 700, fontSize: 13, cursor: 'pointer' },
  segOff: { padding: '8px 14px', borderRadius: 9, border: '1px solid #2a2c33', background: 'transparent', color: '#c3c6cf', fontWeight: 600, fontSize: 13, cursor: 'pointer' },
  hint: { fontSize: 12, color: '#9aa0aa', marginTop: 8, lineHeight: 1.45 },
  code: { background: '#0c0d11', border: '1px solid #21232b', borderRadius: 10, padding: 14, fontSize: 12, lineHeight: 1.55, color: '#9fe7c7', overflowX: 'auto', whiteSpace: 'pre', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' },
  logBox: { background: '#0c0d11', border: '1px solid #21232b', borderRadius: 10, padding: 12, minHeight: 90, maxHeight: 200, overflowY: 'auto', fontSize: 12 },
  logRow: { display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 8, alignItems: 'center', padding: '5px 0', borderBottom: '1px solid #181a20' },
  logName: { color: '#5ee0ad', fontWeight: 700, fontFamily: 'ui-monospace, monospace', fontSize: 11 },
  logDetail: { color: '#9aa0aa', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  logTime: { color: '#5a5e68', fontSize: 10 },
}
