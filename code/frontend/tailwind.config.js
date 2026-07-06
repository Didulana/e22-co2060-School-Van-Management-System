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
      },
      boxShadow: {
        panel: "0 24px 80px rgba(0, 0, 0, 0.28)",
      },
      fontFamily: {
        sans: ['"Stack Sans Text"', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif'],
        display: ['"Stack Sans Headline"', '"Stack Sans Text"', 'Inter', 'ui-sans-serif', 'system-ui', "sans-serif"],
        body: ['"Stack Sans Text"', 'Inter', '"Segoe UI"', "Tahoma", "Geneva", "Verdana", "sans-serif"],
      },
    },
  },
  plugins: [],
};
