import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#062B57",
          "navy-dark": "#041d3b",
          "navy-light": "#0a3a75",
          orange: "#FF6500",
          "orange-hover": "#e55b00",
          "orange-light": "#FFF2E8",
          warm: "#FAFAF7",
          white: "#FFFFFF",
          text: "#102033",
          muted: "#667085",
          "soft-navy": "#EEF4FA",
          "soft-orange": "#FFF2E8",
          border: "#E4E7EC",
        },
      },
      fontFamily: {
        heading: ["var(--font-manrope)", "Manrope", "sans-serif"],
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 2px 10px rgba(6, 43, 87, 0.04)",
        card: "0 4px 20px -2px rgba(6, 43, 87, 0.08)",
        "card-hover": "0 12px 32px -4px rgba(6, 43, 87, 0.12)",
        button: "0 2px 8px rgba(255, 101, 0, 0.25)",
      },
      borderRadius: {
        card: "1rem",
        badge: "9999px",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
