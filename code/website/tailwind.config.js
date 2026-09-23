/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0b1625",
        navy: "#10243d",
        mist: "#f4efe6",
        amber: "#fdc358",
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981', // emerald-500
          600: '#059669', // emerald-600
          700: '#047857', // emerald-700
          900: '#064e3b', // emerald-900
        },
        safety: {
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#ef4444',
          indigo: '#6366f1',
        },
        canvasBg: '#fdfdfc', // Lighter background matching portal
      },
      fontFamily: {
        sans: ['"Stack Sans Text"', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif'],
        display: ['"Stack Sans Headline"', '"Stack Sans Text"', 'Inter', 'ui-sans-serif', 'system-ui', "sans-serif"],
        body: ['"Stack Sans Text"', 'Inter', '"Segoe UI"', "Tahoma", "Geneva", "Verdana", "sans-serif"],
      },
      boxShadow: {
        soft: '0 10px 30px -10px rgba(0, 0, 0, 0.05)',
        card: '0 4px 20px -2px rgba(0, 0, 0, 0.06)',
        lifted: '0 20px 40px -15px rgba(16, 185, 129, 0.12)', // Emerald shadow
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
