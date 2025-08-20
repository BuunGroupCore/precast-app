import { mkdtemp, rm } from "fs/promises";
import os from "os";
import path from "path";

import { globalReporter } from "./test-reporter";

/**
 * TestSandbox provides isolated temporary directories for tests with automatic cleanup.
 * Each test gets its own sandbox that is automatically cleaned up after the test completes.
 */
export class TestSandbox {
  private tempDir: string | null = null;
  private static activeSandboxes: Set<TestSandbox> = new Set();
  private cleanupScheduled = false;

  /**
   * Creates a new temporary directory for the test sandbox.
   * @returns The path to the created temporary directory
   */
  async setup(): Promise<string> {
    this.tempDir = await mkdtemp(path.join(os.tmpdir(), "precast-test-"));
    TestSandbox.activeSandboxes.add(this);

    // Track temp directory creation for reporting
    globalReporter.trackTempDirCreated(this.tempDir);

    if (!this.cleanupScheduled) {
      this.scheduleCleanup();
    }

    return this.tempDir;
  }

  /**
   * Cleans up the temporary directory and removes it from active sandboxes.
   * Safe to call multiple times - subsequent calls are no-ops.
   */
  async cleanup(): Promise<void> {
    if (this.tempDir) {
      const dirToClean = this.tempDir;
      try {
        const { access } = await import("fs/promises");
        await access(this.tempDir);

        await rm(this.tempDir, { recursive: true, force: true });
        console.info(`✓ Cleaned up sandbox: ${this.tempDir}`);

        // Track successful cleanup for reporting
        globalReporter.trackTempDirCleaned(dirToClean);
      } catch (error) {
        console.warn(`Failed to cleanup sandbox ${this.tempDir}:`, error);
      }
      this.tempDir = null;
      TestSandbox.activeSandboxes.delete(this);
      this.cleanupScheduled = false;
    }
  }

  /**
   * Schedules automatic cleanup handlers for process exit events.
   * Ensures cleanup even if the process is terminated unexpectedly.
   */
  private scheduleCleanup(): void {
    this.cleanupScheduled = true;

    const cleanup = () => {
      if (this.tempDir) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const fs = require("fs");
          fs.rmSync(this.tempDir, { recursive: true, force: true });
          console.info(`✓ Emergency cleanup: ${this.tempDir}`);
        } catch {
          // Ignore errors during emergency cleanup
        }
      }
    };

    process.once("exit", cleanup);
    process.once("SIGINT", cleanup);
    process.once("SIGTERM", cleanup);
  }

  /**
   * Gets the full path for a file/directory within the sandbox.
   * @param relativePath - Relative path within the sandbox
   * @returns Full path to the file/directory
   */
  getPath(relativePath: string = ""): string {
    if (!this.tempDir) {
      throw new Error("Sandbox not initialized. Call setup() first.");
    }
    return path.join(this.tempDir, relativePath);
  }

  /**
   * Gets the sandbox temporary directory path.
   * @returns The temporary directory path
   * @throws If sandbox is not initialized
   */
  getTempDir(): string {
    if (!this.tempDir) {
      throw new Error("Sandbox not initialized. Call setup() first.");
    }
    return this.tempDir;
  }

  /**
   * Cleans up all active sandboxes globally.
   * Useful for emergency cleanup scenarios.
   */
  static async globalCleanup(): Promise<void> {
    const cleanupPromises = Array.from(TestSandbox.activeSandboxes).map((sandbox) =>
      sandbox.cleanup()
    );
    await Promise.all(cleanupPromises);
  }
}
