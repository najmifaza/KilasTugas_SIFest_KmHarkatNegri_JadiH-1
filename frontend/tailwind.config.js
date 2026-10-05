/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          850: '#151f32',
          950: '#0b1120',
        },
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        '2xs': '0 1px 2px rgba(0, 0, 0, 0.04)',
        'xs': '0 1px 3px rgba(0, 0, 0, 0.05)',
        'sm': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'soft': '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)',
        'card': '0 2px 16px rgba(0, 0, 0, 0.06)',
        'elevated': '0 8px 24px -4px rgba(0,0,0,0.08)',
        'sheet': '0 -8px 30px rgba(0,0,0,0.12)',
      }
    },
  },
  plugins: [],
}
