import { useState } from "react";
import {
  FaLightbulb,
  FaRocket,
  FaCode,
  FaTag,
  FaPaperPlane,
  FaExclamationTriangle,
} from "react-icons/fa";

import { ValidationDialog } from "./ValidationDialog";

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

interface FeatureRequestFormProps {
  onSubmit: (data: FeatureRequestFormData) => string;
}

/**
 * Feature request submission form component with all form fields and validation.
 */
export function FeatureRequestForm({ onSubmit }: FeatureRequestFormProps) {
  const [formData, setFormData] = useState<FeatureRequestFormData>({
    featureName: "",
    description: "",
    useCase: "",
    priority: "medium",
    category: "",
    framework: "",
    additionalDetails: "",
    additionalLabels: "",
  });

  const [showValidationDialog, setShowValidationDialog] = useState(false);

  const categories = [
    { value: "cli", label: "CLI Improvements" },
    { value: "framework", label: "Framework Support" },
    { value: "database", label: "Database Integration" },
    { value: "auth", label: "Authentication" },
    { value: "ui-library", label: "UI Libraries" },
    { value: "deployment", label: "Deployment" },
    { value: "testing", label: "Testing" },
    { value: "documentation", label: "Documentation" },
    { value: "performance", label: "Performance" },
    { value: "developer-experience", label: "Developer Experience" },
  ];

  const frameworks = [
    "React",
    "Vue",
    "Angular",
    "Next.js",
    "Nuxt",
    "Remix",
    "SolidJS",
    "Svelte",
    "Astro",
    "Express",
    "Fastify",
    "NestJS",
    "Hono",
  ];

  const priorityOptions = [
    { value: "low", label: "Low - Nice to have", color: "text-comic-gray" },
    { value: "medium", label: "Medium - Would be useful", color: "text-comic-blue" },
    { value: "high", label: "High - Really needed", color: "text-comic-orange" },
    { value: "critical", label: "Critical - Blocking workflow", color: "text-comic-red" },
  ];

  const isFormValid =
    formData.featureName.trim() && formData.description.trim() && formData.useCase.trim();

  const getSubmitUrl = () => {
    return onSubmit(formData);
  };

  return (
    <div className="comic-panel bg-comic-white p-8">
      <h2 className="font-display text-2xl text-comic-black mb-6 flex items-center gap-3">
        <FaRocket className="text-comic-red" />
        Feature Details
      </h2>

      <div className="space-y-6">
        {/* Feature Name */}
        <div>
          <label className="block font-comic text-comic-black mb-2 flex items-center gap-2">
            <FaLightbulb className="text-comic-yellow" />
            Feature Name *
          </label>
          <input
            type="text"
            value={formData.featureName}
            onChange={(e) => setFormData({ ...formData, featureName: e.target.value })}
            placeholder="e.g., Support for Deno runtime"
            className="w-full px-4 py-3 border-3 border-comic-black rounded-lg font-comic focus:outline-none focus:border-comic-blue"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-comic text-comic-black mb-2 flex items-center gap-2">
            <FaCode className="text-comic-blue" />
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the feature in detail. What should it do? How should it work?"
            rows={4}
            className="w-full px-4 py-3 border-3 border-comic-black rounded-lg font-comic resize-none focus:outline-none focus:border-comic-blue"
            required
          />
        </div>

        {/* Use Case */}
        <div>
          <label className="block font-comic text-comic-black mb-2 flex items-center gap-2">
            <FaExclamationTriangle className="text-comic-orange" />
            Use Case *
          </label>
          <textarea
            value={formData.useCase}
            onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
            placeholder="Why do you need this feature? What problem does it solve? Provide specific examples."
            rows={3}
            className="w-full px-4 py-3 border-3 border-comic-black rounded-lg font-comic resize-none focus:outline-none focus:border-comic-blue"
            required
          />
        </div>

        {/* Priority and Category */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-comic text-comic-black mb-2">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-4 py-3 border-3 border-comic-black rounded-lg font-comic focus:outline-none focus:border-comic-blue"
            >
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-comic text-comic-black mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border-3 border-comic-black rounded-lg font-comic focus:outline-none focus:border-comic-blue"
            >
              <option value="">Select category...</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Framework */}
        <div>
          <label className="block font-comic text-comic-black mb-2">
            Related Framework/Technology
          </label>
          <select
            value={formData.framework}
            onChange={(e) => setFormData({ ...formData, framework: e.target.value })}
            className="w-full px-4 py-3 border-3 border-comic-black rounded-lg font-comic focus:outline-none focus:border-comic-blue"
          >
            <option value="">Any/General</option>
            {frameworks.map((fw) => (
              <option key={fw} value={fw.toLowerCase()}>
                {fw}
              </option>
            ))}
          </select>
        </div>

        {/* Additional Details */}
        <div>
          <label className="block font-comic text-comic-black mb-2">Additional Details</label>
          <textarea
            value={formData.additionalDetails}
            onChange={(e) => setFormData({ ...formData, additionalDetails: e.target.value })}
            placeholder="Any additional context, mockups, or examples that would help us understand the feature better."
            rows={3}
            className="w-full px-4 py-3 border-3 border-comic-black rounded-lg font-comic resize-none focus:outline-none focus:border-comic-blue"
          />
        </div>

        {/* Additional Labels */}
        <div>
          <label className="block font-comic text-comic-black mb-2 flex items-center gap-2">
            <FaTag className="text-comic-purple" />
            Additional Labels (comma-separated)
          </label>
          <input
            type="text"
            value={formData.additionalLabels}
            onChange={(e) => setFormData({ ...formData, additionalLabels: e.target.value })}
            placeholder="e.g., breaking-change, community"
            className="w-full px-4 py-3 border-3 border-comic-black rounded-lg font-comic focus:outline-none focus:border-comic-blue"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          {isFormValid ? (
            <a
              href={getSubmitUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-comic bg-comic-red text-comic-white hover:bg-comic-darkRed w-full inline-flex items-center justify-center gap-3 text-lg"
            >
              <FaPaperPlane />
              Submit Feature Request
            </a>
          ) : (
            <button
              onClick={() => setShowValidationDialog(true)}
              className="btn-comic bg-comic-gray text-comic-black w-full inline-flex items-center justify-center gap-3 text-lg hover:bg-comic-darkGray"
            >
              <FaPaperPlane />
              Complete Required Fields
            </button>
          )}

          {!isFormValid && (
            <p className="text-comic-red text-sm font-comic mt-2 text-center">
              * Feature Name, Description, and Use Case are required
            </p>
          )}
        </div>

        {/* Validation Dialog */}
        <ValidationDialog
          isOpen={showValidationDialog}
          onClose={() => setShowValidationDialog(false)}
        />
      </div>
    </div>
  );
}
