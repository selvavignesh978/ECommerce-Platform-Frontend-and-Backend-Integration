/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#161616",
        paper: "#FAF9F6",
        plum: "#5B2333",
        clay: "#C4622D",
        moss: "#3F5C4A",
        sand: "#EDE6DA",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
