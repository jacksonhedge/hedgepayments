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
        
        {/* Main coin */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 40,
          }}
        >
          {/* Single Washington coin with poker chip styling */}
          <div style={{
            width: 300,
            height: 300,
            borderRadius: '50%',
            backgroundColor: '#132A45',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '6px solid #1e3c5a',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Inner circle */}
            <div style={{
              width: '85%',
              height: '85%',
              borderRadius: '50%',
              backgroundColor: '#132A45',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '3px solid #1e3c5a',
              position: 'relative',
              zIndex: 2,
            }}>
              {/* Washington profile silhouette */}
              <div style={{
                width: '80%',
                height: '80%',
                position: 'absolute',
                backgroundColor: 'rgba(220, 225, 235, 0.9)',
                maskImage: 'radial-gradient(circle, transparent 0%, black 50%)',
                WebkitMaskImage: 'radial-gradient(circle, transparent 0%, black 50%)',
                clipPath: 'polygon(30% 10%, 65% 10%, 75% 20%, 80% 30%, 75% 40%, 80% 50%, 70% 70%, 60% 80%, 40% 85%, 20% 70%, 25% 40%, 20% 25%)',
              }}></div>
            </div>
            
            {/* Colored segments */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
              <div key={i} style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: 'transparent',
                transform: `rotate(${deg}deg)`,
                zIndex: 1,
              }}>
                <div style={{
                  position: 'absolute',
                  top: '0%',
                  right: '50%',
                  width: '50%',
                  height: '15%',
                  backgroundColor: i % 6 === 0 ? '#4AB3FF' : i % 3 === 0 ? '#FF6B4A' : 'transparent',
                  clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                }}></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Tagline */}
        <div
          style={{
            fontSize: 60,
            fontWeight: 'bold',
            color: '#132A45',
            marginBottom: 20,
            textAlign: 'center',
            marginTop: 30,
          }}
        >
          SideBet
        </div>
        
        {/* Description */}
        <div
          style={{
            fontSize: 36,
            fontWeight: 'bold',
            color: '#132A45',
            maxWidth: '80%',
            textAlign: 'center',
            marginBottom: 20,
          }}
        >
          Turn Spare Change Into Winnings
        </div>
        
        {/* Subtitle */}
        <div
          style={{
            fontSize: 24,
            color: '#444',
            maxWidth: '80%',
            textAlign: 'center',
          }}
        >
          Swipe your card, and in moments, see if your round-ups won you money on your favorite sportsbooks.
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
} 