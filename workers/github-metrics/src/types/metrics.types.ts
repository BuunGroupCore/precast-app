/**
 * @fileoverview Metrics data type definitions
 * @module types/metrics
 */

/**
 * Issue breakdown by label
 * @interface IssueBreakdown
 */
export interface IssueBreakdown {
  /** GitHub label identifier */
  label: string;
  /** Display name for the label */
  name: string;
  /** Number of open issues */
  open: number;
  /** Number of closed issues */
  closed: number;
  /** Total issue count */
  total: number;
  /** Icon component name */
  icon: string;
  /** CSS color class */
  color: string;
}

/**
 * Daily commit activity data point
 * @interface CommitActivity
 */
export interface CommitActivity {
  /** Date in M/D format */
  week: string;
  /** Number of commits on this day */
  commits: number;
}

/**
 * GitHub release information
 * @interface Release
 */
export interface Release {
  name: string;
  tag_name: string;
  published_at: string;
  html_url: string;
}

/**
 * Complete metrics data structure returned by the API
 * @interface MetricsData
 */
export interface MetricsData {
  /** ISO timestamp of data collection */
  timestamp: string;
  /** Repository statistics */
  repository: {
    stars: number;
    forks: number;
    watchers: number;
    openIssues: number;
    closedIssues: number;
    contributors: number;
    commits: number;
    language: string;
    license: string;
  };
  /** Issue statistics and breakdown */
  issues: {
    breakdown: IssueBreakdown[];
    totalOpen: number;
    totalClosed: number;
  };
  /** Commit statistics */
  commits: {
    total: number;
    recentActivity: CommitActivity[];
  };
  /** Latest releases */
  releases: Release[];
  /** Last update timestamp */
  lastUpdated: string;
}
