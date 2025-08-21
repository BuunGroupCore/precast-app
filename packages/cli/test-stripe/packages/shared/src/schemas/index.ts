// Validation schemas for shared data models
// These can be used with libraries like zod, yup, or joi

// Example Zod schemas (install zod if you want to use these)
/*
import { z } from "zod";

export const UserCreateSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  password: z.string().min(8),
});

export const UserUpdateSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

// Export inferred types
export type UserCreateInput = z.infer<typeof UserCreateSchema>;
export type UserUpdateInput = z.infer<typeof UserUpdateSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type PaginationInput = z.infer<typeof PaginationSchema>;
*/

// For now, export basic validation functions
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  return password.length >= 8;
}
