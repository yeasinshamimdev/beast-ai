import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1536px",
      },
    },
    extend: {
      boxShadow: {
        primary: "0px 10px 40px 0px rgba(0, 0, 0, 0.05)",
        secondary: "0px 1px 2px 0px rgba(0, 0, 0, 0.05);",
        "dark-shadow": "0px 10px 40px 0px rgba(0, 0, 0, 0.05)",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      fontWeight: {
        thin: "100",
        extralight: "200",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      },
      colors: {
        primary: {
          DEFAULT: "#111827",
          light: "#3B82F6",
          dark: "#111827",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
