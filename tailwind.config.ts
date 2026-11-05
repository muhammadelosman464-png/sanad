import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef8ff",
          100: "#d9eeff",
          200: "#bce1ff",
          300: "#8ecdff",
          400: "#58b0fc",
          500: "#328ef7",
          600: "#1a6fe9",
          700: "#1458d6",
          800: "#1747ad",
          900: "#183e88",
          950: "#132753",
        },
        gold: {
          300: "#ffe57a",
          400: "#ffd700",
          500: "#d4af37",
          600: "#b8930a",
        },
        forest: {
          800: "#1d3023",
          900: "#141f17",
          950: "#0d1810",
        },
        cream: {
          50: "#fdfaf4",
          100: "#fbf7ec",
          200: "#f5edda",
        },
        darkBg: "#090d16",
        darkSurface: "#0f172a",
        darkBorder: "#1e293b",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        arabic: ["var(--font-cairo)", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse-slow 6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 1.8s infinite",
      },
      keyframes: {
        "pulse-slow": {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      screens: {
        "3xl": "1920px",
      },
    },
  },
  plugins: [],
};

export default config;
