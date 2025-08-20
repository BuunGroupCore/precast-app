import { AnimatePresence, motion } from "framer-motion";
import React, { useState, useMemo } from "react";
import { FaTimes, FaRocket, FaCheck } from "react-icons/fa";
import {
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiPrisma,
  SiPostgresql,
  SiSupabase,
  SiVercel,
  SiTrpc,
  SiAuth0,
  SiReact,
  SiVuedotjs,
  SiReactrouter,
  SiExpress,
  SiFirebase,
  SiShadcnui,
  SiPassport,
} from "react-icons/si";

import { AuthJSIcon } from "@/components/icons/AuthJSIcon";
import { BetterAuthIcon } from "@/components/icons/BetterAuthIcon";
import { TanStackIcon } from "@/components/icons/TanStackIcon";
import { preferredStacks, type PreferredStack } from "@/lib/preferred-stacks-config";
import {
  frameworks,
  backends,
  databases,
  orms,
  authProviders,
  type StackOption,
} from "@/lib/stack-config";

import type { ExtendedProjectConfig } from "./types";

interface PreferredStacksDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStack: (config: Partial<ExtendedProjectConfig>) => void;
}

const categoryLabels = {
  fullstack: "Full-Stack",
  frontend: "Frontend",
  backend: "Backend",
  enterprise: "Enterprise",
  rapid: "Rapid Prototyping",
};

const categoryColors = {
  fullstack: "bg-comic-blue",
  frontend: "bg-comic-green",
  backend: "bg-comic-orange",
  enterprise: "bg-comic-purple",
  rapid: "bg-comic-yellow",
};

/**
 * Modal dialog for selecting pre-configured technology stacks.
 * Displays categorized stack templates with technology previews and descriptions.
 */
export const PreferredStacksDialog: React.FC<PreferredStacksDialogProps> = ({
  isOpen,
  onClose,
  onSelectStack,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStack, setSelectedStack] = useState<string | null>(null);

  const categories = ["all", "fullstack", "frontend", "backend", "enterprise", "rapid"];

  // Check if a stack option is available (not disabled)
  const isOptionAvailable = (optionId: string | undefined, optionType: string): boolean => {
    if (!optionId || optionId === "none") return true;

    let options: StackOption[] = [];
    switch (optionType) {
      case "framework":
        options = frameworks;
        break;
      case "backend":
        options = backends;
        break;
      case "database":
        options = databases;
        break;
      case "orm":
        options = orms;
        break;
      case "auth":
        options = authProviders;
        break;
      default:
        return true;
    }

    const option = options.find((o) => o.id === optionId);
    return option ? !option.disabled : true;
  };

  // Filter out stacks that contain disabled options
  const availableStacks = useMemo(() => {
    return preferredStacks.filter((stack) => {
      const config = stack.config;

      // Check if any of the stack's options are disabled
      if (!isOptionAvailable(config.framework, "framework")) return false;
      if (!isOptionAvailable(config.backend, "backend")) return false;
      if (!isOptionAvailable(config.database, "database")) return false;
      if (!isOptionAvailable(config.orm, "orm")) return false;
      if (!isOptionAvailable(config.auth, "auth")) return false;

      return true;
    });
  }, []);

  const filteredStacks = useMemo(() => {
    const baseStacks =
      selectedCategory === "all"
        ? availableStacks
        : availableStacks.filter((s) => s.category === selectedCategory);
    return baseStacks;
  }, [selectedCategory, availableStacks]);

  const getTechIcon = (tech: string) => {
    const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
      next: SiNextdotjs,
      react: SiReact,
      vue: SiVuedotjs,
      "react-router": SiReactrouter,
      vite: SiReact, // Using React icon for Vite
      "tanstack-start": TanStackIcon,
      tailwind: SiTailwindcss,
      shadcn: SiShadcnui,
      typescript: SiTypescript,
      postgres: SiPostgresql,
      supabase: SiSupabase,
      firebase: SiFirebase,
      prisma: SiPrisma,
      "auth.js": AuthJSIcon,
      "supabase-auth": SiSupabase,
      "better-auth": BetterAuthIcon,
      auth0: SiAuth0,
      passport: SiPassport,
      trpc: SiTrpc,
      express: SiExpress,
      vercel: SiVercel,
    };

    return iconMap[tech] || null;
  };

  const handleSelectStack = (stack: PreferredStack) => {
    setSelectedStack(stack.id);
    setTimeout(() => {
      onSelectStack(stack.config);
      onClose();
      setSelectedStack(null);
    }, 500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-6xl max-h-[90vh] bg-comic-white border-4 border-comic-black rounded-lg overflow-hidden shadow-xl"
          >
            {/* Header */}
            <div className="bg-comic-darkBlue text-comic-white p-6 border-b-4 border-comic-black">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaRocket className="text-3xl" />
                  <div>
                    <h2 className="font-display text-3xl">PREFERRED STACKS</h2>
                    <p className="font-comic text-sm text-comic-white/90">
                      Choose from pre-configured stacks with recommended settings
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-comic-white/20 rounded-lg transition-colors"
                >
                  <FaTimes className="text-2xl" />
                </button>
              </div>
            </div>

            {/* Category Filter */}
            <div className="p-6 border-b-2 border-comic-gray">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full border-2 border-comic-black font-comic font-bold text-sm transition-colors ${
                      selectedCategory === category
                        ? "bg-comic-yellow text-comic-black"
                        : "bg-comic-white text-comic-black hover:bg-comic-gray"
                    }`}
                  >
                    {category === "all"
                      ? "All"
                      : categoryLabels[category as keyof typeof categoryLabels]}
                  </button>
                ))}
              </div>
            </div>

            {/* Stacks Grid */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {filteredStacks.length === 0 ? (
                <div className="text-center py-12">
                  <p className="font-comic text-lg text-comic-gray mb-2">
                    No stacks available in this category
                  </p>
                  <p className="font-comic text-sm text-comic-gray">
                    Some stacks may be hidden because they contain features that are currently
                    disabled or unavailable.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredStacks.map((stack) => (
                    <motion.div
                      key={stack.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`relative comic-card cursor-pointer transition-all duration-300 hover:scale-105 ${
                        selectedStack === stack.id ? "ring-4 ring-comic-yellow" : ""
                      }`}
                      onClick={() => handleSelectStack(stack)}
                    >
                      {/* Category Badge */}
                      <div
                        className={`absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-comic font-bold text-white ${
                          categoryColors[stack.category]
                        } border-2 border-comic-black`}
                      >
                        {categoryLabels[stack.category]}
                      </div>

                      {/* Selected Indicator */}
                      {selectedStack === stack.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-4 left-4 w-8 h-8 bg-comic-green rounded-full flex items-center justify-center border-2 border-comic-black z-10"
                        >
                          <FaCheck className="text-white text-sm" />
                        </motion.div>
                      )}

                      {/* Stack Content */}
                      <div className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="text-4xl text-comic-blue">
                            <stack.icon />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-display text-xl text-comic-black mb-2">
                              {stack.name}
                            </h3>
                            <p className="font-comic text-sm text-comic-gray mb-3">
                              {stack.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {stack.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-comic-gray text-comic-black text-xs font-comic rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Tech Stack Preview */}
                        <div className="border-t-2 border-comic-gray pt-4">
                          <div className="grid grid-cols-2 gap-2 text-xs font-comic">
                            <div className="flex items-center gap-2">
                              {(() => {
                                const Icon = stack.config.framework
                                  ? getTechIcon(stack.config.framework)
                                  : null;
                                return Icon ? (
                                  <span className="text-base">
                                    <Icon />
                                  </span>
                                ) : null;
                              })()}
                              <span>
                                <strong>Framework:</strong> {stack.config.framework}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {(() => {
                                const Icon = stack.config.styling
                                  ? getTechIcon(stack.config.styling)
                                  : null;
                                return Icon ? (
                                  <span className="text-base">
                                    <Icon />
                                  </span>
                                ) : null;
                              })()}
                              <span>
                                <strong>Styling:</strong> {stack.config.styling}
                              </span>
                            </div>
                            {stack.config.database !== "none" && (
                              <div className="flex items-center gap-2">
                                {(() => {
                                  const Icon = stack.config.database
                                    ? getTechIcon(stack.config.database)
                                    : null;
                                  return Icon ? (
                                    <span className="text-base">
                                      <Icon />
                                    </span>
                                  ) : null;
                                })()}
                                <span>
                                  <strong>Database:</strong> {stack.config.database}
                                </span>
                              </div>
                            )}
                            {stack.config.auth !== "none" && (
                              <div className="flex items-center gap-2">
                                {(() => {
                                  const Icon = stack.config.auth
                                    ? getTechIcon(stack.config.auth)
                                    : null;
                                  return Icon ? (
                                    <span className="text-base">
                                      <Icon />
                                    </span>
                                  ) : null;
                                })()}
                                <span>
                                  <strong>Auth:</strong> {stack.config.auth}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              {(() => {
                                const Icon = getTechIcon("typescript");
                                return stack.config.typescript && Icon ? (
                                  <span className="text-base">
                                    <Icon />
                                  </span>
                                ) : null;
                              })()}
                              <span>
                                <strong>TypeScript:</strong>{" "}
                                {stack.config.typescript ? "Yes" : "No"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-comic-gray p-4 border-t-2 border-comic-darkGray">
              <p className="text-center font-comic text-sm text-comic-black">
                💡 Select a stack to automatically configure all settings with recommended options
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
