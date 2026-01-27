/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta de cores premium para Belvoir
        primary: {
          50: '#faf5f0',
          100: '#f3e8db',
          200: '#e6d0b7',
          300: '#d5b08a',
          400: '#c48d5c',
          500: '#b87333', // Dourado principal
          600: '#a65d2a',
          700: '#8a4a24',
          800: '#713d22',
          900: '#5d331f',
          950: '#331a0f',
        },
        secondary: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#454545',
          900: '#1a1a1a', // Preto elegante
          950: '#0d0d0d',
        },
        accent: {
          50: '#f9f7f4',
          100: '#f1ede5',
          200: '#e2d9ca',
          300: '#d0c0a8',
          400: '#baa383',
          500: '#a98c6a',
          600: '#9c7a5c',
          700: '#82634d',
          800: '#6a5243',
          900: '#574439',
          950: '#2e231d',
        },
        cream: '#FAF8F5',
        charcoal: '#1C1C1C',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        heading: ['Cormorant Garamond', 'serif'],
        body: ['Montserrat', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-down': 'slideDown 0.3s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
    },
  },
  plugins: [],
}
