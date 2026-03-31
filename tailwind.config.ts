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
        ink: "#09111f",
        mist: "#f4f1ea",
        brass: "#b89146",
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
          "radial-gradient(circle at top left, rgba(184, 145, 70, 0.22), transparent 35%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.12), transparent 25%), linear-gradient(135deg, #08111f 0%, #10213d 52%, #08111f 100%)"
      }
    }
  },
  plugins: []
};

export default config;
