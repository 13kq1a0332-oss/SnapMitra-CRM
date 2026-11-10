/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#0B0B0C',
          light: '#131316',
          card: '#18181C',
          border: '#27272E',
          muted: '#2E2E38',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F3E5AB',
          hover: '#E5C048',
          dark: '#AA7C11',
          accent: '#FFDF73',
          glow: 'rgba(212, 175, 55, 0.18)',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        cormorant: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        cinzel: ['"Cinzel"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold-sm': '0 0 10px rgba(212, 175, 55, 0.15)',
        'gold-md': '0 0 20px rgba(212, 175, 55, 0.25)',
        'gold-lg': '0 0 35px rgba(212, 175, 55, 0.35)',
        'luxury': '0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 15px rgba(212, 175, 55, 0.1)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F3E5AB 0%, #D4AF37 50%, #AA7C11 100%)',
        'gold-subtle': 'linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(212, 175, 55, 0.03) 100%)',
        'obsidian-gradient': 'linear-gradient(180deg, #131316 0%, #0B0B0C 100%)',
      },
    },
  },
  plugins: [],
};

