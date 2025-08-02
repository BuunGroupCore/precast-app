/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      borderWidth: {
        3: "3px",
      },
      colors: {
        // Poppy comic book color palette
        comic: {
          red: "#FF1744",
          darkRed: "#D50000",
          blue: "#2962FF",
          darkBlue: "#0039CB",
          yellow: "#FFD600",
          darkYellow: "#F9A825",
          green: "#00E676",
          darkGreen: "#00C853",
          purple: "#D500F9",
          darkPurple: "#AA00FF",
          orange: "#FF6D00",
          darkOrange: "#DD2C00",
          pink: "#FF4081",
          black: "#212121",
          white: "#FFFFFF",
          ink: "#000000",
        },
        pow: {
          light: "#FFE082",
          main: "#FFC107",
          dark: "#FF8F00",
        },
        bam: {
          light: "#E1BEE7",
          main: "#9C27B0",
          dark: "#6A1B9A",
        },
        zap: {
          light: "#FFF59D",
          main: "#FFEB3B",
          dark: "#F9A825",
        },
        boom: {
          light: "#FFCCBC",
          main: "#FF5722",
          dark: "#D84315",
        },
        panel: {
          bg: "#FFF8E1",
          border: "#000000",
          shadow: "#424242",
        },
      },
      fontFamily: {
        sans: ["Comic Neue", "Comic Sans MS", "cursive"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
        display: ["Bangers", "cursive"],
        comic: ["Kalam", "Comic Neue", "cursive"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        pow: "pow 0.5s ease-out",
        shake: "shake 0.5s ease-in-out",
        bounce: "bounce 1s ease-in-out infinite",
        "comic-hover": "comicHover 0.3s ease-out",
        "speech-bubble": "speechBubble 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pow: {
          "0%": { transform: "scale(1) rotate(0deg)" },
          "50%": { transform: "scale(1.2) rotate(5deg)" },
          "100%": { transform: "scale(1) rotate(0deg)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-5px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(5px)" },
        },
        bounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        comicHover: {
          "0%": { transform: "scale(1) rotate(0deg)" },
          "100%": { transform: "scale(1.05) rotate(-2deg)" },
        },
        speechBubble: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "grid-pattern": `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      },
    },
  },
  plugins: [],
};
