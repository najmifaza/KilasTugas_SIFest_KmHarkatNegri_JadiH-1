/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#6366F1',
          surface: '#18181B',
          card: '#27272A',
        }
      }
    },
  },
  plugins: [],
}
