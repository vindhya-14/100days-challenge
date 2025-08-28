/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb", // custom blue
        secondary: "#9333ea", // custom purple
        accent: "#f59e0b", // custom amber
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["Fira Code", "monospace"],
      },
      boxShadow: {
        soft: "0 4px 10px rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [],
};
