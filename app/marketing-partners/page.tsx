'use client'

import React, { useState } from 'react';
import styles from './marketing-partners.module.css';

// Define partner type
type MarketingPartner = {
  name: string;
  link: string | 'STATE_DEPENDENT';
  stateLinks?: { [state: string]: string };
  description: string;
  initials: string;
  logo: string;
  darkBackground?: boolean;
  comingSoon?: boolean;
};

const MARKETING_PARTNERS: MarketingPartner[] = [
  {
    name: 'Underdog Fantasy',
    initials: 'UF',
    logo: '/logos/underdog.png',
    link: 'https://play.underdogfantasy.com/p-hedge',
    description: 'Leading fantasy sports platform with innovative Best Ball and Pick\'em contests'
  },
  {
    name: 'DraftKings Sportsbook',
    initials: 'DK',
    logo: '/logos/draftkings.png',
    darkBackground: true,
    link: 'https://dksb.sng.link/As9kz/2jt4?_dl=https%3A%2F%2Fsportsbook.draftkings.com%2Fgateway%3Fs%3D290191098&pcid=421545&psn=3084&pcn=SSB23&pscn=Promo1&pcrn=xx&pscid=xx&pcrid=xx&wpcid=421545&wpsrc=3084&wpcn=SSB23&wpscn=Promo1&wpcrn=xx&wpscid=xx&wpcrid=xx&_forward_params=1',
    description: 'Industry-leading sports betting platform with competitive odds'
  },
  {
    name: 'DraftKings Casino',
    initials: 'DK',
    logo: '/logos/draftkings.png',
    darkBackground: true,
    link: 'https://dkcs.sng.link/A9aj1/490ed?_dl=https%3A%2F%2Fcasino.draftkings.com%2Fgateway%3Fs%3D443676328&pcid=421540&psn=3084&pcn=SCAS17&pscn=xx&pcrn=xx&pscid=xx&pcrid=xx&wpcid=421540&wpsrc=3084&wpcn=SCAS17&wpscn=xx&wpcrn=xx&wpscid=xx&wpcrid=xx&_forward_params=1',
    description: 'Premier online casino with slots, table games, and live dealers'
  },
  {
    name: 'FanDuel Casino',
    initials: 'FD',
    logo: '/logos/fanduel.avif',
    link: 'https://wlfanduelus.adsrv.eacdn.com/C.ashx?btag=a_43886b_50c_&affid=5594&siteid=43886&adid=50&c=662608039v2',
    description: 'Wide variety of casino games, slots, and exclusive promotions'
  },
  {
    name: 'Caesars Sportsbook',
    initials: 'CS',
    logo: '/logos/caesars.png',
    link: 'https://wlwilliamhillus.adsrv.eacdn.com/C.ashx?btag=a_13325b_2658c_&affid=450&siteid=13325&adid=2658&c=',
    description: 'World-renowned casino brand\'s premier sports betting platform'
  },
  {
    name: 'BetMGM',
    initials: 'BM',
    logo: '/logos/betmgm.png',
    link: 'https://www.betmgm.com/',
    description: 'MGM Resorts\' premier online sportsbook and casino'
  },
  {
    name: 'Fanatics Betting',
    initials: 'FB',
    logo: '/logos/fanatics.png',
    link: 'STATE_DEPENDENT',
    stateLinks: {
      'MI': 'https://track.fanaticsbettingpartners.com/track/9cb83e36-a981-43ee-b54e-a2dd0063e263?type=seo&s1=662608032',
      'PA': 'https://track.fanaticsbettingpartners.com/track/16707b7a-0df1-4d8d-9d59-29f5ee7f476b?type=seo&s1=662608032',
      'NJ': 'https://track.fanaticsbettingpartners.com/track/fba1a696-3d36-49f5-8ff7-bab63f26184f?type=seo&s1=662608032',
      'ON': 'https://track.fanaticsbettingpartners.com/track/e3c61852-44a9-4d37-955c-1ba811d3bc02?type=seo&s1=662608032'
    },
    description: 'Sports merchandise leader\'s innovative betting platform (available in select states)'
  },
  {
    name: 'Thrillzz',
    initials: 'TZ',
    logo: '/logos/thrillz.png',
    link: 'https://thrillzz.sng.link/Dyrva/h1di?pcn=HEDGEPAY&pscn=&_smtype=3&utm_medium=affiliates&utm_source=hedgepay&utm_campaign=HEDGEPAY',
    description: 'Innovative social gaming and entertainment platform'
  },
  {
    name: 'Betr',
    initials: 'BR',
    logo: '/logos/betr.png',
    link: 'https://www.betr.app/',
    description: 'Micro-betting focused sportsbook for the modern bettor'
  }
];

export default function MarketingPartnersPage() {
  const [logoErrors, setLogoErrors] = useState<Set<string>>(new Set());
  const [showStateModal, setShowStateModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<MarketingPartner | null>(null);

  const handleLogoError = (partnerName: string) => {
    setLogoErrors(prev => new Set(prev).add(partnerName));
  };

  const handlePartnerClick = (e: React.MouseEvent, partner: MarketingPartner) => {
    if (partner.link === 'STATE_DEPENDENT') {
      e.preventDefault();
      setSelectedPartner(partner);
      setShowStateModal(true);
    }
  };

  const handleStateSelect = (state: string) => {
    if (selectedPartner?.stateLinks && selectedPartner.stateLinks[state]) {
      window.open(selectedPartner.stateLinks[state], '_blank', 'noopener,noreferrer');
    }
    setShowStateModal(false);
    setSelectedPartner(null);
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
            Our Marketing <span className={styles.highlight}>Partners</span>
          </h1>
          <p className={styles.subtitle}>
            We partner with the leading sports betting and fantasy sports platforms to bring you
            the best payment solutions and exclusive offers. More partnerships coming soon.
          </p>
        </section>

        {/* Partners Grid */}
        <section className={styles.partnersSection}>
          <div className={styles.partnersGrid}>
            {MARKETING_PARTNERS.map(partner => (
              <a
                key={partner.name}
                href={partner.link === 'STATE_DEPENDENT' ? '#' : partner.link}
                target={partner.link === 'STATE_DEPENDENT' ? '_self' : '_blank'}
                rel="noopener noreferrer"
                className={styles.partnerCard}
                onClick={(e) => handlePartnerClick(e, partner)}
              >
                <div className={styles.partnerContent}>
                  <div className={`${styles.partnerLogo} ${partner.darkBackground ? styles.darkLogo : ''}`}>
                    {!logoErrors.has(partner.name) ? (
                      <img
                        src={partner.logo}
                        alt={`${partner.name} logo`}
                        className={styles.logoImage}
                        onError={() => handleLogoError(partner.name)}
                      />
                    ) : (
                      <span className={styles.partnerInitials}>
                        {partner.initials}
                      </span>
                    )}
                  </div>
                  <h3 className={styles.partnerName}>{partner.name}</h3>
                  <p className={styles.partnerDescription}>{partner.description}</p>
                  <span className={styles.partnerLink}>
                    {partner.link === 'STATE_DEPENDENT' ? 'Select Your State →' : 'Visit Partner →'}
                  </span>
                </div>
              </a>
            ))}

            {/* Coming Soon Card */}
            <div className={styles.comingSoonCard}>
              <div className={styles.partnerContent}>
                <div className={`${styles.partnerLogo} ${styles.comingSoonLogo}`}>
                  <span className={styles.partnerInitials}>+</span>
                </div>
                <h3 className={styles.partnerName}>More Coming Soon</h3>
                <p className={styles.partnerDescription}>
                  We're constantly expanding our partnerships with leading platforms in the industry
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <h2 className={styles.infoTitle}>Why Partner with Hedge Payments?</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <h3 className={styles.infoItemTitle}>Seamless Integration</h3>
              <p className={styles.infoItemDescription}>
                Our payment infrastructure integrates smoothly with major platforms,
                providing a frictionless experience for users.
              </p>
            </div>
            <div className={styles.infoItem}>
              <h3 className={styles.infoItemTitle}>Trusted Security</h3>
              <p className={styles.infoItemDescription}>
                Bank-level security and compliance ensure safe transactions for
                millions of users across our partner platforms.
              </p>
            </div>
            <div className={styles.infoItem}>
              <h3 className={styles.infoItemTitle}>Rapid Processing</h3>
              <p className={styles.infoItemDescription}>
                Lightning-fast payment processing means users can deposit and
                withdraw funds with minimal wait times.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <h2 className={styles.ctaTitle}>Interested in Partnering?</h2>
          <p className={styles.ctaDescription}>
            Join our growing network of industry-leading platforms and provide
            your users with best-in-class payment solutions.
          </p>
          <a href="/contact" className={styles.ctaButton}>
            Get in Touch
          </a>
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

      {/* State Selection Modal */}
      {showStateModal && selectedPartner && (
        <div className={styles.modalOverlay} onClick={() => setShowStateModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.modalClose}
              onClick={() => setShowStateModal(false)}
              aria-label="Close modal"
            >
              ×
            </button>
            <h2 className={styles.modalTitle}>Select Your State</h2>
            <p className={styles.modalSubtitle}>
              {selectedPartner.name} is available in the following states:
            </p>
            <div className={styles.stateGrid}>
              {selectedPartner.stateLinks && Object.keys(selectedPartner.stateLinks).map(state => (
                <button
                  key={state}
                  className={styles.stateButton}
                  onClick={() => handleStateSelect(state)}
                >
                  {state === 'MI' && 'Michigan'}
                  {state === 'PA' && 'Pennsylvania'}
                  {state === 'NJ' && 'New Jersey'}
                  {state === 'ON' && 'Ontario'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
