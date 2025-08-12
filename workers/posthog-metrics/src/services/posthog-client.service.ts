/**
 * @fileoverview PostHog API client service
 * @module services/posthog-client
 */

import type {
  WorkerEnv,
  PostHogEventResponse,
  PostHogPersonResponse,
  PostHogInsightResponse,
  PostHogQuery,
  PostHogQueryResponse,
} from "../types";

import { PostHogAuthService } from "./posthog-auth.service";

export class PostHogClientService {
  private authService: PostHogAuthService;

  constructor(env: WorkerEnv) {
    this.authService = new PostHogAuthService(env);
  }

  /**
   * Fetch events from PostHog
   */
  async fetchEvents(params?: {
    limit?: number;
    after?: string;
    before?: string;
    event?: string;
  }): Promise<PostHogEventResponse> {
    const url = new URL(`${this.authService.getApiUrl()}/events`);

    if (params?.limit) url.searchParams.set("limit", params.limit.toString());
    if (params?.after) url.searchParams.set("after", params.after);
    if (params?.before) url.searchParams.set("before", params.before);
    if (params?.event) url.searchParams.set("event", params.event);

    const response = await fetch(url.toString(), {
      headers: this.authService.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Fetch persons/users from PostHog
   */
  async fetchPersons(params?: { limit?: number; offset?: number }): Promise<PostHogPersonResponse> {
    const url = new URL(`${this.authService.getApiUrl()}/persons`);

    if (params?.limit) url.searchParams.set("limit", params.limit.toString());
    if (params?.offset) url.searchParams.set("offset", params.offset.toString());

    const response = await fetch(url.toString(), {
      headers: this.authService.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch persons: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Fetch insights from PostHog
   */
  async fetchInsights(params?: { limit?: number }): Promise<PostHogInsightResponse> {
    const url = new URL(`${this.authService.getApiUrl()}/insights`);

    if (params?.limit) url.searchParams.set("limit", params.limit.toString());

    const response = await fetch(url.toString(), {
      headers: this.authService.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch insights: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Execute a query against PostHog
   */
  async executeQuery(query: PostHogQuery): Promise<PostHogQueryResponse> {
    const url = `${this.authService.getApiUrl()}/query`;

    const response = await fetch(url, {
      method: "POST",
      headers: this.authService.getAuthHeaders(),
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`Failed to execute query: ${response.statusText}`);
    }

    return response.json() as Promise<PostHogQueryResponse>;
  }

  /**
   * Get event properties breakdown
   */
  async getEventBreakdown(event: string, property: string): Promise<PostHogQueryResponse> {
    const query: PostHogQuery = {
      kind: "EventsQuery",
      select: [property, "count()"],
      where: [`event = '${event}'`],
      orderBy: ["count() DESC"],
    };

    return this.executeQuery(query);
  }
}
