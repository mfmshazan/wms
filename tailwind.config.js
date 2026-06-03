/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        wms: {
          bg:      "#0D0F12",
          surface: "#14171C",
          border:  "#1C1F24",
          green:   "#6EE8A2",
          orange:  "#F0A080",
          red:     "#F08080",
          blue:    "#80C8F0",
          purple:  "#B8A8F0",
          text:    "#E8E6E0",
          muted:   "#555555",
        },
      },
      fontFamily: {
        sans: ["'DM Sans'", "sans-serif"],
        mono: ["'Space Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
