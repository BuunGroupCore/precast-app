/**
 * Design system typography tokens.
 * Centralized typography settings for consistent text styling.
 */

export const typography = {
  // Font families
  fontFamily: {
    display: '"Bangers", system-ui, -apple-system, sans-serif',
    comic: '"Comic Neue", "Comic Sans MS", cursive',
    mono: '"Fira Code", "Consolas", "Monaco", monospace',
    sans: 'system-ui, -apple-system, "Segoe UI", sans-serif',
  },

  // Font sizes
  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem", // 48px
    "6xl": "3.75rem", // 60px
    "7xl": "4.5rem", // 72px
    "8xl": "6rem", // 96px
    "9xl": "8rem", // 128px
  },

  // Font weights
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Line heights
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Letter spacing
  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },
} as const;

export type TypographyTokens = typeof typography;
export type FontFamily = keyof TypographyTokens["fontFamily"];
export type FontSize = keyof TypographyTokens["fontSize"];
export type FontWeight = keyof TypographyTokens["fontWeight"];
export type LineHeight = keyof TypographyTokens["lineHeight"];
export type LetterSpacing = keyof TypographyTokens["letterSpacing"];
