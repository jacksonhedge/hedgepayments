'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './page.module.css'
import { getWaitlistCount } from '../utils/emailService'

const AdminDashboard = () => {
  const [waitlistCount, setWaitlistCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWaitlistCount = async () => {
      try {
        const count = await getWaitlistCount();
        setWaitlistCount(count);
      } catch (error) {
        console.error('Failed to fetch waitlist count:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWaitlistCount();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <p className={styles.subtitle}>Manage your Hedge Payments services</p>
      </div>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>SideBet Waitlist</h3>
          <div className={styles.statValue}>
            {isLoading ? (
              <span className={styles.loadingPlaceholder}>Loading...</span>
            ) : (
              <>
                <span className={styles.statNumber}>{waitlistCount}</span>
                <span className={styles.statLabel}>subscribers</span>
              </>
            )}
          </div>
          <Link href="/admin/waitlist" className={styles.statLink}>
            Manage Waitlist →
          </Link>
        </div>
        
        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Business Users</h3>
          <div className={styles.statValue}>
            <span className={styles.statNumber}>42</span>
            <span className={styles.statLabel}>businesses</span>
          </div>
          <Link href="#" className={styles.statLink}>
            View Details →
          </Link>
        </div>
        
        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Consumer Users</h3>
          <div className={styles.statValue}>
            <span className={styles.statNumber}>128</span>
            <span className={styles.statLabel}>consumers</span>
          </div>
          <Link href="#" className={styles.statLink}>
            View Details →
          </Link>
        </div>
        
        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Website Visits</h3>
          <div className={styles.statValue}>
            <span className={styles.statNumber}>1,236</span>
            <span className={styles.statLabel}>monthly visits</span>
          </div>
          <Link href="#" className={styles.statLink}>
            View Analytics →
          </Link>
        </div>
      </div>
      
      <div className={styles.actionsSection}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        
        <div className={styles.actionsGrid}>
          <Link href="/admin/waitlist" className={styles.actionCard}>
            <div className={styles.actionIcon}>📧</div>
            <h3 className={styles.actionTitle}>Send Waitlist Notification</h3>
            <p className={styles.actionDescription}>
              Send an email to all waitlist subscribers
            </p>
          </Link>
          
          <Link href="#" className={styles.actionCard}>
            <div className={styles.actionIcon}>👥</div>
            <h3 className={styles.actionTitle}>Manage Users</h3>
            <p className={styles.actionDescription}>
              View and manage user accounts
            </p>
          </Link>
          
          <Link href="#" className={styles.actionCard}>
            <div className={styles.actionIcon}>📊</div>
            <h3 className={styles.actionTitle}>View Reports</h3>
            <p className={styles.actionDescription}>
              Access analytics and business reports
            </p>
          </Link>
          
          <Link href="#" className={styles.actionCard}>
            <div className={styles.actionIcon}>⚙️</div>
            <h3 className={styles.actionTitle}>System Settings</h3>
            <p className={styles.actionDescription}>
              Configure system preferences
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard