import { ImageResponse } from 'next/server';

export const runtime = 'edge';

export const alt = 'SideBet - Turn Spare Change Into Winnings';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: '#DEFFE6', // Light mint background
          position: 'relative',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'radial-gradient(circle, #0070f330 2px, transparent 2px)',
            backgroundSize: '30px 30px',
            opacity: 0.2,
          }}
        />
        
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 40,
          }}
        >
          <img
            src="https://raw.githubusercontent.com/jacksonhedge/hedgepayments/main/public/favicon/sidebet-icon.svg"
            width={100}
            height={100}
            alt="SideBet Logo"
            style={{ marginRight: 24 }}
          />
          <div
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              color: '#0070f3',
            }}
          >
            SideBet
          </div>
        </div>
        
        {/* Tagline */}
        <div
          style={{
            fontSize: 36,
            fontWeight: 'bold',
            color: '#111',
            marginBottom: 20,
            textAlign: 'center',
          }}
        >
          Turn Spare Change Into Winnings
        </div>
        
        {/* Description */}
        <div
          style={{
            fontSize: 24,
            color: '#555',
            maxWidth: '80%',
            textAlign: 'center',
          }}
        >
          Swipe your card, and in moments, see if your round-ups won you money on your favorite online casinos.
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
} 