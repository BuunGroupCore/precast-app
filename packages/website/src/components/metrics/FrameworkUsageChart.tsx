import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { FaReact, FaVuejs, FaAngular, FaClock } from "react-icons/fa";
import { SiNextdotjs, SiNuxtdotjs, SiSvelte, SiRemix, SiAstro } from "react-icons/si";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import type { AnalyticsMetrics } from "../../hooks/usePrecastAPI";

interface FrameworkUsageChartProps {
  analytics: AnalyticsMetrics;
}

// Comic book color palette
const FRAMEWORK_COLORS = {
  react: "#FF6B6B", // comic-red
  vue: "#4ECDC4", // comic-green
  angular: "#45B7D1", // comic-blue
  next: "#96CEB4", // comic-purple
  nuxt: "#FFEAA7", // comic-yellow
  svelte: "#DDA0DD", // comic-purple variant
  solid: "#FF7675", // comic-red variant
  remix: "#74B9FF", // comic-blue variant
  astro: "#FD79A8", // comic-pink
  vite: "#A29BFE", // comic-purple variant
} as const;

const FRAMEWORK_ICONS = {
  react: FaReact,
  vue: FaVuejs,
  angular: FaAngular,
  next: SiNextdotjs,
  nuxt: SiNuxtdotjs,
  svelte: SiSvelte,
  remix: SiRemix,
  astro: SiAstro,
} as const;

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      percentage: number;
    };
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    const percentage = payload[0]?.payload?.percentage || 0;
    return (
      <div className="comic-panel bg-comic-black text-comic-white p-3 border-2 border-comic-yellow">
        <p className="action-text text-comic-yellow">
          {label ? label.toUpperCase() : "FRAMEWORK"}!
        </p>
        <p className="font-comic text-comic-white">Projects: {payload[0]?.value || 0}</p>
        <p className="font-comic text-comic-green text-sm">{percentage}% of total</p>
      </div>
    );
  }
  return null;
};

type TimePeriod = "7d" | "30d" | "all";

export function FrameworkUsageChart({ analytics }: FrameworkUsageChartProps) {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("7d");

  // Filter data based on time period
  const filteredData = useMemo(() => {
    if (!analytics.events?.timeline || analytics.events.timeline.length === 0) {
      return analytics.frameworks.topFrameworks;
    }

    // For now, return the same data as we don't have per-event framework data
    // In the future, this could filter based on event timestamps
    // const now = Date.now();
    // const dayInMs = 24 * 60 * 60 * 1000;

    // switch (timePeriod) {
    //   case "7d":
    //     cutoffDate = now - 7 * dayInMs;
    //     break;
    //   case "30d":
    //     cutoffDate = now - 30 * dayInMs;
    //     break;
    //   case "all":
    //   default:
    //     return analytics.frameworks.topFrameworks;
    // }

    return analytics.frameworks.topFrameworks;
  }, [analytics]);

  const frameworkData = filteredData.map((framework) => ({
    name: framework.name,
    value: framework.count,
    percentage: framework.percentage,
    color: FRAMEWORK_COLORS[framework.name as keyof typeof FRAMEWORK_COLORS] || "#FF6B6B",
  }));

  const barData = frameworkData.map((item) => ({
    name: item.name.charAt(0).toUpperCase() + item.name.slice(1),
    value: item.value,
    percentage: item.percentage,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.2 }}
      className="comic-panel p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-2xl text-comic-purple flex items-center gap-2">
          <FaReact /> FRAMEWORK USAGE
        </h3>
        <div className="flex items-center gap-2">
          <FaClock className="text-comic-purple" />
          <button
            onClick={() => setTimePeriod("7d")}
            className={`px-3 py-1 rounded font-comic text-sm transition-all ${
              timePeriod === "7d"
                ? "bg-comic-purple text-white"
                : "bg-comic-purple bg-opacity-10 text-comic-purple hover:bg-opacity-20"
            }`}
          >
            7 days
          </button>
          <button
            onClick={() => setTimePeriod("30d")}
            className={`px-3 py-1 rounded font-comic text-sm transition-all ${
              timePeriod === "30d"
                ? "bg-comic-purple text-white"
                : "bg-comic-purple bg-opacity-10 text-comic-purple hover:bg-opacity-20"
            }`}
          >
            30 days
          </button>
          <button
            onClick={() => setTimePeriod("all")}
            className={`px-3 py-1 rounded font-comic text-sm transition-all ${
              timePeriod === "all"
                ? "bg-comic-purple text-white"
                : "bg-comic-purple bg-opacity-10 text-comic-purple hover:bg-opacity-20"
            }`}
          >
            All time
          </button>
        </div>
      </div>

      {/* Bar Chart */}
      {barData.length > 0 ? (
        <div className="mb-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#000" opacity={0.1} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fontFamily: "Comic Sans MS, cursive", fill: "#000" }}
              />
              <YAxis tick={{ fontSize: 12, fontFamily: "Comic Sans MS, cursive", fill: "#000" }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="value"
                fill="#8B5CF6"
                radius={[4, 4, 0, 0]}
                stroke="#000"
                strokeWidth={1}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[300px] flex items-center justify-center">
          <span className="font-comic text-comic-black">No framework data yet!</span>
        </div>
      )}

      {/* Framework List */}
      <div className="space-y-3">
        {filteredData.slice(0, 5).map((framework, index) => {
          const Icon = FRAMEWORK_ICONS[framework.name as keyof typeof FRAMEWORK_ICONS];

          return (
            <motion.div
              key={framework.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.3 + index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg bg-comic-purple bg-opacity-10"
            >
              <div className="flex items-center gap-3">
                {Icon && <Icon className="text-xl text-comic-purple" />}
                <span className="font-comic font-bold text-comic-purple capitalize">
                  {framework.name}
                </span>
              </div>
              <div className="text-right">
                <div className="action-text text-xl text-comic-red">{framework.count}</div>
                <div className="font-comic text-sm text-comic-black">{framework.percentage}%</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
