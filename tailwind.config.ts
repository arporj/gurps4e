import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gurps: {
          50:  '#fdf2f2',
          100: '#fde1e1',
          200: '#fbcaca',
          300: '#f8a8a8',
          400: '#f27c7c',
          500: '#e54d4d',
          600: '#991b1b', // Main Crimson
          700: '#7f1d1d',
          800: '#6b1b1b',
          900: '#450a0a',
          950: '#0b1326', // Deep Slate / Midnight
        },
        slate: {
          950: '#0b1326',
          900: '#131b2e',
          800: '#171f33',
          700: '#222a3d',
          600: '#2d3449',
        }
      },
      fontFamily: {
        serif: ['Newsreader', 'serif'],
        sans: ['Manrope', 'sans-serif'],
        mono: ['Space Grotesk', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config

