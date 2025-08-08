/**
 * Preloads route components to improve navigation performance
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const routeLoaders: Record<string, () => Promise<any>> = {
  "/components": () => import("@/pages/components"),
  "/docs": () => import("@/pages/docs"),
  "/metrics": () => import("@/pages/metrics"),
  "/origin-story": () => import("@/pages/origin-story"),
  "/showcase": () => import("@/pages/showcase"),
  "/submit-project": () => import("@/pages/submit-project"),
  "/submit-testimonial": () => import("@/pages/submit-testimonial"),
  "/testimonials": () => import("@/pages/testimonials"),
  "/support": () => import("@/pages/support"),
  "/legal/terms": () => import("@/pages/legal/terms"),
  "/legal/privacy": () => import("@/pages/legal/privacy"),
};

const preloadedRoutes = new Set<string>();

/**
 * Preloads a route component if it hasn't been preloaded yet
 * @param path - The route path to preload
 */
export function preloadRoute(path: string) {
  if (preloadedRoutes.has(path)) return;

  const loader = routeLoaders[path];
  if (loader) {
    preloadedRoutes.add(path);
    loader().catch(() => {
      preloadedRoutes.delete(path);
    });
  }
}

/**
 * Preloads common routes that users are likely to navigate to
 */
export function preloadCommonRoutes() {
  setTimeout(() => {
    preloadRoute("/components");
    preloadRoute("/docs");
  }, 2000);
}
