/**
 * Design system shadow tokens.
 * Comic book styled shadows for depth and emphasis.
 */

export const shadows = {
  // Comic book shadows
  comic: {
    none: "none",
    small: "2px 2px 0 0 #000",
    medium: "4px 4px 0 0 #000",
    large: "6px 6px 0 0 #000",
    xlarge: "8px 8px 0 0 #000",
    // Colored shadows for special effects
    red: "4px 4px 0 0 var(--comic-red)",
    blue: "4px 4px 0 0 var(--comic-blue)",
    yellow: "4px 4px 0 0 var(--comic-yellow)",
    green: "4px 4px 0 0 var(--comic-green)",
    purple: "4px 4px 0 0 var(--comic-purple)",
  },

  // Soft shadows for subtle effects
  soft: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  },

  // Inner shadows
  inner: {
    DEFAULT: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
    sm: "inset 0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "inset 0 2px 4px 0 rgb(0 0 0 / 0.1)",
    lg: "inset 0 4px 8px 0 rgb(0 0 0 / 0.1)",
  },
} as const;

export type ShadowTokens = typeof shadows;
export type ComicShadows = keyof ShadowTokens["comic"];
export type SoftShadows = keyof ShadowTokens["soft"];
export type InnerShadows = keyof ShadowTokens["inner"];
