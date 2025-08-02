import { HTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";
import { motion } from "framer-motion";

export interface SpeechBubbleProps extends HTMLAttributes<HTMLDivElement> {
  type?: "speech" | "thought" | "shout";
  position?: "left" | "right" | "center";
  animated?: boolean;
}

export const SpeechBubble = forwardRef<HTMLDivElement, SpeechBubbleProps>(
  (
    {
      className,
      type = "speech",
      position = "left",
      animated = true,
      children,
      ...props
    },
    ref,
  ) => {
    const typeClasses = {
      speech: "speech-bubble",
      thought: "thought-bubble",
      shout: "speech-bubble bg-comic-yellow font-bold text-xl",
    };

    const Component = animated ? motion.div : "div";

    return (
      <Component
        className={clsx(
          typeClasses[type],
          "font-speech",
          position === "right" && "ml-auto",
          position === "center" && "mx-auto",
          className,
        )}
        ref={ref}
        initial={animated ? { scale: 0, y: 20 } : undefined}
        animate={animated ? { scale: 1, y: 0 } : undefined}
        transition={{ type: "spring", bounce: 0.5 }}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

SpeechBubble.displayName = "SpeechBubble";
