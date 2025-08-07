import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { RouteTracker } from "@/components/RouteTracker";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ComicLoader } from "@/features/common";
import { Layout } from "@/features/layout";

// Lazy load all pages for better performance
const HomePage = lazy(() =>
  import("@/pages/home").then((module) => ({ default: module.HomePage }))
);
const BuilderPage = lazy(() =>
  import("@/pages/builder").then((module) => ({ default: module.BuilderPage }))
);
const ComponentsPage = lazy(() =>
  import("@/pages/components").then((module) => ({ default: module.ComponentsPage }))
);
const DocsPage = lazy(() =>
  import("@/pages/docs").then((module) => ({ default: module.DocsPage }))
);
const MetricsPage = lazy(() =>
  import("@/pages/metrics").then((module) => ({ default: module.MetricsPage }))
);
const OriginStoryPage = lazy(() =>
  import("@/pages/origin-story").then((module) => ({ default: module.OriginStoryPage }))
);
const ShowcasePage = lazy(() =>
  import("@/pages/showcase").then((module) => ({ default: module.ShowcasePage }))
);
const SubmitProjectPage = lazy(() =>
  import("@/pages/submit-project").then((module) => ({ default: module.SubmitProjectPage }))
);
const SupportPage = lazy(() =>
  import("@/pages/support").then((module) => ({ default: module.SupportPage }))
);
const NotFoundPage = lazy(() =>
  import("@/pages/not-found").then((module) => ({ default: module.NotFoundPage }))
);

/**
 * Main application component that sets up routing and providers.
 * Wraps all pages with theme context and layout components.
 * Implements lazy loading for better performance.
 */
function App() {
  return (
    <ThemeProvider>
      <Router>
        <RouteTracker />
        <Layout>
          <Suspense fallback={<ComicLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/builder" element={<BuilderPage />} />
              <Route path="/components" element={<ComponentsPage />} />
              <Route path="/docs" element={<DocsPage />} />
              <Route path="/origin-story" element={<OriginStoryPage />} />
              <Route path="/showcase" element={<ShowcasePage />} />
              <Route path="/submit-project" element={<SubmitProjectPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/metrics" element={<MetricsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
