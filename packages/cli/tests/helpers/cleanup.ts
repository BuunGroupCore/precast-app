import { existsSync } from "fs";
import { rm } from "fs/promises";
import os from "os";
import path from "path";

export class TestCleanup {
  private static testProjects: Set<string> = new Set();
  private static tempDirs: Set<string> = new Set();

  static addTestProject(projectPath: string): void {
    this.testProjects.add(projectPath);
  }

  static addTempDir(tempDir: string): void {
    this.tempDirs.add(tempDir);
  }

  static async cleanupTestProjects(): Promise<void> {
    const cleanupPromises = Array.from(this.testProjects).map(async (projectPath) => {
      if (existsSync(projectPath)) {
        try {
          await rm(projectPath, { recursive: true, force: true });
          console.info(`Cleaned up test project: ${projectPath}`);
        } catch (error) {
          console.warn(`Failed to cleanup test project ${projectPath}:`, error);
        }
      }
    });

    await Promise.all(cleanupPromises);
    this.testProjects.clear();
  }

  static async cleanupTempDirs(): Promise<void> {
    const cleanupPromises = Array.from(this.tempDirs).map(async (tempDir) => {
      if (existsSync(tempDir)) {
        try {
          await rm(tempDir, { recursive: true, force: true });
          console.info(`Cleaned up temp dir: ${tempDir}`);
        } catch (error) {
          console.warn(`Failed to cleanup temp dir ${tempDir}:`, error);
        }
      }
    });

    await Promise.all(cleanupPromises);
    this.tempDirs.clear();
  }

  static async cleanupAll(): Promise<void> {
    await Promise.all([this.cleanupTestProjects(), this.cleanupTempDirs()]);
  }

  static async cleanupOldTestFiles(): Promise<void> {
    const tmpDir = os.tmpdir();

    try {
      const { readdir, stat } = await import("fs/promises");
      const files = await readdir(tmpDir);

      const precastTestDirs = files.filter(
        (file) =>
          file.startsWith("precast-test-") ||
          file.startsWith("test-") ||
          file.includes("matrix-") ||
          file.includes("perf-")
      );

      const cleanupPromises = precastTestDirs.map(async (dir) => {
        const fullPath = path.join(tmpDir, dir);
        try {
          const stats = await stat(fullPath);
          const ageInHours = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60);

          // Clean up test dirs older than 1 hour
          if (ageInHours > 1 && stats.isDirectory()) {
            await rm(fullPath, { recursive: true, force: true });
            console.info(`Cleaned up old test directory: ${fullPath}`);
          }
        } catch {
          // Ignore errors for individual files
        }
      });

      await Promise.all(cleanupPromises);
    } catch (error) {
      console.warn("Failed to cleanup old test files:", error);
    }
  }

  static async emergencyCleanup(): Promise<void> {
    console.info("Running emergency cleanup...");

    try {
      await this.cleanupAll();
      await this.cleanupOldTestFiles();
      console.info("Emergency cleanup completed");
    } catch (error) {
      console.error("Emergency cleanup failed:", error);
    }
  }
}

// Register cleanup handlers
process.on("exit", () => {
  // Synchronous cleanup on exit
  console.info("Process exiting, running cleanup...");
});

process.on("SIGINT", async () => {
  console.info("Received SIGINT, cleaning up...");
  await TestCleanup.emergencyCleanup();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.info("Received SIGTERM, cleaning up...");
  await TestCleanup.emergencyCleanup();
  process.exit(0);
});

process.on("uncaughtException", async (error) => {
  console.error("Uncaught exception, cleaning up...", error);
  await TestCleanup.emergencyCleanup();
  process.exit(1);
});

process.on("unhandledRejection", async (reason) => {
  console.error("Unhandled rejection, cleaning up...", reason);
  await TestCleanup.emergencyCleanup();
  process.exit(1);
});
