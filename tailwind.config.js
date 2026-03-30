/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#007bff',
        'brand-orange': '#ff5e1f',
      }
    },
  },
  plugins: [],
}