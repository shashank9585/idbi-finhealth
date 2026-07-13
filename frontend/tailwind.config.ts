import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // IDBI-inspired Enterprise Palette
        primary: {
          DEFAULT: "#003366", // Deep Navy
          light: "#004080",
          dark: "#002244",
        },
        success: "#10b981", // Emerald
        warning: "#f59e0b", // Amber
        danger: "#ef4444",  // Crimson
        background: "#f8fafc", // Very light gray/blue
        card: "#ffffff",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
      }
    },
  },
  plugins: [],
};
export default config;