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
   * Fetches recent commits with pagination
   * @returns {Promise<GitHubCommit[]>} List of recent commits
   */
  async getRecentCommits(): Promise<GitHubCommit[]> {
    try {
      const allCommits: GitHubCommit[] = [];
      let page = 1;
      const maxPages = 5; // Fetch up to 500 commits (5 pages * 100)
      
      while (page <= maxPages) {
        const commits = await this.makeRequest<GitHubCommit[]>(
          `/repos/${this.owner}/${this.repo}/commits?per_page=100&page=${page}`
        );
        
        if (!commits || commits.length === 0) break;
        
        allCommits.push(...commits);
        
        // If we got less than 100, we've reached the end
        if (commits.length < 100) break;
        
        page++;
      }
      
      return allCommits;
    } catch (error) {
      // Return empty array on error to maintain backwards compatibility
      return [];
    }
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

  /**
   * Fetches pull request metrics
   * @returns {Promise<{ open: number; closed: number; merged: number }>} Pull request counts
   */
  async getPullRequestMetrics(): Promise<{ open: number; closed: number; merged: number }> {
    try {
      // Get open PRs
      const openPRs = await this.makeRequest<any[]>(
        `/repos/${this.owner}/${this.repo}/pulls?state=open&per_page=100`
      );
      
      // Get closed PRs (includes merged)
      const closedPRs = await this.makeRequest<any[]>(
        `/repos/${this.owner}/${this.repo}/pulls?state=closed&per_page=100`
      );
      
      // Count merged PRs
      const mergedCount = closedPRs.filter(pr => pr.merged_at !== null).length;
      
      return {
        open: openPRs.length,
        closed: closedPRs.length - mergedCount,
        merged: mergedCount,
      };
    } catch {
      return { open: 0, closed: 0, merged: 0 };
    }
  }

  /**
   * Fetches latest releases
   * @returns {Promise<Release[]>} List of releases
   */
  async getLatestReleases(): Promise<Release[]> {
    try {
      const releases = await this.makeRequest<any[]>(
        `/repos/${this.owner}/${this.repo}/releases?per_page=10`
      );
      
      return releases.map(release => ({
        id: release.id,
        name: release.name || release.tag_name,
        tag_name: release.tag_name,
        published_at: release.published_at,
        prerelease: release.prerelease,
        draft: release.draft,
        download_count: release.assets?.reduce((sum: number, asset: any) => 
          sum + (asset.download_count || 0), 0) || 0,
      }));
    } catch {
      return [];
    }
  }

  /**
   * Fetches sponsor information using GraphQL API
   * @param {string} organizationName - GitHub organization name for sponsors
   * @returns {Promise<{ count: number; totalMonthlyAmount: number }>} Sponsor metrics
   */
  async getSponsorMetrics(organizationName: string): Promise<{ 
    count: number; 
    totalMonthlyAmount: number;
    sponsors: Array<{ login: string; amount: number }>;
  }> {
    try {
      // GitHub GraphQL API for sponsors (requires special permissions)
      const query = `
        query {
          organization(login: "${organizationName}") {
            sponsorshipsAsMaintainer(first: 100) {
              totalCount
              edges {
                node {
                  sponsorEntity {
                    ... on User {
                      login
                    }
                    ... on Organization {
                      login
                    }
                  }
                  tier {
                    monthlyPriceInDollars
                  }
                }
              }
            }
          }
        }
      `;

      const authHeaders = await this.auth.getAuthHeaders();
      const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          ...authHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('GraphQL request failed');
      }

      const data = await response.json() as any;
      const sponsorships = data?.data?.organization?.sponsorshipsAsMaintainer;
      
      if (!sponsorships) {
        return { count: 0, totalMonthlyAmount: 0, sponsors: [] };
      }

      const sponsors = sponsorships.edges.map((edge: any) => ({
        login: edge.node.sponsorEntity?.login || 'Anonymous',
        amount: edge.node.tier?.monthlyPriceInDollars || 0,
      }));

      const totalMonthlyAmount = sponsors.reduce((sum: number, sponsor: any) => 
        sum + sponsor.amount, 0);

      return {
        count: sponsorships.totalCount,
        totalMonthlyAmount,
        sponsors: sponsors.slice(0, 10), // Top 10 sponsors
      };
    } catch (error) {
      // Sponsors API requires special permissions, return empty if failed
      return { count: 0, totalMonthlyAmount: 0, sponsors: [] };
    }
  }

  /**
   * Fetches repository traffic stats (requires admin access)
   * @returns {Promise<{ views: number; clones: number }>} Traffic metrics
   */
  async getTrafficMetrics(): Promise<{ views: number; clones: number; popular_paths: any[] }> {
    try {
      const [views, clones, paths] = await Promise.all([
        this.makeRequest<any>(`/repos/${this.owner}/${this.repo}/traffic/views`),
        this.makeRequest<any>(`/repos/${this.owner}/${this.repo}/traffic/clones`),
        this.makeRequest<any>(`/repos/${this.owner}/${this.repo}/traffic/popular/paths`),
      ]);

      return {
        views: views.count || 0,
        clones: clones.count || 0,
        popular_paths: paths || [],
      };
    } catch {
      // Traffic API requires admin access
      return { views: 0, clones: 0, popular_paths: [] };
    }
  }

  /**
   * Fetches code frequency stats
   * @returns {Promise<{ additions: number; deletions: number }>} Code change metrics
   */
  async getCodeFrequency(): Promise<{ additions: number; deletions: number }> {
    try {
      const stats = await this.makeRequest<number[][]>(
        `/repos/${this.owner}/${this.repo}/stats/code_frequency`
      );
      
      // Sum up last 4 weeks of additions and deletions
      const recentStats = stats.slice(-4);
      const additions = recentStats.reduce((sum, week) => sum + (week[1] || 0), 0);
      const deletions = Math.abs(recentStats.reduce((sum, week) => sum + (week[2] || 0), 0));
      
      return { additions, deletions };
    } catch {
      return { additions: 0, deletions: 0 };
    }
  }
}
