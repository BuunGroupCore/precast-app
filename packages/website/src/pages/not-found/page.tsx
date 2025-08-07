import { motion } from "framer-motion";
import { FaHome, FaExclamationTriangle, FaRocket } from "react-icons/fa";
import { Link } from "react-router-dom";

/**
 * 404 Not Found page with comic book themed animations.
 * Provides friendly error messaging and navigation back to home.
 */
export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-comic-yellow via-comic-orange to-comic-red flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border-4 border-black transform rotate-12"></div>
        <div className="absolute top-20 right-20 w-24 h-24 border-4 border-black transform -rotate-12"></div>
        <div className="absolute bottom-20 left-20 w-28 h-28 border-4 border-black transform rotate-45"></div>
        <div className="absolute bottom-10 right-10 w-36 h-36 border-4 border-black transform -rotate-6"></div>
      </div>

      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          duration: 0.8,
        }}
        className="comic-panel max-w-2xl mx-auto text-center relative z-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="absolute -inset-8 bg-gradient-to-r from-comic-yellow via-comic-orange to-comic-red rounded-full opacity-20 blur-xl"
        />

        <div className="relative z-20 p-8">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mb-6"
          >
            <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-comic-red to-comic-darkRed transform -rotate-2 drop-shadow-lg">
              404
            </h1>
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.7,
              type: "spring",
              stiffness: 500,
              damping: 10,
            }}
            className="mb-6"
          >
            <motion.div
              animate={{
                rotate: [0, -5, 5, -5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <FaExclamationTriangle className="text-6xl text-comic-red mx-auto drop-shadow-lg" />
            </motion.div>
          </motion.div>

          {/* Speech bubble */}
          <motion.div
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="speech-bubble mb-8 p-6 bg-white border-4 border-black relative"
          >
            <div className="absolute -bottom-4 left-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-black"></div>
            <div className="absolute -bottom-3 left-8 w-0 h-0 border-l-7 border-r-7 border-t-7 border-l-transparent border-r-transparent border-t-white"></div>

            <h2 className="text-3xl font-bold text-comic-darkBlue mb-2 font-display">
              OOPS! PAGE NOT FOUND!
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Looks like this page got zapped into another dimension! Don&apos;t worry, our comic
              book hero is on the case!
            </p>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  rotate: [-1, 1, -1, 0],
                  transition: { duration: 0.3 },
                }}
                whileTap={{ scale: 0.95 }}
                className="comic-btn-primary inline-flex items-center gap-3 px-8 py-4 text-lg font-bold"
              >
                <FaHome className="text-xl" />
                BACK TO HOME
              </motion.button>
            </Link>

            <Link to="/builder">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  rotate: [1, -1, 1, 0],
                  transition: { duration: 0.3 },
                }}
                whileTap={{ scale: 0.95 }}
                className="comic-btn-secondary inline-flex items-center gap-3 px-8 py-4 text-lg font-bold"
              >
                <FaRocket className="text-xl" />
                BUILD PROJECT
              </motion.button>
            </Link>
          </motion.div>

          {/* Floating comic elements */}
          <motion.div
            animate={{
              y: [-10, 10, -10],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-6 -left-6 text-2xl font-black text-comic-red transform -rotate-12"
          >
            POW!
          </motion.div>

          <motion.div
            animate={{
              y: [10, -10, 10],
              rotate: [0, -5, 5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute -top-4 -right-8 text-xl font-black text-comic-blue transform rotate-12"
          >
            ZAP!
          </motion.div>

          <motion.div
            animate={{
              y: [-5, 15, -5],
              x: [-5, 5, -5],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute -bottom-8 left-4 text-lg font-black text-comic-orange transform -rotate-6"
          >
            BOOM!
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
