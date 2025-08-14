import { motion, AnimatePresence } from "framer-motion";
import { LoadingSpinner } from "./LoadingSpinner";
import { useEffect } from "react";

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  variant?: "dots" | "spinner" | "pulse" | "bounce";
  color?: "red" | "blue" | "purple" | "green" | "yellow" | "orange";
  backdrop?: "blur" | "dark" | "light" | "none";
  preventScroll?: boolean;
  className?: string;
  onClose?: () => void;
}

/**
 * Full-screen loading overlay with customizable backdrop and comic-style animation.
 * Manages body scroll and provides escape key handling.
 */
export function LoadingOverlay({
  isVisible,
  message = "Loading...",
  variant = "dots",
  color = "red",
  backdrop = "blur",
  preventScroll = true,
  className = "",
  onClose,
}: LoadingOverlayProps) {
  // Prevent body scroll when overlay is visible
  useEffect(() => {
    if (preventScroll && isVisible) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isVisible, preventScroll]);

  // Handle escape key
  useEffect(() => {
    if (isVisible && onClose) {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          onClose();
        }
      };

      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isVisible, onClose]);

  const backdropConfig = {
    blur: "bg-black/50 backdrop-blur-sm",
    dark: "bg-black/70",
    light: "bg-white/70",
    none: "bg-transparent",
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`
            fixed inset-0 z-50 flex items-center justify-center
            ${backdropConfig[backdrop]}
            ${className}
          `}
          role="dialog"
          aria-modal="true"
          aria-label="Loading"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="
              comic-panel bg-comic-white border-3 border-comic-black
              p-8 rounded-lg shadow-lg max-w-sm mx-4
            "
            onClick={(e) => e.stopPropagation()}
          >
            <LoadingSpinner
              size="lg"
              variant={variant}
              color={color}
              message={message}
              aria-label={message}
            />

            {onClose && (
              <p className="text-xs text-comic-black/60 mt-4 text-center font-comic">
                Press ESC or click outside to close
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Simple backdrop loading overlay without the panel
 */
export function SimpleLoadingOverlay({
  isVisible,
  message,
  variant = "spinner",
  color = "blue",
}: Pick<LoadingOverlayProps, "isVisible" | "message" | "variant" | "color">) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          role="status"
          aria-live="polite"
        >
          <LoadingSpinner size="lg" variant={variant} color={color} message={message} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
