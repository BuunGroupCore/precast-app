import { motion } from "framer-motion";
import {
  FaBook,
  FaAccessibleIcon,
  FaRocket,
  FaPalette,
  FaCode,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaLightbulb,
} from "react-icons/fa";

interface GuidelineSection {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  content: Array<{
    title: string;
    type: "do" | "dont" | "info" | "tip";
    description: string;
    example?: string;
  }>;
}

/**
 * Design System Guidelines page.
 * Comprehensive best practices, accessibility guidelines, and usage recommendations.
 */
export function DesignSystemGuidelinesPage() {
  const sections: GuidelineSection[] = [
    {
      title: "Accessibility",
      description: "Ensuring our comic book design system is usable by everyone.",
      icon: FaAccessibleIcon,
      color: "var(--comic-blue)",
      content: [
        {
          title: "Use sufficient color contrast",
          type: "do",
          description:
            "Ensure text meets WCAG 2.1 AA standards with at least 4.5:1 contrast ratio for normal text and 3:1 for large text.",
          example: "Use our semantic colors which are tested for accessibility compliance.",
        },
        {
          title: "Don't rely solely on color for information",
          type: "dont",
          description:
            "Always provide additional visual cues like icons, text labels, or patterns alongside color.",
          example: "Error states should include both red color AND an error icon.",
        },
        {
          title: "Focus indicators are included automatically",
          type: "info",
          description:
            "All interactive components include visible focus indicators for keyboard navigation.",
        },
        {
          title: "Test with screen readers",
          type: "tip",
          description: "Use tools like NVDA, JAWS, or VoiceOver to verify component accessibility.",
        },
      ],
    },
    {
      title: "Performance",
      description: "Keeping our components fast and efficient.",
      icon: FaRocket,
      color: "var(--comic-green)",
      content: [
        {
          title: "Import components individually",
          type: "do",
          description: "Use named imports to enable tree-shaking and reduce bundle size.",
          example: "import { Button, Card } from '@/design-system/components';",
        },
        {
          title: "Don't import the entire library",
          type: "dont",
          description: "Avoid importing everything at once as it increases bundle size.",
          example: "Avoid: import * from '@/design-system/components';",
        },
        {
          title: "Components use CSS-in-JS optimizations",
          type: "info",
          description:
            "Tailwind classes are optimized and purged automatically in production builds.",
        },
        {
          title: "Use loading states for better UX",
          type: "tip",
          description:
            "Leverage built-in loading states to provide immediate feedback during async operations.",
        },
      ],
    },
    {
      title: "Theming",
      description: "Customizing and extending the comic book theme.",
      icon: FaPalette,
      color: "var(--comic-purple)",
      content: [
        {
          title: "Use design tokens for consistency",
          type: "do",
          description:
            "Always use our design tokens instead of hardcoded values for colors, spacing, and typography.",
          example: "Use colors.comic.red instead of '#FF0033'",
        },
        {
          title: "Don't override core component styles",
          type: "dont",
          description: "Avoid using !important or deep CSS selectors to override component styles.",
          example: "Create variant props instead of CSS overrides.",
        },
        {
          title: "Custom themes can extend base tokens",
          type: "info",
          description: "You can create theme variants by extending our base design tokens.",
        },
        {
          title: "Use CSS custom properties for dynamic themes",
          type: "tip",
          description: "Leverage CSS variables for theme switching and user customization.",
        },
      ],
    },
    {
      title: "Component Composition",
      description: "Best practices for combining and using components.",
      icon: FaCode,
      color: "var(--comic-red)",
      content: [
        {
          title: "Compose complex UIs from simple components",
          type: "do",
          description:
            "Build complex interfaces by combining simple, focused components rather than creating monolithic ones.",
          example: "Use Card + Button + Text components together for complex layouts.",
        },
        {
          title: "Don't create overly complex single components",
          type: "dont",
          description: "Avoid components that try to handle too many responsibilities.",
          example: "Don't create a 'MegaCard' that includes forms, buttons, and navigation.",
        },
        {
          title: "Props are designed for flexibility",
          type: "info",
          description: "Component props follow consistent patterns across the design system.",
        },
        {
          title: "Use render props for complex customization",
          type: "tip",
          description:
            "For advanced use cases, consider using render props or component composition.",
        },
      ],
    },
  ];

  const getIconForType = (type: string) => {
    switch (type) {
      case "do":
        return <FaCheckCircle className="text-green-500" />;
      case "dont":
        return <FaExclamationTriangle className="text-red-500" />;
      case "info":
        return <FaInfoCircle className="text-blue-500" />;
      case "tip":
        return <FaLightbulb className="text-yellow-500" />;
      default:
        return <FaInfoCircle className="text-gray-500" />;
    }
  };

  const getBorderColorForType = (type: string) => {
    switch (type) {
      case "do":
        return "border-green-200 bg-green-50";
      case "dont":
        return "border-red-200 bg-red-50";
      case "info":
        return "border-blue-200 bg-blue-50";
      case "tip":
        return "border-yellow-200 bg-yellow-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  return (
    <div>
      {/* Header */}
      <section className="pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="action-text text-4xl sm:text-6xl text-comic-purple mb-6">GUIDELINES</h1>
            <div className="speech-bubble max-w-3xl mx-auto">
              <p className="font-comic text-lg">
                Master the art of using our design system! These guidelines ensure you create
                <strong> ACCESSIBLE</strong>, <strong>PERFORMANT</strong>, and
                <strong> MAINTAINABLE</strong> interfaces with our comic book components.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Guidelines Sections */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="space-y-16">
          {sections.map((section, sectionIndex) => (
            <motion.section
              key={section.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: sectionIndex * 0.1 }}
            >
              {/* Section Header */}
              <div className="flex items-center gap-4 mb-8">
                <div
                  className="p-4 rounded-lg border-3 border-comic-black"
                  style={{ backgroundColor: section.color }}
                >
                  <section.icon size={32} className="text-comic-white" />
                </div>
                <div>
                  <h2 className="font-display text-4xl mb-2" style={{ color: section.color }}>
                    {section.title}
                  </h2>
                  <p className="font-comic text-lg text-gray-600">{section.description}</p>
                </div>
              </div>

              {/* Guidelines Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {section.content.map((guideline, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`comic-panel p-6 ${getBorderColorForType(guideline.type)}`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      {getIconForType(guideline.type)}
                      <h3 className="font-comic font-bold text-lg flex-1">{guideline.title}</h3>
                    </div>

                    <p className="font-comic text-gray-700 mb-4">{guideline.description}</p>

                    {guideline.example && (
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <div className="font-comic text-sm font-bold mb-1 text-gray-600">
                          Example:
                        </div>
                        <code className="font-mono text-sm text-gray-800">{guideline.example}</code>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        {/* Quick Reference */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="comic-panel bg-comic-black p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <FaBook size={32} className="text-comic-yellow" />
              <h2 className="font-display text-4xl text-comic-yellow">QUICK REFERENCE</h2>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="speech-bubble bg-comic-white mb-8">
                <p className="font-comic text-lg text-comic-black">
                  Need a quick reminder? Here are the <strong>GOLDEN RULES</strong> for using our
                  design system effectively!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-comic-white p-4 rounded-lg border-2 border-comic-yellow">
                  <div className="font-comic font-bold text-comic-black mb-2">
                    Accessibility First
                  </div>
                  <div className="font-comic text-sm text-gray-600">
                    Always consider keyboard navigation and screen readers
                  </div>
                </div>

                <div className="bg-comic-white p-4 rounded-lg border-2 border-comic-blue">
                  <div className="font-comic font-bold text-comic-black mb-2">
                    Use Design Tokens
                  </div>
                  <div className="font-comic text-sm text-gray-600">
                    Import tokens instead of hardcoding values
                  </div>
                </div>

                <div className="bg-comic-white p-4 rounded-lg border-2 border-comic-green">
                  <div className="font-comic font-bold text-comic-black mb-2">
                    Compose Components
                  </div>
                  <div className="font-comic text-sm text-gray-600">
                    Build complex UIs from simple components
                  </div>
                </div>

                <div className="bg-comic-white p-4 rounded-lg border-2 border-comic-red">
                  <div className="font-comic font-bold text-comic-black mb-2">Test Performance</div>
                  <div className="font-comic text-sm text-gray-600">
                    Use tree-shaking and monitor bundle size
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
