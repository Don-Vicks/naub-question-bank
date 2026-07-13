import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Straight from brand.md - keep these two files in sync.
        ink: {
          DEFAULT: '#1B2340',
          dark: '#12162B',
        },
        paper: '#FAF6EE',
        marigold: {
          DEFAULT: '#F2A93B',
          text: '#412402',
        },
        terracotta: {
          DEFAULT: '#D9603B',
          text: '#4A1B0C',
        },
        verified: {
          DEFAULT: '#2F6F4E',
          bg: '#E4EFE8',
        },
        muted: '#8A8578',
        line: '#E7E1D2',
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'sans-serif'],
        voice: ['Lora', 'Georgia', 'serif'],
      },
      borderRadius: {
        card: '12px',
      },
    },
  },
  plugins: [],
};

export default config;
