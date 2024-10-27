/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          50: '#eff3fe',
          100: '#dfe6fe',
          200: '#bfcefc',
          300: '#8fa9fa',
          400: '#6f90f9',
          500: '#5F84F8',
          600: '#4c6ac6',
          700: '#394f95',
          800: '#263563',
          900: '#1C284A',
        },
      },
    },
  },
  plugins: [],
}
