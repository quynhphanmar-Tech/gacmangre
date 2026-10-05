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
        // Base: Editorial Warm Ivory, Paper, and Deep Ink
        ivory: {
          50: "#FCFAF6",
          100: "#F7F3EB",
          200: "#EFE8DC",
          300: "#E3D7C3",
          DEFAULT: "#FAF8F5",
        },
        paper: {
          light: "#FFFFFF",
          DEFAULT: "#F9F6F0",
          dim: "#F3EDE2",
          border: "#E7DFD3",
        },
        ink: {
          lighter: "#665E58",
          light: "#423B36",
          DEFAULT: "#262220",
          deep: "#141211",
        },
        // Accent: Muted Amber / Honey Ochre for Ngăn #001
        amberWood: {
          50: "#FAF3EB",
          100: "#F3E3D1",
          500: "#C27835",
          600: "#A65F25",
          700: "#864918",
          800: "#693510",
        },
        sagePantry: {
          50: "#F4F6F2",
          500: "#4D6346",
          700: "#364731",
        },
      },
      fontFamily: {
        serif: [
          "Newsreader",
          "Playfair Display",
          "Merriweather",
          "Baskerville",
          "Georgia",
          "serif",
        ],
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      boxShadow: {
        pantry: "0 1px 3px rgba(20, 18, 17, 0.04), 0 8px 24px -4px rgba(20, 18, 17, 0.06)",
        pantryHover: "0 4px 6px rgba(20, 18, 17, 0.04), 0 16px 36px -4px rgba(20, 18, 17, 0.10)",
        subtleInner: "inset 0 1px 2px rgba(20, 18, 17, 0.05)",
      },
      letterSpacing: {
        pantryst: "0.22em",
        pantrystWide: "0.28em",
      },
    },
  },
  plugins: [],
} satisfies Config;
