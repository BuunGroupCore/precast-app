import { clsx } from "clsx";
import { motion } from "framer-motion";
import { HTMLAttributes, forwardRef } from "react";

export interface ComicPanelProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "onDrag" | "onDragEnd" | "onDragStart" | "onDragOver"
  > {
  variant?: "default" | "action" | "dramatic";
  animated?: boolean;
}

export const ComicPanel = forwardRef<HTMLDivElement, ComicPanelProps>(
  (
    { className, variant = "default", animated = true, children, style, onClick, ...props },
    ref
  ) => {
    const variantClasses = {
      default: "bg-white",
      action: "bg-gradient-to-br from-action-pow to-action-bam",
      dramatic: "bg-comic-black text-white",
    };

    const panelClassName = clsx("comic-panel p-4 md:p-6", variantClasses[variant], className);

    if (!animated) {
      return (
        <div className={panelClassName} ref={ref} style={style} onClick={onClick} {...props}>
          {children}
        </div>
      );
    }

    return (
      <motion.div
        className={panelClassName}
        ref={ref}
        style={style}
        onClick={onClick}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        {children}
      </motion.div>
    );
  }
);

ComicPanel.displayName = "ComicPanel";
