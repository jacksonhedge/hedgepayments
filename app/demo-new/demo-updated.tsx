'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// Settings slideshow configuration
const settingsSlideshow = [
  {
    title: "Welcome to Settings",
    description: "Configure your round-up preferences",
    icon: "⚙️",
    duration: 3000
  },
  {
    title: "Photo Gallery",
    description: "View your saved screenshots and demos",
    icon: "📸",
    duration: 3000
  },
  {
    title: "Round-Up Settings",
    description: "Customize how your round-ups work",
    icon: "💰",
    duration: 3000
  }
];

// Main component with all requested features
export default function DemoNewPage() {
  const [selectedPartner, setSelectedPartner] = useState<string>('fanduel');
  const [screenColor, setScreenColor] = useState<string>('#1E88E5');
  const [entryMode, setEntryMode] = useState<string>(`fanduel-balance`);
  const [isRoundUpEnabled, setIsRoundUpEnabled] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showSettingsSlideshow, setShowSettingsSlideshow] = useState<boolean>(false);
  const [currentSettingsSlide, setCurrentSettingsSlide] = useState<number>(0);
  const [multiplier, setMultiplier] = useState<string>("1X");
  
  // Purchase simulation states
  const [roundUpProgress, setRoundUpProgress] = useState<number>(0);
  const [walletBalance, setWalletBalance] = useState<number>(0.00);
  const [transactions, setTransactions] = useState<any[]>([]);
  
  // Partners configuration
  const partners = [
    { id: 'fanduel', name: 'FanDuel', color: '#1E88E5', logoPath: '/images/assets/fanduel-casino.jpg' },
    { id: 'draftkings', name: 'DraftKings', color: '#4CAF50', logoPath: '/images/assets/draftkings-casino 3.jpg' },
    { id: 'caesars', name: 'Caesars', color: '#FFC107', logoPath: '/images/assets/caesarsCasino 2.png' },
    { id: 'mgm', name: 'BetMGM', color: '#D32F2F', logoPath: '/images/assets/betmgm 2.png' },
    { id: 'fanatics', name: 'Fanatics', color: '#5E35B1', logoPath: '/images/assets/fanatics.png' },
  ];

  const merchants = [
    { name: 'Chipotle', minAmount: 10.00, maxAmount: 20.00 },
    { name: "Dick's Sporting Goods", minAmount: 5.00, maxAmount: 120.00 },
    { name: 'Starbucks', minAmount: 4.50, maxAmount: 15.00 },
    { name: 'Target', minAmount: 15.00, maxAmount: 150.00 },
  ];

  // Handle settings slideshow
  useEffect(() => {
    if (showSettingsSlideshow && currentSettingsSlide < settingsSlideshow.length) {
      const timer = setTimeout(() => {
        if (currentSettingsSlide === settingsSlideshow.length - 1) {
          // Slideshow finished, show round-up settings
          setShowSettingsSlideshow(false);
          setCurrentSettingsSlide(0);
        } else {
          setCurrentSettingsSlide(prev => prev + 1);
        }
      }, settingsSlideshow[currentSettingsSlide].duration);
      
      return () => clearTimeout(timer);
    }
  }, [showSettingsSlideshow, currentSettingsSlide]);

  const getSelectedPartner = () => partners.find(p => p.id === selectedPartner) || partners[0];

  const simulatePurchase = () => {
    if (!isRoundUpEnabled) return;
    
    const merchant = merchants[Math.floor(Math.random() * merchants.length)];
    const amount = merchant.minAmount + (Math.random() * (merchant.maxAmount - merchant.minAmount));
    const roundedAmount = Math.ceil(amount);
    const roundUpAmount = roundedAmount - amount;
    const multipliedAmount = roundUpAmount * parseFloat(multiplier.replace('X', ''));
    
    const newTransaction = {
      id: Date.now().toString(),
      merchant: merchant.name,
      amount: amount,
      roundUpAmount: roundUpAmount,
      multipliedAmount: multipliedAmount,
      date: new Date()
    };
    
    setTransactions([newTransaction, ...transactions]);
    setRoundUpProgress(prev => {
      const newProgress = prev + multipliedAmount;
      if (newProgress >= 5.00) {
        setWalletBalance(w => w + 5.00);
        return newProgress - 5.00;
      }
      return newProgress;
    });
  };

  return (
    <div style={{ 
      backgroundColor: screenColor, 
      minHeight: '100vh', 
      transition: 'background-color 0.5s ease',
      display: 'flex',
      padding: '40px',
      gap: '40px'
    }}>
      {/* Left Side - Phone Demo */}
      <div style={{ 
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <h1 style={{ 
          color: 'white', 
          fontSize: '32px', 
          fontWeight: 'bold',
          marginBottom: '30px'
        }}>
          SideBet Interactive Demo
        </h1>
        
        {/* Phone Mockup */}
        <div style={{
          width: '375px',
          height: '812px',
          backgroundColor: '#e0f2e9',
          border: '12px solid black',
          borderRadius: '48px',
          boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Notch */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '150px',
            height: '30px',
            backgroundColor: 'black',
            borderBottomLeftRadius: '14px',
            borderBottomRightRadius: '14px',
            zIndex: 10
          }} />
          
          {/* Phone Content */}
          <div style={{ 
            height: '100%', 
            padding: '40px 20px 20px',
            overflow: 'auto'
          }}>
            {showSettings ? (
              showSettingsSlideshow ? (
                /* Settings Slideshow */
                <div style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '80px',
                    marginBottom: '30px'
                  }}>
                    {settingsSlideshow[currentSettingsSlide].icon}
                  </div>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '15px'
                  }}>
                    {settingsSlideshow[currentSettingsSlide].title}
                  </h2>
                  <p style={{
                    fontSize: '16px',
                    color: '#666'
                  }}>
                    {settingsSlideshow[currentSettingsSlide].description}
                  </p>
                  
                  {/* Progress dots */}
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginTop: '40px'
                  }}>
                    {settingsSlideshow.map((_, index) => (
                      <div
                        key={index}
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: index === currentSettingsSlide ? screenColor : '#ddd'
                        }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                /* Round-Up Settings (after slideshow) */
                <div style={{ padding: '20px' }}>
                  <button
                    onClick={() => setShowSettings(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '24px',
                      cursor: 'pointer',
                      marginBottom: '20px'
                    }}
                  >
                    ← Back
                  </button>
                  
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '30px'
                  }}>
                    Round-Up Settings
                  </h2>
                  
                  {/* Round-up toggle */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '12px',
                    marginBottom: '20px'
                  }}>
                    <span style={{ fontSize: '18px', fontWeight: '500' }}>
                      Enable Round-Ups
                    </span>
                    <label style={{ 
                      position: 'relative',
                      display: 'inline-block',
                      width: '60px',
                      height: '34px'
                    }}>
                      <input
                        type="checkbox"
                        checked={isRoundUpEnabled}
                        onChange={(e) => setIsRoundUpEnabled(e.target.checked)}
                        style={{ display: 'none' }}
                      />
                      <span style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: isRoundUpEnabled ? screenColor : '#ccc',
                        transition: '.4s',
                        borderRadius: '34px'
                      }}>
                        <span style={{
                          position: 'absolute',
                          content: '',
                          height: '26px',
                          width: '26px',
                          left: isRoundUpEnabled ? '30px' : '4px',
                          bottom: '4px',
                          backgroundColor: 'white',
                          transition: '.4s',
                          borderRadius: '50%'
                        }} />
                      </span>
                    </label>
                  </div>
                  
                  {/* Entry mode selection */}
                  <div style={{
                    padding: '20px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '12px',
                    marginBottom: '20px'
                  }}>
                    <h3 style={{ marginBottom: '15px' }}>Entry Mode</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                          type="radio"
                          checked={entryMode.includes('-balance')}
                          onChange={() => setEntryMode(`${selectedPartner}-balance`)}
                        />
                        <span>Balance Mode</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                          type="radio"
                          checked={entryMode.includes('-jackpot')}
                          onChange={() => setEntryMode(`${selectedPartner}-jackpot`)}
                        />
                        <span>Jackpot Mode 🎰</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Multiplier selection */}
                  <div style={{
                    padding: '20px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '12px'
                  }}>
                    <h3 style={{ marginBottom: '15px' }}>Multiplier</h3>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {['1X', '2X', '5X', '10X'].map(mult => (
                        <button
                          key={mult}
                          onClick={() => setMultiplier(mult)}
                          style={{
                            padding: '10px 20px',
                            backgroundColor: multiplier === mult ? screenColor : 'white',
                            color: multiplier === mult ? 'white' : 'black',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                          }}
                        >
                          {mult}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )
            ) : (
              /* Main Phone UI */
              <div>
                {/* Settings button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <button
                    onClick={() => {
                      setShowSettings(true);
                      setShowSettingsSlideshow(true);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '24px',
                      cursor: 'pointer'
                    }}
                  >
                    ⚙️
                  </button>
                </div>
                
                {/* Partner logo */}
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                  <div style={{ 
                    width: '100px', 
                    height: '100px', 
                    margin: '0 auto',
                    position: 'relative'
                  }}>
                    <Image
                      src={getSelectedPartner().logoPath}
                      alt={getSelectedPartner().name}
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                </div>
                
                {/* Balance display */}
                <div style={{
                  textAlign: 'center',
                  padding: '20px',
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  borderRadius: '12px',
                  marginBottom: '20px'
                }}>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    {entryMode.includes('-jackpot') ? 'Jackpot Entries' : 'Balance'}
                  </div>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: screenColor }}>
                    {entryMode.includes('-jackpot') ? '🎰' : `$${walletBalance.toFixed(2)}`}
                  </div>
                </div>
                
                {/* Partner selector */}
                <select
                  value={selectedPartner}
                  onChange={(e) => {
                    const partner = partners.find(p => p.id === e.target.value);
                    if (partner) {
                      setSelectedPartner(partner.id);
                      setScreenColor(partner.color);
                      setEntryMode(`${partner.id}-balance`);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '15px',
                    fontSize: '16px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    marginBottom: '20px'
                  }}
                >
                  {partners.map(partner => (
                    <option key={partner.id} value={partner.id}>
                      {partner.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Right Side - Purchase Simulation (Always Visible) */}
      <div style={{
        flex: '0 0 400px',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        padding: '30px',
        height: 'fit-content'
      }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          marginBottom: '20px'
        }}>
          Purchase Simulation
        </h2>
        
        <button
          onClick={simulatePurchase}
          disabled={!isRoundUpEnabled}
          style={{
            width: '100%',
            padding: '15px',
            backgroundColor: isRoundUpEnabled ? screenColor : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: isRoundUpEnabled ? 'pointer' : 'not-allowed',
            marginBottom: '20px'
          }}
        >
          {isRoundUpEnabled ? 'Simulate Purchase' : 'Enable Round-Ups First'}
        </button>
        
        {/* Multiplier info */}
        <div style={{
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span>Current Multiplier:</span>
          <span style={{ fontWeight: 'bold', color: screenColor }}>{multiplier}</span>
        </div>
        
        {/* Round-up progress */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span>Round-Up Progress</span>
            <span style={{ color: screenColor, fontWeight: 'bold' }}>
              ${roundUpProgress.toFixed(2)} / $5.00
            </span>
          </div>
          <div style={{ 
            width: '100%', 
            height: '12px', 
            backgroundColor: '#e9ecef', 
            borderRadius: '6px', 
            overflow: 'hidden' 
          }}>
            <div style={{ 
              width: `${(roundUpProgress / 5) * 100}%`, 
              height: '100%', 
              backgroundColor: screenColor,
              transition: 'width 0.3s ease' 
            }} />
          </div>
        </div>
        
        {/* Recent Transactions */}
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>
          Recent Transactions
        </h3>
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {transactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} style={{
              padding: '12px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              marginBottom: '10px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: 'bold' }}>{transaction.merchant}</span>
                <span>${transaction.amount.toFixed(2)}</span>
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>
                Round-up: +${transaction.multipliedAmount.toFixed(2)}
                {entryMode.includes('-jackpot') && transaction.multipliedAmount >= 0.10 && (
                  <span style={{ marginLeft: '10px', color: screenColor }}>
                    ({Math.floor(transaction.multipliedAmount / 0.10)} entries)
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Jackpot Total - Only shown when jackpot mode is selected */}
      {entryMode.includes('-jackpot') && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#222',
          color: 'white',
          padding: '20px',
          textAlign: 'center',
          boxShadow: '0 -4px 10px rgba(0,0,0,0.2)'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>
              {getSelectedPartner().name} Jackpot Total
            </h3>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: screenColor }}>
              ${(transactions.reduce((acc, t) => {
                if (t.multipliedAmount >= 0.10) {
                  return acc + (Math.floor(t.multipliedAmount / 0.10) * 0.10);
                }
                return acc;
              }, 0)).toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}