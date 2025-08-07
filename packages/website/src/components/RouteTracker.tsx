import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { trackPageView } from "@/utils/analytics";

/**
 * Component that tracks page views in Google Analytics and restores scroll position
 * to the top of the page whenever the route changes.
 */
export function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    const scrollTimeout = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }, 0);

    trackPageView(location.pathname + location.search, document.title);

    return () => clearTimeout(scrollTimeout);
  }, [location]);

  return null;
}
