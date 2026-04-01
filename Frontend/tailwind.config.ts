import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans:    ["Manrope", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "system-ui", "sans-serif"],
        mono:    ["JetBrains Mono", "Fira Code", "monospace"],
      },
      colors: {
        background:  "hsl(var(--background))",
        surface:     "hsl(var(--surface))",
        foreground:  "hsl(var(--foreground))",
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--surface-raised))",
          foreground: "hsl(var(--muted-foreground))",
        },
        border:      "hsl(var(--border))",
        code:        "hsl(var(--code))",
        trustBlue:   "#0056D2",
        growthOrange: "#FF6B35",
      },
      boxShadow: {
        /* Glow family — primary blue */
        "glow-sm": "0 0 15px -3px hsl(217 91% 60% / 0.35)",
        "glow":    "0 0 30px -5px hsl(217 91% 60% / 0.4)",
        "glow-lg": "0 0 60px -10px hsl(217 91% 60% / 0.5)",
        "glow-xl": "0 0 100px -15px hsl(217 91% 60% / 0.6)",
        /* Orange glow — secondary */
        "glow-orange": "0 0 40px -8px hsl(24 95% 60% / 0.4)",
        /* Violet glow — accent */
        "glow-violet": "0 0 40px -8px hsl(270 85% 65% / 0.4)",
        /* Glass surface shadow */
        "glass": "0 8px 32px 0 hsl(220 22% 4% / 0.6), inset 0 1px 0 0 hsl(0 0% 100% / 0.05)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%": { transform: "translateY(-10px) rotate(1deg)" },
          "66%": { transform: "translateY(-5px) rotate(-0.5deg)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px -5px hsl(217 91% 60% / 0.3)" },
          "50%": { boxShadow: "0 0 50px -5px hsl(217 91% 60% / 0.7)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "progress-fill": {
          from: { width: "0%" },
          to: { width: "var(--progress-width)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        shimmer:         "shimmer 4s linear infinite",
        float:           "float 8s ease-in-out infinite",
        "pulse-glow":    "pulse-glow 3s ease-in-out infinite",
        marquee:         "marquee 35s linear infinite",
        "fade-in":       "fade-in 0.7s ease-out forwards",
        "progress-fill": "progress-fill 1.5s ease-out forwards",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
