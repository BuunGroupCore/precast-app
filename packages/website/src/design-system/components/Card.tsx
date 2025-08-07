import { motion, HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

export interface CardProps extends HTMLMotionProps<"div"> {
  variant?: "default" | "elevated" | "bordered" | "gradient";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
}

/**
 * Design system Card component.
 * A versatile container component with multiple style variants.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { variant = "default", padding = "md", rounded = "lg", children, className = "", ...props },
    ref
  ) => {
    const baseClasses = "transition-all duration-200";

    const variantClasses = {
      default: "bg-white border-2 border-black shadow-[4px_4px_0_0_#000]",
      elevated:
        "bg-white border-2 border-black shadow-[6px_6px_0_0_#000] hover:shadow-[4px_4px_0_0_#000]",
      bordered: "bg-transparent border-2 border-black",
      gradient:
        "bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-black shadow-[4px_4px_0_0_#000]",
    };

    const paddingClasses = {
      none: "",
      sm: "p-3",
      md: "p-6",
      lg: "p-8",
      xl: "p-12",
    };

    const roundedClasses = {
      none: "rounded-none",
      sm: "rounded",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      full: "rounded-full",
    };

    return (
      <motion.div
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${roundedClasses[rounded]} ${className}`}
        whileHover={{ y: variant === "elevated" ? -2 : 0 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = "Card";
