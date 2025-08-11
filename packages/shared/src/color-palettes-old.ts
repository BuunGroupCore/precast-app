/**
 * Color palette configurations for project themes
 * Shared between CLI and website for consistency
 */

export interface ColorPalette {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    primaryDark: string;
    secondary: string;
    secondaryDark: string;
    accent: string;
    accentDark: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    error: string;
    warning: string;
    success: string;
    info: string;
  };
  preview?: string[]; // Array of main colors for preview
  category: "modern" | "retro" | "professional" | "playful" | "dark" | "light";
}

export const colorPalettes: ColorPalette[] = [
  {
    id: "minimal-pro",
    name: "Minimal Pro",
    description: "Clean, modern design system",
    category: "modern",
    colors: {
      primary: "#0F172A",
      primaryDark: "#020617",
      secondary: "#F1F5F9",
      secondaryDark: "#E2E8F0",
      accent: "#0F172A",
      accentDark: "#020617",
      background: "#FFFFFF",
      surface: "#F8FAFC",
      text: "#020617",
      textSecondary: "#64748B",
      error: "#EF4444",
      warning: "#F59E0B",
      success: "#10B981",
      info: "#3B82F6",
    },
    preview: ["#0F172A", "#F1F5F9", "#3B82F6", "#10B981"],
  },
  {
    id: "monochrome",
    name: "Monochrome",
    description: "High contrast black and white theme",
    category: "modern",
    colors: {
      primary: "#000000",
      primaryDark: "#111111",
      secondary: "#FFFFFF",
      secondaryDark: "#FAFAFA",
      accent: "#0070F3",
      accentDark: "#0051CC",
      background: "#FFFFFF",
      surface: "#FAFAFA",
      text: "#000000",
      textSecondary: "#666666",
      error: "#EE0000",
      warning: "#F5A623",
      success: "#50E3C2",
      info: "#0070F3",
    },
    preview: ["#000000", "#0070F3", "#50E3C2", "#FAFAFA"],
  },
  {
    id: "gradient",
    name: "Gradient",
    description: "Vibrant gradient-friendly palette",
    category: "modern",
    colors: {
      primary: "#635BFF",
      primaryDark: "#5243CC",
      secondary: "#00D4FF",
      secondaryDark: "#00A9CC",
      accent: "#00D924",
      accentDark: "#00AC1D",
      background: "#FFFFFF",
      surface: "#F6F9FC",
      text: "#0A2540",
      textSecondary: "#425466",
      error: "#DF1B41",
      warning: "#F59300",
      success: "#00D924",
      info: "#00D4FF",
    },
    preview: ["#635BFF", "#00D4FF", "#00D924", "#0A2540"],
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "Dark productive workspace theme",
    category: "dark",
    colors: {
      primary: "#5E6AD2",
      primaryDark: "#4B57C3",
      secondary: "#F7F8F8",
      secondaryDark: "#E8E8E8",
      accent: "#5E6AD2",
      accentDark: "#4B57C3",
      background: "#0E0E10",
      surface: "#1A1523",
      text: "#F7F8F8",
      textSecondary: "#8F8F8F",
      error: "#F04438",
      warning: "#F79009",
      success: "#12B76A",
      info: "#5E6AD2",
    },
    preview: ["#5E6AD2", "#F7F8F8", "#12B76A", "#1A1523"],
  },
  {
    id: "breeze",
    name: "Breeze",
    description: "Fresh and balanced colors",
    category: "modern",
    colors: {
      primary: "#06B6D4",
      primaryDark: "#0891B2",
      secondary: "#8B5CF6",
      secondaryDark: "#7C3AED",
      accent: "#10B981",
      accentDark: "#059669",
      background: "#FFFFFF",
      surface: "#F9FAFB",
      text: "#111827",
      textSecondary: "#6B7280",
      error: "#EF4444",
      warning: "#F59E0B",
      success: "#10B981",
      info: "#3B82F6",
    },
    preview: ["#06B6D4", "#8B5CF6", "#10B981", "#3B82F6"],
  },
  {
    id: "electric",
    name: "Electric",
    description: "Vibrant neon colors for bold designs",
    category: "playful",
    colors: {
      primary: "#FF006E",
      primaryDark: "#C10049",
      secondary: "#3A86FF",
      secondaryDark: "#2968DB",
      accent: "#FFBE0B",
      accentDark: "#FB8500",
      background: "#0A0A0A",
      surface: "#1A1A1A",
      text: "#FFFFFF",
      textSecondary: "#B0B0B0",
      error: "#FF4444",
      warning: "#FFB700",
      success: "#06FFA5",
      info: "#00B4D8",
    },
    preview: ["#FF006E", "#3A86FF", "#FFBE0B", "#06FFA5"],
  },
  {
    id: "nature",
    name: "Nature",
    description: "Natural greens and earth tones",
    category: "professional",
    colors: {
      primary: "#16A34A",
      primaryDark: "#15803D",
      secondary: "#84CC16",
      secondaryDark: "#65A30D",
      accent: "#A16207",
      accentDark: "#854D0E",
      background: "#F7FEE7",
      surface: "#ECFCCB",
      text: "#1A2E05",
      textSecondary: "#365314",
      error: "#DC2626",
      warning: "#F59E0B",
      success: "#16A34A",
      info: "#0EA5E9",
    },
    preview: ["#16A34A", "#84CC16", "#A16207", "#0EA5E9"],
  },
  {
    id: "sunset",
    name: "Sunset",
    description: "Warm oranges and purples",
    category: "playful",
    colors: {
      primary: "#F97316",
      primaryDark: "#EA580C",
      secondary: "#A855F7",
      secondaryDark: "#9333EA",
      accent: "#EAB308",
      accentDark: "#CA8A04",
      background: "#FFF7ED",
      surface: "#FED7AA",
      text: "#431407",
      textSecondary: "#92400E",
      error: "#DC2626",
      warning: "#F59E0B",
      success: "#16A34A",
      info: "#2563EB",
    },
    preview: ["#F97316", "#A855F7", "#EAB308", "#EC4899"],
  },
  {
    id: "developer",
    name: "Developer",
    description: "GitHub's signature dark theme",
    category: "dark",
    colors: {
      primary: "#58A6FF",
      primaryDark: "#1F6FEB",
      secondary: "#F78166",
      secondaryDark: "#DA3633",
      accent: "#A371F7",
      accentDark: "#8957E5",
      background: "#0D1117",
      surface: "#161B22",
      text: "#C9D1D9",
      textSecondary: "#8B949E",
      error: "#F85149",
      warning: "#D29922",
      success: "#56D364",
      info: "#58A6FF",
    },
    preview: ["#58A6FF", "#F78166", "#A371F7", "#56D364"],
  },
  {
    id: "arctic",
    name: "Arctic",
    description: "Cool, north-bluish color palette",
    category: "professional",
    colors: {
      primary: "#5E81AC",
      primaryDark: "#2E3440",
      secondary: "#81A1C1",
      secondaryDark: "#4C566A",
      accent: "#88C0D0",
      accentDark: "#5E81AC",
      background: "#ECEFF4",
      surface: "#E5E9F0",
      text: "#2E3440",
      textSecondary: "#4C566A",
      error: "#BF616A",
      warning: "#D08770",
      success: "#A3BE8C",
      info: "#5E81AC",
    },
    preview: ["#5E81AC", "#81A1C1", "#88C0D0", "#A3BE8C"],
  },
];

export const getColorPaletteById = (id: string): ColorPalette | undefined => {
  return colorPalettes.find((palette) => palette.id === id);
};

export const getColorPalettesByCategory = (category: ColorPalette["category"]): ColorPalette[] => {
  return colorPalettes.filter((palette) => palette.category === category);
};

export const defaultColorPalette = "minimal-pro";

/**
 * Generate CSS variables for a color palette
 */
export function generateCSSVariables(palette: ColorPalette): string {
  return `:root {
  /* Primary Colors */
  --color-primary: ${palette.colors.primary};
  --color-primary-dark: ${palette.colors.primaryDark};
  
  /* Secondary Colors */
  --color-secondary: ${palette.colors.secondary};
  --color-secondary-dark: ${palette.colors.secondaryDark};
  
  /* Accent Colors */
  --color-accent: ${palette.colors.accent};
  --color-accent-dark: ${palette.colors.accentDark};
  
  /* Background Colors */
  --color-background: ${palette.colors.background};
  --color-surface: ${palette.colors.surface};
  
  /* Text Colors */
  --color-text: ${palette.colors.text};
  --color-text-secondary: ${palette.colors.textSecondary};
  
  /* Status Colors */
  --color-error: ${palette.colors.error};
  --color-warning: ${palette.colors.warning};
  --color-success: ${palette.colors.success};
  --color-info: ${palette.colors.info};
}`;
}

/**
 * Generate Tailwind CSS config for a color palette
 */
export function generateTailwindConfig(palette: ColorPalette): string {
  return `colors: {
      primary: {
        DEFAULT: '${palette.colors.primary}',
        dark: '${palette.colors.primaryDark}',
      },
      secondary: {
        DEFAULT: '${palette.colors.secondary}',
        dark: '${palette.colors.secondaryDark}',
      },
      accent: {
        DEFAULT: '${palette.colors.accent}',
        dark: '${palette.colors.accentDark}',
      },
      background: '${palette.colors.background}',
      surface: '${palette.colors.surface}',
      text: {
        DEFAULT: '${palette.colors.text}',
        secondary: '${palette.colors.textSecondary}',
      },
      error: '${palette.colors.error}',
      warning: '${palette.colors.warning}',
      success: '${palette.colors.success}',
      info: '${palette.colors.info}',
    }`;
}
