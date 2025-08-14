import { useState, useEffect, useCallback, useRef } from "react";

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export interface UseAsyncOptions<T> {
  immediate?: boolean;
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  deps?: React.DependencyList;
}

/**
 * Hook for managing async operations with loading, error, and data states.
 * Provides cleanup and cancellation support to prevent memory leaks.
 */
export function useAsync<T>(asyncFunction: () => Promise<T>, options: UseAsyncOptions<T> = {}) {
  const { immediate = true, initialData = null, onSuccess, onError, deps = [] } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: initialData,
    loading: immediate,
    error: null,
  });

  const mountedRef = useRef(true);
  const lastCallIdRef = useRef(0);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(
    async (customAsyncFunction?: () => Promise<T>) => {
      const callId = ++lastCallIdRef.current;

      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      try {
        const asyncFunc = customAsyncFunction || asyncFunction;
        const data = await asyncFunc();

        // Only update if this is the latest call and component is still mounted
        if (callId === lastCallIdRef.current && mountedRef.current) {
          setState({
            data,
            loading: false,
            error: null,
          });

          onSuccess?.(data);
        }
      } catch (error) {
        // Only update if this is the latest call and component is still mounted
        if (callId === lastCallIdRef.current && mountedRef.current) {
          const errorObject = error instanceof Error ? error : new Error(String(error));
          setState((prev) => ({
            ...prev,
            loading: false,
            error: errorObject,
          }));

          onError?.(errorObject);
        }
      }
    },
    [asyncFunction, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setState({
      data: initialData,
      loading: false,
      error: null,
    });
  }, [initialData]);

  // Auto-execute on mount and when dependencies change
  useEffect(() => {
    if (immediate) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return {
    ...state,
    execute,
    reset,
    isIdle: !state.loading && !state.error && !state.data,
    isSuccess: !state.loading && !state.error && !!state.data,
    isError: !state.loading && !!state.error,
  };
}

/**
 * Hook for managing async operations with retry functionality
 */
export function useAsyncWithRetry<T>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions<T> & {
    maxRetries?: number;
    retryDelay?: number;
    shouldRetry?: (error: Error, attempt: number) => boolean;
  } = {}
) {
  const { maxRetries = 3, retryDelay = 1000, shouldRetry = () => true, ...asyncOptions } = options;

  const [retryCount, setRetryCount] = useState(0);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const retryableAsyncFunction = useCallback(async () => {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await asyncFunction();
        setRetryCount(0); // Reset on success
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Don't retry on last attempt or if shouldRetry returns false
        if (attempt === maxRetries || !shouldRetry(lastError, attempt + 1)) {
          break;
        }

        // Wait before retrying
        if (retryDelay > 0) {
          await new Promise((resolve) => {
            retryTimeoutRef.current = setTimeout(resolve, retryDelay * (attempt + 1));
          });
        }

        setRetryCount(attempt + 1);
      }
    }

    throw lastError!;
  }, [asyncFunction, maxRetries, retryDelay, shouldRetry]);

  const asyncState = useAsync(retryableAsyncFunction, asyncOptions);

  // Cleanup retry timeout on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  return {
    ...asyncState,
    retryCount,
    canRetry: retryCount < maxRetries,
  };
}
