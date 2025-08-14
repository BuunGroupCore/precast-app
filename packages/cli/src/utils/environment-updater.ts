/**
 * Environment Variable Updater
 * Updates .env files with ngrok URLs based on framework detection
 */

import path from "path";

import fs from "fs-extra";

import { ProjectStructure, EnvUpdate } from "./framework-detection.js";

export interface NgrokUrls {
  frontend: string;
  api: string;
}

export interface UpdateOptions {
  dryRun?: boolean;
  backupOriginal?: boolean;
}

/**
 * Update environment variables in detected .env files
 */
export const updateEnvironmentVariables = async (
  projectPath: string,
  structure: ProjectStructure,
  ngrokUrls: NgrokUrls,
  options: UpdateOptions = {}
): Promise<EnvUpdate[]> => {
  const updates: EnvUpdate[] = [];

  // Focus on frontend environment files
  const frontendEnvFiles = structure.envFiles.filter(
    (f) => f.type === "frontend" || (!structure.isMonorepo && f.type === "root")
  );

  for (const envFile of frontendEnvFiles) {
    const fileUpdates = await updateSingleEnvFile(
      envFile.fullPath,
      envFile.path,
      structure.framework,
      ngrokUrls,
      options
    );
    updates.push(...fileUpdates);
  }

  return updates;
};

/**
 * Update a single .env file
 */
export const updateSingleEnvFile = async (
  filePath: string,
  relativePath: string,
  framework: any,
  ngrokUrls: NgrokUrls,
  options: UpdateOptions = {}
): Promise<EnvUpdate[]> => {
  const updates: EnvUpdate[] = [];

  try {
    let content = await fs.readFile(filePath, "utf8");
    let updatedContent = content;

    // Handle framework-specific environment variables
    if (framework.specialHandling === "angular") {
      // Angular has special handling for environment.ts files
      const angularUpdates = await handleAngularEnvironment(
        path.dirname(filePath),
        ngrokUrls,
        options
      );
      updates.push(...angularUpdates);
    }

    // Update API URL with framework-specific variables
    for (const envVar of framework.envVars) {
      const regex = new RegExp(`^${envVar}=.*$`, "m");
      if (regex.test(updatedContent)) {
        updatedContent = updatedContent.replace(regex, `${envVar}=${ngrokUrls.api}`);
        updates.push({ file: relativePath, var: envVar, value: ngrokUrls.api });
      } else {
        // Add the variable if it doesn't exist
        updatedContent = addEnvVariable(updatedContent, envVar, ngrokUrls.api);
        updates.push({ file: relativePath, var: envVar, value: ngrokUrls.api, added: true });
      }
    }

    // Always update CLIENT_URL for CORS (backend needs this)
    const clientUrlRegex = /^CLIENT_URL=.*$/m;
    if (clientUrlRegex.test(updatedContent)) {
      updatedContent = updatedContent.replace(clientUrlRegex, `CLIENT_URL=${ngrokUrls.frontend}`);
    } else {
      updatedContent = addEnvVariable(updatedContent, "CLIENT_URL", ngrokUrls.frontend);
    }
    updates.push({ file: relativePath, var: "CLIENT_URL", value: ngrokUrls.frontend });

    // Handle TanStack Start special case (both client and server vars)
    if (framework.framework === "tanstack-start") {
      const serverApiRegex = /^API_URL=.*$/m;
      if (serverApiRegex.test(updatedContent)) {
        updatedContent = updatedContent.replace(serverApiRegex, `API_URL=${ngrokUrls.api}`);
      } else {
        updatedContent = addEnvVariable(updatedContent, "API_URL", ngrokUrls.api);
        updates.push({ file: relativePath, var: "API_URL", value: ngrokUrls.api, added: true });
      }
    }

    // Write updated content (unless dry run)
    if (!options.dryRun && updatedContent !== content) {
      // Backup original if requested
      if (options.backupOriginal) {
        await fs.copy(filePath, `${filePath}.backup`);
      }

      await fs.writeFile(filePath, updatedContent);
    }
  } catch (error) {
    console.warn(`Failed to update ${relativePath}:`, error);
  }

  return updates;
};

/**
 * Add environment variable to .env content
 */
const addEnvVariable = (content: string, key: string, value: string): string => {
  // Check if we're adding to an existing section or creating new
  const hasConfigSection =
    content.includes("# Core Configuration") || content.includes("# Backend API URL");

  if (hasConfigSection) {
    // Add after the Core Configuration section
    const lines = content.split("\n");
    const configIndex = lines.findIndex(
      (line) =>
        line.includes("# Backend API URL") ||
        line.includes("VITE_API_URL") ||
        line.includes("NEXT_PUBLIC_API_URL")
    );

    if (configIndex !== -1) {
      // Insert after the API URL line
      lines.splice(configIndex + 1, 0, `${key}=${value}`);
      return lines.join("\n");
    }
  }

  // Fallback: add at the end
  const separator = content.endsWith("\n") ? "" : "\n";
  return `${content}${separator}${key}=${value}\n`;
};

/**
 * Handle Angular-specific environment updates
 */
const handleAngularEnvironment = async (
  projectPath: string,
  ngrokUrls: NgrokUrls,
  options: UpdateOptions = {}
): Promise<EnvUpdate[]> => {
  const updates: EnvUpdate[] = [];
  const envTsPath = path.join(projectPath, "src/environments/environment.ts");

  try {
    if (await fs.pathExists(envTsPath)) {
      let content = await fs.readFile(envTsPath, "utf8");

      // Update apiUrl property in environment.ts
      const apiUrlRegex = /apiUrl:\s*['"][^'"]*['"]/;
      if (apiUrlRegex.test(content)) {
        content = content.replace(apiUrlRegex, `apiUrl: '${ngrokUrls.api}'`);
      } else {
        // Add apiUrl property if it doesn't exist
        const exportIndex = content.indexOf("export const environment");
        if (exportIndex !== -1) {
          const openBraceIndex = content.indexOf("{", exportIndex);
          if (openBraceIndex !== -1) {
            content =
              content.slice(0, openBraceIndex + 1) +
              `\n  apiUrl: '${ngrokUrls.api}',` +
              content.slice(openBraceIndex + 1);
          }
        }
      }

      if (!options.dryRun) {
        if (options.backupOriginal) {
          await fs.copy(envTsPath, `${envTsPath}.backup`);
        }
        await fs.writeFile(envTsPath, content);
      }

      updates.push({
        file: "src/environments/environment.ts",
        var: "apiUrl",
        value: ngrokUrls.api,
      });
    }
  } catch (error) {
    console.warn("Failed to update Angular environment.ts:", error);
  }

  return updates;
};

/**
 * Format environment updates for display
 */
export const formatEnvUpdates = (updates: EnvUpdate[]): string => {
  if (updates.length === 0) {
    return "No environment updates needed.";
  }

  const grouped = updates.reduce(
    (acc, update) => {
      if (!acc[update.file]) {
        acc[update.file] = [];
      }
      acc[update.file].push(update);
      return acc;
    },
    {} as Record<string, EnvUpdate[]>
  );

  let output = "";
  for (const [file, fileUpdates] of Object.entries(grouped)) {
    output += `\n📄 ${file}:\n`;
    for (const update of fileUpdates) {
      const action = update.added ? "  + ADD" : "  ~ UPDATE";
      output += `${action} ${update.var}=${update.value}\n`;
    }
  }

  return output;
};

/**
 * Validate that ngrok URLs are valid
 */
export const validateNgrokUrls = (urls: NgrokUrls): boolean => {
  const ngrokPattern = /^https:\/\/[a-z0-9-]+\.(ngrok-free\.app|ngrok\.app|ngrok\.io)$/;
  return ngrokPattern.test(urls.frontend) && ngrokPattern.test(urls.api);
};
