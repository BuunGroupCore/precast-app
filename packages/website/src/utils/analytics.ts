/**
 * Google Analytics utility functions for tracking events and page views.
 */

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, unknown>) => void;
  }
}

const GA_MEASUREMENT_ID = "G-4S73687P86";

/**
 * Track a custom event in Google Analytics
 * @param action - The action being performed (e.g., 'click', 'submit')
 * @param category - The category of the event (e.g., 'engagement', 'navigation')
 * @param label - Optional label for additional context
 * @param value - Optional numeric value
 */
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

/**
 * Track a page view in Google Analytics
 * @param url - The URL of the page being viewed
 * @param title - The title of the page
 */
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
      page_title: title,
    });
  }
};

/**
 * Track a conversion event (e.g., CLI installation, project creation)
 * @param conversionType - The type of conversion
 * @param value - Optional conversion value
 */
export const trackConversion = (conversionType: string, value?: number) => {
  trackEvent("conversion", conversionType, undefined, value);
};

/**
 * Track builder interactions
 * @param action - The builder action (e.g., 'framework_selected', 'project_created')
 * @param details - Additional details about the action
 */
export const trackBuilderAction = (action: string, details?: string) => {
  trackEvent(action, "builder", details);
};

/**
 * Track documentation interactions
 * @param action - The docs action (e.g., 'command_viewed', 'example_copied')
 * @param section - The documentation section
 */
export const trackDocsInteraction = (action: string, section: string) => {
  trackEvent(action, "documentation", section);
};

/**
 * Track outbound links
 * @param url - The URL being navigated to
 * @param linkType - The type of link (e.g., 'github', 'npm', 'external')
 */
export const trackOutboundLink = (url: string, linkType: string) => {
  trackEvent("click", "outbound", linkType, undefined);

  // For outbound links, we should give GA time to track before navigation
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "click", {
      event_category: "outbound",
      event_label: linkType,
      transport_type: "beacon",
      event_callback: () => {
        document.location.href = url;
      },
    });

    // Fallback in case callback doesn't fire
    setTimeout(() => {
      document.location.href = url;
    }, 100);

    return false; // Prevent default link behavior
  }

  return true; // Allow default behavior if gtag not available
};
