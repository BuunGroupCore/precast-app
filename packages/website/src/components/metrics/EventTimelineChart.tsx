import { motion } from "framer-motion";
import { FaChartLine, FaBolt } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import type { AnalyticsMetrics } from "../../hooks/usePrecastAPI";

interface EventTimelineChartProps {
  analytics: AnalyticsMetrics;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      date: string;
      count: number;
    };
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    let dateStr = "UNKNOWN DATE";
    if (label) {
      try {
        // Handle both date strings and formatted date labels
        let dateToFormat = label;

        // If label looks like "Jan 15" format, use the original date from payload
        if (payload[0]?.payload?.date) {
          dateToFormat = payload[0].payload.date;
        }

        const date = new Date(dateToFormat);

        // Check if date is valid
        if (!isNaN(date.getTime())) {
          dateStr = date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          });
        } else {
          dateStr = label.toString();
        }
      } catch (e) {
        dateStr = label.toString();
      }
    }

    return (
      <div className="comic-panel bg-comic-black text-comic-white p-3 border-2 border-comic-blue">
        <p className="action-text text-comic-yellow mb-2">{dateStr.toUpperCase()}!</p>
        {payload.map((entry, index) => (
          <p key={index} className="font-comic text-comic-green">
            ⚡ Events: {entry?.value || 0}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

interface CustomDotProps {
  cx?: number;
  cy?: number;
  payload?: {
    count?: number;
  };
}

const CustomDot = (props: CustomDotProps) => {
  const { cx, cy, payload } = props;
  if (payload?.count && payload.count > 0) {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill="#FF6B6B"
        stroke="#000"
        strokeWidth={2}
        className="hover:r-6 transition-all duration-200"
      />
    );
  }
  return null;
};

export function EventTimelineChart({ analytics }: EventTimelineChartProps) {
  // Aggregate individual events by date
  const aggregateEventsByDate = () => {
    const dailyCounts = new Map<string, number>();

    (analytics.events?.timeline || []).forEach((event: Record<string, unknown>) => {
      if (!event.timestamp) return;

      const date = new Date(event.timestamp as string);
      if (isNaN(date.getTime())) return;

      const dateKey = date.toISOString().split("T")[0]; // YYYY-MM-DD format
      dailyCounts.set(dateKey, (dailyCounts.get(dateKey) || 0) + 1);
    });

    return Array.from(dailyCounts.entries())
      .map(([date, count]) => ({
        date,
        count,
        formattedDate: new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const timelineData = aggregateEventsByDate();

  const totalEvents = timelineData.reduce((sum, item) => sum + item.count, 0);
  const avgEvents = totalEvents > 0 ? Math.round(totalEvents / timelineData.length) : 0;
  const peakDay = timelineData.reduce(
    (max, item) => (item.count > max.count ? item : max),
    timelineData[0] || { date: "", count: 0 }
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.3 }}
      className="comic-panel p-6 mb-8"
    >
      <h3 className="font-display text-2xl mb-4 text-comic-blue flex items-center gap-2">
        <FaChartLine /> EVENT TIMELINE
      </h3>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="comic-panel p-4 bg-comic-blue text-center">
          <FaBolt className="text-2xl mx-auto mb-2 text-comic-white" />
          <div className="action-text text-2xl text-comic-white">{avgEvents}</div>
          <div className="font-display text-sm text-comic-white">DAILY AVERAGE</div>
        </div>

        <div className="comic-panel p-4 bg-comic-green text-center">
          <FaChartLine className="text-2xl mx-auto mb-2 text-comic-white" />
          <div className="action-text text-2xl text-comic-white">{peakDay.count}</div>
          <div className="font-display text-sm text-comic-white">PEAK DAY</div>
        </div>

        <div className="comic-panel p-4 bg-comic-red text-center">
          <FaBolt className="text-2xl mx-auto mb-2 text-comic-white" />
          <div className="action-text text-2xl text-comic-white">{totalEvents}</div>
          <div className="font-display text-sm text-comic-white">TOTAL EVENTS</div>
        </div>
      </div>

      {/* Line Chart */}
      {timelineData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#000" opacity={0.1} />
            <XAxis
              dataKey="formattedDate"
              tick={{ fontSize: 12, fontFamily: "Comic Sans MS, cursive", fill: "#000" }}
            />
            <YAxis tick={{ fontSize: 12, fontFamily: "Comic Sans MS, cursive", fill: "#000" }} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#45B7D1"
              strokeWidth={3}
              dot={<CustomDot />}
              activeDot={{ r: 6, fill: "#45B7D1" }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[300px] flex items-center justify-center">
          <span className="font-comic text-comic-black">No timeline data available</span>
        </div>
      )}
    </motion.div>
  );
}
