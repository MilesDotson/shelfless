/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        accent: '#6B7280',
        link: '#16A34A',
      }
    }
  },
  plugins: [],
}
