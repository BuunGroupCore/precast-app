import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface CollapsibleSectionProps {
  children: React.ReactNode;
  title: React.ReactNode;
  icon: React.ReactNode;
  className?: string;
  defaultCollapsed?: boolean;
  summary?: React.ReactNode;
  "aria-label"?: string;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  children,
  title,
  icon,
  className = "",
  defaultCollapsed = false,
  summary,
  "aria-label": ariaLabel,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const sectionId = React.useId();
  const contentId = `${sectionId}-content`;
  const headingId = `${sectionId}-heading`;

  return (
    <section className={`comic-card relative ${className}`} aria-labelledby={headingId}>
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-1">
          <div id={headingId} className="flex items-center gap-3">
            {icon}
            {title}
          </div>
          {isCollapsed && summary && (
            <div className="ml-10 sm:ml-0 sm:mr-2 mt-2 sm:mt-0">{summary}</div>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute top-4 right-4 sm:relative sm:top-auto sm:right-auto p-2 rounded-full hover:bg-comic-gray/20 focus:ring-2 focus:ring-comic-orange focus:ring-offset-2 transition-colors"
          aria-expanded={!isCollapsed}
          aria-controls={contentId}
          aria-label={`${isCollapsed ? "Expand" : "Collapse"} ${ariaLabel || "section"}`}
        >
          {isCollapsed ? (
            <FaChevronDown className="text-xl" aria-hidden="true" />
          ) : (
            <FaChevronUp className="text-xl" aria-hidden="true" />
          )}
        </button>
      </header>
      <div className="border-t-3 border-comic-gray mb-3" aria-hidden="true"></div>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            id={contentId}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            role="region"
            aria-labelledby={headingId}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
