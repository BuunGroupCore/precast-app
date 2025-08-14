import { motion } from "framer-motion";
import { FaUser, FaDownload, FaTools, FaRobot } from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import { useUserPreferences } from "../../hooks/usePrecastAPI";

// No props needed for this component
type UserPreferencesChartProps = Record<string, never>;

// Preference colors matching comic book theme
const PREFERENCE_COLORS = {
  bun: "#FF6B6B", // comic-red
  npm: "#45B7D1", // comic-blue
  yarn: "#4ECDC4", // comic-green
  pnpm: "#96CEB4", // comic-purple variant
  auto: "#FFEAA7", // comic-yellow
  manual: "#FF8A80", // comic-red variant
  true: "#10B981", // success green
  false: "#EF4444", // error red
  quick_start: "#FF6B6B",
  full_customization: "#45B7D1",
  template_only: "#4ECDC4",
  ai_assisted: "#96CEB4",
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
    return (
      <div className="comic-panel bg-comic-black text-comic-white p-3 border-2 border-comic-yellow">
        <div className="flex items-center gap-2 mb-1">
          <FaUser className="text-comic-yellow" />
          <p className="action-text text-comic-yellow">{data.name}</p>
        </div>
        <p className="font-comic text-comic-white">
          Usage: <span className="action-text">{data.value}</span>
        </p>
        <p className="font-comic text-comic-green text-sm">{data.payload.percentage}% of users</p>
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
  if (percent < 0.05) return null; // Don't show label for small slices

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

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

export function UserPreferencesChart(_props: UserPreferencesChartProps) {
  const { data: preferences, loading, error } = useUserPreferences();

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.0 }}
        className="comic-panel p-6 mb-8 text-center"
      >
        <FaUser className="text-4xl mx-auto mb-4 text-comic-purple animate-pulse" />
        <h3 className="font-display text-2xl text-comic-purple">USER PREFERENCES</h3>
        <div className="font-comic text-comic-red">Loading preference data...</div>
      </motion.div>
    );
  }

  if (error || !preferences) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.0 }}
        className="comic-panel p-6 mb-8 text-center"
      >
        <FaUser className="text-4xl mx-auto mb-4 text-comic-yellow" />
        <h3 className="font-display text-2xl text-comic-yellow">USER PREFERENCES</h3>
        <div className="font-comic text-comic-red">
          User preference metrics will be displayed here once data is collected.
        </div>
      </motion.div>
    );
  }

  // Prepare package manager data
  const packageManagerData = Object.entries(preferences?.packageManagerPreferences || {})
    .map(([name, value]) => {
      const total = Object.values(preferences?.packageManagerPreferences || {}).reduce(
        (sum: number, v) => sum + (v as number),
        0
      );
      return {
        name,
        value: value as number,
        percentage: total > 0 ? Math.round(((value as number) / total) * 100) : 0,
      };
    })
    .sort((a, b) => b.value - a.value);

  // Prepare workflow data
  const workflowData = Object.entries(preferences?.workflowTypes || {})
    .map(([name, value]) => {
      const total = Object.values(preferences?.workflowTypes || {}).reduce(
        (sum: number, v) => sum + (v as number),
        0
      );
      return {
        name: name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        value: value as number,
        percentage: total > 0 ? Math.round(((value as number) / total) * 100) : 0,
      };
    })
    .sort((a, b) => b.value - a.value);

  if (packageManagerData.length === 0 && workflowData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.0 }}
        className="comic-panel p-6 mb-8 text-center"
      >
        <FaUser className="text-4xl mx-auto mb-4 text-comic-yellow" />
        <h3 className="font-display text-2xl text-comic-yellow">USER PREFERENCES</h3>
        <div className="font-comic text-comic-red">
          User preference metrics will be displayed here once data is collected.
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 3.0 }}
      className="comic-panel p-6 mb-8"
    >
      <h3 className="font-display text-2xl mb-6 text-comic-purple flex items-center gap-2">
        <FaUser /> USER PREFERENCES
      </h3>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Package Manager Preferences */}
        {packageManagerData.length > 0 && (
          <div>
            <h4 className="font-display text-xl mb-4 text-comic-blue flex items-center gap-2">
              <FaDownload /> PACKAGE MANAGERS
            </h4>

            <div className="mb-4">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={packageManagerData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {packageManagerData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          PREFERENCE_COLORS[entry.name as keyof typeof PREFERENCE_COLORS] ||
                          "#FFEAA7"
                        }
                        stroke="#000"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2">
              {packageManagerData.map((pm) => (
                <div
                  key={pm.name}
                  className="flex items-center justify-between p-2 rounded-lg"
                  style={{
                    backgroundColor: `${PREFERENCE_COLORS[pm.name as keyof typeof PREFERENCE_COLORS] || "#FFEAA7"}20`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full border border-comic-black"
                      style={{
                        backgroundColor:
                          PREFERENCE_COLORS[pm.name as keyof typeof PREFERENCE_COLORS] || "#FFEAA7",
                      }}
                    />
                    <span className="font-comic font-bold text-comic-red uppercase">{pm.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="action-text text-lg text-comic-red">{pm.value}</div>
                    <div className="font-comic text-sm text-comic-red">{pm.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Workflow Preferences */}
        {workflowData.length > 0 && (
          <div>
            <h4 className="font-display text-xl mb-4 text-comic-green flex items-center gap-2">
              <FaTools /> WORKFLOW TYPES
            </h4>

            <div className="mb-4">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={workflowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#374151", fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fill: "#374151", fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#10B981" stroke="#000" strokeWidth={2} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* AI Usage Patterns */}
      {preferences?.aiUsagePatterns && Object.keys(preferences.aiUsagePatterns).length > 0 && (
        <div className="mt-8">
          <h4 className="font-display text-xl mb-4 text-comic-yellow flex items-center gap-2">
            <FaRobot /> AI USAGE PATTERNS
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(preferences.aiUsagePatterns).map(([pattern, usage]) => (
              <motion.div
                key={pattern}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay:
                    3.1 + Object.keys(preferences?.aiUsagePatterns || {}).indexOf(pattern) * 0.05,
                }}
                className="comic-panel p-3 bg-comic-yellow bg-opacity-10 text-center"
              >
                <FaRobot className="text-comic-yellow mx-auto mb-2" />
                <div className="action-text text-lg text-comic-red">{usage as number}</div>
                <div className="font-comic text-sm text-comic-red font-bold">
                  {pattern.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
