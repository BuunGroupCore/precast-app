import { HTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";
import { motion } from "framer-motion";

export interface ComicPanelProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "action" | "dramatic";
  animated?: boolean;
}

export const ComicPanel = forwardRef<HTMLDivElement, ComicPanelProps>(
  (
    { className, variant = "default", animated = true, children, ...props },
    ref,
  ) => {
    const variantClasses = {
      default: "bg-white",
      action: "bg-gradient-to-br from-action-pow to-action-bam",
      dramatic: "bg-comic-black text-white",
    };

    const Component = animated ? motion.div : "div";

    return (
      <Component
        className={clsx(
          "comic-panel p-4 md:p-6",
          variantClasses[variant],
          className,
        )}
        ref={ref}
        initial={animated ? { scale: 0.9, opacity: 0 } : undefined}
        animate={animated ? { scale: 1, opacity: 1 } : undefined}
        transition={{ type: "spring", duration: 0.5 }}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

ComicPanel.displayName = "ComicPanel";
