import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { trackPageView } from "@/utils/analytics";

/**
 * Component that tracks page views in Google Analytics whenever the route changes.
 */
export function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    trackPageView(location.pathname + location.search, document.title);
  }, [location]);

  return null;
}
