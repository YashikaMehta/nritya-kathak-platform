/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#FAF6F0",
        parchment: "#F3ECE1",
        crimson: { 700: "#7A1F2B", 800: "#631722", 900: "#4A1018" },
        saffron: { 500: "#C87D28", 600: "#B06819" },
        gold: { 400: "#D4A359", 500: "#B8863B" },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', "Georgia", "serif"],
        sans: ['"Plus Jakarta Sans"', "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
