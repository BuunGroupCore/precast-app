/**
 * Design system color tokens.
 * Centralized color palette for consistent theming across the application.
 */

export const colors = {
  // Primary colors - Comic book theme
  comic: {
    red: "#FF0033",
    blue: "#0099FF",
    yellow: "#FFCC00",
    green: "#00CC66",
    purple: "#9966FF",
    orange: "#FF6600",
    pink: "#FF66CC",
    black: "#1A1A1A",
    white: "#FFFFFF",
    gray: "#E6E6E6",
    darkRed: "#CC0029",
    darkYellow: "#CCa300",
  },

  // Semantic colors
  semantic: {
    success: "#00CC66",
    error: "#FF0033",
    warning: "#FFCC00",
    info: "#0099FF",
  },

  // Neutral colors
  neutral: {
    50: "#FAFAFA",
    100: "#F5F5F5",
    200: "#E5E5E5",
    300: "#D4D4D4",
    400: "#A3A3A3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
  },

  // Background colors
  background: {
    primary: "#FFFFFF",
    secondary: "#E6E6E6",
    tertiary: "#1A1A1A",
    accent: "#FFF9E6",
  },

  // Text colors
  text: {
    primary: "#1A1A1A",
    secondary: "#737373",
    inverse: "#FFFFFF",
    link: "#0099FF",
    linkHover: "#0077CC",
  },
} as const;

export type ColorTokens = typeof colors;
export type ColorCategories = keyof ColorTokens;
export type ComicColors = keyof ColorTokens["comic"];
export type SemanticColors = keyof ColorTokens["semantic"];
export type NeutralColors = keyof ColorTokens["neutral"];
