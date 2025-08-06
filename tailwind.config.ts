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
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#00695C",
        secondary: "#0277BD",
        accent: "#26A69A",
        info: "#29B6F6",
        success: "#2E7D32",
        warning: "#F9A825",
        danger: "#C62828",
      },
    },
    screens: {
      md: "850px",
    },
  },
  plugins: [],
};
export default config;
