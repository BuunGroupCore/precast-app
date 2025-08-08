import { motion } from "framer-motion";
import {
  FaTerminal,
  FaRocket,
  FaUsers,
  FaCogs,
  FaLayerGroup,
  FaDatabase,
  FaPalette,
  FaClock,
} from "react-icons/fa";

import { ComicLoader } from "@/features/common";

interface CliAnalytics {
  updated: string;
  lastUpdatedFormatted: string;
  totals: {
    projects: number;
    users: number;
    totalEvents: number;
  };
  frameworks: Record<string, number>;
  backends: Record<string, number>;
  databases: Record<string, number>;
  styling: Record<string, number>;
  uiLibraries: Record<string, number>;
  features: Record<string, number>;
  popularStacks: Array<{
    framework: string;
    backend: string;
    database: string;
    styling: string;
    uiLibrary: string;
    count: number;
    users: number;
    percentage: string;
  }>;
  topCombinations: {
    reactStacks: Array<{
      framework: string;
      backend: string;
      database: string;
      styling: string;
      uiLibrary?: string;
      count: number;
      users: number;
      percentage: string;
    }>;
    fullStack: Array<{
      framework: string;
      backend: string;
      database: string;
      styling: string;
      uiLibrary?: string;
      count: number;
      users: number;
      percentage: string;
    }>;
    frontendOnly: Array<{
      framework: string;
      backend: string;
      database: string;
      styling: string;
      uiLibrary?: string;
      count: number;
      users: number;
      percentage: string;
    }>;
  };
  loading: boolean;
  error: Error | null;
}

interface CliUsageSectionProps {
  cliAnalytics: CliAnalytics;
  formatNumber: (num: number) => string;
}

export function CliUsageSection({ cliAnalytics, formatNumber }: CliUsageSectionProps) {
  return (
    <>
      {/* Comic Separator */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="relative">
          <div className="h-2 bg-comic-black rounded-full"></div>
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-4">
            <div className="action-text text-2xl text-comic-green bg-comic-black px-4 py-1 rounded-full border-4 border-comic-green">
              CLI STATS!
            </div>
          </div>
        </div>
      </div>

      {/* CLI Usage Analytics */}
      <section className="px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <div className="inline-block">
              <h2 className="action-text text-4xl md:text-6xl text-comic-purple flex items-center gap-4">
                <FaTerminal /> CLI USAGE STATS
              </h2>
            </div>
          </motion.div>

          {/* CLI Stats Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              whileHover={{ scale: 1.05 }}
              className="comic-panel p-6 bg-comic-purple text-center"
            >
              <FaRocket className="text-4xl mx-auto mb-2 text-comic-white" />
              <div className="action-text text-3xl text-comic-white">
                {cliAnalytics ? formatNumber(cliAnalytics.totals.projects) : "..."}
              </div>
              <div className="font-display text-lg text-comic-white">PROJECTS CREATED</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
              whileHover={{ scale: 1.05 }}
              className="comic-panel p-6 bg-comic-blue text-center"
            >
              <FaUsers className="text-4xl mx-auto mb-2 text-comic-white" />
              <div className="action-text text-3xl text-comic-white">
                {cliAnalytics ? formatNumber(cliAnalytics.totals.users) : "..."}
              </div>
              <div className="font-display text-lg text-comic-white">ACTIVE DEVELOPERS</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7 }}
              whileHover={{ scale: 1.05 }}
              className="comic-panel p-6 bg-comic-green text-center"
            >
              <FaCogs className="text-4xl mx-auto mb-2 text-comic-white" />
              <div className="action-text text-3xl text-comic-white">
                {cliAnalytics ? formatNumber(cliAnalytics.totals.totalEvents) : "..."}
              </div>
              <div className="font-display text-lg text-comic-white">TOTAL EVENTS</div>
            </motion.div>
          </div>

          {/* Framework and Tech Stack Breakdown */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.8 }}
              className="comic-panel p-6"
            >
              <h3 className="font-display text-2xl mb-4 text-comic-purple flex items-center gap-2">
                <FaLayerGroup /> POPULAR FRAMEWORKS
              </h3>
              <div className="space-y-3">
                {cliAnalytics && Object.keys(cliAnalytics.frameworks).length > 0 ? (
                  Object.entries(cliAnalytics.frameworks)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([framework, count]) => (
                      <div
                        key={framework}
                        className="flex items-center justify-between p-3 rounded-lg bg-comic-purple bg-opacity-10"
                      >
                        <span className="font-comic font-bold text-comic-purple capitalize">
                          {framework}
                        </span>
                        <span className="action-text text-xl text-comic-red">{count}</span>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-8">
                    <ComicLoader
                      message={
                        cliAnalytics.loading ? "LOADING CLI DATA..." : "NO FRAMEWORK DATA YET"
                      }
                      color="purple"
                      size="lg"
                    />
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.9 }}
              className="comic-panel p-6"
            >
              <h3 className="font-display text-2xl mb-4 text-comic-blue flex items-center gap-2">
                <FaDatabase /> DATABASE CHOICES
              </h3>
              <div className="space-y-3">
                {cliAnalytics && Object.keys(cliAnalytics.databases).length > 0 ? (
                  Object.entries(cliAnalytics.databases)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([database, count]) => (
                      <div
                        key={database}
                        className="flex items-center justify-between p-3 rounded-lg bg-comic-blue bg-opacity-10"
                      >
                        <span className="font-comic font-bold text-comic-blue capitalize">
                          {database}
                        </span>
                        <span className="action-text text-xl text-comic-red">{count}</span>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-8">
                    <ComicLoader
                      message={
                        cliAnalytics.loading ? "LOADING DATABASE DATA..." : "NO DATABASE DATA YET"
                      }
                      color="blue"
                      size="lg"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Styling Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0 }}
            className="comic-panel p-6 mb-8"
          >
            <h3 className="font-display text-2xl mb-4 text-comic-green flex items-center gap-2">
              <FaPalette /> STYLING PREFERENCES
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {cliAnalytics && Object.keys(cliAnalytics.styling).length > 0 ? (
                Object.entries(cliAnalytics.styling)
                  .sort(([, a], [, b]) => b - a)
                  .map(([styling, count]) => (
                    <div
                      key={styling}
                      className="comic-panel p-4 bg-comic-green bg-opacity-10 text-center"
                    >
                      <div className="action-text text-2xl text-comic-green mb-1">{count}</div>
                      <div className="font-comic text-sm text-comic-black capitalize">
                        {styling}
                      </div>
                    </div>
                  ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <ComicLoader
                    message={
                      cliAnalytics.loading ? "LOADING STYLING DATA..." : "NO STYLING DATA YET"
                    }
                    color="green"
                    size="lg"
                  />
                </div>
              )}
            </div>
          </motion.div>

          {/* Update Status */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.1 }}
            className="speech-bubble bg-comic-yellow text-center p-4"
          >
            <p className="font-comic text-lg text-comic-black">
              <FaClock className="inline mr-2" />
              CLI analytics update every <strong>6 hours</strong> •
              {cliAnalytics?.lastUpdatedFormatted && (
                <span className="ml-2">
                  Last updated: <strong>{cliAnalytics.lastUpdatedFormatted}</strong>
                </span>
              )}
              {(!cliAnalytics || cliAnalytics.totals.projects === 0) && (
                <span className="ml-2">
                  No data available yet - start creating projects with the CLI!
                </span>
              )}
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
