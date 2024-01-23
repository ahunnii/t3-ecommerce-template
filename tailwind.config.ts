// import { withUt } from "uploadthing/tw";

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  // content: [
  //   './pages/**/*.{ts,tsx}',
  //   './components/**/*.{ts,tsx}',
  //   './core/**/*.{ts,tsx}',
  //   './src/**/*.{ts,tsx}',
  // ],
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        "ta-primary": "#00040f", // Your primary background color
        "ta-secondary": "#00f6ff", // Your secondary accent color
        "ta-dimWhite": "rgba(255, 255, 255, 0.7)", // A dimmed white color
        "ta-dimBlue": "rgba(9, 151, 124, 0.1)", // A dimmed blue color

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "sledge-primary": {
          DEFAULT: "hsl(var(--sledge-primary))",
          foreground: "hsl(var(--sledge-primary-foreground))",
        },
        "sledge-secondary": {
          DEFAULT: "hsl(var(--sledge-secondary))",
          foreground: "hsl(var(--sledge-secondary-foreground))",
        },
        "sledge-accent": {
          DEFAULT: "hsl(var(--sledge-accent))",
          foreground: "hsl(var(--sledge-accent-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"], // Use the Poppins font family
      },
      screens: {
        "ta-xs": "480px",
        "ta-ss": "620px",
        "ta-sm": "768px",
        "ta-md": "1060px",
        "ta-lg": "1200px",
        "ta-xl": "1700px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
