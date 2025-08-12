import { motion } from "framer-motion";
import { FaRocket, FaUsers, FaCalendarWeek, FaCalendar, FaCode, FaChartLine } from "react-icons/fa";

import type { AnalyticsMetrics } from "../../hooks/usePrecastAPI";

interface AnalyticsOverviewProps {
  analytics: AnalyticsMetrics;
  formatNumber: (num: number) => string;
  getTimeElapsed: (timestamp: string) => string;
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  change,
  color,
  delay,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  change?: string;
  color: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-300 hover:shadow-lg"
  >
    <div className="flex items-center justify-between mb-2">
      <div className={`p-3 rounded-lg bg-${color}-50 dark:bg-${color}-900/20`}>
        <Icon className={`text-${color}-600 dark:text-${color}-400 text-xl`} />
      </div>
      {change && (
        <span className="text-green-600 dark:text-green-400 text-sm font-medium">{change}</span>
      )}
    </div>
    <div className="space-y-1">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{label}</p>
    </div>
  </motion.div>
);

export function AnalyticsOverview({
  analytics,
  formatNumber,
  getTimeElapsed,
}: AnalyticsOverviewProps) {
  const stats = [
    {
      icon: FaRocket,
      label: "Total Projects Created",
      value: formatNumber(analytics.usage.totalEvents),
      color: "blue",
      delay: 0.1,
    },
    {
      icon: FaUsers,
      label: "Unique Users",
      value: formatNumber(analytics.usage.uniqueUsers),
      color: "green",
      delay: 0.2,
    },
    {
      icon: FaCalendarWeek,
      label: "Projects This Week",
      value: formatNumber(analytics.usage.eventsLast7Days),
      color: "purple",
      delay: 0.3,
    },
    {
      icon: FaCalendar,
      label: "Projects This Month",
      value: formatNumber(analytics.usage.eventsLast30Days),
      color: "orange",
      delay: 0.4,
    },
    {
      icon: FaCode,
      label: "Active Developers (30d)",
      value: formatNumber(analytics.usage.activeUsersLast30Days),
      color: "indigo",
      delay: 0.5,
    },
    {
      icon: FaChartLine,
      label: "Active Developers (7d)",
      value: formatNumber(analytics.usage.activeUsersLast7Days),
      color: "pink",
      delay: 0.6,
    },
  ];

  return (
    <section className="mb-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Analytics Overview
        </h2>
        <p className="text-gray-600 dark:text-gray-400">Real-time insights from CLI usage data</p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          Last updated: {getTimeElapsed(analytics.lastUpdated)}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-blue-100 dark:border-gray-600"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          📊 Quick Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-gray-700 dark:text-gray-300">
            <strong>Most Popular Framework:</strong>{" "}
            {analytics.frameworks.topFrameworks[0]?.name || "N/A"} (
            {analytics.frameworks.topFrameworks[0]?.percentage || 0}%)
          </div>
          <div className="text-gray-700 dark:text-gray-300">
            <strong>Top Event:</strong> {analytics.events.topEvents[0]?.event || "N/A"} (
            {analytics.events.topEvents[0]?.count || 0} times)
          </div>
          <div className="text-gray-700 dark:text-gray-300">
            <strong>Weekly Growth:</strong>{" "}
            {analytics.usage.eventsLast7Days > 0
              ? `${Math.round(
                  (analytics.usage.eventsLast7Days /
                    (analytics.usage.eventsLast30Days - analytics.usage.eventsLast7Days || 1)) *
                    100
                )}%`
              : "0%"}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
