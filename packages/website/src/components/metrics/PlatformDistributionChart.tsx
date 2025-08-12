import { motion } from "framer-motion";
import { FaWindows, FaApple, FaLinux, FaDesktop } from "react-icons/fa";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

import { usePrecastAnalytics } from "../../hooks/usePrecastAPI";

interface PlatformDistributionChartProps {}

// Platform colors matching comic book theme
const PLATFORM_COLORS = {
  macOS: "#FF6B6B", // comic-red
  Windows: "#45B7D1", // comic-blue
  Linux: "#4ECDC4", // comic-green
  FreeBSD: "#96CEB4", // comic-purple variant
  Other: "#FFEAA7", // comic-yellow
} as const;

const PLATFORM_ICONS = {
  macOS: FaApple,
  Windows: FaWindows,
  Linux: FaLinux,
  FreeBSD: FaDesktop,
  Other: FaDesktop,
} as const;

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      percentage: number;
    };
  }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const Icon = PLATFORM_ICONS[data.name as keyof typeof PLATFORM_ICONS] || FaDesktop;

    return (
      <div className="comic-panel bg-comic-black text-comic-white p-3 border-2 border-comic-yellow">
        <div className="flex items-center gap-2 mb-1">
          <Icon className="text-comic-yellow" />
          <p className="action-text text-comic-yellow">{data.name}</p>
        </div>
        <p className="font-comic text-comic-white">
          Users: <span className="action-text">{data.value}</span>
        </p>
        <p className="font-comic text-comic-green text-sm">{data.payload.percentage}% of total</p>
      </div>
    );
  }
  return null;
};

interface LabelProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
}

const renderCustomizedLabel = ({
  cx = 0,
  cy = 0,
  midAngle = 0,
  innerRadius = 0,
  outerRadius = 0,
  percent = 0,
}: LabelProps) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null; // Don't show label for small slices

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="font-comic font-bold text-sm"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function PlatformDistributionChart(_props: PlatformDistributionChartProps) {
  const { analytics, loading, error } = usePrecastAnalytics();

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.4 }}
        className="comic-panel p-6 mb-8 text-center"
      >
        <FaDesktop className="text-4xl mx-auto mb-4 text-comic-purple animate-pulse" />
        <h3 className="font-display text-2xl text-comic-purple">PLATFORM DISTRIBUTION</h3>
        <div className="font-comic text-comic-black">Loading platform data...</div>
      </motion.div>
    );
  }

  if (error || !analytics) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.4 }}
        className="comic-panel p-6 mb-8 text-center"
      >
        <FaDesktop className="text-4xl mx-auto mb-4 text-comic-red" />
        <h3 className="font-display text-2xl text-comic-red">PLATFORM DISTRIBUTION</h3>
        <div className="font-comic text-comic-black">
          Error loading platform data: {error?.message || "No data available"}
        </div>
      </motion.div>
    );
  }

  // Get platform data from real analytics timeline (raw events with platform properties)
  const platformCounts =
    analytics.events?.timeline?.reduce(
      (acc: Record<string, number>, event: Record<string, unknown>) => {
        let platform = String(
          event.platform_display || event.platform_type || event.platform || "Unknown"
        );

        // Normalize platform names to avoid duplicates
        platform = platform.toLowerCase();
        if (platform === "darwin") platform = "macOS";
        else if (platform === "win32") platform = "Windows";
        else if (platform === "linux") platform = "Linux";
        else if (platform.includes("windows")) platform = "Windows";
        else if (platform.includes("mac") || platform.includes("darwin")) platform = "macOS";
        else platform = platform.charAt(0).toUpperCase() + platform.slice(1);

        acc[platform] = (acc[platform] || 0) + 1;
        return acc;
      },
      {}
    ) || {};

  const totalEvents = Object.values(platformCounts).reduce(
    (sum, count) => sum + (count as number),
    0
  );

  const platformData = Object.entries(platformCounts)
    .map(([name, value]) => ({
      name,
      value: value as number,
      percentage: totalEvents > 0 ? Math.round(((value as number) / totalEvents) * 100) : 0,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5 platforms

  // Fallback if no data
  if (platformData.length === 0) {
    platformData.push({ name: "No data", value: 0, percentage: 0 });
  }

  const totalUsers = platformData.reduce((sum, item) => sum + item.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.4 }}
      className="comic-panel p-6 mb-8"
    >
      <h3 className="font-display text-2xl mb-4 text-comic-purple flex items-center gap-2">
        <FaDesktop /> PLATFORM DISTRIBUTION
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={platformData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {platformData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      PLATFORM_COLORS[entry.name as keyof typeof PLATFORM_COLORS] ||
                      PLATFORM_COLORS.Other
                    }
                    stroke="#374151"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Platform List */}
        <div>
          <div className="space-y-3">
            {platformData.map((platform) => {
              const Icon =
                PLATFORM_ICONS[platform.name as keyof typeof PLATFORM_ICONS] || FaDesktop;
              const color =
                PLATFORM_COLORS[platform.name as keyof typeof PLATFORM_COLORS] ||
                PLATFORM_COLORS.Other;

              return (
                <motion.div
                  key={platform.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ backgroundColor: `${color}20` }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full border-2 border-comic-black"
                      style={{ backgroundColor: color }}
                    />
                    <Icon className="text-xl" style={{ color }} />
                    <span className="font-comic font-bold text-comic-red">{platform.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="action-text text-xl text-comic-red">{platform.value}</div>
                    <div className="font-comic text-sm text-comic-red">{platform.percentage}%</div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Total Users */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.5 }}
            className="mt-4 p-4 comic-panel bg-comic-yellow text-center"
          >
            <div className="action-text text-3xl text-comic-red">{totalUsers.toLocaleString()}</div>
            <div className="font-display text-lg text-comic-red">TOTAL USERS</div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
