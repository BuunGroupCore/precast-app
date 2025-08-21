/**
 * Application Constants for Next.js
 * Central configuration for the entire application
 */

// App Information
export const APP_CONFIG = {
  name: "test-mysql",
  displayName: "test-mysql",
  description: "A modern web application built with Next.js",
  version: "1.0.0",
  url: "https://test-mysql.com",
} as const;

// SEO & Meta
export const SEO_CONFIG = {
  title: `${APP_CONFIG.name} - Modern Web Application`,
  description: APP_CONFIG.description,
  keywords: ["test-mysql", "React", "Next.js", "TypeScript"],
  ogImage: "/og-image.png",
} as const;

// Social Media
export const SOCIAL_LINKS = {
  github: "https://github.com/test-mysql",
  twitter: "https://twitter.com/test-mysql",
  linkedin: "https://linkedin.com/company/test-mysql",
  discord: "https://discord.gg/test-mysql",
} as const;

// API Configuration - Next.js uses process.env (server) and NEXT_PUBLIC_ (client)
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Type exports
export type AppConfig = typeof APP_CONFIG;
export type SeoConfig = typeof SEO_CONFIG;
export type SocialLinks = typeof SOCIAL_LINKS;
