import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './layout.module.css'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={styles.adminLayout}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.logoContainer}>
          <Image 
            src="/favicon/hedge-logo.svg" 
            alt="Hedge Admin" 
            width={40} 
            height={40}
            className={styles.logo}
          />
          <span className={styles.logoText}>Hedge Admin</span>
        </div>
        
        <nav className={styles.sidebarNav}>
          <Link href="/admin" className={styles.navLink}>
            Dashboard
          </Link>
          <Link href="/admin/waitlist" className={styles.navLink}>
            Waitlist Manager
          </Link>
          <Link href="/" className={styles.navLink}>
            Back to Site
          </Link>
        </nav>
      </div>
      
      {/* Main Content */}
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  )
}