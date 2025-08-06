import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FaPalette } from "react-icons/fa";

import { useTheme, ComicTheme } from "../contexts/ThemeContext";

const themes: { id: ComicTheme; name: string; colors: string[] }[] = [
  { id: "classic", name: "CLASSIC", colors: ["#FF1744", "#FFD600", "#2962FF"] },
  {
    id: "dark",
    name: "DARK KNIGHT",
    colors: ["#424242", "#E0E0E0", "#FF5252"],
  },
  { id: "retro", name: "RETRO POP", colors: ["#FF6B6B", "#4ECDC4", "#FFE66D"] },
  { id: "neon", name: "NEON CITY", colors: ["#FF006E", "#8338EC", "#3A86FF"] },
  { id: "manga", name: "MANGA", colors: ["#000000", "#FFFFFF", "#FF0000"] },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const currentTheme = themes.find((t) => t.id === theme);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="filter-btn-comic flex items-center gap-2 px-3 py-2"
      >
        <FaPalette className="text-lg" />
        <span className="hidden sm:inline font-comic font-bold">{currentTheme?.name}</span>
        <div className="flex gap-1">
          {currentTheme?.colors.slice(0, 3).map((color, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full border border-current"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              className="absolute right-0 mt-2 z-50"
            >
              <div
                className="comic-panel p-4 min-w-[250px]"
                style={{ backgroundColor: "var(--comic-white)" }}
              >
                <h3 className="font-display text-xl mb-3" style={{ color: "var(--comic-red)" }}>
                  CHOOSE STYLE!
                </h3>
                <div className="space-y-2">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id);
                        setIsOpen(false);
                      }}
                      data-active={theme === t.id}
                      className="w-full filter-btn-comic flex items-center justify-between gap-3 text-left px-3 py-2"
                    >
                      <span className="font-comic font-bold text-xs">{t.name}</span>
                      <div className="flex gap-1">
                        {t.colors.map((color, i) => (
                          <div
                            key={i}
                            className="w-3 h-3 rounded-full border border-current"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
