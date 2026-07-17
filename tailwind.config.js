/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "campaign-red": "#c0392b",
        "campaign-red-light": "#e74c3c",
        "campaign-red-dark": "#922b21",
      },
    },
  },
  plugins: [],
};
