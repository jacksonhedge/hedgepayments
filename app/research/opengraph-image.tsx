import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Get Paid to Beta Test Apps and Features — Hedge Research'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new (ImageResponse as any)(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          padding: '72px 80px',
          backgroundColor: '#fff3e6',
          backgroundImage:
            'radial-gradient(circle at 50% -20%, rgba(255,170,80,0.55), transparent 60%), linear-gradient(180deg, #fff7ee 0%, #ffedd9 100%)',
          color: '#1c1208',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 22, letterSpacing: 5, textTransform: 'uppercase', color: '#a35c22' }}>
          <div style={{ width: 16, height: 16, borderRadius: 999, backgroundColor: '#f0621a', display: 'flex' }} />
          Hedge Research
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, maxWidth: 980 }}>
            Get Paid to Beta Test Apps and Features
          </div>
          <div style={{ display: 'flex', fontSize: 28, color: '#7a5a3c', maxWidth: 900 }}>
            Real-money tests on DraftKings, FanDuel, Polymarket, Kalshi and more. Every test pays — and you keep your winnings.
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            {['Sportsbooks', 'Prediction markets', 'Casino', 'Payments'].map((t) => (
              <div key={t} style={{ display: 'flex', fontSize: 20, padding: '10px 20px', borderRadius: 999, border: '2px solid rgba(240,98,26,0.45)', color: '#a35c22' }}>
                {t}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', fontSize: 24, fontWeight: 700, color: '#f0621a' }}>hedgepayments.com/research</div>
        </div>
      </div>
    ),
    size,
  )
}
