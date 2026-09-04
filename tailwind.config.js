/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#FAF8F5',
          100: '#F5EFEB',
          200: '#ECE4D8',
          300: '#E0D4C3',
          400: '#CFBFAB',
          500: '#BAA791',
        },
        terracotta: {
          400: '#EB8A70',
          500: '#E07A5F',
          600: '#D06346',
          700: '#B24D33',
        },
        brandBlue: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          900: '#0C4A6E',
        },
        brandOrange: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          vibrant: '#FF5722',
        },
        brandEmerald: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981',
          600: '#059669',
        },
        darkNavy: {
          800: '#1E293B',
          900: '#0F172A',
          950: '#090E1A',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', 'sans-serif'],
      },
      boxShadow: {
        'modern': '0 10px 30px -10px rgba(15, 23, 42, 0.08)',
        'modern-hover': '0 20px 40px -15px rgba(15, 23, 42, 0.15)',
        'glow-orange': '0 0 25px rgba(249, 115, 22, 0.35)',
        'glow-blue': '0 0 25px rgba(14, 165, 233, 0.35)',
      }
    },
  },
  plugins: [],
}
