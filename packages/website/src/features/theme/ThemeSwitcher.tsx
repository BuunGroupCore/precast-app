import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { FaPalette } from "react-icons/fa";

import { useTheme, ComicTheme } from "@/contexts/ThemeContext";

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

/**
 * Theme switcher component allowing users to select from various comic book-inspired themes.
 * Displays a dropdown with theme previews using color swatches.
 */
export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentTheme = themes.find((t) => t.id === theme);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen && !isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, isMobile]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="filter-btn-comic flex items-center justify-center gap-1 sm:gap-2 p-2 sm:px-3 sm:py-2"
      >
        <FaPalette className="text-base sm:text-lg" />
        <span className="hidden sm:inline font-comic font-bold">{currentTheme?.name}</span>
        <div className="hidden sm:flex gap-1">
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
            {/* Mobile: Full screen modal */}
            {isMobile ? (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsOpen(false)}
                  className="fixed inset-0 bg-black/50 z-[9998]"
                />
                <motion.div
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 100 }}
                  className="fixed bottom-0 left-0 right-0 z-[9999]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="comic-panel rounded-t-2xl p-6 bg-white">
                    <div className="w-12 h-1 bg-comic-black rounded-full mx-auto mb-4" />
                    <h3 className="font-display text-2xl mb-4 text-center text-comic-red">
                      CHOOSE STYLE!
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {themes.map((t) => (
                        <button
                          key={t.id}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Mobile theme clicked: t.id
                            setTheme(t.id);
                            setIsOpen(false);
                          }}
                          data-active={theme === t.id}
                          className="filter-btn-comic flex flex-col items-center gap-2 p-3 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                        >
                          <div className="flex gap-1">
                            {t.colors.map((color, i) => (
                              <div
                                key={i}
                                className="w-4 h-4 rounded-full border-2 border-current"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <span className="font-comic font-bold text-xs">{t.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </>
            ) : (
              /* Desktop: Dropdown */
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
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
