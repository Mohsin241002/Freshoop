/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1rem',
        md: '2rem',
        lg: '2rem',
        xl: '3rem',
      }
    },
    extend: {
      colors: {
        brand: {
          DEFAULT: '#77BF54',
          dark: '#6aad4a',
          50: '#f2f8ee',
          100: '#e5f1dc',
          200: '#c7e3b6',
          300: '#a9d690',
          400: '#8bc86a',
          500: '#77BF54', // primary
          600: '#6aad4a', // darker hover
          700: '#4d8933',
          800: '#3a6727',
          900: '#28471b',
        },
        cream: {
          DEFAULT: '#FCF7EB',
          50: '#FFFEFB',
          100: '#FCF7EB',
          200: '#F9F0DD',
          300: '#F5E9CE',
          400: '#F1E2C0',
          500: '#EDDBB1',
          600: '#E3C88F',
          700: '#D9B56D',
          800: '#CFA24B',
          900: '#B88A35',
        },
        accent: {
          DEFAULT: '#f5a742',
          light: '#f8b960',
          dark: '#e89530',
        },
        'brand-bg': '#FCF7EB',
      },
      boxShadow: {
        brand: '0 10px 25px -5px rgba(119,191,84,0.3), 0 8px 10px -6px rgba(119,191,84,0.25)',
        cream: '0 10px 25px -5px rgba(252,247,235,0.5), 0 8px 10px -6px rgba(252,247,235,0.4)'
      }
    },
  },
  plugins: [],
}

