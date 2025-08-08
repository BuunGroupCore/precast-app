import type { ProjectConfig } from "../../../../shared/stack-config.js";
import type { TemplateEngine } from "../../core/template-engine.js";

/**
 * Base interface for all database generators
 */
export interface DatabaseGenerator {
  /**
   * Unique identifier for the database
   */
  id: string;

  /**
   * Display name for the database
   */
  name: string;

  /**
   * Supported ORMs for this database
   */
  supportedORMs: string[];

  /**
   * Setup database-specific configuration files
   */
  setup(config: ProjectConfig, projectPath: string, templateEngine: TemplateEngine): Promise<void>;

  /**
   * Install required dependencies
   */
  installDependencies(config: ProjectConfig, projectPath: string): Promise<void>;

  /**
   * Setup environment variables
   */
  setupEnvironment(config: ProjectConfig, projectPath: string): Promise<void>;

  /**
   * Get connection string template
   */
  getConnectionString(config: ProjectConfig): string;

  /**
   * Setup database-specific Docker configuration if needed
   */
  setupDocker?(config: ProjectConfig, projectPath: string): Promise<void>;

  /**
   * Post-install instructions for the user
   */
  getNextSteps?(): string[];
}
