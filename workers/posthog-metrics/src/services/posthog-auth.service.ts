/**
 * @fileoverview PostHog authentication service
 * @module services/posthog-auth
 */

import type { WorkerEnv } from "../types";

export class PostHogAuthService {
  private readonly apiKey: string;
  private readonly projectId: string;
  private readonly host: string;

  constructor(env: WorkerEnv) {
    this.apiKey = env.POSTHOG_API_KEY;
    this.projectId = env.POSTHOG_PROJECT_ID;
    this.host = env.POSTHOG_HOST || "https://app.posthog.com";
  }

  /**
   * Get authorization headers for PostHog API
   */
  getAuthHeaders(): Headers {
    const headers = new Headers();
    headers.set("Authorization", `Bearer ${this.apiKey}`);
    headers.set("Content-Type", "application/json");
    return headers;
  }

  /**
   * Get the base API URL
   */
  getApiUrl(): string {
    return `${this.host}/api/projects/${this.projectId}`;
  }

  /**
   * Validate that all required credentials are present
   */
  validateCredentials(): void {
    if (!this.apiKey) {
      throw new Error("POSTHOG_API_KEY is required");
    }
    if (!this.projectId) {
      throw new Error("POSTHOG_PROJECT_ID is required");
    }
  }
}
