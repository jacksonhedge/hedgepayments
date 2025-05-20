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
        {/* First coin - Washington profile */}
        <div style={{
          width: 26,
          height: 26,
          borderRadius: '50%',
          backgroundColor: '#132A45',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '1px solid #213E65',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
          marginRight: -10,
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
          }}>
            {/* Simplified profile silhouette */}
            <div style={{
              width: '70%',
              height: '75%',
              borderRadius: '40% 40% 40% 40% / 50% 50% 50% 50%',
              backgroundColor: 'rgba(200, 215, 230, 0.85)',
              transform: 'rotate(-15deg)',
            }}></div>
          </div>
        </div>
        
        {/* Second coin - SB chip */}
        <div style={{
          width: 26,
          height: 26,
          borderRadius: '50%',
          backgroundColor: '#132A45',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '1px solid #213E65',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
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
          }}>
            {/* SB Text */}
            <div style={{
              fontSize: 14,
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              marginTop: -1,
            }}>
              SB
            </div>
            
            {/* Colored segments - simplified for small size */}
            {[0, 90, 180, 270].map((deg, i) => (
              <div key={i} style={{
                position: 'absolute',
                width: '30%',
                height: '10%',
                backgroundColor: i % 2 === 0 ? '#4AB3FF' : '#FF6B4A',
                transformOrigin: 'center right',
                transform: `rotate(${deg}deg)`,
                right: '10%',
                top: '45%',
              }}></div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
} 