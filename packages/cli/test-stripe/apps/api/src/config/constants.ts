/**
 * @fileoverview Express API configuration constants
 */

/**
 * Application configuration
 */
export const APP_CONFIG = {
  name: "test-stripe-api",
  displayName: "test-stripe API",
  description: "test-stripe API Server",
  version: "1.0.0",
  environment: process.env.NODE_ENV || "development",
} as const;

/**
 * Server configuration
 */
export const SERVER_CONFIG = {
  port: parseInt(process.env.PORT || "3001", 10),
  host: process.env.HOST || "localhost",
  apiPrefix: "/api",
} as const;

/**
 * CORS configuration
 */
export const CORS_CONFIG = {
  origin: process.env.CLIENT_URL ||
    process.env.CORS_ORIGIN?.split(",") || [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:4200",
      "http://localhost:5173",
      "http://localhost:7000",
    ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Type", "Authorization"],
};

/**
 * Health check configuration
 */
export const HEALTH_CHECK_CONFIG = {
  path: `${SERVER_CONFIG.apiPrefix}/health`,
  message: `${APP_CONFIG.displayName} is running`,
} as const;
