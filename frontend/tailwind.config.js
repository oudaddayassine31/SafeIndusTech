/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'safety-red': '#ef4444',
        'safety-orange': '#f97316',
        'safety-yellow': '#eab308',
        'safety-green': '#22c55e',
      }
    },
  },
  plugins: [],
}