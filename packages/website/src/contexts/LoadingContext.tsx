import { useState, useCallback, ReactNode } from "react";
import { LoadingContext, LoadingContextType, GlobalLoadingState } from "./LoadingContextExport";

/**
 * Global loading context provider that manages loading states across the entire application.
 * Useful for coordinating loading states between components and showing global progress indicators.
 */
export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loadingStates, setLoadingStates] = useState<GlobalLoadingState>({});

  const setLoading = useCallback(
    (key: string, isLoading: boolean, message?: string, progress?: number) => {
      setLoadingStates((prev) => {
        if (!isLoading) {
          // Remove the loading state when stopping
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [key]: _, ...rest } = prev;
          return rest;
        }

        return {
          ...prev,
          [key]: {
            isLoading,
            message,
            progress,
            startTime: prev[key]?.startTime || Date.now(),
          },
        };
      });
    },
    []
  );

  const startLoading = useCallback(
    (key: string, message?: string) => {
      setLoading(key, true, message);
    },
    [setLoading]
  );

  const stopLoading = useCallback(
    (key: string) => {
      setLoading(key, false);
    },
    [setLoading]
  );

  const updateProgress = useCallback((key: string, progress: number) => {
    setLoadingStates((prev) => {
      if (!prev[key]) return prev;

      return {
        ...prev,
        [key]: {
          ...prev[key],
          progress: Math.max(0, Math.min(100, progress)),
        },
      };
    });
  }, []);

  const updateMessage = useCallback((key: string, message: string) => {
    setLoadingStates((prev) => {
      if (!prev[key]) return prev;

      return {
        ...prev,
        [key]: {
          ...prev[key],
          message,
        },
      };
    });
  }, []);

  const isLoading = useCallback(
    (key: string) => {
      return loadingStates[key]?.isLoading || false;
    },
    [loadingStates]
  );

  const getLoadingState = useCallback(
    (key: string) => {
      return loadingStates[key] || null;
    },
    [loadingStates]
  );

  const clearAll = useCallback(() => {
    setLoadingStates({});
  }, []);

  const getActiveTasks = useCallback(() => {
    return Object.keys(loadingStates).filter((key) => loadingStates[key].isLoading);
  }, [loadingStates]);

  const isGlobalLoading = Object.values(loadingStates).some((state) => state.isLoading);

  const value: LoadingContextType = {
    loadingStates,
    isGlobalLoading,
    setLoading,
    startLoading,
    stopLoading,
    updateProgress,
    updateMessage,
    isLoading,
    getLoadingState,
    clearAll,
    getActiveTasks,
  };

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
}
