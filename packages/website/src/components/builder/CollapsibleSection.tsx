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
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  children,
  title,
  icon,
  className = "",
  defaultCollapsed = false,
  summary,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <div className={`comic-card relative ${className}`}>
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-1">
          <div className="flex items-center gap-3">
            {icon}
            {title}
          </div>
          {isCollapsed && summary && (
            <div className="ml-10 sm:ml-0 sm:mr-2 mt-2 sm:mt-0">{summary}</div>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsCollapsed(!isCollapsed);
          }}
          className="absolute top-4 right-4 sm:relative sm:top-auto sm:right-auto p-2 rounded-full hover:bg-comic-gray/20 transition-colors"
          aria-label={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? (
            <FaChevronDown className="text-xl" />
          ) : (
            <FaChevronUp className="text-xl" />
          )}
        </button>
      </div>
      <div className="border-t-3 border-comic-gray mb-3"></div>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
