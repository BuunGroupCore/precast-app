// Shared constants between frontend and backend

export const API_VERSION = "v1";

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
  UNAUTHORIZED: "You are not authorized to perform this action",
  NOT_FOUND: "Resource not found",
  INTERNAL_ERROR: "An internal server error occurred",
  INVALID_INPUT: "Invalid input provided",
  DUPLICATE_ENTRY: "A record with this value already exists",
} as const;

export const SUCCESS_MESSAGES = {
  CREATED: "Resource created successfully",
  UPDATED: "Resource updated successfully",
  DELETED: "Resource deleted successfully",
} as const;

// Environment-specific settings
export const IS_PRODUCTION = process.env.NODE_ENV === "production";
export const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
export const IS_TEST = process.env.NODE_ENV === "test";
