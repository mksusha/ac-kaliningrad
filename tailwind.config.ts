import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F8F8F3", // Светлый фон
        foreground: "#333333", // Темный текст
        accent: "#C7E07A",     // Зеленый акцент

        accentHover: "#B4CC6E", // Чуть более тёмный зелёный для hover
        accentHover2: "#879a4f", // Чуть более тёмный зелёный для hover


      },
    },
  },
  plugins: [],
} satisfies Config;
