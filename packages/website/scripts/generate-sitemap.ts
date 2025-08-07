#!/usr/bin/env node
import { writeFileSync } from "fs";
import { resolve } from "path";

export {};

interface SitemapRoute {
  path: string;
  priority: number;
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  lastmod?: string;
}

/**
 * Generates a sitemap.xml file for the website.
 * Run this script during the build process to ensure the sitemap is always up-to-date.
 */
const generateSitemap = () => {
  const baseUrl = "https://precast.dev";
  const currentDate = new Date().toISOString().split("T")[0];

  // Define all routes with their priorities and change frequencies
  const routes: SitemapRoute[] = [
    {
      path: "/",
      priority: 1.0,
      changefreq: "weekly",
      lastmod: currentDate,
    },
    {
      path: "/builder",
      priority: 0.9,
      changefreq: "weekly",
      lastmod: currentDate,
    },
    {
      path: "/docs",
      priority: 0.8,
      changefreq: "weekly",
      lastmod: currentDate,
    },
    {
      path: "/components",
      priority: 0.7,
      changefreq: "monthly",
      lastmod: currentDate,
    },
    {
      path: "/showcase",
      priority: 0.7,
      changefreq: "daily",
      lastmod: currentDate,
    },
    {
      path: "/metrics",
      priority: 0.6,
      changefreq: "daily",
      lastmod: currentDate,
    },
    {
      path: "/origin-story",
      priority: 0.5,
      changefreq: "monthly",
      lastmod: currentDate,
    },
    {
      path: "/submit-project",
      priority: 0.6,
      changefreq: "monthly",
      lastmod: currentDate,
    },
    {
      path: "/support",
      priority: 0.5,
      changefreq: "monthly",
      lastmod: currentDate,
    },
  ];

  // Generate XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${routes
  .map(
    (route) => `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  // Write sitemap to public directory
  const sitemapPath = resolve(process.cwd(), "public", "sitemap.xml");
  writeFileSync(sitemapPath, sitemap, "utf-8");
  // eslint-disable-next-line no-console
  console.log("✅ Sitemap generated successfully at:", sitemapPath);

  // Also generate a simple sitemap index for potential future expansion
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`;

  const sitemapIndexPath = resolve(process.cwd(), "public", "sitemap-index.xml");
  writeFileSync(sitemapIndexPath, sitemapIndex, "utf-8");
  // eslint-disable-next-line no-console
  console.log("✅ Sitemap index generated successfully at:", sitemapIndexPath);

  // Generate robots.txt with dynamic timestamp
  const robotsTxt = `# Robots.txt for Precast.dev
# https://precast.dev
# Last updated: ${currentDate}

# Allow all crawlers
User-agent: *
Allow: /

# Sitemap location
Sitemap: https://precast.dev/sitemap.xml
Sitemap: https://precast.dev/sitemap-index.xml

# Crawl delay (in seconds) - optional, helps prevent server overload
Crawl-delay: 1

# Disallow access to internal API endpoints if any
Disallow: /api/internal/
Disallow: /.well-known/

# Allow social media crawlers full access
User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

User-agent: WhatsApp
Allow: /

User-agent: Slackbot
Allow: /

# Block bad bots
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: DotBot
Disallow: /

User-agent: MJ12bot
Disallow: /

# Allow search engine bots
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Crawl-delay: 0

User-agent: DuckDuckBot
Allow: /
Crawl-delay: 0

User-agent: Baiduspider
Allow: /
Crawl-delay: 1

User-agent: YandexBot
Allow: /
Crawl-delay: 1`;

  const robotsPath = resolve(process.cwd(), "public", "robots.txt");
  writeFileSync(robotsPath, robotsTxt, "utf-8");
  // eslint-disable-next-line no-console
  console.log("✅ Robots.txt updated successfully at:", robotsPath);
};

// Run the generator
generateSitemap();
