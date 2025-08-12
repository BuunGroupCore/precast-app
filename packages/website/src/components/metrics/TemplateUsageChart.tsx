import { motion } from "framer-motion";
import { FaFileCode, FaClock, FaCheckCircle } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { useTemplateMetrics } from "../../hooks/usePrecastAPI";

interface TemplateUsageChartProps {}

// Template colors for variety
const TEMPLATE_COLORS = [
  "#FF6B6B", // comic-red
  "#45B7D1", // comic-blue
  "#4ECDC4", // comic-green
  "#96CEB4", // comic-purple variant
  "#FFEAA7", // comic-yellow
  "#FF8A80", // comic-red variant
  "#81C784", // green variant
  "#64B5F6", // blue variant
];

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      avgTime: number;
      successRate: number;
    };
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    const formatTimeDisplay = (time: number | string) => {
      if (time === "N/A" || time === 0 || (typeof time === "number" && time > 300000)) return "N/A";
      const numTime = typeof time === "string" ? 0 : time;
      if (numTime < 1000) return `${numTime}ms`;
      if (numTime < 60000) return `${Math.round(numTime / 1000)}s`;
      return `${Math.round(numTime / 60000)}min`;
    };

    return (
      <div className="comic-panel bg-comic-black text-comic-white p-3 border-2 border-comic-yellow">
        <div className="flex items-center gap-2 mb-1">
          <FaFileCode className="text-comic-yellow" />
          <p className="action-text text-comic-yellow">{label}</p>
        </div>
        <p className="font-comic text-comic-white">
          Usage: <span className="action-text">{payload[0]?.value || 0}</span>
        </p>
        <p className="font-comic text-comic-green text-sm">
          Avg Time: {formatTimeDisplay(payload[0]?.payload?.avgTime || 0)}
        </p>
        <p className="font-comic text-comic-blue text-sm">
          Success Rate: {payload[0]?.payload?.successRate || 0}%
        </p>
      </div>
    );
  }
  return null;
};

export function TemplateUsageChart(_props: TemplateUsageChartProps) {
  const { data: templates, loading, error } = useTemplateMetrics();

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.8 }}
        className="comic-panel p-6 mb-8 text-center"
      >
        <FaFileCode className="text-4xl mx-auto mb-4 text-comic-green animate-pulse" />
        <h3 className="font-display text-2xl text-comic-green">TEMPLATE METRICS</h3>
        <div className="font-comic text-comic-black">Loading template data...</div>
      </motion.div>
    );
  }

  if (error || !templates) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.8 }}
        className="comic-panel p-6 mb-8 text-center"
      >
        <FaFileCode className="text-4xl mx-auto mb-4 text-comic-yellow" />
        <h3 className="font-display text-2xl text-comic-yellow">TEMPLATE METRICS</h3>
        <div className="font-comic text-comic-black">
          Template metrics will be displayed here once data is collected.
        </div>
      </motion.div>
    );
  }

  // Helper function to format template names
  const formatTemplateName = (template: string) => {
    return template
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase())
      .replace(/Tanstack/i, "TanStack")
      .replace(/Hono/i, "Hono");
  };

  // Helper function to format time values
  const formatTime = (time: number) => {
    const num = Number(time);
    // Reject any extreme values (scientific notation or unreasonable times)
    if (isNaN(num) || !isFinite(num) || num <= 0 || num > 300000) {
      return 0; // Invalid time - reject anything over 5 minutes
    }
    return Math.round(num);
  };

  // Prepare chart data
  const chartData = Object.entries(templates?.templateUsage || {})
    .map(([template, usage]) => ({
      name: formatTemplateName(template),
      displayName: formatTemplateName(template),
      usage: usage as number,
      avgTime: formatTime(templates?.avgGenerationTime?.[template] || 0),
      successRate: templates?.templateSuccessRate?.[template] || 0,
    }))
    .sort((a, b) => b.usage - a.usage)
    .slice(0, 8);

  if (chartData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.8 }}
        className="comic-panel p-6 mb-8 text-center"
      >
        <FaFileCode className="text-4xl mx-auto mb-4 text-comic-yellow" />
        <h3 className="font-display text-2xl text-comic-yellow">TEMPLATE METRICS</h3>
        <div className="font-comic text-comic-black">
          Template metrics will be displayed here once data is collected.
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.8 }}
      className="comic-panel p-6 mb-8"
    >
      <h3 className="font-display text-2xl mb-4 text-comic-green flex items-center gap-2">
        <FaFileCode /> TEMPLATE METRICS
      </h3>

      {/* Key Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="comic-panel p-4 bg-comic-green text-center">
          <FaFileCode className="text-2xl mx-auto mb-2 text-comic-white" />
          <div className="action-text text-2xl text-comic-white">
            {templates?.totalTemplatesGenerated || 0}
          </div>
          <div className="font-display text-sm text-comic-white">TOTAL GENERATED</div>
        </div>

        <div className="comic-panel p-4 bg-comic-blue text-center">
          <FaClock className="text-2xl mx-auto mb-2 text-comic-white" />
          <div className="action-text text-2xl text-comic-white">
            {(() => {
              const times = Object.values(templates?.avgGenerationTime || {});
              const correctedTimes = times
                .map((time: number) => formatTime(time))
                .filter((time) => time > 0);

              if (correctedTimes.length === 0) {
                return "N/A";
              }

              const avgTime =
                correctedTimes.reduce((sum: number, time) => sum + time, 0) / correctedTimes.length;
              if (avgTime < 1000) return `${Math.round(avgTime)}ms`;
              if (avgTime < 60000) return `${Math.round(avgTime / 1000)}s`;
              return `${Math.round(avgTime / 60000)}min`;
            })()}
          </div>
          <div className="font-display text-sm text-comic-white">AVG TIME</div>
        </div>

        <div className="comic-panel p-4 bg-comic-purple text-center">
          <FaCheckCircle className="text-2xl mx-auto mb-2 text-comic-white" />
          <div className="action-text text-2xl text-comic-white">
            {Math.round(
              Object.values(templates?.templateSuccessRate || {}).reduce(
                (sum: number, rate) => sum + (rate as number),
                0
              ) / Math.max(Object.keys(templates?.templateSuccessRate || {}).length, 1)
            )}
            %
          </div>
          <div className="font-display text-sm text-comic-white">SUCCESS RATE</div>
        </div>
      </div>

      {/* Usage Chart */}
      <div className="mb-6">
        <h4 className="font-display text-xl mb-4 text-comic-green">TEMPLATE USAGE</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="name"
              tick={{ fill: "#374151", fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fill: "#374151", fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="usage" stroke="#000" strokeWidth={2}>
              {chartData.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={TEMPLATE_COLORS[index % TEMPLATE_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Templates List */}
      <div>
        <h4 className="font-display text-xl mb-4 text-comic-green">TOP TEMPLATES</h4>
        <div className="grid gap-3">
          {chartData.slice(0, 5).map((template, index) => {
            const color = TEMPLATE_COLORS[index % TEMPLATE_COLORS.length];
            return (
              <motion.div
                key={template.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.9 + index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg border-2"
                style={{
                  backgroundColor: `${color}20`,
                  borderColor: color,
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="action-text" style={{ color }}>
                    #{index + 1}
                  </span>
                  <div>
                    <div className="font-comic font-bold text-comic-red">
                      {template.displayName}
                    </div>
                    <div className="text-sm text-comic-red">
                      {(() => {
                        const time = template.avgTime;
                        let timeStr;
                        if (typeof time !== "number" || time === 0 || time > 300000)
                          timeStr = "N/A";
                        else if (time < 1000) timeStr = `${time}ms`;
                        else if (time < 60000) timeStr = `${Math.round(time / 1000)}s`;
                        else timeStr = `${Math.round(time / 60000)}min`;
                        return `${timeStr} avg • ${template.successRate}% success`;
                      })()}
                    </div>
                  </div>
                </div>
                <div className="action-text text-xl" style={{ color }}>
                  {template.usage}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
