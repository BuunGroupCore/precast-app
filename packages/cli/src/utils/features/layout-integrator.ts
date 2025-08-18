import * as path from "path";
import * as fs from "fs-extra";
import { logger } from "@/utils/ui/logger.js";
import type { DetectedProject } from "./feature-registry.js";

interface LayoutPatch {
  file: string;
  create_if_missing?: boolean;
  content?: string;
  insertions?: Array<{
    after?: string;
    before?: string;
    content?: string;
    wrap?: {
      target: string;
      with: string;
    };
  }>;
}

interface LayoutPatches {
  [key: string]: LayoutPatch;
}

/**
 * Layout Integrator for modifying existing layouts instead of creating new ones
 */
export class LayoutIntegrator {
  constructor(private cliPath: string) {}

  /**
   * Integrate AuthProvider into existing layout files
   */
  async integrateAuthProvider(project: DetectedProject, dryRun = false): Promise<void> {
    const patchesPath = path.join(
      this.cliPath,
      "src/templates/common/features/auth/integration/layout-patches.json"
    );

    if (!(await fs.pathExists(patchesPath))) {
      throw new Error("Layout patches configuration not found");
    }

    const patchesConfig = await fs.readJson(patchesPath);
    const patches: LayoutPatches = patchesConfig.patches;

    // Determine which patch to apply based on project framework
    const patchKey = this.getPatchKey(project);
    const patch = patches[patchKey];

    if (!patch) {
      logger.warn(`No layout integration patch found for ${project.framework}`);
      return;
    }

    logger.info(`Integrating AuthProvider into ${patch.file}`);

    if (dryRun) {
      logger.info(`[DRY RUN] Would modify: ${patch.file}`);
      return;
    }

    await this.applyLayoutPatch(project, patch);
  }

  /**
   * Get the appropriate patch key for the project
   */
  private getPatchKey(project: DetectedProject): string {
    const { framework } = project;

    // Check for Next.js App Router
    if (framework === "next") {
      const appLayoutExists = fs.existsSync(path.join(project.projectPath, "src/app/layout.tsx"));
      if (appLayoutExists) {
        return "next-app-layout";
      }
    }

    // Check for React Router
    if (framework === "react" || framework === "vite") {
      const appExists = fs.existsSync(path.join(project.projectPath, "src/App.tsx"));
      if (appExists) {
        return "react-router-app";
      }
    }

    // Vue.js
    if (framework === "vue") {
      return "vue-app";
    }

    // Nuxt
    if (framework === "nuxt") {
      return "nuxt-layout";
    }

    // SvelteKit
    if (framework === "svelte") {
      return "svelte-layout";
    }

    // Default fallback
    return "react-router-app";
  }

  /**
   * Apply a specific layout patch
   */
  private async applyLayoutPatch(project: DetectedProject, patch: LayoutPatch): Promise<void> {
    const filePath = path.join(project.projectPath, patch.file);

    // Create file if it doesn't exist and patch allows it
    if (!(await fs.pathExists(filePath))) {
      if (patch.create_if_missing && patch.content) {
        await fs.ensureDir(path.dirname(filePath));
        await fs.writeFile(filePath, patch.content);
        logger.success(`Created ${patch.file} with AuthProvider integration`);
        return;
      } else {
        throw new Error(`Layout file ${patch.file} not found and cannot be created`);
      }
    }

    // Read existing file
    let content = await fs.readFile(filePath, "utf-8");

    // Apply insertions
    if (patch.insertions) {
      for (const insertion of patch.insertions) {
        content = this.applyInsertion(content, insertion, filePath);
      }
    }

    // Write modified content back
    await fs.writeFile(filePath, content);
    logger.success(`Updated ${patch.file} with AuthProvider integration`);
  }

  /**
   * Apply a single insertion to content
   */
  private applyInsertion(content: string, insertion: any, filePath: string): string {
    // Handle 'after' insertion
    if (insertion.after && insertion.content) {
      const targetIndex = content.indexOf(insertion.after);
      if (targetIndex === -1) {
        logger.warn(`Target "${insertion.after}" not found in ${filePath}`);
        return content;
      }

      const insertIndex = targetIndex + insertion.after.length;
      const lineEnd = content.indexOf("\\n", insertIndex);
      const insertPosition = lineEnd !== -1 ? lineEnd + 1 : insertIndex;

      return (
        content.slice(0, insertPosition) + insertion.content + "\\n" + content.slice(insertPosition)
      );
    }

    // Handle 'before' insertion
    if (insertion.before && insertion.content) {
      const targetIndex = content.indexOf(insertion.before);
      if (targetIndex === -1) {
        logger.warn(`Target "${insertion.before}" not found in ${filePath}`);
        return content;
      }

      return content.slice(0, targetIndex) + insertion.content + "\\n" + content.slice(targetIndex);
    }

    // Handle 'wrap' insertion
    if (insertion.wrap) {
      const { target, with: wrapper } = insertion.wrap;
      const targetIndex = content.indexOf(target);

      if (targetIndex === -1) {
        logger.warn(`Target "${target}" not found in ${filePath}`);
        return content;
      }

      const endIndex = targetIndex + target.length;
      return content.slice(0, targetIndex) + wrapper + content.slice(endIndex);
    }

    return content;
  }

  /**
   * Check if AuthProvider is already integrated
   */
  async isAuthProviderIntegrated(project: DetectedProject): Promise<boolean> {
    const patchKey = this.getPatchKey(project);
    const filesToCheck = this.getLayoutFiles(project, patchKey);

    for (const file of filesToCheck) {
      const filePath = path.join(project.projectPath, file);

      if (await fs.pathExists(filePath)) {
        const content = await fs.readFile(filePath, "utf-8");
        if (content.includes("AuthProvider")) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Get layout files to check for a given patch key
   */
  private getLayoutFiles(project: DetectedProject, patchKey: string): string[] {
    switch (patchKey) {
      case "next-app-layout":
        return ["src/app/layout.tsx", "src/app/layout.jsx"];
      case "react-router-app":
        return ["src/App.tsx", "src/App.jsx"];
      case "vue-app":
        return ["src/App.vue"];
      case "nuxt-layout":
        return ["layouts/default.vue", "app.vue"];
      case "svelte-layout":
        return ["src/routes/+layout.svelte", "src/app.html"];
      default:
        return ["src/App.tsx", "src/App.jsx"];
    }
  }

  /**
   * Remove AuthProvider integration (for uninstallation)
   */
  async removeAuthProviderIntegration(project: DetectedProject, dryRun = false): Promise<void> {
    const patchKey = this.getPatchKey(project);
    const filesToCheck = this.getLayoutFiles(project, patchKey);

    for (const file of filesToCheck) {
      const filePath = path.join(project.projectPath, file);

      if (await fs.pathExists(filePath)) {
        let content = await fs.readFile(filePath, "utf-8");

        if (content.includes("AuthProvider")) {
          logger.info(`Removing AuthProvider from ${file}`);

          if (dryRun) {
            logger.info(`[DRY RUN] Would remove AuthProvider from: ${file}`);
            continue;
          }

          // Remove import
          content = content.replace(
            /import.*AuthProvider.*from.*['"@/features/auth['"];?\\n?/g,
            ""
          );

          // Remove provider wrapping (basic regex - could be improved)
          content = content.replace(/<AuthProvider>\s*/g, "");
          content = content.replace(/\s*<\/AuthProvider>/g, "");

          await fs.writeFile(filePath, content);
          logger.success(`Removed AuthProvider from ${file}`);
        }
      }
    }
  }

  /**
   * Validate layout integration requirements
   */
  async validateLayoutIntegration(
    project: DetectedProject
  ): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];
    const patchKey = this.getPatchKey(project);
    const filesToCheck = this.getLayoutFiles(project, patchKey);

    // Check if at least one layout file exists
    let foundLayoutFile = false;
    for (const file of filesToCheck) {
      const filePath = path.join(project.projectPath, file);
      if (await fs.pathExists(filePath)) {
        foundLayoutFile = true;
        break;
      }
    }

    if (!foundLayoutFile) {
      errors.push(`No layout files found. Expected one of: ${filesToCheck.join(", ")}`);
    }

    // Framework-specific validations
    if (project.framework === "react" || project.framework === "next") {
      // Check for React import
      const hasReactImport = await this.checkForImport(project, filesToCheck, ["react", "React"]);
      if (!hasReactImport) {
        errors.push("React import not found in layout files");
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check if import exists in any of the layout files
   */
  private async checkForImport(
    project: DetectedProject,
    files: string[],
    imports: string[]
  ): Promise<boolean> {
    for (const file of files) {
      const filePath = path.join(project.projectPath, file);

      if (await fs.pathExists(filePath)) {
        const content = await fs.readFile(filePath, "utf-8");

        for (const importName of imports) {
          if (content.includes(`import`)) {
            return true;
          }
        }
      }
    }

    return false;
  }
}
