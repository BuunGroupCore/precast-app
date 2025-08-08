/**
 * @fileoverview Cloudflare Worker type definitions
 * @module types/worker
 */

/// <reference types="@cloudflare/workers-types" />

/**
 * Cloudflare Worker environment bindings
 * @interface WorkerEnv
 */
export interface WorkerEnv {
  /** GitHub App ID */
  GITHUB_APP_ID: string;
  /** GitHub App private key in PEM format */
  GITHUB_APP_PRIVATE_KEY: string;
  /** GitHub App installation ID */
  GITHUB_INSTALLATION_ID: string;
  /** R2 bucket for metrics storage */
  METRICS_BUCKET: R2Bucket;
  /** Repository owner/organization */
  REPO_OWNER: string;
  /** Repository name */
  REPO_NAME: string;
}
