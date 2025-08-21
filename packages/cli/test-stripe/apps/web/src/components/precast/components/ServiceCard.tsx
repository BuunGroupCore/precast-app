/**
 * ServiceCard Component
 * Extracted from PrecastWidget - individual service display and testing
 */

import React from "react";
import { ServiceDefinition, TestResult, AuthMode } from "../types";
import { getServiceIcon } from "../utils/serviceIcons";
import { TestButton } from "./TestButton";
import { AuthTestForm } from "./AuthTestForm";
import { DockerContainerList } from "./DockerContainerList";
import { ResultDisplay } from "./ResultDisplay";

interface ServiceCardProps {
  service: ServiceDefinition;
  testResults: Record<string, TestResult>;
  loading: Record<string, boolean>;

  // Test functions
  onTestDatabase?: () => void;
  onTestApi?: () => void;
  onTestDocker?: () => void;
  onTestEmail?: () => void;
  onTestAuth?: () => void;
  onTestAuthStatus?: () => void;

  // Auth-specific props
  authMode?: AuthMode;
  authEmail?: string;
  authPassword?: string;
  authName?: string;
  onAuthModeChange?: (mode: AuthMode) => void;
  onAuthEmailChange?: (email: string) => void;
  onAuthPasswordChange?: (password: string) => void;
  onAuthNameChange?: (name: string) => void;
}

/**
 * Service Card Component
 * Exact copy from original PrecastWidget service display logic (lines 1179-1346)
 */
export function ServiceCard({
  service,
  testResults,
  loading,
  onTestDatabase,
  onTestApi,
  onTestDocker,
  onTestEmail,
  onTestAuth,
  onTestAuthStatus,
  authMode = "signup",
  authEmail = "test@example.com",
  authPassword = "TestPassword123!",
  authName = "Test User",
  onAuthModeChange,
  onAuthEmailChange,
  onAuthPasswordChange,
  onAuthNameChange,
}: ServiceCardProps) {
  const serviceKey = service.key;
  const statusResult = serviceKey === "auth" ? testResults.authStatus : testResults[serviceKey];

  // Determine which test function to call
  const getTestFunction = () => {
    switch (serviceKey) {
      case "database":
        return onTestDatabase;
      case "api":
        return onTestApi;
      case "docker":
        return onTestDocker;
      case "email":
        return onTestEmail;
      default:
        return undefined;
    }
  };

  const testFunction = getTestFunction();

  return (
    <div className="service-card">
      <div className="service-header">
        <div className="service-info">
          <div className="service-icon">{getServiceIcon(service.icon, 20)}</div>
          <div>
            <h3 className="service-name">{service.type?.toUpperCase() || service.name}</h3>
            {service.port && <p className="service-port">PORT: {service.port}</p>}
          </div>
        </div>
        <span className={`status-badge`} data-success={statusResult?.success}>
          {statusResult?.success ? "ONLINE" : "UNKNOWN"}
        </span>
      </div>

      {/* Test buttons for services that support testing */}
      {(serviceKey === "database" ||
        serviceKey === "api" ||
        serviceKey === "email" ||
        serviceKey === "docker") &&
        testFunction && (
          <div className="test-btn-container">
            <TestButton
              onClick={testFunction}
              isLoading={loading[serviceKey] || false}
              variant="primary"
            >
              {`RUN ${serviceKey === "database" ? "CONNECTION" : serviceKey === "api" ? "HEALTH" : serviceKey === "docker" ? "DOCKER" : serviceKey === "email" ? "EMAIL" : "SERVICE"} TEST`}
            </TestButton>
          </div>
        )}

      {/* Docker containers list */}
      {serviceKey === "docker" && service.containers && (
        <DockerContainerList containers={service.containers} />
      )}

      <div className="result-display-container">
        <ResultDisplay service={serviceKey} testResults={testResults} />
      </div>
    </div>
  );
}
