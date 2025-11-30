/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",   // ⭐ Enable manual dark mode class
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        },
        floatUp: {
          "0%": { transform: "translateY(6px)" },
          "50%": { transform: "translateY(0px)" },
          "100%": { transform: "translateY(6px)" }
        }
      },
      animation: {
        fadeIn: "fadeIn 0.4s ease-out",
        floatUp: "floatUp 3s ease-in-out infinite"
      }
    }
  },
  plugins: [],
}
