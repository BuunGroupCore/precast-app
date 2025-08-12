import { motion } from "framer-motion";
import { FaRedo, FaInfoCircle } from "react-icons/fa";

interface AnalyticsErrorDisplayProps {
  error: Error;
  onRetry: () => void;
}

export function AnalyticsErrorDisplay({ error, onRetry }: AnalyticsErrorDisplayProps) {
  const getErrorType = (errorMessage: string) => {
    if (errorMessage.includes("404")) {
      return {
        title: "Analytics Service Not Found",
        description: "The analytics endpoint is not responding. This might be a temporary issue.",
        suggestion: "The analytics worker may need to be deployed or configured.",
        type: "not-found" as const,
      };
    }
    if (errorMessage.includes("500")) {
      return {
        title: "Server Error",
        description: "There was an internal error processing analytics data.",
        suggestion: "This is likely a temporary issue with the analytics service.",
        type: "server-error" as const,
      };
    }
    if (errorMessage.includes("Network")) {
      return {
        title: "Network Connection Error",
        description: "Unable to connect to the analytics service.",
        suggestion: "Please check your internet connection and try again.",
        type: "network" as const,
      };
    }
    return {
      title: "Analytics Error",
      description: "An unexpected error occurred while loading analytics data.",
      suggestion: "Please try refreshing the page or contact support if the issue persists.",
      type: "unknown" as const,
    };
  };

  const errorInfo = getErrorType(error.message);

  const getErrorIcon = () => {
    switch (errorInfo.type) {
      case "not-found":
        return "🔍";
      case "server-error":
        return "🚨";
      case "network":
        return "🌐";
      default:
        return "⚠️";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 text-center">
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-6xl mb-6"
          >
            {getErrorIcon()}
          </motion.div>

          {/* Error Title */}
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
          >
            {errorInfo.title}
          </motion.h2>

          {/* Error Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="text-gray-600 dark:text-gray-400 mb-4"
          >
            {errorInfo.description}
          </motion.p>

          {/* Error Details */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6"
          >
            <div className="flex items-start space-x-3">
              <FaInfoCircle className="text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Suggestion</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{errorInfo.suggestion}</p>
              </div>
            </div>
          </motion.div>

          {/* Technical Error Details (Expandable) */}
          <motion.details
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="mb-6 text-left"
          >
            <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              Technical Details
            </summary>
            <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
              <code className="text-xs text-red-700 dark:text-red-300 break-words">
                {error.message}
              </code>
            </div>
          </motion.details>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <button
              onClick={onRetry}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <FaRedo className="text-sm" />
              <span>Retry</span>
            </button>

            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Refresh Page
            </button>
          </motion.div>

          {/* Help Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            className="text-xs text-gray-500 dark:text-gray-500 mt-6"
          >
            If the problem persists, please check the browser console for additional details.
          </motion.p>
        </div>

        {/* Additional Info Card */}
        {errorInfo.type === "not-found" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.9 }}
            className="mt-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800"
          >
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">For Developers</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Make sure the PostHog analytics worker is deployed to{" "}
              <code className="bg-blue-100 dark:bg-blue-900/40 px-1 rounded">
                api.precast.dev/analytics
              </code>
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
