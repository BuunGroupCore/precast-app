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
  id?: number;
  name: string;
  tag_name: string;
  published_at: string;
  html_url?: string;
  prerelease?: boolean;
  draft?: boolean;
  download_count?: number;
}

/**
 * Pull request metrics
 * @interface PullRequestMetrics
 */
export interface PullRequestMetrics {
  open: number;
  closed: number;
  merged: number;
}

/**
 * Sponsor information
 * @interface SponsorMetrics
 */
export interface SponsorMetrics {
  count: number;
  totalMonthlyAmount: number;
  sponsors: Array<{
    login: string;
    amount: number;
  }>;
}

/**
 * Traffic metrics
 * @interface TrafficMetrics
 */
export interface TrafficMetrics {
  views: number;
  clones: number;
  popular_paths: Array<{
    path: string;
    title: string;
    count: number;
    uniques: number;
  }>;
}

/**
 * Code frequency metrics
 * @interface CodeFrequencyMetrics
 */
export interface CodeFrequencyMetrics {
  additions: number;
  deletions: number;
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
    created_at?: string;
    updated_at?: string;
    pushed_at?: string;
    topics?: string[];
    size?: number;
    default_branch?: string;
    visibility?: string;
    archived?: boolean;
    disabled?: boolean;
    has_issues?: boolean;
    has_projects?: boolean;
    has_wiki?: boolean;
    has_pages?: boolean;
    has_discussions?: boolean;
    subscribers_count?: number;
    network_count?: number;
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
  /** Pull request metrics */
  pullRequests?: PullRequestMetrics;
  /** Latest releases */
  releases: Release[];
  /** Sponsor metrics */
  sponsors?: SponsorMetrics;
  /** Traffic metrics */
  traffic?: TrafficMetrics;
  /** Code frequency metrics */
  codeFrequency?: CodeFrequencyMetrics;
  /** Last update timestamp */
  lastUpdated: string;
}
