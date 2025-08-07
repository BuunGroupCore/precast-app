/**
 * Common types used across the application
 */

export interface BaseResponse<T = unknown> {
  data: T;
  error?: string;
  status: number;
}

export interface PaginatedResponse<T> extends BaseResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export type Status = "idle" | "loading" | "success" | "error";

export interface LoadingState {
  status: Status;
  error?: Error;
}

export interface MenuItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ComponentType;
  children?: MenuItem[];
}

export interface Theme {
  name: string;
  value: "light" | "dark" | "system";
  icon: React.ComponentType;
}

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
