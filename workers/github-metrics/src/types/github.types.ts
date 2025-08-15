/**
 * @fileoverview GitHub API type definitions
 * @module types/github
 */

/**
 * GitHub repository API response structure
 * @interface GitHubRepository
 */
export interface GitHubRepository {
  // Basic info
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  homepage: string | null;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  pushed_at: string;
  
  // Metrics
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  subscribers_count: number;
  network_count: number;
  
  // Size and stats
  size: number;
  default_branch: string;
  
  // Language and license
  language: string | null;
  license: {
    key: string;
    name: string;
    spdx_id: string;
  } | null;
  
  // Features
  has_issues: boolean;
  has_projects: boolean;
  has_downloads: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  has_discussions: boolean;
  
  // Additional info
  topics: string[];
  visibility: string;
  archived: boolean;
  disabled: boolean;
}

/**
 * GitHub contributor information
 * @interface GitHubContributor
 */
export interface GitHubContributor {
  login: string;
  id: number;
  contributions: number;
}

/**
 * GitHub commit data structure
 * @interface GitHubCommit
 */
export interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      date: string;
      name: string;
      email: string;
    };
    committer: {
      date: string;
      name: string;
      email: string;
    };
    message: string;
  };
}

/**
 * GitHub search API response
 * @interface GitHubSearchResponse
 */
export interface GitHubSearchResponse {
  total_count: number;
  items: unknown[];
}

/**
 * GitHub installation token response
 * @interface GitHubTokenResponse
 */
export interface GitHubTokenResponse {
  token: string;
  expires_at?: string;
}
