/**
 * PostHog analytics utility functions for tracking events and page views.
 * Provides a clean interface for analytics tracking with PostHog React integration.
 */

import { usePostHog } from "posthog-js/react";

declare global {
  interface Window {
    posthog: {
      capture: (event: string, properties?: Record<string, unknown>) => void;
      identify: (userId: string, properties?: Record<string, unknown>) => void;
      reset: () => void;
      isFeatureEnabled: (flagName: string) => boolean | undefined;
    };
  }
}

/**
 * Hook to get PostHog instance for tracking events
 * @returns PostHog instance for event tracking
 */
export const usePostHogTracking = () => {
  const posthog = usePostHog();
  return posthog;
};

/**
 * Track a custom event in PostHog
 * @param event - The event name to track
 * @param properties - Optional event properties
 */
export const trackEvent = (event: string, properties?: Record<string, unknown>) => {
  if (typeof window !== "undefined" && window.posthog) {
    window.posthog.capture(event, {
      ...properties,
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
      page_title: document.title,
    });
  }
};

/**
 * Track a page view in PostHog
 * @param url - The URL of the page being viewed
 * @param title - Optional page title
 */
export const trackPageView = (url: string, title?: string) => {
  trackEvent("$pageview", {
    $current_url: url,
    $title: title || document.title,
  });
};

/**
 * Track CLI-related events
 * @param action - The CLI action being tracked
 * @param properties - Optional event properties
 */
export const trackCLIEvent = (action: string, properties?: Record<string, unknown>) => {
  trackEvent(`cli_${action}`, {
    category: "cli_interaction",
    ...properties,
  });
};

/**
 * Track website feature usage
 */
export const trackFeatureUsage = (
  feature: string,
  action: string,
  properties?: Record<string, unknown>
) => {
  trackEvent(`feature_${feature}_${action}`, {
    category: "feature_usage",
    feature,
    action,
    ...properties,
  });
};

/**
 * Track testimonial interactions
 */
export const trackTestimonialEvent = (action: string, properties?: Record<string, unknown>) => {
  trackEvent(`testimonial_${action}`, {
    category: "testimonials",
    ...properties,
  });
};

/**
 * Track builder interactions
 */
export const trackBuilderAction = (action: string, details?: Record<string, unknown>) => {
  trackEvent(`builder_${action}`, {
    category: "project_builder",
    ...details,
  });
};

/**
 * Track documentation interactions
 */
export const trackDocsInteraction = (
  action: string,
  section: string,
  properties?: Record<string, unknown>
) => {
  trackEvent(`docs_${action}`, {
    category: "documentation",
    section,
    ...properties,
  });
};

/**
 * Track outbound link clicks
 */
export const trackOutboundLink = (url: string, linkType: string) => {
  trackEvent("outbound_link_click", {
    category: "outbound_links",
    url,
    link_type: linkType,
  });
};

/**
 * Track conversion events (e.g., CLI installation, project creation)
 */
export const trackConversion = (
  conversionType: string,
  value?: number,
  properties?: Record<string, unknown>
) => {
  trackEvent(`conversion_${conversionType}`, {
    category: "conversions",
    conversion_type: conversionType,
    value,
    ...properties,
  });
};

/**
 * Identify a user for analytics
 */
export const identifyUser = (userId: string, properties?: Record<string, unknown>) => {
  if (typeof window !== "undefined" && window.posthog) {
    window.posthog.identify(userId, properties);
  }
};

/**
 * Reset user identification (for logout scenarios)
 */
export const resetUser = () => {
  if (typeof window !== "undefined" && window.posthog) {
    window.posthog.reset();
  }
};

/**
 * Check if a feature flag is enabled
 */
export const isFeatureEnabled = (flagName: string): boolean => {
  if (typeof window !== "undefined" && window.posthog) {
    return window.posthog.isFeatureEnabled(flagName) ?? false;
  }
  return false;
};
