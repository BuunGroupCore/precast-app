import { motion } from "framer-motion";

export function AnalyticsLoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <motion.div
          className="inline-block relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Main spinner */}
          <motion.div
            className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />

          {/* Inner spinner */}
          <motion.div
            className="absolute top-2 left-2 w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        <motion.div
          className="mt-6 space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Loading Analytics Data
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Fetching the latest insights from PostHog...
          </p>
        </motion.div>

        {/* Animated dots */}
        <motion.div
          className="flex justify-center space-x-1 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-blue-600 rounded-full"
              animate={{
                y: [-4, 4, -4],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>

        {/* Progress indicators */}
        <motion.div
          className="mt-8 space-y-3 max-w-xs mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {[
            "Connecting to analytics service...",
            "Processing usage metrics...",
            "Generating insights...",
          ].map((step, index) => (
            <motion.div
              key={step}
              className="flex items-center text-sm text-gray-600 dark:text-gray-400"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.8 + index * 0.2 }}
            >
              <motion.div
                className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: index * 0.3 }}
              />
              {step}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
