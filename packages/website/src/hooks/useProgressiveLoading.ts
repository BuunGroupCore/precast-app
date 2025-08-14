import { useState, useEffect, useCallback, useRef } from "react";

export interface ProgressiveLoadingOptions<T> {
  batchSize?: number;
  delay?: number;
  onBatchLoad?: (batch: T[], batchIndex: number) => void;
  onComplete?: (allItems: T[]) => void;
  onError?: (error: Error) => void;
}

export interface UseProgressiveLoadingReturn<T> {
  items: T[];
  loading: boolean;
  error: Error | null;
  progress: number;
  currentBatch: number;
  totalBatches: number;
  hasMore: boolean;
  loadNext: () => void;
  reset: () => void;
  loadAll: () => void;
}

/**
 * Hook for progressive loading of large datasets in batches.
 * Useful for loading lists that might be too large to load at once.
 */
export function useProgressiveLoading<T>(
  dataSource: T[] | (() => Promise<T[]>),
  options: ProgressiveLoadingOptions<T> = {}
): UseProgressiveLoadingReturn<T> {
  const { batchSize = 10, delay = 100, onBatchLoad, onComplete, onError } = options;

  const [items, setItems] = useState<T[]>([]);
  const [allItems, setAllItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [totalBatches, setTotalBatches] = useState(0);

  const mountedRef = useRef(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Initialize data source
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        setError(null);

        let data: T[];
        if (typeof dataSource === "function") {
          data = await dataSource();
        } else {
          data = dataSource;
        }

        if (mountedRef.current) {
          setAllItems(data);
          setTotalBatches(Math.ceil(data.length / batchSize));
          setCurrentBatch(0);
          setItems([]);
        }
      } catch (err) {
        if (mountedRef.current) {
          const error = err instanceof Error ? err : new Error(String(err));
          setError(error);
          onError?.(error);
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    initializeData();
  }, [dataSource, batchSize, onError]);

  const loadNext = useCallback(() => {
    if (loading || currentBatch >= totalBatches) {
      return;
    }

    setLoading(true);

    const loadBatch = () => {
      if (!mountedRef.current) return;

      const startIndex = currentBatch * batchSize;
      const endIndex = Math.min(startIndex + batchSize, allItems.length);
      const batch = allItems.slice(startIndex, endIndex);

      setItems((prev) => [...prev, ...batch]);
      setCurrentBatch((prev) => prev + 1);
      setLoading(false);

      onBatchLoad?.(batch, currentBatch);

      // Check if this was the last batch
      if (endIndex >= allItems.length) {
        onComplete?.(allItems);
      }
    };

    if (delay > 0) {
      timeoutRef.current = setTimeout(loadBatch, delay);
    } else {
      loadBatch();
    }
  }, [loading, currentBatch, totalBatches, batchSize, allItems, delay, onBatchLoad, onComplete]);

  const loadAll = useCallback(() => {
    if (loading) return;

    setLoading(true);

    const loadAllBatches = async () => {
      const remainingBatches = totalBatches - currentBatch;

      for (let i = 0; i < remainingBatches; i++) {
        if (!mountedRef.current) break;

        const batchIndex = currentBatch + i;
        const startIndex = batchIndex * batchSize;
        const endIndex = Math.min(startIndex + batchSize, allItems.length);
        const batch = allItems.slice(startIndex, endIndex);

        setItems((prev) => [...prev, ...batch]);
        onBatchLoad?.(batch, batchIndex);

        // Small delay between batches to prevent blocking
        if (delay > 0 && i < remainingBatches - 1) {
          await new Promise((resolve) => {
            timeoutRef.current = setTimeout(resolve, delay);
          });
        }
      }

      if (mountedRef.current) {
        setCurrentBatch(totalBatches);
        setLoading(false);
        onComplete?.(allItems);
      }
    };

    loadAllBatches().catch((err) => {
      if (mountedRef.current) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        setLoading(false);
        onError?.(error);
      }
    });
  }, [
    loading,
    currentBatch,
    totalBatches,
    batchSize,
    allItems,
    delay,
    onBatchLoad,
    onComplete,
    onError,
  ]);

  const reset = useCallback(() => {
    setItems([]);
    setCurrentBatch(0);
    setLoading(false);
    setError(null);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const progress = totalBatches > 0 ? (currentBatch / totalBatches) * 100 : 0;
  const hasMore = currentBatch < totalBatches;

  return {
    items,
    loading,
    error,
    progress,
    currentBatch,
    totalBatches,
    hasMore,
    loadNext,
    reset,
    loadAll,
  };
}

/**
 * Hook for infinite scroll loading with intersection observer
 */
export function useInfiniteScroll<T>(
  loadMore: () => Promise<T[]>,
  options: {
    hasMore: boolean;
    threshold?: number;
    rootMargin?: string;
    enabled?: boolean;
  } = { hasMore: true }
) {
  const { hasMore, threshold = 0.1, rootMargin = "0px", enabled = true } = options;

  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const observerRef = useRef<HTMLDivElement>(null);

  const fetchMore = useCallback(async () => {
    if (isFetching || !hasMore || !enabled) return;

    setIsFetching(true);
    setError(null);

    try {
      await loadMore();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
    } finally {
      setIsFetching(false);
    }
  }, [isFetching, hasMore, enabled, loadMore]);

  useEffect(() => {
    const element = observerRef.current;
    if (!element || !enabled) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isFetching) {
          fetchMore();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isFetching, threshold, rootMargin, enabled, fetchMore]);

  return {
    observerRef,
    isFetching,
    error,
    fetchMore,
  };
}
