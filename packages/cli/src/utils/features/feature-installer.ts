import * as path from "path";
import * as fs from "fs-extra";
import { createTemplateEngine } from "@/core/template-engine.js";
import { installDependencies } from "@/utils/system/package-manager.js";
import { logger } from "@/utils/ui/logger.js";
import { LayoutIntegrator } from "./layout-integrator.js";
import type { FeatureManifest, DetectedProject } from "./feature-registry.js";

export interface InstallOptions {
  force?: boolean;
  dryRun?: boolean;
  skipDependencies?: boolean;
  configuration?: Record<string, any>;
}

/**
 * Feature Installer for adding features to existing projects
 */
export class FeatureInstaller {
  private templateEngine: any;
  private cliPath: string;
  private layoutIntegrator: LayoutIntegrator;

  constructor(cliPath: string) {
    this.cliPath = cliPath;
    const templateRoot = path.join(cliPath, "src/templates");
    this.templateEngine = createTemplateEngine(templateRoot);
    this.layoutIntegrator = new LayoutIntegrator(cliPath);
  }

  /**
   * Install a feature into a project
   */
  async installFeature(
    feature: FeatureManifest,
    project: DetectedProject,
    options: InstallOptions = {}
  ): Promise<void> {
    const { force = false, dryRun = false, skipDependencies = false, configuration = {} } = options;

    logger.info(`Installing feature: ${feature.name}`);

    if (dryRun) {
      logger.info("DRY RUN: No files will be modified");
    }

    try {
      // Pre-install steps
      await this.runPreInstallSteps(feature, project, dryRun);

      // Install dependencies
      if (!skipDependencies) {
        await this.installFeatureDependencies(feature, project, dryRun);
      }

      // Copy and process feature files
      await this.copyFeatureFiles(feature, project, configuration, dryRun, force);

      // Post-install steps
      await this.runPostInstallSteps(feature, project, dryRun);

      logger.success(`✅ Feature ${feature.name} installed successfully!`);

      if (!dryRun) {
        this.showUsageInstructions(feature);
      }
    } catch (error) {
      logger.error(
        `Failed to install feature ${feature.name}: ${error instanceof Error ? error.message : String(error)}`
      );
      throw error;
    }
  }

  /**
   * Run pre-install validation and setup steps
   */
  private async runPreInstallSteps(
    feature: FeatureManifest,
    project: DetectedProject,
    dryRun: boolean
  ): Promise<void> {
    for (const step of feature.installation.preInstall) {
      logger.verbose(`Pre-install: ${step.description}`);

      if (dryRun) {
        logger.info(`[DRY RUN] Would run: ${step.command}`);
        continue;
      }

      switch (step.command) {
        case "detectProject":
          // Already done - project is passed in
          break;
        case "validateCompatibility":
          await this.validateProjectCompatibility(feature, project);
          break;
        default:
          logger.warn(`Unknown pre-install command: ${step.command}`);
      }
    }
  }

  /**
   * Install feature dependencies
   */
  private async installFeatureDependencies(
    feature: FeatureManifest,
    project: DetectedProject,
    dryRun: boolean
  ): Promise<void> {
    const requiredPackages = Object.keys(feature.dependencies.required);
    const optionalPackages = Object.keys(feature.dependencies.optional || {});

    if (requiredPackages.length > 0) {
      logger.info(`Installing required dependencies: ${requiredPackages.join(", ")}`);

      if (!dryRun) {
        await installDependencies(requiredPackages, {
          packageManager: project.packageManager,
          projectPath: project.projectPath,
          dev: false,
          context: `feature-${feature.id}`,
        });
      }
    }

    if (optionalPackages.length > 0) {
      logger.info(`Installing optional dependencies: ${optionalPackages.join(", ")}`);

      if (!dryRun) {
        // Ask user if they want to install optional dependencies
        await installDependencies(optionalPackages, {
          packageManager: project.packageManager,
          projectPath: project.projectPath,
          dev: false,
          context: `feature-${feature.id}-optional`,
        });
      }
    }
  }

  /**
   * Copy and process feature files with template processing
   */
  private async copyFeatureFiles(
    feature: FeatureManifest,
    project: DetectedProject,
    configuration: Record<string, any>,
    dryRun: boolean,
    force: boolean
  ): Promise<void> {
    const featureSourcePath = path.join(this.cliPath, "src/templates/common/features", feature.id);

    // Determine destination based on project structure
    const baseDest = project.monorepo ? "apps/web/src" : "src";
    const destinationPath = path.join(project.projectPath, baseDest, "features", feature.id);

    if (!dryRun) {
      await fs.ensureDir(destinationPath);
    }

    // Create template context
    const templateContext = {
      ...project,
      ...configuration,
      projectName: this.getProjectName(project.projectPath),
      featureId: feature.id,
      featureName: feature.name,
    };

    // Copy each file/directory in the feature
    const entries = await fs.readdir(featureSourcePath, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.name === "feature.json") continue; // Skip manifest

      const sourcePath = path.join(featureSourcePath, entry.name);
      const destPath = path.join(destinationPath, entry.name);

      if (entry.isDirectory()) {
        await this.copyDirectory(sourcePath, destPath, templateContext, dryRun, force);
      } else if (entry.isFile()) {
        await this.copyFile(sourcePath, destPath, templateContext, dryRun, force);
      }
    }
  }

  /**
   * Copy a directory recursively with template processing
   */
  private async copyDirectory(
    sourcePath: string,
    destPath: string,
    templateContext: any,
    dryRun: boolean,
    force: boolean
  ): Promise<void> {
    if (!dryRun) {
      await fs.ensureDir(destPath);
    }

    const entries = await fs.readdir(sourcePath, { withFileTypes: true });

    for (const entry of entries) {
      const entrySourcePath = path.join(sourcePath, entry.name);
      const entryDestPath = path.join(destPath, entry.name);

      if (entry.isDirectory()) {
        await this.copyDirectory(entrySourcePath, entryDestPath, templateContext, dryRun, force);
      } else if (entry.isFile()) {
        await this.copyFile(entrySourcePath, entryDestPath, templateContext, dryRun, force);
      }
    }
  }

  /**
   * Copy and process a single file
   */
  private async copyFile(
    sourcePath: string,
    destPath: string,
    templateContext: any,
    dryRun: boolean,
    force: boolean
  ): Promise<void> {
    // Check if destination exists
    if (!force && (await fs.pathExists(destPath))) {
      logger.warn(`File already exists: ${destPath} (use --force to overwrite)`);
      return;
    }

    if (dryRun) {
      logger.info(`[DRY RUN] Would copy: ${sourcePath} → ${destPath}`);
      return;
    }

    // Process .hbs files as templates
    if (sourcePath.endsWith(".hbs")) {
      const templateContent = await fs.readFile(sourcePath, "utf-8");
      const processedContent = this.templateEngine.processString(templateContent, templateContext);

      // Remove .hbs extension from destination
      const finalDestPath = destPath.replace(/\.hbs$/, "");
      await fs.writeFile(finalDestPath, processedContent);

      logger.verbose(`Processed template: ${finalDestPath}`);
    } else {
      // Copy file as-is
      await fs.copy(sourcePath, destPath);
      logger.verbose(`Copied file: ${destPath}`);
    }
  }

  /**
   * Run post-install steps
   */
  private async runPostInstallSteps(
    feature: FeatureManifest,
    project: DetectedProject,
    dryRun: boolean
  ): Promise<void> {
    for (const step of feature.installation.postInstall) {
      logger.verbose(`Post-install: ${step.description || step.command}`);

      if (dryRun) {
        logger.info(`[DRY RUN] Would run: ${step.command}`);
        continue;
      }

      switch (step.command) {
        case "copyFiles":
          // Already handled in copyFeatureFiles
          break;
        case "updateImports":
          await this.updateImports(feature, project);
          break;
        case "integrateLayout":
          await this.integrateLayoutProvider(feature, project, dryRun);
          break;
        case "createExample":
          if (step.optional && step.file) {
            await this.createExampleFile(feature, project, step.file);
          }
          break;
        default:
          logger.warn(`Unknown post-install command: ${step.command}`);
      }
    }
  }

  /**
   * Validate project compatibility
   */
  private async validateProjectCompatibility(
    feature: FeatureManifest,
    project: DetectedProject
  ): Promise<void> {
    // Check required files exist
    for (const filePath of feature.detection.requiredFiles) {
      const fullPath = path.join(project.projectPath, filePath);
      if (!(await fs.pathExists(fullPath))) {
        throw new Error(`Required file not found: ${filePath}`);
      }
    }

    // Check framework-specific files
    const frameworkFiles = feature.detection.frameworkDetection[project.framework];
    if (frameworkFiles) {
      let foundFrameworkFile = false;
      for (const file of frameworkFiles) {
        if (await fs.pathExists(path.join(project.projectPath, file))) {
          foundFrameworkFile = true;
          break;
        }
      }
      if (!foundFrameworkFile) {
        throw new Error(`No ${project.framework} framework files found`);
      }
    }
  }

  /**
   * Update import statements in main app files
   */
  private async updateImports(feature: FeatureManifest, project: DetectedProject): Promise<void> {
    // This would be implemented to automatically add imports to main app files
    // For now, we'll just log what should be done
    logger.info("Manual step required: Add AuthProvider to your app root");
    logger.info(`Import: import { AuthProvider } from '@/features/${feature.id}';`);
  }

  /**
   * Integrate layout provider into existing layouts
   */
  private async integrateLayoutProvider(
    feature: FeatureManifest,
    project: DetectedProject,
    dryRun: boolean
  ): Promise<void> {
    if (feature.id === "auth") {
      logger.info("Integrating AuthProvider into existing layout...");

      // Check if already integrated
      const isAlreadyIntegrated = await this.layoutIntegrator.isAuthProviderIntegrated(project);
      if (isAlreadyIntegrated) {
        logger.info("AuthProvider already integrated into layout");
        return;
      }

      // Validate layout integration requirements
      const validation = await this.layoutIntegrator.validateLayoutIntegration(project);
      if (!validation.valid) {
        logger.warn("Layout integration validation failed:");
        validation.errors.forEach((error) => logger.warn(`  - ${error}`));
        return;
      }

      // Integrate AuthProvider
      await this.layoutIntegrator.integrateAuthProvider(project, dryRun);

      if (!dryRun) {
        logger.success("✅ AuthProvider integrated into existing layout!");
        logger.info("Your auth components are now available throughout your app.");
      }
    }
  }

  /**
   * Create example file
   */
  private async createExampleFile(
    feature: FeatureManifest,
    project: DetectedProject,
    examplePath: string
  ): Promise<void> {
    const fullPath = path.join(project.projectPath, examplePath);

    if (await fs.pathExists(fullPath)) {
      logger.info(`Example file already exists: ${examplePath}`);
      return;
    }

    // Create a basic example file
    const exampleContent = `// Example usage of ${feature.name}
import { ${feature.id.replace(/-/g, "")}Example } from '@/features/${feature.id}';

export default function ExamplePage() {
  return <${feature.id.replace(/-/g, "")}Example />;
}
`;

    await fs.ensureDir(path.dirname(fullPath));
    await fs.writeFile(fullPath, exampleContent);
    logger.info(`Created example file: ${examplePath}`);
  }

  /**
   * Get project name from package.json or directory
   */
  private getProjectName(projectPath: string): string {
    try {
      const packageJsonPath = path.join(projectPath, "package.json");
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = fs.readJsonSync(packageJsonPath);
        return packageJson.name || path.basename(projectPath);
      }
    } catch (error) {
      // Fallback to directory name
    }
    return path.basename(projectPath);
  }

  /**
   * Show usage instructions after installation
   */
  private showUsageInstructions(feature: FeatureManifest): void {
    logger.info("\n🎉 Installation complete!");
    logger.info("\n📚 Quick Start:");

    feature.usage.quickStart.forEach((step, index) => {
      logger.info(`  ${index + 1}. ${step}`);
    });

    if (feature.usage.examples.length > 0) {
      logger.info("\n💡 Examples:");
      feature.usage.examples.forEach((example) => {
        logger.info(`  ${example.title}:`);
        logger.info(`    ${example.code.split("\n")[0]}...`);
      });
    }
  }
}
