import type { Config } from "drizzle-kit";

/**
 * Drizzle configuration
 * @description Configuration for Drizzle Kit migrations and schema management
 */
export default {
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
} satisfies Config;
