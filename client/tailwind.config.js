/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vmanous: {
          navy: {
            dark: '#050816',
            deep: '#080B1A',
          },
          light: '#F7F9FC',
          white: '#FFFFFF',
          green: {
            DEFAULT: '#16A34A',
            hover: '#15803D',
          },
          ai: {
            blue: '#2563EB',
            electric: '#3B82F6',
            purple: '#7C3AED',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
