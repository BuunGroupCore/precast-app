/**
 * @fileoverview R2 storage service for caching metrics data
 * @module services/r2-storage
 */

import type { MetricsData } from "../types";

/**
 * Service for managing metrics data in R2 storage
 * @class R2StorageService
 */
export class R2StorageService {
  private readonly bucket: R2Bucket;

  /**
   * Creates an instance of R2StorageService
   * @param {R2Bucket} bucket - R2 bucket instance
   */
  constructor(bucket: R2Bucket) {
    this.bucket = bucket;
  }

  /**
   * Stores metrics data in R2
   * @param {MetricsData} data - Metrics data to store
   * @returns {Promise<void>}
   */
  async storeMetrics(data: MetricsData): Promise<void> {
    const timestamp = new Date().toISOString();

    await Promise.all([
      this.bucket.put("metrics-data.json", JSON.stringify(data), {
        httpMetadata: {
          contentType: "application/json",
        },
      }),
      this.bucket.put(`backups/metrics-${timestamp}.json`, JSON.stringify(data), {
        httpMetadata: {
          contentType: "application/json",
        },
      }),
    ]);

    await this.cleanupOldBackups();
  }

  /**
   * Retrieves metrics data from R2
   * @returns {Promise<MetricsData | null>} Stored metrics data or null
   */
  async getMetrics(): Promise<MetricsData | null> {
    try {
      const object = await this.bucket.get("metrics-data.json");
      if (!object) return null;

      const text = await object.text();
      return JSON.parse(text) as MetricsData;
    } catch {
      return null;
    }
  }

  /**
   * Cleans up old backup files (keeps last 10)
   * @private
   * @returns {Promise<void>}
   */
  private async cleanupOldBackups(): Promise<void> {
    try {
      const list = await this.bucket.list({ prefix: "backups/" });
      const backups = list.objects.sort((a, b) => {
        const timeA = a.uploaded.getTime();
        const timeB = b.uploaded.getTime();
        return timeB - timeA;
      });

      if (backups.length > 10) {
        const toDelete = backups.slice(10);
        await Promise.all(toDelete.map((backup) => this.bucket.delete(backup.key)));
      }
    } catch {
      // Ignore cleanup errors
    }
  }
}
