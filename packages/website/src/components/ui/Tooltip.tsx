import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({ children, content, delay = 500 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch device
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleMouseEnter = () => {
    // Don't show tooltip on touch devices via hover
    if (isTouchDevice) return;

    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  const handleTouchStart = () => {
    // Show tooltip briefly on touch
    setIsVisible(true);
    setTimeout(() => setIsVisible(false), 2000);
  };

  return (
    <div
      className="relative w-full h-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 px-3 py-2 text-xs font-comic bg-comic-darkBlue text-comic-white rounded-lg shadow-lg border-2 border-comic-black whitespace-normal max-w-xs pointer-events-none"
            style={{
              bottom: "calc(100% + 8px)",
              left: "50%",
              transform: "translateX(-50%)",
              boxShadow: "2px 2px 0 var(--comic-black)",
            }}
          >
            {content}
            {/* Arrow */}
            <div
              className="absolute w-0 h-0"
              style={{
                bottom: "-8px",
                left: "50%",
                transform: "translateX(-50%)",
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderTop: "8px solid var(--comic-darkBlue)",
              }}
            />
            <div
              className="absolute w-0 h-0"
              style={{
                bottom: "-10px",
                left: "50%",
                transform: "translateX(-50%)",
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderTop: "8px solid var(--comic-black)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
