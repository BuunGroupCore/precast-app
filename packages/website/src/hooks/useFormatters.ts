/**
 * @fileoverview Formatting utilities hook for numbers, dates, and other display values
 * @module hooks/useFormatters
 */

import { useCallback } from "react";

interface UseFormattersReturn {
  formatNumber: (num: number) => string;
  formatDate: (dateString: string) => string;
  calculateProjectAge: (createdAt: string) => string;
  formatFileSize: (bytes: number) => string;
  formatDuration: (milliseconds: number) => string;
}

/**
 * Custom hook providing various formatting utilities
 */
export function useFormatters(): UseFormattersReturn {
  /**
   * Format numbers with K/M suffixes
   */
  const formatNumber = useCallback((num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  }, []);

  /**
   * Format date to relative time (e.g., "2 days ago", "Yesterday")
   */
  const formatDate = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }, []);

  /**
   * Calculate project age from creation date
   */
  const calculateProjectAge = useCallback((createdAt: string): string => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  }, []);

  /**
   * Format file size in bytes to human readable format
   */
  const formatFileSize = useCallback((bytes: number): string => {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(unitIndex === 0 ? 0 : 1)}${units[unitIndex]}`;
  }, []);

  /**
   * Format duration in milliseconds to human readable format
   */
  const formatDuration = useCallback((milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }, []);

  return {
    formatNumber,
    formatDate,
    calculateProjectAge,
    formatFileSize,
    formatDuration,
  };
}
