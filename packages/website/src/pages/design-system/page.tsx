import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaPalette, FaCube, FaPlay, FaBook, FaCode, FaEye } from "react-icons/fa";

import { DesignSystemPageSEO } from "@/features/common";

interface DesignSystemSection {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: string;
  examples: string[];
  isNew?: boolean;
}

/**
 * Main Design System overview page.
 * Showcases the comic book themed design system with navigation to all sections.
 */
export function DesignSystemPage() {
  const sections: DesignSystemSection[] = [
    {
      title: "TOKENS",
      description: "Core design tokens including colors, typography, spacing, and more.",
      icon: FaPalette,
      href: "/design-system/tokens",
      color: "var(--comic-red)",
      examples: ["Colors", "Typography", "Spacing", "Shadows"],
    },
    {
      title: "COMPONENTS",
      description: "Complete component library with examples, props, and usage guidelines.",
      icon: FaCube,
      href: "/design-system/components",
      color: "var(--comic-blue)",
      examples: ["Button", "Card", "Input", "Modal"],
    },
    {
      title: "PLAYGROUND",
      description: "Interactive component playground to test configurations in real-time.",
      icon: FaPlay,
      href: "/design-system/playground",
      color: "var(--comic-green)",
      examples: ["Live Preview", "Code Export", "Props Testing"],
      isNew: true,
    },
    {
      title: "GUIDELINES",
      description: "Best practices, accessibility guidelines, and usage recommendations.",
      icon: FaBook,
      href: "/design-system/guidelines",
      color: "var(--comic-purple)",
      examples: ["Accessibility", "Performance", "Theming"],
    },
  ];

  const quickStats = [
    { label: "Components", value: "25+" },
    { label: "Tokens", value: "150+" },
    { label: "Color Palette", value: "Comic Book" },
    { label: "Accessibility", value: "WCAG 2.1" },
  ];

  return (
    <div>
      <DesignSystemPageSEO />

      {/* Hero Section */}
      <section className="pb-8 sm:pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h1 className="action-text text-4xl sm:text-6xl md:text-8xl text-comic-red mb-6 sm:mb-8">
              DESIGN SYSTEM
            </h1>
            <div className="speech-bubble max-w-3xl mx-auto mb-8">
              <p className="font-comic text-xl">
                Welcome to the <strong>PRECAST DESIGN SYSTEM</strong>! A comic book themed
                collection of components, tokens, and guidelines that brings your interfaces to life
                with <strong>SUPERPOWERS</strong>!
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {quickStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="comic-panel bg-comic-white p-4"
                >
                  <div className="font-display text-2xl text-comic-black mb-1">{stat.value}</div>
                  <div className="font-comic text-sm text-comic-black opacity-75">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Comic Separator */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <div className="h-2 bg-comic-black rounded-full"></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-4">
              <div className="action-text text-2xl text-comic-red bg-comic-white px-4 py-1 rounded-full border-4 border-comic-red">
                EXPLORE!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Design System Sections Grid */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={section.href} className="block h-full">
                  <div className="comic-panel p-6 h-full bg-comic-white hover:bg-comic-yellow transition-colors duration-200 relative">
                    {/* New Badge */}
                    {section.isNew && (
                      <div className="absolute -top-2 -right-2 action-text text-lg text-comic-green bg-comic-white px-2 py-1 rounded border-2 border-comic-green">
                        NEW!
                      </div>
                    )}

                    {/* Section Header */}
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="p-3 rounded-lg border-3 border-comic-black"
                        style={{ backgroundColor: section.color }}
                      >
                        <section.icon size={24} className="text-comic-white" />
                      </div>
                      <h3 className="font-display text-3xl" style={{ color: section.color }}>
                        {section.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="font-comic text-lg mb-6 text-comic-black">
                      {section.description}
                    </p>

                    {/* Examples */}
                    <div className="flex flex-wrap gap-2">
                      {section.examples.map((example) => (
                        <span
                          key={example}
                          className="badge-comic text-xs bg-comic-black text-comic-white"
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="py-20 px-4 bg-comic-black">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="action-text text-5xl md:text-6xl text-comic-yellow mb-6">
              GET STARTED!
            </h2>
            <div className="speech-bubble bg-comic-white max-w-2xl mx-auto mb-8">
              <p className="font-comic text-xl text-comic-black">
                Ready to use our design system in your project? Install the components and start
                building with <strong>SUPER SPEED</strong>!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/design-system/components"
                  className="btn-comic bg-comic-blue text-comic-white flex items-center gap-2 justify-center"
                >
                  <FaEye />
                  VIEW COMPONENTS
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/design-system/playground"
                  className="btn-comic bg-comic-green text-comic-white flex items-center gap-2 justify-center"
                >
                  <FaCode />
                  TRY PLAYGROUND
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
