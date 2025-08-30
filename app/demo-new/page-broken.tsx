'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// Add keyframes for gradient animation
const gradientAnimation = `
@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes progressGradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes slideInFromRight {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes ripple {
  0% {
    background-color: rgba(0, 0, 0, 0.07);
    transform: scale(0.1);
  }
  100% {
    background-color: transparent;
    transform: scale(2.5);
  }
}
`;

// Simple NavBar component
const NavBar = () => {
  return (
    <nav style={{ backgroundColor: '#333', color: 'white', padding: '1rem', textAlign: 'center' }}>
      <a href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem' }}>Sidebet Home</a>
    </nav>
  );
};

// Partner information with actual logo paths
const partners = [
  { 
    id: 'fanduel', 
    name: 'FanDuel', 
    color: '#1E88E5', 
    logoPath: '/images/assets/fanduel-casino.jpg'
  },
  { 
    id: 'draftkings', 
    name: 'DraftKings', 
    color: '#4CAF50', 
    logoPath: '/images/assets/draftkings-casino 3.jpg'
  },
  { 
    id: 'caesars', 
    name: 'Caesars', 
    color: '#FFC107', 
    logoPath: '/images/assets/caesars.svg' // Keeping the path but won't use it
  },
  { 
    id: 'mgm', 
    name: 'MGM', 
    color: '#D32F2F', 
    logoPath: '/images/assets/betmgm 2.png'
  },
  { 
    id: 'fanatics', 
    name: 'Fanatics', 
    color: '#5E35B1', 
    logoPath: '/images/assets/fanatics.png'
  },
  { 
    id: 'novig', 
    name: 'Novig', 
    color: '#FF9800', // Orange color 
    logoPath: '/images/assets/NoVigLogo2.jpg'
  },
];

// Sample merchants for purchases
const merchants = [
  { name: 'Chipotle', minAmount: 10.00, maxAmount: 20.00, logoPath: '/images/assets/chipotleLogo.png' },
  { name: "Dick's Sporting Goods", minAmount: 5.00, maxAmount: 120.00, logoPath: '/images/assets/DicksLogo.jpeg' },
  { name: 'Starbucks', minAmount: 4.50, maxAmount: 15.00, logoPath: '/images/assets/StarbucksLogo.jpg' },
  { name: 'Target', minAmount: 15.00, maxAmount: 150.00, logoPath: '/images/assets/targetLogo.jpg' },
  { name: 'Netflix', minAmount: 9.99, maxAmount: 19.99, logoPath: '/images/assets/NetflixLogo.jpg' },
  { name: 'Spotify', minAmount: 9.99, maxAmount: 14.99, logoPath: '/images/assets/SpotifyLogo.png' },
];

// Transaction type for purchase history
type Transaction = {
  id: string;
  merchant: string;
  amount: number;
  roundUpAmount: number;
  multipliedAmount: number;
  date: Date;
  logoPath?: string;
};

// Function to dynamically list all images from the images directory
// This is a client-side component so we'll need to use predefined array
const getAllImages = () => {
  // We'll explicitly list the images we know exist from our directory listings
  return [
    // Root images
    '/images/placeholder-logo-1.png',
    '/images/placeholder-logo-2.png',
    '/images/placeholder-logo-3.png',
    '/images/placeholder-logo-4.png',
    '/images/placeholder-logo-5.png',
    '/images/placeholder-logo.png',
    '/images/hedgepay-logo.png',
    '/images/neon-crown-text.png',
    '/images/neon-crown.png',
    '/images/sidebet-logo.svg',
    '/images/sidebet-text-logo.svg',
    '/images/coffee-cup.png',
    '/images/sidebet-icon.svg',
    
    // Core assets
    '/images/assets/fanDuelCasinoHomeScreen.png',
    '/images/assets/SpotifyLogo.png',
    '/images/assets/NetflixLogo.jpg',
    '/images/assets/chipotleLogo.png',
    '/images/assets/targetLogo.jpg',
    '/images/assets/DicksLogo.jpeg',
    '/images/assets/StarbucksLogo.jpg',
    '/images/assets/NoVigLogo2.jpg',
    '/images/assets/SideBetFavIcon2.png',
    '/images/assets/DraftKings Round-Ups TRANSPARENT.png',
    '/images/assets/FanDuel Casino Round-ups TRANSPARENT.png',
    '/images/assets/Betr Round-ups TRANSPARENT.png',
    '/images/assets/draftkingsJackpot.svg',
    '/images/assets/FanDuel Jackpot.png',
    '/images/assets/RoundUpRewards2.png',
    '/images/assets/SideBet Logo.png',
    '/images/assets/SleeperFantasyLevel1.png',
    
    // AI Generated images
    '/images/assets/ChatGPT Image Apr 25, 2025, 01_20_12 AM.png',
    '/images/assets/ChatGPT Image Apr 25, 2025, 01_18_46 AM.png',
    '/images/assets/ChatGPT Image Apr 24, 2025, 02_41_31 AM.png',
    '/images/assets/ChatGPT Image Apr 22, 2025, 12_19_38 PM.png',
    '/images/assets/Apr 23, 2025, 01_49_58 AM.png',
    '/images/assets/Apr 24, 2025, 02_39_59 AM.png',
    '/images/assets/ChatGPT Image Apr 22, 2025, 12_26_45 PM.png',
    
    // Partner images
    '/images/assets/betmgm 2.png',
    '/images/assets/fanatics.png',
    '/images/assets/caesarsCasino 2.png',
    '/images/assets/fanduel-casino.jpg',
    '/images/assets/draftkings-casino 3.jpg',
    '/images/assets/draftkings-casino-alt 3.png',
    '/images/assets/mgm.svg',
    '/images/assets/pokerstars.svg',
    '/images/assets/draftkings.svg',
    '/images/assets/fanatics.svg',
    '/images/assets/fanduel.svg',
    '/images/assets/caesars.svg',
    '/images/assets/draftkings-crown.svg',
    '/images/assets/betrivers.svg',
    
    // Partner Demo folders with actual files found from directory listing
    '/images/assets/FanDuel Demo/FanDuel Jackpot.png',
    '/images/assets/FanDuel Demo/FanDuel Casino Round-ups TRANSPARENT.png',
    '/images/assets/FanDuel Demo/fanduel-casino.jpg',
    '/images/assets/FanDuel Demo/fanDuelCasinoHomeScreen.png',
    
    // DraftKings Demo images - Fix the path formatting to avoid 404 errors
    '/images/assets/DraftKings Demo/DraftkingsScreen1.png'
  ];
};

// Add a type definition for intro screens with skip option
type IntroScreenConfig = {
  title: string;
  description: string;
  image: string; 
  instruction: string;
  skip?: boolean; // Add skip flag option
};

export default function DemoNewPage() {
  const [selectedPartner, setSelectedPartner] = useState<string>('fanduel');
  const [screenColor, setScreenColor] = useState<string>('#1E88E5');
  const [entryMode, setEntryMode] = useState<string>(`fanduel-balance`);
  const [isRoundUpEnabled, setIsRoundUpEnabled] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [celebrationOpacity, setCelebrationOpacity] = useState<number>(0);
  const [showEarnScreen, setShowEarnScreen] = useState<boolean>(false);
  const [showShareLink, setShowShareLink] = useState<boolean>(false);
  const [linkCopied, setLinkCopied] = useState<boolean>(false);
  const [showEntryModeDropdown, setShowEntryModeDropdown] = useState<boolean>(false);
  const [showSportsOptions, setShowSportsOptions] = useState<boolean>(false);
  const [promoCode, setPromoCode] = useState<string>("CATENA");
  const [promoCodeSaved, setPromoCodeSaved] = useState<boolean>(false);
  const [multiplier, setMultiplier] = useState<string>("1X");
  const [showMultiplierInfo, setShowMultiplierInfo] = useState<boolean>(false);
  
  // New state variables for purchase simulation
  const [roundUpProgress, setRoundUpProgress] = useState<number>(0);
  const [walletBalance, setWalletBalance] = useState<number>(0.00);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showPurchaseSuccess, setShowPurchaseSuccess] = useState<boolean>(false);
  const [lastPurchase, setLastPurchase] = useState<Transaction | null>(null);
  const [showPartnerDropdown, setShowPartnerDropdown] = useState<boolean>(false);
  const [balanceHighlighted, setBalanceHighlighted] = useState<boolean>(false);
  const [showRoundUpActivatedToast, setShowRoundUpActivatedToast] = useState<boolean>(false);
  const [roundUpActivatedToastMessage, setRoundUpActivatedToastMessage] = useState<string>('Round-Ups Activated!');
  
  // Intro screens state
  const [showIntroScreens, setShowIntroScreens] = useState<boolean>(false);
  const [currentIntroScreen, setCurrentIntroScreen] = useState<number>(0);
  
  // Settings screen state
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [activeRipple, setActiveRipple] = useState<string | null>(null);
  const [activeSettingsSection, setActiveSettingsSection] = useState<string | null>(null);
  const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null);
  
  // Available images for selection - replace with dynamic list
  const availableImages = getAllImages();
  
  // Get images relevant to the selected partner
  const getPartnerFilteredImages = (partnerId: string) => {
    // For simplicity, we'll now offer all images with option to filter
    // We'll keep the partner-specific filter logic for better UX
    
    // First, we need to make sure we correctly identify our partner-specific images
    // The issue with DraftKings image not appearing is likely in this filtering logic
    
    // Base/general images that should always be available
    const baseImages = availableImages.filter(img => {
      // Include general images
      return !(
        img.toLowerCase().includes('fanduel') || 
        img.toLowerCase().includes('draftkings') || 
        img.toLowerCase().includes('caesars') || 
        img.toLowerCase().includes('mgm') || 
        img.toLowerCase().includes('fanatics') || 
        img.toLowerCase().includes('novig')
      );
    });
    
    // Partner-specific images - Fix the case-sensitivity issue
    // Use a more relaxed filter that catches both uppercase and lowercase variations
    const partnerImages = availableImages.filter(img => {
      const lowerImg = img.toLowerCase();
      const lowerPartnerId = partnerId.toLowerCase();
      
      // Check for direct match with the partnerId string
      return lowerImg.includes(lowerPartnerId) || 
        // Special case for DraftKings to catch "DraftkingsScreen1.png"
        (lowerPartnerId === 'draftkings' && lowerImg.includes('draftkingsscreen')) ||
        // Check for partner demo folders
        lowerImg.includes(`${lowerPartnerId} demo`);
    });
    
    // Log for debugging
    console.log(`Found ${partnerImages.length} ${partnerId} images:`, partnerImages);
    
    // Combine and return all available images, prioritizing partner-specific ones
    return [...partnerImages, ...baseImages];
  };
  
  // Partner intro images state
  const [partnerIntroImages, setPartnerIntroImages] = useState<{[partnerId: string]: string[]}>({
    fanduel: [
      '/images/assets/fanduel-casino.jpg', // Login screen
      '/images/assets/FanDuel Casino Round-ups TRANSPARENT.png', // Account verification
      '/images/assets/FanDuel Jackpot.png', // Bank connection
      '/images/assets/SideBet Logo.png', // Terms & permissions
      '/images/assets/fanduel-casino.jpg', // Round-up settings
      '/images/assets/FanDuel Casino Round-ups TRANSPARENT.png' // Welcome
    ],
    draftkings: [
      '/images/assets/draftkings-casino 3.jpg', // Login screen
      '/images/assets/DraftKings Round-Ups TRANSPARENT.png', // Account verification
      '/images/assets/draftkings-casino-alt 3.png', // Bank connection
      '/images/assets/SideBet Logo.png', // Terms & permissions
      '/images/assets/draftkings-casino 3.jpg', // Round-up settings
      '/images/assets/DraftKings Round-Ups TRANSPARENT.png' // Welcome
    ],
    caesars: [
      '/images/assets/caesarsCasino 2.png', // Login screen
      '/images/assets/caesars.svg', // Account verification
      '/images/assets/Betr Round-ups TRANSPARENT.png', // Bank connection
      '/images/assets/SideBet Logo.png', // Terms & permissions
      '/images/assets/caesarsCasino 2.png', // Round-up settings
      '/images/assets/Betr Round-ups TRANSPARENT.png' // Welcome
    ],
    mgm: [
      '/images/assets/betmgm 2.png', // Login screen
      '/images/assets/mgm.svg', // Account verification
      '/images/assets/Betr Round-ups TRANSPARENT.png', // Bank connection
      '/images/assets/SideBet Logo.png', // Terms & permissions
      '/images/assets/betmgm 2.png', // Round-up settings
      '/images/assets/Betr Round-ups TRANSPARENT.png' // Welcome
    ],
    fanatics: [
      '/images/assets/fanatics.png', // Login screen
      '/images/assets/Betr Round-ups TRANSPARENT.png', // Account verification
      '/images/assets/SideBet Logo.png', // Bank connection
      '/images/assets/SideBet Logo.png', // Terms & permissions
      '/images/assets/fanatics.png', // Round-up settings
      '/images/assets/Betr Round-ups TRANSPARENT.png' // Welcome
    ],
    novig: [
      '/images/assets/NoVigLogo2.jpg', // Login screen
      '/images/assets/Betr Round-ups TRANSPARENT.png', // Account verification
      '/images/assets/SideBet Logo.png', // Bank connection
      '/images/assets/SideBet Logo.png', // Terms & permissions
      '/images/assets/NoVigLogo2.jpg', // Round-up settings
      '/images/assets/Betr Round-ups TRANSPARENT.png' // Welcome
    ]
  });
  
  // Add a state to track screens marked for skipping
  const [skippedScreens, setSkippedScreens] = useState<{[key: number]: boolean}>({});
  
  // Load saved settings from localStorage when component mounts
  useEffect(() => {
    // Check if we're running in the browser
    if (typeof window !== 'undefined') {
      try {
        // Try to load saved images
        const savedImages = localStorage.getItem('partnerIntroImages');
        if (savedImages) {
          setPartnerIntroImages(JSON.parse(savedImages));
        }
        
        // Try to load saved skipped screens
        const savedSkippedScreens = localStorage.getItem('skippedScreens');
        if (savedSkippedScreens) {
          setSkippedScreens(JSON.parse(savedSkippedScreens));
        }
      } catch (e) {
        console.error("Error loading saved settings:", e);
      }
    }
  }, []);
  
  // Settings Option Component
  const SettingsOption = ({ 
    id, 
    icon, 
    title, 
    bgColor,
    onClick = () => {} // Make onClick optional with default empty function
  }: { 
    id: string; 
    icon: string; 
    title: string; 
    bgColor: string;
    onClick?: () => void; // Mark as optional
  }) => {
    const handleClick = () => {
      setActiveRipple(id);
      
      // Reset ripple effect after animation completes
      setTimeout(() => {
        setActiveRipple(null);
      }, 600);
    };
    
    return (
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          backgroundColor: '#f8f8f8',
          borderRadius: '10px',
          border: '1px solid #eaeaea',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden'
        }}
        onClick={() => {
          handleClick();
          onClick();
        }}
      >
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '15px',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{ 
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: bgColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}>
            {icon}
          </div>
          <span style={{ 
            fontSize: '16px',
            fontWeight: '500'
          }}>
            {title}
          </span>
        </div>
        <span style={{ 
          fontSize: '18px',
          color: '#999',
          position: 'relative',
          zIndex: 1
        }}>
          →
        </span>
        
        {/* Ripple effect */}
        {activeRipple === id && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            animation: 'ripple 0.6s linear',
            zIndex: 0
          }} />
        )}
      </div>
    );
  };
  
  // Function to update a partner's intro image
  const updatePartnerIntroImage = (index: number, newImageUrl: string) => {
    // Create a deep copy of the current state
    const updatedImages = { ...partnerIntroImages };
    
    // Update the specified image for the selected partner
    if (updatedImages[selectedPartner]) {
      updatedImages[selectedPartner] = [...updatedImages[selectedPartner]];
      updatedImages[selectedPartner][index] = newImageUrl;
      setPartnerIntroImages(updatedImages);
      
      // Save to localStorage
      try {
        localStorage.setItem('partnerIntroImages', JSON.stringify(updatedImages));
      } catch (e) {
        console.error("Error saving partner images:", e);
      }
    }
    
    // Handle skipped screens
    const updatedSkipped = {...skippedScreens};
    if (newImageUrl === 'blank') {
      // Mark this screen for skipping
      updatedSkipped[index] = true;
    } else {
      // If previously marked as skipped but now has an image, remove skip flag
      delete updatedSkipped[index];
    }
    
    setSkippedScreens(updatedSkipped);
    
    // Save skipped screens to localStorage
    try {
      localStorage.setItem('skippedScreens', JSON.stringify(updatedSkipped));
    } catch (e) {
      console.error("Error saving skipped screens:", e);
    }
  };
  
  // Intro screens content - structured for B2B demo flow
  const getIntroScreens = () => {
    const partnerImages = partnerIntroImages[selectedPartner] || partnerIntroImages.fanduel;
    
    // Exactly 4 intro screens as requested
    const allScreens: IntroScreenConfig[] = [
      {
        title: `Welcome to ${getSelectedPartner().name}`,
        description: "Login to your account",
        image: partnerImages[0], 
        instruction: "Tap anywhere to continue"
      },
      {
        title: "Connect Your Bank",
        description: "Securely link your bank account with Plaid",
        image: partnerImages[1], 
        instruction: "Tap anywhere to continue"
      },
      {
        title: "Enable Round-Ups",
        description: "Turn spare change into winnings",
        image: partnerImages[2], 
        instruction: "Tap anywhere to continue"
      },
      {
        title: "You're All Set!",
        description: "Let's configure your round-up settings",
        image: partnerImages[3], 
        instruction: "Tap to begin"
      }
    ];
    
    // Filter out screens that are marked as skipped
    const screens = allScreens.map((screen, index) => {
      if (skippedScreens[index]) {
        return {...screen, skip: true};
      }
      return screen;
    });
    
    // Log for debugging
    console.log("Intro screens:", {
      selectedPartner,
      partnerImages,
      screens,
      skippedScreens,
      currentIntroScreen
    });
    
    return screens;
  };
  
  // Function to start the intro sequence
  const startIntroSequence = () => {
    setShowIntroScreens(true);
    // Find the first non-skipped screen
    const firstNonSkippedScreen = findNextNonSkippedScreen(-1);
    setCurrentIntroScreen(firstNonSkippedScreen);
    
    // If all screens are skipped, just exit the intro sequence
    if (firstNonSkippedScreen >= getIntroScreens().length) {
      setShowIntroScreens(false);
    }
  };
  
  // Function to find the next non-skipped screen
  const findNextNonSkippedScreen = (currentIndex: number) => {
    const screens = getIntroScreens();
    let nextIndex = currentIndex + 1;
    
    while (nextIndex < screens.length) {
      if (!screens[nextIndex].skip) {
        return nextIndex;
      }
      nextIndex++;
    }
    
    // If all remaining screens are skipped, return end of array
    return screens.length;
  };
  
  // Function to navigate to the next intro screen
  const goToNextIntroScreen = () => {
    const nextNonSkippedScreen = findNextNonSkippedScreen(currentIntroScreen);
    
    // Check if we've reached the end of all screens
    if (nextNonSkippedScreen >= getIntroScreens().length) {
      // End of intro screens, show round-up interactive tool
      setShowIntroScreens(false);
      setShowSettings(true);
      setActiveSettingsSection('round-up-interactive');
    } else {
      // Move to the next non-skipped screen
      setCurrentIntroScreen(nextNonSkippedScreen);
    }
  };

  // Get the selected partner object
  const getSelectedPartner = () => {
    return partners.find(p => p.id === selectedPartner) || partners[0];
  };
  
  // Get the current entry mode display name
  const getEntryModeDisplay = () => {
    const partner = getSelectedPartner().name;
    
    if (entryMode.endsWith('-balance')) {
      return `${partner} Balance`;
    } else if (entryMode.endsWith('-jackpot')) {
      return `${partner} Jackpot 🎊`;
    } else if (entryMode.includes('-futures-')) {
      // Extract the sport name
      const sportMatch = entryMode.match(/-futures-(.+)$/);
      const sport = sportMatch ? sportMatch[1].toUpperCase() : '';
      return `${partner} Futures: ${sport}`;
    } else if (entryMode.endsWith('-futures')) {
      return `${partner} Futures`;
    }
    
    return `${partner} Balance`;
  };
  
  // Referral link
  const referralLink = `https://hedgepayments.com/ref/${getSelectedPartner().id}/${Math.random().toString(36).substring(2, 8)}`;

  // Handle partner selection
  const handlePartnerSelect = (partnerId: string, color: string) => {
    setSelectedPartner(partnerId);
    setScreenColor(color);
    // Update entry mode to the selected partner's balance option
    setEntryMode(`${partnerId}-balance`);
  };
  
  // Handle entry mode change
  const handleEntryModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEntryMode(e.target.value);
  };

  // Handle toggle change
  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setIsRoundUpEnabled(isChecked);
    
    if (isChecked) {
      // Reset progress to 0 when round-ups are enabled
      setRoundUpProgress(0);
      
      // Set the standard message for round-up activation
      setRoundUpActivatedToastMessage('Round-Ups Activated!');
      
      // Show the toast notification
      setShowRoundUpActivatedToast(true);
      setTimeout(() => {
        setShowRoundUpActivatedToast(false);
      }, 3000);
    }
  };

  // Toggle earn screen
  const toggleEarnScreen = () => {
    setShowEarnScreen(!showEarnScreen);
    // Reset share link visibility when toggling the screen
    if (!showEarnScreen === false) {
      setShowShareLink(false);
      setLinkCopied(false);
    }
  };

  // Toggle share link
  const toggleShareLink = () => {
    setShowShareLink(!showShareLink);
    setLinkCopied(false);
  };

  // Copy link to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setLinkCopied(true);
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setLinkCopied(false);
      }, 2000);
    });
  };

  // Toggle entry mode dropdown
  const toggleEntryModeDropdown = () => {
    setShowEntryModeDropdown(!showEntryModeDropdown);
    // Reset sports options when toggling main dropdown
    if (showSportsOptions) setShowSportsOptions(false);
  };
  
  // Toggle sports options
  const toggleSportsOptions = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent dropdown toggle
    setShowSportsOptions(!showSportsOptions);
  };
  
  // Select a sport
  const selectSport = (sport: string) => {
    setEntryMode(`${selectedPartner}-futures-${sport.toLowerCase()}`);
    setShowEntryModeDropdown(false);
    setShowSportsOptions(false);
  };

  // Get the appropriate balance based on entry mode
  const getEntryModeBalance = () => {
    if (entryMode.includes('-jackpot') && selectedPartner === 'novig') {
      return `$${(100.00).toFixed(2)}`;
    }
    return `$${walletBalance.toFixed(2)}`;
  };

  // Add a function to handle promo code saving
  const savePromoCode = () => {
    setPromoCodeSaved(true);
    // Reset the saved state after 3 seconds
    setTimeout(() => {
      setPromoCodeSaved(false);
    }, 3000);
  };

  // Add this function to handle multiplier selection
  const handleMultiplierChange = (value: string) => {
    setMultiplier(value);
  };

  // Get the multiplier value as a number
  const getMultiplierValue = (): number => {
    return parseFloat(multiplier.replace('X', ''));
  };

  // Generate a random purchase
  const generateRandomPurchase = () => {
    // Only proceed if round-up is enabled
    if (!isRoundUpEnabled) {
      alert("Please enable Round-Ups first to simulate purchases");
      return;
    }

    // Select a random merchant
    const merchant = merchants[Math.floor(Math.random() * merchants.length)];
    
    // Generate a random amount within the merchant's range
    const min = merchant.minAmount;
    const max = merchant.maxAmount;
    const randomAmount = min + Math.random() * (max - min);
    
    // Format to 2 decimal places
    const amount = parseFloat(randomAmount.toFixed(2));
    
    // Calculate the round-up amount (difference to next dollar)
    const nextDollar = Math.ceil(amount);
    const roundUpAmount = parseFloat((nextDollar - amount).toFixed(2));
    
    // Apply multiplier
    const multiplierValue = getMultiplierValue();
    const multipliedAmount = parseFloat((roundUpAmount * multiplierValue).toFixed(2));
    
    // Create the transaction
    const transaction: Transaction = {
      id: Math.random().toString(36).substring(2, 9),
      merchant: merchant.name,
      amount: amount,
      roundUpAmount: roundUpAmount,
      multipliedAmount: multipliedAmount,
      date: new Date(),
      logoPath: merchant.logoPath
    };
    
    // Add to transactions
    setTransactions(prev => [transaction, ...prev].slice(0, 10)); // Keep only the last 10 transactions
    setLastPurchase(transaction);
    
    // If in jackpot mode, add entries to the jackpot counter
    if (entryMode.includes('-jackpot')) {
      // Calculate how many $0.10 entries this generates
      const entriesCount = Math.floor(multipliedAmount / 0.10);
      
      if (entriesCount > 0) {
        // Add entries to the jackpot counter
        const updatedEntries = {...jackpotEntries};
        updatedEntries[selectedPartner]['0.10'] += entriesCount;
        setJackpotEntries(updatedEntries);
        
        // Show a toast notification
        setRoundUpActivatedToastMessage(`${entriesCount} Jackpot ${entriesCount === 1 ? 'Entry' : 'Entries'} Added!`);
        setShowRoundUpActivatedToast(true);
        setTimeout(() => {
          setShowRoundUpActivatedToast(false);
        }, 3000);
      }
    }
    
    // Always update the progress bar
    updateProgressBar(multipliedAmount);
    
    // Show purchase success message
    setShowPurchaseSuccess(true);
    setTimeout(() => {
      setShowPurchaseSuccess(false);
    }, 3000);
  };
  
  // Update progress bar and handle completion
  const updateProgressBar = (amount: number) => {
    const newProgress = roundUpProgress + amount;
    
    // Check if we've reached or exceeded $5.00
    if (newProgress >= 5.00) {
      // Calculate overflow
      const overflow = newProgress - 5.00;
      
      // Update wallet balance
      setWalletBalance(prev => prev + 5.00);
      
      // Reset progress bar with overflow
      setRoundUpProgress(overflow);
      
      // Show celebration for $5.00 deposit
      setShowCelebration(true);
      setTimeout(() => setCelebrationOpacity(1), 50);
      
      // Add a visual indicator for the balance update
      // Create a temporary state to highlight the balance
      setBalanceHighlighted(true);
      setTimeout(() => {
        setBalanceHighlighted(false);
      }, 3000);
      
      // Hide celebration after 2.5 seconds
      setTimeout(() => {
        setCelebrationOpacity(0);
        setTimeout(() => setShowCelebration(false), 500);
      }, 2000);
    } else {
      // Just update the progress
      setRoundUpProgress(newProgress);
    }
  };

  // Replace the celebration message with this state-aware version
  const getCelebrationMessage = () => {
    // Only used for the $5.00 deposit celebration now
    return {
      title: `$5.00 added`,
      message: `to your ${getSelectedPartner().name} balance!`
    };
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return `$${amount.toFixed(2)}`;
  };
  
  // Get progress percentage for the progress bar
  const getProgressPercentage = (): number => {
    return (roundUpProgress / 5.00) * 100;
  };

  // Add a function to close the image selection modal and save changes
  const saveImageSelectionAndClose = () => {
    setEditingImageIndex(null);
  };

  // New state variables for jackpot entries
  const [jackpotEntries, setJackpotEntries] = useState<{
    [partnerId: string]: {
      [entryType: string]: number
    }
  }>({
    fanduel: { '0.10': 0 },
    draftkings: { '0.10': 0, '0.25': 0 },
    caesars: { '0.10': 0 },
    mgm: { '0.10': 0 },
    fanatics: { '0.10': 0 },
    novig: { '0.10': 0 }
  });
  
  // Function to add a jackpot entry
  const addJackpotEntry = (entryType: string) => {
    const updatedEntries = {...jackpotEntries};
    if (updatedEntries[selectedPartner] && updatedEntries[selectedPartner][entryType] !== undefined) {
      updatedEntries[selectedPartner][entryType]++;
      setJackpotEntries(updatedEntries);
      
      // Update wallet balance for display purposes
      setWalletBalance(prev => prev - parseFloat(entryType));
      
      // Highlight the balance temporarily
      setBalanceHighlighted(true);
      setTimeout(() => {
        setBalanceHighlighted(false);
      }, 2000);
      
      // Customize the toast for jackpot entries
      setRoundUpActivatedToastMessage(`$${entryType} Jackpot Entry Added!`);
      setShowRoundUpActivatedToast(true);
      setTimeout(() => {
        setShowRoundUpActivatedToast(false);
      }, 3000);
    }
  };
  
  // Get total profit from jackpot entries for current partner
  const getJackpotProfit = (): number => {
    if (!jackpotEntries[selectedPartner]) return 0;
    
    return Object.entries(jackpotEntries[selectedPartner]).reduce((total, [entryType, count]) => {
      return total + (parseFloat(entryType) * count);
    }, 0);
  };

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: gradientAnimation }} />
      <div style={{ backgroundColor: screenColor, minHeight: '100vh', transition: 'background-color 0.5s ease' }}>
        <NavBar />
        
        <main style={{ padding: '2rem', textAlign: 'center' }}>
          <h1 style={{ marginBottom: '2rem', color: 'white', fontSize: '2.5rem', fontWeight: 'bold' }}>
            {getSelectedPartner().name}
          </h1>
          
          {/* Phone UI mockup with logos on both sides */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px' }}>
            {/* Left Side Logo */}
            <div style={{ width: '400px', height: '400px', position: 'relative' }}>
              <Image 
                src="/sidebet-logo.png" 
                alt="SideBet Logo"
                width={400}
                height={400}
                style={{ objectFit: 'contain', cursor: 'pointer' }}
                onClick={startIntroSequence}
              />
            </div>

            {/* Phone UI */}
            <div style={{
              width: '375px',
              height: '812px',
              backgroundColor: '#e0f2e9', // Base color
              border: '12px solid black',
              borderRadius: '48px',
              boxShadow: '0 30px 60px rgba(0,0,0,0.12), inset 0 0 0 2px #ddd, inset 0 0 0 6px rgba(255,255,255,0.05)',
              display: 'flex',
              flexDirection: 'column',
              padding: '0',
              position: 'relative',
              overflow: 'hidden',
              // iPhone 13 specific styling
              margin: '0 auto'
            }}>
              {/* iPhone Notch */}
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
              }}></div>
              
              {/* iPhone Home Indicator */}
              <div style={{
                position: 'absolute',
                bottom: '8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '135px',
                height: '5px',
                backgroundColor: 'rgba(0,0,0,0.5)',
                borderRadius: '3px',
                zIndex: 10
              }}></div>
              
              {showIntroScreens ? (
                /* Intro Screens - clean display with just the image */
                <div style={{
                  height: '100%',
                  width: '100%',
                  position: 'relative',
                  zIndex: 10,
                  overflow: 'hidden',
                  backgroundColor: '#000' // Changed from white to black for better visibility
                }}>
                  <div 
                    style={{
                      height: '100%',
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                      cursor: 'pointer'
                    }}
                    onClick={goToNextIntroScreen}
                  >
                    {/* Full-screen background image - improved styling */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundImage: `url(${getIntroScreens()[currentIntroScreen]?.image || ''})`,
                      backgroundSize: 'contain', // Changed from cover to contain
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      zIndex: 1
                    }} />
                    
                    {/* Skip button */}
                    <div style={{
                      position: 'absolute',
                      top: '20px',
                      right: '20px',
                      zIndex: 2
                    }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowIntroScreens(false);
                        }}
                        style={{
                          backgroundColor: 'rgba(0,0,0,0.5)', // Darker for better visibility
                          color: 'white',
                          border: 'none',
                          borderRadius: '20px',
                          padding: '8px 16px',
                          fontSize: '14px',
                          cursor: 'pointer'
                        }}
                      >
                        Skip
                      </button>
                    </div>
                    
                    {/* Progress dots at bottom */}
                    <div style={{
                      position: 'absolute',
                      bottom: '25px',
                      left: 0,
                      right: 0,
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '8px',
                      zIndex: 2
                    }}>
                      {getIntroScreens().map((_, index) => (
                        <div 
                          key={index}
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: index === currentIntroScreen ? 'white' : 'rgba(255,255,255,0.4)',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                            transition: 'all 0.3s ease'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : showSettings ? (
                /* Settings Screen */
                <div style={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: '#fff',
                  padding: '40px 20px 20px', // Increased top padding for notch
                  display: 'flex',
                  flexDirection: 'column',
                  zIndex: 3,
                  overflow: 'auto',
                  animation: 'slideInFromRight 0.3s ease-out'
                }}>
                  {/* Header with back button */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '25px'
                  }}>
                    <button 
                      onClick={() => {
                        setShowSettings(false);
                        setActiveSettingsSection(null);
                      }}
                      style={{ 
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        marginRight: '15px',
                        color: '#333'
                      }}
                    >
                      ←
                    </button>
                    <h2 style={{ 
                      margin: 0, 
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#333' 
                    }}>
                      {activeSettingsSection ? 'Customize Intro Screens' : 'Settings'}
                    </h2>
                  </div>
                  
                  {activeSettingsSection === null ? (
                    /* Main Settings Options */
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '15px' 
                    }}>
                      {/* Intro Screen Customization */}
                      <SettingsOption 
                        id="intro-screens" 
                        icon="🖼️" 
                        title="Customize Intro Screens" 
                        bgColor="#e6f7ed"
                        onClick={() => setActiveSettingsSection('intro-screens')}
                      />
                      
                      {/* Other settings options */}
                      <SettingsOption 
                        id="round-up" 
                        icon="💰" 
                        title="Round-Up Preferences" 
                        bgColor="#e3f2fd"
                        onClick={() => setActiveSettingsSection('round-up-interactive')}
                      />
                      
                      <SettingsOption 
                        id="notifications" 
                        icon="🔔" 
                        title="Notifications" 
                        bgColor="#ffecb3"
                      />
                      
                      <SettingsOption 
                        id="security" 
                        icon="🔒" 
                        title="Security" 
                        bgColor="#e8eaf6"
                      />
                      
                      <SettingsOption 
                        id="help" 
                        icon="❓" 
                        title="Help & Support" 
                        bgColor="#f3e5f5"
                      />
                      
                      <SettingsOption 
                        id="legal" 
                        icon="📝" 
                        title="Terms & Privacy" 
                        bgColor="#fce4ec"
                      />
                      
                      {/* App version info */}
                      <div style={{ 
                        marginTop: 'auto',
                        padding: '15px',
                        textAlign: 'center',
                        color: '#999',
                        fontSize: '14px'
                      }}>
                        <p style={{ margin: '0 0 5px 0' }}>SideBet v1.0.3</p>
                        <p style={{ margin: 0 }}>© 2024 SideBet. All rights reserved.</p>
                      </div>
                    </div>
                  ) : activeSettingsSection === 'intro-screens' ? (
                    /* Intro Screens Customization */
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '20px' 
                    }}>
                      <p style={{ fontSize: '14px', color: '#666', margin: '0 0 10px' }}>
                        Customize demo screens for {getSelectedPartner().name}. Upload mockups that look like real app screens:
                      </p>
                      
                      {/* Start Demo button at the top */}
                      <button 
                        onClick={() => {
                          setShowSettings(false);
                          setActiveSettingsSection(null);
                          setShowIntroScreens(true);
                          setCurrentIntroScreen(0);
                        }}
                        style={{
                          backgroundColor: getSelectedPartner().color,
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '12px',
                          fontWeight: 'bold',
                          fontSize: '16px',
                          cursor: 'pointer',
                          marginBottom: '10px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          transition: 'transform 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        🎬 Start 4-Screen Demo
                      </button>
                      
                      {/* Partner selector */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                        {partners.map(partner => (
                          <button 
                            key={partner.id}
                            onClick={() => setSelectedPartner(partner.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '10px 15px',
                              borderRadius: '8px',
                              border: `2px solid ${selectedPartner === partner.id ? partner.color : '#ddd'}`,
                              backgroundColor: selectedPartner === partner.id ? `${partner.color}22` : 'white',
                              cursor: 'pointer'
                            }}
                          >
                            {partner.id === 'caesars' ? (
                              <div style={{
                                width: '24px',
                                height: '24px',
                                backgroundColor: partner.color,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                color: 'white',
                                fontSize: '14px'
                              }}>C</div>
                            ) : (
                              <div style={{ width: '24px', height: '24px', position: 'relative' }}>
                                <Image 
                                  src={partner.logoPath}
                                  alt={partner.name}
                                  fill
                                  style={{ objectFit: 'contain' }}
                                />
                              </div>
                            )}
                            <span style={{ fontSize: '14px', fontWeight: selectedPartner === partner.id ? 'bold' : 'normal' }}>
                              {partner.name}
                            </span>
                          </button>
                        ))}
                      </div>
                      
                      {/* Current intro screen images */}
                      <div style={{ marginBottom: '15px' }}>
                        <h3 style={{ fontSize: '16px', margin: '0 0 15px', color: '#333' }}>Demo Flow Screens:</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          {partnerIntroImages[selectedPartner]?.map((image, index) => (
                            <div key={index} style={{ 
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '10px',
                              padding: '15px',
                              backgroundColor: '#f9f9f9',
                              borderRadius: '8px',
                              border: '1px solid #eee'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h4 style={{ margin: 0, fontSize: '15px', color: '#333' }}>
                                  Screen {index + 1}: {
                                    index === 0 ? 'Login' :
                                    index === 1 ? 'Verification' :
                                    index === 2 ? 'Bank Connection' :
                                    index === 3 ? 'Terms & Consent' :
                                    index === 4 ? 'Settings' :
                                    'Welcome'
                                  }
                                </h4>
                                <button 
                                  onClick={() => setEditingImageIndex(index)}
                                  style={{
                                    backgroundColor: getSelectedPartner().color,
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '5px 10px',
                                    fontSize: '12px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Change Image
                                </button>
                              </div>
                              <div style={{ 
                                position: 'relative', 
                                width: '100%', 
                                height: '150px',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                border: '1px solid #ddd'
                              }}>
                                <Image 
                                  src={image}
                                  alt={`Intro Screen ${index + 1}`}
                                  fill
                                  style={{ objectFit: 'cover' }}
                                />
                              </div>
                              <div style={{ fontSize: '13px', color: '#666' }}>
                                {index === 0 && `${getSelectedPartner().name} Login - Show the partner's login screen with username/password fields`}
                                {index === 1 && 'Account Verification - KYC/Identity verification screen (ID upload, selfie, etc.)'}
                                {index === 2 && 'Bank Connection - Plaid or bank linking interface showing bank list'}
                                {index === 3 && 'Terms & Permissions - User consent screens with checkboxes'}
                                {index === 4 && 'Round-Up Settings - Configuration options (multiplier, limits, etc.)'}
                                {index === 5 && 'Welcome Screen - Feature introduction with benefits'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Preview Button */}
                      <button 
                        onClick={() => {
                          setShowSettings(false);
                          setActiveSettingsSection(null);
                          setShowIntroScreens(true);
                          setCurrentIntroScreen(0);
                        }}
                        style={{
                          backgroundColor: getSelectedPartner().color,
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '12px',
                          fontWeight: 'bold',
                          fontSize: '16px',
                          cursor: 'pointer',
                          marginTop: '15px'
                        }}
                      >
                        Preview Demo Flow
                      </button>
                    </div>
                  ) : null}
                
                  {/* Image Selection Modal */}
                  {editingImageIndex !== null && (
                    <div style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      zIndex: 100,
                      padding: '20px'
                    }}
                    onClick={() => setEditingImageIndex(null)}
                    >
                      {/* Modal content */}
                      <div 
                        style={{
                          backgroundColor: 'white',
                          borderRadius: '12px',
                          width: '90%',
                          maxWidth: '800px',
                          maxHeight: '80%',
                          overflow: 'auto',
                          padding: '20px',
                          boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          marginBottom: '20px'
                        }}>
                          <h3 style={{ margin: 0, fontSize: '18px' }}>
                            Select Image for Screen {editingImageIndex + 1}: {
                              editingImageIndex === 0 ? 'Login' :
                              editingImageIndex === 1 ? 'Verification' :
                              editingImageIndex === 2 ? 'Bank Connection' :
                              editingImageIndex === 3 ? 'Terms & Consent' :
                              editingImageIndex === 4 ? 'Settings' :
                              'Welcome'
                            }
                          </h3>
                          <button 
                            onClick={() => setEditingImageIndex(null)}
                            style={{
                              background: 'none',
                              border: 'none',
                              fontSize: '20px',
                              cursor: 'pointer',
                              color: '#999'
                            }}
                          >
                            ✕
                          </button>
                        </div>
                        
                        <p style={{ 
                          margin: '0 0 15px', 
                          color: '#666', 
                          fontSize: '14px' 
                        }}>
                          <strong>Tips for B2B demos:</strong><br/>
                          {editingImageIndex === 0 && "Use a login screen mockup with the partner's branding, showing username/password fields"}
                          {editingImageIndex === 1 && "Show ID verification screens with upload buttons, selfie capture, or verification status"}
                          {editingImageIndex === 2 && "Display Plaid connect screens or bank selection lists with major banks"}
                          {editingImageIndex === 3 && "Show terms acceptance with checkboxes and consent language"}
                          {editingImageIndex === 4 && "Display settings screens with round-up configuration options"}
                          {editingImageIndex === 5 && "Show welcome or success screens highlighting the round-up benefits"}
                        </p>
                        
                        {/* Blank screen option */}
                        <div style={{
                          padding: '10px',
                          marginBottom: '20px',
                          borderBottom: '1px solid #eee'
                        }}>
                          <div
                            onClick={() => updatePartnerIntroImage(editingImageIndex, 'blank')}
                            style={{
                              border: `2px solid ${skippedScreens[editingImageIndex] ? getSelectedPartner().color : '#ddd'}`,
                              borderRadius: '8px',
                              overflow: 'hidden',
                              cursor: 'pointer',
                              padding: '20px',
                              backgroundColor: '#f9f9f9',
                              textAlign: 'center',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '10px'
                            }}
                          >
                            <div style={{ fontSize: '24px' }}>⊝</div>
                            <div style={{ fontWeight: 'bold', color: '#666' }}>Skip This Screen</div>
                            <div style={{ fontSize: '12px', color: '#888' }}>This screen will be skipped in the demo flow</div>
                            
                            {skippedScreens[editingImageIndex] && (
                              <div style={{
                                backgroundColor: getSelectedPartner().color,
                                color: 'white',
                                borderRadius: '4px',
                                padding: '4px 8px',
                                fontSize: '12px',
                                marginTop: '5px'
                              }}>
                                Selected
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Image grid */}
                        <div style={{ 
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                          gap: '10px'
                        }}>
                          {getPartnerFilteredImages(selectedPartner).map((imageUrl, index) => (
                            <div 
                              key={index}
                              onClick={() => updatePartnerIntroImage(editingImageIndex, imageUrl)}
                              style={{
                                border: `2px solid ${partnerIntroImages[selectedPartner][editingImageIndex] === imageUrl && !skippedScreens[editingImageIndex] ? getSelectedPartner().color : 'transparent'}`,
                                borderRadius: '8px',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                position: 'relative',
                                height: '100px',
                                backgroundColor: '#f5f5f5'
                              }}
                            >
                              <Image 
                                src={imageUrl}
                                alt={`Image option ${index + 1}`}
                                fill
                                style={{ 
                                  objectFit: 'contain',
                                  padding: '5px'
                                }}
                              />
                              {partnerIntroImages[selectedPartner][editingImageIndex] === imageUrl && !skippedScreens[editingImageIndex] && (
                                <div style={{
                                  position: 'absolute',
                                  top: '5px',
                                  right: '5px',
                                  backgroundColor: getSelectedPartner().color,
                                  color: 'white',
                                  borderRadius: '50%',
                                  width: '20px',
                                  height: '20px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '12px',
                                  fontWeight: 'bold'
                                }}>
                                  ✓
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        {/* Save Button */}
                        <div style={{
                          marginTop: '20px',
                          display: 'flex',
                          justifyContent: 'center'
                        }}>
                          <button
                            onClick={saveImageSelectionAndClose}
                            style={{
                              backgroundColor: getSelectedPartner().color,
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '10px 20px',
                              fontSize: '16px',
                              fontWeight: 'bold',
                              cursor: 'pointer'
                            }}
                          >
                            Save Selection
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : activeSettingsSection === 'round-up-interactive' ? (
                    /* Round-Up Interactive Tool (shown after intro screens) */
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '20px',
                      height: '100%',
                      padding: '20px'
                    }}>
                      <h2 style={{ 
                        fontSize: '24px', 
                        fontWeight: 'bold',
                        color: '#333',
                        marginBottom: '10px',
                        textAlign: 'center'
                      }}>
                        🎉 Round-Up Settings
                      </h2>
                      
                      {/* Toggle Round-Ups */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '20px',
                        backgroundColor: isRoundUpEnabled ? '#e8f5e9' : '#f8f8f8',
                        borderRadius: '12px',
                        border: `2px solid ${isRoundUpEnabled ? '#4CAF50' : '#eaeaea'}`,
                        transition: 'all 0.3s ease'
                      }}>
                        <div>
                          <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                            Enable Round-Ups
                          </div>
                          <div style={{ fontSize: '14px', color: '#666' }}>
                            Round up purchases to fund your play
                          </div>
                        </div>
                        <label style={{ 
                          position: 'relative',
                          display: 'inline-block',
                          width: '60px',
                          height: '34px'
                        }}>
                          <input
                            type="checkbox"
                            checked={isRoundUpEnabled}
                            onChange={(e) => {
                              setIsRoundUpEnabled(e.target.checked);
                              if (e.target.checked) {
                                setShowRoundUpActivatedToast(true);
                                setRoundUpActivatedToastMessage(`Round-Ups Activated for ${getSelectedPartner().name}!`);
                                setTimeout(() => setShowRoundUpActivatedToast(false), 3000);
                              }
                            }}
                            style={{ display: 'none' }}
                          />
                          <span style={{
                            position: 'absolute',
                            cursor: 'pointer',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: isRoundUpEnabled ? getSelectedPartner().color : '#ccc',
                            transition: '.4s',
                            borderRadius: '34px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
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
                              borderRadius: '50%',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                            }} />
                          </span>
                        </label>
                      </div>
                      
                      {/* Entry Mode Selection */}
                      <div style={{
                        padding: '20px',
                        backgroundColor: '#f8f8f8',
                        borderRadius: '12px',
                        border: '1px solid #eaeaea'
                      }}>
                        <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>
                          Select Entry Mode
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <label style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px',
                            cursor: 'pointer',
                            padding: '12px',
                            backgroundColor: entryMode.includes('-balance') ? `${getSelectedPartner().color}15` : 'white',
                            borderRadius: '8px',
                            border: `2px solid ${entryMode.includes('-balance') ? getSelectedPartner().color : '#ddd'}`,
                            transition: 'all 0.2s ease'
                          }}>
                            <input
                              type="radio"
                              name="entryMode"
                              checked={entryMode.includes('-balance')}
                              onChange={() => setEntryMode(`${selectedPartner}-balance`)}
                              style={{ width: '18px', height: '18px' }}
                            />
                            <div>
                              <div style={{ fontWeight: '500' }}>Balance Mode</div>
                              <div style={{ fontSize: '12px', color: '#666' }}>
                                Round-ups accumulate to $5 then transfer
                              </div>
                            </div>
                          </label>
                          <label style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px',
                            cursor: 'pointer',
                            padding: '12px',
                            backgroundColor: entryMode.includes('-jackpot') ? `${getSelectedPartner().color}15` : 'white',
                            borderRadius: '8px',
                            border: `2px solid ${entryMode.includes('-jackpot') ? getSelectedPartner().color : '#ddd'}`,
                            transition: 'all 0.2s ease'
                          }}>
                            <input
                              type="radio"
                              name="entryMode"
                              checked={entryMode.includes('-jackpot')}
                              onChange={() => setEntryMode(`${selectedPartner}-jackpot`)}
                              style={{ width: '18px', height: '18px' }}
                            />
                            <div>
                              <div style={{ fontWeight: '500' }}>Jackpot Mode 🎰</div>
                              <div style={{ fontSize: '12px', color: '#666' }}>
                                Convert round-ups to jackpot entries
                              </div>
                            </div>
                          </label>
                        </div>
                      </div>
                      
                      {/* Multiplier Selection */}
                      <div style={{
                        padding: '20px',
                        backgroundColor: '#f8f8f8',
                        borderRadius: '12px',
                        border: '1px solid #eaeaea'
                      }}>
                        <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>
                          Round-Up Multiplier
                        </div>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          {['1X', '1.5X', '2X', '3X', '5X'].map(mult => (
                            <button
                              key={mult}
                              onClick={() => setMultiplier(mult)}
                              style={{
                                flex: '1',
                                minWidth: '50px',
                                padding: '12px',
                                backgroundColor: multiplier === mult ? getSelectedPartner().color : 'white',
                                color: multiplier === mult ? 'white' : '#333',
                                border: `2px solid ${multiplier === mult ? getSelectedPartner().color : '#ddd'}`,
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              {mult}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Save and Continue Button */}
                      <button
                        onClick={() => {
                          setShowSettings(false);
                          setActiveSettingsSection(null);
                          if (isRoundUpEnabled) {
                            setShowRoundUpActivatedToast(true);
                            setRoundUpActivatedToastMessage('Settings Saved! Start making purchases to see round-ups in action.');
                            setTimeout(() => setShowRoundUpActivatedToast(false), 4000);
                          }
                        }}
                        style={{
                          marginTop: 'auto',
                          padding: '15px',
                          backgroundColor: getSelectedPartner().color,
                          color: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          fontSize: '16px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          transition: 'transform 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        🚀 Save Settings & Start Playing
                      </button>
                    </div>
                  )}
                </div>
              ) : !showEarnScreen ? (
                /* Regular phone UI content */
                <div style={{ 
                  height: '100%', 
                  overflow: 'auto',
                  padding: '40px 15px 20px',
                  position: 'relative',
                  zIndex: 1 
                }}>
                  {/* Animated gradient background */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(120deg, rgba(255,255,255,0.6), rgba(230,250,240,0.8), rgba(255,255,255,0.6))`,
                    backgroundSize: '300% 300%',
                    animation: 'gradientAnimation 15s ease infinite',
                    zIndex: -1
                  }} />
                  
                  {/* Toast notification for round-up activation */}
                  {showRoundUpActivatedToast && (
                    <div style={{
                      position: 'fixed',
                      top: '20px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'rgba(76, 175, 80, 0.9)',
                      color: 'white',
                      padding: '10px 20px',
                      borderRadius: '20px',
                      boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
                      zIndex: 100,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      animation: 'fadeIn 0.3s ease'
                    }}>
                      <span style={{ fontSize: '20px' }}>🎉</span>
                      <span style={{ fontWeight: 'bold' }}>{roundUpActivatedToastMessage}</span>
                    </div>
                  )}
                  
                  {/* Top bar with settings and earn buttons */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '5px',
                    position: 'sticky',
                    top: 0,
                    backgroundColor: 'rgba(224, 242, 233, 0.8)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 5,
                    paddingTop: '5px'
                  }}>
                    <button 
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        fontSize: '20px', 
                        cursor: 'pointer',
                        color: '#555'
                      }}
                      onClick={() => setShowSettings(true)}
                    >⚙️</button>
                    <button 
                      onClick={toggleEarnScreen}
                      style={{ 
                        background: '#4CAF50', 
                        border: 'none', 
                        borderRadius: '5px', 
                        padding: '5px 10px', 
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      Earn $10
                    </button>
                  </div>
                  
                  {/* Middle logo */}
                  <div style={{ textAlign: 'center', margin: '15px 0' }}>
                    {getSelectedPartner().id === 'caesars' ? (
                      <div style={{
                        fontSize: '42px',
                        fontWeight: 'bold',
                        color: getSelectedPartner().color,
                        margin: '10px 0'
                      }}>
                        C
                      </div>
                    ) : (
                      <div style={{ position: 'relative', width: '100px', height: '80px', margin: '0 auto' }}>
                        <Image 
                          src={getSelectedPartner().logoPath}
                          alt={`${getSelectedPartner().name} Logo`}
                          fill
                          style={{
                            objectFit: 'contain'
                          }}
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Balance display - Always shows balance */}
                  <div style={{ 
                    textAlign: 'center', 
                    margin: '0 0 15px',
                    padding: '10px 15px',
                    backgroundColor: balanceHighlighted ? 'rgba(76, 175, 80, 0.15)' : 'rgba(255, 255, 255, 0.5)',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    animation: balanceHighlighted ? 'pulse 1.5s ease-in-out infinite' : 'none'
                  }}>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                      {getSelectedPartner().name} Balance
                    </div>
                    <div style={{ 
                      fontSize: '24px', 
                      fontWeight: 'bold', 
                      color: '#4CAF50'
                    }}>
                      ${walletBalance.toFixed(2)}
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div style={{ textAlign: 'center', margin: '10px 0 20px' }}>
                    <h3 style={{ fontSize: '16px', margin: '0 0 5px' }}>Round-Up Spare Change</h3>
                    <p style={{ fontSize: '13px', color: '#555', margin: '5px 0 10px' }}>
                      Automatically round up your purchases to the nearest dollar and bet the difference on your favorite sportsbook or casino games.
                    </p>
                  </div>
                  
                  {/* Toggle row */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '15px',
                    borderBottom: '1px solid #ddd',
                    marginBottom: '20px'
                  }}>
                    <span style={{ 
                      fontSize: '15px', 
                      fontWeight: 500,
                      color: '#333' 
                    }}>Toggle Round-Ups</span>
                    <label style={{ 
                      position: 'relative',
                      display: 'inline-block',
                      width: '46px',
                      height: '22px'
                    }}>
                      <input 
                        type="checkbox" 
                        checked={isRoundUpEnabled}
                        onChange={handleToggleChange}
                        style={{ 
                          opacity: 0,
                          width: 0,
                          height: 0
                        }}
                      />
                      <span style={{ 
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: isRoundUpEnabled ? '#4CAF50' : '#ccc',
                        borderRadius: '34px',
                        transition: 'background-color 0.4s'
                      }}></span>
                      <span style={{
                        position: 'absolute',
                        height: '14px',
                        width: '14px',
                        left: isRoundUpEnabled ? '28px' : '4px',
                        bottom: '4px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        transition: 'left 0.4s'
                      }}></span>
                    </label>
                  </div>
                  
                  {/* Multiplier section */}
                  <div style={{ 
                    padding: '15px',
                    borderBottom: '1px solid #ddd',
                    marginBottom: '20px'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ 
                          fontSize: '15px', 
                          fontWeight: 500,
                          color: '#333' 
                        }}>
                          Multiplier
                        </span>
                        <div 
                          style={{ 
                            marginLeft: '6px', 
                            position: 'relative',
                            cursor: 'pointer' 
                          }}
                          onMouseEnter={() => setShowMultiplierInfo(true)}
                          onMouseLeave={() => setShowMultiplierInfo(false)}
                        >
                          <span style={{ 
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            backgroundColor: '#e0e0e0',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            color: '#666'
                          }}>
                            i
                          </span>
                          
                          {/* Tooltip */}
                          {showMultiplierInfo && (
                            <div style={{
                              position: 'absolute',
                              top: '-5px',
                              left: '25px',
                              width: '220px',
                              backgroundColor: 'rgba(0, 0, 0, 0.8)',
                              color: 'white',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              zIndex: 20,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                              animation: 'fadeIn 0.2s ease'
                            }}>
                              This multiplier applies to your round-ups, and enhances how much in round-ups you are using on this gaming site.
                              <div style={{
                                position: 'absolute',
                                top: '10px',
                                left: '-5px',
                                width: '10px',
                                height: '10px',
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                transform: 'rotate(45deg)'
                              }}></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Multiplier options */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '100%',
                      backgroundColor: '#f5f5f5',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      marginTop: '5px'
                    }}>
                      {["1X", "1.5X", "2X", "3X", "5X"].map((value) => (
                        <div
                          key={value}
                          onClick={() => handleMultiplierChange(value)}
                          style={{
                            flex: 1,
                            padding: '8px 0',
                            textAlign: 'center',
                            fontSize: '14px',
                            fontWeight: multiplier === value ? 'bold' : 'normal',
                            cursor: 'pointer',
                            backgroundColor: multiplier === value ? '#4CAF50' : 'transparent',
                            color: multiplier === value ? 'white' : '#333',
                            transition: 'all 0.2s ease',
                            borderRight: value !== "5X" ? '1px solid #e0e0e0' : 'none'
                          }}
                        >
                          {value}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Progress bar - shows only when round-ups are enabled */}
                  {isRoundUpEnabled && (
                    <div style={{ 
                      padding: '15px', 
                      borderBottom: '1px solid #ddd',
                      marginBottom: '20px',
                      animation: 'fadeIn 0.5s ease-in-out'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        marginBottom: '4px' 
                      }}>
                        <span style={{ fontSize: '14px', fontWeight: 500 }}>Round-Up Progress</span>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: '#4CAF50' }}>{formatCurrency(roundUpProgress)}</span>
                      </div>
                      <div style={{ 
                        width: '100%', 
                        height: '14px', 
                        backgroundColor: '#e0e0e0', 
                        borderRadius: '7px',
                        overflow: 'hidden',
                        border: '1px solid #d0d0d0'
                      }}>
                        <div style={{ 
                          width: `${getProgressPercentage()}%`, 
                          height: '100%', 
                          background: `linear-gradient(90deg, ${screenColor}, #4CAF50, ${screenColor})`,
                          backgroundSize: '200% 100%',
                          borderRadius: '7px',
                          transition: 'width 1s ease-in-out',
                          animation: 'progressGradientAnimation 3s ease infinite'
                        }}></div>
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        marginTop: '4px',
                        fontSize: '11px',
                        color: '#888'
                      }}>
                        <span>{formatCurrency(0)}</span>
                        <span>Next Deposit: {formatCurrency(5)}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Entry mode row */}
                  <div style={{ 
                    padding: '15px',
                    borderBottom: '1px solid #ddd',
                    marginBottom: '20px',
                    backgroundColor: '#f0f7ff',
                    borderRadius: '10px',
                    border: '1px solid #d0e1f9'
                  }}>
                    <div style={{ 
                      marginBottom: '12px', 
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#2c3e50',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ 
                          width: '16px', 
                          height: '16px', 
                          backgroundColor: entryMode.includes('-jackpot') ? '#FFC107' : '#4CAF50', 
                          borderRadius: '50%',
                          display: 'inline-block'
                        }}></span>
                        <span>Current Mode:</span>
                      </div>
                      <span style={{ 
                        color: entryMode.includes('-jackpot') ? '#f57c00' : '#2196F3',
                        fontWeight: 'bold'
                      }}>
                        {getEntryModeDisplay()}
                      </span>
                    </div>
                    
                    {/* Change option */}
                    <div style={{ 
                      position: 'relative',
                      marginTop: '8px',
                      textAlign: 'center'
                    }}>
                      <button 
                        onClick={toggleEntryModeDropdown}
                        style={{
                          fontSize: '14px',
                          backgroundColor: entryMode.includes('-jackpot') ? '#FF9800' : '#2196F3',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '8px 16px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          width: '100%',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <span>Change Mode</span>
                        <span style={{ fontSize: '12px' }}>▼</span>
                      </button>
                      
                      {/* Entry mode dropdown */}
                      {showEntryModeDropdown && (
                        <div style={{
                          position: 'absolute',
                          top: 'calc(100% + 5px)',
                          left: 0,
                          right: 0,
                          backgroundColor: 'white',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          borderRadius: '8px',
                          zIndex: 50,
                          overflow: 'hidden',
                          animation: 'fadeIn 0.2s ease-in-out'
                        }}>
                          {/* Balance Option */}
                          <div 
                            onClick={() => {
                              setEntryMode(`${selectedPartner}-balance`);
                              setShowEntryModeDropdown(false);
                            }}
                            style={{
                              padding: '12px 15px',
                              borderBottom: '1px solid #eee',
                              cursor: 'pointer',
                              fontSize: '14px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              backgroundColor: entryMode === `${selectedPartner}-balance` ? '#e3f2fd' : 'white',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ 
                                width: '14px', 
                                height: '14px', 
                                backgroundColor: '#4CAF50', 
                                borderRadius: '50%', 
                                display: 'inline-block' 
                              }}></span>
                              <span>{getSelectedPartner().name} Balance</span>
                            </div>
                            {entryMode === `${selectedPartner}-balance` && (
                              <span style={{ color: '#4CAF50', fontSize: '14px' }}>✓</span>
                            )}
                          </div>
                          
                          {/* Jackpot Option */}
                          <div 
                            onClick={() => {
                              setEntryMode(`${selectedPartner}-jackpot`);
                              setShowEntryModeDropdown(false);
                            }}
                            style={{
                              padding: '12px 15px',
                              borderBottom: '1px solid #eee',
                              cursor: 'pointer',
                              fontSize: '14px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              backgroundColor: entryMode === `${selectedPartner}-jackpot` ? '#fff8e1' : 'white',
                            }}
                          >
                            <div style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between',
                              width: '100%',
                              alignItems: 'center' 
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ 
                                  width: '14px', 
                                  height: '14px', 
                                  backgroundColor: '#FFC107', 
                                  borderRadius: '50%', 
                                  display: 'inline-block' 
                                }}></span>
                                <span>{getSelectedPartner().name} Jackpot</span>
                                <span style={{ fontSize: '16px' }}>🎰</span>
                              </div>
                              {entryMode === `${selectedPartner}-jackpot` && (
                                <span style={{ color: '#FF9800', fontSize: '14px' }}>✓</span>
                              )}
                            </div>
                          </div>
                          
                          {/* Futures Option */}
                          <div style={{
                            padding: '12px 15px',
                            borderBottom: '1px solid #eee',
                            cursor: 'pointer',
                            fontSize: '14px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            position: 'relative',
                            backgroundColor: entryMode.includes('-futures') ? '#e8eaf6' : 'white',
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ 
                                width: '14px', 
                                height: '14px', 
                                backgroundColor: '#673AB7', 
                                borderRadius: '50%', 
                                display: 'inline-block' 
                              }}></span>
                              <span>{getSelectedPartner().name} Futures</span>
                            </div>
                            <span 
                              onClick={toggleSportsOptions}
                              style={{ 
                                fontSize: '16px',
                                color: '#777' 
                              }}
                            >
                              →
                            </span>
                            
                            {/* Sports options sub-menu */}
                            {showSportsOptions && (
                              <div style={{
                                position: 'absolute',
                                top: 0,
                                left: '100%',
                                backgroundColor: 'white',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                borderRadius: '8px',
                                width: '120px',
                                zIndex: 11,
                                animation: 'fadeIn 0.2s ease-in-out'
                              }}>
                                {['NBA', 'NFL', 'MLB', 'Golf'].map((sport) => (
                                  <div 
                                    key={sport}
                                    onClick={() => selectSport(sport)}
                                    style={{
                                      padding: '10px 15px',
                                      borderBottom: '1px solid #eee',
                                      cursor: 'pointer',
                                      fontSize: '14px',
                                      whiteSpace: 'nowrap',
                                      backgroundColor: entryMode === `${selectedPartner}-futures-${sport.toLowerCase()}` ? '#e8eaf6' : 'white',
                                    }}
                                  >
                                    {sport}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Mode description */}
                    <div style={{ 
                      marginTop: '12px', 
                      fontSize: '13px', 
                      color: '#666',
                      padding: '8px',
                      backgroundColor: 'rgba(255,255,255,0.7)',
                      borderRadius: '6px'
                    }}>
                      {entryMode.includes('-jackpot') ? 
                        "Round-ups are converted to Jackpot entries when they reach $0.10." : 
                        "Round-ups accumulate until they reach $5.00, then transfer to your balance."
                      }
                    </div>
                  </div>
                  
                  {/* Connect Bank section */}
                  <div style={{ padding: '15px', marginTop: '5px' }}>
                    <h4 style={{ marginBottom: '10px', fontSize: '15px' }}>Connect Bank</h4>
                    
                    {/* Default connected bank */}
                    <div style={{ 
                      border: '1px solid #e0e0e0', 
                      borderRadius: '5px',
                      padding: '8px',
                      marginBottom: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ 
                          width: '30px',
                          height: '30px',
                          backgroundColor: '#f57c00', 
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '8px',
                          fontWeight: 'bold',
                          color: 'white',
                          fontSize: '12px'
                        }}>
                          PNC
                        </div>
                        <div>
                          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>PNC Bank</div>
                          <div style={{ fontSize: '11px', color: '#666' }}>Checking •••• 4567</div>
                        </div>
                      </div>
                      <div style={{ 
                        fontSize: '11px',
                        padding: '3px 8px',
                        backgroundColor: '#e6f7ed', 
                        color: '#43a047',
                        borderRadius: '12px',
                        fontWeight: '500'
                      }}>
                        Connected
                      </div>
                    </div>
                    
                    <button style={{ 
                      backgroundColor: '#1976D2',
                      color: 'white',
                      border: 'none',
                      padding: '8px 15px',
                      width: '100%',
                      borderRadius: '5px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      marginBottom: '15px',
                      fontSize: '14px'
                    }}>
                      Add Bank
                    </button>
                    
                    {/* Promo Code field */}
                    <div style={{ marginTop: '15px', textAlign: 'center' }}>
                      <div style={{ 
                        marginBottom: '10px', 
                        fontSize: '15px',
                        fontWeight: 500,
                        color: '#333'
                      }}>
                        Promo Code
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <input 
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          style={{
                            width: '70%',
                            padding: '10px',
                            borderRadius: '8px',
                            border: '1px solid #d0d0d0',
                            fontSize: '14px',
                            textAlign: 'center',
                            backgroundColor: 'white',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            outline: 'none',
                            fontWeight: '500',
                            letterSpacing: '1px'
                          }}
                        />
                        <button
                          onClick={savePromoCode}
                          style={{
                            padding: '10px 15px',
                            backgroundColor: promoCodeSaved ? '#4CAF50' : '#1976D2',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s ease'
                          }}
                        >
                          {promoCodeSaved ? 'Saved!' : 'Apply'}
                        </button>
                      </div>
                      {promoCodeSaved && (
                        <div style={{
                          marginTop: '8px',
                          fontSize: '13px',
                          color: '#4CAF50',
                          fontWeight: '500',
                          animation: 'fadeIn 0.3s ease'
                        }}>
                          Promo code applied successfully!
                        </div>
                      )}
                    </div>
                    
                    {/* Jackpot Entries Section - only shown when in jackpot mode */}
                    {entryMode.includes('-jackpot') && (
                      <div style={{ 
                        marginTop: '20px',
                        padding: '15px',
                        borderTop: '1px solid #ddd',
                        animation: 'fadeIn 0.3s ease-in-out'
                      }}>
                        <h4 style={{ 
                          marginBottom: '15px', 
                          fontSize: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <span style={{ fontSize: '22px' }}>🎰</span>
                          Jackpot Entries
                        </h4>
                        
                        {/* Round-up to Jackpot explanation */}
                        <div style={{
                          backgroundColor: '#f0f7ff',
                          padding: '12px',
                          borderRadius: '8px',
                          marginBottom: '15px',
                          fontSize: '13px',
                          color: '#333',
                          border: '1px solid #e1e9fa'
                        }}>
                          <div style={{ fontWeight: 'bold', marginBottom: '6px', fontSize: '14px' }}>
                            How Round-Ups Work with Jackpot:
                          </div>
                          <div style={{ lineHeight: '1.4' }}>
                            When your round-up value reaches a threshold, it automatically converts to Jackpot entries:
                            <ul style={{ margin: '6px 0 0', paddingLeft: '16px' }}>
                              <li style={{ marginBottom: '4px' }}>$0.10 = One basic entry</li>
                              {selectedPartner === 'draftkings' && (
                                <li style={{ marginBottom: '4px' }}>$0.25 = One premium entry (3x win chance)</li>
                              )}
                              <li>Higher multipliers = More entries</li>
                            </ul>
                          </div>
                        </div>
                        
                        {/* Entry buttons */}
                        <div style={{ 
                          display: 'flex',
                          gap: '10px',
                          marginBottom: '20px'
                        }}>
                          {/* $0.10 entry - available for all partners */}
                          <button 
                            onClick={() => addJackpotEntry('0.10')}
                            style={{
                              flex: 1,
                              padding: '12px 0',
                              backgroundColor: getSelectedPartner().color,
                              color: 'white',
                              fontWeight: 'bold',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '14px',
                              cursor: 'pointer',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}
                          >
                            Buy $0.10 Entry
                          </button>
                          
                          {/* $0.25 entry - only for DraftKings */}
                          {selectedPartner === 'draftkings' && (
                            <button 
                              onClick={() => addJackpotEntry('0.25')}
                              style={{
                                flex: 1,
                                padding: '12px 0',
                                backgroundColor: '#333',
                                color: 'white',
                                fontWeight: 'bold',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                cursor: 'pointer',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                              }}
                            >
                              Buy $0.25 Entry
                            </button>
                          )}
                        </div>
                        
                        {/* Entry stats */}
                        <div style={{
                          marginTop: '15px',
                          backgroundColor: '#f9f9f9',
                          padding: '15px',
                          borderRadius: '8px'
                        }}>
                          <div style={{ 
                            fontSize: '14px', 
                            fontWeight: 'bold',
                            marginBottom: '10px',
                            color: '#333'
                          }}>
                            Jackpot Statistics
                          </div>
                          
                          <div style={{ fontSize: '13px', color: '#555' }}>
                            <div style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              marginBottom: '8px',
                              padding: '8px',
                              backgroundColor: 'rgba(0,0,0,0.04)',
                              borderRadius: '4px'
                            }}>
                              <span>$0.10 Entries:</span>
                              <span style={{ fontWeight: '500' }}>{jackpotEntries[selectedPartner]['0.10']}</span>
                            </div>
                            
                            {selectedPartner === 'draftkings' && (
                              <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                marginBottom: '8px',
                                padding: '8px',
                                backgroundColor: 'rgba(0,0,0,0.04)',
                                borderRadius: '4px'
                              }}>
                                <span>$0.25 Entries:</span>
                                <span style={{ fontWeight: '500' }}>{jackpotEntries[selectedPartner]['0.25']}</span>
                              </div>
                            )}
                            
                            <div style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              marginTop: '12px',
                              padding: '10px',
                              backgroundColor: `${getSelectedPartner().color}22`,
                              borderRadius: '4px',
                              fontWeight: 'bold',
                              color: getSelectedPartner().color
                            }}>
                              <span>Total Revenue:</span>
                              <span>${getJackpotProfit().toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Jackpot progress from round-ups */}
                        <div style={{ marginTop: '15px' }}>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginBottom: '6px' 
                          }}>
                            <span style={{ 
                              fontSize: '14px', 
                              fontWeight: '500' 
                            }}>
                              Next Entry Progress
                            </span>
                            <span style={{ 
                              fontSize: '14px', 
                              color: '#4CAF50', 
                              fontWeight: '500' 
                            }}>
                              {formatCurrency(roundUpProgress)} / $0.10
                            </span>
                          </div>
                          
                          <div style={{ 
                            height: '10px', 
                            backgroundColor: '#eee',
                            borderRadius: '5px',
                            overflow: 'hidden'
                          }}>
                            <div style={{ 
                              width: `${Math.min((roundUpProgress / 0.10) * 100, 100)}%`,
                              height: '100%',
                              backgroundColor: getSelectedPartner().color,
                              borderRadius: '5px',
                              transition: 'width 0.3s ease'
                            }}></div>
                          </div>
                          
                          <div style={{ 
                            fontSize: '12px', 
                            color: '#777', 
                            marginTop: '5px',
                            fontStyle: 'italic'
                          }}>
                            Round-ups automatically purchase entries when they reach $0.10
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Earn $10 Screen */
                <div style={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: '#fff',
                  padding: '40px 20px 20px', // Increased top padding for notch
                  display: 'flex',
                  flexDirection: 'column',
                  zIndex: 3,
                  overflow: 'auto',
                  animation: 'slideInFromRight 0.3s ease-out'
                }}>
                  {/* Header with back button */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '20px'
                  }}>
                    <button 
                      onClick={toggleEarnScreen}
                      style={{ 
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        marginRight: '10px',
                        color: '#333'
                      }}
                    >
                      ←
                    </button>
                    <h2 style={{ 
                      margin: 0, 
                      fontSize: '20px',
                      fontWeight: '600' 
                    }}>Earn $10</h2>
                  </div>
                  
                  {/* Content */}
                  <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h3 style={{ 
                      fontSize: '24px', 
                      margin: '0 0 15px',
                      color: '#333' 
                    }}>
                      Get $10 for every friend
                    </h3>
                    <p style={{ 
                      fontSize: '15px', 
                      color: '#666',
                      margin: '0 0 25px',
                      lineHeight: '1.5'
                    }}>
                      When your friends sign up with your referral link and make their first transaction, you both get $10!
                    </p>
                    
                    {/* Share button */}
                    <button 
                      onClick={toggleShareLink}
                      style={{
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        padding: '12px 30px',
                        borderRadius: '24px',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
                        transition: 'transform 0.2s'
                      }}
                      onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                      onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      Share Referral Link
                    </button>
                  </div>
                  
                  {/* Referral link section */}
                  {showShareLink && (
                    <div style={{
                      backgroundColor: '#f5f5f5',
                      padding: '20px',
                      borderRadius: '12px',
                      marginBottom: '20px',
                      animation: 'fadeIn 0.3s ease'
                    }}>
                      <div style={{ 
                        fontSize: '14px', 
                        color: '#666',
                        marginBottom: '10px' 
                      }}>
                        Your referral link:
                      </div>
                      <div style={{
                        backgroundColor: 'white',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #e0e0e0',
                        marginBottom: '15px',
                        fontSize: '13px',
                        wordBreak: 'break-all',
                        fontFamily: 'monospace',
                        color: '#333'
                      }}>
                        {referralLink}
                      </div>
                      <button 
                        onClick={copyToClipboard}
                        style={{
                          backgroundColor: linkCopied ? '#4CAF50' : '#1976D2',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          fontWeight: '500',
                          fontSize: '14px',
                          cursor: 'pointer',
                          width: '100%',
                          transition: 'background-color 0.3s'
                        }}
                      >
                        {linkCopied ? 'Copied!' : 'Copy Link'}
                      </button>
                    </div>
                  )}
                  
                  {/* How it works section */}
                  <div style={{ marginTop: 'auto' }}>
                    <h4 style={{ 
                      fontSize: '16px', 
                      margin: '0 0 15px',
                      color: '#333' 
                    }}>
                      How it works:
                    </h4>
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '12px' 
                    }}>
                      {[
                        { num: '1', text: 'Share your unique referral link' },
                        { num: '2', text: 'Friend signs up and connects bank' },
                        { num: '3', text: 'They make their first transaction' },
                        { num: '4', text: 'You both receive $10!' }
                      ].map((step) => (
                        <div key={step.num} style={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          gap: '12px' 
                        }}>
                          <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: '#e6f7ed',
                            color: '#4CAF50',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            flexShrink: 0
                          }}>
                            {step.num}
                          </div>
                          <span style={{ 
                            fontSize: '14px',
                            color: '#555' 
                          }}>
                            {step.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Celebration overlay */}
              {showCelebration && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: lastPurchase && lastPurchase.multipliedAmount + roundUpProgress > 5.0 ? 'flex-start' : 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  zIndex: 10,
                  opacity: celebrationOpacity,
                  transition: 'opacity 0.5s ease-in-out',
                  padding: lastPurchase && lastPurchase.multipliedAmount + roundUpProgress > 5.0 ? '60px 0 0 0' : '0'
                }}>
                  <div style={{
                    fontSize: lastPurchase && lastPurchase.multipliedAmount + roundUpProgress > 5.0 ? '32px' : '26px',
                    fontWeight: 'bold',
                    color: 'white',
                    textShadow: '0 2px 4px rgba(0,0,0,0.4)',
                    marginBottom: '15px',
                    transform: 'scale(1.1)',
                    transition: 'transform 0.3s ease-out'
                  }}>
                    {getCelebrationMessage().title}
                  </div>
                  <div style={{
                    fontSize: lastPurchase && lastPurchase.multipliedAmount + roundUpProgress > 5.0 ? '20px' : '16px',
                    color: 'white',
                    textAlign: 'center',
                    maxWidth: '80%',
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                  }}>
                    {getCelebrationMessage().message}
                  </div>
                </div>
              )}
            </div>

            {/* Right Side Purchase Simulator */}
            <div style={{ width: '400px', height: '600px', position: 'relative', display: 'flex', flexDirection: 'column', backgroundColor: '#f9f9f9', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
              <div style={{ padding: '16px', backgroundColor: screenColor, color: 'white', fontWeight: 'bold', fontSize: '18px', textAlign: 'center' }}>
                Simulate Purchases
              </div>
              
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', flexGrow: 1, overflow: 'auto' }}>
                <button 
                  onClick={generateRandomPurchase}
                  style={{
                    backgroundColor: screenColor,
                    color: 'white',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'transform 0.1s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                  onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                  onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  Make a Random Purchase
                </button>
                
                {/* Purchase success message */}
                {showPurchaseSuccess && lastPurchase && (
                  <div style={{
                    backgroundColor: '#e6f7ed',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '10px',
                    animation: 'fadeIn 0.3s ease-in-out',
                    border: '1px solid #c8e6c9'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <div style={{ width: '28px', height: '28px', position: 'relative', overflow: 'hidden', borderRadius: '4px' }}>
                        {lastPurchase.logoPath && (
                          <Image 
                            src={lastPurchase.logoPath}
                            alt={lastPurchase.merchant}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        )}
                      </div>
                      <div style={{ fontWeight: 'bold', color: '#2e7d32' }}>
                        Purchase at {lastPurchase.merchant} Completed!
                      </div>
                    </div>
                    <div style={{ fontSize: '14px', color: '#1b5e20' }}>
                      {formatCurrency(lastPurchase.multipliedAmount)} was added to your round-up progress.
                      {entryMode.includes('-jackpot') && lastPurchase.multipliedAmount >= 0.10 && (
                        <div style={{ marginTop: '4px', fontWeight: 'bold' }}>
                          {Math.floor(lastPurchase.multipliedAmount / 0.10)} new Jackpot {Math.floor(lastPurchase.multipliedAmount / 0.10) === 1 ? 'entry' : 'entries'} added!
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div style={{ fontWeight: 'bold', fontSize: '16px', borderBottom: '1px solid #e0e0e0', paddingBottom: '8px', marginTop: '10px' }}>
                  Recent Transactions
                </div>
                
                {transactions.length === 0 ? (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '20px', 
                    color: '#757575',
                    fontSize: '14px'
                  }}>
                    No transactions yet. Make a purchase to see them here.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {transactions.map(transaction => (
                      <div key={transaction.id} style={{
                        padding: '12px',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        animation: transaction === lastPurchase ? 'fadeIn 0.5s ease' : undefined
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '24px', height: '24px', position: 'relative', overflow: 'hidden', borderRadius: '4px' }}>
                              {/* Use the transaction's logoPath */}
                              {transaction.logoPath && (
                                <Image 
                                  src={transaction.logoPath}
                                  alt={transaction.merchant}
                                  fill
                                  style={{ objectFit: 'cover' }}
                                />
                              )}
                            </div>
                            <span style={{ fontWeight: 'bold', fontSize: '15px' }}>{transaction.merchant}</span>
                          </div>
                          <span style={{ fontSize: '15px' }}>{formatCurrency(transaction.amount)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#666' }}>
                          <span>{new Date(transaction.date).toLocaleString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            hour: 'numeric', 
                            minute: 'numeric', 
                            hour12: true 
                          })}</span>
                        </div>
                        <div style={{ 
                          marginTop: '8px', 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '6px 10px',
                          backgroundColor: '#f3f8f3',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}>
                          <span style={{ color: '#555' }}>
                            {entryMode.includes('-jackpot') ? 'Jackpot Round-up:' : 'Round-up to Balance:'}
                          </span>
                          <span style={{ 
                            fontWeight: 'bold', 
                            color: screenColor 
                          }}>
                            +{formatCurrency(transaction.multipliedAmount)}
                            {transaction.multipliedAmount !== transaction.roundUpAmount && (
                              <span style={{ fontSize: '12px', marginLeft: '3px', color: '#888' }}>
                                ({multiplier})
                              </span>
                            )}
                          </span>
                        </div>
                        
                        {/* Show jackpot entries if in jackpot mode and amount is at least 0.10 */}
                        {entryMode.includes('-jackpot') && transaction.multipliedAmount >= 0.10 && (
                          <div style={{ 
                            marginTop: '5px', 
                            padding: '6px 10px',
                            backgroundColor: `${getSelectedPartner().color}15`,
                            borderRadius: '6px',
                            fontSize: '13px',
                            display: 'flex',
                            justifyContent: 'space-between'
                          }}>
                            <span style={{ color: '#555' }}>Jackpot Entries:</span>
                            <span style={{ fontWeight: 'bold', color: getSelectedPartner().color }}>
                              +{Math.floor(transaction.multipliedAmount / 0.10)}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Partner dropdown - at the bottom of the main screen */}
          <div style={{ 
            marginTop: '40px',
            marginBottom: '20px',
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
          }}>
            <div style={{ position: 'relative', width: '300px' }}>
              <button
                onClick={() => setShowPartnerDropdown(!showPartnerDropdown)}
                style={{
                  backgroundColor: screenColor,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 20px',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                  fontWeight: 'bold',
                  width: '100%'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {getSelectedPartner().id === 'caesars' ? (
                    <div style={{
                      width: '28px',
                      height: '28px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      color: screenColor,
                      fontSize: '14px'
                    }}>C</div>
                  ) : (
                    <div style={{ 
                      width: '28px',
                      height: '28px',
                      position: 'relative',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      overflow: 'hidden'
                    }}>
                      <Image 
                        src={getSelectedPartner().logoPath}
                        alt={getSelectedPartner().name}
                        fill
                        style={{ objectFit: 'contain', padding: '2px' }}
                      />
                    </div>
                  )}
                  <span>{getSelectedPartner().name}</span>
                </div>
                <span style={{ fontSize: '14px' }}>▼</span>
              </button>
              
              {showPartnerDropdown && (
                <div style={{
                  position: 'absolute',
                  bottom: 'calc(100% + 10px)',
                  left: '0',
                  right: '0',
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '12px',
                  boxShadow: '0 -5px 20px rgba(0,0,0,0.25)',
                  zIndex: 100,
                  overflow: 'hidden'
                }}>
                  {partners.map(partner => (
                    <div
                      key={partner.id}
                      onClick={() => {
                        handlePartnerSelect(partner.id, partner.color);
                        setShowPartnerDropdown(false);
                      }}
                      style={{
                        padding: '15px',
                        borderBottom: '1px solid #eee',
                        cursor: 'pointer',
                        backgroundColor: selectedPartner === partner.id ? `${partner.color}22` : 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {partner.id === 'caesars' ? (
                          <div style={{
                            width: '32px',
                            height: '32px',
                            backgroundColor: partner.color,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            color: 'white',
                            fontSize: '16px'
                          }}>C</div>
                        ) : (
                          <div style={{ width: '32px', height: '32px', position: 'relative' }}>
                            <Image 
                              src={partner.logoPath}
                              alt={partner.name}
                              fill
                              style={{ objectFit: 'contain' }}
                            />
                          </div>
                        )}
                        <span style={{ fontSize: '16px' }}>{partner.name}</span>
                      </div>
                      {selectedPartner === partner.id && (
                        <span style={{ color: partner.color, fontWeight: 'bold', fontSize: '16px' }}>✓</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Jackpot Counter - Fixed at the bottom of the screen, only shown when in jackpot mode */}
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
              alignItems: 'center',
              zIndex: 90,
              boxShadow: '0 -4px 10px rgba(0,0,0,0.2)'
            }}>
              <div style={{
                maxWidth: '1200px',
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '20px'
              }}>
                {/* Jackpot Logo and Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ 
                    width: '50px', 
                    height: '50px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundColor: getSelectedPartner().color,
                    borderRadius: '50%',
                    boxShadow: '0 0 10px rgba(255,255,255,0.3)'
                  }}>
                    {getSelectedPartner().id === 'caesars' ? (
                      <div style={{ fontWeight: 'bold', fontSize: '22px', color: 'white' }}>C</div>
                    ) : (
                      <div style={{ width: '40px', height: '40px', position: 'relative' }}>
                        <Image 
                          src={getSelectedPartner().logoPath}
                          alt={getSelectedPartner().name}
                          fill
                          style={{ objectFit: 'contain' }}
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{getSelectedPartner().name} Jackpot</div>
                    <div style={{ fontSize: '14px', color: '#aaa' }}>Built with SideBet technology</div>
                  </div>
                </div>
                
                {/* Toggle button at bottom left */}
                <div style={{ position: 'absolute', left: '20px', bottom: '20px', zIndex: 100 }}>
                  <button 
                    onClick={() => setShowEntryModeDropdown(!showEntryModeDropdown)}
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px',
                      padding: '10px 15px',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    <span>Toggle Mode</span>
                    <span>▼</span>
                  </button>
                  
                  {showEntryModeDropdown && (
                    <div style={{
                      position: 'absolute',
                      bottom: 'calc(100% + 10px)',
                      left: 0,
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      boxShadow: '0 -4px 10px rgba(0,0,0,0.2)',
                      zIndex: 100,
                      width: '200px',
                      overflow: 'hidden'
                    }}>
                      <div 
                        onClick={() => {
                          setEntryMode(`${selectedPartner}-balance`);
                          setShowEntryModeDropdown(false);
                        }}
                        style={{
                          padding: '12px 15px',
                          borderBottom: '1px solid #eee',
                          cursor: 'pointer'
                        }}
                      >
                        Balance Mode
                      </div>
                      <div 
                        onClick={() => {
                          setEntryMode(`${selectedPartner}-jackpot`);
                          setShowEntryModeDropdown(false);
                        }}
                        style={{
                          padding: '12px 15px',
                          backgroundColor: entryMode.includes('-jackpot') ? `${getSelectedPartner().color}22` : 'white',
                          cursor: 'pointer'
                        }}
                      >
                        Jackpot Mode
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Jackpot Stats */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                  {/* Entry Stats */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: getSelectedPartner().color }}>
                      {jackpotEntries[selectedPartner]['0.10']}
                    </div>
                    <div style={{ fontSize: '14px', color: '#aaa' }}>$0.10 Entries</div>
                  </div>
                  
                  {selectedPartner === 'draftkings' && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '28px', fontWeight: 'bold', color: getSelectedPartner().color }}>
                        {jackpotEntries[selectedPartner]['0.25']}
                      </div>
                      <div style={{ fontSize: '14px', color: '#aaa' }}>$0.25 Entries</div>
                    </div>
                  )}
                  
                  {/* Total Revenue */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#4CAF50' }}>
                      ${getJackpotProfit().toFixed(2)}
                    </div>
                    <div style={{ fontSize: '14px', color: '#aaa' }}>Total Revenue</div>
                  </div>
                </div>
                
                {/* Add Entry Buttons */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => addJackpotEntry('0.10')}
                    style={{
                      backgroundColor: getSelectedPartner().color,
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 15px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Add $0.10 Entry
                  </button>
                  
                  {selectedPartner === 'draftkings' && (
                    <button 
                      onClick={() => addJackpotEntry('0.25')}
                      style={{
                        backgroundColor: 'white',
                        color: '#222',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 15px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      Add $0.25 Entry
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
} 