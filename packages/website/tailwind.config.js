/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "../ui/src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      borderWidth: {
        3: "3px",
      },
      colors: {
        // Professional Comic Book Palette with Better Contrast
        comic: {
          // Primary colors with improved contrast ratios
          red: "#E53935", // Material Red 600 - softer than pure red
          darkRed: "#B71C1C", // Material Red 900 - better for text
          blue: "#1E88E5", // Material Blue 600 - more readable
          darkBlue: "#0D47A1", // Material Blue 900 - deep navy
          yellow: "#FBC02D", // Material Yellow 700 - less harsh
          darkYellow: "#F57C00", // Material Orange 700 - warmer accent
          green: "#43A047", // Material Green 600 - professional green
          darkGreen: "#1B5E20", // Material Green 900 - forest green
          purple: "#8E24AA", // Material Purple 600 - balanced purple
          darkPurple: "#4A148C", // Material Purple 900 - deep purple
          orange: "#FB8C00", // Material Orange 600 - warm orange
          darkOrange: "#E65100", // Material Orange 900 - burnt orange
          pink: "#EC407A", // Material Pink 400 - soft pink
          black: "#1A1A1A", // Softer black for better eye comfort
          white: "#FAFAFA", // Slightly off-white
          ink: "#0A0A0A", // True black for borders

          // Background shades for depth
          bg: {
            light: "#FFFEF7", // Warm cream background
            main: "#FFF8E1", // Light amber tint
            dark: "#FFF3D0", // Deeper amber
          },

          // Neutral grays for UI elements
          gray: {
            50: "#FAFAFA",
            100: "#F5F5F5",
            200: "#EEEEEE",
            300: "#E0E0E0",
            400: "#BDBDBD",
            500: "#9E9E9E",
            600: "#757575",
            700: "#616161",
            800: "#424242",
            900: "#212121",
          },
        },

        // Action buttons with better accessibility
        pow: {
          light: "#FFE57F", // Lighter, softer yellow
          main: "#FFC947", // Golden yellow
          dark: "#F9A825", // Amber accent
          contrast: "#5D4037", // Dark brown for text contrast
        },
        bam: {
          light: "#FF8A80", // Light coral
          main: "#FF5252", // Bright red
          dark: "#D32F2F", // Dark red
          contrast: "#FFFFFF", // White for text
        },
        zap: {
          light: "#B2FF59", // Light lime
          main: "#76FF03", // Electric green
          dark: "#64DD17", // Darker lime
          contrast: "#1A237E", // Dark blue for text
        },
        boom: {
          light: "#EA80FC", // Light purple
          main: "#D500F9", // Bright magenta
          dark: "#AA00FF", // Deep purple
          contrast: "#FFFFFF", // White for text
        },

        // UI-specific colors
        panel: {
          bg: "#FFFEF7", // Main panel background
          bgDark: "#1E1E1E", // Dark mode panel
          border: "#2C2C2C", // Softer border color
          shadow: "#00000020", // Transparent shadow
          accent: "#FFF3D0", // Accent background
        },

        // Status colors for better UX
        status: {
          success: "#4CAF50",
          warning: "#FF9800",
          error: "#F44336",
          info: "#2196F3",
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
