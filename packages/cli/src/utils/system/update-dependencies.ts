import path from "path";

import { consola } from "consola";
import fsExtra from "fs-extra";

const { readdir, pathExists, readFile, writeFile } = fsExtra;

interface DependencyUpdate {
  package: string;
  currentVersion: string;
  secureVersion: string;
  reason: string;
}

/**
 * Secure versions for packages with known vulnerabilities
 */
const SECURE_VERSIONS: Record<string, DependencyUpdate> = {
  esbuild: {
    package: "esbuild",
    currentVersion: "<=0.24.2",
    secureVersion: "^0.25.0",
    reason: "CVE-2024-23334 - Development server request vulnerability",
  },
  vite: {
    package: "vite",
    currentVersion: "<5.0.0",
    secureVersion: "^5.4.0",
    reason: "Update to stable version with maximum plugin compatibility",
  },
  "@vitejs/plugin-react": {
    package: "@vitejs/plugin-react",
    currentVersion: "<4.3.2",
    secureVersion: "^4.3.4",
    reason: "Update to latest stable version",
  },
  "@vitejs/plugin-vue": {
    package: "@vitejs/plugin-vue",
    currentVersion: "<5.2.1",
    secureVersion: "^5.2.2",
    reason: "Update to latest stable version",
  },
  typescript: {
    package: "typescript",
    currentVersion: "<5.6.0",
    secureVersion: "^5.7.2",
    reason: "Update to latest stable version with security improvements",
  },
  eslint: {
    package: "eslint",
    currentVersion: "<8.57.0",
    secureVersion: "^9.19.0",
    reason: "Update to latest stable version",
  },
};

/**
 * Get framework-specific security overrides
 * @param framework - Framework name
 * @param packageManager - Package manager being used
 * @returns Security overrides object
 */
export function getSecurityOverrides(
  framework: string,
  packageManager?: string
): Record<string, any> {
  const baseOverrides = {
    esbuild: "^0.25.0",
  };

  if (packageManager === "bun") {
    // Bun has built-in esbuild - don't install it separately to avoid postinstall script errors
    return {};
  }

  if (framework === "angular") {
    return {
      ...baseOverrides,
      "@angular/build": {
        vite: {
          esbuild: "^0.25.0",
        },
      },
    };
  }

  if (["react", "vue", "svelte", "solid", "vite", "vanilla", "remix"].includes(framework)) {
    return {
      ...baseOverrides,
      vite: {
        esbuild: "^0.25.0",
      },
    };
  }

  return baseOverrides;
}

/**
 * Update template dependencies to secure versions
 */
export async function updateTemplateDependencies(): Promise<void> {
  consola.info("📦 Updating template dependencies to secure versions...");

  const templatesDir = path.join(__dirname, "..", "templates", "frameworks");
  const frameworks = await readdir(templatesDir);

  for (const framework of frameworks) {
    const packageJsonPath = path.join(templatesDir, framework, "base", "package.json.hbs");

    if (await pathExists(packageJsonPath)) {
      consola.info(`Updating ${framework} dependencies...`);

      let content = await readFile(packageJsonPath, "utf-8");
      let updated = false;

      for (const [pkg, update] of Object.entries(SECURE_VERSIONS)) {
        const regex = new RegExp(`"${pkg}":\\s*"[^"]*"`, "g");
        if (content.match(regex)) {
          content = content.replace(regex, `"${pkg}": "${update.secureVersion}"`);
          updated = true;
          consola.success(`  ✅ Updated ${pkg} to ${update.secureVersion}`);
        }
      }

      const needsOverrides =
        framework === "angular" ||
        content.includes('"vite"') ||
        ["react", "vue", "svelte", "solid", "vite", "vanilla", "remix"].includes(framework);

      if (needsOverrides && !content.includes('"overrides"')) {
        const devDepsMatch = content.match(/("devDependencies":\s*{[^}]*})/);
        if (devDepsMatch) {
          const insertPos = devDepsMatch.index! + devDepsMatch[0].length;
          const frameworkOverrides = getSecurityOverrides(framework, "npm");
          const overridesJson = JSON.stringify({ overrides: frameworkOverrides }, null, 2)
            .slice(1, -1)
            .trim();
          content =
            content.slice(0, insertPos) + ",\n  " + overridesJson + content.slice(insertPos);
          updated = true;
          consola.success("  ✅ Added framework-specific security overrides");
        }
      }

      if (updated) {
        await writeFile(packageJsonPath, content);
      }
    }
  }

  consola.success("✅ All template dependencies updated to secure versions");
}

/**
 * Add security overrides to a project's package.json
 * @param projectPath - Path to the project directory
 * @param framework - Framework name
 * @param packageManager - Package manager being used
 */
export async function addSecurityOverridesToProject(
  projectPath: string,
  framework: string,
  packageManager?: string
): Promise<void> {
  const packageJsonPath = path.join(projectPath, "package.json");

  if (!(await pathExists(packageJsonPath))) {
    return;
  }

  const content = await readFile(packageJsonPath, "utf-8");
  const packageJson = JSON.parse(content);

  const needsOverrides =
    framework === "angular" ||
    packageJson.devDependencies?.vite ||
    packageJson.dependencies?.vite ||
    ["react", "vue", "svelte", "solid", "vite", "vanilla", "remix"].includes(framework);

  if (needsOverrides && !packageJson.overrides) {
    packageJson.overrides = getSecurityOverrides(framework, packageManager);
    await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");
    consola.info("📝 Added security overrides to package.json");
  }
}
