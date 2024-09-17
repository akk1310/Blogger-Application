/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
      },
      screens: {
        'xs': '500px', // Custom extra small breakpoint
        'xsm': '480px', // Custom extra small breakpoint
        
      },
    },
  },
  plugins: [],
}
