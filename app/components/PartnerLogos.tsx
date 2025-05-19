'use client'

import React from 'react'
import styles from './PartnerLogos.module.css'

interface Logo {
  src: string;
  alt: string;
}

interface PartnerLogosProps {
  logos: Logo[];
}

const PartnerLogos: React.FC<PartnerLogosProps> = ({ logos }) => {
  return (
    <div className={styles.partnerContainer} style={{ backgroundColor: '#ffdddd', padding: '40px', border: '3px solid red' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'black' }}>Partner Logos</h2>
      <div className={styles.partnerWrapper}>
        {logos.map((logo, index) => (
          <div key={index} className={styles.logoWrapper}>
            <img 
              src={logo.src} 
              alt={logo.alt} 
              className={styles.logo}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default PartnerLogos 