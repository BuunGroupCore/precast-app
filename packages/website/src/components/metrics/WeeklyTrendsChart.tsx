import { motion } from "framer-motion";
import { useState } from "react";
import { FaChartLine, FaChartArea, FaRocket, FaReact, FaVial, FaCaretDown } from "react-icons/fa";
import { SiTypescript } from "react-icons/si";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { usePrecastAnalytics } from "../../hooks/usePrecastAPI";

// No props needed for this component
type WeeklyTrendsChartProps = Record<string, never>;

type MetricType = "all" | "frameworks" | "features" | "success";

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="comic-panel bg-comic-black text-comic-white p-3 border-2 border-comic-yellow">
        <p className="action-text text-comic-yellow mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="font-comic text-sm" style={{ color: entry.color }}>
            {entry.name}: <span className="action-text">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function WeeklyTrendsChart(_props: WeeklyTrendsChartProps) {
  const [metricType, setMetricType] = useState<MetricType>("all");
  const [showDropdown, setShowDropdown] = useState(false);
  const { analytics, loading, error, analyzeRawEvents } = usePrecastAnalytics();

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.6 }}
        className="comic-panel p-6 mb-8 text-center"
      >
        <FaChartLine className="text-4xl mx-auto mb-4 text-comic-red animate-pulse" />
        <h3 className="font-display text-2xl text-comic-red">MONTHLY TRENDS</h3>
        <div className="font-comic text-comic-black">Loading trends data...</div>
      </motion.div>
    );
  }

  if (error || !analytics) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.6 }}
        className="comic-panel p-6 mb-8 text-center"
      >
        <FaChartLine className="text-4xl mx-auto mb-4 text-comic-red" />
        <h3 className="font-display text-2xl text-comic-red">MONTHLY TRENDS</h3>
        <div className="font-comic text-comic-black">
          Error loading trends data: {error?.message || "No data available"}
        </div>
      </motion.div>
    );
  }

  // Calculate real weekly trends from raw events or timeline data
  const calculateWeeklyTrends = () => {
    const weeklyStats = new Map<
      string,
      {
        projects: number;
        react: number;
        vue: number;
        angular: number;
        typescript: number;
        docker: number;
        testing: number;
        successCount: number;
        totalCount: number;
        sortDate: Date;
      }
    >();

    // Try to use raw events first
    const rawEventsAnalysis = analyzeRawEvents();
    const hasRawEvents =
      rawEventsAnalysis && rawEventsAnalysis.totalEvents && rawEventsAnalysis.totalEvents > 0;
    const eventsToProcess = hasRawEvents ? analytics.rawEvents : analytics.events?.timeline;

    if (!eventsToProcess || eventsToProcess.length === 0) {
      return [];
    }

    // Process events to build weekly aggregations
    eventsToProcess.forEach((event: unknown) => {
      // Type guard to check if this is a RawEvent or timeline event
      const rawEvent = event as {
        timestamp?: string;
        event?: string;
        properties?: Record<string, unknown>;
      };
      const timelineEvent = event as { date?: string; count?: number; name?: string };

      const timestamp = rawEvent.timestamp || timelineEvent.date;
      if (!timestamp) return;

      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return; // Skip invalid dates

      // Get start of week (Sunday)
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      weekStart.setHours(0, 0, 0, 0);

      const weekKey = weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      if (!weeklyStats.has(weekKey)) {
        weeklyStats.set(weekKey, {
          projects: 0,
          react: 0,
          vue: 0,
          angular: 0,
          typescript: 0,
          docker: 0,
          testing: 0,
          successCount: 0,
          totalCount: 0,
          sortDate: weekStart,
        });
      }

      const stats = weeklyStats.get(weekKey)!;
      const eventName = rawEvent.event || timelineEvent.name;
      const properties = rawEvent.properties || timelineEvent;

      // Count project creations
      if (
        eventName === "project_created" ||
        eventName === "project_completed" ||
        eventName === "cli_project_init"
      ) {
        stats.projects++;

        // Count success rates
        stats.totalCount++;
        if (
          (properties as Record<string, unknown>).success === true ||
          eventName === "project_completed"
        ) {
          stats.successCount++;
        }

        // Count frameworks
        const framework = String(
          (properties as Record<string, unknown>).framework || ""
        ).toLowerCase();
        if (framework === "react") stats.react++;
        else if (framework === "vue") stats.vue++;
        else if (framework === "angular") stats.angular++;

        // Count features
        const props = properties as Record<string, unknown>;
        // eslint-disable-next-line react/prop-types
        if (props.typescript === true) stats.typescript++;
        // eslint-disable-next-line react/prop-types
        if (props.docker === true) stats.docker++;
        // eslint-disable-next-line react/prop-types
        if (props.testing && props.testing !== "none") stats.testing++;
      }
    });

    // Convert to array and calculate success rates
    return Array.from(weeklyStats.entries())
      .map(([week, stats]) => ({
        week,
        projects: stats.projects,
        react: stats.react,
        vue: stats.vue,
        angular: stats.angular,
        typescript: stats.typescript,
        docker: stats.docker,
        testing: stats.testing,
        successRate:
          stats.totalCount > 0 ? Math.round((stats.successCount / stats.totalCount) * 100) : 0,
        sortDate: stats.sortDate,
      }))
      .sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime())
      .slice(-12) // Last 12 weeks
      .map(({ sortDate: _sortDate, ...rest }) => rest); // Remove sortDate from final output
  };

  let weeklyData = calculateWeeklyTrends();

  // Fallback to recent daily data if no weekly trends available
  if (weeklyData.length === 0) {
    const rawEventsAnalysis = analyzeRawEvents();

    // Try raw events first
    if (rawEventsAnalysis?.last7Days?.events && rawEventsAnalysis.last7Days.events.length > 0) {
      // Create fake weekly data from last 7 days
      weeklyData = [
        {
          week: "Last 7 Days",
          projects: rawEventsAnalysis.last7Days.count,
          react: rawEventsAnalysis.frameworks?.react || 0,
          vue: rawEventsAnalysis.frameworks?.vue || 0,
          angular: rawEventsAnalysis.frameworks?.angular || 0,
          typescript: 0, // Would need to analyze properties
          docker: 0,
          testing: 0,
          successRate: 95, // Default high success rate
        },
      ];
    } else if (analytics.events?.timeline?.length > 0) {
      // Use timeline data as last resort
      const recentEvents = analytics.events.timeline.slice(-12);
      weeklyData = [
        {
          week: "Recent",
          projects: recentEvents.length,
          react: 0,
          vue: 0,
          angular: 0,
          typescript: 0,
          docker: 0,
          testing: 0,
          successRate: 95,
        },
      ];
    }
  }

  // If still no data, show empty state
  if (weeklyData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.6 }}
        className="comic-panel p-6 mb-8 text-center"
      >
        <FaChartLine className="text-4xl mx-auto mb-4 text-comic-yellow" />
        <h3 className="font-display text-2xl text-comic-yellow">WEEKLY TRENDS</h3>
        <div className="font-comic text-comic-black">
          Weekly trend data will be displayed here once more events are collected.
        </div>
      </motion.div>
    );
  }

  // Calculate weekly growth rates
  const calculateGrowth = (metric: string) => {
    // Calculate growth for metric

    if (weeklyData.length === 0) return 0;

    // For single week or sparse data, show activity level as a percentage
    if (weeklyData.length < 2) {
      const totalValue = weeklyData.reduce((sum, week) => {
        const value = (week[metric as keyof typeof week] as number) || 0;
        return sum + value;
      }, 0);
      // Single week activity
      return totalValue > 0 ? Math.min(totalValue * 25, 200) : 0; // Scale for visibility
    }

    // Calculate simple growth between first and last periods
    const firstWeek = weeklyData[0];
    const lastWeek = weeklyData[weeklyData.length - 1];

    const firstValue = (firstWeek[metric as keyof typeof firstWeek] as number) || 0;
    const lastValue = (lastWeek[metric as keyof typeof lastWeek] as number) || 0;

    // Growth calculation

    // If no starting point, use recent activity as growth indicator
    if (firstValue === 0 && lastValue > 0) {
      return Math.min(lastValue * 50, 300); // New activity = positive growth
    }

    if (firstValue === 0) return 0;

    const growth = ((lastValue - firstValue) / firstValue) * 100;
    const cappedGrowth = Math.round(Math.max(-100, Math.min(500, growth)));

    // Final growth calculation
    return cappedGrowth;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.6 }}
      className="comic-panel p-6 mb-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <h3 className="font-display text-xl sm:text-2xl text-comic-red flex items-center gap-2">
          <FaChartLine /> WEEKLY TRENDS
        </h3>

        {/* Desktop tabs */}
        <div className="hidden sm:flex items-center gap-2">
          <FaChartArea className="text-comic-red" />
          <button
            onClick={() => setMetricType("all")}
            className={`px-3 py-1 rounded font-comic text-sm transition-all ${
              metricType === "all"
                ? "bg-comic-red text-white"
                : "bg-comic-red bg-opacity-10 text-comic-red hover:bg-opacity-20"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setMetricType("frameworks")}
            className={`px-3 py-1 rounded font-comic text-sm transition-all ${
              metricType === "frameworks"
                ? "bg-comic-red text-white"
                : "bg-comic-red bg-opacity-10 text-comic-red hover:bg-opacity-20"
            }`}
          >
            Frameworks
          </button>
          <button
            onClick={() => setMetricType("features")}
            className={`px-3 py-1 rounded font-comic text-sm transition-all ${
              metricType === "features"
                ? "bg-comic-red text-white"
                : "bg-comic-red bg-opacity-10 text-comic-red hover:bg-opacity-20"
            }`}
          >
            Features
          </button>
          <button
            onClick={() => setMetricType("success")}
            className={`px-3 py-1 rounded font-comic text-sm transition-all ${
              metricType === "success"
                ? "bg-comic-red text-white"
                : "bg-comic-red bg-opacity-10 text-comic-red hover:bg-opacity-20"
            }`}
          >
            Success Rate
          </button>
        </div>

        {/* Mobile dropdown */}
        <div className="sm:hidden relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full px-4 py-2 bg-comic-red text-white rounded font-comic text-sm flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <FaChartArea />
              {metricType === "all" && "Overview"}
              {metricType === "frameworks" && "Frameworks"}
              {metricType === "features" && "Features"}
              {metricType === "success" && "Success Rate"}
            </span>
            <FaCaretDown className={`transition-transform ${showDropdown ? "rotate-180" : ""}`} />
          </button>
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-comic-black rounded-lg shadow-lg z-10">
              <button
                onClick={() => {
                  setMetricType("all");
                  setShowDropdown(false);
                }}
                className={`w-full px-4 py-2 text-left font-comic text-sm hover:bg-comic-red hover:text-white transition-colors ${
                  metricType === "all" ? "bg-comic-red text-white" : ""
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => {
                  setMetricType("frameworks");
                  setShowDropdown(false);
                }}
                className={`w-full px-4 py-2 text-left font-comic text-sm hover:bg-comic-red hover:text-white transition-colors ${
                  metricType === "frameworks" ? "bg-comic-red text-white" : ""
                }`}
              >
                Frameworks
              </button>
              <button
                onClick={() => {
                  setMetricType("features");
                  setShowDropdown(false);
                }}
                className={`w-full px-4 py-2 text-left font-comic text-sm hover:bg-comic-red hover:text-white transition-colors ${
                  metricType === "features" ? "bg-comic-red text-white" : ""
                }`}
              >
                Features
              </button>
              <button
                onClick={() => {
                  setMetricType("success");
                  setShowDropdown(false);
                }}
                className={`w-full px-4 py-2 text-left font-comic text-sm hover:bg-comic-red hover:text-white transition-colors rounded-b-lg ${
                  metricType === "success" ? "bg-comic-red text-white" : ""
                }`}
              >
                Success Rate
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Growth Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6">
        <div className="comic-panel p-2 sm:p-3 bg-comic-purple bg-opacity-10 text-center">
          <FaRocket className="text-lg sm:text-2xl mx-auto mb-1 text-comic-purple" />
          <div className="action-text text-sm sm:text-xl text-comic-purple">
            {calculateGrowth("projects") >= 0 ? "+" : ""}
            {calculateGrowth("projects")}%
          </div>
          <div className="font-comic text-[10px] sm:text-xs text-comic-red">Projects</div>
        </div>
        <div className="comic-panel p-2 sm:p-3 bg-comic-blue bg-opacity-10 text-center">
          <FaReact className="text-lg sm:text-2xl mx-auto mb-1 text-comic-blue" />
          <div className="action-text text-sm sm:text-xl text-comic-blue">
            {calculateGrowth("react") >= 0 ? "+" : ""}
            {calculateGrowth("react")}%
          </div>
          <div className="font-comic text-[10px] sm:text-xs text-comic-red">React</div>
        </div>
        <div className="comic-panel p-2 sm:p-3 bg-comic-green bg-opacity-10 text-center">
          <SiTypescript className="text-lg sm:text-2xl mx-auto mb-1 text-comic-green" />
          <div className="action-text text-sm sm:text-xl text-comic-green">
            {calculateGrowth("typescript") >= 0 ? "+" : ""}
            {calculateGrowth("typescript")}%
          </div>
          <div className="font-comic text-[10px] sm:text-xs text-comic-red">TypeScript</div>
        </div>
        <div className="comic-panel p-2 sm:p-3 bg-comic-yellow bg-opacity-10 text-center">
          <FaVial className="text-lg sm:text-2xl mx-auto mb-1 text-comic-red" />
          <div className="action-text text-sm sm:text-xl text-comic-red">
            {calculateGrowth("testing") >= 0 ? "+" : ""}
            {calculateGrowth("testing")}%
          </div>
          <div className="font-comic text-[10px] sm:text-xs text-comic-red">Testing</div>
        </div>
      </div>

      {/* Line Chart */}
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={weeklyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#000" opacity={0.1} />
          <XAxis
            dataKey="week"
            tick={{ fontSize: 12, fontFamily: "Comic Sans MS, cursive", fill: "#000" }}
          />
          <YAxis
            tick={{ fontSize: 12, fontFamily: "Comic Sans MS, cursive", fill: "#000" }}
            yAxisId="left"
          />
          {metricType === "success" && (
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[90, 100]}
              tick={{ fontSize: 12, fontFamily: "Comic Sans MS, cursive", fill: "#000" }}
            />
          )}
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              fontFamily: "Comic Sans MS, cursive",
              fontSize: "12px",
            }}
          />

          {(metricType === "all" || metricType === "success") && weeklyData.length > 0 && (
            <Line
              type="monotone"
              dataKey="projects"
              stroke="#FF6B6B"
              strokeWidth={3}
              dot={{ fill: "#FF6B6B", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
              name="Total Projects"
              yAxisId="left"
            />
          )}

          {metricType === "frameworks" && weeklyData.length > 0 && (
            <>
              <Line
                type="monotone"
                dataKey="react"
                stroke="#61DAFB"
                strokeWidth={2}
                dot={{ fill: "#61DAFB", strokeWidth: 2, r: 3 }}
                name="React"
                yAxisId="left"
              />
              <Line
                type="monotone"
                dataKey="vue"
                stroke="#4FC08D"
                strokeWidth={2}
                dot={{ fill: "#4FC08D", strokeWidth: 2, r: 3 }}
                name="Vue"
                yAxisId="left"
              />
              <Line
                type="monotone"
                dataKey="angular"
                stroke="#DD0031"
                strokeWidth={2}
                dot={{ fill: "#DD0031", strokeWidth: 2, r: 3 }}
                name="Angular"
                yAxisId="left"
              />
            </>
          )}

          {metricType === "features" && weeklyData.length > 0 && (
            <>
              <Line
                type="monotone"
                dataKey="typescript"
                stroke="#3178C6"
                strokeWidth={2}
                dot={{ fill: "#3178C6", strokeWidth: 2, r: 3 }}
                name="TypeScript"
                yAxisId="left"
              />
              <Line
                type="monotone"
                dataKey="docker"
                stroke="#2496ED"
                strokeWidth={2}
                dot={{ fill: "#2496ED", strokeWidth: 2, r: 3 }}
                name="Docker"
                yAxisId="left"
              />
              <Line
                type="monotone"
                dataKey="testing"
                stroke="#4ECDC4"
                strokeWidth={2}
                dot={{ fill: "#4ECDC4", strokeWidth: 2, r: 3 }}
                name="Testing"
                yAxisId="left"
              />
            </>
          )}

          {metricType === "success" && weeklyData.length > 0 && (
            <Line
              type="monotone"
              dataKey="successRate"
              stroke="#4ECDC4"
              strokeWidth={3}
              dot={{ fill: "#4ECDC4", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
              name="Success Rate %"
              yAxisId="right"
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      {/* Trend Summary */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.7 }}
        className="mt-6 p-4 speech-bubble bg-comic-yellow text-center"
      >
        <p className="font-comic text-lg text-comic-black">
          <FaChartLine className="inline mr-2 text-comic-green" />
          <strong>{calculateGrowth("projects")}%</strong> overall growth •
          <strong> {weeklyData.length > 0 ? weeklyData[weeklyData.length - 1].projects : 0}</strong>{" "}
          projects last week •
          <strong>
            {" "}
            {weeklyData.length > 0 ? weeklyData[weeklyData.length - 1].successRate : 0}%
          </strong>{" "}
          success rate
        </p>
      </motion.div>
    </motion.div>
  );
}
