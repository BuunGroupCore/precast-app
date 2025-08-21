/**
 * ServicePanel Component
 * Extracted from PrecastWidget - main panel container
 */

import React from "react";
import { ServiceDefinition, TestResult, SystemInfo, AuthMode } from "../types";
import { ServiceTabBar } from "./ServiceTabBar";
import { ServiceCard } from "./ServiceCard";

interface ServicePanelProps {
  isOpen: boolean;
  isMinimized: boolean;
  services: Record<string, ServiceDefinition>;
  activeTab: string;
  testResults: Record<string, TestResult>;
  loading: Record<string, boolean>;
  systemInfo: SystemInfo | null;

  // Event handlers
  onToggle: () => void;
  onMinimize: () => void;
  onTabChange: (tab: string) => void;

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
 * Main Service Panel Component
 * Exact copy from original PrecastWidget main panel (lines 1098-1352)
 */
export function ServicePanel({
  isOpen,
  isMinimized,
  services,
  activeTab,
  testResults,
  loading,
  systemInfo,
  onToggle,
  onMinimize,
  onTabChange,
  onTestDatabase,
  onTestApi,
  onTestDocker,
  onTestEmail,
  onTestAuth,
  onTestAuthStatus,
  authMode,
  authEmail,
  authPassword,
  authName,
  onAuthModeChange,
  onAuthEmailChange,
  onAuthPasswordChange,
  onAuthNameChange,
}: ServicePanelProps) {
  if (!isOpen) return null;

  return (
    <div className="precast-panel-container">
      {/* Side Tab Navigation */}
      <ServiceTabBar
        services={services}
        activeTab={activeTab}
        onTabChange={onTabChange}
        isMinimized={isMinimized}
      />

      {/* Main Panel */}
      <div className={`precast-main-panel`} data-minimized={isMinimized}>
        {/* Header */}
        <div className="panel-header">
          <div className="header-title">
            <div className="header-logo">
              <img
                src="https://precast.dev/logo.png"
                alt="Precast"
                className="logo-img"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove("hidden");
                }}
              />
              <div className="logo-fallback hidden"></div>
            </div>
            <div>
              <h3 className="panel-title">PRECAST</h3>
              <p className="panel-subtitle">
                {systemInfo?.environment
                  ? `ENV: ${systemInfo.environment.toUpperCase()}`
                  : "VALIDATOR_v1.0"}
              </p>
            </div>
          </div>
          <div className="header-controls">
            <button
              onClick={onMinimize}
              className="control-btn"
              title={isMinimized ? "Expand" : "Minimize"}
            >
              <span className="control-icon">{isMinimized ? "+" : "-"}</span>
            </button>
            <button onClick={onToggle} className="control-btn control-close" title="Close">
              <span className="close-icon">✕</span>
            </button>
          </div>
        </div>

        {/* Content */}
        {!isMinimized && (
          <div className="panel-content">
            {/* Dynamic tab content based on active service */}
            {Object.entries(services).map(
              ([key, service]) =>
                activeTab === key && (
                  <div key={key} className="tab-content">
                    <ServiceCard
                      service={service}
                      testResults={testResults}
                      loading={loading}
                      onTestDatabase={onTestDatabase}
                      onTestApi={onTestApi}
                      onTestDocker={onTestDocker}
                      onTestEmail={onTestEmail}
                      onTestAuth={onTestAuth}
                      onTestAuthStatus={onTestAuthStatus}
                      authMode={authMode}
                      authEmail={authEmail}
                      authPassword={authPassword}
                      authName={authName}
                      onAuthModeChange={onAuthModeChange}
                      onAuthEmailChange={onAuthEmailChange}
                      onAuthPasswordChange={onAuthPasswordChange}
                      onAuthNameChange={onAuthNameChange}
                    />
                  </div>
                )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
