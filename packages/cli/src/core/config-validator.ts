import { z } from "zod";
import { consola } from "consola";
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

export class ConfigValidator {
  private rules: CompatibilityRule[] = [];
  
  constructor() {
    this.registerDefaultRules();
  }

  private registerDefaultRules() {
    // Framework-specific rules
    this.addRule({
      name: "next-requires-react",
      check: (config) => {
        if (config.framework === "next") {
          return true; // Next.js is React-based, so this is always valid
        }
        return true;
      },
      message: "Next.js requires React",
      severity: "error"
    });

    // Database-ORM compatibility rules
    this.addRule({
      name: "mongoose-requires-mongodb",
      check: (config) => {
        if (config.orm === "mongoose" && config.database !== "mongodb") {
          return false;
        }
        return true;
      },
      message: "Mongoose ORM can only be used with MongoDB",
      severity: "error"
    });

    this.addRule({
      name: "prisma-sqlite-warning",
      check: (config) => {
        if (config.orm === "prisma" && config.database === "sqlite") {
          return false; // This will trigger a warning
        }
        return true;
      },
      message: "SQLite with Prisma is not recommended for production use",
      severity: "warning"
    });

    // Styling compatibility
    this.addRule({
      name: "tailwind-postcss",
      check: (config) => {
        // This is always valid, just informational
        return true;
      },
      message: "Tailwind CSS will automatically configure PostCSS",
      severity: "warning"
    });

    // Backend-database rules
    this.addRule({
      name: "no-backend-no-database",
      check: (config) => {
        if (config.backend === "none" && config.database !== "none") {
          return false;
        }
        return true;
      },
      message: "Cannot use a database without a backend",
      severity: "error"
    });

    // Docker recommendations
    this.addRule({
      name: "docker-database-recommendation",
      check: (config) => {
        if (config.docker && config.database === "none") {
          return false;
        }
        return true;
      },
      message: "Docker setup is most useful when you have a database",
      severity: "warning"
    });

    // TypeScript recommendations
    this.addRule({
      name: "typescript-recommended",
      check: (config) => {
        if (!config.typescript && (config.framework === "angular" || config.framework === "vue")) {
          return false;
        }
        return true;
      },
      message: "TypeScript is highly recommended for Angular and Vue projects",
      severity: "warning"
    });
  }

  addRule(rule: CompatibilityRule): void {
    this.rules.push(rule);
  }

  removeRule(ruleName: string): boolean {
    const index = this.rules.findIndex(r => r.name === ruleName);
    if (index > -1) {
      this.rules.splice(index, 1);
      return true;
    }
    return false;
  }

  validate(config: ProjectConfig): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Run all validation rules
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

    // Basic schema validation
    try {
      this.validateSchema(config);
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors.push(...error.errors.map(e => `${e.path.join(".")}: ${e.message}`));
      } else {
        errors.push("Schema validation failed");
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  private validateSchema(config: ProjectConfig): void {
    const configSchema = z.object({
      name: z.string().min(1).regex(/^[a-z0-9-]+$/, {
        message: "Project name must be lowercase and contain only letters, numbers, and hyphens"
      }),
      framework: z.string().min(1),
      backend: z.string(),
      database: z.string(),
      orm: z.string(),
      styling: z.string().min(1),
      typescript: z.boolean(),
      git: z.boolean(),
      docker: z.boolean()
    });

    configSchema.parse(config);
  }

  // Helper method to check if a combination is valid
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
      [field2]: value2
    } as ProjectConfig;

    const result = this.validate(testConfig);
    return result.valid;
  }

  // Get recommended values based on current config
  getRecommendations(partialConfig: Partial<ProjectConfig>): Map<keyof ProjectConfig, string[]> {
    const recommendations = new Map<keyof ProjectConfig, string[]>();

    // Framework recommendations
    if (!partialConfig.framework) {
      recommendations.set("framework", ["react", "vue", "next"]);
    }

    // Backend recommendations based on framework
    if (partialConfig.framework && !partialConfig.backend) {
      const backendRecs = this.getBackendRecommendations(partialConfig.framework);
      recommendations.set("backend", backendRecs);
    }

    // Database recommendations based on backend
    if (partialConfig.backend && !partialConfig.database) {
      const dbRecs = this.getDatabaseRecommendations(partialConfig.backend);
      recommendations.set("database", dbRecs);
    }

    // ORM recommendations based on database
    if (partialConfig.database && !partialConfig.orm) {
      const ormRecs = this.getORMRecommendations(partialConfig.database);
      recommendations.set("orm", ormRecs);
    }

    return recommendations;
  }

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

  private getDatabaseRecommendations(backend: string): string[] {
    if (backend === "none") {
      return ["none"];
    }

    return ["postgres", "mysql", "mongodb", "sqlite", "none"];
  }

  private getORMRecommendations(database: string): string[] {
    const recommendations: Record<string, string[]> = {
      postgres: ["prisma", "drizzle", "none"],
      mysql: ["prisma", "drizzle", "none"],
      mongodb: ["mongoose", "prisma", "none"],
      sqlite: ["prisma", "drizzle", "none"],
      none: ["none"]
    };

    return recommendations[database] || ["none"];
  }
}

// Singleton instance
let validator: ConfigValidator | null = null;

export function getConfigValidator(): ConfigValidator {
  if (!validator) {
    validator = new ConfigValidator();
  }
  return validator;
}