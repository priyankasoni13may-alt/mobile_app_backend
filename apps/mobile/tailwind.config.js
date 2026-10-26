/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0B1026',
          lumora: '#5B8EE2',
          cypher: '#003566',
          dark: '#070B19',
          surface: '#101735',
          card: '#131B38',
          border: '#1E294B',
          text: '#F1F5F9',
          muted: '#94A3B8'
        }
      }
    },
  },
  plugins: [],
};
