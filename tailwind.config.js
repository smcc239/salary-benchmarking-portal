/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'engage-dark': {
          DEFAULT: '#1a1a1a',
          'lighter': '#2d2d2d',
          'darker': '#0d0d0d',
        },
        'engage-accent': {
          DEFAULT: '#f97316',
          'lighter': '#fb923c',
          'darker': '#ea580c',
        },
        'engage-text': {
          DEFAULT: '#e5e5e5',
          'muted': '#a3a3a3',
        },
      },
    },
  },
  plugins: [],
} 