import { motion } from "framer-motion";
import { FaBug, FaExclamationTriangle, FaCheckCircle, FaRedo, FaTools } from "react-icons/fa";
import { usePrecastAnalytics } from "../../hooks/usePrecastAPI";

export function ErrorMetricsSection() {
  const { analytics, loading } = usePrecastAnalytics();

  if (loading || !analytics?.errors) {
    return null;
  }

  const { errors } = analytics;
  const { commonErrors = [], fallbackUsage, recoveryRate = 0 } = errors;

  // Provide defaults for fallbackUsage properties
  const bunToNpm = fallbackUsage?.bunToNpm ?? 0;
  const templateRetries = fallbackUsage?.templateRetries ?? 0;
  const manualInterventions = fallbackUsage?.manualInterventions ?? 0;

  // Sort errors by frequency
  const topErrors = commonErrors.sort((a, b) => b.frequency - a.frequency).slice(0, 5);

  if (topErrors.length === 0 && bunToNpm === 0) {
    return null; // Don't show section if no errors
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.8 }}
      className="comic-panel p-6 mb-8"
    >
      <h3 className="font-display text-2xl mb-4 text-comic-red flex items-center gap-2">
        <FaBug /> ERROR ANALYTICS
      </h3>

      {/* Recovery Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="comic-panel p-4 bg-comic-green bg-opacity-10 text-center">
          <FaCheckCircle className="text-2xl mx-auto mb-2 text-comic-green" />
          <div className="action-text text-2xl text-comic-green">
            {Math.round(recoveryRate * 100)}%
          </div>
          <div className="font-display text-sm text-comic-black">RECOVERY RATE</div>
        </div>

        <div className="comic-panel p-4 bg-comic-yellow bg-opacity-10 text-center">
          <FaRedo className="text-2xl mx-auto mb-2 text-comic-yellow" />
          <div className="action-text text-2xl text-comic-yellow">{bunToNpm}</div>
          <div className="font-display text-sm text-comic-black">BUN → NPM</div>
        </div>

        <div className="comic-panel p-4 bg-comic-blue bg-opacity-10 text-center">
          <FaTools className="text-2xl mx-auto mb-2 text-comic-blue" />
          <div className="action-text text-2xl text-comic-blue">{templateRetries}</div>
          <div className="font-display text-sm text-comic-black">RETRIES</div>
        </div>

        <div className="comic-panel p-4 bg-comic-purple bg-opacity-10 text-center">
          <FaExclamationTriangle className="text-2xl mx-auto mb-2 text-comic-purple" />
          <div className="action-text text-2xl text-comic-purple">{manualInterventions}</div>
          <div className="font-display text-sm text-comic-black">MANUAL FIXES</div>
        </div>
      </div>

      {/* Common Errors */}
      {topErrors.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-display text-lg text-comic-red mb-2">COMMON ERRORS</h4>
          {topErrors.map((error, index) => (
            <div
              key={index}
              className="p-3 rounded-lg bg-comic-red bg-opacity-5 border-l-4 border-comic-red"
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-comic font-bold text-comic-red">{error.type}</span>
                <span className="action-text text-sm text-comic-orange">{error.frequency}x</span>
              </div>
              <p className="font-comic text-xs text-comic-black mb-2">{error.message}</p>
              {error.resolution && (
                <p className="font-comic text-xs text-comic-green">✓ {error.resolution}</p>
              )}
              {error.avgTimeToResolve > 0 && (
                <p className="font-comic text-xs text-comic-blue mt-1">
                  Avg resolution: {Math.round(error.avgTimeToResolve)}s
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.9 }}
        className="mt-6 p-4 speech-bubble bg-comic-yellow text-center"
      >
        <p className="font-comic text-lg text-comic-black">
          <FaCheckCircle className="inline mr-2 text-comic-green" />
          <strong>{Math.round(recoveryRate * 100)}%</strong> automatic recovery •
          <strong> {bunToNpm}</strong> package manager fallbacks •
          <strong> {topErrors.length}</strong> unique error types tracked
        </p>
      </motion.div>
    </motion.div>
  );
}
