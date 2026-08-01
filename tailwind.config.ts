import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
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
        surface: {
          0: "#FFFFFF",
          50: "#FAFAF7",
          100: "#F4F4F0",
          200: "#E8E8E3",
          300: "#D4D4CE",
          800: "#1E293B",
          900: "#0F172A",
          950: "#020617",
        },
        accent: {
          emerald: "#10B981",
          sky: "#0EA5E9",
          violet: "#8B5CF6",
          rose: "#F43F5E",
          amber: "#F59E0B",
          teal: "#14B8A6",
        },
      },
      fontFamily: {
        heading: ["var(--font-outfit)", "var(--font-manrope)", "Manrope", "sans-serif"],
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["4.5rem", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "800" }],
        "display-lg": ["3.75rem", { lineHeight: "1.08", letterSpacing: "-0.025em", fontWeight: "800" }],
        "display": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "800" }],
        "heading-xl": ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "700" }],
        "heading-lg": ["1.875rem", { lineHeight: "1.2", letterSpacing: "-0.015em", fontWeight: "700" }],
        "heading": ["1.5rem", { lineHeight: "1.25", letterSpacing: "-0.01em", fontWeight: "700" }],
        "heading-sm": ["1.25rem", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6" }],
        "body": ["1rem", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5" }],
        "caption": ["0.75rem", { lineHeight: "1.4" }],
        "overline": ["0.6875rem", { lineHeight: "1.2", letterSpacing: "0.1em", fontWeight: "700" }],
      },
      boxShadow: {
        subtle: "0 2px 10px rgba(6, 43, 87, 0.04)",
        card: "0 4px 20px -2px rgba(6, 43, 87, 0.08)",
        "card-hover": "0 12px 32px -4px rgba(6, 43, 87, 0.12)",
        elevated: "0 20px 60px -12px rgba(6, 43, 87, 0.15)",
        button: "0 2px 8px rgba(255, 101, 0, 0.25)",
        "button-hover": "0 8px 24px rgba(255, 101, 0, 0.35)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.08)",
        "glass-dark": "0 8px 32px rgba(0, 0, 0, 0.25)",
        "inner-glow": "inset 0 1px 1px rgba(255, 255, 255, 0.1)",
        glow: "0 0 20px rgba(255, 101, 0, 0.15)",
      },
      borderRadius: {
        card: "1.25rem",
        "card-lg": "1.5rem",
        badge: "9999px",
        button: "0.875rem",
      },
      spacing: {
        "section": "6rem",
        "section-sm": "4rem",
        "section-lg": "8rem",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-brand": "linear-gradient(135deg, #062B57 0%, #0a3a75 50%, #062B57 100%)",
        "gradient-orange": "linear-gradient(135deg, #FF6500 0%, #FF8533 100%)",
        "gradient-warm": "linear-gradient(180deg, #FAFAF7 0%, #FFFFFF 100%)",
        "gradient-hero": "linear-gradient(180deg, rgba(6,43,87,0.7) 0%, rgba(6,43,87,0.3) 50%, rgba(6,43,87,0.8) 100%)",
        "gradient-glass": "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "fade-in-down": "fadeInDown 0.5s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "slide-down": "slideDown 0.4s ease-out forwards",
        "slide-in-left": "slideInLeft 0.5s ease-out forwards",
        "slide-in-right": "slideInRight 0.5s ease-out forwards",
        "scale-in": "scaleIn 0.4s ease-out forwards",
        "float": "float 6s ease-in-out infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "spin-slow": "spin 8s linear infinite",
        "bounce-soft": "bounceSoft 2s ease-in-out infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "typewriter": "typewriter 3s steps(30) forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        bounceSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255, 101, 0, 0.15)" },
          "50%": { boxShadow: "0 0 40px rgba(255, 101, 0, 0.3)" },
        },
        typewriter: {
          "0%": { width: "0" },
          "100%": { width: "100%" },
        },
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out-back": "cubic-bezier(0.68, -0.6, 0.32, 1.6)",
      },
    },
  },
  plugins: [],
};

export default config;
