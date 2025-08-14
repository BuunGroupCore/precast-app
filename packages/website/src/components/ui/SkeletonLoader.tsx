import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "rounded";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

/**
 * Comic-style skeleton loader component with configurable shapes and animations.
 * Respects prefers-reduced-motion accessibility setting.
 */
export function Skeleton({
  className = "",
  variant = "text",
  width,
  height,
  animation = "pulse",
}: SkeletonProps) {
  const baseClasses = "bg-comic-black/10 border border-comic-black/20";

  const variantClasses = {
    text: "rounded-sm h-4",
    circular: "rounded-full",
    rectangular: "rounded-none",
    rounded: "rounded-lg",
  };

  const getAnimationVariant = () => {
    if (animation === "none") return {};

    if (animation === "wave") {
      return {
        backgroundPosition: ["-200px 0", "calc(200px + 100%) 0", "-200px 0"],
      };
    }

    // Default pulse animation
    return {
      opacity: [0.3, 0.7, 0.3],
    };
  };

  const animationConfig = {
    pulse: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
    wave: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  const style: React.CSSProperties = {
    width: width,
    height: height,
    ...(animation === "wave" && {
      background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)`,
      backgroundSize: "200px 100%",
      backgroundRepeat: "no-repeat",
    }),
  };

  return (
    <motion.div
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${className}
      `}
      style={style}
      animate={getAnimationVariant()}
      transition={animation !== "none" ? animationConfig[animation] : undefined}
      aria-hidden="true"
    />
  );
}
