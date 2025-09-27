'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const NavBar = () => {
  return (
    <nav style={{ backgroundColor: '#333', color: 'white', padding: '1rem', textAlign: 'center' }}>
      <a href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem' }}>Sidebet Home</a>
    </nav>
  );
};

export default function DemoNewPage() {
  const [selectedPartner, setSelectedPartner] = useState('fanduel');
  const [screenColor, setScreenColor] = useState('#1E88E5');
  const [walletBalance, setWalletBalance] = useState(0.00);
  const [isRoundUpEnabled, setIsRoundUpEnabled] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeSettingsSection, setActiveSettingsSection] = useState(null);
  const [currentIntroScreen, setCurrentIntroScreen] = useState(0);
  const [showIntroScreens, setShowIntroScreens] = useState(false);
  const [entryMode, setEntryMode] = useState('fanduel-balance');
  const [multiplier, setMultiplier] = useState('1X');
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [editingScreenIndex, setEditingScreenIndex] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [roundUpProgress, setRoundUpProgress] = useState(0);
  const [prizePicksLineup, setPrizePicksLineup] = useState('lineup-1');
  const [currentDateTime, setCurrentDateTime] = useState(() => {
    const now = new Date();
    // Start at 8am today
    now.setHours(8, 0, 0, 0);
    return now;
  });
  const [jackpotEntries, setJackpotEntries] = useState({
    fanduel: { '0.10': 0 },
    draftkings: { '0.10': 0, '0.25': 0 },
    caesars: { '0.10': 0 },
    mgm: { '0.10': 0 },
    fanatics: { '0.10': 0 },
    mcluck: { '0.10': 0 },
    novig: { '0.10': 0 },
    betrivers: { '0.10': 0 },
    playstar: { '0.10': 0 },
    bet365: { '0.10': 0 },
    espnbet: { '0.10': 0 },
    borgata: { '0.10': 0 },
    fliff: { '0.10': 0 },
    pulsz: { '0.10': 0 },
    rebet: { '0.10': 0 },
    splashsports: { '0.10': 0 },
    prizepicks: { '0.10': 0 }
  });

  const partners = [
    { id: 'fanduel', name: 'FanDuel', color: '#1E88E5', logoPath: '/images/assets/fanduel-casino.jpg' },
    { id: 'draftkings', name: 'DraftKings', color: '#4CAF50', logoPath: '/images/assets/draftkings-casino 3.jpg' },
    { id: 'caesars', name: 'Caesars', color: '#FFC107', logoPath: '/images/assets/caesarsCasino 2.png' },
    { id: 'mgm', name: 'BetMGM', color: '#D32F2F', logoPath: '/images/assets/betmgm 2.png' },
    { id: 'fanatics', name: 'Fanatics', color: '#5E35B1', logoPath: '/images/assets/fanatics.png' },
    { id: 'mcluck', name: 'McLuck', color: '#FF6B6B', logoPath: '/images/assets/mcluck.png' },
    { id: 'novig', name: 'NoVig', color: '#FF9800', logoPath: '/images/assets/NoVigLogo2.jpg' },
    { id: 'betrivers', name: 'BetRivers', color: '#0066CC', logoPath: '/images/assets/betrivers.svg' },
    { id: 'playstar', name: 'PlayStar', color: '#FFD700', logoPath: '/images/assets/playstar.png' },
    { id: 'bet365', name: 'Bet365', color: '#2E7D32', logoPath: '/images/assets/bet365.png' },
    { id: 'espnbet', name: 'ESPNBet', color: '#EE3124', logoPath: '/images/assets/espnbet.png' },
    { id: 'borgata', name: 'Borgata', color: '#8B0000', logoPath: '/images/assets/borgata.png' },
    { id: 'fliff', name: 'Fliff', color: '#7B68EE', logoPath: '/images/assets/fliff.png' },
    { id: 'pulsz', name: 'Pulsz', color: '#FF1493', logoPath: '/images/assets/pulsz.png' },
    { id: 'rebet', name: 'Rebet', color: '#4682B4', logoPath: '/images/assets/rebet.png' },
    { id: 'splashsports', name: 'SplashSports', color: '#00CED1', logoPath: '/images/assets/SplashSportsWhiteLogo.png' },
    { id: 'prizepicks', name: 'PrizePicks', color: '#6B46C1', logoPath: '/images/assets/PrizePicksLogo.jpeg' },
  ];

  const merchants = [
    { name: 'Chipotle', minAmount: 10.00, maxAmount: 20.00, logoPath: '/images/assets/chipotleLogo.png' },
    { name: "Dick's Sporting Goods", minAmount: 5.00, maxAmount: 120.00, logoPath: '/images/assets/DicksLogo.jpeg' },
    { name: 'Starbucks', minAmount: 4.50, maxAmount: 15.00, logoPath: '/images/assets/StarbucksLogo.jpg' },
    { name: 'Target', minAmount: 15.00, maxAmount: 150.00, logoPath: '/images/assets/targetLogo.jpg' },
    { name: 'Netflix', minAmount: 9.99, maxAmount: 19.99, logoPath: '/images/assets/NetflixLogo.jpg' },
    { name: 'Spotify', minAmount: 9.99, maxAmount: 14.99, logoPath: '/images/assets/SpotifyLogo.png' }
  ];

  // Load saved images from localStorage on component mount
  const getInitialIntroScreens = (partnerId?: string) => {
    const currentPartner = partnerId || selectedPartner;
    
    if (typeof window !== 'undefined') {
      // Save per partner
      const saved = localStorage.getItem(`introScreenImages_${currentPartner}`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Error loading saved images:', e);
        }
      }
    }
    
    // Custom screens for PrizePicks
    if (currentPartner === 'prizepicks') {
      return [
        { title: 'Welcome', description: 'Login to PrizePicks', image: '/images/assets/PrizePicksLogo.jpeg' },
        { title: 'Get Started', description: 'Daily Fantasy Made Easy', image: '/images/assets/PrizePicksLogo.jpeg' },
        { title: 'Main Screen', description: 'Pick your players', image: '/images/assets/PrizePicksHomeScreen.PNG' },
        { title: 'Fund Account', description: 'Add funds to start playing', image: '/images/assets/PrizePicksDeposit Screen.jpeg' }
      ];
    }
    
    // Custom screens for SplashSports
    if (currentPartner === 'splashsports') {
      return [
        { title: 'Welcome', description: 'Login to SplashSports', image: '/images/assets/SplashSportsWhiteLogo.png' },
        { title: 'Get Started', description: 'The future of sports betting', image: '/images/assets/SplashSportsWhiteLogo.png' },
        { title: 'Landing', description: 'Your personalized dashboard', image: '/images/assets/SplashSportsLanding.png' },
        { title: 'Fund Account', description: 'Quick and easy deposits', image: '/images/assets/SplashSportsDepositScreen.png' }
      ];
    }
    
    // Custom screens for NoVig
    if (currentPartner === 'novig') {
      return [
        { title: 'Welcome to NoVig', description: 'The smarter way to bet', image: '/images/assets/NoVigLogo2.jpg' },
        { title: 'Connect Bank', description: 'Securely link your bank account', image: '/images/assets/plaid-connect.png' },
        { title: 'Enable Round-Ups', description: 'Turn spare change into winnings', image: '/images/assets/round-ups-enable.png' },
        { title: 'Start Winning!', description: 'No vig means more profits', image: '/images/assets/NoVigLogo2.jpg' }
      ];
    }
    
    // Default screens if no saved data
    return [
      { title: 'Welcome', description: 'Login to your account', image: '/images/assets/fanduel-casino.jpg' },
      { title: 'Connect Bank', description: 'Securely link your bank', image: '/images/assets/plaid-connect.png' },
      { title: 'Enable Round-Ups', description: 'Turn spare change into entries', image: '/images/assets/round-ups-enable.png' },
      { title: 'All Set!', description: 'Start using Round-Ups today', image: '/images/assets/success-screen.png' }
    ];
  };

  const [introScreens, setIntroScreens] = useState(getInitialIntroScreens());

  // Save intro screens whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`introScreenImages_${selectedPartner}`, JSON.stringify(introScreens));
    }
  }, [introScreens, selectedPartner]);

  const availableImages = [
    '/images/assets/fanduel-casino.jpg',
    '/images/assets/draftkings-casino 3.jpg',
    '/images/assets/caesarsCasino 2.png',
    '/images/assets/betmgm 2.png',
    '/images/assets/fanatics.png',
    '/images/assets/NoVigLogo2.jpg',
    '/images/assets/SideBet Logo.png',
    '/images/assets/round-ups-logo.svg',
    '/images/assets/SplashSportsWhiteLogo.png',
    '/images/assets/SplashSportsLanding.png',
    '/images/assets/SplashSportsDepositScreen.png',
    '/images/assets/PrizePicksLogo.jpeg',
    '/images/assets/PrizePicksHomeScreen.PNG',
    '/images/assets/PrizePicksDeposit Screen.jpeg',
    '/images/placeholder-logo.png'
  ];

  const getSelectedPartner = () => partners.find(p => p.id === selectedPartner) || partners[0];

  const advanceTime = (date: Date) => {
    const newDate = new Date(date);
    
    // Get current hour
    const currentHour = newDate.getHours();
    
    // Define transaction times for 5 transactions per day
    // Spread evenly: 8am, 11am, 2pm, 5pm, 8pm
    const transactionHours = [8, 11, 14, 17, 20];
    
    // Find next transaction time
    let nextHour = transactionHours.find(h => h > currentHour);
    
    if (!nextHour) {
      // If no more transactions today, jump to first transaction tomorrow
      newDate.setDate(newDate.getDate() + 1);
      nextHour = transactionHours[0];
    }
    
    // Set to next transaction time with some randomness (±30 minutes)
    newDate.setHours(nextHour);
    newDate.setMinutes(Math.floor(Math.random() * 60));
    newDate.setSeconds(Math.floor(Math.random() * 60));
    
    return newDate;
  };

  const formatDateTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    const dateStr = date.toLocaleDateString('en-US', options);
    const timeStr = date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    return { dateStr, timeStr };
  };

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
      merchantLogo: merchant.logoPath,
      amount: amount,
      roundUpAmount: roundUpAmount,
      multipliedAmount: multipliedAmount,
      date: new Date()
    };
    
    setTransactions([newTransaction, ...transactions]);
    
    // Advance the time
    setCurrentDateTime(prevDate => advanceTime(prevDate));
    
    // Update round-up progress
    setRoundUpProgress(prev => {
      const newProgress = prev + multipliedAmount;
      
      if (newProgress >= 5.00) {
        // Calculate how many $5 thresholds we've crossed
        const numberOfRewards = Math.floor(newProgress / 5.00);
        
        // Only add to wallet balance if NOT in jackpot mode
        if (!entryMode.includes('-jackpot')) {
          setWalletBalance(currentBalance => currentBalance + (numberOfRewards * 5.00));
        }
        
        // Return only the remainder
        return newProgress % 5.00;
      }
      return newProgress;
    });
    
    // Update jackpot entries if in jackpot mode
    if (entryMode.includes('-jackpot') && multipliedAmount >= 0.10) {
      const entries = Math.floor(multipliedAmount / 0.10);
      setJackpotEntries(prev => ({
        ...prev,
        [selectedPartner]: {
          ...(prev[selectedPartner as keyof typeof prev] || {}),
          '0.10': ((prev[selectedPartner as keyof typeof prev] as any)?.['0.10'] || 0) + entries
        }
      }));
    }
  };

  const getJackpotRevenue = () => {
    if (!jackpotEntries[selectedPartner as keyof typeof jackpotEntries]) return 0;
    return Object.entries(jackpotEntries[selectedPartner as keyof typeof jackpotEntries]).reduce((total, [entryType, count]) => {
      return total + (parseFloat(entryType) * count);
    }, 0);
  };

  const handleIntroComplete = () => {
    setShowIntroScreens(false);
    setShowSettings(false);
    setActiveSettingsSection(null);
  };

  const goToNextIntroScreen = () => {
    if (currentIntroScreen >= introScreens.length - 1) {
      handleIntroComplete();
    } else {
      setCurrentIntroScreen(currentIntroScreen + 1);
    }
  };

  const gradientAnimation = `
    @keyframes gradientAnimation {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    /* Custom scrollbar styling */
    .transaction-scroll::-webkit-scrollbar {
      width: 6px;
    }
    
    .transaction-scroll::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }
    
    .transaction-scroll::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 3px;
    }
    
    .transaction-scroll::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  `;

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: gradientAnimation }} />
      <div style={{ backgroundColor: screenColor, minHeight: '100vh', transition: 'background-color 0.5s ease' }}>
        <NavBar />
        
        <main style={{ padding: '2rem', textAlign: 'center' }}>
          <h1 style={{ marginBottom: '2rem', color: 'white', fontSize: '2.5rem', fontWeight: 'bold' }}>
            {getSelectedPartner().name}
          </h1>
          
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px' }}>
            {/* Left Side - SideBet Logo */}
            <div style={{ width: '400px', height: '400px', position: 'relative' }}>
              <Image 
                src="/sidebet-logo.png" 
                alt="SideBet Logo"
                width={400}
                height={400}
                style={{ objectFit: 'contain', cursor: 'pointer' }}
                onClick={() => {
                  setShowIntroScreens(true);
                  setCurrentIntroScreen(0);
                }}
              />
            </div>

            {/* Phone UI */}
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
              {showIntroScreens ? (
                /* Intro Screens */
                <div style={{
                  height: '100%',
                  position: 'relative',
                  backgroundColor: '#000',
                  overflow: 'hidden'
                }}>
                  {/* Background Image */}
                  <div
                    onClick={goToNextIntroScreen}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundImage: `url('${introScreens[currentIntroScreen].image}')`,
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      cursor: 'pointer'
                    }}
                  />
                  
                  {/* Edit Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingScreenIndex(currentIntroScreen);
                      setShowImagePicker(true);
                    }}
                    style={{
                      position: 'absolute',
                      bottom: '20px',
                      left: '20px',
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '20px',
                      padding: '8px 16px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    ✏️ Edit
                  </button>
                  
                  
                  {/* Progress Dots */}
                  <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '8px'
                  }}>
                    {introScreens.map((_: any, idx: number) => (
                      <div
                        key={idx}
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: idx === currentIntroScreen ? 'white' : 'rgba(255,255,255,0.4)',
                          transition: 'all 0.3s ease'
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Image Picker Modal */}
                  {showImagePicker && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0,0,0,0.9)',
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '20px',
                      zIndex: 100
                    }}>
                      <h3 style={{ color: 'white', marginBottom: '20px' }}>Select Image</h3>
                      
                      {/* Upload from device button */}
                      <label style={{
                        display: 'block',
                        marginBottom: '20px',
                        padding: '15px',
                        backgroundColor: screenColor,
                        color: 'white',
                        borderRadius: '8px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}>
                        📷 Upload from Photos
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                if (editingScreenIndex !== null) {
                                  const newScreens = [...introScreens];
                                  newScreens[editingScreenIndex].image = event.target?.result as string;
                                  setIntroScreens(newScreens);
                                  setShowImagePicker(false);
                                  // Images are automatically saved via useEffect
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '10px',
                        overflowY: 'auto',
                        flex: 1
                      }}>
                        {availableImages.map((imgPath, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              if (editingScreenIndex !== null) {
                                const newScreens = [...introScreens];
                                newScreens[editingScreenIndex].image = imgPath;
                                setIntroScreens(newScreens);
                                setShowImagePicker(false);
                                // Images are automatically saved via useEffect
                              }
                            }}
                            style={{
                              height: '100px',
                              backgroundImage: `url('${imgPath}')`,
                              backgroundSize: 'contain',
                              backgroundPosition: 'center',
                              backgroundRepeat: 'no-repeat',
                              backgroundColor: '#222',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              border: editingScreenIndex !== null && introScreens[editingScreenIndex].image === imgPath ? '2px solid white' : '2px solid transparent'
                            }}
                          />
                        ))}
                      </div>
                      <button
                        onClick={() => setShowImagePicker(false)}
                        style={{
                          marginTop: '20px',
                          padding: '10px',
                          backgroundColor: '#666',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ) : false ? (
                /* Removed the round-up settings section - no longer needed */
                null
              ) : showSettings ? (
                /* Settings Menu */
                <div style={{ padding: '40px 20px', backgroundColor: '#fff', height: '100%' }}>
                  <h2 style={{ fontSize: '24px', marginBottom: '30px' }}>Settings</h2>
                  <button
                    onClick={() => {
                      setShowIntroScreens(true);
                      setCurrentIntroScreen(0);
                      setShowSettings(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '15px',
                      backgroundColor: '#f8f8f8',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      marginBottom: '10px',
                      cursor: 'pointer'
                    }}
                  >
                    🎬 Start 4-Screen Demo
                  </button>
                </div>
              ) : (
                /* Main UI - Default Round-Up Screen */
                <div style={{ padding: '40px 20px', height: '100%', backgroundColor: '#f5f5f5' }}>
                  {/* Top Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <button
                      onClick={() => setShowSettings(true)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer'
                      }}
                    >
                      ⚙️
                    </button>
                    <button
                      style={{
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '5px 10px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      Earn $10
                    </button>
                  </div>
                  
                  {/* Partner Logo */}
                  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <div style={{ 
                      width: '100px', 
                      height: '80px', 
                      margin: '0 auto',
                      position: 'relative'
                    }}>
                      <Image
                        src={getSelectedPartner().logoPath}
                        alt={`${getSelectedPartner().name} Logo`}
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                  </div>

                  {/* Balance Display - Shows balance or jackpot message */}
                  <div style={{
                    textAlign: 'center',
                    padding: '20px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    marginBottom: '20px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    {selectedPartner === 'prizepicks' ? (
                      /* PrizePicks custom display */
                      <>
                        <div style={{ fontSize: '14px', color: '#666' }}>
                          {entryMode.includes('-jackpot') ? 'PrizePicks Jackpot' : 'PrizePicks Lineup'}
                        </div>
                        {entryMode.includes('-jackpot') ? (
                          <div style={{ fontSize: '24px', fontWeight: 'bold', color: screenColor, marginTop: '8px' }}>
                            Round-ups → Entries
                          </div>
                        ) : (
                          <div style={{ fontSize: '24px', fontWeight: 'bold', color: screenColor, marginTop: '8px' }}>
                            {prizePicksLineup === 'lineup-1' && 'Lineup 1: 2 Pick - 5X'}
                            {prizePicksLineup === 'lineup-2' && 'Lineup 2: 3 Pick - 8X'}
                            {prizePicksLineup === 'lineup-3' && 'Lineup 3: 5 Pick - 15X'}
                          </div>
                        )}
                        <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#4CAF50', marginTop: '10px' }}>
                          ${walletBalance.toFixed(2)}
                        </div>
                      </>
                    ) : entryMode.includes('-jackpot') ? (
                      <>
                        <div style={{ fontSize: '14px', color: '#666' }}>
                          Jackpot Mode Active 🎰
                        </div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: screenColor, marginTop: '8px' }}>
                          Round-ups → Entries
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: '14px', color: '#666' }}>
                          {getSelectedPartner().name} Balance
                        </div>
                        <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#4CAF50' }}>
                          ${walletBalance.toFixed(2)}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Round-Up Toggle */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '15px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    <span style={{ fontWeight: '500' }}>Toggle Round-Ups</span>
                    <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '28px' }}>
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
                          height: '20px',
                          width: '20px',
                          left: isRoundUpEnabled ? '26px' : '4px',
                          bottom: '4px',
                          backgroundColor: 'white',
                          transition: '.4s',
                          borderRadius: '50%'
                        }} />
                      </span>
                    </label>
                  </div>

                  {/* Multiplier Section */}
                  <div style={{
                    padding: '15px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px', fontWeight: '500' }}>
                      Round-Up Multiplier
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      justifyContent: 'space-between'
                    }}>
                      {['1X', '1.5X', '2X', '3X'].map((value) => (
                        <button
                          key={value}
                          onClick={() => setMultiplier(value)}
                          style={{
                            flex: 1,
                            padding: '10px',
                            backgroundColor: multiplier === value ? screenColor : '#f5f5f5',
                            color: multiplier === value ? 'white' : '#333',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: multiplier === value ? 'bold' : '500',
                            fontSize: '14px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Entry Mode */}
                  <div style={{
                    padding: '15px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>Entry Mode</div>
                    {selectedPartner === 'prizepicks' ? (
                      /* PrizePicks custom lineup selector + balance/jackpot mode */
                      <div>
                        {/* Balance/Jackpot Toggle */}
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          padding: '10px',
                          backgroundColor: '#f0f7ff',
                          borderRadius: '6px',
                          fontSize: '14px',
                          marginBottom: '10px'
                        }}>
                          <span style={{ fontWeight: '500' }}>
                            {entryMode.includes('-jackpot') ? 'Jackpot Mode 🎰' : 'Balance Mode'}
                          </span>
                          <button
                            onClick={() => setEntryMode(entryMode.includes('-jackpot') ? `${selectedPartner}-balance` : `${selectedPartner}-jackpot`)}
                            style={{
                              color: screenColor,
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontWeight: '500'
                            }}
                          >
                            Change →
                          </button>
                        </div>
                        
                        {/* Lineup Selector */}
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          padding: '10px',
                          backgroundColor: '#fff5f5',
                          borderRadius: '6px',
                          fontSize: '14px',
                          marginBottom: '10px',
                          opacity: entryMode.includes('-jackpot') ? 1 : 0.5
                        }}>
                          <span style={{ fontWeight: '500', color: entryMode.includes('-jackpot') ? '#333' : '#999' }}>
                            Lineup Selection
                          </span>
                          <select
                            value={prizePicksLineup}
                            onChange={(e) => setPrizePicksLineup(e.target.value)}
                            disabled={!entryMode.includes('-jackpot')}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              border: `1px solid ${entryMode.includes('-jackpot') ? screenColor : '#ccc'}`,
                              backgroundColor: entryMode.includes('-jackpot') ? 'white' : '#f5f5f5',
                              color: entryMode.includes('-jackpot') ? screenColor : '#999',
                              fontWeight: '500',
                              cursor: entryMode.includes('-jackpot') ? 'pointer' : 'not-allowed'
                            }}
                          >
                            <option value="lineup-1">Lineup 1 (2 Pick - 5X)</option>
                            <option value="lineup-2">Lineup 2 (3 Pick - 8X)</option>
                            <option value="lineup-3">Lineup 3 (5 Pick - 15X)</option>
                          </select>
                        </div>
                        <div style={{
                          padding: '8px',
                          backgroundColor: entryMode.includes('-jackpot') ? '#e8f5e9' : '#f5f5f5',
                          borderRadius: '4px',
                          fontSize: '12px',
                          color: entryMode.includes('-jackpot') ? '#388e3c' : '#999',
                          textAlign: 'center'
                        }}>
                          {entryMode.includes('-jackpot') ? (
                            <>
                              {prizePicksLineup === 'lineup-1' && '2 Pick Lineup: 5X payout on 2 correct picks'}
                              {prizePicksLineup === 'lineup-2' && '3 Pick Lineup: 8X payout on 3 correct picks'}
                              {prizePicksLineup === 'lineup-3' && '5 Pick Lineup: 15X payout on 5 correct picks'}
                            </>
                          ) : (
                            'Enable Jackpot Mode to select lineups'
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Standard entry mode for other partners */
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        padding: '10px',
                        backgroundColor: '#f0f7ff',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}>
                        <span style={{ fontWeight: '500' }}>
                          {entryMode.includes('-jackpot') ? 'Jackpot Mode 🎰' : 'Balance Mode'}
                        </span>
                        <button
                          onClick={() => setEntryMode(entryMode.includes('-jackpot') ? `${selectedPartner}-balance` : `${selectedPartner}-jackpot`)}
                          style={{
                            color: screenColor,
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: '500'
                          }}
                        >
                          Change →
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Round-Up Progress */}
                  <div style={{
                    padding: '15px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontSize: '14px', color: '#666' }}>Round-Up Progress</span>
                      <span style={{ fontSize: '14px', fontWeight: 'bold', color: screenColor }}>
                        ${roundUpProgress.toFixed(2)} / $5.00
                      </span>
                    </div>
                    <div style={{ 
                      width: '100%', 
                      height: '8px', 
                      backgroundColor: '#e9ecef', 
                      borderRadius: '4px', 
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

                  {/* Connect Bank */}
                  <div style={{
                    padding: '15px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    <h4 style={{ fontSize: '14px', marginBottom: '10px' }}>Connect Bank</h4>
                    <div style={{
                      border: '1px solid #e0e0e0',
                      borderRadius: '6px',
                      padding: '10px',
                      marginBottom: '10px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          backgroundColor: '#f57c00',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          PNC
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '500' }}>PNC Bank</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>Checking •••• 4567</div>
                        </div>
                      </div>
                      <span style={{
                        fontSize: '12px',
                        color: '#4CAF50',
                        backgroundColor: '#e6f7ed',
                        padding: '2px 8px',
                        borderRadius: '12px'
                      }}>
                        Connected
                      </span>
                    </div>
                    <button style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: screenColor,
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}>
                      Add Bank
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - Transaction Simulator */}
            <div style={{
              width: '400px',
              padding: '30px',
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
              {/* Date and Time Display */}
              <div style={{
                marginBottom: '25px',
                padding: '20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '12px',
                textAlign: 'center',
                borderLeft: `4px solid ${screenColor}`
              }}>
                <div style={{
                  fontSize: '14px',
                  color: '#666',
                  marginBottom: '8px',
                  fontWeight: '500',
                  letterSpacing: '0.5px'
                }}>
                  {formatDateTime(currentDateTime).dateStr}
                </div>
                <div style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: '#333',
                  letterSpacing: '-0.5px'
                }}>
                  {formatDateTime(currentDateTime).timeStr}
                </div>
              </div>

              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
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
                {isRoundUpEnabled ? 'Make a Random Purchase' : 'Enable Round-Ups First'}
              </button>
              
              {/* Round-up Progress */}
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
              <div 
                className="transaction-scroll"
                style={{ 
                height: '280px', // Fixed height for 4 transaction rows
                overflowY: 'auto',
                overflowX: 'hidden',
                paddingRight: '5px',
                backgroundColor: '#fafafa',
                borderRadius: '8px',
                padding: '10px'
              }}>
                {transactions.length === 0 ? (
                  // Empty state - show 4 placeholder rows
                  <>
                    {[1, 2, 3, 4].map((index) => (
                      <div key={`empty-${index}`} style={{
                        padding: '12px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '8px',
                        marginBottom: index < 4 ? '10px' : '0',
                        border: '1px dashed #ddd',
                        textAlign: 'center',
                        color: '#999',
                        fontSize: '14px',
                        height: '52px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {index === 1 ? 'No transactions yet' : index === 2 ? 'Make a purchase to start' : ''}
                      </div>
                    ))}
                  </>
                ) : (
                  transactions.map((transaction) => (
                    <div key={transaction.id} style={{
                      padding: '12px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px',
                      marginBottom: '10px',
                      border: '1px solid #e0e0e0'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ 
                            width: '30px', 
                            height: '30px', 
                            position: 'relative',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            backgroundColor: '#fff'
                          }}>
                            <Image
                              src={transaction.merchantLogo || '/images/placeholder-logo.png'}
                              alt={`${transaction.merchant} logo`}
                              fill
                              style={{ objectFit: 'contain' }}
                            />
                          </div>
                          <span style={{ fontWeight: 'bold' }}>{transaction.merchant}</span>
                        </div>
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
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Partner Selector */}
          <div style={{ marginTop: '40px' }}>
            <select
              value={selectedPartner}
              onChange={(e) => {
                const partner = partners.find(p => p.id === e.target.value);
                if (partner) {
                  setSelectedPartner(partner.id);
                  setScreenColor(partner.color);
                  setEntryMode(`${partner.id}-balance`);
                  // Reset progress and balance when switching partners
                  setWalletBalance(0);
                  setRoundUpProgress(0);
                  setTransactions([]);
                  setCurrentDateTime(new Date());
                  
                  // Force clear PrizePicks cache to fix image paths
                  if (partner.id === 'prizepicks' && typeof window !== 'undefined') {
                    localStorage.removeItem('introScreenImages_prizepicks');
                  }
                  
                  // Load intro screens for the new partner
                  setIntroScreens(getInitialIntroScreens(partner.id));
                }
              }}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                borderRadius: '8px',
                border: '2px solid white',
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white'
              }}
            >
              {partners.map(partner => (
                <option key={partner.id} value={partner.id} style={{ color: 'black' }}>
                  {partner.name}
                </option>
              ))}
            </select>
          </div>
        </main>

        {/* Jackpot Total - Only shown in jackpot mode */}
        {entryMode.includes('-jackpot') && (
          <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#222',
            color: 'white',
            padding: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{ maxWidth: '1200px', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0 }}>{getSelectedPartner().name} Jackpot</h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#aaa' }}>Powered by SideBet</p>
              </div>
              
              <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: screenColor }}>
                    {(jackpotEntries as any)[selectedPartner]['0.10']}
                  </div>
                  <div style={{ fontSize: '14px', color: '#aaa' }}>$0.10 Entries</div>
                </div>
                
                {selectedPartner === 'draftkings' && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: screenColor }}>
                      {jackpotEntries[selectedPartner]['0.25'] || 0}
                    </div>
                    <div style={{ fontSize: '14px', color: '#aaa' }}>$0.25 Entries</div>
                  </div>
                )}
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#4CAF50' }}>
                    ${getJackpotRevenue().toFixed(2)}
                  </div>
                  <div style={{ fontSize: '14px', color: '#aaa' }}>Total Revenue</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}