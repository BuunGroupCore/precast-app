/**
 * API-related types
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

export interface GitHubContributor {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type: "User" | "Bot";
}

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

export interface NpmVersion {
  name: string;
  version: string;
  dist: {
    unpackedSize: number;
    fileCount: number;
    tarball: string;
  };
}

export interface NpmDownloadResponse {
  downloads: number;
  start: string;
  end: string;
  package: string;
}

export interface NpmDownloadRangeResponse {
  start: string;
  end: string;
  package: string;
  downloads: Array<{
    downloads: number;
    day: string;
  }>;
}
