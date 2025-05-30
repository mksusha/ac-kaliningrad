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
        background: "#F8F8F3",
        foreground: "#333333",
        accent: "#C7E07A",

        accentHover: "#B4CC6E",
        accentHover2: "#879a4f",


      },
    },
  },
  plugins: [],
} satisfies Config;
