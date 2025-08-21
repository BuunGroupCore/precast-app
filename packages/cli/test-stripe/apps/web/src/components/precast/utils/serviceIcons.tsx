/**
 * Service Icon Mapping Utility
 * Extracted from PrecastWidget for better organization
 */

import React from "react";
import {
  SiPostgresql,
  SiDocker,
  SiMongodb,
  SiMysql,
  SiPrisma,
  SiRedis,
  SiSupabase,
  SiStripe,
  SiCloudflare,
  SiNgrok,
} from "react-icons/si";
import {
  Server,
  Database,
  Mail,
  Activity,
  Container,
  Layers,
  Terminal,
  AlertTriangle,
  Shield,
  User,
  Route,
  Globe,
  Network,
} from "lucide-react";

/**
 * Service icon mapping function
 * Returns appropriate icon for a given service type
 */
export const getServiceIcon = (service: string, size: number = 16): React.ReactNode => {
  const iconProps = { size, className: "icon-black" };

  const iconMap: Record<string, React.ReactNode> = {
    // Database icons
    postgres: <SiPostgresql {...iconProps} />,
    postgresql: <SiPostgresql {...iconProps} />,
    mysql: <SiMysql {...iconProps} />,
    mongodb: <SiMongodb {...iconProps} />,

    // ORM/Database tools
    prisma: <SiPrisma {...iconProps} />,
    redis: <SiRedis {...iconProps} />,
    supabase: <SiSupabase {...iconProps} />,

    // Infrastructure
    docker: <SiDocker {...iconProps} />,
    server: <Server {...iconProps} />,
    database: <Database {...iconProps} />,
    container: <Container {...iconProps} />,

    // Communication
    mail: <Mail {...iconProps} />,

    // Payment
    stripe: <SiStripe {...iconProps} />,

    // Analytics & Monitoring
    api: <Activity {...iconProps} />,

    // Authentication
    auth: <Shield {...iconProps} />,
    user: <User {...iconProps} />,

    // Networking & Tunneling
    traefik: <Route {...iconProps} />,
    ngrok: <Globe {...iconProps} />,
    "cloudflare-tunnel": <SiCloudflare {...iconProps} />,
    cloudflare: <SiCloudflare {...iconProps} />,
    network: <Network {...iconProps} />,
    tunnel: <Globe {...iconProps} />,
    proxy: <Route {...iconProps} />,

    // Generic fallbacks
    layers: <Layers {...iconProps} />,
    terminal: <Terminal {...iconProps} />,
    alert: <AlertTriangle {...iconProps} />,

    // Future extensible icons for new services
    // Add new service icons here as needed:
    // sentry: <SiSentry {...iconProps} />,
    // analytics: <SiGoogleanalytics {...iconProps} />,
    // sendgrid: <SiSendgrid {...iconProps} />,
    // github: <SiGithub {...iconProps} />,
    // etc...
  };

  // Return the mapped icon or a default fallback
  return iconMap[service.toLowerCase()] || <Layers {...iconProps} />;
};

/**
 * Get icon category for grouping purposes
 */
export const getIconCategory = (service: string): string => {
  const categoryMap: Record<string, string> = {
    // Infrastructure
    postgres: "infrastructure",
    postgresql: "infrastructure",
    mysql: "infrastructure",
    mongodb: "infrastructure",
    redis: "infrastructure",
    docker: "infrastructure",
    server: "infrastructure",
    database: "infrastructure",
    api: "infrastructure",

    // Communication
    mail: "communication",
    resend: "communication",
    sendgrid: "communication",

    // Payment
    stripe: "payment",

    // Authentication
    auth: "auth",
    user: "auth",

    // Monitoring
    sentry: "monitoring",
    analytics: "analytics",

    // Networking
    traefik: "networking",
    ngrok: "networking",
    cloudflare: "networking",
    tunnel: "networking",
    proxy: "networking",
  };

  return categoryMap[service.toLowerCase()] || "other";
};

/**
 * Check if an icon exists for a given service
 */
export const hasServiceIcon = (service: string): boolean => {
  const iconMap = [
    "postgres",
    "postgresql",
    "mysql",
    "mongodb",
    "prisma",
    "redis",
    "supabase",
    "docker",
    "server",
    "database",
    "container",
    "mail",
    "stripe",
    "api",
    "auth",
    "user",
    "traefik",
    "ngrok",
    "cloudflare-tunnel",
    "cloudflare",
    "network",
    "tunnel",
    "proxy",
    "layers",
    "terminal",
    "alert",
  ];

  return iconMap.includes(service.toLowerCase());
};
