// Shared types between frontend and backend
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API endpoint types
export type ApiEndpoint =
  | "/api/health"
  | "/api/users"
  | "/api/auth/login"
  | "/api/auth/logout"
  | "/api/auth/register";

// Environment types
export type Environment = "development" | "production" | "test";

// Re-export Prisma types if using Prisma
export type { Prisma } from "@prisma/client";
