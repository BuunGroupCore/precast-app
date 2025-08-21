/**
 * Service Registry for PrecastWidget
 * @module serviceRegistry
 * @description Extensible system for registering and managing service tests
 */

import { ServiceDefinition, PrecastConfig } from "../types";

/**
 * Get all available services based on project configuration
 * @param {PrecastConfig | null} precastConfig - Project configuration object
 * @returns {Record<string, ServiceDefinition>} Map of service definitions
 */
export function getAvailableServices(
  precastConfig: PrecastConfig | null
): Record<string, ServiceDefinition> {
  const services: Record<string, ServiceDefinition> = {};

  // API service - always available when backend is configured
  services.api = {
    key: "api",
    name: "API",
    type: precastConfig?.backend || "express",
    icon: "server",
    category: "infrastructure",
    testFunction: "testApiHealth",
    healthEndpoint: "/api/health",
    port: 3001,
  };

  // Database service
  if (precastConfig?.database && precastConfig.database !== "none") {
    services.database = {
      key: "database",
      name: "DATABASE",
      type: precastConfig.database,
      icon: precastConfig.database,
      category: "infrastructure",
      testFunction: "testDatabaseConnection",
      healthEndpoint: "/api/health/database",
      port: false,
    };
  }

  // Fallback Docker service when docker isn't configured but detected in config
  if (precastConfig?.docker) {
    const containers: Array<{ name: string; port: number; icon: string }> = [];

    // Add database container
    if (precastConfig.database && precastConfig.database !== "none") {
      switch (precastConfig.database) {
        case "postgres":
        case "postgresql":
          containers.push(
            { name: "postgres:16-alpine", port: 5432, icon: "postgres" },
            { name: "pgadmin4", port: 5050, icon: "database" }
          );
          break;
        case "mysql":
          containers.push(
            { name: "mysql:8", port: 3306, icon: "mysql" },
            { name: "phpmyadmin", port: 8080, icon: "database" }
          );
          break;
        case "mongodb":
          containers.push(
            { name: "mongodb:latest", port: 27017, icon: "mongodb" },
            { name: "mongo-express", port: 8081, icon: "database" }
          );
          break;
      }
    }

    // Add powerup containers
    if (precastConfig.powerups && Array.isArray(precastConfig.powerups)) {
      precastConfig.powerups.forEach((powerup) => {
        switch (powerup) {
          case "traefik":
            containers.push(
              { name: "traefik:v3.0", port: 8080, icon: "traefik" },
              { name: "traefik-proxy", port: 80, icon: "proxy" }
            );
            break;
          case "ngrok":
            containers.push({ name: "ngrok/ngrok:alpine", port: 4040, icon: "ngrok" });
            break;
          case "cloudflare-tunnel":
            containers.push({ name: "cloudflare/cloudflared", port: 0, icon: "cloudflare-tunnel" });
            break;
        }
      });
    }

    services.docker = {
      key: "docker",
      name: "DOCKER",
      type: "compose",
      icon: "docker",
      category: "infrastructure",
      testFunction: "testDockerHealth",
      containers,
    };
  }

  // Payment service - Stripe
  services.payment = {
    key: "payment",
    name: "PAYMENT",
    type: "stripe",
    icon: "stripe",
    category: "payment",
    testFunction: "testPaymentService",
    healthEndpoint: "/api/stripe/health",
  };

  // Future extensible services can be added here
  // Examples:

  // Sentry error tracking
  //

  // Google Analytics
  //

  // SendGrid alternative email
  //

  return services;
}

/**
 * Get services grouped by category for organized display
 * @param {Record<string, ServiceDefinition>} services - Services to group
 * @returns {Record<string, ServiceDefinition[]>} Services grouped by category
 */
export function getServicesByCategory(services: Record<string, ServiceDefinition>) {
  const categorized: Record<string, ServiceDefinition[]> = {
    infrastructure: [],
    monitoring: [],
    communication: [],
    analytics: [],
    payment: [],
    auth: [],
    storage: [],
  };

  Object.values(services).forEach((service) => {
    if (categorized[service.category]) {
      categorized[service.category].push(service);
    }
  });

  // Return only categories that have services
  const result: Record<string, ServiceDefinition[]> = {};
  Object.entries(categorized).forEach(([category, serviceList]) => {
    if (serviceList.length > 0) {
      result[category] = serviceList;
    }
  });

  return result;
}

/**
 * Get the default active tab based on available services
 * @param {Record<string, ServiceDefinition>} services - Available services
 * @returns {string} Default service key to use as active tab
 */
export function getDefaultActiveTab(services: Record<string, ServiceDefinition>): string {
  // Priority order for default tab
  const priority = ["database", "api", "docker", "auth", "email", "payment"];

  for (const key of priority) {
    if (services[key]) {
      return key;
    }
  }

  // If none of the priority services exist, return the first available
  const firstService = Object.keys(services)[0];
  return firstService || "api";
}
