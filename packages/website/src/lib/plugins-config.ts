import {
  FaCreditCard,
  FaEnvelope,
  FaBolt,
  FaCloud,
  FaSearch,
  FaSms,
  FaChartBar,
} from "react-icons/fa";
import { MdEmail, MdSend } from "react-icons/md";
import { SiStripe, SiSocketdotio } from "react-icons/si";

/**
 * Plugin definition for UI display
 */
export interface Plugin {
  id: string;
  name: string;
  category: "email" | "payments" | "storage" | "realtime" | "search" | "analytics" | "sms";
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
    icon: MdEmail,
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
    icon: MdSend,
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
];

export const pluginCategories = [
  { id: "email", name: "Email", icon: FaEnvelope },
  { id: "payments", name: "Payments", icon: FaCreditCard },
  { id: "storage", name: "Storage", icon: FaCloud },
  { id: "realtime", name: "Real-time", icon: FaBolt },
  { id: "search", name: "Search", icon: FaSearch },
  { id: "analytics", name: "Analytics", icon: FaChartBar },
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
