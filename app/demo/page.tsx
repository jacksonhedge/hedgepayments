'use client';
import React, { useState } from 'react';

// Placeholder for NavBar component - we'll create this later
const NavBar = () => {
  return (
    <nav style={{ backgroundColor: '#333', color: 'white', padding: '1rem', textAlign: 'center' }}>
      <a href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem' }}>Sidebet Home</a>
    </nav>
  );
};

const partnerLogos = [
  { name: 'FanDuel', color: '#1E88E5', logoUrl: '/fanduel-logo.png' }, // Example: Blue
  { name: 'DraftKings', color: '#4CAF50', logoUrl: '/draftkings-logo.png' }, // Example: Green
  { name: 'Caesars', color: '#FFC107', logoUrl: '/caesars-logo.png' }, // Example: Amber
  { name: 'MGM', color: '#D32F2F', logoUrl: '/mgm-logo.png' },       // Example: Red
  { name: 'Fanatics', color: '#5E35B1', logoUrl: '/fanatics-logo.png' }, // Example: Deep Purple
];

const DemoPage = () => {
  const [screenColor, setScreenColor] = useState<string>('#FFFFFF'); // Default white

  const handleLogoClick = (color: string) => {
    setScreenColor(color);
  };

  return (
    <div style={{ backgroundColor: screenColor, minHeight: '100vh', transition: 'background-color 0.5s ease' }}>
      <NavBar />
      <main style={{ padding: '2rem', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '2rem' }}>
          Select a Partner to Change Theme
        </h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
          {partnerLogos.map((partner) => (
            <button
              key={partner.name}
              onClick={() => handleLogoClick(partner.color)}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '1rem',
                cursor: 'pointer',
                border: '2px solid #ccc',
                borderRadius: '8px',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = partner.color)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#ccc')}
            >
              {/* Assuming you will add actual <img> tags for logos later */}
              {/* For now, just text names */}
              {/* <img src={partner.logoUrl} alt={`${partner.name} Logo`} style={{ height: '30px', marginRight: '8px' }} /> */}
              {partner.name}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: '375px', // Typical phone width
            height: '667px', // Typical phone height
            backgroundColor: '#f0f0f0', // Light grey for the phone screen
            border: '16px solid black',
            borderRadius: '36px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            color: 'black'
          }}>
            <h2>Round-Up Settings</h2>
            <p>Configure your round-ups for each partner here.</p>
            {/* More detailed UI for round-up toggles will go here */}
            <div style={{ marginTop: '20px', width: '100%'}}>
                {partnerLogos.map(partner => (
                    <div key={partner.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #ddd'}}>
                        <span>{partner.name}</span>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            <input type="checkbox" style={{ marginRight: '8px', transform: 'scale(1.5)' }} />
                            <span>Enable</span>
                        </label>
                    </div>
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DemoPage; 