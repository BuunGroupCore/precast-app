import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { RouteTracker } from "@/components/RouteTracker";
import { ThemeProvider } from "@/contexts/ThemeContext";
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
const SubmitTestimonialPage = lazy(() =>
  import("@/pages/submit-testimonial").then((module) => ({ default: module.SubmitTestimonialPage }))
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
          <Routes>
            <Route
              path="/"
              element={
                <Suspense fallback={<div className="min-h-screen"></div>}>
                  <HomePage />
                </Suspense>
              }
            />
            <Route
              path="/builder"
              element={
                <Suspense fallback={<div className="min-h-screen"></div>}>
                  <BuilderPage />
                </Suspense>
              }
            />
            <Route
              path="/components"
              element={
                <Suspense fallback={<div className="min-h-screen"></div>}>
                  <ComponentsPage />
                </Suspense>
              }
            />
            <Route
              path="/docs"
              element={
                <Suspense fallback={<div className="min-h-screen"></div>}>
                  <DocsPage />
                </Suspense>
              }
            />
            <Route
              path="/origin-story"
              element={
                <Suspense fallback={<div className="min-h-screen"></div>}>
                  <OriginStoryPage />
                </Suspense>
              }
            />
            <Route
              path="/showcase"
              element={
                <Suspense fallback={<div className="min-h-screen"></div>}>
                  <ShowcasePage />
                </Suspense>
              }
            />
            <Route
              path="/submit-project"
              element={
                <Suspense fallback={<div className="min-h-screen"></div>}>
                  <SubmitProjectPage />
                </Suspense>
              }
            />
            <Route
              path="/submit-testimonial"
              element={
                <Suspense fallback={<div className="min-h-screen"></div>}>
                  <SubmitTestimonialPage />
                </Suspense>
              }
            />
            <Route
              path="/support"
              element={
                <Suspense fallback={<div className="min-h-screen"></div>}>
                  <SupportPage />
                </Suspense>
              }
            />
            <Route
              path="/metrics"
              element={
                <Suspense fallback={<div className="min-h-screen"></div>}>
                  <MetricsPage />
                </Suspense>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
