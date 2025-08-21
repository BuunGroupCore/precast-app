/**
 * useServiceRegistry Hook
 * Manages service registration and discovery
 */

import { useMemo } from "react";
import { ServiceDefinition, PrecastConfig } from "../types";
import { getAvailableServices, getDefaultActiveTab } from "../services/serviceRegistry";

/**
 * Hook to manage service registry and discovery
 * Builds services dynamically based on configuration
 */
export function useServiceRegistry(precastConfig: PrecastConfig | null) {
  // Use useMemo to rebuild services when precastConfig changes
  const services = useMemo(() => {
    return getAvailableServices(precastConfig);
  }, [precastConfig]);

  // Get default active tab based on available services
  const defaultActiveTab = useMemo(() => {
    return getDefaultActiveTab(services);
  }, [services]);

  // Get services as array for easier iteration
  const servicesArray = useMemo(() => {
    return Object.values(services);
  }, [services]);

  // Get service keys for tab navigation
  const serviceKeys = useMemo(() => {
    return Object.keys(services);
  }, [services]);

  // Check if a specific service is available
  const hasService = (serviceKey: string): boolean => {
    return serviceKey in services;
  };

  // Get a specific service by key
  const getService = (serviceKey: string): ServiceDefinition | null => {
    return services[serviceKey] || null;
  };

  // Get services by category
  const getServicesByCategory = () => {
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
  };

  return {
    services,
    servicesArray,
    serviceKeys,
    defaultActiveTab,
    hasService,
    getService,
    getServicesByCategory,
    serviceCount: servicesArray.length,
  };
}
