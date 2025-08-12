/**
 * @fileoverview Data processing service for PostHog metrics
 * @module services/data-processor
 */

import type {
  PostHogMetricsData,
  EventBreakdown,
  TimelineData,
  RawEventData,
  FrameworkUsage,
  FeatureUsage,
  PostHogEventResponse,
  PostHogPersonResponse,
} from "../types";
import { AdvancedMetricsService } from "./advanced-metrics.service";

export class DataProcessorService {
  private advancedMetrics: AdvancedMetricsService;

  constructor() {
    this.advancedMetrics = new AdvancedMetricsService();
  }

  /**
   * Process raw PostHog data into structured metrics
   */
  processMetrics(data: {
    events: PostHogEventResponse;
    persons: PostHogPersonResponse;
    projectId: string;
  }): PostHogMetricsData {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Process events
    const eventBreakdown = this.calculateEventBreakdown(data.events);
    const timeline = this.generateTimeline(data.events);

    // Calculate usage metrics
    const eventsLast7Days = this.countEventsInRange(data.events, sevenDaysAgo, now);
    const eventsLast30Days = this.countEventsInRange(data.events, thirtyDaysAgo, now);

    // Process framework and feature usage
    const frameworkBreakdown = this.extractFrameworkUsage(data.events);
    const featureBreakdown = this.extractFeatureUsage(data.events);

    // Calculate advanced metrics
    const stackCombinations = this.advancedMetrics.analyzeStackCombinations(data.events);
    const developerExperience = this.advancedMetrics.calculateDeveloperExperience(data.events);
    const performance = this.advancedMetrics.calculatePerformanceMetrics(data.events);
    const userJourney = this.advancedMetrics.analyzeUserJourneys(data.events);
    const aiAutomation = this.advancedMetrics.calculateAIAutomationMetrics(data.events);
    const errors = this.advancedMetrics.analyzeErrorMetrics(data.events);
    const plugins = this.advancedMetrics.analyzePluginMetrics(data.events);
    const quality = this.advancedMetrics.calculateQualityMetrics(data.events);
    const templates = this.advancedMetrics.calculateTemplateMetrics(data.events);
    const userPreferences = this.advancedMetrics.calculateUserPreferenceMetrics(data.events);

    return {
      timestamp: now.toISOString(),
      project: {
        name: "Precast App",
        id: data.projectId,
      },
      usage: {
        totalEvents: data.events.results?.length || 0,
        uniqueUsers: data.persons.count || 0,
        eventsLast30Days,
        eventsLast7Days,
        activeUsersLast30Days: this.countActiveUsers(data.persons, thirtyDaysAgo),
        activeUsersLast7Days: this.countActiveUsers(data.persons, sevenDaysAgo),
      },
      events: {
        breakdown: eventBreakdown,
        topEvents: eventBreakdown.slice(0, 10),
        timeline: this.getRawEvents(data.events), // Include raw events with all properties
        dailyTimeline: timeline, // Keep daily aggregation for charts
      },
      frameworks: {
        breakdown: frameworkBreakdown,
        topFrameworks: this.getTopItems(frameworkBreakdown, "framework"),
      },
      features: {
        breakdown: featureBreakdown,
        topFeatures: this.getTopItems(featureBreakdown, "feature"),
      },
      // Advanced metrics
      stackCombinations,
      developerExperience,
      performance,
      userJourney,
      aiAutomation,
      errors,
      plugins,
      quality,
      templates,
      userPreferences,
      lastUpdated: now.toISOString(),
    };
  }

  /**
   * Calculate event breakdown
   */
  private calculateEventBreakdown(events: PostHogEventResponse): EventBreakdown[] {
    const eventCounts = new Map<string, number>();

    if (events.results) {
      for (const event of events.results) {
        const count = eventCounts.get(event.event) || 0;
        eventCounts.set(event.event, count + 1);
      }
    }

    const total = Array.from(eventCounts.values()).reduce((sum, count) => sum + count, 0);

    return Array.from(eventCounts.entries())
      .map(([event, count]) => ({
        event,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Generate timeline data
   */
  private generateTimeline(events: PostHogEventResponse): TimelineData[] {
    const dailyCounts = new Map<string, number>();

    if (events.results) {
      for (const event of events.results) {
        const date = new Date(event.timestamp).toISOString().split("T")[0];
        const count = dailyCounts.get(date) || 0;
        dailyCounts.set(date, count + 1);
      }
    }

    return Array.from(dailyCounts.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Get raw events with all properties for detailed analysis
   */
  private getRawEvents(events: PostHogEventResponse): RawEventData[] {
    if (!events.results) return [];
    
    return events.results.map(event => ({
      event: event.event,
      timestamp: event.timestamp,
      properties: event.properties || {},
      // Extract commonly used properties for easier access
      cli_version: event.properties?.cli_version,
      cli_version_major: event.properties?.cli_version_major,
      platform: event.properties?.platform,
      platform_display: event.properties?.platform_display,
      platform_arch: event.properties?.platform_arch,
      platform_type: event.properties?.platform_type,
      platform_release: event.properties?.platform_release,
      node_version: event.properties?.node_version,
      node_version_major: event.properties?.node_version_major,
      framework: event.properties?.framework,
      backend: event.properties?.backend,
      database: event.properties?.database,
      orm: event.properties?.orm,
      styling: event.properties?.styling,
      packageManager: event.properties?.packageManager,
      sessionId: event.properties?.sessionId,
      source: event.properties?.source,
    }));
  }

  /**
   * Extract framework usage from events
   */
  private extractFrameworkUsage(events: PostHogEventResponse): Record<string, number> {
    const frameworks: Record<string, number> = {};
    const frameworkNames = [
      "react",
      "vue",
      "angular",
      "next",
      "nuxt",
      "svelte",
      "solid",
      "remix",
      "astro",
      "vite",
      "tanstack-start",
    ];

    if (events.results) {
      for (const event of events.results) {
        if (event.properties?.framework) {
          const frameworkValue = event.properties.framework;
          if (typeof frameworkValue === "string") {
            const framework = frameworkValue.toLowerCase();
            if (frameworkNames.includes(framework)) {
              frameworks[framework] = (frameworks[framework] || 0) + 1;
            }
          }
        }
      }
    }

    return frameworks;
  }

  /**
   * Extract feature usage from events
   */
  private extractFeatureUsage(events: PostHogEventResponse): Record<string, number> {
    const features: Record<string, number> = {};
    const featureKeys = [
      "auth", 
      "authProvider",
      "database", 
      "orm", 
      "styling", 
      "uiLibrary", 
      "ui_library",
      "apiClient", 
      "docker",
      "typescript",
      "eslint",
      "prettier",
      "testing",
      "cicd",
      "husky",
      "lintStaged",
      "documentation",
      "aiAssistant",
      "git",
      "packageManager",
      "autoInstall",
      "securityAuditPassed"
    ];

    if (events.results) {
      for (const event of events.results) {
        for (const key of featureKeys) {
          // Handle both camelCase and snake_case
          const value = event.properties?.[key] || 
                       event.properties?.[key.replace(/([A-Z])/g, '_$1').toLowerCase()];
          
          if (value !== undefined && value !== null && value !== "none") {
            // Handle boolean values
            if (typeof value === "boolean") {
              if (value === true) {
                features[key] = (features[key] || 0) + 1;
              }
            }
            // Handle string values
            else if (typeof value === "string" && value.trim() !== "") {
              const feature = `${key}:${value}`;
              features[feature] = (features[feature] || 0) + 1;
            }
          }
        }
        
        // Handle powerups, plugins, mcpServers arrays
        const arrayFields = ["powerups", "plugins", "mcpServers"];
        for (const field of arrayFields) {
          const value = event.properties?.[field];
          if (value) {
            // Handle comma-separated strings
            if (typeof value === "string" && value.trim() !== "") {
              const items = value.split(",").map(item => item.trim()).filter(Boolean);
              for (const item of items) {
                const feature = `${field}:${item}`;
                features[feature] = (features[feature] || 0) + 1;
              }
            }
            // Handle arrays
            else if (Array.isArray(value)) {
              for (const item of value) {
                if (item && typeof item === "string") {
                  const feature = `${field}:${item}`;
                  features[feature] = (features[feature] || 0) + 1;
                }
              }
            }
          }
        }
      }
    }

    return features;
  }

  /**
   * Count events in date range
   */
  private countEventsInRange(events: PostHogEventResponse, start: Date, end: Date): number {
    if (!events.results) return 0;

    return events.results.filter((event) => {
      const eventDate = new Date(event.timestamp);
      return eventDate >= start && eventDate <= end;
    }).length;
  }

  /**
   * Count active users in date range
   */
  private countActiveUsers(persons: PostHogPersonResponse, since: Date): number {
    if (!persons.results) return 0;

    return persons.results.filter((person) => {
      const createdAt = new Date(person.created_at);
      return createdAt >= since;
    }).length;
  }

  /**
   * Get top items from breakdown
   */
  private getTopItems(
    breakdown: Record<string, number>,
    _type: "framework" | "feature"
  ): Array<FrameworkUsage | FeatureUsage> {
    const total = Object.values(breakdown).reduce((sum, count) => sum + count, 0);

    return Object.entries(breakdown)
      .map(([name, count]) => ({
        name,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }
}
