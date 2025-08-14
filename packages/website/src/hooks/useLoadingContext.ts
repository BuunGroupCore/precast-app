import { useCallback, useState, useContext } from "react";
import { LoadingContext } from "@/contexts/LoadingContextExport";

/**
 * Hook to access the global loading context.
 * Must be used within a LoadingProvider component.
 */
export function useGlobalLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useGlobalLoading must be used within a LoadingProvider");
  }
  return context;
}

/**
 * Hook for managing a specific loading task with automatic cleanup
 */
export function useLoadingTask(taskId: string) {
  const { startLoading, stopLoading, updateProgress, updateMessage, isLoading, getLoadingState } =
    useGlobalLoading();

  const start = useCallback(
    (message?: string) => {
      startLoading(taskId, message);
    },
    [startLoading, taskId]
  );

  const stop = useCallback(() => {
    stopLoading(taskId);
  }, [stopLoading, taskId]);

  const setProgress = useCallback(
    (progress: number) => {
      updateProgress(taskId, progress);
    },
    [updateProgress, taskId]
  );

  const setMessage = useCallback(
    (message: string) => {
      updateMessage(taskId, message);
    },
    [updateMessage, taskId]
  );

  const withLoading = useCallback(
    async <T>(promise: Promise<T>, message?: string): Promise<T> => {
      start(message);
      try {
        const result = await promise;
        return result;
      } finally {
        stop();
      }
    },
    [start, stop]
  );

  return {
    isLoading: isLoading(taskId),
    loadingState: getLoadingState(taskId),
    start,
    stop,
    setProgress,
    setMessage,
    withLoading,
  };
}

/**
 * Hook for managing loading with automatic timeout and error handling
 */
export function useLoadingTaskWithTimeout(taskId: string, timeoutMs: number = 30000) {
  const loadingTask = useLoadingTask(taskId);
  const [isTimeout, setIsTimeout] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const withTimeoutAndError = useCallback(
    async <T>(promise: Promise<T>, message?: string): Promise<T> => {
      setIsTimeout(false);
      setError(null);

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          setIsTimeout(true);
          reject(new Error(`Operation timed out after ${timeoutMs}ms`));
        }, timeoutMs);
      });

      try {
        loadingTask.start(message);
        const result = await Promise.race([promise, timeoutPromise]);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        loadingTask.stop();
      }
    },
    [loadingTask, timeoutMs]
  );

  return {
    ...loadingTask,
    isTimeout,
    error,
    withTimeoutAndError,
    reset: () => {
      setIsTimeout(false);
      setError(null);
      loadingTask.stop();
    },
  };
}
