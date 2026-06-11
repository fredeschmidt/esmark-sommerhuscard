import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Esmark-like dark blue brand color for prices/headings.
        brand: {
          DEFAULT: "#0e2a47",
          dark: "#0a2038",
        },
      },
    },
  },
  plugins: [],
};

export default config;
