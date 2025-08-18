import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";

interface ComicLoadingAnimationProps {
  variant?: "explosion" | "superhero" | "comic-burst" | "pow-bam" | "lightning" | "speech-bubble";
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  "aria-label"?: string;
}

/**
 * Awesome comic-style loading animations with dynamic effects
 */
export function ComicLoadingAnimation({
  variant = "explosion",
  message,
  size = "md",
  className = "",
  "aria-label": ariaLabel = "Loading",
}: ComicLoadingAnimationProps) {
  const [currentWord, setCurrentWord] = useState(0);
  const comicWords = useMemo(
    () => ["POW!", "BAM!", "ZAP!", "BOOM!", "WHAM!", "CRASH!", "BANG!", "KAPOW!"],
    []
  );

  useEffect(() => {
    if (variant === "pow-bam") {
      const interval = setInterval(() => {
        setCurrentWord((prev) => (prev + 1) % comicWords.length);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [variant, comicWords.length]);

  const sizeConfig = {
    sm: { container: "w-24 h-24", text: "text-2xl", icon: "text-4xl" },
    md: { container: "w-32 h-32", text: "text-3xl", icon: "text-6xl" },
    lg: { container: "w-48 h-48", text: "text-5xl", icon: "text-8xl" },
  };

  const config = sizeConfig[size];

  // Explosion Animation - Multiple particles exploding outward
  const renderExplosion = () => (
    <div className={`relative ${config.container} flex items-center justify-center`}>
      {/* Central explosion */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          scale: [0, 1.5, 0],
          opacity: [1, 0.5, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeOut",
        }}
      >
        <div className="w-full h-full bg-gradient-radial from-comic-yellow via-comic-orange to-comic-red rounded-full blur-xl" />
      </motion.div>

      {/* Explosion particles */}
      {[...Array(8)].map((_, i) => {
        const angle = (i * 45 * Math.PI) / 180;
        const x = Math.cos(angle) * 100;
        const y = Math.sin(angle) * 100;

        return (
          <motion.div
            key={i}
            className="absolute w-3 h-3"
            style={{
              left: "50%",
              top: "50%",
              marginLeft: "-6px",
              marginTop: "-6px",
            }}
            animate={{
              x: [0, x * 0.3, x * 0.6, x],
              y: [0, y * 0.3, y * 0.6, y],
              scale: [0, 1.5, 1, 0],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeOut",
            }}
          >
            <div
              className={`w-full h-full rounded-full ${
                i % 3 === 0 ? "bg-comic-red" : i % 3 === 1 ? "bg-comic-yellow" : "bg-comic-orange"
              }`}
            />
          </motion.div>
        );
      })}

      {/* BOOM text */}
      <motion.div
        className={`absolute ${config.text} font-display font-bold text-comic-red`}
        style={{ textShadow: "3px 3px 0px #FFD600, 6px 6px 0px #FF6D00" }}
        animate={{
          scale: [0, 1.2, 1],
          rotate: [-15, 15, -15],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        BOOM!
      </motion.div>
    </div>
  );

  // Superhero Animation - Shield with spinning effect
  const renderSuperhero = () => (
    <div className={`relative ${config.container} flex items-center justify-center`}>
      {/* Background burst */}
      <motion.div
        className="absolute inset-0"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 bg-gradient-to-t from-comic-yellow to-transparent"
            style={{
              height: "40%",
              left: "50%",
              top: "50%",
              transformOrigin: "bottom",
              transform: `translateX(-50%) rotate(${i * 30}deg)`,
            }}
          />
        ))}
      </motion.div>

      {/* Shield */}
      <motion.div
        className={`relative ${config.icon} flex items-center justify-center`}
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <motion.path
            d="M50 10 L80 30 L80 60 L50 90 L20 60 L20 30 Z"
            fill="url(#shieldGradient)"
            stroke="#000"
            strokeWidth="3"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <defs>
            <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2962FF" />
              <stop offset="50%" stopColor="#FF1744" />
              <stop offset="100%" stopColor="#FFD600" />
            </linearGradient>
          </defs>
          <motion.text
            x="50"
            y="55"
            textAnchor="middle"
            className="font-display text-2xl fill-white font-bold"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            S
          </motion.text>
        </svg>
      </motion.div>
    </div>
  );

  // Comic Burst Animation
  const renderComicBurst = () => (
    <div className={`relative ${config.container} flex items-center justify-center`}>
      {/* Starburst background */}
      <motion.svg
        viewBox="0 0 200 200"
        className="absolute w-full h-full"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <motion.polygon
          points="100,10 120,80 190,100 120,120 100,190 80,120 10,100 80,80"
          fill="#FFD600"
          stroke="#000"
          strokeWidth="3"
          animate={{
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.svg>

      {/* Animated dots */}
      <div className="relative z-10">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-comic-red rounded-full"
            style={{
              left: `${i * 20 - 20}px`,
              top: "50%",
              transform: "translateY(-50%)",
            }}
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.5, 1],
              backgroundColor: ["#FF1744", "#2962FF", "#00E676", "#FF1744"],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );

  // POW BAM Animation - Alternating comic words
  const renderPowBam = () => (
    <div className={`relative ${config.container} flex items-center justify-center`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentWord}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ duration: 0.3, ease: "backOut" }}
          className="relative"
        >
          {/* Background burst */}
          <motion.div
            className="absolute inset-0 -z-10"
            animate={{
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <polygon
                points="100,20 130,60 180,70 140,100 150,150 100,120 50,150 60,100 20,70 70,60"
                fill={currentWord % 2 === 0 ? "#FFD600" : "#FF1744"}
                stroke="#000"
                strokeWidth="4"
              />
            </svg>
          </motion.div>

          {/* Comic word */}
          <div
            className={`${config.text} font-display font-bold relative z-10`}
            style={{
              color: currentWord % 2 === 0 ? "#FF1744" : "#2962FF",
              textShadow: "3px 3px 0px #000, 5px 5px 0px rgba(0,0,0,0.2)",
              transform: `rotate(${currentWord % 2 === 0 ? -5 : 5}deg)`,
            }}
          >
            {comicWords[currentWord]}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );

  // Lightning Animation
  const renderLightning = () => (
    <div
      className={`relative ${config.container} flex items-center justify-center overflow-hidden`}
    >
      {/* Lightning bolts */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${30 + i * 20}%`,
            top: 0,
          }}
          animate={{
            y: ["0%", "100%"],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeIn",
          }}
        >
          <svg width="20" height="100" viewBox="0 0 20 100">
            <path
              d="M10 0 L5 30 L12 30 L8 60 L15 60 L0 100 L10 60 L3 60 L7 30 L0 30 L10 0"
              fill="#FFD600"
              stroke="#000"
              strokeWidth="1"
            />
          </svg>
        </motion.div>
      ))}

      {/* Thunder cloud */}
      <motion.div
        className="absolute top-0 w-full"
        animate={{
          x: [-10, 10, -10],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg viewBox="0 0 200 80" className="w-full">
          <ellipse cx="60" cy="40" rx="30" ry="20" fill="#424242" />
          <ellipse cx="100" cy="35" rx="40" ry="25" fill="#616161" />
          <ellipse cx="140" cy="40" rx="30" ry="20" fill="#424242" />
        </svg>
      </motion.div>

      {/* Flash effect */}
      <motion.div
        className="absolute inset-0 bg-white"
        animate={{
          opacity: [0, 0, 0.8, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          times: [0, 0.6, 0.65, 1],
          ease: "easeOut",
        }}
      />
    </div>
  );

  // Speech Bubble Animation
  const renderSpeechBubble = () => (
    <div className={`relative ${config.container} flex items-center justify-center`}>
      <motion.div
        className="relative"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Speech bubble */}
        <svg viewBox="0 0 200 150" className="w-full h-full">
          <motion.path
            d="M20 20 Q20 10 30 10 L170 10 Q180 10 180 20 L180 100 Q180 110 170 110 L50 110 L30 130 L35 110 L30 110 Q20 110 20 100 Z"
            fill="#FFF"
            stroke="#000"
            strokeWidth="3"
            animate={{
              strokeDasharray: [0, 400],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </svg>

        {/* Loading dots */}
        <div className="absolute inset-0 flex items-center justify-center gap-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-comic-black rounded-full"
              animate={{
                y: [0, -10, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderVariant = () => {
    switch (variant) {
      case "explosion":
        return renderExplosion();
      case "superhero":
        return renderSuperhero();
      case "comic-burst":
        return renderComicBurst();
      case "pow-bam":
        return renderPowBam();
      case "lightning":
        return renderLightning();
      case "speech-bubble":
        return renderSpeechBubble();
      default:
        return renderExplosion();
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`font-comic font-bold text-comic-black mt-4 text-center ${
            size === "sm" ? "text-sm" : size === "md" ? "text-base" : "text-lg"
          }`}
          style={{
            textShadow: "1px 1px 0px rgba(0,0,0,0.1)",
          }}
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
 * Full-page comic loading screen with random animations
 */
export function ComicLoadingScreen({
  message = "Loading awesome content...",
}: {
  message?: string;
}) {
  const variants: ComicLoadingAnimationProps["variant"][] = useMemo(
    () => ["explosion", "superhero", "comic-burst", "pow-bam", "lightning", "speech-bubble"],
    []
  );

  const [currentVariant, setCurrentVariant] =
    useState<ComicLoadingAnimationProps["variant"]>("explosion");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVariant(variants[Math.floor(Math.random() * variants.length)]);
    }, 3000);
    return () => clearInterval(interval);
  }, [variants]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-comic-yellow/20 via-comic-white to-comic-blue/20 z-50 flex items-center justify-center"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      <div className="comic-panel bg-comic-white p-12 rounded-2xl shadow-2xl border-4 border-comic-black">
        <ComicLoadingAnimation variant={currentVariant} size="lg" message={message} />
      </div>
    </motion.div>
  );
}
