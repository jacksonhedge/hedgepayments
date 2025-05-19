import React from 'react';
import PartnerLogos from '../components/PartnerLogos';
import styles from '../page.module.css';

export default function PartnersPage() {
  const partnerLogos = [
    { src: '/images/assets/partner1.png', alt: 'Partner 1' },
    { src: '/images/assets/partner2.png', alt: 'Partner 2' },
    { src: '/images/assets/partner3.png', alt: 'Partner 3' },
    { src: '/images/assets/partner4.png', alt: 'Partner 4' },
    { src: '/images/assets/partner5.png', alt: 'Partner 5' },
  ];

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1>Our Partners</h1>
        <p className={styles.description}>
          HedgePayments partners with leading companies in the financial technology space.
        </p>
        <PartnerLogos logos={partnerLogos} />
      </div>
    </main>
  );
} 