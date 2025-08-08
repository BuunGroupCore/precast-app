import { motion } from "framer-motion";

/**
 * Loading component displayed while lazy-loaded pages are being fetched
 */
export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-comic-dots">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-comic-purple border-t-transparent rounded-full mx-auto"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="text-2xl font-bold text-comic-purple">P</span>
          </motion.div>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 font-comic text-sm text-comic-black/60"
        >
          Loading awesome content...
        </motion.p>
      </motion.div>
    </div>
  );
}
