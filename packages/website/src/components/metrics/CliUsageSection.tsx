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

import {
  FrameworkUsageChart,
  EventTimelineChart,
  StackCombinationsTable,
  DeveloperExperienceChart,
  UserJourneyFlow,
  ProjectTimelineChart,
  PlatformDistributionChart,
  CLIVersionChart,
  WeeklyTrendsChart,
  TemplateUsageChart,
  UserPreferencesChart,
} from "@/components/metrics";
import { getTechIcon } from "@/components/metrics/tech-icons";
import { ComicLoader } from "@/features/common";
import type { AnalyticsMetrics } from "@/hooks/usePrecastAPI";

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
  postHogAnalytics?: AnalyticsMetrics | null;
  analyticsLoading?: boolean;
  analyticsError?: Error | null;
  refetchAnalytics?: () => void;
}

export function CliUsageSection({
  cliAnalytics,
  formatNumber,
  postHogAnalytics,
  analyticsLoading,
  analyticsError: _analyticsError,
  refetchAnalytics: _refetchAnalytics,
}: CliUsageSectionProps) {
  return (
    <>
      {/* Comic Separator - Mobile Responsive */}
      <div className="max-w-7xl mx-auto px-4 mb-8 sm:mb-12">
        <div className="relative">
          <div className="h-2 bg-comic-black rounded-full"></div>
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-3 sm:-top-4">
            <div className="action-text text-sm sm:text-lg md:text-2xl text-comic-green bg-comic-black px-2 sm:px-3 md:px-4 py-0.5 sm:py-1 rounded-full border-2 sm:border-3 md:border-4 border-comic-green whitespace-nowrap">
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
              <h2 className="action-text text-2xl sm:text-3xl md:text-4xl lg:text-6xl text-comic-purple flex items-center gap-2 sm:gap-3 md:gap-4">
                <FaTerminal className="text-xl sm:text-2xl md:text-3xl lg:text-4xl" />
                <span className="break-words">CLI USAGE STATS</span>
              </h2>
            </div>
          </motion.div>

          {/* CLI Stats Overview - Mobile Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              whileHover={{ scale: 1.05 }}
              className="comic-panel p-4 sm:p-6 bg-comic-purple text-center"
            >
              <FaRocket className="text-2xl sm:text-3xl md:text-4xl mx-auto mb-2 text-comic-white" />
              <div className="action-text text-xl sm:text-2xl md:text-3xl text-comic-white break-words">
                {postHogAnalytics?.usage?.eventsLast30Days
                  ? formatNumber(postHogAnalytics.usage.eventsLast30Days)
                  : cliAnalytics
                    ? formatNumber(cliAnalytics.totals.projects)
                    : "..."}
              </div>
              <div className="font-display text-xs sm:text-sm md:text-lg text-comic-white">
                CLI EVENTS
                <span className="block sm:inline"> (30D)</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
              whileHover={{ scale: 1.05 }}
              className="comic-panel p-4 sm:p-6 bg-comic-blue text-center"
            >
              <FaUsers className="text-2xl sm:text-3xl md:text-4xl mx-auto mb-2 text-comic-white" />
              <div className="action-text text-xl sm:text-2xl md:text-3xl text-comic-white break-words">
                {postHogAnalytics?.usage?.activeUsersLast30Days
                  ? formatNumber(postHogAnalytics.usage.activeUsersLast30Days)
                  : cliAnalytics
                    ? formatNumber(cliAnalytics.totals.users)
                    : "..."}
              </div>
              <div className="font-display text-xs sm:text-sm md:text-lg text-comic-white">
                ACTIVE USERS
                <span className="block sm:inline"> (30D)</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7 }}
              whileHover={{ scale: 1.05 }}
              className="comic-panel p-4 sm:p-6 bg-comic-green text-center col-span-1 sm:col-span-2 md:col-span-1"
            >
              <FaCogs className="text-2xl sm:text-3xl md:text-4xl mx-auto mb-2 text-comic-white" />
              <div className="action-text text-xl sm:text-2xl md:text-3xl text-comic-white break-words">
                {postHogAnalytics?.usage?.totalEvents
                  ? formatNumber(postHogAnalytics.usage.totalEvents)
                  : cliAnalytics
                    ? formatNumber(cliAnalytics.totals.totalEvents)
                    : "..."}
              </div>
              <div className="font-display text-xs sm:text-sm md:text-lg text-comic-white">
                TOTAL EVENTS
              </div>
            </motion.div>
          </div>

          {/* Framework and Tech Stack Breakdown - Mobile Responsive */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.8 }}
              className="comic-panel p-4 sm:p-6"
            >
              <h3 className="font-display text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4 text-comic-purple flex items-center gap-2">
                <FaLayerGroup className="text-base sm:text-lg md:text-xl" />
                <span className="truncate">POPULAR FRAMEWORKS</span>
              </h3>
              <div className="space-y-3">
                {postHogAnalytics?.frameworks?.topFrameworks &&
                postHogAnalytics.frameworks.topFrameworks.length > 0 ? (
                  postHogAnalytics.frameworks.topFrameworks.slice(0, 5).map((framework) => {
                    const Icon = getTechIcon("framework", framework.name);
                    return (
                      <div
                        key={framework.name}
                        className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-comic-purple bg-opacity-10"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {Icon && (
                            <Icon className="text-base sm:text-lg md:text-xl text-comic-purple flex-shrink-0" />
                          )}
                          <span className="font-comic font-bold text-xs sm:text-sm text-comic-purple capitalize truncate">
                            {framework.name}
                          </span>
                        </div>
                        <span className="action-text text-sm sm:text-lg md:text-xl text-comic-red flex-shrink-0">
                          {framework.count}
                        </span>
                      </div>
                    );
                  })
                ) : cliAnalytics && Object.keys(cliAnalytics.frameworks).length > 0 ? (
                  Object.entries(cliAnalytics.frameworks)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([framework, count]) => {
                      const Icon = getTechIcon("framework", framework);
                      return (
                        <div
                          key={framework}
                          className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-comic-purple bg-opacity-10"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {Icon && (
                              <Icon className="text-base sm:text-lg md:text-xl text-comic-purple flex-shrink-0" />
                            )}
                            <span className="font-comic font-bold text-xs sm:text-sm text-comic-purple capitalize truncate">
                              {framework}
                            </span>
                          </div>
                          <span className="action-text text-sm sm:text-lg md:text-xl text-comic-red flex-shrink-0">
                            {count}
                          </span>
                        </div>
                      );
                    })
                ) : (
                  <div className="text-center py-8">
                    <ComicLoader
                      message={
                        analyticsLoading
                          ? "LOADING ENHANCED DATA..."
                          : cliAnalytics.loading
                            ? "LOADING CLI DATA..."
                            : "NO FRAMEWORK DATA YET"
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
              className="comic-panel p-4 sm:p-6"
            >
              <h3 className="font-display text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4 text-comic-blue flex items-center gap-2">
                <FaDatabase className="text-base sm:text-lg md:text-xl" />
                <span className="truncate">DATABASE CHOICES</span>
              </h3>
              <div className="space-y-3">
                {postHogAnalytics?.stackCombinations ? (
                  (() => {
                    const databaseCounts: Record<string, number> = {};
                    postHogAnalytics.stackCombinations.forEach((stack) => {
                      if (stack.database && stack.database !== "none") {
                        databaseCounts[stack.database] =
                          (databaseCounts[stack.database] || 0) + stack.frequency;
                      }
                    });

                    return Object.entries(databaseCounts)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([database, count]) => {
                        const Icon = getTechIcon("database", database);
                        return (
                          <div
                            key={database}
                            className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-comic-blue bg-opacity-10"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              {Icon && (
                                <Icon className="text-base sm:text-lg md:text-xl text-comic-blue flex-shrink-0" />
                              )}
                              <span className="font-comic font-bold text-xs sm:text-sm text-comic-blue capitalize truncate">
                                {database}
                              </span>
                            </div>
                            <span className="action-text text-sm sm:text-lg md:text-xl text-comic-red flex-shrink-0">
                              {count}
                            </span>
                          </div>
                        );
                      });
                  })()
                ) : cliAnalytics && Object.keys(cliAnalytics.databases).length > 0 ? (
                  Object.entries(cliAnalytics.databases)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([database, count]) => {
                      const Icon = getTechIcon("database", database);
                      return (
                        <div
                          key={database}
                          className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-comic-blue bg-opacity-10"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {Icon && (
                              <Icon className="text-base sm:text-lg md:text-xl text-comic-blue flex-shrink-0" />
                            )}
                            <span className="font-comic font-bold text-xs sm:text-sm text-comic-blue capitalize truncate">
                              {database}
                            </span>
                          </div>
                          <span className="action-text text-sm sm:text-lg md:text-xl text-comic-red flex-shrink-0">
                            {count}
                          </span>
                        </div>
                      );
                    })
                ) : (
                  <div className="text-center py-8">
                    <ComicLoader
                      message={
                        analyticsLoading
                          ? "LOADING ENHANCED DATA..."
                          : cliAnalytics.loading
                            ? "LOADING DATABASE DATA..."
                            : "NO DATABASE DATA YET"
                      }
                      color="blue"
                      size="lg"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Styling Preferences - Mobile Responsive */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0 }}
            className="comic-panel p-4 sm:p-6 mb-8"
          >
            <h3 className="font-display text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4 text-comic-green flex items-center gap-2">
              <FaPalette className="text-base sm:text-lg md:text-xl" />
              <span className="truncate">STYLING PREFERENCES</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              {postHogAnalytics?.stackCombinations ? (
                (() => {
                  const stylingCounts: Record<string, number> = {};
                  postHogAnalytics.stackCombinations.forEach((stack) => {
                    if (stack.styling) {
                      stylingCounts[stack.styling] =
                        (stylingCounts[stack.styling] || 0) + stack.frequency;
                    }
                  });

                  return Object.entries(stylingCounts)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 8)
                    .map(([styling, count]) => {
                      const Icon = getTechIcon("styling", styling);
                      return (
                        <div
                          key={styling}
                          className="comic-panel p-2 sm:p-3 md:p-4 bg-comic-green bg-opacity-10 text-center"
                        >
                          {Icon && (
                            <Icon className="text-lg sm:text-xl md:text-2xl mx-auto mb-1 text-comic-green" />
                          )}
                          <div className="action-text text-sm sm:text-lg md:text-2xl text-comic-green mb-1">
                            {count}
                          </div>
                          <div className="font-comic text-[10px] sm:text-xs md:text-sm text-comic-black capitalize truncate">
                            {styling}
                          </div>
                        </div>
                      );
                    });
                })()
              ) : cliAnalytics && Object.keys(cliAnalytics.styling).length > 0 ? (
                Object.entries(cliAnalytics.styling)
                  .sort(([, a], [, b]) => b - a)
                  .map(([styling, count]) => {
                    const Icon = getTechIcon("styling", styling);
                    return (
                      <div
                        key={styling}
                        className="comic-panel p-2 sm:p-3 md:p-4 bg-comic-green bg-opacity-10 text-center"
                      >
                        {Icon && (
                          <Icon className="text-lg sm:text-xl md:text-2xl mx-auto mb-1 text-comic-green" />
                        )}
                        <div className="action-text text-sm sm:text-lg md:text-2xl text-comic-green mb-1">
                          {count}
                        </div>
                        <div className="font-comic text-[10px] sm:text-xs md:text-sm text-comic-black capitalize truncate">
                          {styling}
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div className="col-span-full text-center py-8">
                  <ComicLoader
                    message={
                      analyticsLoading
                        ? "LOADING ENHANCED DATA..."
                        : cliAnalytics.loading
                          ? "LOADING STYLING DATA..."
                          : "NO STYLING DATA YET"
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
              CLI analytics update in <strong>real-time</strong> •
              <span className="ml-2">
                Powered by <strong>PostHog Analytics</strong>
              </span>
              {!postHogAnalytics && !analyticsLoading && (
                <span className="ml-2">• Start creating projects with the CLI!</span>
              )}
            </p>
          </motion.div>

          {/* Enhanced Analytics Charts */}
          {postHogAnalytics && !analyticsLoading && (
            <>
              <div className="mt-8">
                <FrameworkUsageChart analytics={postHogAnalytics} />
              </div>
              <ProjectTimelineChart analytics={postHogAnalytics} />
              <WeeklyTrendsChart />
              <EventTimelineChart analytics={postHogAnalytics} />
              <PlatformDistributionChart />
              <CLIVersionChart />
              <StackCombinationsTable analytics={postHogAnalytics} />
              <DeveloperExperienceChart analytics={postHogAnalytics} />
              <UserJourneyFlow />
              <TemplateUsageChart />
              <UserPreferencesChart />
            </>
          )}
        </div>
      </section>
    </>
  );
}
