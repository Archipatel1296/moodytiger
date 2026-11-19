/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FAFBF9",   // near-white brand background
        cloud: "#F1F3EF",   // soft panel
        ink: "#1B1B2F",     // primary text
        mute: "#6B6F76",    // muted text
        tiger: "#FF6B35",   // primary brand orange
        sky: "#2DA7FF",     // secondary blue
        lime: "#5BC236",    // fresh green
        sun: "#FFC53D",     // sunny yellow
        grape: "#8B5CF6",   // playful purple accent
      },
      fontFamily: {
        display: ['"Fredoka"', "system-ui", "sans-serif"],
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(27,27,47,0.18)",
        pop: "0 8px 20px -6px rgba(255,107,53,0.45)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        floaty: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
      },
      animation: { floaty: "floaty 6s ease-in-out infinite" },
    },
  },
  plugins: [],
};
