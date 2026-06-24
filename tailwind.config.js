/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        wms: {
          bg:      "#F1F5F9",
          surface: "#FFFFFF",
          border:  "#E2E8F0",
          green:   "#10B981",
          orange:  "#F59E0B",
          red:     "#EF4444",
          blue:    "#3B82F6",
          purple:  "#6366F1",
          text:    "#1E293B",
          muted:   "#94A3B8",
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
