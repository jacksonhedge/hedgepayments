import Head from 'next/head';

interface SocialMetaProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  url?: string;
  twitterHandle?: string;
}

const defaultProps = {
  title: 'SideBet - Turn Spare Change Into Winnings',
  description: 'Swipe your card, and in moments, see if your round-ups won you money on your favorite sportsbooks.',
  imageUrl: '/opengraph-image',
  url: 'https://www.sidebet.io',
  twitterHandle: '@sidebetapp',
};

export default function SocialMeta({
  title = defaultProps.title,
  description = defaultProps.description,
  imageUrl = defaultProps.imageUrl,
  url = defaultProps.url,
  twitterHandle = defaultProps.twitterHandle,
}: SocialMetaProps) {
  // Get the absolute URL for images
  const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${url}${imageUrl}`;
  
  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content="SideBet" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImageUrl} />
      <meta property="twitter:creator" content={twitterHandle} />
      
      {/* Additional Meta */}
      <meta name="robots" content="index, follow" />
      <meta name="theme-color" content="#132A45" />
      <meta name="msapplication-TileColor" content="#132A45" />
      
      {/* Canonical Link */}
      <link rel="canonical" href={url} />
    </Head>
  );
} 