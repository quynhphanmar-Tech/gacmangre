import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAF7F2",
        foreground: "#211D1A",
        earth: {
          50: "#FAF7F2",
          100: "#F4ECE1",
          200: "#E8D8C3",
          300: "#D6BFA0",
          400: "#BE9D77",
          500: "#9E7B54",
          600: "#7F5E3C",
          700: "#5F442A",
          800: "#3E2B1B",
          900: "#22170E",
        },
        ochre: {
          DEFAULT: "#C86D32",
          light: "#E08B4E",
          dark: "#A34F1D",
        },
        clay: "#8C4A2F",
        bamboo: "#3F4F38",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Merriweather", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
