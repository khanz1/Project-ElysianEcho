import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"], // Enables dark mode via the 'dark' class
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        xxs: ["0.625rem", { lineHeight: "1rem" }],
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderRadius: {
        lg: "var(--radius)", // Reusing your custom radius variable
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: {
          DEFAULT: "var(--background)", // Accessing custom background variable
        },
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)", // Using card variable for background
          foreground: "var(--card-foreground)", // Card text color
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)", // Primary button or accent color
          foreground: "var(--primary-foreground)", // Primary button text
        },
        secondary: {
          DEFAULT: "var(--secondary)", // Secondary colors
          foreground: "var(--secondary-foreground)", // Secondary text
        },
        muted: {
          DEFAULT: "var(--muted)", // Muted color variants
          darker: "var(--muted-darker)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)", // Destructive (error) color
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)", // Border color for elements
        input: "var(--input)", // Input element color
        ring: "var(--ring)", // Focus ring for interactive elements
        chart: {
          "1": "var(--chart-1)", // Chart color variables for graphs
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")], // Plugin for animation utilities
};

export default config;
