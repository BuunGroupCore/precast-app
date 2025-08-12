import { motion } from "framer-motion";
import {
  SiTypescript,
  SiDocker,
  SiGit,
  SiEslint,
  SiPrettier,
  SiJest,
  SiGithubactions,
} from "react-icons/si";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

import type { AnalyticsMetrics } from "../../hooks/usePrecastAPI";

interface DeveloperExperienceChartProps {
  analytics: AnalyticsMetrics;
}

const DX_METRICS = [
  {
    key: "typeScriptAdoption",
    label: "TypeScript",
    icon: SiTypescript,
    color: "#3178C6",
    description: "Projects using TypeScript",
  },
  {
    key: "dockerUsage",
    label: "Docker",
    icon: SiDocker,
    color: "#2496ED",
    description: "Projects with Docker setup",
  },
  {
    key: "gitInitRate",
    label: "Git",
    icon: SiGit,
    color: "#F05032",
    description: "Projects initialized with Git",
  },
  {
    key: "eslintEnabled",
    label: "ESLint",
    icon: SiEslint,
    color: "#4B32C3",
    description: "Projects with ESLint configuration",
  },
  {
    key: "prettierEnabled",
    label: "Prettier",
    icon: SiPrettier,
    color: "#F7B93E",
    description: "Projects with Prettier setup",
  },
  {
    key: "testingSetup",
    label: "Testing",
    icon: SiJest,
    color: "#C21325",
    description: "Projects with testing framework",
  },
  {
    key: "cicdConfigured",
    label: "CI/CD",
    icon: SiGithubactions,
    color: "#2088FF",
    description: "Projects with CI/CD pipelines",
  },
] as const;

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      color: string;
    };
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    const metric = DX_METRICS.find((m) => m.label === label);
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="font-medium text-gray-900 dark:text-white mb-1">{label}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{metric?.description}</p>
        <p className="text-lg font-semibold" style={{ color: payload[0].payload.color }}>
          {payload[0].value}% adoption
        </p>
      </div>
    );
  }
  return null;
};

export function DeveloperExperienceChart({ analytics }: DeveloperExperienceChartProps) {
  const dxData = analytics.developerExperience;

  if (!dxData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5 }}
        className="comic-panel p-6 mb-8 text-center"
      >
        <div className="text-4xl mb-4">🛠️</div>
        <h3 className="font-display text-2xl text-comic-red mb-2">DEVELOPER EXPERIENCE</h3>
        <div className="font-comic text-comic-black">
          Developer experience metrics will be displayed here once data is collected.
        </div>
      </motion.div>
    );
  }

  const chartData = DX_METRICS.map((metric) => ({
    name: metric.label,
    value: dxData[metric.key as keyof typeof dxData] || 0,
    color: metric.color,
    icon: metric.icon,
  }));

  const dxScore = Math.round(
    chartData.reduce((sum, item) => sum + item.value, 0) / chartData.length
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.5 }}
      className="comic-panel p-6 mb-8"
    >
      <h3 className="font-display text-2xl mb-4 text-comic-red flex items-center gap-2">
        🛠️ DEVELOPER EXPERIENCE
      </h3>

      {/* DX Score Overview */}
      <div className="comic-panel p-6 mb-6 bg-comic-red text-center">
        <div className="action-text text-4xl text-comic-white mb-2">{dxScore}</div>
        <div className="font-display text-lg text-comic-white">DX SCORE</div>
        <div className="font-comic text-sm text-comic-white mt-1">
          Quality tools & best practices
        </div>
      </div>

      {/* Bar Chart */}
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#000" opacity={0.1} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fontFamily: "Comic Sans MS, cursive", fill: "#000" }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fontSize: 12, fontFamily: "Comic Sans MS, cursive", fill: "#000" }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="value"
              fill="#FF6B6B"
              radius={[4, 4, 0, 0]}
              stroke="#000"
              strokeWidth={1}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tool Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {chartData.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.6 + index * 0.1 }}
              className="comic-panel p-4 text-center bg-comic-red bg-opacity-10"
            >
              <Icon className="text-2xl mx-auto mb-2 text-comic-red" />
              <div className="action-text text-lg text-comic-red mb-1">{metric.value}%</div>
              <div className="font-comic text-xs text-comic-black uppercase font-bold">
                {metric.name}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
