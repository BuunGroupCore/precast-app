import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "red" | "blue" | "purple" | "green" | "yellow" | "orange";
  variant?: "dots" | "spinner" | "pulse" | "bounce";
  message?: string;
  className?: string;
  "aria-label"?: string;
}

/**
 * Comic-style loading spinner with multiple variants and accessibility support.
 * Respects prefers-reduced-motion and provides proper ARIA attributes.
 */
export function LoadingSpinner({
  size = "md",
  color = "red",
  variant = "dots",
  message,
  className = "",
  "aria-label": ariaLabel = "Loading",
}: LoadingSpinnerProps) {
  const sizeConfig = {
    xs: { container: "w-8 h-6", dot: "w-1 h-1", text: "text-xs", gap: "gap-0.5" },
    sm: { container: "w-12 h-8", dot: "w-1.5 h-1.5", text: "text-sm", gap: "gap-1" },
    md: { container: "w-16 h-12", dot: "w-2 h-2", text: "text-base", gap: "gap-1.5" },
    lg: { container: "w-24 h-16", dot: "w-3 h-3", text: "text-lg", gap: "gap-2" },
    xl: { container: "w-32 h-20", dot: "w-4 h-4", text: "text-xl", gap: "gap-3" },
  };

  const colorConfig = {
    red: { primary: "bg-comic-red", text: "text-comic-red", border: "border-comic-red" },
    blue: { primary: "bg-comic-blue", text: "text-comic-blue", border: "border-comic-blue" },
    purple: {
      primary: "bg-comic-purple",
      text: "text-comic-purple",
      border: "border-comic-purple",
    },
    green: { primary: "bg-comic-green", text: "text-comic-green", border: "border-comic-green" },
    yellow: { primary: "bg-comic-yellow", text: "text-comic-black", border: "border-comic-yellow" },
    orange: {
      primary: "bg-comic-orange",
      text: "text-comic-orange",
      border: "border-comic-orange",
    },
  };

  const config = sizeConfig[size];
  const colors = colorConfig[color];

  const renderDots = () => (
    <div className={`flex items-end justify-center ${config.gap} ${config.container}`}>
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className={`${config.dot} ${colors.primary} rounded-full`}
          animate={{
            y: [0, -8, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );

  const renderSpinner = () => (
    <div className={config.container}>
      <motion.div
        className={`w-full h-full border-2 ${colors.border} border-t-transparent rounded-full`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );

  const renderPulse = () => (
    <div className={config.container}>
      <motion.div
        className={`w-full h-full ${colors.primary} rounded-full`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );

  const renderBounce = () => (
    <div className={`flex items-center justify-center ${config.gap} ${config.container}`}>
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className={`${config.dot} ${colors.primary} rounded-sm`}
          animate={{
            y: [0, -10, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );

  const renderVariant = () => {
    switch (variant) {
      case "dots":
        return renderDots();
      case "spinner":
        return renderSpinner();
      case "pulse":
        return renderPulse();
      case "bounce":
        return renderBounce();
      default:
        return renderDots();
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center ${className}`}
      role="status"
      aria-label={ariaLabel}
      aria-live="polite"
    >
      {renderVariant()}

      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`font-comic font-bold ${config.text} ${colors.text} mt-2 text-center`}
        >
          {message}
        </motion.p>
      )}

      {/* Screen reader text */}
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
}

/**
 * Inline loading spinner for use within text or small spaces
 */
export function InlineSpinner({
  color = "red",
  className = "",
  "aria-label": ariaLabel = "Loading",
}: Pick<LoadingSpinnerProps, "color" | "className" | "aria-label">) {
  const colors = {
    red: "border-comic-red",
    blue: "border-comic-blue",
    purple: "border-comic-purple",
    green: "border-comic-green",
    yellow: "border-comic-yellow",
    orange: "border-comic-orange",
  };

  return (
    <motion.div
      className={`inline-block w-4 h-4 border-2 ${colors[color]} border-t-transparent rounded-full ${className}`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
      role="status"
      aria-label={ariaLabel}
    >
      <span className="sr-only">{ariaLabel}</span>
    </motion.div>
  );
}
