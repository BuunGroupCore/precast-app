import { lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { PageLoader } from "@/components/PageLoader";
import { RouteTracker } from "@/components/RouteTracker";
import { GlobalLoadingIndicator, GlobalProgressBar } from "@/components/ui";
import { FEATURES } from "@/config/constants";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Layout } from "@/features/layout";
import { BuilderPage } from "@/pages/builder";
import { HomePage } from "@/pages/home";

const ComponentsPage = lazy(() =>
  import("@/pages/components").then((module) => ({ default: module.ComponentsPage }))
);

const DesignSystemPage = FEATURES.DESIGN_SYSTEM_ENABLED
  ? lazy(() =>
      import("@/pages/design-system").then((module) => ({ default: module.DesignSystemPage }))
    )
  : () => null;

const DesignSystemTokensPage = FEATURES.DESIGN_SYSTEM_ENABLED
  ? lazy(() =>
      import("@/pages/design-system/tokens").then((module) => ({
        default: module.DesignSystemTokensPage,
      }))
    )
  : () => null;

const DesignSystemComponentsPage = FEATURES.DESIGN_SYSTEM_ENABLED
  ? lazy(() =>
      import("@/pages/design-system/components").then((module) => ({
        default: module.DesignSystemComponentsPage,
      }))
    )
  : () => null;

const DesignSystemPlaygroundPage = FEATURES.DESIGN_SYSTEM_ENABLED
  ? lazy(() =>
      import("@/pages/design-system/playground").then((module) => ({
        default: module.DesignSystemPlaygroundPage,
      }))
    )
  : () => null;

const DesignSystemGuidelinesPage = FEATURES.DESIGN_SYSTEM_ENABLED
  ? lazy(() =>
      import("@/pages/design-system/guidelines").then((module) => ({
        default: module.DesignSystemGuidelinesPage,
      }))
    )
  : () => null;
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
const ProjectsPage = lazy(() =>
  import("@/pages/projects").then((module) => ({ default: module.ProjectsPage }))
);
const RoadmapPage = lazy(() =>
  import("@/pages/roadmap").then((module) => ({ default: module.RoadmapPage }))
);
const RequestFeaturePage = lazy(() =>
  import("@/pages/request-feature").then((module) => ({ default: module.RequestFeaturePage }))
);
const SubmitProjectPage = lazy(() =>
  import("@/pages/submit-project").then((module) => ({ default: module.SubmitProjectPage }))
);
const SubmitTestimonialPage = lazy(() =>
  import("@/pages/submit-testimonial").then((module) => ({ default: module.SubmitTestimonialPage }))
);
const TestimonialsPage = lazy(() =>
  import("@/pages/testimonials").then((module) => ({ default: module.TestimonialsPage }))
);
const SupportPage = lazy(() =>
  import("@/pages/support").then((module) => ({ default: module.SupportPage }))
);
const SurveyPage = lazy(() =>
  import("@/pages/survey").then((module) => ({ default: module.SurveyPage }))
);
const NotFoundPage = lazy(() =>
  import("@/pages/not-found").then((module) => ({ default: module.NotFoundPage }))
);
const TermsOfServicePage = lazy(() =>
  import("@/pages/legal/terms").then((module) => ({ default: module.TermsOfServicePage }))
);
const PrivacyPolicyPage = lazy(() =>
  import("@/pages/legal/privacy").then((module) => ({ default: module.PrivacyPolicyPage }))
);

/**
 * Main application component that sets up routing and providers.
 * Wraps all pages with theme context and layout components.
 * Implements lazy loading for better performance.
 */
function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <LoadingProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <RouteTracker />
            <GlobalProgressBar />
            <GlobalLoadingIndicator variant="minimal" position="top-right" />
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/builder" element={<BuilderPage />} />
                <Route
                  path="/components"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <ComponentsPage />
                    </Suspense>
                  }
                />
                {/* Design System Routes - Only available when enabled */}
                {FEATURES.DESIGN_SYSTEM_ENABLED ? (
                  <>
                    <Route
                      path="/design-system"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <DesignSystemPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/design-system/tokens"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <DesignSystemTokensPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/design-system/components"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <DesignSystemComponentsPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/design-system/playground"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <DesignSystemPlaygroundPage />
                        </Suspense>
                      }
                    />
                    <Route
                      path="/design-system/guidelines"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          <DesignSystemGuidelinesPage />
                        </Suspense>
                      }
                    />
                  </>
                ) : (
                  <>
                    {/* Redirect design system routes to home when disabled */}
                    <Route path="/design-system" element={<Navigate to="/" replace />} />
                    <Route path="/design-system/*" element={<Navigate to="/" replace />} />
                  </>
                )}
                <Route
                  path="/docs"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <DocsPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/origin-story"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <OriginStoryPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/showcase"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <ShowcasePage />
                    </Suspense>
                  }
                />
                <Route
                  path="/projects"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <ProjectsPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/roadmap"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <RoadmapPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/request-feature"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <RequestFeaturePage />
                    </Suspense>
                  }
                />
                <Route
                  path="/submit-project"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <SubmitProjectPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/submit-testimonial"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <SubmitTestimonialPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/testimonials"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <TestimonialsPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/support"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <SupportPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/survey"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <SurveyPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/metrics"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <MetricsPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/legal/terms"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <TermsOfServicePage />
                    </Suspense>
                  }
                />
                <Route
                  path="/legal/privacy"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <PrivacyPolicyPage />
                    </Suspense>
                  }
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Layout>
          </Router>
        </LoadingProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
