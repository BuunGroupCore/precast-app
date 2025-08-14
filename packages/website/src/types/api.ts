/**
 * API-related types
 */

/**
 * GitHub repository API response structure
 */
export interface GitHubRepoResponse {
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  language: string;
  created_at: string;
  updated_at: string;
  description: string;
  homepage: string;
  topics: string[];
}

/**
 * GitHub contributor data structure
 */
export interface GitHubContributor {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type: "User" | "Bot";
}

/**
 * NPM package registry API response structure
 */
export interface NpmPackageResponse {
  name: string;
  version: string;
  description: string;
  keywords: string[];
  homepage: string;
  repository: {
    type: string;
    url: string;
  };
  versions: Record<string, NpmVersion>;
  "dist-tags": {
    latest: string;
    [key: string]: string;
  };
}

/**
 * NPM package version information
 */
export interface NpmVersion {
  name: string;
  version: string;
  dist: {
    unpackedSize: number;
    fileCount: number;
    tarball: string;
  };
}

/**
 * NPM download statistics API response
 */
export interface NpmDownloadResponse {
  downloads: number;
  start: string;
  end: string;
  package: string;
}

/**
 * NPM download statistics over a date range
 */
export interface NpmDownloadRangeResponse {
  start: string;
  end: string;
  package: string;
  downloads: Array<{
    downloads: number;
    day: string;
  }>;
}
