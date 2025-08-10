import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema.js";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

/**
 * PostgreSQL connection pool
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

/**
 * Drizzle database instance
 * @description Pre-configured Drizzle client for PostgreSQL
 */
export const db = drizzle(pool, { schema });

/**
 * Database health check
 * @description Verifies database connection is working
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await db.execute("SELECT 1" as any);
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
}

/**
 * Graceful shutdown
 * @description Closes database connections properly
 */
process.on("SIGINT", async () => {
  await pool.end();
  process.exit(0);
});
