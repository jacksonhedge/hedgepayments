import { ImageResponse } from 'next/server';

export const runtime = 'edge';

export const alt = 'SideBet - Join the Waitlist for Your Favorite Sportsbooks';
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
        
        {/* SideBet Icon - Use actual image URL */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 30,
            width: 300,
            height: 300,
            position: 'relative',
          }}
        >
          <img
            src="https://raw.githubusercontent.com/jacksonhedge/hedgepayments/main/public/images/social/sidebet-og.png"
            width={300}
            height={300}
            alt="SideBet logo"
            style={{
              objectFit: 'contain',
            }}
          />
        </div>
        
        {/* Title */}
        <div
          style={{
            fontSize: 60,
            fontWeight: 'bold',
            color: '#132A45',
            marginBottom: 20,
            textAlign: 'center',
          }}
        >
          SideBet
        </div>
        
        {/* Main CTA */}
        <div
          style={{
            fontSize: 36,
            fontWeight: 'bold',
            maxWidth: '80%',
            textAlign: 'center',
            marginBottom: 20,
            background: 'linear-gradient(90deg, #0070f3, #00d1d1)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            padding: '10px 20px',
          }}
        >
          Join the Waitlist for Your Favorite Sportsbooks
        </div>
        
        {/* Description */}
        <div
          style={{
            fontSize: 24,
            color: '#444',
            maxWidth: '80%',
            textAlign: 'center',
            marginBottom: 30,
          }}
        >
          Turn spare change into winnings! Automatically round up your purchases and place bets on DraftKings, FanDuel, and more.
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
} 