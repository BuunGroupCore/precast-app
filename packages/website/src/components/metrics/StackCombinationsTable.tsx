import { motion } from "framer-motion";
import { FaCubes, FaChartBar, FaClock, FaCheckCircle } from "react-icons/fa";

import type { AnalyticsMetrics } from "../../hooks/usePrecastAPI";

import { getTechIcon } from "./tech-icons";

interface StackCombinationsTableProps {
  analytics: AnalyticsMetrics;
}

export function StackCombinationsTable({ analytics }: StackCombinationsTableProps) {
  const stackCombinations = analytics.stackCombinations || [];
  const sortedStacks = [...stackCombinations].sort((a, b) => b.frequency - a.frequency);

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${Math.round(ms / 1000)}s`;
    return `${Math.round(ms / 60000)}m`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.4 }}
      className="comic-panel p-6 mb-8"
    >
      <h3 className="font-display text-2xl mb-4 text-comic-green flex items-center gap-2">
        <FaCubes /> STACK COMBINATIONS
      </h3>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="comic-panel p-4 bg-comic-purple text-center">
          <FaChartBar className="text-2xl mx-auto mb-2 text-comic-white" />
          <div className="action-text text-2xl text-comic-white">
            {sortedStacks.reduce((sum, stack) => sum + stack.frequency, 0)}
          </div>
          <div className="font-display text-sm text-comic-white">PROJECTS</div>
        </div>

        <div className="comic-panel p-4 bg-comic-blue text-center">
          <FaClock className="text-2xl mx-auto mb-2 text-comic-white" />
          <div className="action-text text-2xl text-comic-white">
            {sortedStacks.length > 0
              ? formatTime(
                  sortedStacks.reduce((sum, stack) => sum + stack.avgSetupTime, 0) /
                    sortedStacks.length
                )
              : "0s"}
          </div>
          <div className="font-display text-sm text-comic-white">AVG SETUP</div>
        </div>

        <div className="comic-panel p-4 bg-comic-green text-center">
          <FaCheckCircle className="text-2xl mx-auto mb-2 text-comic-white" />
          <div className="action-text text-2xl text-comic-white">
            {sortedStacks.length > 0
              ? Math.round(
                  sortedStacks.reduce((sum, stack) => sum + stack.successRate, 0) /
                    sortedStacks.length
                )
              : 0}
            %
          </div>
          <div className="font-display text-sm text-comic-white">SUCCESS RATE</div>
        </div>

        <div className="comic-panel p-4 bg-comic-red text-center">
          <div className="text-2xl mx-auto mb-2">⭐</div>
          <div className="action-text text-lg text-comic-white">
            {sortedStacks[0]?.framework?.toUpperCase() || "N/A"}
          </div>
          <div className="font-display text-sm text-comic-white">TOP FRAMEWORK</div>
        </div>
      </div>

      {/* Stack List */}
      <div className="space-y-3">
        {sortedStacks.length > 0 ? (
          sortedStacks.slice(0, 10).map((stack, index) => (
            <motion.div
              key={`${stack.framework}-${stack.backend}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.5 + index * 0.05 }}
              className="flex items-center justify-between p-4 rounded-lg bg-comic-green bg-opacity-10 border-2 border-comic-green"
            >
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="comic-panel px-3 py-1 bg-comic-purple text-comic-white text-xs font-comic font-bold flex items-center gap-1">
                    {(() => {
                      const Icon = getTechIcon("framework", stack.framework);
                      return Icon && <Icon className="text-sm" />;
                    })()}
                    {stack.framework}
                  </span>
                  {stack.backend !== "none" && (
                    <span className="comic-panel px-3 py-1 bg-comic-blue text-comic-white text-xs font-comic font-bold flex items-center gap-1">
                      {(() => {
                        const Icon = getTechIcon("backend", stack.backend);
                        return Icon && <Icon className="text-sm" />;
                      })()}
                      {stack.backend}
                    </span>
                  )}
                  {stack.database !== "none" && (
                    <span className="comic-panel px-3 py-1 bg-comic-green text-comic-white text-xs font-comic font-bold flex items-center gap-1">
                      {(() => {
                        const Icon = getTechIcon("database", stack.database);
                        return Icon && <Icon className="text-sm" />;
                      })()}
                      {stack.database}
                    </span>
                  )}
                  <span className="comic-panel px-3 py-1 bg-comic-red text-comic-white text-xs font-comic font-bold flex items-center gap-1">
                    {(() => {
                      const Icon = getTechIcon("styling", stack.styling);
                      return Icon && <Icon className="text-sm" />;
                    })()}
                    {stack.styling}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-right">
                <div>
                  <div className="action-text text-lg text-comic-green">{stack.frequency}</div>
                  <div className="font-comic text-xs text-comic-black">projects</div>
                </div>
                <div>
                  <div className="action-text text-lg text-comic-red">{stack.successRate}%</div>
                  <div className="font-comic text-xs text-comic-black">success</div>
                </div>
                <div>
                  <div className="action-text text-lg text-comic-blue">
                    {formatTime(stack.avgSetupTime)}
                  </div>
                  <div className="font-comic text-xs text-comic-black">setup</div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8">
            <FaCubes className="mx-auto text-4xl mb-4 text-comic-green opacity-50" />
            <div className="font-comic text-comic-black">
              No stack combination data available yet!
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
