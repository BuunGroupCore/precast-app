import { motion } from "framer-motion";

interface MetricsHeaderProps {
  loading: boolean;
  refreshTime: Date;
}

export function MetricsHeader({ loading, refreshTime }: MetricsHeaderProps) {
  return (
    <>
      {/* Hero Section */}
      <section className="relative px-4 pb-12">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="action-text text-6xl md:text-8xl text-comic-red mb-8">METRICS HQ</h1>
            <p className="font-display text-2xl md:text-3xl text-comic-blue">
              Real-Time Project Analytics
            </p>
          </motion.div>

          {/* Refresh Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 inline-block"
          >
            <div className="speech-bubble text-sm">
              <p className="font-comic">
                Live data • GitHub: 30 minutes • Analytics: 6 hours • Last:{" "}
                <strong>{refreshTime.toLocaleTimeString()}</strong>
                {loading && " • Refreshing..."}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comic Separator */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="relative">
          <div className="h-2 bg-comic-black rounded-full"></div>
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-4">
            <div className="action-text text-2xl text-comic-red bg-comic-black px-4 py-1 rounded-full border-4 border-comic-red">
              STATS!
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
