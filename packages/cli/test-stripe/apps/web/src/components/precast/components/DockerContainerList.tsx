/**
 * DockerContainerList Component
 * Extracted from PrecastWidget - Docker containers display
 */

import React from "react";
import { getServiceIcon } from "../utils/serviceIcons";

interface Container {
  name: string;
  port: number;
  icon: string;
}

interface DockerContainerListProps {
  containers: Container[];
}

/**
 * Docker Container List Component
 * Exact copy from original PrecastWidget (lines 1324-1340)
 */
export function DockerContainerList({ containers }: DockerContainerListProps) {
  if (!containers || containers.length === 0) return null;

  return (
    <div className="containers-list">
      {containers.map((container, idx: number) => (
        <div key={idx} className="container-item">
          <div className="container-info">
            <div className="container-name">
              {getServiceIcon(container.icon, 14)}
              <span className="container-text">{container.name}</span>
            </div>
            <span className="container-port">{container.port === 0 ? "N/A" : container.port}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
