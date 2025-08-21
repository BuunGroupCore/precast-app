/**
 * ServiceTabBar Component
 * Extracted from PrecastWidget - side tab navigation
 */

import React from "react";
import { ServiceDefinition } from "../types";
import { getServiceIcon } from "../utils/serviceIcons";

interface ServiceTabBarProps {
  services: Record<string, ServiceDefinition>;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isMinimized: boolean;
}

/**
 * Side Tab Navigation Component
 * Exact copy from original PrecastWidget (lines 1101-1119)
 */
export function ServiceTabBar({
  services,
  activeTab,
  onTabChange,
  isMinimized,
}: ServiceTabBarProps) {
  if (isMinimized) return null;

  return (
    <div className="side-tabs">
      {Object.entries(services).map(([key, service]) => (
        <button
          key={key}
          onClick={() => onTabChange(key)}
          className={`side-tab`}
          title={service.name}
          data-active={activeTab === key}
        >
          <div className="tab-icon">{getServiceIcon(service.icon, 20)}</div>
        </button>
      ))}
    </div>
  );
}
