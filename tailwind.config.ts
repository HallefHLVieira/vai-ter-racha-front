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
        // background: "var(--background)",
        foreground: "var(--foreground)",
        bg: '#0F1A0F',
        card: '#1C2F1C',
        primary: '#228B22',
        text: '#F1F1F1',
        textMuted: '#A0BFA0',
        confirm: '#38C172',
        danger: '#E74C3C',
        highlight: '#FFD700',
        borderSoft: '#2E8B57',
        hoverGreen: '#2AAA2A',
      },
    },
  },
  plugins: [],
} satisfies Config;
