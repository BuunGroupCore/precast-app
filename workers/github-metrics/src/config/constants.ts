/**
 * @fileoverview Application constants and configuration
 * @module config/constants
 */

/**
 * API configuration constants
 */
export const API_CONFIG = {
  GITHUB_BASE_URL: "https://api.github.com",
  USER_AGENT: "Precast-App-Metrics-Worker/1.0",
} as const;

/**
 * Rate limiting configuration
 */
export const RATE_LIMITS = {
  /** Manual refresh cooldown in milliseconds (5 minutes) */
  REFRESH_COOLDOWN: 5 * 60 * 1000,
  /** Token cache duration in milliseconds (50 minutes) */
  TOKEN_CACHE_DURATION: 50 * 60 * 1000,
  /** Buffer before token expiry in milliseconds (10 minutes) */
  TOKEN_EXPIRY_BUFFER: 10 * 60 * 1000,
} as const;

/**
 * Issue labels configuration for tracking
 */
export const ISSUE_LABELS = [
  {
    label: "bug",
    name: "Bug Reports",
    icon: "FaBug",
    color: "text-comic-red",
  },
  {
    label: "enhancement",
    name: "Feature Requests",
    icon: "FaLightbulb",
    color: "text-comic-yellow",
  },
  {
    label: "showcase",
    name: "Showcase Projects",
    icon: "FaStar",
    color: "text-comic-purple",
  },
  {
    label: "testimonial-approved",
    name: "Testimonials",
    icon: "FaComments",
    color: "text-comic-green",
  },
  {
    label: "documentation",
    name: "Documentation",
    icon: "FaQuestionCircle",
    color: "text-comic-blue",
  },
  {
    label: "help wanted",
    name: "Help Wanted",
    icon: "FaTag",
    color: "text-comic-orange",
  },
] as const;

/**
 * CORS headers configuration
 */
export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "public, max-age=300",
} as const;

/**
 * Fallback data for error scenarios
 */
export const FALLBACK_METRICS = {
  repository: {
    stars: 125,
    forks: 28,
    watchers: 15,
    openIssues: 8,
    closedIssues: 45,
    contributors: 12,
    commits: 89,
    language: "TypeScript",
    license: "MIT",
  },
  issues: {
    totalOpen: 8,
    totalClosed: 45,
  },
  commits: {
    total: 89,
    recentActivity: [],
  },
  releases: [],
} as const;
