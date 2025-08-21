/**
 * Environment Utilities
 * Framework-specific environment variable access and utilities
 */

/**
 * Framework-specific environment variable access
 * Gets the API URL based on the current framework
 */
export const getApiUrl = (): string | undefined => {
  return import.meta.env.VITE_API_URL;
};

/**
 * Check if we're in development mode
 * Framework-specific development environment detection
 */
export const isDevelopment = (): boolean => {
  return import.meta.env.DEV || import.meta.env.MODE === "development";
};

/**
 * Get API headers with framework-specific considerations
 * Includes special headers for tunneling services like ngrok
 */
export const getApiHeaders = (apiUrl?: string): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  return headers;
};

/**
 * Get simple headers for GET requests
 */
export const getSimpleApiHeaders = (apiUrl?: string): HeadersInit => {
  const headers: HeadersInit = {};

  return headers;
};

/**
 * Get the auth-specific API URL
 * Uses local proxy for auth endpoints to handle cookies properly
 */
export const getAuthApiUrl = (): string => {
  // Use direct API URL when not using tunneling services
  return getApiUrl() || "";
};

/**
 * Get environment-specific configuration
 */
export const getEnvironmentConfig = () => {
  return {
    apiUrl: getApiUrl(),
    isDev: isDevelopment(),
    framework: "react",
    backend: "express",
    database: "postgres",
    styling: "css",
    docker: false,
    powerups: [],
    plugins: ["stripe"],
  };
};

/**
 * Validate API URL format
 */
export const isValidApiUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get default ports for different services
 */
export const getDefaultPorts = () => {
  return {
    api: 3001,
    database: true,
    redis: 6379,
    elasticsearch: 9200,
  };
};
