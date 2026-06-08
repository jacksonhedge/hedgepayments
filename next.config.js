/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true
  },
  // NOTE: removed `output: 'export'` — static export silently dropped every /api/* route
  // (waitlist/subscribe were 404 in prod). Running as a normal Next server on Vercel so
  // the existing route handlers work. API routes need their env vars set in Vercel.
  trailingSlash: true
}

module.exports = nextConfig