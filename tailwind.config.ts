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
          deep: "#051322",
        },
        accent: {
          DEFAULT: "#0F766E",
          dark: "#0D655E",
          light: "#14B8A6",
          soft: "#F0FDFA",
          glow: "rgba(15, 118, 110, 0.25)",
        },
        surface: {
          DEFAULT: "#F6F7F9",
          hover: "#EEF0F4",
          card: "#FFFFFF",
          elevated: "#FFFFFF",
        },
        appText: {
          DEFAULT: "#1A2027",
          muted: "#5B6770",
          subtle: "#82909D",
        },
        appBorder: {
          DEFAULT: "#E2E8F0",
          focus: "#0F766E",
          subtle: "#F1F5F9",
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
      boxShadow: {
        "xs": "0 1px 2px 0 rgba(0, 0, 0, 0.04)",
        "sm": "0 2px 4px 0 rgba(11, 42, 74, 0.04)",
        "card": "0 10px 25px -5px rgba(11, 42, 74, 0.06), 0 8px 10px -6px rgba(11, 42, 74, 0.04)",
        "card-hover": "0 22px 40px -10px rgba(11, 42, 74, 0.14), 0 10px 15px -5px rgba(15, 118, 110, 0.08)",
        "premium": "0 20px 45px -15px rgba(11, 42, 74, 0.09), 0 0 1px 1px rgba(11, 42, 74, 0.05)",
        "elevated": "0 25px 50px -12px rgba(11, 42, 74, 0.16)",
        "glow": "0 0 25px -4px rgba(15, 118, 110, 0.3)",
        "glow-lg": "0 0 45px -5px rgba(15, 118, 110, 0.4)",
        "inner-soft": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.03)",
      },
      animation: {
        "pulse-subtle": "pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 4s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
      },
      keyframes: {
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-4px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
