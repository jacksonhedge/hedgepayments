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
        
        {/* SB Logo - Two Coins */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 40,
          }}
        >
          {/* First coin - Washington profile */}
          <div style={{
            width: 300,
            height: 300,
            borderRadius: '50%',
            backgroundColor: '#132A45',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '10px solid #213E65',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            marginRight: -40,
            position: 'relative',
            zIndex: 1,
          }}>
            <div style={{
              width: '80%',
              height: '80%',
              borderRadius: '50%',
              backgroundColor: '#132A45',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '2px solid #213E65',
            }}>
              {/* Simplified profile silhouette in light color */}
              <div style={{
                width: '70%',
                height: '75%',
                borderRadius: '40% 40% 40% 40% / 50% 50% 50% 50%',
                backgroundColor: 'rgba(200, 215, 230, 0.85)',
                transform: 'rotate(-15deg)',
                position: 'relative',
              }}></div>
            </div>
          </div>
          
          {/* Second coin - SB chip */}
          <div style={{
            width: 300,
            height: 300,
            borderRadius: '50%',
            backgroundColor: '#132A45',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '10px solid #213E65',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            position: 'relative',
          }}>
            <div style={{
              width: '80%',
              height: '80%',
              borderRadius: '50%',
              backgroundColor: '#132A45',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              border: '2px solid #213E65',
            }}>
              {/* SB Text */}
              <div style={{
                fontSize: 120,
                fontWeight: 'bold',
                color: 'white',
                textAlign: 'center',
                letterSpacing: '-2px',
              }}>
                SB
              </div>
              
              {/* Colored segments */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                <div key={i} style={{
                  position: 'absolute',
                  width: '30%',
                  height: '6%',
                  backgroundColor: i % 3 === 0 ? '#4AB3FF' : i % 3 === 1 ? '#FF6B4A' : 'transparent',
                  transformOrigin: 'center right',
                  transform: `rotate(${deg}deg)`,
                  right: '10%',
                  top: '47%',
                  borderRadius: '2px',
                }}></div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Tagline */}
        <div
          style={{
            fontSize: 40,
            fontWeight: 'bold',
            color: '#132A45',
            marginBottom: 20,
            textAlign: 'center',
            marginTop: 30,
          }}
        >
          Turn Spare Change Into Winnings
        </div>
        
        {/* Description */}
        <div
          style={{
            fontSize: 28,
            color: '#444',
            maxWidth: '80%',
            textAlign: 'center',
            marginBottom: 30,
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