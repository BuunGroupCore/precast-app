/**
 * @fileoverview GitHub API type definitions
 * @module types/github
 */

/**
 * GitHub repository API response structure
 * @interface GitHubRepository
 */
export interface GitHubRepository {
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  language: string | null;
  license: {
    name: string;
  } | null;
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
