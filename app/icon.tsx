import { ImageResponse } from 'next/server';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        {/* Single Washington coin with poker chip styling */}
        <div style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          backgroundColor: '#132A45',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '1px solid #1e3c5a',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Inner circle */}
          <div style={{
            width: '82%',
            height: '82%',
            borderRadius: '50%',
            backgroundColor: '#132A45',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid #1e3c5a',
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
                height: '18%',
                backgroundColor: i % 6 === 0 ? '#4AB3FF' : i % 3 === 0 ? '#FF6B4A' : 'transparent',
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
              }}></div>
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
} 