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
            <div className={styles.logoContainer}>
              <Image
                src="/sidebet-logo.png" // Path to your logo in the public folder
                alt="SideBet Logo"
                width={40} // Adjusted for a more compact, likely square logo
                height={40} // Adjusted for a more compact, likely square logo
                className={styles.logo}
                priority // Preload logo as it's likely LCP for blog pages
              />
            </div>
          </Link>
          <nav className={styles.navigation}>
            <Link href="/contact" passHref>
              <div className={styles.navLink}>Contact</div>
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