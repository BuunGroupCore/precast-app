import { Router, Request, Response } from "express";

import { db } from "@/db";

const router = Router();

// GET /api/health - General health check
router.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// GET /api/health/database - Database connection check
router.get("/health/database", async (req: Request, res: Response) => {
  try {
    // Test database connection with Drizzle
    await db.execute("SELECT 1");

    res.json({
      status: "connected",
      database: "postgres",
      orm: "drizzle",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Database health check failed:", error);
    res.status(503).json({
      status: "disconnected",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
