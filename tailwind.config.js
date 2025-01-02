/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "pagination-border": "#F1F1F199",
        "pagination-button-bg": "#37373780",
        "pagination-hover": "#0B873D",
        "filter-button-bg": "#37373780",
        "filter-button-bghover": "#0B873D",
      },
      borderWidth: {
        1: "1px",
      },
      transitionTimingFunction: {
        pagination: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      width: {
        630: "39.38rem",
      },
    },
  },
  plugins: [],
};
