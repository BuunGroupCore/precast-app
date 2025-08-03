import React from "react";
import { motion } from "framer-motion";
import { FaBolt, FaRocket, FaCog } from "react-icons/fa";

interface ComicLoaderProps {
  message?: string;
  variant?: "default" | "small" | "inline";
}

export function ComicLoader({
  message = "Loading awesome stuff...",
  variant = "default",
}: ComicLoaderProps) {
  const isSmall = variant === "small";
  const isInline = variant === "inline";

  if (isInline) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="inline-flex items-center gap-2"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <FaCog className="text-comic-blue text-sm" />
        </motion.div>
        <span className="text-sm font-medium">{message}</span>
      </motion.div>
    );
  }

  return (
    <div
      className={`${isSmall ? "p-4" : "min-h-screen"} flex items-center justify-center bg-gradient-to-br from-comic-yellow via-comic-orange to-comic-red`}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15,
        }}
        className={`comic-panel ${isSmall ? "p-6" : "p-12"} text-center relative overflow-hidden`}
      >
        {/* Animated background rays */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-10"
        >
          <div className="absolute inset-0">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 w-1 bg-gradient-to-t from-transparent to-black opacity-20"
                style={{
                  height: "200px",
                  transformOrigin: "0 0",
                  transform: `rotate(${i * 45}deg)`,
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Main loading animation */}
        <div className="relative z-10">
          {/* Comic burst effect */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatDelay: 1,
            }}
            className={`mx-auto mb-6 ${isSmall ? "w-16 h-16" : "w-24 h-24"} relative`}
          >
            {/* Spinning bolt */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <FaBolt
                className={`${isSmall ? "text-4xl" : "text-6xl"} text-comic-yellow drop-shadow-lg`}
              />
            </motion.div>

            {/* Orbiting elements */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ rotate: -360 }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.2,
                }}
                className="absolute inset-0"
              >
                <div
                  className={`absolute ${isSmall ? "w-2 h-2" : "w-3 h-3"} bg-comic-blue rounded-full`}
                  style={{
                    top: `${20 + i * 10}%`,
                    left: "50%",
                    transformOrigin: `0 ${isSmall ? "32px" : "48px"}`,
                  }}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Loading text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-4"
          >
            <h2
              className={`font-display font-bold text-comic-darkBlue ${isSmall ? "text-lg" : "text-2xl"} mb-2`}
            >
              {message.toUpperCase()}
            </h2>

            {/* Animated dots */}
            <div className="flex justify-center gap-1">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className={`${isSmall ? "w-2 h-2" : "w-3 h-3"} bg-comic-red rounded-full`}
                />
              ))}
            </div>
          </motion.div>

          {/* Comic action words */}
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 2, -2, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0,
              }}
              className={`absolute ${isSmall ? "-top-4 -left-8" : "-top-6 -left-12"} font-black text-comic-red ${isSmall ? "text-sm" : "text-lg"} transform -rotate-12`}
            >
              POW!
            </motion.div>

            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, -2, 2, 0],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                delay: 0.6,
              }}
              className={`absolute ${isSmall ? "-top-2 -right-8" : "-top-4 -right-12"} font-black text-comic-blue ${isSmall ? "text-xs" : "text-base"} transform rotate-12`}
            >
              ZAP!
            </motion.div>

            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                y: [0, -5, 0],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                delay: 1.2,
              }}
              className={`absolute ${isSmall ? "-bottom-2 left-2" : "-bottom-4 left-4"} font-black text-comic-orange ${isSmall ? "text-xs" : "text-sm"} transform -rotate-6`}
            >
              BOOM!
            </motion.div>
          </div>
        </div>

        {/* Progress bar (optional) */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`mt-6 ${isSmall ? "h-1" : "h-2"} bg-gradient-to-r from-comic-blue to-comic-purple rounded-full overflow-hidden`}
        >
          <motion.div
            animate={{ x: ["-100%", "100%"] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
            className="h-full w-1/3 bg-gradient-to-r from-transparent via-white to-transparent"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

// Loading overlay component
export function LoadingOverlay({ message }: { message?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <ComicLoader message={message} variant="small" />
    </motion.div>
  );
}
