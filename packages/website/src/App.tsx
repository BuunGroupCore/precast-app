import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Layout } from "./components/Layout";
import { ThemeProvider } from "./contexts/ThemeContext";
import { BuilderPage } from "./pages/BuilderPage";
import { ComponentsPage } from "./pages/ComponentsPage";
import { DocsPage } from "./pages/DocsPage";
import { HomePage } from "./pages/HomePage";
import { MetricsPage } from "./pages/MetricsPage";
import { OriginStoryPage } from "./pages/OriginStoryPage";
import { ShowcasePage } from "./pages/ShowcasePage";
import { SubmitProjectPage } from "./pages/SubmitProjectPage";
import { SupportPage } from "./pages/SupportPage";

/**
 * Main application component that sets up routing and providers.
 * Wraps all pages with theme context and layout components.
 */
function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
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
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
