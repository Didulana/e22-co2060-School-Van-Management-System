/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: '#faf8ff',
        'surface-bright': '#faf8ff',
        'surface-dim': '#d2d9f4',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f2f3ff',
        'surface-container': '#eaedff',
        'surface-container-high': '#e2e7ff',
        'surface-container-highest': '#dae2fd',
        'on-surface': '#131b2e',
        'on-surface-variant': '#3d4a42',
        primary: '#006948',
        'primary-container': '#00855d',
        'on-primary': '#ffffff',
        'on-primary-container': '#f5fff7',
        'primary-fixed': '#85f8c4',
        'primary-fixed-dim': '#68dba9',
        secondary: '#855300',
        'secondary-container': '#fea619',
        'on-secondary': '#ffffff',
        tertiary: '#006860',
        'tertiary-container': '#248279',
        error: '#ba1a1a',
        'error-container': '#ffdad6',
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
        canvasBg: '#fdfdfc',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', "sans-serif"],
        body: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'sans-serif'],
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
