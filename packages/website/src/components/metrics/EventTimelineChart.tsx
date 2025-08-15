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

import { usePrecastAnalytics } from "../../hooks/usePrecastAPI";
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
      } catch {
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

export function EventTimelineChart({ analytics }: EventTimelineChartProps) {
  const { analyzeRawEvents } = usePrecastAnalytics();

  // Get analyzed raw events data
  const rawEventsAnalysis = analyzeRawEvents();

  // Use raw events analysis if available, otherwise fall back to timeline data
  const getTimelineData = () => {
    // If we have raw events analysis with daily breakdown, use that
    if (rawEventsAnalysis?.last30Days?.dailyBreakdown) {
      // This already has 180 days (6 months) of data from the hook
      return rawEventsAnalysis.last30Days.dailyBreakdown.map((item) => ({
        date: item.date,
        count: item.count,
        formattedDate: item.date, // Already formatted as M/D
      }));
    }

    // Fall back to timeline data if no raw events
    if (analytics.events?.timeline && analytics.events.timeline.length > 0) {
      // Use the timeline data directly (it should already be aggregated by date)
      return analytics.events.timeline.map((item) => ({
        date: item.date,
        count: item.count,
        formattedDate: new Date(item.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      }));
    }

    // If no data available, create empty 6-month timeline
    const now = new Date();
    const emptyData = [];
    for (let i = 179; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      emptyData.push({
        date: date.toISOString().split("T")[0],
        count: 0,
        formattedDate: `${date.getMonth() + 1}/${date.getDate()}`,
      });
    }
    return emptyData;
  };

  const timelineData = getTimelineData();

  // Calculate stats - only count days with events for average
  const daysWithEvents = timelineData.filter((item) => item.count > 0);
  const totalEvents = timelineData.reduce((sum, item) => sum + (item.count || 0), 0);
  const avgEvents = daysWithEvents.length > 0 ? Math.round(totalEvents / daysWithEvents.length) : 0;
  const peakDay = timelineData.reduce(
    (max, item) => ((item.count || 0) > (max.count || 0) ? item : max),
    timelineData[0] || { date: "", count: 0, formattedDate: "" }
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
          <div className="action-text text-2xl text-comic-white">
            {isNaN(avgEvents) ? 0 : avgEvents}
          </div>
          <div className="font-display text-sm text-comic-white">DAILY AVERAGE</div>
        </div>

        <div className="comic-panel p-4 bg-comic-green text-center">
          <FaChartLine className="text-2xl mx-auto mb-2 text-comic-white" />
          <div className="action-text text-2xl text-comic-white">
            {isNaN(peakDay.count) ? 0 : peakDay.count}
          </div>
          <div className="font-display text-sm text-comic-white">PEAK DAY</div>
        </div>

        <div className="comic-panel p-4 bg-comic-red text-center">
          <FaBolt className="text-2xl mx-auto mb-2 text-comic-white" />
          <div className="action-text text-2xl text-comic-white">
            {isNaN(totalEvents) ? 0 : totalEvents}
          </div>
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
              interval={Math.floor(timelineData.length / 10)} // Show about 10 labels for 180 days
            />
            <YAxis tick={{ fontSize: 12, fontFamily: "Comic Sans MS, cursive", fill: "#000" }} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#45B7D1"
              strokeWidth={3}
              dot={false} // Don't show dots for all 180 points
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
