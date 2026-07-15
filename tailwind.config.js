/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        campaign: {
          red: "#c0392b",
          "red-light": "#e74c3c",
          "red-dark": "#922b21",
        },
        cat: {
          zaljivka: "#e67e22",
          sovrazni: "#c0392b",
          groznja: "#8e44ad",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "count-up": "countUp 0.8s ease-out forwards",
        "scroll-up": "scrollUp 60s linear infinite",
        "rays-rotate": "raysRotate 120s linear infinite",
      },
      keyframes: {
        countUp: {
          "0%": { transform: "scale(0.92)", opacity: "0.4" },
          "40%": { transform: "scale(1.02)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        scrollUp: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-50%)" },
        },
        raysRotate: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};
