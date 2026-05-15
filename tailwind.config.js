/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        // Dashboard Design System
        'dash-primary': {
          400: 'var(--dashboard-primary-400)',
          500: 'var(--dashboard-primary-500)',
          600: 'var(--dashboard-primary-600)',
        },
        'dash-surface': {
          bg: 'var(--dashboard-surface-bg)',
          card: 'var(--dashboard-surface-card)',
          border: 'var(--dashboard-surface-border)',
          hover: 'var(--dashboard-surface-hover)',
        },
        'dash-text': {
          primary: 'var(--dashboard-text-primary)',
          secondary: 'var(--dashboard-text-secondary)',
          muted: 'var(--dashboard-text-muted)',
        },
        'dash-status': {
          success: 'var(--dashboard-status-success)',
          warning: 'var(--dashboard-status-warning)',
          error: 'var(--dashboard-status-error)',
          info: 'var(--dashboard-status-info)',
        },
        'dash-mode': {
          test: 'var(--dashboard-mode-test)',
          live: 'var(--dashboard-mode-live)',
        },
        'dash-sidebar': {
          bg: 'var(--dashboard-sidebar-bg)',
          hover: 'var(--dashboard-sidebar-hover)',
          active: 'var(--dashboard-sidebar-active)',
          text: 'var(--dashboard-sidebar-text)',
          'text-active': 'var(--dashboard-sidebar-text-active)',
        },
      },
      animation: {
        'spin-slow': 'spin 25s linear infinite',
        'counter-spin': 'counter-spin 25s linear infinite',
        'spin-slower': 'spin 40s linear infinite reverse',
        'counter-spin-slow': 'counter-spin-slow 40s linear infinite',
      },
      keyframes: {
        'counter-spin': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(-360deg)' },
        },
        'counter-spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}