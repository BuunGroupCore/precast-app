import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  color?: "red" | "blue" | "purple" | "green" | "yellow" | "orange";
  variant?: "default" | "comic" | "striped" | "pulse";
  showPercentage?: boolean;
  label?: string;
  className?: string;
  animated?: boolean;
}

/**
 * Comic-style progress bar with multiple variants and smooth animations.
 * Supports accessibility features and customizable appearance.
 */
export function ProgressBar({
  value,
  max = 100,
  size = "md",
  color = "blue",
  variant = "default",
  showPercentage = false,
  label,
  className = "",
  animated = true,
}: ProgressBarProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const percentage = Math.min((value / max) * 100, 100);

  // Animate the progress value
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayValue(percentage);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayValue(percentage);
    }
  }, [percentage, animated]);

  const sizeConfig = {
    sm: { height: "h-2", text: "text-xs" },
    md: { height: "h-4", text: "text-sm" },
    lg: { height: "h-6", text: "text-base" },
  };

  const colorConfig = {
    red: {
      bg: "bg-comic-red/20",
      fill: "bg-comic-red",
      text: "text-comic-red",
      border: "border-comic-red",
    },
    blue: {
      bg: "bg-comic-blue/20",
      fill: "bg-comic-blue",
      text: "text-comic-blue",
      border: "border-comic-blue",
    },
    purple: {
      bg: "bg-comic-purple/20",
      fill: "bg-comic-purple",
      text: "text-comic-purple",
      border: "border-comic-purple",
    },
    green: {
      bg: "bg-comic-green/20",
      fill: "bg-comic-green",
      text: "text-comic-green",
      border: "border-comic-green",
    },
    yellow: {
      bg: "bg-comic-yellow/20",
      fill: "bg-comic-yellow",
      text: "text-comic-black",
      border: "border-comic-yellow",
    },
    orange: {
      bg: "bg-comic-orange/20",
      fill: "bg-comic-orange",
      text: "text-comic-orange",
      border: "border-comic-orange",
    },
  };

  const config = sizeConfig[size];
  const colors = colorConfig[color];

  const getVariantClasses = () => {
    switch (variant) {
      case "comic":
        return "border-2 border-comic-black rounded-sm";
      case "striped":
        return "border border-comic-black/30 rounded-sm overflow-hidden";
      case "pulse":
        return "border border-comic-black/30 rounded-full";
      default:
        return "border border-comic-black/30 rounded-full";
    }
  };

  const getStripedBackground = () => {
    if (variant === "striped") {
      return {
        backgroundImage: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 6px,
          rgba(255,255,255,0.2) 6px,
          rgba(255,255,255,0.2) 12px
        )`,
      };
    }
    return {};
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Label and percentage */}
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className={`font-comic font-medium ${config.text} ${colors.text}`}>{label}</span>
          )}
          {showPercentage && (
            <span className={`font-comic font-bold ${config.text} ${colors.text}`}>
              {Math.round(displayValue)}%
            </span>
          )}
        </div>
      )}

      {/* Progress bar container */}
      <div
        className={`
          relative w-full ${config.height} ${colors.bg} ${getVariantClasses()}
          overflow-hidden
        `}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || `Progress: ${Math.round(percentage)}%`}
      >
        {/* Progress fill */}
        <motion.div
          className={`
            absolute top-0 left-0 h-full ${colors.fill}
            ${variant === "pulse" ? "animate-pulse" : ""}
          `}
          style={{
            width: `${displayValue}%`,
            ...getStripedBackground(),
          }}
          initial={{ width: animated ? "0%" : `${displayValue}%` }}
          animate={{ width: `${displayValue}%` }}
          transition={{
            duration: animated ? 0.8 : 0,
            ease: "easeOut",
            delay: animated ? 0.1 : 0,
          }}
        />

        {/* Comic book style highlight */}
        {variant === "comic" && <div className="absolute top-0 left-0 w-full h-1 bg-white/40" />}

        {/* Animated shine effect for striped variant */}
        {variant === "striped" && (
          <motion.div
            className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              left: ["0%", "100%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        )}
      </div>

      {/* Screen reader text */}
      <span className="sr-only">
        {label ? `${label}: ` : ""}Progress {Math.round(percentage)}% complete
      </span>
    </div>
  );
}

/**
 * Indeterminate progress bar for unknown progress
 */
export function IndeterminateProgressBar({
  size = "md",
  color = "blue",
  className = "",
  label = "Loading...",
}: Omit<ProgressBarProps, "value" | "max" | "showPercentage" | "animated">) {
  const sizeConfig = {
    sm: { height: "h-2" },
    md: { height: "h-4" },
    lg: { height: "h-6" },
  };

  const colorConfig = {
    red: { bg: "bg-comic-red/20", fill: "bg-comic-red" },
    blue: { bg: "bg-comic-blue/20", fill: "bg-comic-blue" },
    purple: { bg: "bg-comic-purple/20", fill: "bg-comic-purple" },
    green: { bg: "bg-comic-green/20", fill: "bg-comic-green" },
    yellow: { bg: "bg-comic-yellow/20", fill: "bg-comic-yellow" },
    orange: { bg: "bg-comic-orange/20", fill: "bg-comic-orange" },
  };

  const config = sizeConfig[size];
  const colors = colorConfig[color];

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="mb-2">
          <span className="font-comic font-medium text-comic-black">{label}</span>
        </div>
      )}

      <div
        className={`
          relative w-full ${config.height} ${colors.bg}
          border border-comic-black/30 rounded-full overflow-hidden
        `}
        role="progressbar"
        aria-label={label}
      >
        <motion.div
          className={`absolute top-0 h-full w-1/3 ${colors.fill}`}
          animate={{
            left: ["-33%", "100%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
}
