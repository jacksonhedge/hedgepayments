# HedgePayments Website - Complete Setup Documentation

## Overview
HedgePayments is a Next.js-based payment processing landing page deployed on GitHub Pages with a modern, responsive design.

## Tech Stack
- **Framework**: Next.js 14.2.29
- **Styling**: Tailwind CSS 3.x
- **Animations**: Framer Motion
- **Hosting**: GitHub Pages
- **CI/CD**: GitHub Actions
- **Domain**: hedgepayments.com

## Project Structure
```
hedgepayments-website/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Main landing page (redesigned)
│   ├── globals.css        # Global styles with Tailwind imports
│   └── layout.tsx         # Root layout
├── public/                # Static assets
├── .github/workflows/     # GitHub Actions
│   └── deploy.yml        # Automated deployment workflow
├── out/                   # Static export directory (generated)
├── tailwind.config.js     # Tailwind configuration
├── postcss.config.js      # PostCSS configuration
├── next.config.js         # Next.js configuration
└── package.json          # Dependencies and scripts
```

## Key Configuration Files

### 1. next.config.js
```javascript
module.exports = {
  output: 'export',        // Static site generation
  images: {
    unoptimized: true      // Required for static export
  },
  trailingSlash: true      // GitHub Pages compatibility
}
```

### 2. tailwind.config.js
```javascript
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ]
}
```

### 3. GitHub Actions Workflow (.github/workflows/deploy.yml)
- Triggers on push to main branch
- Installs dependencies
- Builds Next.js static site
- Deploys to GitHub Pages

## DNS Configuration
- **Domain**: hedgepayments.com
- **DNS Provider**: Points to GitHub Pages IPs
  - 185.199.108.153
  - 185.199.109.153
  - 185.199.110.153
  - 185.199.111.153
- **CNAME File**: Contains `hedgepayments.com`
- **SSL**: Automatically provided by GitHub Pages

## Landing Page Features
1. **Navigation Bar**
   - Fixed header with scroll effects
   - Links to features, stats, contact
   - Dashboard button

2. **Hero Section**
   - Gradient text headings
   - Animated background blobs
   - CTA buttons (Get Started, View Demo)
   - Trust badges (PCI DSS, SOC 2, Encryption)

3. **Stats Section**
   - $10M+ Processed Monthly
   - 99.9% Uptime
   - <100ms Transaction Speed
   - 500+ Active Merchants

4. **Features Section**
   - Instant Payments
   - Smart Round-Ups
   - Bank-Grade Security
   - Hover animations and gradients

5. **CTA Section**
   - Start Free Trial
   - Contact Sales

6. **Footer**
   - Company links
   - Product information
   - Support resources

## Development Commands
```bash
# Install dependencies
npm install

# Run development server
npm run dev -- --port 3001

# Build for production
npm run build

# Deploy to GitHub Pages (automatic via GitHub Actions)
git push origin main
```

## Deployment Process
1. **Local Development**
   - Make changes to the codebase
   - Test locally with `npm run dev`

2. **Build Verification**
   - Run `npm run build` to ensure no TypeScript errors
   - Check that `/out` directory is generated

3. **Deployment**
   - Commit changes: `git add . && git commit -m "message"`
   - Push to GitHub: `git push origin main`
   - GitHub Actions automatically:
     - Installs dependencies
     - Builds the static site
     - Deploys to GitHub Pages

4. **Verification**
   - Check GitHub Actions tab for build status
   - Visit https://hedgepayments.com
   - Typical deployment time: 2-3 minutes

## Important Files to Remember
- **Main Landing Page**: `/app/page.tsx`
- **Global Styles**: `/app/globals.css`
- **Deployment Workflow**: `/.github/workflows/deploy.yml`
- **Next.js Config**: `/next.config.js`

## Color Scheme
- Primary: Purple (#9333EA to #EC4899 gradients)
- Background: Slate (#0F172A to #1E293B)
- Text: White/Gray variations
- Accent: Pink/Purple gradients

## Known Issues & Solutions
1. **TypeScript Errors**: Use type assertions (as any) for third-party libraries
2. **Build Errors**: Check demo-new/page.tsx - rename to .skip if needed
3. **Static Export**: Ensure `output: 'export'` in next.config.js

## URLs
- **Production**: https://hedgepayments.com
- **GitHub Repo**: https://github.com/jacksonhedge/hedgepayments
- **Local Dev**: http://localhost:3001

## Contact
- **Email Support**: support@hedgepayments.com
- **Owner**: Jackson Hedge

---
Last Updated: September 24, 2025