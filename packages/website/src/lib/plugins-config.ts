import {
  FaCreditCard,
  FaEnvelope,
  FaBolt,
  FaCloud,
  FaSearch,
  FaSms,
  FaChartBar,
  FaBook,
  FaShieldAlt,
} from "react-icons/fa";
import {
  SiStripe,
  SiSocketdotio,
  SiResend,
  SiSendgrid,
  SiGoogleanalytics,
  SiSentry,
  SiDocusaurus,
  SiTwilio,
  SiAlgolia,
  SiMeilisearch,
} from "react-icons/si";

/**
 * Plugin definition for UI display
 */
export interface Plugin {
  id: string;
  name: string;
  category:
    | "email"
    | "payments"
    | "storage"
    | "realtime"
    | "search"
    | "analytics"
    | "sms"
    | "docs"
    | "monitoring";
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  pricing: "free" | "freemium" | "paid";
  frameworks: string[];
  requiresBackend: boolean;
  requiresDatabase?: boolean;
  incompatible?: string[];
  envVariables: string[];
  setupUrl?: string;
  documentationUrl: string;
  quickstartSteps?: string[];
  beta?: boolean;
}

/**
 * Plugin definitions for the frontend builder
 */
export const plugins: Plugin[] = [
  {
    id: "stripe",
    name: "Stripe",
    category: "payments",
    description: "Accept payments with the industry-leading payment platform",
    icon: SiStripe,
    pricing: "freemium",
    frameworks: ["react", "next", "vue", "nuxt", "remix", "astro"],
    requiresBackend: true,
    requiresDatabase: false,
    envVariables: ["STRIPE_SECRET_KEY", "STRIPE_PUBLISHABLE_KEY", "STRIPE_WEBHOOK_SECRET"],
    documentationUrl: "https://stripe.com/docs",
    setupUrl: "https://dashboard.stripe.com",
    quickstartSteps: [
      "Get API keys from Stripe Dashboard",
      "Add keys to .env file",
      "Set up webhook endpoints",
      "Test with Stripe test cards",
    ],
  },
  {
    id: "resend",
    name: "Resend",
    category: "email",
    description: "Modern email API built for developers",
    icon: SiResend,
    pricing: "freemium",
    frameworks: ["*"],
    requiresBackend: true,
    envVariables: ["RESEND_API_KEY", "RESEND_FROM_EMAIL"],
    documentationUrl: "https://resend.com/docs",
    setupUrl: "https://resend.com/signup",
    quickstartSteps: [
      "Sign up and get API key",
      "Verify your domain",
      "Add API key to .env",
      "Send your first email",
    ],
  },
  {
    id: "sendgrid",
    name: "SendGrid",
    category: "email",
    description: "Trusted email delivery at scale",
    icon: SiSendgrid,
    pricing: "freemium",
    frameworks: ["*"],
    requiresBackend: true,
    envVariables: ["SENDGRID_API_KEY", "SENDGRID_FROM_EMAIL"],
    documentationUrl: "https://docs.sendgrid.com",
    setupUrl: "https://app.sendgrid.com",
    quickstartSteps: [
      "Create SendGrid account",
      "Get API key",
      "Verify sender identity",
      "Configure DNS records",
    ],
  },
  {
    id: "socketio",
    name: "Socket.io",
    category: "realtime",
    description: "Real-time bidirectional event-based communication",
    icon: SiSocketdotio,
    pricing: "free",
    frameworks: ["*"],
    requiresBackend: true,
    envVariables: ["SOCKET_IO_CORS_ORIGIN"],
    documentationUrl: "https://socket.io/docs/v4/",
    quickstartSteps: [
      "Socket server configured",
      "Wrap app with SocketProvider",
      "Use useSocket hook",
      "Consider Redis for production scaling",
    ],
  },

  // Analytics & Monitoring
  {
    id: "google-analytics",
    name: "Google Analytics",
    category: "analytics",
    description: "Industry-leading web analytics platform with comprehensive insights",
    icon: SiGoogleanalytics,
    pricing: "free",
    frameworks: ["*"],
    requiresBackend: false,
    envVariables: ["NEXT_PUBLIC_GA_MEASUREMENT_ID", "VITE_GA_MEASUREMENT_ID"],
    documentationUrl: "https://developers.google.com/analytics",
    setupUrl: "https://analytics.google.com",
    quickstartSteps: [
      "Create Google Analytics property",
      "Get Measurement ID",
      "Add tracking code to app",
      "Verify data collection",
    ],
  },
  {
    id: "posthog",
    name: "PostHog",
    category: "analytics",
    description: "Open-source product analytics with session recording and feature flags",
    icon: FaChartBar,
    pricing: "freemium",
    frameworks: ["*"],
    requiresBackend: false,
    envVariables: ["NEXT_PUBLIC_POSTHOG_KEY", "NEXT_PUBLIC_POSTHOG_HOST", "VITE_POSTHOG_KEY"],
    documentationUrl: "https://posthog.com/docs",
    setupUrl: "https://app.posthog.com/signup",
    quickstartSteps: [
      "Sign up for PostHog",
      "Get project API key",
      "Install PostHog SDK",
      "Initialize tracking",
      "Set up feature flags (optional)",
    ],
  },
  {
    id: "vercel-analytics",
    name: "Vercel Analytics",
    category: "analytics",
    description: "Privacy-friendly, real-time analytics optimized for Next.js",
    icon: FaChartBar,
    pricing: "freemium",
    frameworks: ["next", "react", "vue", "svelte"],
    requiresBackend: false,
    envVariables: [],
    documentationUrl: "https://vercel.com/docs/analytics",
    setupUrl: "https://vercel.com/analytics",
    quickstartSteps: [
      "Deploy to Vercel",
      "Enable Analytics in dashboard",
      "Install @vercel/analytics",
      "Add Analytics component",
    ],
  },
  {
    id: "sentry",
    name: "Sentry",
    category: "monitoring",
    description: "Application monitoring with error tracking and performance insights",
    icon: SiSentry,
    pricing: "freemium",
    frameworks: ["*"],
    requiresBackend: false,
    envVariables: ["SENTRY_DSN", "NEXT_PUBLIC_SENTRY_DSN", "SENTRY_AUTH_TOKEN"],
    documentationUrl: "https://docs.sentry.io",
    setupUrl: "https://sentry.io/signup",
    quickstartSteps: [
      "Create Sentry project",
      "Get DSN from project settings",
      "Install Sentry SDK",
      "Initialize error tracking",
      "Set up source maps",
    ],
  },

  // Documentation Platforms
  {
    id: "fumadocs",
    name: "Fumadocs",
    category: "docs",
    description: "Beautiful, fast documentation sites built for Next.js App Router",
    icon: FaBook,
    pricing: "free",
    frameworks: ["next"],
    requiresBackend: false,
    envVariables: [],
    documentationUrl: "https://fumadocs.vercel.app",
    quickstartSteps: [
      "Install fumadocs packages",
      "Set up app structure",
      "Configure MDX",
      "Create first docs page",
      "Customize theme",
    ],
  },
  {
    id: "docusaurus",
    name: "Docusaurus",
    category: "docs",
    description: "Easy to maintain open source documentation websites by Meta",
    icon: SiDocusaurus,
    pricing: "free",
    frameworks: ["react"],
    requiresBackend: false,
    envVariables: [],
    documentationUrl: "https://docusaurus.io/docs",
    setupUrl: "https://docusaurus.io/docs/installation",
    quickstartSteps: [
      "Initialize Docusaurus project",
      "Configure docusaurus.config.js",
      "Create docs structure",
      "Customize theme",
      "Deploy to GitHub Pages/Vercel",
    ],
  },
  {
    id: "nextra",
    name: "Nextra",
    category: "docs",
    description: "Simple, powerful and flexible site generation framework for Next.js",
    icon: FaBook,
    pricing: "free",
    frameworks: ["next"],
    requiresBackend: false,
    envVariables: [],
    documentationUrl: "https://nextra.site/docs",
    quickstartSteps: [
      "Install Nextra theme",
      "Configure theme.config.tsx",
      "Create MDX pages",
      "Set up navigation",
    ],
  },

  // SMS Services
  {
    id: "twilio",
    name: "Twilio",
    category: "sms",
    description: "Programmable messaging, voice, and video communications",
    icon: SiTwilio,
    pricing: "paid",
    frameworks: ["*"],
    requiresBackend: true,
    envVariables: ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_PHONE_NUMBER"],
    documentationUrl: "https://www.twilio.com/docs",
    setupUrl: "https://console.twilio.com",
    quickstartSteps: [
      "Sign up for Twilio account",
      "Get phone number",
      "Copy credentials",
      "Install Twilio SDK",
      "Send test message",
    ],
  },

  // Search Services
  {
    id: "algolia",
    name: "Algolia",
    category: "search",
    description: "AI-powered search and discovery platform",
    icon: SiAlgolia,
    pricing: "freemium",
    frameworks: ["*"],
    requiresBackend: false,
    envVariables: ["ALGOLIA_APP_ID", "ALGOLIA_API_KEY", "ALGOLIA_INDEX_NAME"],
    documentationUrl: "https://www.algolia.com/doc",
    setupUrl: "https://www.algolia.com/users/sign_up",
    quickstartSteps: [
      "Create Algolia account",
      "Set up search index",
      "Get API keys",
      "Install InstantSearch",
      "Configure search UI",
    ],
  },
  {
    id: "meilisearch",
    name: "Meilisearch",
    category: "search",
    description: "Open-source, lightning-fast search engine",
    icon: SiMeilisearch,
    pricing: "free",
    frameworks: ["*"],
    requiresBackend: true,
    envVariables: ["MEILISEARCH_HOST", "MEILISEARCH_API_KEY"],
    documentationUrl: "https://docs.meilisearch.com",
    setupUrl: "https://cloud.meilisearch.com",
    quickstartSteps: [
      "Deploy Meilisearch instance",
      "Get API key",
      "Index your data",
      "Install SDK",
      "Implement search",
    ],
  },

  // Cloud Storage
  {
    id: "uploadthing",
    name: "UploadThing",
    category: "storage",
    description: "Type-safe file uploads for Next.js and React",
    icon: FaCloud,
    pricing: "freemium",
    frameworks: ["next", "react"],
    requiresBackend: true,
    envVariables: ["UPLOADTHING_SECRET", "UPLOADTHING_APP_ID"],
    documentationUrl: "https://docs.uploadthing.com",
    setupUrl: "https://uploadthing.com",
    quickstartSteps: [
      "Create UploadThing app",
      "Get API keys",
      "Install packages",
      "Set up API route",
      "Add upload component",
    ],
  },
  {
    id: "cloudinary",
    name: "Cloudinary",
    category: "storage",
    description: "Image and video management with automatic optimization",
    icon: FaCloud,
    pricing: "freemium",
    frameworks: ["*"],
    requiresBackend: false,
    envVariables: ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"],
    documentationUrl: "https://cloudinary.com/documentation",
    setupUrl: "https://cloudinary.com/users/register",
    quickstartSteps: [
      "Sign up for Cloudinary",
      "Get cloud name and API keys",
      "Install SDK",
      "Configure upload preset",
      "Implement upload widget",
    ],
  },
];

export const pluginCategories = [
  { id: "email", name: "Email", icon: FaEnvelope },
  { id: "payments", name: "Payments", icon: FaCreditCard },
  { id: "storage", name: "Storage", icon: FaCloud },
  { id: "realtime", name: "Real-time", icon: FaBolt },
  { id: "search", name: "Search", icon: FaSearch },
  { id: "analytics", name: "Analytics", icon: FaChartBar },
  { id: "monitoring", name: "Monitoring", icon: FaShieldAlt },
  { id: "docs", name: "Documentation", icon: FaBook },
  { id: "sms", name: "SMS", icon: FaSms },
];

/**
 * Get plugins for a specific category
 */
export function getPluginsByCategory(category: string): Plugin[] {
  return plugins.filter((plugin) => plugin.category === category);
}

/**
 * Get plugin by ID
 */
export function getPluginById(id: string): Plugin | undefined {
  return plugins.find((plugin) => plugin.id === id);
}

/**
 * Check if plugin is compatible with selected framework
 */
export function isPluginCompatible(plugin: Plugin, framework: string, backend?: string): boolean {
  // Check framework compatibility
  if (!plugin.frameworks.includes("*") && !plugin.frameworks.includes(framework)) {
    return false;
  }

  // Check backend requirement
  if (plugin.requiresBackend && (!backend || backend === "none")) {
    return false;
  }

  return true;
}

/**
 * Get recommended plugins for a configuration
 */
export function getRecommendedPlugins(framework: string, backend?: string): Plugin[] {
  return plugins.filter((plugin) => {
    // Check compatibility
    if (!isPluginCompatible(plugin, framework, backend)) {
      return false;
    }

    // Recommend based on common use cases
    if (framework === "next" || framework === "remix") {
      // Full-stack frameworks benefit from these
      return ["stripe", "resend", "socketio"].includes(plugin.id);
    }

    if (backend && backend !== "none") {
      // Backend projects benefit from these
      return ["resend", "socketio"].includes(plugin.id);
    }

    return false;
  });
}
