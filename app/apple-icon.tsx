import { ImageResponse } from 'next/server';

export const runtime = 'edge';

export const size = {
  width: 180,
  height: 180,
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
          backgroundColor: '#DEFFE6', // Light mint background for apple icon
          borderRadius: '22%', // Slightly rounded corners
        }}
      >
        {/* First coin - Washington profile */}
        <div style={{
          width: 110,
          height: 110,
          borderRadius: '50%',
          backgroundColor: '#132A45',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '3px solid #213E65',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          marginRight: -30,
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
            border: '1px solid #213E65',
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
          width: 110,
          height: 110,
          borderRadius: '50%',
          backgroundColor: '#132A45',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '3px solid #213E65',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
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
            border: '1px solid #213E65',
          }}>
            {/* SB Text */}
            <div style={{
              fontSize: 46,
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
            }}>
              SB
            </div>
            
            {/* Colored segments */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
              <div key={i} style={{
                position: 'absolute',
                width: '30%',
                height: '8%',
                backgroundColor: i % 3 === 0 ? '#4AB3FF' : i % 3 === 1 ? '#FF6B4A' : 'transparent',
                transformOrigin: 'center right',
                transform: `rotate(${deg}deg)`,
                right: '10%',
                top: '46%',
                borderRadius: '1px',
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