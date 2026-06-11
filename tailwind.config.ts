import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Esmark-agtig mørkeblå brandfarve til priser/overskrifter.
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
