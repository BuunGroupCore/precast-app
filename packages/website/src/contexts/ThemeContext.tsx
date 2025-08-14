import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ComicTheme = "classic" | "dark" | "retro" | "neon" | "manga";

interface ThemeContextType {
  theme: ComicTheme;
  setTheme: (theme: ComicTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Theme provider component that manages comic theme state.
 * Persists theme selection to localStorage and applies theme attributes to the document.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ComicTheme>(() => {
    const savedTheme = localStorage.getItem("comic-theme");
    return (savedTheme as ComicTheme) || "classic";
  });

  useEffect(() => {
    localStorage.setItem("comic-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

/**
 * Hook to access the current theme and theme setter.
 * Must be used within a ThemeProvider component.
 *
 * @returns Theme context with current theme and setTheme function
 * @throws Error if used outside of ThemeProvider
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
