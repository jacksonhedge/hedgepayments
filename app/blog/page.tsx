import React from 'react';
import BlogLayout from '../components/BlogLayout'; // Adjust path as necessary
import styles from './blog.module.css';

export const metadata = {
  title: 'SideBet Blog',
  description: 'Latest news, updates, and insights from SideBet.',
};

const BlogPage: React.FC = () => {
  return (
    <BlogLayout>
      <div className={styles.blogPageContainer}>
        <h1 className={styles.pageTitle}>Welcome to the SideBet Blog!</h1>
        <p className={styles.pageSubtitle}>
          Stay tuned for exciting news, updates, and insights from the SideBet team.
        </p>
        {/* Blog posts will be listed here */}
        <div className={styles.postListPlaceholder}>
          <p>Coming soon: Our first blog posts!</p>
          {/* Example of how a post might look */}
          {/* 
          <article className={styles.blogPostPreview}>
            <h2><Link href="/blog/sample-post">Sample Post Title</Link></h2>
            <p>This is a short excerpt of the blog post...</p>
            <Link href="/blog/sample-post">Read More</Link>
          </article>
          */}
        </div>
      </div>
    </BlogLayout>
  );
};

export default BlogPage; 