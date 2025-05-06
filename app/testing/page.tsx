import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import styles from './page.module.css'

export default function AppTesting() {
  const testingServices = [
    {
      title: 'Bankroll Testing',
      description: 'Comprehensive testing of the Bankroll consumer wallet platform (bankroll.live), ensuring seamless payment processing, security, and user experience.',
      features: [
        'User interface testing across all devices',
        'Payment processing verification',
        'Security protocol validation',
        'Load testing for high-volume transactions'
      ]
    },
    {
      title: 'Slot Game Verification',
      description: 'Rigorous testing of slot games to ensure fair play, accurate payouts, and optimal performance.',
      features: [
        'RNG (random number generator) verification',
        'Payout calculation validation',
        'Game mechanics testing',
        'Cross-platform compatibility testing'
      ]
    },
    {
      title: '3rd Party Integration',
      description: 'Testing and validation of third-party service integrations to ensure smooth interoperability.',
      features: [
        'API connectivity testing',
        'Data exchange verification',
        'Error handling and recovery',
        'Performance benchmarking'
      ]
    },
    {
      title: 'Payment Method Testing',
      description: 'Comprehensive testing of various payment methods to ensure secure and efficient transactions.',
      features: [
        'Credit/debit card processing',
        'Digital wallet integrations',
        'ACH/bank transfer verification',
        'International payment testing'
      ]
    }
  ]

  return (
    <main>
      <Navbar />
      <div className={styles.heroSection}>
        <div className={styles.container}>
          <h1 className={styles.heroTitle}>App Testing Services</h1>
          <p className={styles.heroSubtitle}>
            Ensuring quality, security, and performance across financial applications and gaming platforms
          </p>
        </div>
      </div>

      <section className={styles.overviewSection}>
        <div className={styles.container}>
          <div className={styles.overviewContent}>
            <h2 className={styles.sectionTitle}>Our Testing Approach</h2>
            <p className={styles.overviewText}>
              At Hedge Payments, we provide comprehensive testing services to ensure that financial applications and gaming 
              platforms meet the highest standards of quality, security, and user experience. Our team of expert testers 
              utilizes industry-leading methodologies and tools to identify and address potential issues before they impact your users.
            </p>
            <p className={styles.overviewText}>
              Whether you're launching a new payment platform, integrating third-party services, or developing gaming applications, 
              our testing services can help you deliver a flawless product to your users.
            </p>
          </div>
          <div className={styles.statsContainer}>
            <div className={styles.statBox}>
              <span className={styles.statNumber}>99.9%</span>
              <span className={styles.statLabel}>Uptime</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statNumber}>500+</span>
              <span className={styles.statLabel}>Apps Tested</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statNumber}>100%</span>
              <span className={styles.statLabel}>Compliance</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.servicesSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Our Testing Services</h2>
          <div className={styles.servicesGrid}>
            {testingServices.map((service, index) => (
              <div key={index} className={styles.serviceCard}>
                <h3 className={styles.serviceTitle}>{service.title}</h3>
                <p className={styles.serviceDescription}>{service.description}</p>
                <ul className={styles.featuresList}>
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className={styles.featureItem}>{feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.bankrollSection}>
        <div className={styles.container}>
          <div className={styles.bankrollContent}>
            <h2 className={styles.sectionTitle}>Bankroll Testing</h2>
            <p className={styles.bankrollDescription}>
              We provide specialized testing services for <a href="https://bankroll.live" target="_blank" rel="noopener noreferrer" className={styles.bankrollLink}>Bankroll</a>, ensuring that the platform delivers a seamless and secure experience for all users.
            </p>
            <div className={styles.bankrollFeatures}>
              <div className={styles.bankrollFeature}>
                <h4 className={styles.featureTitle}>Transaction Testing</h4>
                <p>Comprehensive validation of all transaction types, ensuring accurate processing and record-keeping.</p>
              </div>
              <div className={styles.bankrollFeature}>
                <h4 className={styles.featureTitle}>Security Audits</h4>
                <p>Regular security audits to identify and address potential vulnerabilities in the platform.</p>
              </div>
              <div className={styles.bankrollFeature}>
                <h4 className={styles.featureTitle}>User Experience Testing</h4>
                <p>Rigorous testing of the user interface and experience across different devices and platforms.</p>
              </div>
              <div className={styles.bankrollFeature}>
                <h4 className={styles.featureTitle}>Performance Optimization</h4>
                <p>Load testing and performance optimization to ensure smooth operation even during peak usage periods.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>Ready to ensure your app's quality?</h2>
          <p className={styles.ctaText}>
            Contact our testing team to learn how we can help you deliver a flawless product to your users.
          </p>
          <a href="/contact" className={styles.ctaButton}>Get in Touch</a>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}