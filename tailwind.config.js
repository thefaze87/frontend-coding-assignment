/**
 * Tailwind Configuration
 *
 * Purpose:
 * - Define design system tokens
 * - Configure utility generation
 * - Set up responsive breakpoints
 * - Optimize production builds
 *
 * Design System:
 * - Custom color schemes
 * - Typography scale
 * - Spacing system
 * - Component variants
 *
 * Technical Considerations:
 * - Build optimization
 * - CSS purging
 * - Plugin integration
 * - Custom utility generation
 *
 * Implementation Notes:
 * - JIT compilation
 * - Theme extension
 * - Variant configuration
 * - Media query breakpoints
 */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "pagination-border": "#F1F1F199",
        "pagination-button-bg": "#37373780",
        "pagination-hover": "#0B873D",
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
