/**
 * Common types used across the application
 */

/**
 * Base API response structure
 */
export interface BaseResponse<T = unknown> {
  data: T;
  error?: string;
  status: number;
}

/**
 * Paginated API response structure
 */
export interface PaginatedResponse<T> extends BaseResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
}

/**
 * Async operation state structure
 */
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Common status states for async operations
 */
export type Status = "idle" | "loading" | "success" | "error";

/**
 * Loading state structure with status and optional error
 */
export interface LoadingState {
  status: Status;
  error?: Error;
}

/**
 * Menu item configuration for navigation components
 */
export interface MenuItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ComponentType;
  children?: MenuItem[];
}

/**
 * Theme configuration object
 */
export interface Theme {
  name: string;
  value: "light" | "dark" | "system";
  icon: React.ComponentType;
}

/**
 * Sponsor data structure for funding/support information
 */
export interface Sponsor {
  login: string;
  name: string;
  avatarUrl: string;
  url: string;
  monthlyAmount: number;
  totalAmount: number;
  tier: "diamond" | "platinum" | "gold" | "silver" | "bronze";
  joinedDate: string;
  isOrganization: boolean;
}
