import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * User table schema
 * @description Defines the structure for the users table
 */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * TypeScript types inferred from schema
 */
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
