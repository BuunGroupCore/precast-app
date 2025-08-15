/**
 * @fileoverview Data processor service for collecting and aggregating GitHub metrics
 * @module services/data-processor
 */

import { FALLBACK_METRICS } from "../config/constants";
import type { MetricsData, GitHubRepository, Release } from "../types";

import { GitHubClientService } from "./github-client.service";

/**
 * Processes and aggregates GitHub metrics data
 * @class DataProcessorService
 */
export class DataProcessorService {
  private readonly client: GitHubClientService;

  /**
   * Creates an instance of DataProcessorService
   * @param {GitHubClientService} client - GitHub API client
   */
  constructor(client: GitHubClientService) {
    this.client = client;
  }

  /**
   * Collects all metrics from GitHub API
   * @returns {Promise<MetricsData>} Complete metrics data
   */
  async collectAllMetrics(): Promise<MetricsData> {
    try {
      const [
        repoData,
        contributors,
        commits,
        releases,
        closedIssuesCount,
        issueBreakdown,
        commitActivity,
        pullRequests,
        latestReleases,
        sponsors,
        traffic,
        codeFrequency,
      ] = await Promise.all([
        this.client.getRepositoryData().catch((err) => {
          throw err;
        }),
        this.client.getContributors().catch(() => []),
        this.client.getRecentCommits().catch(() => []),
        this.client.getReleases().catch(() => []),
        this.client.getClosedIssuesCount().catch(() => 0),
        this.client.getIssueBreakdown().catch(() => []),
        this.client.getCommitActivity().catch(() => []),
        this.client.getPullRequestMetrics().catch(() => ({ open: 0, closed: 0, merged: 0 })),
        this.client.getLatestReleases().catch(() => []),
        this.client.getSponsorMetrics("precast-app").catch(() => ({ count: 0, totalMonthlyAmount: 0, sponsors: [] })),
        this.client.getTrafficMetrics().catch(() => ({ views: 0, clones: 0, popular_paths: [] })),
        this.client.getCodeFrequency().catch(() => ({ additions: 0, deletions: 0 })),
      ]);

      const timestamp = new Date().toISOString();
      const repo = repoData as GitHubRepository;

      const metrics: MetricsData = {
        timestamp,
        repository: {
          stars: repo.stargazers_count || 0,
          forks: repo.forks_count || 0,
          watchers: repo.watchers_count || 0,
          openIssues: repo.open_issues_count || 0,
          closedIssues: closedIssuesCount,
          contributors: Array.isArray(contributors) ? contributors.length : 0,
          commits: Array.isArray(commits) ? commits.length : 0,
          language: repo.language || "TypeScript",
          license: repo.license?.name || "MIT",
          created_at: repo.created_at,
          updated_at: repo.updated_at,
          pushed_at: repo.pushed_at,
          topics: repo.topics,
          size: repo.size,
          default_branch: repo.default_branch,
          visibility: repo.visibility,
          archived: repo.archived,
          disabled: repo.disabled,
          has_issues: repo.has_issues,
          has_projects: repo.has_projects,
          has_wiki: repo.has_wiki,
          has_pages: repo.has_pages,
          has_discussions: repo.has_discussions,
          subscribers_count: repo.subscribers_count,
          network_count: repo.network_count,
        },
        issues: {
          breakdown: issueBreakdown,
          totalOpen: repo.open_issues_count || 0,
          totalClosed: closedIssuesCount,
        },
        commits: {
          total: Array.isArray(commits) ? commits.length : 0,
          recentActivity: commitActivity,
        },
        pullRequests,
        releases: (latestReleases as Release[])?.slice(0, 10) || [],
        sponsors,
        traffic,
        codeFrequency,
        lastUpdated: timestamp,
      };

      return metrics;
    } catch (error) {
      return this.getFallbackMetrics();
    }
  }

  /**
   * Returns fallback metrics when API calls fail
   * @private
   * @returns {MetricsData} Fallback metrics data
   */
  private getFallbackMetrics(): MetricsData {
    const timestamp = new Date().toISOString();

    return {
      timestamp,
      repository: FALLBACK_METRICS.repository,
      issues: {
        breakdown: [
          {
            label: "bug",
            name: "Bug Reports",
            open: 2,
            closed: 8,
            total: 10,
            icon: "FaBug",
            color: "text-comic-red",
          },
          {
            label: "enhancement",
            name: "Feature Requests",
            open: 5,
            closed: 12,
            total: 17,
            icon: "FaLightbulb",
            color: "text-comic-yellow",
          },
          {
            label: "showcase",
            name: "Showcase Projects",
            open: 0,
            closed: 15,
            total: 15,
            icon: "FaStar",
            color: "text-comic-purple",
          },
          {
            label: "testimonial-approved",
            name: "Testimonials",
            open: 0,
            closed: 8,
            total: 8,
            icon: "FaComments",
            color: "text-comic-green",
          },
        ],
        ...FALLBACK_METRICS.issues,
      },
      commits: {
        ...FALLBACK_METRICS.commits,
        recentActivity: [...FALLBACK_METRICS.commits.recentActivity],
      },
      releases: [...FALLBACK_METRICS.releases],
      lastUpdated: timestamp,
    };
  }
}
