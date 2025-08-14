import { useState, useCallback, useRef, useEffect } from "react";

export interface LoadingState {
  [key: string]: boolean;
}

export interface UseLoadingReturn {
  loading: LoadingState;
  isLoading: (key?: string) => boolean;
  isAnyLoading: () => boolean;
  setLoading: (key: string, isLoading: boolean) => void;
  startLoading: (key: string) => void;
  stopLoading: (key: string) => void;
  withLoading: <T>(key: string, promise: Promise<T>) => Promise<T>;
  reset: () => void;
}

/**
 * Hook for managing multiple loading states with named keys.
 * Useful for components that have multiple async operations.
 */
export function useLoading(initialKeys: string[] = []): UseLoadingReturn {
  const [loading, setLoadingState] = useState<LoadingState>(() => {
    const initial: LoadingState = {};
    initialKeys.forEach((key) => {
      initial[key] = false;
    });
    return initial;
  });

  const setLoading = useCallback((key: string, isLoading: boolean) => {
    setLoadingState((prev) => ({
      ...prev,
      [key]: isLoading,
    }));
  }, []);

  const startLoading = useCallback(
    (key: string) => {
      setLoading(key, true);
    },
    [setLoading]
  );

  const stopLoading = useCallback(
    (key: string) => {
      setLoading(key, false);
    },
    [setLoading]
  );

  const isLoading = useCallback(
    (key?: string) => {
      if (key) {
        return loading[key] || false;
      }
      return Object.values(loading).some(Boolean);
    },
    [loading]
  );

  const isAnyLoading = useCallback(() => {
    return Object.values(loading).some(Boolean);
  }, [loading]);

  const withLoading = useCallback(
    async <T>(key: string, promise: Promise<T>): Promise<T> => {
      startLoading(key);
      try {
        const result = await promise;
        return result;
      } finally {
        stopLoading(key);
      }
    },
    [startLoading, stopLoading]
  );

  const reset = useCallback(() => {
    setLoadingState({});
  }, []);

  return {
    loading,
    isLoading,
    isAnyLoading,
    setLoading,
    startLoading,
    stopLoading,
    withLoading,
    reset,
  };
}

/**
 * Hook for managing loading state with automatic timeout
 */
export function useLoadingWithTimeout(timeout: number = 30000) {
  const [isLoading, setIsLoading] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setIsTimeout(false);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      setIsTimeout(true);
    }, timeout);
  }, [timeout]);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setIsTimeout(false);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const reset = useCallback(() => {
    stopLoading();
  }, [stopLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isLoading,
    isTimeout,
    startLoading,
    stopLoading,
    reset,
  };
}

/**
 * Hook for managing optimistic updates with loading states
 */
export function useOptimisticLoading<T>(initialData: T) {
  const [data, setData] = useState<T>(initialData);
  const [optimisticData, setOptimisticData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateOptimistic = useCallback((newData: T) => {
    setOptimisticData(newData);
  }, []);

  const executeWithOptimistic = useCallback(
    async <R>(
      optimisticUpdate: T,
      asyncOperation: () => Promise<R>,
      onSuccess?: (result: R) => T,
      onError?: (error: Error) => T
    ): Promise<R> => {
      // Apply optimistic update
      setOptimisticData(optimisticUpdate);
      setIsLoading(true);
      setError(null);

      try {
        const result = await asyncOperation();

        // Apply success update if provided, otherwise keep optimistic data
        if (onSuccess) {
          const successData = onSuccess(result);
          setData(successData);
          setOptimisticData(successData);
        } else {
          setData(optimisticUpdate);
        }

        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);

        // Revert to previous data or apply error update
        if (onError) {
          const errorData = onError(error);
          setOptimisticData(errorData);
        } else {
          setOptimisticData(data); // Revert to last known good state
        }

        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [data]
  );

  const reset = useCallback(() => {
    setData(initialData);
    setOptimisticData(initialData);
    setIsLoading(false);
    setError(null);
  }, [initialData]);

  return {
    data: optimisticData,
    actualData: data,
    isLoading,
    error,
    updateOptimistic,
    executeWithOptimistic,
    reset,
  };
}
