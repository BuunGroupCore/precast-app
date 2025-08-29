/**
 * @fileoverview Application configuration constants
 */

/**
 * Application configuration
 */
export const APP_CONFIG = {
  name: 'test-mcp2',
  displayName: 'test-mcp2',
  description: 'A modern React application',
  version: '1.0.0',
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
} as const;

/**
 * SEO configuration
 */
export const SEO_CONFIG = {
  title: `${APP_CONFIG.displayName}`,
  description: APP_CONFIG.description,
  keywords: ['test-mcp2', 'React', 'TypeScript'],
  ogImage: '/og-image.png',
} as const;

/**
 * Social media links
 */
export const SOCIAL_MEDIA = {
  github: 'https://github.com/test-mcp2',
  twitter: 'https://twitter.com/test-mcp2',
  linkedin: 'https://linkedin.com/company/test-mcp2',
} as const;

/**
 * Feature flags
 */
export const FEATURES = {
  analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  pwa: import.meta.env.VITE_ENABLE_PWA === 'true',
  notifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
} as const;
