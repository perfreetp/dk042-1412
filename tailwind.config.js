/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        navy: {
          50: "#E8EEF5",
          100: "#C5D1E3",
          200: "#9FB4CF",
          300: "#7996BA",
          400: "#5C7EAB",
          500: "#3E679C",
          600: "#355987",
          700: "#2A476E",
          800: "#1F3552",
          900: "#0F172A",
          950: "#0A2342",
        },
        accent: {
          green: "#2A9D8F",
          yellow: "#E9C46A",
          red: "#E63946",
          blue: "#457B9D",
        },
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      keyframes: {
        pulseGreen: {
          "0%, 100%": {
            boxShadow: "0 0 0 0 rgba(42, 157, 143, 0.7)",
          },
          "50%": {
            boxShadow: "0 0 0 12px rgba(42, 157, 143, 0)",
          },
        },
        pulseRed: {
          "0%, 100%": {
            boxShadow: "0 0 0 0 rgba(230, 57, 70, 0.7)",
          },
          "50%": {
            boxShadow: "0 0 0 12px rgba(230, 57, 70, 0)",
          },
        },
        pulseYellow: {
          "0%, 100%": {
            boxShadow: "0 0 0 0 rgba(233, 196, 106, 0.7)",
          },
          "50%": {
            boxShadow: "0 0 0 12px rgba(233, 196, 106, 0)",
          },
        },
        slideInRight: {
          "0%": {
            transform: "translateX(100%)",
            opacity: "0",
          },
          "100%": {
            transform: "translateX(0)",
            opacity: "1",
          },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        numberJump: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        borderFlash: {
          "0%, 100%": { borderColor: "rgba(230, 57, 70, 0.3)" },
          "50%": { borderColor: "rgba(230, 57, 70, 1)" },
        },
      },
      animation: {
        "pulse-green": "pulseGreen 2s ease-in-out infinite",
        "pulse-red": "pulseRed 1s ease-in-out infinite",
        "pulse-yellow": "pulseYellow 1.5s ease-in-out infinite",
        "slide-in-right": "slideInRight 0.4s ease-out",
        "fade-in": "fadeIn 0.3s ease-out",
        "number-jump": "numberJump 0.3s ease-out",
        "border-flash": "borderFlash 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
