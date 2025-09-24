# Jackson's Projects Overview

## 1. Bankroll
**Type**: Consumer Fintech  
**Platforms**: Web wallet & iOS app  
**Description**: Digital wallet application for consumer financial management  
**Key Features**: 
- Web-based wallet interface
- iOS mobile application
- Financial transaction management

## 2. Stanley Scanner (TipEnter)
**Type**: B2B Receipt Management  
**Target Market**: Bartenders and bars  
**Description**: Receipt scanning and management system for hospitality industry  
**Key Features**:
- Receipt scanning functionality
- Tip tracking and management
- Business expense organization

## 3. HedgePayments / SideBet
**Type**: Payment Processing Landing Page
**Path**: `/Users/jacksonfitzgerald/Documents/hedgepayments-website`
**Framework**: Next.js 14 with Tailwind CSS
**Database**: Supabase
**Email**: SendGrid
**Hosting**: GitHub Pages (https://hedgepayments.com)
**Description**: Modern payment infrastructure landing page

**Key Features**:
- Static site generation with Next.js
- Responsive design with Tailwind CSS
- Automated deployment via GitHub Actions
- Custom domain with SSL

**Project Structure**:
- `/app` - Next.js app directory (App Router)
- `/public` - Static assets
- `/.github/workflows` - CI/CD automation
- `/out` - Static export directory

**Quick Commands**:
```bash
npm run dev -- --port 3001  # Development
npm run build               # Build static site
git push origin main        # Deploy (automatic)
```

**Important Files**:
- `app/page.tsx` - Main landing page
- `.github/workflows/deploy.yml` - Deployment config
- `DEPLOYMENT_SETUP.md` - Complete setup documentation

## 4. College Casino Tour
**Type**: Marketing & Outreach Platform  
**Target Market**: Fraternities  
**Description**: Landing page and database system for fraternity outreach and tracking  
**Key Features**:
- Fraternity database management
- Outreach tracking system
- Event coordination tools

## Common Development Patterns
- Prefer Next.js for web applications
- Use Tailwind CSS for styling
- Supabase for database needs
- SendGrid for email services

## Active Project Context
When working on a specific project, I'll need to know which one we're focusing on to provide the most relevant assistance.