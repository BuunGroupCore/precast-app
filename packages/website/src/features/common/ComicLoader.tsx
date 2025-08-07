import { motion } from "framer-motion";

interface ComicLoaderProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  color?: "red" | "blue" | "purple" | "green" | "yellow" | "orange";
}

/**
 * Minimal comic-style loading animation with repeatable bouncing dots
 */
export function ComicLoader({
  message = "LOADING...",
  size = "md",
  color = "red",
}: ComicLoaderProps) {
  const sizeConfig = {
    sm: { container: "w-16 h-12", dot: "w-2 h-2", text: "text-sm", gap: "gap-1" },
    md: { container: "w-24 h-16", dot: "w-3 h-3", text: "text-lg", gap: "gap-2" },
    lg: { container: "w-32 h-20", dot: "w-4 h-4", text: "text-xl", gap: "gap-3" },
  };

  const colorConfig = {
    red: { primary: "bg-comic-red", text: "text-comic-red" },
    blue: { primary: "bg-comic-blue", text: "text-comic-blue" },
    purple: { primary: "bg-comic-purple", text: "text-comic-purple" },
    green: { primary: "bg-comic-green", text: "text-comic-green" },
    yellow: { primary: "bg-comic-yellow", text: "text-comic-black" },
    orange: { primary: "bg-comic-orange", text: "text-comic-orange" },
  };

  const config = sizeConfig[size];
  const colors = colorConfig[color];

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Bouncing dots animation */}
      <div className={`flex items-end justify-center ${config.gap} ${config.container}`}>
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className={`${config.dot} ${colors.primary} rounded-full`}
            animate={{
              y: [0, -12, 0],
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

      {/* Optional message */}
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`font-comic font-bold ${config.text} ${colors.text} mt-3 text-center`}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}

/**
 * Full-screen loading overlay component with optional message.
 * Uses ComicLoader with backdrop blur effect.
 */
export function LoadingOverlay({ message }: { message?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <ComicLoader message={message} size="sm" />
    </motion.div>
  );
}
