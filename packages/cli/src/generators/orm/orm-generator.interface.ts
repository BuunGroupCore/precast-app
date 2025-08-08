import type { ProjectConfig } from "../../../../shared/stack-config.js";
import type { TemplateEngine } from "../../core/template-engine.js";

/**
 * Base interface for all ORM generators
 */
export interface ORMGenerator {
  /**
   * Unique identifier for the ORM
   */
  id: string;

  /**
   * Display name for the ORM
   */
  name: string;

  /**
   * Supported databases for this ORM
   */
  supportedDatabases: string[];

  /**
   * Setup ORM-specific configuration files
   */
  setup(config: ProjectConfig, projectPath: string, templateEngine: TemplateEngine): Promise<void>;

  /**
   * Install required ORM dependencies
   */
  installDependencies(config: ProjectConfig, projectPath: string): Promise<void>;

  /**
   * Generate schema files
   */
  generateSchema(
    config: ProjectConfig,
    projectPath: string,
    templateEngine: TemplateEngine
  ): Promise<void>;

  /**
   * Generate client/connection files
   */
  generateClient(
    config: ProjectConfig,
    projectPath: string,
    templateEngine: TemplateEngine
  ): Promise<void>;

  /**
   * Setup migration scripts and configuration
   */
  setupMigrations?(config: ProjectConfig, projectPath: string): Promise<void>;

  /**
   * Post-setup instructions for the user
   */
  getNextSteps?(): string[];
}
