import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface ComicTooltipProps {
  children: React.ReactNode;
  content: string | React.ReactNode;
  delay?: number;
  disabled?: boolean;
  className?: string;
}

/**
 * Comic-style tooltip component with automatic positioning and mobile support.
 * Renders in a portal to avoid z-index issues and automatically adjusts position to stay in viewport.
 */
export const ComicTooltip: React.FC<ComicTooltipProps> = ({
  children,
  content,
  delay = 300,
  disabled = false,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [placement, setPlacement] = useState<"top" | "bottom" | "left" | "right">("top");
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const padding = 12;

      // Calculate available space in each direction
      const spaceTop = triggerRect.top;
      const spaceBottom = window.innerHeight - triggerRect.bottom;
      const spaceLeft = triggerRect.left;
      const spaceRight = window.innerWidth - triggerRect.right;

      let newPlacement: "top" | "bottom" | "left" | "right" = "top";
      let x = 0;
      let y = 0;

      // On mobile, prefer bottom placement if there's room, otherwise top
      if (isMobile) {
        if (spaceBottom > tooltipRect.height + padding) {
          newPlacement = "bottom";
          x = Math.min(
            Math.max(padding, triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2),
            window.innerWidth - tooltipRect.width - padding
          );
          y = triggerRect.bottom + padding;
        } else if (spaceTop > tooltipRect.height + padding) {
          newPlacement = "top";
          x = Math.min(
            Math.max(padding, triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2),
            window.innerWidth - tooltipRect.width - padding
          );
          y = triggerRect.top - tooltipRect.height - padding;
        } else {
          // If no space above or below, show at center of screen
          newPlacement = "top";
          x = Math.min(
            Math.max(padding, (window.innerWidth - tooltipRect.width) / 2),
            window.innerWidth - tooltipRect.width - padding
          );
          y = window.innerHeight / 2 - tooltipRect.height / 2;
        }
      } else {
        // Desktop: Try each direction in order of preference
        if (spaceTop > tooltipRect.height + padding && placement === "top") {
          newPlacement = "top";
          x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          y = triggerRect.top - tooltipRect.height - padding;
        } else if (spaceBottom > tooltipRect.height + padding) {
          newPlacement = "bottom";
          x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          y = triggerRect.bottom + padding;
        } else if (spaceLeft > tooltipRect.width + padding) {
          newPlacement = "left";
          x = triggerRect.left - tooltipRect.width - padding;
          y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        } else if (spaceRight > tooltipRect.width + padding) {
          newPlacement = "right";
          x = triggerRect.right + padding;
          y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        } else {
          // Fallback to top
          newPlacement = "top";
          x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          y = Math.max(padding, triggerRect.top - tooltipRect.height - padding);
        }

        // Ensure tooltip stays within viewport horizontally
        x = Math.min(Math.max(padding, x), window.innerWidth - tooltipRect.width - padding);
        // Ensure tooltip stays within viewport vertically
        y = Math.min(Math.max(padding, y), window.innerHeight - tooltipRect.height - padding);
      }

      setPlacement(newPlacement);
      setPosition({ x, y });
    }
  }, [isVisible, isMobile, placement]);

  const handleMouseEnter = () => {
    if (disabled || isMobile) return;
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

  const handleTouch = () => {
    if (disabled) return;
    setIsVisible(!isVisible);
  };

  const getArrowStyles = () => {
    const baseArrow = "absolute w-0 h-0";
    switch (placement) {
      case "top":
        return `${baseArrow} -bottom-2 left-1/2 -translate-x-1/2 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent border-t-comic-black`;
      case "bottom":
        return `${baseArrow} -top-2 left-1/2 -translate-x-1/2 border-l-[10px] border-r-[10px] border-b-[10px] border-l-transparent border-r-transparent border-b-comic-black`;
      case "left":
        return `${baseArrow} -right-2 top-1/2 -translate-y-1/2 border-t-[10px] border-b-[10px] border-l-[10px] border-t-transparent border-b-transparent border-l-comic-black`;
      case "right":
        return `${baseArrow} -left-2 top-1/2 -translate-y-1/2 border-t-[10px] border-b-[10px] border-r-[10px] border-t-transparent border-b-transparent border-r-comic-black`;
      default:
        return "";
    }
  };

  const tooltipContent = (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={tooltipRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className={`
            fixed pointer-events-none select-none
            comic-panel px-3 py-2 
            bg-comic-white text-comic-black
            border-3 border-comic-black
            font-comic text-xs
            max-w-[280px] sm:max-w-xs
            whitespace-normal
            ${className}
          `}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            zIndex: 9999,
            boxShadow: "3px 3px 0 var(--comic-black)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {content}
          <div className={getArrowStyles()} />
          {/* Inner arrow for better visibility */}
          <div
            className={getArrowStyles()
              .replace("border-t-comic-black", "border-t-comic-white")
              .replace("border-b-comic-black", "border-b-comic-white")
              .replace("border-l-comic-black", "border-l-comic-white")
              .replace("border-r-comic-black", "border-r-comic-white")
              .replace("-bottom-2", "-bottom-[7px]")
              .replace("-top-2", "-top-[7px]")
              .replace("-left-2", "-left-[7px]")
              .replace("-right-2", "-right-[7px]")
              .replace("border-l-[10px]", "border-l-[8px]")
              .replace("border-r-[10px]", "border-r-[8px]")
              .replace("border-t-[10px]", "border-t-[8px]")
              .replace("border-b-[10px]", "border-b-[8px]")}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div
        ref={triggerRef}
        className="inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouch}
        onClick={(e) => {
          if (isMobile && isVisible) {
            e.stopPropagation();
            setIsVisible(false);
          }
        }}
      >
        {children}
      </div>
      {typeof document !== "undefined" && createPortal(tooltipContent, document.body)}
    </>
  );
};
