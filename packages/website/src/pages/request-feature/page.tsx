import { motion } from "framer-motion";
import { FaLightbulb, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { FeatureRequestForm, GuidelinesSection } from "@/components/request-feature";
import { EXTERNAL_LINKS } from "@/config/constants";

interface FeatureRequestFormData {
  featureName: string;
  description: string;
  useCase: string;
  priority: string;
  category: string;
  framework: string;
  additionalDetails: string;
  additionalLabels: string;
}

/**
 * Feature request page for community suggestions.
 * Generates a pre-filled GitHub issue for feature requests.
 */
export function RequestFeaturePage() {
  const navigate = useNavigate();

  /**
   * Generates a GitHub issue URL with pre-filled feature details
   */
  const generateGitHubUrl = (data: FeatureRequestFormData): string => {
    // Return empty string if no data provided
    if (!data) return "#";

    const labels = ["enhancement", "feature-request"];

    // Add priority label
    if (data.priority) {
      labels.push(`priority-${data.priority}`);
    }

    // Add category label if specified
    if (data.category) {
      labels.push(data.category);
    }

    // Add framework label if specified
    if (data.framework) {
      labels.push(`framework-${data.framework}`);
    }

    // Add custom labels
    if (data.additionalLabels) {
      labels.push(
        ...data.additionalLabels
          .split(",")
          .map((l) => l.trim())
          .filter(Boolean)
      );
    }

    const title = `[Feature Request] ${data.featureName || "New Feature"}`;

    const body = `## 🚀 Feature Request

Thank you for suggesting a new feature! Your input helps make Precast better for everyone.

### 📝 Feature Details

**Feature Name:** ${data.featureName}

**Description:** 
${data.description}

**Use Case:** 
${data.useCase}

**Priority:** ${data.priority}

**Category:** ${data.category || "General"}

**Framework/Technology:** ${data.framework || "Any"}

### 🔍 Additional Information

${data.additionalDetails || "None provided"}

### 🎯 Motivation
This feature would improve the Precast CLI experience by providing better developer tooling and workflow support.

### ✅ Acceptance Criteria
- [ ] Feature is implemented and tested
- [ ] Documentation is updated
- [ ] Examples are provided
- [ ] Backwards compatibility is maintained
- [ ] Community testing completed

---
*This feature request was submitted via the Precast website feature request form*`;

    const params = new URLSearchParams({
      title,
      body,
      labels: labels.join(","),
      template: "feature_request.md",
    });

    return `${EXTERNAL_LINKS.GITHUB}/issues/new?${params.toString()}`;
  };

  return (
    <div className="min-h-screen pt-20 pb-20 bg-comic-dots">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <button
          onClick={() => navigate("/roadmap")}
          className="btn-comic bg-comic-white text-comic-black hover:bg-comic-gray inline-flex items-center gap-2"
        >
          <FaArrowLeft />
          Back to Roadmap
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="comic-panel bg-comic-yellow p-4">
              <FaLightbulb className="text-4xl text-comic-black" />
            </div>
          </div>
          <h1 className="action-text text-5xl md:text-7xl text-comic-black mb-4">
            REQUEST FEATURE
          </h1>
          <p className="font-comic text-xl text-comic-black max-w-2xl mx-auto">
            Got an idea to make Precast even more awesome? Let us know what you&apos;d like to see!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <FeatureRequestForm onSubmit={generateGitHubUrl} />
          </motion.div>

          {/* Guidelines Sidebar */}
          <GuidelinesSection />
        </div>
      </div>
    </div>
  );
}
