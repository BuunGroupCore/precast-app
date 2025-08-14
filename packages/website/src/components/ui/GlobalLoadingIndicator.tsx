import { motion, AnimatePresence } from "framer-motion";
import { useGlobalLoading } from "@/hooks/useLoadingContext";
import { LoadingSpinner } from "./LoadingSpinner";
import { ProgressBar } from "./ProgressBar";
import { useEffect, useState } from "react";

interface GlobalLoadingIndicatorProps {
  position?: "top" | "bottom" | "top-right" | "top-left" | "bottom-right" | "bottom-left";
  variant?: "minimal" | "detailed" | "progress";
  showTaskCount?: boolean;
  autoHide?: boolean;
  className?: string;
}

/**
 * Global loading indicator that shows active loading tasks from the LoadingContext.
 * Can display as a minimal indicator, detailed task list, or progress bar.
 */
export function GlobalLoadingIndicator({
  position = "top-right",
  variant = "minimal",
  showTaskCount = true,
  autoHide = true,
  className = "",
}: GlobalLoadingIndicatorProps) {
  const { isGlobalLoading, loadingStates, getActiveTasks } = useGlobalLoading();
  const [isVisible, setIsVisible] = useState(false);

  const activeTasks = getActiveTasks();
  const taskCount = activeTasks.length;

  // Show/hide with slight delay for better UX
  useEffect(() => {
    if (isGlobalLoading) {
      setIsVisible(true);
    } else if (autoHide) {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isGlobalLoading, autoHide]);

  const positionClasses = {
    top: "top-4 left-1/2 -translate-x-1/2",
    bottom: "bottom-4 left-1/2 -translate-x-1/2",
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  };

  if (!isVisible && autoHide) {
    return null;
  }

  const renderMinimal = () => (
    <div className="flex items-center space-x-2">
      <LoadingSpinner size="xs" variant="spinner" color="blue" />
      {showTaskCount && taskCount > 0 && (
        <span className="text-xs font-comic text-comic-blue">
          {taskCount} task{taskCount !== 1 ? "s" : ""}
        </span>
      )}
    </div>
  );

  const renderDetailed = () => (
    <div className="space-y-2 min-w-[200px]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-comic font-bold text-comic-black">
          Active Tasks ({taskCount})
        </span>
        <LoadingSpinner size="xs" variant="spinner" color="blue" />
      </div>

      <div className="space-y-1 max-h-32 overflow-y-auto">
        {activeTasks.map((taskId) => {
          const state = loadingStates[taskId];
          return (
            <motion.div
              key={taskId}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-comic-black/70 truncate">{state.message || taskId}</span>
                {state.progress !== undefined && (
                  <span className="text-comic-blue text-xs ml-2">
                    {Math.round(state.progress)}%
                  </span>
                )}
              </div>

              {state.progress !== undefined && (
                <ProgressBar
                  value={state.progress}
                  size="sm"
                  color="blue"
                  variant="default"
                  className="mt-1"
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  const renderProgress = () => {
    // Calculate overall progress from all tasks
    const tasksWithProgress = activeTasks
      .map((taskId) => loadingStates[taskId])
      .filter((state) => state.progress !== undefined);

    const avgProgress =
      tasksWithProgress.length > 0
        ? tasksWithProgress.reduce((sum, state) => sum + (state.progress || 0), 0) /
          tasksWithProgress.length
        : 0;

    return (
      <div className="space-y-2 min-w-[200px]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-comic font-bold text-comic-black">
            Loading... ({taskCount})
          </span>
          <span className="text-xs text-comic-blue">{Math.round(avgProgress)}%</span>
        </div>

        <ProgressBar value={avgProgress} size="sm" color="blue" variant="comic" animated={true} />

        {/* Show most recent task message */}
        {activeTasks.length > 0 && (
          <div className="text-xs text-comic-black/70">
            {loadingStates[activeTasks[activeTasks.length - 1]]?.message ||
              activeTasks[activeTasks.length - 1]}
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (variant) {
      case "detailed":
        return renderDetailed();
      case "progress":
        return renderProgress();
      default:
        return renderMinimal();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`
            fixed z-50 ${positionClasses[position]}
            comic-panel bg-comic-white border-2 border-comic-black
            shadow-lg p-3 rounded-lg
            ${className}
          `}
          role="status"
          aria-live="polite"
          aria-label={`Loading ${taskCount} task${taskCount !== 1 ? "s" : ""}`}
        >
          {renderContent()}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Top-level progress bar that spans the full width of the screen
 */
export function GlobalProgressBar() {
  const { isGlobalLoading, loadingStates, getActiveTasks } = useGlobalLoading();

  const activeTasks = getActiveTasks();

  // Calculate overall progress
  const tasksWithProgress = activeTasks
    .map((taskId) => loadingStates[taskId])
    .filter((state) => state.progress !== undefined);

  const avgProgress =
    tasksWithProgress.length > 0
      ? tasksWithProgress.reduce((sum, state) => sum + (state.progress || 0), 0) /
        tasksWithProgress.length
      : 0;

  const hasProgressTasks = tasksWithProgress.length > 0;

  return (
    <AnimatePresence>
      {isGlobalLoading && (
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          exit={{ opacity: 0, scaleX: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50"
        >
          {hasProgressTasks ? (
            <ProgressBar
              value={avgProgress}
              size="sm"
              color="blue"
              variant="striped"
              className="rounded-none border-none"
            />
          ) : (
            <div className="h-1 bg-comic-blue/20 relative overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full w-1/3 bg-comic-blue"
                animate={{
                  left: ["-33%", "100%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
