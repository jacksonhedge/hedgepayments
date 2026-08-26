import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://hedgepayments.com';
  const lastModified = new Date();

  const routes = [
    '',
    '/products',
    '/sidebet',
    '/wallet',
    '/developers',
    '/docs',
    '/partners',
    '/marketing-partners',
    '/blog',
    '/contact',
    '/privacy',
    '/terms',
    '/get-started',
  ];

  return routes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified,
  }));
}
