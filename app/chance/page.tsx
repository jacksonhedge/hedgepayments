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

  // Load the embed exactly as a merchant would — a single <script src>.
  useEffect(() => {
    if (customElements.get('chance-checkout')) return
    if (document.querySelector('script[data-chance-embed]')) return
    const s = document.createElement('script')
    s.src = '/embed/chance.js'
    s.async = true
    s.setAttribute('data-chance-embed', '')
    document.body.appendChild(s)
  }, [])

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
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div style={S.grid} aria-hidden />
      <div style={S.glow} aria-hidden />

      <header style={S.topbar}>
        <div style={S.brand}>
          <span style={S.brandDot}>N</span>
          <span style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: 13 }}>NORTHWIND</span>
        </div>
        <span style={S.poweredPill}>
          <span className="coinMini" /> checkout powered by{' '}
          <b style={{ fontFamily: 'var(--font-script), cursive', color: '#b8ff3a', fontSize: '1.25em', margin: '0 2px' }}>Chance</b> by Hedge
        </span>
      </header>

      <div style={S.grid2}>
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

          <div style={S.sumLine}><span style={S.muted}>Subtotal</span><span>${amount}.00</span></div>
          <div style={S.sumLine}><span style={S.muted}>Shipping</span><span>Free</span></div>
          <div style={S.total}><span>Total</span><span>${amount}.00 USD</span></div>

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
            Chance is optional and routes your stake to a real market — Hedge isn’t the house. Markets are live from
            Polymarket; settlement is simulated in this demo.
          </p>
        </div>

        {/* ---- the arcade "control" panel ---- */}
        <aside style={S.panel}>
          <div className="coinWrap"><div className="coin3d" /></div>
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
                ? 'Shopper risks a little for a discount — up to a free order. Shopper-funded.'
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
                <button key={a} onClick={() => setAmount(a)} style={amount === a ? S.segOn : S.segOff}>${a}</button>
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

const CSS = `
  @keyframes coinSpin { 0% { transform: perspective(420px) rotateY(0deg); } 100% { transform: perspective(420px) rotateY(360deg); } }
  @keyframes coinBob  { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
  .coinWrap { display:grid; place-items:center; margin:2px 0 16px; animation: coinBob 3.4s ease-in-out infinite; }
  .coin3d {
    width:74px; height:74px; border-radius:50%; position:relative; transform-style:preserve-3d;
    background: radial-gradient(circle at 34% 28%, #fff3c4, #ffd23f 46%, #c8920c 78%, #8a5e00 100%);
    box-shadow: 0 10px 30px rgba(255,210,63,.45), inset 0 -8px 16px rgba(120,75,0,.6), inset 0 6px 12px rgba(255,255,255,.65);
    animation: coinSpin 3.2s linear infinite;
  }
  .coin3d::after { content:'✦'; position:absolute; inset:0; display:grid; place-items:center; color:#8a5a00; font-size:34px; font-weight:900; text-shadow:0 1px 0 rgba(255,255,255,.5); }
  .coinMini {
    display:inline-block; width:15px; height:15px; border-radius:50%; vertical-align:-2px; margin-right:5px;
    background: radial-gradient(circle at 34% 28%, #fff3c4, #ffd23f 50%, #b8860b 100%);
    box-shadow: 0 0 8px rgba(255,210,63,.6), inset 0 -2px 3px rgba(120,75,0,.6);
    animation: coinSpin 2.6s linear infinite;
  }
  @media (prefers-reduced-motion: reduce){ .coin3d,.coinMini,.coinWrap{ animation:none; } }
`

const S: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh', position: 'relative', overflow: 'hidden', color: '#eaf3ff',
    fontFamily: 'var(--font-sora), ui-sans-serif, system-ui, sans-serif', padding: '0 0 90px',
    background:
      'radial-gradient(120% 80% at 50% -10%, rgba(255,43,214,0.18), transparent 60%),' +
      'radial-gradient(100% 70% at 88% 8%, rgba(0,234,255,0.16), transparent 55%),' +
      'radial-gradient(90% 120% at 6% 10%, rgba(184,255,58,0.12), transparent 55%),' +
      'radial-gradient(140% 120% at 50% 120%, rgba(184,255,58,0.07), transparent 55%),' +
      'radial-gradient(130% 120% at 50% 0%, #1a1336, #0b0820 55%, #07060e)',
  },
  grid: {
    position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.5,
    backgroundImage:
      'linear-gradient(rgba(0,234,255,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(0,234,255,0.10) 1px, transparent 1px)',
    backgroundSize: '46px 46px',
    maskImage: 'radial-gradient(120% 90% at 50% 0%, #000 30%, transparent 78%)',
    WebkitMaskImage: 'radial-gradient(120% 90% at 50% 0%, #000 30%, transparent 78%)',
  },
  glow: { position: 'absolute', top: '-10%', left: '50%', width: 520, height: 520, transform: 'translateX(-50%)', pointerEvents: 'none', background: 'radial-gradient(circle, rgba(255,43,214,0.20), transparent 65%)', filter: 'blur(20px)' },
  topbar: { position: 'sticky', top: 0, zIndex: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 28px', borderBottom: '1px solid rgba(0,234,255,0.16)', background: 'linear-gradient(180deg, rgba(11,8,32,0.92), rgba(11,8,32,0.55))', backdropFilter: 'blur(8px)' },
  brand: { display: 'flex', alignItems: 'center', gap: 11, fontWeight: 800, letterSpacing: '0.04em' },
  brandDot: { width: 28, height: 28, borderRadius: 9, background: 'linear-gradient(135deg,#b8ff3a,#2fe08a)', color: '#08130a', display: 'grid', placeItems: 'center', fontWeight: 900, boxShadow: '0 0 16px rgba(184,255,58,0.5)' },
  poweredPill: { fontSize: 12, color: '#aab6d6', display: 'flex', alignItems: 'center' },
  grid2: { position: 'relative', zIndex: 1, maxWidth: 1080, margin: '0 auto', padding: '40px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 34, alignItems: 'start' },
  checkout: { background: '#fff', color: '#1a1a1f', borderRadius: 20, padding: 26, boxShadow: '0 24px 70px rgba(0,0,0,.5), 0 0 0 1px rgba(0,234,255,0.25), 0 0 40px rgba(0,234,255,0.12)' },
  h2: { fontSize: 20, fontWeight: 800, margin: '0 0 18px', fontFamily: 'var(--font-anton), sans-serif', letterSpacing: '0.01em' },
  lineItem: { display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 16, borderBottom: '1px solid #eceef1' },
  thumb: { width: 52, height: 52, borderRadius: 12, background: 'linear-gradient(135deg,#fff1f2,#ffe4e6)', display: 'grid', placeItems: 'center', fontSize: 26, flex: 'none' },
  muted: { color: '#6b7280', fontSize: 13 },
  sumLine: { display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '8px 0' },
  total: { display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 800, padding: '10px 0', borderTop: '1px solid #eceef1', marginTop: 4 },
  payLabel: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7280', margin: '18px 0 10px', fontFamily: 'var(--font-pixel), monospace' },
  payBtn: { width: '100%', padding: 14, border: 'none', borderRadius: 11, background: '#1a1a1f', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer' },
  orDivider: { display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0', color: '#9aa0aa', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' },
  fineprint: { color: '#9aa0aa', fontSize: 11.5, marginTop: 14, lineHeight: 1.5 },
  panel: { background: 'linear-gradient(165deg, rgba(24,18,48,0.86), rgba(12,9,28,0.86))', border: '1px solid rgba(0,234,255,0.22)', borderRadius: 20, padding: '22px 24px 24px', position: 'sticky', top: 96, boxShadow: '0 0 0 1px rgba(255,43,214,0.06), 0 18px 50px rgba(0,0,0,.5)' },
  panelTag: { fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em', color: '#7d86b8', marginBottom: 8, textAlign: 'center', fontFamily: 'var(--font-pixel), monospace' },
  panelH: { fontSize: 22, fontWeight: 400, margin: '0 0 22px', textAlign: 'center', fontFamily: 'var(--font-anton), sans-serif', letterSpacing: '0.01em', color: '#eaf3ff' },
  field: { marginBottom: 18 },
  label: { display: 'block', fontSize: 10, fontWeight: 700, color: '#00eaff', marginBottom: 8, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-pixel), monospace' },
  seg: { display: 'flex', gap: 7, flexWrap: 'wrap' },
  segOn: { padding: '8px 14px', borderRadius: 10, border: '1px solid #b8ff3a', background: 'rgba(184,255,58,.14)', color: '#cdff84', fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: '0 0 14px rgba(184,255,58,0.3)' },
  segOff: { padding: '8px 14px', borderRadius: 10, border: '1px solid rgba(234,243,255,0.16)', background: 'transparent', color: '#aab6d6', fontWeight: 600, fontSize: 13, cursor: 'pointer' },
  hint: { fontSize: 12, color: '#8d97be', marginTop: 8, lineHeight: 1.45 },
  code: { background: 'rgba(4,3,12,0.7)', border: '1px solid rgba(0,234,255,0.18)', borderRadius: 11, padding: 14, fontSize: 12, lineHeight: 1.55, color: '#9fe7c7', overflowX: 'auto', whiteSpace: 'pre', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' },
  logBox: { background: 'rgba(4,3,12,0.7)', border: '1px solid rgba(0,234,255,0.18)', borderRadius: 11, padding: 12, minHeight: 90, maxHeight: 200, overflowY: 'auto', fontSize: 12 },
  logRow: { display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 8, alignItems: 'center', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' },
  logName: { color: '#b8ff3a', fontWeight: 700, fontFamily: 'ui-monospace, monospace', fontSize: 11 },
  logDetail: { color: '#8d97be', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  logTime: { color: '#5a5e78', fontSize: 10 },
}
