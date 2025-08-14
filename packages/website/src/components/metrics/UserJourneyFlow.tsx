import { motion } from "framer-motion";
import {
  FaRoute,
  FaCheckCircle,
  FaExclamationCircle,
  FaArrowRight,
  FaLaptopCode,
  FaClock,
  FaRedo,
  FaRoad,
} from "react-icons/fa";

import { useUserJourney } from "../../hooks/usePrecastAPI";

// No props needed for this component
type UserJourneyFlowProps = Record<string, never>;

export function UserJourneyFlow(_props: UserJourneyFlowProps) {
  const { data: journey, loading, error } = useUserJourney();

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.6 }}
        className="comic-panel p-6 mb-8 text-center"
      >
        <FaRoad className="text-4xl mx-auto mb-4 text-comic-yellow animate-pulse" />
        <h3 className="font-display text-2xl text-comic-yellow mb-2">USER JOURNEY</h3>
        <div className="font-comic text-comic-black">Loading journey analytics...</div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.6 }}
        className="comic-panel p-6 mb-8 text-center"
      >
        <FaRoad className="text-4xl mx-auto mb-4 text-comic-red" />
        <h3 className="font-display text-2xl text-comic-red mb-2">USER JOURNEY</h3>
        <div className="font-comic text-comic-black">
          Error loading journey data: {error.message}
        </div>
      </motion.div>
    );
  }

  if (!journey) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.6 }}
        className="comic-panel p-6 mb-8 text-center"
      >
        <FaRoad className="text-4xl mx-auto mb-4 text-comic-yellow" />
        <h3 className="font-display text-2xl text-comic-yellow mb-2">USER JOURNEY</h3>
        <div className="font-comic text-comic-black">
          User journey analytics will be displayed here once data is collected.
        </div>
      </motion.div>
    );
  }

  const formatTime = (ms: number) => {
    if (ms < 60000) return `${Math.round(ms / 1000)}s`;
    if (ms < 3600000) return `${Math.round(ms / 60000)}m`;
    return `${Math.round(ms / 3600000)}h`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.6 }}
      className="comic-panel p-6 mb-8"
    >
      <h3 className="font-display text-lg sm:text-xl md:text-2xl mb-4 text-comic-yellow flex items-center gap-2">
        <FaRoute className="text-base sm:text-lg md:text-xl" />
        <span>USER JOURNEY</span>
      </h3>

      {/* Key Metrics - Mobile Responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-6">
        <div className="comic-panel p-3 sm:p-4 bg-comic-purple text-center">
          <FaLaptopCode className="text-lg sm:text-xl md:text-2xl mx-auto mb-1 sm:mb-2 text-comic-white" />
          <div className="font-display text-[10px] sm:text-xs md:text-sm text-comic-white">
            ENTRY POINT
          </div>
          <div className="action-text text-sm sm:text-base md:text-lg text-comic-white uppercase truncate">
            {journey?.entryPoint || "CLI"}
          </div>
        </div>

        <div className="comic-panel p-3 sm:p-4 bg-comic-green text-center">
          <FaCheckCircle className="text-lg sm:text-xl md:text-2xl mx-auto mb-1 sm:mb-2 text-comic-white" />
          <div className="action-text text-base sm:text-xl md:text-2xl text-comic-white">
            {journey?.completionRate || 0}%
          </div>
          <div className="font-display text-[10px] sm:text-xs md:text-sm text-comic-white">
            COMPLETION
          </div>
        </div>

        <div className="comic-panel p-3 sm:p-4 bg-comic-blue text-center">
          <FaClock className="text-lg sm:text-xl md:text-2xl mx-auto mb-1 sm:mb-2 text-comic-white" />
          <div className="action-text text-base sm:text-xl md:text-2xl text-comic-white">
            {formatTime(journey?.avgTimeToCompletion || 0)}
          </div>
          <div className="font-display text-[10px] sm:text-xs md:text-sm text-comic-white">
            AVG TIME
          </div>
        </div>

        <div className="comic-panel p-3 sm:p-4 bg-comic-red text-center">
          <FaRedo className="text-lg sm:text-xl md:text-2xl mx-auto mb-1 sm:mb-2 text-comic-white" />
          <div className="action-text text-base sm:text-xl md:text-2xl text-comic-white">
            {journey?.retryAttempts || 0}
          </div>
          <div className="font-display text-[10px] sm:text-xs md:text-sm text-comic-white">
            RETRIES
          </div>
        </div>
      </div>

      {/* Common Paths - With Horizontal Scroll on Mobile */}
      {journey?.commonPaths && journey.commonPaths.length > 0 && (
        <div className="mb-6">
          <h4 className="font-display text-lg sm:text-xl mb-4 text-comic-purple">COMMON PATHS</h4>
          <div className="space-y-3">
            {journey.commonPaths
              .slice(0, 3)
              .map((path: { path: string[]; frequency: number }, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 2.7 + index * 0.1 }}
                  className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-comic-purple bg-opacity-10 border-2 border-comic-purple"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="action-text text-comic-purple flex-shrink-0">
                      #{index + 1}
                    </span>
                    {/* Horizontal scroll wrapper for mobile */}
                    <div className="overflow-x-auto flex-1">
                      <div className="flex items-center gap-1 sm:gap-2 min-w-max">
                        {path.path.map((step: string, stepIndex: number) => (
                          <div key={stepIndex} className="flex items-center gap-1">
                            <span className="comic-panel px-1.5 sm:px-2 py-0.5 sm:py-1 bg-comic-purple text-comic-white text-[10px] sm:text-xs font-comic font-bold whitespace-nowrap">
                              {step
                                .replace(/[_$]/g, " ")
                                .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                            </span>
                            {stepIndex < path.path.length - 1 && (
                              <FaArrowRight className="text-comic-purple text-xs sm:text-sm flex-shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="action-text text-base sm:text-lg text-comic-red flex-shrink-0 ml-2">
                    {path.frequency}
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      )}

      {/* Dropoff Points - Mobile Responsive */}
      {journey?.dropoffPoints && journey.dropoffPoints.length > 0 && (
        <div>
          <h4 className="font-display text-lg sm:text-xl mb-4 text-comic-red">DROPOFF POINTS</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
            {journey.dropoffPoints.slice(0, 6).map((dropoff: string, index: number) => (
              <motion.div
                key={dropoff}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.8 + index * 0.05 }}
                className="flex items-center gap-1 sm:gap-2 p-2 sm:p-3 comic-panel bg-comic-red bg-opacity-10 text-center"
              >
                <FaExclamationCircle className="text-comic-red text-sm sm:text-base flex-shrink-0" />
                <span className="font-comic text-comic-black text-[10px] sm:text-xs md:text-sm font-bold truncate">
                  {dropoff.replace(/[_$]/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
