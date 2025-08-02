import { HTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import { motion } from "framer-motion";

const cardVariants = cva(
  "bg-white rounded-3xl p-6 transition-all duration-300",
  {
    variants: {
      elevation: {
        low: "shadow-md hover:shadow-lg",
        medium: "shadow-cartoon hover:shadow-cartoon-hover",
        high: "shadow-xl hover:shadow-2xl",
      },
      animated: {
        true: "hover:-translate-y-1",
        false: "",
      },
    },
    defaultVariants: {
      elevation: "medium",
      animated: true,
    },
  },
);

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, elevation, animated, children, ...props }, ref) => {
    const Component = animated ? motion.div : "div";

    return (
      <Component
        className={clsx(cardVariants({ elevation, animated, className }))}
        ref={ref}
        whileHover={animated ? { y: -4 } : undefined}
        transition={{ type: "spring", stiffness: 300 }}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

Card.displayName = "Card";
