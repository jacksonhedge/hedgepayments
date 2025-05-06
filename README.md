# Hedge Payments Website

This is the official website for Hedge Payments, featuring Hedge Round-ups (B2B payment solution) and Bankroll (consumer wallet).

## Technologies Used

- Next.js (React framework)
- TypeScript
- CSS Modules

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- Responsive design for all device sizes
- Landing page highlighting Hedge Payment products
- Separate login pages for business and consumer users
- Sign-up functionality

## Project Structure

- `/app` - Main application code
  - `/components` - Reusable UI components
  - `/business-login` - Business login page
  - `/user-login` - User login page
  - `/signup` - Sign-up page
- `/public` - Static assets

## Deployment

To build the application for production:

```bash
npm run build
```

Then start the production server:

```bash
npm start
```