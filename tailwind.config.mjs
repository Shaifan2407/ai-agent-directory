import plugin from "tailwindcss/plugin";

/** Custom plugin to add CSS variables for colors */
const addVariablesForColors = plugin(function ({ addBase, theme }) {
  const colors = theme("colors");
  let newVars = {};

  Object.keys(colors).forEach((key) => {
    if (typeof colors[key] === "string") {
      newVars[`--${key}`] = colors[key];
    } else if (typeof colors[key] === "object") {
      Object.keys(colors[key]).forEach((shade) => {
        newVars[`--${key}-${shade}`] = colors[key][shade];
      });
    }
  });

  addBase({
    ":root": newVars,
  });
});

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#2EFFD5",
          foreground: "#000000",
        },
        secondary: {
          DEFAULT: "#FF2EF1",
          foreground: "#000000",
        },
        card: {
          DEFAULT: "#141414",
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "#141414",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
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
        scroll: {
          to: {
            transform: "translate(calc(-50% - 0.5rem))",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        scroll: "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
      },
      fontFamily: {
        "suisse-bold": ["SuisseIntl-Bold", "sans-serif"],
        "suisse-light": ["SuisseIntl-Light", "sans-serif"],
        "suisse-medium": ["SuisseIntl-Medium", "sans-serif"],
        "suisse-regular": ["SuisseIntl-Regular", "sans-serif"],
        "suisse-semibold": ["SuisseIntl-SemiBold", "sans-serif"],
        instrument: ['"Instrument Serif"', "serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate"), addVariablesForColors],
};
