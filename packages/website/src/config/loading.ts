/**
 * Centralized loading configuration for consistent behavior across the application.
 * This configuration helps maintain consistency in loading states, timeouts, and animations.
 */

export const LOADING_CONFIG = {
  /**
   * Default timeout values for different types of operations (in milliseconds)
   */
  TIMEOUTS: {
    FAST: 5000, // Quick API calls
    MEDIUM: 15000, // Standard operations
    SLOW: 30000, // Heavy operations like file uploads
    VERY_SLOW: 60000, // Very heavy operations
  },

  /**
   * Animation durations for loading components (in seconds)
   */
  ANIMATIONS: {
    FADE: 0.3,
    SLIDE: 0.4,
    SCALE: 0.2,
    SPINNER: 1.0,
    PULSE: 1.5,
    BOUNCE: 0.8,
  },

  /**
   * Default batch sizes for progressive loading
   */
  BATCH_SIZES: {
    SMALL: 5,
    MEDIUM: 10,
    LARGE: 20,
    EXTRA_LARGE: 50,
  },

  /**
   * Progressive loading delays (in milliseconds)
   */
  PROGRESSIVE_DELAYS: {
    NONE: 0,
    FAST: 50,
    MEDIUM: 100,
    SLOW: 200,
  },

  /**
   * Cache durations for different types of data (in milliseconds)
   */
  CACHE_DURATIONS: {
    SHORT: 5 * 60 * 1000, // 5 minutes
    MEDIUM: 15 * 60 * 1000, // 15 minutes
    LONG: 60 * 60 * 1000, // 1 hour
    VERY_LONG: 24 * 60 * 60 * 1000, // 24 hours
  },

  /**
   * Default props for loading components to ensure consistency
   */
  DEFAULTS: {
    SPINNER: {
      size: "md" as const,
      variant: "dots" as const,
      color: "red" as const,
    },
    SKELETON: {
      animation: "pulse" as const,
      lines: 3,
    },
    PROGRESS: {
      size: "md" as const,
      variant: "default" as const,
      color: "blue" as const,
      animated: true,
    },
    OVERLAY: {
      backdrop: "blur" as const,
      preventScroll: true,
    },
  },

  /**
   * Accessibility settings
   */
  ACCESSIBILITY: {
    // Reduced motion support
    RESPECT_REDUCED_MOTION: true,

    // ARIA live regions
    ARIA_LIVE: "polite" as const,

    // Default ARIA labels
    LABELS: {
      LOADING: "Loading",
      PROCESSING: "Processing",
      UPLOADING: "Uploading",
      DOWNLOADING: "Downloading",
      SAVING: "Saving",
      SEARCHING: "Searching",
    },
  },

  /**
   * Performance thresholds
   */
  PERFORMANCE: {
    // Show loading indicator after this delay (prevents flash for fast operations)
    SHOW_DELAY: 200,

    // Consider operation slow after this time
    SLOW_THRESHOLD: 3000,

    // Maximum items to render without virtualization
    VIRTUALIZATION_THRESHOLD: 100,
  },

  /**
   * Error retry configuration
   */
  RETRY: {
    MAX_ATTEMPTS: 3,
    BASE_DELAY: 1000,
    EXPONENTIAL_BACKOFF: true,
    JITTER: true,
  },
} as const;

/**
 * Loading state types for better type safety
 */
export type LoadingState = "idle" | "loading" | "success" | "error";

/**
 * Common loading task identifiers
 */
export const LOADING_TASKS = {
  // Data fetching
  GITHUB_STATS: "github-stats",
  NPM_STATS: "npm-stats",
  ANALYTICS: "analytics",
  TESTIMONIALS: "testimonials",

  // User actions
  FORM_SUBMIT: "form-submit",
  FILE_UPLOAD: "file-upload",
  SEARCH: "search",

  // Navigation
  PAGE_LOAD: "page-load",
  ROUTE_CHANGE: "route-change",

  // API operations
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
  FETCH: "fetch",
} as const;

/**
 * Helper function to get timeout based on operation type
 */
export function getTimeout(operation: keyof typeof LOADING_CONFIG.TIMEOUTS): number {
  return LOADING_CONFIG.TIMEOUTS[operation];
}

/**
 * Helper function to get batch size based on data type
 */
export function getBatchSize(size: keyof typeof LOADING_CONFIG.BATCH_SIZES): number {
  return LOADING_CONFIG.BATCH_SIZES[size];
}

/**
 * Helper function to check if reduced motion is preferred
 */
export function respectsReducedMotion(): boolean {
  if (typeof window === "undefined") return false;

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Helper function to get appropriate animation duration based on reduced motion preference
 */
export function getAnimationDuration(normalDuration: number, reducedDuration: number = 0): number {
  return respectsReducedMotion() ? reducedDuration : normalDuration;
}

/**
 * Helper function to generate loading messages for different operations
 */
export function getLoadingMessage(operation: string, progress?: number): string {
  const baseMessage = LOADING_CONFIG.ACCESSIBILITY.LABELS.LOADING;

  if (progress !== undefined) {
    return `${operation} ${Math.round(progress)}% complete`;
  }

  return `${baseMessage} ${operation.toLowerCase()}...`;
}

/**
 * Helper function to determine if an operation should show loading immediately
 */
export function shouldShowImmediately(
  expectedDuration: number,
  showDelay: number = LOADING_CONFIG.PERFORMANCE.SHOW_DELAY
): boolean {
  return expectedDuration > showDelay;
}
