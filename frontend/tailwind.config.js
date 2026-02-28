/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary: Warm Orange (from Figma)
        primary: {
          50:  '#FFF5F2',
          100: '#FFE8E2',
          200: '#FFD0C5',
          300: '#FFB09E',
          400: '#FF8267',
          500: '#FF523B',
          600: '#E8412D',
          700: '#C63424',
          800: '#A02A1D',
          900: '#7A2018',
          DEFAULT: '#FF523B',
        },
        // Accent: same orange for consistency
        accent: {
          50:  '#FFF5F2',
          100: '#FFE8E2',
          200: '#FFD0C5',
          300: '#FFB09E',
          400: '#FF8267',
          500: '#FF523B',
          600: '#E8412D',
          700: '#C63424',
          800: '#A02A1D',
          900: '#7A2018',
          DEFAULT: '#FF523B',
        },
        // Highlight: Fresh Green
        highlight: {
          50:  '#e5f9ed',
          100: '#bdf0d2',
          500: '#00C853',
          600: '#00b049',
          700: '#00903b',
          DEFAULT: '#00C853',
        },
        brand: {
          black: '#1A1A1A',
          orange: '#FF523B',
          green: '#00C853',
          white: '#FFFFFF',
          bg:    '#F8F6F5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'soft':      '0 4px 24px rgba(0,0,0,0.06)',
        'soft-lg':   '0 8px 32px rgba(0,0,0,0.08)',
        'card':      '0 2px 16px rgba(0,0,0,0.04)',
        'card-hover':'0 12px 40px rgba(0,0,0,0.08)',
        'nav':       '0 1px 0 rgba(0,0,0,0.05)',
      },
      backgroundImage: {
        'dark-gradient':  'linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)',
        'orange-gradient':'linear-gradient(135deg, #FF523B 0%, #FF7A5C 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      }
    },
  },
  plugins: [],
}
