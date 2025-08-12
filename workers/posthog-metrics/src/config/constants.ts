/**
 * @fileoverview Constants and configuration for PostHog metrics worker
 * @module config/constants
 */

/**
 * CORS headers for API responses
 */
export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
} as const;

/**
 * Rate limiting configuration
 */
export const RATE_LIMITS = {
  /** Minimum time between manual refreshes (5 minutes) */
  REFRESH_INTERVAL: 5 * 60 * 1000,
  /** Scheduled update interval (6 hours) */
  SCHEDULED_INTERVAL: 6 * 60 * 60 * 1000,
} as const;

/**
 * PostHog API configuration
 */
export const POSTHOG_CONFIG = {
  DEFAULT_HOST: "https://app.posthog.com",
  API_VERSION: "v1",
  TIMEOUT: 30000,
} as const;

/**
 * Data retention configuration
 */
export const DATA_RETENTION = {
  METRICS_TTL: 7 * 24 * 60 * 60, // 7 days in seconds
  CSV_TTL: 30 * 24 * 60 * 60, // 30 days in seconds
} as const;

/**
 * Framework list for tracking
 */
export const FRAMEWORKS = [
  "react",
  "vue",
  "angular",
  "next",
  "nuxt",
  "svelte",
  "solid",
  "remix",
  "astro",
  "vite",
  "vanilla",
] as const;

/**
 * Feature list for tracking
 */
export const FEATURES = [
  "typescript",
  "docker",
  "git",
  "eslint",
  "prettier",
  "tailwind",
  "prisma",
  "drizzle",
  "auth",
  "api-client",
  "shadcn",
  "better-auth",
] as const;