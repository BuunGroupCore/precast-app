import { Router, Request, Response } from "express";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router = Router();

// GET /api/health - General health check
router.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// GET /api/health/database - Database connection check
router.get("/health/database", async (_req: Request, res: Response) => {
  try {
    // Test database connection with Prisma
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: "connected",
      database: "postgres",
      orm: "prisma",
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

// GET /api/stripe/health - Stripe connection check
router.get("/stripe/health", async (req: Request, res: Response) => {
  try {
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

    // Test Stripe connection by fetching account details
    const account = await stripe.accounts.retrieve();

    res.json({
      status: "connected",
      provider: "Stripe",
      accountId: account.id,
      livemode: account.livemode,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Stripe health check failed:", error);
    res.status(503).json({
      status: "disconnected",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
