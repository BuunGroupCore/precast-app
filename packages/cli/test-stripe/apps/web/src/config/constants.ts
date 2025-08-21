/**
 * @fileoverview Application configuration constants
 */

/**
 * Application configuration
 */
export const APP_CONFIG = {
  name: "test-stripe",
  displayName: "test-stripe",
  description: "A modern React application",
  version: "1.0.0",
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:3001",
} as const;

/**
 * SEO configuration
 */
export const SEO_CONFIG = {
  title: `${APP_CONFIG.displayName}`,
  description: APP_CONFIG.description,
  keywords: ["test-stripe", "React", "TypeScript"],
  ogImage: "/og-image.png",
} as const;

/**
 * Social media links
 */
export const SOCIAL_MEDIA = {
  github: "https://github.com/test-stripe",
  twitter: "https://twitter.com/test-stripe",
  linkedin: "https://linkedin.com/company/test-stripe",
} as const;

/**
 * Feature flags
 */
export const FEATURES = {
  analytics: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
  pwa: import.meta.env.VITE_ENABLE_PWA === "true",
  notifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS === "true",
} as const;
