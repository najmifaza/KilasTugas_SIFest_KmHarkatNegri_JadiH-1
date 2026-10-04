/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        app: {
          bg: '#F5F6FA',
          coral: '#F26A36',
          coralLight: '#FFF0EA',
          navy: '#1A202C',
          navyLight: '#2D3748',
          card: '#FFFFFF',
          border: '#E8EAEE',
          muted: '#717A8A',
        }
      },
      borderRadius: {
        '2xl': '18px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'card': '0 2px 10px rgba(0, 0, 0, 0.04)',
        'float': '0 8px 30px rgba(26, 32, 44, 0.18)',
      }
    },
  },
  plugins: [],
}
