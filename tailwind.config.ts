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
        ink: "#07131c",
        mist: "#f4f1ea",
        brass: "#6aa7ac",
        stone: "#9ca3af",
        line: "rgba(255, 255, 255, 0.08)"
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
          "radial-gradient(circle at top left, rgba(106, 167, 172, 0.24), transparent 35%), radial-gradient(circle at 80% 20%, rgba(188, 206, 220, 0.12), transparent 24%), linear-gradient(135deg, #08111b 0%, #112338 52%, #07111b 100%)"
      }
    }
  },
  plugins: []
};

export default config;
