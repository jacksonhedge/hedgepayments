'use client'

import React, { useState, useEffect } from 'react';
import styles from './partners.module.css';

// Define partner types
type Partner = {
  name: string;
  link: string;
  description?: string;
};

type PartnerCategory = {
  name: string;
  partners: Partner[];
};

// Function to get partner initials
const getPartnerInitials = (name: string): string => {
  // Special cases for common abbreviations
  const specialCases: { [key: string]: string } = {
    'DraftKings': 'DK',
    'DraftKings Casino': 'DK',
    'DraftKings DFS': 'DK',
    'FanDuel': 'FD',
    'FanDuel Casino': 'FD',
    'FanDuel DFS': 'FD',
    'BetMGM': 'BM',
    'BetMGM Casino': 'BM',
    'ESPN BET': 'ESPN',
    'bet365': 'B365',
    'WOW Vegas': 'WOW',
    'Lottery.com': 'LC',
    'TheLotter': 'TL',
    'LottoGo': 'LG',
    'Jock MKT': 'JM',
    'High 5 Casino': 'H5',
  };

  // Check for special cases first
  if (specialCases[name]) {
    return specialCases[name];
  }

  // For other names, take first letter of each word (up to 2 letters)
  const words = name.split(' ');
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  
  // For single word names, take first 2 letters
  return name.substring(0, 2).toUpperCase();
};

// Function to get category-specific color class
const getCategoryColorClass = (category: string): string => {
  const colorMap: { [key: string]: string } = {
    'Sportsbook': 'sportsbookColor',
    'Casino': 'casinoColor',
    'Fantasy': 'fantasyColor',
    'Sweeps': 'sweepsColor',
    'Lottery': 'lotteryColor',
  };
  return colorMap[category] || 'defaultColor';
};

const PARTNER_CATEGORIES: PartnerCategory[] = [
  {
    name: 'Sportsbook',
    partners: [
      {
        name: 'DraftKings',
        link: 'https://dksb.sng.link/As9kz/0uj4?_dl=https%3A%2F%2Fsportsbook.draftkings.com%2Fgateway%3Fs%3D471182079&pcid=414490&psn=3084&pcn=SSB18&pscn=100DB_50BB&pcrn=1&pscid=xx&pcrid=xx&wpcid=414490&wpsrc=3084&wpcn=SSB18&wpscn=100DB_50BB&wpcrn=1&wpscid=xx&wpcrid=xx&_forward_params=1',
        description: 'Leading daily fantasy sports and sportsbook platform'
      },
      {
        name: 'FanDuel',
        link: 'https://wlfanduelus.adsrv.eacdn.com/C.ashx?btag=a_42626b_16c_&affid=5594&siteid=42626&adid=16&c=662608032',
        description: 'Premier sports betting and daily fantasy sports'
      },
      {
        name: 'Fanatics',
        link: 'https://track.fanaticsbettingpartners.com/track/d2ed08a4-86b2-4b78-8e8b-37ba1c9a20dd?type=seo&s1=662608032',
        description: 'Sports merchandise leader entering betting market'
      },
      {
        name: 'BetMGM',
        link: 'https://raketracker.com/rt?key=a0Y0I000007lbMaUAI&site=SideBets&subid2=662608032',
        description: 'MGM\'s premier online sportsbook'
      },
      {
        name: 'Caesars',
        link: 'https://sports.va.caesars.com/en/sports',
        description: 'World-renowned casino brand sportsbook'
      },
      {
        name: 'bet365',
        link: 'https://www.nj.bet365.com/#/HO/',
        description: 'Global leader in online sports betting'
      },
      {
        name: 'ESPN BET',
        link: 'https://track.espnbetpartners.com/track/28ffac88-c5a5-42c9-bc65-2bfabd3a4df1?type=seo&s1=662608032',
        description: 'ESPN\'s official sports betting platform'
      },
      {
        name: 'Fliff',
        link: 'https://www.fliff.com/?auid=9b40dcffac0b&r=https%3A%2F%2Fwww.fliff.com%2F&wprn=662608032',
        description: 'Social sportsbook with real prizes'
      },
      {
        name: 'Betr',
        link: 'https://app.getbetr.com/QQMdyA7GCJL?b=1',
        description: 'Micro-betting focused sportsbook'
      }
    ]
  },
  {
    name: 'Casino',
    partners: [
      {
        name: 'DraftKings Casino',
        link: 'https://dkcasino.sng.link/As9lf/c1fx?_dl=https%3A%2F%2Fcasino.draftkings.com%2Fgateway%3Fs%3D471182079&pcid=414488&psn=3084&pcn=RGC_Web18&pscn=300FP_Desk&pcrn=2&pscid=xx&pcrid=xx&wpcid=414488&wpsrc=3084&wpcn=RGC_Web18&wpscn=300FP_Desk&wpcrn=2&wpscid=xx&wpcrid=xx&_forward_params=1',
        description: 'Online casino with slots, table games, and live dealer'
      },
      {
        name: 'FanDuel Casino',
        link: 'https://wlfanduelcasinous.adsrv.eacdn.com/C.ashx?btag=a_42703b_91c_&affid=5594&siteid=42703&adid=91&c=662608032',
        description: 'Wide variety of casino games and slots'
      },
      {
        name: 'BetMGM Casino',
        link: 'https://raketracker.com/rt?key=a0Y0I000007lbQJUAY&site=SideBets&subid2=662608032',
        description: 'Vegas-style casino games online'
      },
      {
        name: 'Caesars Casino',
        link: 'https://caesarsrewards.mpli.cc/p/35fa6290',
        description: 'Classic casino experience online'
      },
      {
        name: 'BetRivers',
        link: 'https://pub.adsrvr.org/s7e68lm0l1s/5/2144/clickenc=http%3A%2F%2Fsidebets.link%2Fbetrivers',
        description: 'Online casino with rewards program'
      },
      {
        name: 'PokerStars',
        link: 'https://www.pokerstars.com/r?ac=12636161&adp=sidebets.com&sid=96350&src=662608032',
        description: 'World\'s largest online poker site'
      },
      {
        name: 'Golden Nugget',
        link: 'https://www.mi.goldennuggetcasino.com/?affc=31f5e0f4',
        description: 'Iconic casino brand online'
      },
      {
        name: 'WynnBET',
        link: 'https://app.onelink.me/gRyB/lx30jtu4?deep_link_value=deeplink%3A%2F%2F&c=662608032',
        description: 'Luxury casino experience online'
      },
      {
        name: 'Hard Rock',
        link: 'https://hardrock.bet/R?AC=11814547&SRC=662608032',
        description: 'Rock and roll themed online casino'
      }
    ]
  },
  {
    name: 'Fantasy',
    partners: [
      {
        name: 'Underdog',
        link: 'https://play.underdogfantasy.com/p-bankroll',
        description: 'Best Ball and Pick\'em fantasy sports'
      },
      {
        name: 'Sleeper',
        link: 'https://sleeper.com/signup?user_invite=bankroll',
        description: 'Modern fantasy sports platform'
      },
      {
        name: 'PrizePicks',
        link: 'https://app.prizepicks.com/sign-up?invite_code=BANKROLL',
        description: 'Daily fantasy sports made simple'
      },
      {
        name: 'SuperDraft',
        link: 'https://www.superdraftpartners.com/action/1/4095?s1=662608032',
        description: 'Multiplier-based fantasy sports'
      },
      {
        name: 'Jock MKT',
        link: 'https://app.jockmkt.com/rP4b9xbrq8',
        description: 'Stock market for sports'
      },
      {
        name: 'DraftKings DFS',
        link: 'https://www.draftkings.com/gateway?s=471182079',
        description: 'Daily fantasy sports leader'
      },
      {
        name: 'FanDuel DFS',
        link: 'https://www.fanduel.com/login',
        description: 'Daily fantasy sports pioneer'
      },
      {
        name: 'Monkey Knife Fight',
        link: 'https://www.monkeyknifefight.com',
        description: 'Fantasy sports prediction game'
      }
    ]
  },
  {
    name: 'Sweeps',
    partners: [
      {
        name: 'Chumba',
        link: 'https://www.chumba.com/?src=662608032',
        description: 'Social casino with cash prizes'
      },
      {
        name: 'Pulsz',
        link: 'https://www.pulsz.com/?inviteCode=662608032',
        description: 'Sweepstakes casino platform'
      },
      {
        name: 'Stake.us',
        link: 'https://stake.us/?c=662608032',
        description: 'Crypto-friendly sweepstakes casino'
      },
      {
        name: 'High 5 Casino',
        link: 'https://high5casino.com',
        description: 'Social casino with real prizes'
      },
      {
        name: 'WOW Vegas',
        link: 'https://wowvegas.com/?src=662608032',
        description: 'Sweepstakes casino with variety'
      },
      {
        name: 'McLuck',
        link: 'https://mcluck.com/?src=662608032',
        description: 'Gold coin social casino'
      },
      {
        name: 'Sportzino',
        link: 'https://sportzino.com/?src=662608032',
        description: 'Sports-themed sweepstakes'
      },
      {
        name: 'Spree',
        link: 'https://spree.com/?src=662608032',
        description: 'Pick\'em sweepstakes games'
      }
    ]
  },
  {
    name: 'Lottery',
    partners: [
      {
        name: 'Jackpocket',
        link: 'https://jackpocket.onelink.me/vZh6/BANKROLL',
        description: 'Official lottery ticket app'
      },
      {
        name: 'Lottery.com',
        link: 'https://lottery.com',
        description: 'Online lottery ticket service'
      },
      {
        name: 'TheLotter',
        link: 'https://www.thelotter.com',
        description: 'International lottery ticket service'
      },
      {
        name: 'LottoGo',
        link: 'https://www.lottogo.com',
        description: 'Online lottery betting'
      }
    ]
  }
];

export default function PartnersPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for smooth transition
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredPartners = selectedCategory === 'All' 
    ? PARTNER_CATEGORIES 
    : PARTNER_CATEGORIES.filter(cat => cat.name === selectedCategory);

  const getTotalCount = () => {
    if (selectedCategory === 'All') {
      return PARTNER_CATEGORIES.reduce((sum, cat) => sum + cat.partners.length, 0);
    }
    const category = PARTNER_CATEGORIES.find(cat => cat.name === selectedCategory);
    return category ? category.partners.length : 0;
  };

  return (
    <main className={styles.main}>
      {/* Animated Gradient Background */}
      <div className={styles.gradientBackground}>
        <div className={styles.gradientLayer1}></div>
        <div className={styles.gradientLayer2}></div>
        <div className={styles.gradientLayer3}></div>
      </div>

      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <h1 className={styles.title}>
            Our <span className={styles.highlight}>Partners</span>
          </h1>
          <p className={styles.subtitle}>
            Explore our trusted partners across sports betting, casino gaming, fantasy sports, and more. 
            All links are affiliate partnerships that support our platform while providing you with the best options in online gaming.
          </p>
        </section>

        {/* Category Filter */}
        <section className={styles.filterSection}>
          <div className={styles.filterContainer}>
            <button
              className={`${styles.filterButton} ${selectedCategory === 'All' ? styles.active : ''}`}
              onClick={() => setSelectedCategory('All')}
            >
              All <span className={styles.count}>{PARTNER_CATEGORIES.reduce((sum, cat) => sum + cat.partners.length, 0)}</span>
            </button>
            {PARTNER_CATEGORIES.map(category => (
              <button
                key={category.name}
                className={`${styles.filterButton} ${selectedCategory === category.name ? styles.active : ''}`}
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name} <span className={styles.count}>{category.partners.length}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Partners Grid */}
        <section className={styles.partnersSection}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loader}></div>
            </div>
          ) : (
            <div className={styles.categoriesContainer}>
              {filteredPartners.map(category => (
                <div key={category.name} className={styles.categorySection}>
                  <h2 className={styles.categoryTitle}>{category.name}</h2>
                  <div className={styles.partnersGrid}>
                    {category.partners.map(partner => (
                      <a
                        key={partner.name}
                        href={partner.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.partnerCard}
                      >
                        <div className={styles.partnerContent}>
                          <div className={`${styles.partnerLogo} ${styles[getCategoryColorClass(category.name)]}`}>
                            <span className={styles.partnerInitials}>
                              {getPartnerInitials(partner.name)}
                            </span>
                          </div>
                          <h3 className={styles.partnerName}>{partner.name}</h3>
                          {partner.description && (
                            <p className={styles.partnerDescription}>{partner.description}</p>
                          )}
                          <span className={styles.partnerLink}>
                            Visit Site →
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* FAQ Section */}
        <section className={styles.faqSection}>
          <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
          <div className={styles.faqContainer}>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>What are affiliate links?</h3>
              <p className={styles.faqAnswer}>
                Affiliate links are special URLs that track when you visit our partners through our site. 
                When you sign up or make qualifying actions, we may receive a commission at no extra cost to you.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>Are these partners safe and legal?</h3>
              <p className={styles.faqAnswer}>
                Yes, all our partners are licensed and regulated operators in their respective jurisdictions. 
                Always check local laws regarding online gaming in your area.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>Do I get any special bonuses?</h3>
              <p className={styles.faqAnswer}>
                Many of our affiliate links provide exclusive bonuses and promotions when you sign up through our site. 
                Check each partner's current offers for details.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>How do I know which partner is right for me?</h3>
              <p className={styles.faqAnswer}>
                Consider factors like available games, bonuses, payment methods, and whether they operate in your state. 
                Read reviews and try multiple platforms to find your preference.
              </p>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className={styles.disclaimerSection}>
          <p className={styles.disclaimer}>
            <strong>Disclaimer:</strong> Gambling can be addictive. Please play responsibly. 
            If you or someone you know has a gambling problem, call 1-800-GAMBLER. 
            Must be 21+ to participate. Void where prohibited.
          </p>
        </section>
      </div>
    </main>
  );
}