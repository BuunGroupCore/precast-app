import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout";
import { HomePage } from "@/pages/home";
import { NotFoundPage } from "@/pages/not-found";
import { PrecastWidget } from "@/components/precast/PrecastWidget";

/**
 * Main application component
 * Clean, minimal structure with React Router
 */
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
      <PrecastWidget />
    </Router>
  );
}

export default App;
