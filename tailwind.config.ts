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
        primary: {
          DEFAULT: "#0B2A4A",
          dark: "#071B30",
          light: "#143D69",
        },
        accent: {
          DEFAULT: "#0F766E",
          dark: "#0D655E",
          light: "#14B8A6",
          soft: "#F0FDFA",
        },
        surface: {
          DEFAULT: "#F6F7F9",
          hover: "#EEF0F4",
          card: "#FFFFFF",
        },
        appText: {
          DEFAULT: "#1A2027",
          muted: "#5B6770",
          subtle: "#82909D",
        },
        appBorder: {
          DEFAULT: "#E2E8F0",
          focus: "#0F766E",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          '"Fira Sans"',
          '"Droid Sans"',
          '"Helvetica Neue"',
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
