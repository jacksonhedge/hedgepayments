import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './BlogLayout.module.css';

interface BlogLayoutProps {
  children: React.ReactNode;
}

const BlogLayout: React.FC<BlogLayoutProps> = ({ children }) => {
  return (
    <div className={styles.blogLayoutContainer}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" passHref>
            <div className={styles.logoContainer} >
              <Image
                src="/sidebet-logo.png" // Path to your logo in the public folder
                alt="SideBet Logo"
                width={150} // Adjust as needed
                height={50} // Adjust as needed
                className={styles.logo}
              />
            </div>
          </Link>
          <nav className={styles.navigation}>
            <Link href="/contact" passHref>
              <div className={styles.navLink} >Contact</div>
            </Link>
            {/* Add other navigation links here if needed */}
          </nav>
        </div>
      </header>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
};

export default BlogLayout; 