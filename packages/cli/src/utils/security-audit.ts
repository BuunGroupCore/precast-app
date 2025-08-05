import { consola } from "consola";
import { execa } from "execa";

export async function runSecurityAudit(options: {
  packageManager: string;
  projectPath: string;
  autoFix?: boolean;
}): Promise<void> {
  const { packageManager, projectPath, autoFix = true } = options;

  consola.info("🔒 Running security audit...");

  try {
    // Only npm and yarn support audit
    if (packageManager === "npm") {
      // First run audit to see vulnerabilities
      try {
        await execa("npm", ["audit"], {
          cwd: projectPath,
          stdio: "pipe",
        });
        consola.success("✅ No vulnerabilities found!");
        return;
      } catch (auditError: any) {
        // npm audit returns non-zero exit code when vulnerabilities are found
        if (auditError.stdout && auditError.stdout.includes("found")) {
          consola.warn("⚠️  Vulnerabilities detected");

          if (autoFix) {
            consola.info("🔧 Attempting to fix vulnerabilities automatically...");

            // Try to fix without breaking changes first
            try {
              await execa("npm", ["audit", "fix"], {
                cwd: projectPath,
                stdio: "inherit",
              });
              consola.success("✅ Fixed vulnerabilities without breaking changes");
            } catch {
              // If regular fix didn't work, try with --force for breaking changes
              consola.warn("⚠️  Some vulnerabilities require breaking changes to fix");
              consola.info("🔧 Attempting to fix with breaking changes...");

              try {
                await execa("npm", ["audit", "fix", "--force"], {
                  cwd: projectPath,
                  stdio: "inherit",
                });
                consola.success("✅ Fixed all vulnerabilities (with breaking changes)");
              } catch {
                consola.error("❌ Some vulnerabilities could not be automatically fixed");
                consola.info("💡 Please review and fix manually after project creation");
              }
            }

            // Run audit again to check status
            try {
              await execa("npm", ["audit", "--json"], {
                cwd: projectPath,
                stdio: "pipe",
              });
              consola.success("✅ All vulnerabilities resolved!");
            } catch {
              consola.warn("⚠️  Some vulnerabilities may still remain");
            }
          }
        }
      }
    } else if (packageManager === "yarn") {
      try {
        await execa("yarn", ["audit"], {
          cwd: projectPath,
          stdio: "pipe",
        });
        consola.success("✅ No vulnerabilities found!");
      } catch {
        consola.warn("⚠️  Vulnerabilities detected");

        if (autoFix) {
          consola.info("💡 Run 'yarn audit fix' manually to resolve vulnerabilities");
        }
      }
    } else if (packageManager === "pnpm") {
      try {
        await execa("pnpm", ["audit"], {
          cwd: projectPath,
          stdio: "pipe",
        });
        consola.success("✅ No vulnerabilities found!");
      } catch {
        consola.warn("⚠️  Vulnerabilities detected");

        if (autoFix) {
          consola.info("💡 Run 'pnpm audit --fix' manually to resolve vulnerabilities");
        }
      }
    } else if (packageManager === "bun") {
      // Bun doesn't have audit yet
      consola.info("💡 Bun doesn't support security auditing yet");
      consola.info("💡 Consider using npm audit manually for security checks");
    }
  } catch (error) {
    consola.error("Failed to run security audit:", error);
  }
}

export async function updateDependenciesToLatest(options: {
  packageManager: string;
  projectPath: string;
}): Promise<void> {
  const { packageManager, projectPath } = options;

  consola.info("📦 Updating dependencies to latest versions...");

  try {
    if (packageManager === "npm") {
      // Update all dependencies to latest
      await execa("npm", ["update", "--save"], {
        cwd: projectPath,
        stdio: "inherit",
      });

      // Update dev dependencies
      await execa("npm", ["update", "--save-dev"], {
        cwd: projectPath,
        stdio: "inherit",
      });
    } else if (packageManager === "yarn") {
      await execa("yarn", ["upgrade", "--latest"], {
        cwd: projectPath,
        stdio: "inherit",
      });
    } else if (packageManager === "pnpm") {
      await execa("pnpm", ["update", "--latest"], {
        cwd: projectPath,
        stdio: "inherit",
      });
    } else if (packageManager === "bun") {
      await execa("bun", ["update"], {
        cwd: projectPath,
        stdio: "inherit",
      });
    }

    consola.success("✅ Dependencies updated to latest versions");
  } catch (error) {
    consola.error("Failed to update dependencies:", error);
  }
}
