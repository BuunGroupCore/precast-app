import { motion, HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

export interface CardProps extends HTMLMotionProps<"div"> {
  variant?: "default" | "outlined" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

/**
 * Design system Card component.
 * A versatile container component with multiple style variants.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { variant = "default", padding = "md", hover = false, children, className = "", ...props },
    ref
  ) => {
    const baseClasses = "transition-all duration-200 rounded-lg";

    const variantClasses = {
      default: "bg-white border-2 border-black shadow-[4px_4px_0_0_#000]",
      outlined: "bg-white border-2 border-black",
      elevated: "bg-white border-2 border-black shadow-[6px_6px_0_0_#000]",
    };

    const paddingClasses = {
      none: "",
      sm: "p-3",
      md: "p-6",
      lg: "p-8",
    };

    const hoverProps = hover
      ? {
          whileHover: {
            scale: 1.02,
            y: -2,
            transition: { type: "spring", stiffness: 300, damping: 20 },
          },
          whileTap: { scale: 0.98 },
        }
      : {};

    return (
      <motion.div
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}
        {...hoverProps}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = "Card";
