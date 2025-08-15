/**
 * @fileoverview GitHub API hook for fetching repository data with worker API fallback
 * @module hooks/useGitHubApi
 */

import { useState, useCallback } from "react";
import { FaBug, FaLightbulb, FaTag, FaQuestionCircle, FaStar, FaComments } from "react-icons/fa";

export interface IssueBreakdown {
  label: string;
  name: string;
  open: number;
  closed: number;
  total: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface IssueBreakdownRaw {
  label: string;
  name: string;
  open: number;
  closed: number;
  total: number;
  icon: string;
  color: string;
}

export interface GitHubStats {
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  closedIssues: number;
  contributors: number;
  commits: number;
  releases: number;
  lastCommit: string;
  createdAt: string;
  size: number;
  language: string;
  license: string;
  issueBreakdown?: IssueBreakdown[];
}

interface GitHubCommit {
  commit?: {
    author?: {
      date?: string;
    };
    committer?: {
      date?: string;
    };
  };
}

export interface CommitData {
  week: string;
  commits: number;
}

interface UseGitHubApiState {
  githubStats: GitHubStats | undefined;
  commitHistory: CommitData[];
  loading: boolean;
  error: string | null;
}

interface UseGitHubApiReturn extends UseGitHubApiState {
  fetchGitHubData: () => Promise<void>;
  checkRateLimit: () => Promise<boolean>;
}

const WORKER_API_URL = "https://api.precast.dev/data";
const GITHUB_REPO = "BuunGroupCore/precast-app";

/**
 * Custom hook for fetching GitHub repository data
 * Tries Cloudflare Worker API first, falls back to direct GitHub API
 */
export function useGitHubApi(): UseGitHubApiReturn {
  const [state, setState] = useState<UseGitHubApiState>({
    githubStats: undefined,
    commitHistory: [],
    loading: false,
    error: null,
  });

  /**
   * Check GitHub API rate limit
   */
  const checkRateLimit = useCallback(async (): Promise<boolean> => {
    try {
      const headers = { Accept: "application/vnd.github.v3+json" };
      const response = await fetch("https://api.github.com/rate_limit", { headers });

      if (response.ok) {
        const data = await response.json();
        return data.rate.remaining >= 5;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  /**
   * Transform icon string to React component
   */
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      FaBug,
      FaLightbulb,
      FaStar,
      FaComments,
      FaQuestionCircle,
      FaTag,
    };
    return iconMap[iconName] || FaTag;
  };

  /**
   * Fetch data from Cloudflare Worker API
   */
  const fetchFromWorker = useCallback(async (): Promise<{
    stats: GitHubStats;
    commits: CommitData[];
  } | null> => {
    try {
      console.log("Fetching from worker API:", WORKER_API_URL);
      const response = await fetch(WORKER_API_URL);

      if (!response.ok) {
        console.error("Worker API failed:", response.status, response.statusText);
        return null;
      }

      const data = await response.json();
      console.log("Worker API data received:", data.repository);

      const transformedStats: GitHubStats = {
        stars: data.repository.stars || 0,
        forks: data.repository.forks || 0,
        watchers: data.repository.watchers || 0,
        openIssues: data.repository.openIssues || 0,
        closedIssues: data.repository.closedIssues || 0,
        contributors: data.repository.contributors || 0,
        commits: data.repository.commits || 0,
        releases: data.releases?.length || 0,
        lastCommit: data.repository.pushed_at || data.lastUpdated || new Date().toISOString(),
        createdAt:
          data.repository.created_at ||
          new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
        size: data.repository.size || 2048,
        language: data.repository.language || "TypeScript",
        license: data.repository.license || "MIT",
        issueBreakdown: data.issues.breakdown.map((item: IssueBreakdownRaw) => ({
          ...item,
          icon: getIconComponent(item.icon),
        })),
      };

      console.log("Transformed stats createdAt:", transformedStats.createdAt);
      console.log("Repository created_at from API:", data.repository.created_at);

      return {
        stats: transformedStats,
        commits: data.commits?.recentActivity || [],
      };
    } catch {
      return null;
    }
  }, []);

  /**
   * Fetch data from GitHub API directly
   */
  const fetchFromGitHub = useCallback(async (): Promise<{
    stats: GitHubStats;
    commits: CommitData[];
  } | null> => {
    try {
      const headers = { Accept: "application/vnd.github.v3+json" };

      // Check rate limit first
      const hasRateLimit = await checkRateLimit();
      if (!hasRateLimit) {
        throw new Error("GitHub API rate limit exceeded");
      }

      const issueLabels = [
        { label: "bug", name: "Bug Reports", icon: FaBug, color: "text-comic-red" },
        {
          label: "enhancement",
          name: "Feature Requests",
          icon: FaLightbulb,
          color: "text-comic-yellow",
        },
        { label: "showcase", name: "Showcase Projects", icon: FaStar, color: "text-comic-purple" },
        {
          label: "testimonial-approved",
          name: "Testimonials",
          icon: FaComments,
          color: "text-comic-green",
        },
        {
          label: "documentation",
          name: "Documentation",
          icon: FaQuestionCircle,
          color: "text-comic-blue",
        },
        { label: "help%20wanted", name: "Help Wanted", icon: FaTag, color: "text-comic-orange" },
      ];

      const [
        repoData,
        contributorsData,
        commitsData,
        releasesData,
        issuesData,
        recentCommits,
        ...labelIssues
      ] = await Promise.all([
        fetch(`https://api.github.com/repos/${GITHUB_REPO}`, { headers }).then((res) =>
          res.ok ? res.json() : null
        ),
        fetch(`https://api.github.com/repos/${GITHUB_REPO}/contributors?per_page=100`, {
          headers,
        }).then((res) => (res.ok ? res.json() : [])),
        fetch(`https://api.github.com/repos/${GITHUB_REPO}/commits?per_page=100`, { headers }).then(
          (res) => (res.ok ? res.json() : [])
        ),
        fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases`, { headers }).then((res) =>
          res.ok ? res.json() : []
        ),
        fetch(
          `https://api.github.com/search/issues?q=repo:${GITHUB_REPO}+type:issue+state:closed`,
          { headers }
        ).then((res) => (res.ok ? res.json() : { total_count: 0 })),
        fetch(`https://api.github.com/repos/${GITHUB_REPO}/commits?per_page=100`, { headers }).then(
          (res) => (res.ok ? res.json() : [])
        ),
        ...issueLabels.flatMap((label) => [
          fetch(
            `https://api.github.com/search/issues?q=repo:${GITHUB_REPO}+label:${label.label}+state:open`,
            { headers }
          ).then((res) => (res.ok ? res.json() : { total_count: 0 })),
          fetch(
            `https://api.github.com/search/issues?q=repo:${GITHUB_REPO}+label:${label.label}+state:closed`,
            { headers }
          ).then((res) => (res.ok ? res.json() : { total_count: 0 })),
        ]),
      ]);

      if (!repoData) throw new Error("Failed to fetch repository data");

      // Process issue breakdown
      const issueBreakdown: IssueBreakdown[] = issueLabels.map((label, index) => {
        const openCount = labelIssues[index * 2]?.total_count || 0;
        const closedCount = labelIssues[index * 2 + 1]?.total_count || 0;
        return {
          label: label.label,
          name: label.name,
          open: openCount,
          closed: closedCount,
          total: openCount + closedCount,
          icon: label.icon,
          color: label.color,
        };
      });

      // Process commit history
      const commitHistory: CommitData[] = [];
      if (Array.isArray(recentCommits) && recentCommits.length > 0) {
        const dailyData = new Map<string, number>();
        const now = new Date();

        // Initialize last 30 days
        for (let i = 29; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(now.getDate() - i);
          const dateKey = `${date.getMonth() + 1}/${date.getDate()}`;
          dailyData.set(dateKey, 0);
        }

        // Count commits per day
        recentCommits.forEach((commit: GitHubCommit) => {
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

        commitHistory.push(
          ...Array.from(dailyData.entries()).map(([day, commits]) => ({
            week: day,
            commits,
          }))
        );
      }

      const stats: GitHubStats = {
        stars: repoData.stargazers_count || 0,
        forks: repoData.forks_count || 0,
        watchers: repoData.watchers_count || 0,
        openIssues: repoData.open_issues_count || 0,
        closedIssues: issuesData?.total_count || 0,
        contributors: Array.isArray(contributorsData) ? contributorsData.length : 0,
        commits: Array.isArray(recentCommits) ? recentCommits.length : 0,
        releases: Array.isArray(releasesData) ? releasesData.length : 0,
        lastCommit: commitsData[0]?.commit?.author?.date || repoData.pushed_at,
        createdAt: repoData.created_at,
        size: repoData.size,
        language: repoData.language,
        license: repoData.license?.name || "MIT",
        issueBreakdown,
      };

      return { stats, commits: commitHistory };
    } catch {
      return null;
    }
  }, [checkRateLimit]);

  /**
   * Get fallback data when both APIs fail
   */
  const getFallbackData = useCallback((): { stats: GitHubStats; commits: CommitData[] } => {
    const fallbackIssueBreakdown: IssueBreakdown[] = [
      {
        label: "bug",
        name: "Bug Reports",
        open: 2,
        closed: 8,
        total: 10,
        icon: FaBug,
        color: "text-comic-red",
      },
      {
        label: "enhancement",
        name: "Feature Requests",
        open: 5,
        closed: 12,
        total: 17,
        icon: FaLightbulb,
        color: "text-comic-yellow",
      },
      {
        label: "showcase",
        name: "Showcase Projects",
        open: 0,
        closed: 15,
        total: 15,
        icon: FaStar,
        color: "text-comic-purple",
      },
      {
        label: "testimonial-approved",
        name: "Testimonials",
        open: 0,
        closed: 8,
        total: 8,
        icon: FaComments,
        color: "text-comic-green",
      },
      {
        label: "documentation",
        name: "Documentation",
        open: 1,
        closed: 4,
        total: 5,
        icon: FaQuestionCircle,
        color: "text-comic-blue",
      },
      {
        label: "help wanted",
        name: "Help Wanted",
        open: 2,
        closed: 3,
        total: 5,
        icon: FaTag,
        color: "text-comic-orange",
      },
    ];

    return {
      stats: {
        stars: 25,
        forks: 8,
        watchers: 12,
        openIssues: 14,
        closedIssues: 40,
        contributors: 6,
        commits: 156,
        releases: 12,
        lastCommit: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
        size: 2048,
        language: "TypeScript",
        license: "MIT",
        issueBreakdown: fallbackIssueBreakdown,
      },
      commits: [],
    };
  }, []);

  /**
   * Main fetch function that tries worker first, then GitHub API, then fallback
   */
  const fetchGitHubData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Try worker API first
      let result = await fetchFromWorker();

      // Fallback to GitHub API
      if (!result) {
        result = await fetchFromGitHub();
      }

      // Use fallback data if both fail
      if (!result) {
        result = getFallbackData();
      }

      setState({
        githubStats: result.stats,
        commitHistory: result.commits,
        loading: false,
        error: null,
      });
    } catch (error) {
      const fallback = getFallbackData();
      setState({
        githubStats: fallback.stats,
        commitHistory: fallback.commits,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch GitHub data",
      });
    }
  }, [fetchFromWorker, fetchFromGitHub, getFallbackData]);

  return {
    ...state,
    fetchGitHubData,
    checkRateLimit,
  };
}
