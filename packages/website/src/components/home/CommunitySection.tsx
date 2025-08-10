import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import {
  FaStar,
  FaDownload,
  FaUsers,
  FaCodeBranch,
  FaGithub,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

import { EXTERNAL_LINKS, COMMUNITY_GOALS } from "@/config/constants";
import { useNpmStats } from "@/hooks/useNpmStats";
import { usePrecastAPI } from "@/hooks/usePrecastAPI";

/**
 * Community section component displaying GitHub and NPM statistics.
 * Shows real-time community metrics from Precast API and NPM.
 */
export function CommunitySection() {
  const { metrics: precastMetrics, loading: precastLoading, error: precastError } = usePrecastAPI();
  const { stats: npmStats, downloadHistory } = useNpmStats();
  const [selectedDays, setSelectedDays] = useState<7 | 14 | 30>(7);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [isProgressBarHovered, setIsProgressBarHovered] = useState(false);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Calculate world domination percentage based on total downloads
  const worldDominationProgress = useMemo(() => {
    // Use monthly downloads as our current progress metric
    const currentDownloads = npmStats.downloads.lastMonth;
    const percentage = Math.min(
      (currentDownloads / COMMUNITY_GOALS.WORLD_DOMINATION_TARGET) * 100,
      100
    );

    return {
      percentage: percentage.toFixed(1),
      current: currentDownloads,
      target: COMMUNITY_GOALS.WORLD_DOMINATION_TARGET,
      remaining: Math.max(0, COMMUNITY_GOALS.WORLD_DOMINATION_TARGET - currentDownloads),
    };
  }, [npmStats.downloads.lastMonth]);

  // Calculate growth statistics
  const growthStats = useMemo(() => {
    if (!downloadHistory || downloadHistory.length < selectedDays) {
      return { percentage: 0, trend: "neutral" as const, recentAvg: 0, previousAvg: 0 };
    }

    // Get the data for selected time range
    const relevantData = downloadHistory.slice(-selectedDays);
    const midPoint = Math.floor(relevantData.length / 2);

    // Calculate averages for first and second half
    const firstHalf = relevantData.slice(0, midPoint);
    const secondHalf = relevantData.slice(midPoint);

    const firstHalfAvg = firstHalf.reduce((sum, day) => sum + day.downloads, 0) / firstHalf.length;
    const secondHalfAvg =
      secondHalf.reduce((sum, day) => sum + day.downloads, 0) / secondHalf.length;

    // Calculate percentage change (handle division by zero)
    let percentageChange = 0;
    if (firstHalfAvg > 0) {
      percentageChange = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;
    } else if (secondHalfAvg > 0) {
      // If first half was 0 but second half has downloads, show 100% growth
      percentageChange = 100;
    }

    // Cap the percentage at a reasonable maximum for display
    const cappedPercentage = Math.min(Math.abs(percentageChange), 999);

    return {
      percentage: cappedPercentage,
      trend:
        percentageChange > 0
          ? ("up" as const)
          : percentageChange < 0
            ? ("down" as const)
            : ("neutral" as const),
      recentAvg: Math.round(secondHalfAvg),
      previousAvg: Math.round(firstHalfAvg),
    };
  }, [downloadHistory, selectedDays]);

  // Get chart data for selected time range
  const chartData = useMemo(() => {
    if (!downloadHistory || downloadHistory.length === 0) {
      return Array(selectedDays)
        .fill(null)
        .map((_, i) => ({
          day: "",
          downloads: 0,
          height: Math.random() * 50 + 20,
          isToday: i === selectedDays - 1,
        }));
    }

    const data = downloadHistory.slice(-selectedDays);
    const maxDownloads = Math.max(...data.map((d) => d.downloads));

    return data.map((item, i) => ({
      ...item,
      height: (item.downloads / maxDownloads) * 80 + 20, // Scale to 20-100%
      isToday: i === data.length - 1,
    }));
  }, [downloadHistory, selectedDays]);

  return (
    <section className="py-20 px-4 relative" style={{ backgroundColor: "var(--comic-purple)" }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="action-text text-5xl md:text-7xl text-comic-yellow mb-4">
            COMMUNITY POWER
          </h2>
          <p className="font-comic text-xl md:text-2xl text-comic-white">
            Join our growing league of developers!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-8 mb-12"
        >
          <motion.div whileHover={{ scale: 1.05 }} className="relative">
            <div className="relative border-6 border-comic-black rounded-2xl p-6 text-center bg-comic-yellow h-full">
              <div className="absolute -top-3 -right-3 action-text text-sm bg-comic-red text-comic-white px-2 py-1 rounded-full border-2 border-comic-black">
                HOT!
              </div>
              <FaStar className="text-5xl mx-auto mb-3 text-comic-white" />
              <div className="action-text text-4xl mb-2 text-comic-white">
                {precastLoading ? "..." : precastError ? "!" : precastMetrics?.stars || 0}
              </div>
              <div className="font-display text-xl text-comic-white">GITHUB STARS</div>
            </div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="relative">
            <div className="relative border-6 border-comic-black rounded-2xl p-6 text-center bg-comic-red h-full">
              <div className="absolute -top-3 -left-3 action-text text-sm bg-comic-yellow text-comic-black px-2 py-1 rounded-full border-2 border-comic-black">
                LIVE!
              </div>
              <FaDownload className="text-5xl mx-auto mb-3 text-comic-white" />
              <div className="action-text text-4xl mb-2 text-comic-white">
                {npmStats.loading ? "..." : formatNumber(npmStats.downloads.lastMonth)}
              </div>
              <div className="font-display text-xl text-comic-white">MONTHLY DOWNLOADS</div>
            </div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="relative">
            <div className="relative border-6 border-comic-black rounded-2xl p-6 text-center bg-comic-blue h-full">
              <FaUsers className="text-5xl mx-auto mb-3 text-comic-white" />
              <div className="action-text text-4xl mb-2 text-comic-white">
                {precastLoading ? "..." : precastError ? "!" : precastMetrics?.contributors || 0}
              </div>
              <div className="font-display text-xl text-comic-white">CONTRIBUTORS</div>
            </div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="relative">
            <div className="relative border-6 border-comic-black rounded-2xl p-6 text-center bg-comic-green h-full">
              <FaCodeBranch className="text-5xl mx-auto mb-3 text-comic-white" />
              <div className="action-text text-4xl mb-2 text-comic-white">
                {precastLoading ? "..." : precastError ? "!" : precastMetrics?.forks || 0}
              </div>
              <div className="font-display text-xl text-comic-white">FORKS</div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 mb-12"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <div className="comic-panel bg-comic-white p-6">
              <h3 className="action-text text-2xl text-comic-red mb-4">DOWNLOAD POWER</h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="action-text text-2xl text-comic-red">
                    {npmStats.loading ? "..." : formatNumber(npmStats.downloads.lastDay)}
                  </div>
                  <div className="font-comic text-sm text-comic-black">TODAY</div>
                </div>
                <div className="text-center">
                  <div className="action-text text-2xl text-comic-blue">
                    {npmStats.loading ? "..." : formatNumber(npmStats.downloads.lastWeek)}
                  </div>
                  <div className="font-comic text-sm text-comic-black">THIS WEEK</div>
                </div>
                <div className="text-center">
                  <div className="action-text text-2xl text-comic-green">
                    {npmStats.loading ? "..." : npmStats.versions}
                  </div>
                  <div className="font-comic text-sm text-comic-black">VERSIONS</div>
                </div>
              </div>

              <div className="relative">
                {/* Day selector buttons */}
                <div className="flex justify-center gap-2 mb-3">
                  {([7, 14, 30] as const).map((days) => (
                    <button
                      key={days}
                      onClick={() => setSelectedDays(days)}
                      className={`px-3 py-1 font-comic text-xs rounded-full border-2 border-comic-black transition-colors ${
                        selectedDays === days
                          ? "bg-comic-red text-comic-white"
                          : "bg-comic-white text-comic-black hover:bg-comic-gray/20"
                      }`}
                    >
                      {days}D
                    </button>
                  ))}
                </div>

                {/* Growth indicator */}
                <div className="text-center font-comic text-sm mb-2 flex items-center justify-center gap-2">
                  {growthStats.trend === "up" ? (
                    <>
                      <FaArrowUp className="text-comic-green" />
                      <span className="text-comic-green font-bold">
                        +{growthStats.percentage.toFixed(1)}%
                      </span>
                      <span className="text-comic-gray">growth in {selectedDays} days</span>
                    </>
                  ) : growthStats.trend === "down" ? (
                    <>
                      <FaArrowDown className="text-comic-red" />
                      <span className="text-comic-red font-bold">
                        -{growthStats.percentage.toFixed(1)}%
                      </span>
                      <span className="text-comic-gray">decrease in {selectedDays} days</span>
                    </>
                  ) : (
                    <span className="text-comic-gray">Stable downloads</span>
                  )}
                </div>

                {/* Bar chart */}
                <div className="flex justify-between items-end h-16 bg-comic-gray/10 rounded p-2 relative">
                  {chartData.map((item, i) => (
                    <div
                      key={i}
                      className="bg-comic-red rounded-t flex-1 mx-0.5 transition-all duration-200 cursor-pointer relative"
                      style={{
                        height: `${item.height}%`,
                        backgroundColor: item.isToday ? "var(--comic-red)" : "var(--comic-blue)",
                        opacity: hoveredBar === i ? 1 : hoveredBar !== null ? 0.5 : 1,
                      }}
                      onMouseEnter={() => setHoveredBar(i)}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      {/* Tooltip */}
                      {hoveredBar === i && item.downloads > 0 && (
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-comic-black text-comic-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                          <div className="font-bold">{item.day}</div>
                          <div>{formatNumber(item.downloads)} downloads</div>
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-comic-black"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-comic-gray mt-1">
                  <span>{selectedDays}d ago</span>
                  <span>Today</span>
                </div>
              </div>
            </div>

            <div className="comic-panel bg-comic-white p-6">
              <h3 className="action-text text-2xl text-comic-purple mb-4">HERO IMPACT</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-comic text-comic-black">Package Size</span>
                  <span className="action-text text-comic-green">{npmStats.unpacked}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-comic text-comic-black">Developer Time Saved</span>
                  <span className="action-text text-comic-red">∞ Hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-comic text-comic-black">Coffee Cups Prevented</span>
                  <span className="action-text text-comic-yellow">☕ 1000+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-comic text-comic-black">Bugs Prevented</span>
                  <span className="action-text text-comic-blue">🐛 Many!</span>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between text-sm font-comic text-comic-black mb-1">
                    <span>World Domination</span>
                    <span>{worldDominationProgress.percentage}%</span>
                  </div>
                  <div
                    className="relative w-full bg-comic-gray/20 rounded-full h-4 border-2 border-comic-black cursor-pointer"
                    onMouseEnter={() => setIsProgressBarHovered(true)}
                    onMouseLeave={() => setIsProgressBarHovered(false)}
                  >
                    <motion.div
                      className="bg-comic-red h-full rounded-full relative overflow-hidden"
                      initial={{ width: 0 }}
                      animate={{ width: `${worldDominationProgress.percentage}%` }}
                      transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                    >
                      {/* Animated shine effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{
                          x: ["-100%", "200%"],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatDelay: 3,
                        }}
                      />
                    </motion.div>

                    {/* Tooltip on hover */}
                    {isProgressBarHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute -top-24 left-1/2 transform -translate-x-1/2 bg-comic-white border-3 border-comic-black rounded-lg px-3 py-2 z-10"
                        style={{ boxShadow: "3px 3px 0 rgba(0,0,0,0.3)" }}
                      >
                        <div className="action-text text-sm text-comic-red mb-1">
                          WORLD DOMINATION!
                        </div>
                        <div className="font-comic text-xs text-comic-black space-y-1">
                          <div className="flex justify-between gap-4">
                            <span className="text-comic-gray">Progress:</span>
                            <span className="font-bold text-comic-blue">
                              {formatNumber(worldDominationProgress.current)}
                            </span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-comic-gray">Target:</span>
                            <span className="font-bold text-comic-green">
                              {formatNumber(worldDominationProgress.target)}
                            </span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-comic-gray">To Go:</span>
                            <span className="font-bold text-comic-red">
                              {formatNumber(worldDominationProgress.remaining)}
                            </span>
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                          <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-comic-black"></div>
                          <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-transparent border-t-comic-white absolute -top-[6px] -left-[5px]"></div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="text-center">
          <motion.a
            href={EXTERNAL_LINKS.GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-comic bg-comic-yellow text-comic-black hover:bg-comic-white inline-flex items-center gap-3"
          >
            <FaGithub className="text-2xl" />
            STAR US ON GITHUB
          </motion.a>
        </div>
      </div>
    </section>
  );
}
