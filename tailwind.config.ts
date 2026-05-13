import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/content/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#08243d",
        mist: "#f4f1ea",
        brass: "#bf9a55",
        stone: "#9ca3af",
        line: "rgba(8, 36, 61, 0.12)"
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"]
      },
      boxShadow: {
        panel: "0 30px 80px rgba(8, 15, 29, 0.18)"
      },
      backgroundImage: {
        "hero-radial":
          "linear-gradient(135deg, #f7f5ef 0%, #ffffff 55%, #efe9dc 100%)"
      }
    }
  },
  plugins: []
};

export default config;
