import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Fun Payments — It only takes a quarter.';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new (ImageResponse as any)(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          padding: '72px 80px',
          backgroundColor: '#f4efe6',
          backgroundImage:
            'radial-gradient(circle at 0% 0%, rgba(205,145,73,0.26), transparent 32%), radial-gradient(circle at 95% 10%, rgba(84,104,73,0.22), transparent 28%), linear-gradient(180deg, #fbf7ef 0%, #f2eadc 58%, #efe4d3 100%)',
          color: '#1f241d',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: 18,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: '#6b7c60',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #c8a96e 0%, #a07840 100%)',
              color: '#1f241d',
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            25¢
          </div>
          Hedge Payments
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 56,
            fontSize: 80,
            lineHeight: 1.02,
            letterSpacing: -2.5,
            color: '#1f241d',
            maxWidth: '95%',
          }}
        >
          Fun Payments.
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 32,
            fontSize: 36,
            lineHeight: 1.4,
            color: '#5d6259',
            maxWidth: '88%',
          }}
        >
          It only takes a quarter.
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 'auto',
            gap: 32,
            fontSize: 20,
            color: '#394734',
            letterSpacing: 1,
          }}
        >
          <div style={{ display: 'flex' }}>25¢ to start</div>
          <div style={{ display: 'flex', color: '#bf6b42' }}>·</div>
          <div style={{ display: 'flex' }}>Real venues</div>
          <div style={{ display: 'flex', color: '#bf6b42' }}>·</div>
          <div style={{ display: 'flex' }}>Powered by Hedge Payments</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
