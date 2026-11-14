/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          main: '#080B0A',
          secondary: '#101511',
          card: '#151C17',
          elevated: 'rgba(21, 28, 23, 0.75)',
        },
        accent: {
          lime: '#C5F36A',
          hover: '#b5e357',
          secondary: '#A6C94B',
          glow: 'rgba(197, 243, 106, 0.25)',
        },
        text: {
          main: '#FFFFFF',
          muted: '#A5AAA5',
          subtle: '#6B7280',
        },
        border: {
          subtle: 'rgba(255, 255, 255, 0.12)',
          highlight: 'rgba(197, 243, 106, 0.3)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow-lime': '0 0 25px rgba(197, 243, 106, 0.2)',
        'glow-panel': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
}

