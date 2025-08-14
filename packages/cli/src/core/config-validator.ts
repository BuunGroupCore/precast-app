import { consola } from "consola";
import { z } from "zod";

import type { ProjectConfig } from "../../../shared/stack-config.js";
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}
export interface CompatibilityRule {
  name: string;
  check: (config: ProjectConfig) => boolean;
  message: string;
  severity: "error" | "warning";
}

/**
 * Validator for project configuration
 */
export class ConfigValidator {
  private rules: CompatibilityRule[] = [];
  constructor() {
    this.registerDefaultRules();
  }

  /**
   * Register default validation rules
   */
  private registerDefaultRules() {
    this.addRule({
      name: "next-requires-react",
      check: (config) => {
        if (config.framework === "next") {
          return true;
        }
        return true;
      },
      message: "Next.js requires React",
      severity: "error",
    });
    this.addRule({
      name: "mongoose-requires-mongodb",
      check: (config) => {
        if (config.orm === "mongoose" && config.database !== "mongodb") {
          return false;
        }
        return true;
      },
      message: "Mongoose ORM can only be used with MongoDB",
      severity: "error",
    });
    this.addRule({
      name: "prisma-sqlite-warning",
      check: (config) => {
        if (config.orm === "prisma" && config.database === "sqlite") {
          return false;
        }
        return true;
      },
      message: "SQLite with Prisma is not recommended for production use",
      severity: "warning",
    });
    this.addRule({
      name: "tailwind-postcss",
      check: (_config) => {
        return true;
      },
      message: "Tailwind CSS will automatically configure PostCSS",
      severity: "warning",
    });
    this.addRule({
      name: "no-backend-no-database",
      check: (config) => {
        if (config.backend === "none" && config.database !== "none") {
          return false;
        }
        return true;
      },
      message: "Cannot use a database without a backend",
      severity: "error",
    });
    this.addRule({
      name: "docker-database-recommendation",
      check: (config) => {
        if (config.docker && config.database === "none") {
          return false;
        }
        return true;
      },
      message: "Docker setup is most useful when you have a database",
      severity: "warning",
    });
    this.addRule({
      name: "typescript-recommended",
      check: (config) => {
        if (!config.typescript && (config.framework === "angular" || config.framework === "vue")) {
          return false;
        }
        return true;
      },
      message: "TypeScript is highly recommended for Angular and Vue projects",
      severity: "warning",
    });

    this.addRule({
      name: "traefik-requires-docker",
      check: (config) => {
        if (config.powerups && config.powerups.includes("traefik") && !config.docker) {
          return false;
        }
        return true;
      },
      message:
        "Traefik PowerUp requires Docker to be enabled. Please add --docker flag or enable Docker in the configuration",
      severity: "error",
    });

    this.addRule({
      name: "powerups-docker-dependency",
      check: (config) => {
        const dockerRequiredPowerUps = [
          "traefik",
          "redis",
          "rabbitmq",
          "elasticsearch",
          "ngrok",
          "cloudflare-tunnel",
        ];

        if (config.powerups && !config.docker) {
          const needsDocker = config.powerups.some((powerup) =>
            dockerRequiredPowerUps.includes(powerup)
          );
          if (needsDocker) {
            return false;
          }
        }
        return true;
      },
      message: "Some selected PowerUps require Docker. Please enable Docker with --docker flag",
      severity: "error",
    });

    // Tunneling PowerUp validation
    this.addRule({
      name: "ngrok-requires-docker",
      check: (config) => {
        if (config.powerups && config.powerups.includes("ngrok") && !config.docker) {
          return false;
        }
        return true;
      },
      message: "ngrok PowerUp requires Docker to be enabled. Please add --docker flag",
      severity: "error",
    });

    this.addRule({
      name: "cloudflare-tunnel-requires-docker",
      check: (config) => {
        if (config.powerups && config.powerups.includes("cloudflare-tunnel") && !config.docker) {
          return false;
        }
        return true;
      },
      message: "Cloudflare Tunnel PowerUp requires Docker to be enabled. Please add --docker flag",
      severity: "error",
    });

    this.addRule({
      name: "tunnel-with-traefik-recommendation",
      check: (config) => {
        if (config.powerups) {
          const hasTunnel = config.powerups.some((p) => ["ngrok", "cloudflare-tunnel"].includes(p));
          const hasTraefik = config.powerups.includes("traefik");
          if (hasTunnel && !hasTraefik && config.backend && config.backend !== "none") {
            return false;
          }
        }
        return true;
      },
      message:
        "Consider adding Traefik PowerUp for better routing when using tunnels with a backend",
      severity: "warning",
    });
  }

  /**
   * Add a validation rule
   * @param rule - Rule to add
   */
  addRule(rule: CompatibilityRule): void {
    this.rules.push(rule);
  }

  /**
   * Remove a validation rule by name
   * @param ruleName - Name of rule to remove
   * @returns True if rule was removed
   */
  removeRule(ruleName: string): boolean {
    const index = this.rules.findIndex((r) => r.name === ruleName);
    if (index > -1) {
      this.rules.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Validate a project configuration
   * @param config - Configuration to validate
   * @returns Validation result with errors and warnings
   */
  validate(config: ProjectConfig): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    for (const rule of this.rules) {
      try {
        const passed = rule.check(config);
        if (!passed) {
          if (rule.severity === "error") {
            errors.push(rule.message);
          } else {
            warnings.push(rule.message);
          }
        }
      } catch (error) {
        consola.error(`Error executing validation rule "${rule.name}":`, error);
        errors.push(`Validation rule "${rule.name}" failed to execute`);
      }
    }
    try {
      this.validateSchema(config);
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors.push(...error.errors.map((e) => `${e.path.join(".")}: ${e.message}`));
      } else {
        errors.push("Schema validation failed");
      }
    }
    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate configuration against Zod schema
   * @param config - Configuration to validate
   */
  private validateSchema(config: ProjectConfig): void {
    const configSchema = z.object({
      name: z
        .string()
        .min(1)
        .regex(/^[a-z0-9-]+$/, {
          message: "Project name must be lowercase and contain only letters, numbers, and hyphens",
        }),
      framework: z.string().min(1),
      backend: z.string(),
      database: z.string(),
      orm: z.string(),
      styling: z.string().min(1),
      typescript: z.boolean(),
      git: z.boolean(),
      docker: z.boolean(),
    });
    configSchema.parse(config);
  }

  /**
   * Check if two configuration values are compatible
   * @param field1 - First field name
   * @param value1 - First field value
   * @param field2 - Second field name
   * @param value2 - Second field value
   * @param config - Partial configuration context
   * @returns True if values are compatible
   */
  isCompatible(
    field1: keyof ProjectConfig,
    value1: string,
    field2: keyof ProjectConfig,
    value2: string,
    config: Partial<ProjectConfig>
  ): boolean {
    const testConfig = {
      ...config,
      [field1]: value1,
      [field2]: value2,
    } as ProjectConfig;
    const result = this.validate(testConfig);
    return result.valid;
  }

  /**
   * Get recommendations for incomplete configuration
   * @param partialConfig - Partial configuration
   * @returns Map of field names to recommended values
   */
  getRecommendations(partialConfig: Partial<ProjectConfig>): Map<keyof ProjectConfig, string[]> {
    const recommendations = new Map<keyof ProjectConfig, string[]>();
    if (!partialConfig.framework) {
      recommendations.set("framework", ["react", "vue", "next"]);
    }
    if (partialConfig.framework && !partialConfig.backend) {
      const backendRecs = this.getBackendRecommendations(partialConfig.framework);
      recommendations.set("backend", backendRecs);
    }
    if (partialConfig.backend && !partialConfig.database) {
      const dbRecs = this.getDatabaseRecommendations(partialConfig.backend);
      recommendations.set("database", dbRecs);
    }
    if (partialConfig.database && !partialConfig.orm) {
      const ormRecs = this.getORMRecommendations(partialConfig.database);
      recommendations.set("orm", ormRecs);
    }
    return recommendations;
  }

  /**
   * Get backend recommendations for a framework
   * @param framework - Framework name
   * @returns List of recommended backends
   */
  private getBackendRecommendations(framework: string): string[] {
    const recommendations: Record<string, string[]> = {
      next: ["next", "none"],
      nuxt: ["nuxt", "none"],
      remix: ["remix", "none"],
      react: ["express", "fastify", "hono", "none"],
      vue: ["express", "fastify", "hono", "none"],
      angular: ["express", "fastify", "nestjs", "none"],
      svelte: ["sveltekit", "express", "fastify", "none"],
      solid: ["express", "fastify", "hono", "none"],
      vanilla: ["express", "fastify", "hono", "none"],
      astro: ["astro", "none"],
    };
    return recommendations[framework] || ["express", "fastify", "hono", "none"];
  }

  /**
   * Get database recommendations for a backend
   * @param backend - Backend name
   * @returns List of recommended databases
   */
  private getDatabaseRecommendations(backend: string): string[] {
    if (backend === "none") {
      return ["none"];
    }
    return ["postgres", "mysql", "mongodb", "sqlite", "none"];
  }

  /**
   * Get ORM recommendations for a database
   * @param database - Database name
   * @returns List of recommended ORMs
   */
  private getORMRecommendations(database: string): string[] {
    const recommendations: Record<string, string[]> = {
      postgres: ["prisma", "drizzle", "none"],
      mysql: ["prisma", "drizzle", "none"],
      mongodb: ["mongoose", "prisma", "none"],
      sqlite: ["prisma", "drizzle", "none"],
      none: ["none"],
    };
    return recommendations[database] || ["none"];
  }
}

let validator: ConfigValidator | null = null;

/**
 * Get the singleton config validator instance
 * @returns Config validator instance
 */
export function getConfigValidator(): ConfigValidator {
  if (!validator) {
    validator = new ConfigValidator();
  }
  return validator;
}
