/**
 * @fileoverview GitHub API client service for fetching repository metrics
 * @module services/github-client
 */

import { API_CONFIG, ISSUE_LABELS } from "../config/constants";
import type {
  GitHubRepository,
  GitHubContributor,
  GitHubCommit,
  GitHubSearchResponse,
  IssueBreakdown,
  CommitActivity,
  Release,
} from "../types";

import { GitHubAuthService } from "./github-auth.service";

/**
 * GitHub API client for fetching repository metrics
 * @class GitHubClientService
 */
export class GitHubClientService {
  private readonly auth: GitHubAuthService;
  private readonly owner: string;
  private readonly repo: string;
  private readonly baseUrl = API_CONFIG.GITHUB_BASE_URL;

  /**
   * Creates an instance of GitHubClientService
   * @param {GitHubAuthService} auth - Authentication service instance
   * @param {string} owner - Repository owner/organization
   * @param {string} repo - Repository name
   */
  constructor(auth: GitHubAuthService, owner: string, repo: string) {
    this.auth = auth;
    this.owner = owner;
    this.repo = repo;
  }

  /**
   * Makes an authenticated request to the GitHub API
   * @private
   * @template T
   * @param {string} endpoint - API endpoint path
   * @returns {Promise<T>} Parsed JSON response
   * @throws {Error} If request fails
   */
  private async makeRequest<T>(endpoint: string): Promise<T> {
    const authHeaders = await this.auth.getAuthHeaders();
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        ...authHeaders,
        "User-Agent": API_CONFIG.USER_AGENT,
      },
    });

    if (!response.ok) {
      await response.text();
      throw new Error(
        `GitHub API request failed: ${endpoint} - ${response.status} ${response.statusText}`
      );
    }

    return response.json() as Promise<T>;
  }

  /**
   * Fetches repository metadata
   * @returns {Promise<GitHubRepository>} Repository data
   */
  async getRepositoryData(): Promise<GitHubRepository> {
    return this.makeRequest<GitHubRepository>(`/repos/${this.owner}/${this.repo}`);
  }

  /**
   * Fetches repository contributors
   * @returns {Promise<GitHubContributor[]>} List of contributors
   */
  async getContributors(): Promise<GitHubContributor[]> {
    return this.makeRequest<GitHubContributor[]>(
      `/repos/${this.owner}/${this.repo}/contributors?per_page=100`
    );
  }

  /**
   * Fetches recent commits
   * @returns {Promise<GitHubCommit[]>} List of recent commits
   */
  async getRecentCommits(): Promise<GitHubCommit[]> {
    return this.makeRequest<GitHubCommit[]>(
      `/repos/${this.owner}/${this.repo}/commits?per_page=100`
    );
  }

  /**
   * Fetches repository releases
   * @returns {Promise<Release[]>} List of releases
   */
  async getReleases(): Promise<Release[]> {
    return this.makeRequest<Release[]>(`/repos/${this.owner}/${this.repo}/releases`);
  }

  /**
   * Gets count of closed issues
   * @returns {Promise<number>} Total count of closed issues
   */
  async getClosedIssuesCount(): Promise<number> {
    const response = await this.makeRequest<GitHubSearchResponse>(
      `/search/issues?q=repo:${this.owner}/${this.repo}+type:issue+state:closed`
    );
    return response.total_count;
  }

  /**
   * Gets issue count by label and state
   * @param {string} label - Issue label to filter by
   * @param {"open" | "closed"} state - Issue state
   * @returns {Promise<number>} Count of matching issues
   */
  async getIssuesByLabel(label: string, state: "open" | "closed" = "open"): Promise<number> {
    const response = await this.makeRequest<GitHubSearchResponse>(
      `/search/issues?q=repo:${this.owner}/${this.repo}+label:${encodeURIComponent(
        label
      )}+state:${state}`
    );
    return response.total_count;
  }

  /**
   * Gets issue breakdown by configured labels
   * @returns {Promise<IssueBreakdown[]>} Issue counts by label
   */
  async getIssueBreakdown(): Promise<IssueBreakdown[]> {
    const breakdown: IssueBreakdown[] = [];

    for (const labelConfig of ISSUE_LABELS) {
      try {
        const [openCount, closedCount] = await Promise.all([
          this.getIssuesByLabel(labelConfig.label, "open"),
          this.getIssuesByLabel(labelConfig.label, "closed"),
        ]);

        breakdown.push({
          ...labelConfig,
          open: openCount,
          closed: closedCount,
          total: openCount + closedCount,
        });
      } catch (error) {
        breakdown.push({
          ...labelConfig,
          open: 0,
          closed: 0,
          total: 0,
        });
      }
    }

    return breakdown;
  }

  /**
   * Gets daily commit activity for the last 30 days
   * @returns {Promise<CommitActivity[]>} Daily commit counts
   */
  async getCommitActivity(): Promise<CommitActivity[]> {
    try {
      const commits = await this.getRecentCommits();
      const now = new Date();
      const dailyData = new Map<string, number>();

      for (let i = 0; i < 30; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateKey = `${date.getMonth() + 1}/${date.getDate()}`;
        dailyData.set(dateKey, 0);
      }

      commits.forEach((commit) => {
        const dateString = commit.commit?.author?.date || commit.commit?.committer?.date;
        if (dateString) {
          const commitDate = new Date(dateString);
          if (!isNaN(commitDate.getTime())) {
            const dateKey = `${commitDate.getMonth() + 1}/${commitDate.getDate()}`;

            const daysAgo = Math.floor(
              (now.getTime() - commitDate.getTime()) / (24 * 60 * 60 * 1000)
            );
            if (daysAgo < 30) {
              const currentCount = dailyData.get(dateKey) || 0;
              dailyData.set(dateKey, currentCount + 1);
            }
          }
        }
      });

      return Array.from(dailyData.entries())
        .map(([week, commits]) => ({ week, commits }))
        .reverse();
    } catch {
      return [];
    }
  }
}
