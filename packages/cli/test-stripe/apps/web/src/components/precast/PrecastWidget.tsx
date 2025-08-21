/**
 * PrecastWidget Component
 * @module PrecastWidget
 * @description Service validation and testing widget for development environments
 */

/* eslint-disable @typescript-eslint/no-unused-vars, react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";

import { AuthMode } from "@/components/precast/types";

import { usePrecastConfig } from "@/components/precast/hooks/usePrecastConfig";
import { useSystemInfo } from "@/components/precast/hooks/useSystemInfo";
import { useServiceRegistry } from "@/components/precast/hooks/useServiceRegistry";
import { useGenericTesting } from "@/components/precast/hooks/useGenericTesting";

import { FloatingButton } from "@/components/precast/components/FloatingButton";
import { ServicePanel } from "@/components/precast/components/ServicePanel";
import { testApiHealth } from "@/components/precast/services/apiService";
import { testDatabaseConnection } from "@/components/precast/services/databaseService";
import { testDockerHealth } from "@/components/precast/services/dockerService";
import { testEmailService } from "@/components/precast/services/emailService";

import { isDevelopment } from "@/components/precast/utils/environmentUtils";

/**
 * PrecastWidget - Modular service validation and testing widget
 * @description Validates that Docker containers, databases, and other services are working correctly
 * @returns {JSX.Element|null} The widget component or null in production
 */
export function PrecastWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("database");

  const { precastConfig } = usePrecastConfig();
  const { systemInfo, setSystemInfo, refetch: fetchSystemInfo } = useSystemInfo();
  const { services, defaultActiveTab } = useServiceRegistry(precastConfig);
  const { testResults, loading, addTestResult, setLoading } = useGenericTesting();

  const isDev = isDevelopment();

  useEffect(() => {
    if (defaultActiveTab && !activeTab) {
      setActiveTab(defaultActiveTab);
    }
  }, [defaultActiveTab]);

  useEffect(() => {
    if (precastConfig?.docker && services.docker) {
      handleTestDocker();
    }
  }, [precastConfig]);

  useEffect(() => {
    const savedState = localStorage.getItem("adminPanelOpen");
    if (savedState === "true") {
      setIsOpen(true);
    }
  }, []);

  if (!isDev) {
    return null;
  }

  /**
   * Toggles the panel open/closed state and saves to localStorage
   */
  const togglePanel = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    localStorage.setItem("adminPanelOpen", String(newState));
    if (newState) {
      setIsMinimized(false);
      fetchSystemInfo();
    }
  };

  /**
   * Toggles the panel minimized state
   */
  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  /**
   * Tests database connection
   */
  const handleTestDatabase = () => {
    testDatabaseConnection(
      setLoading,
      addTestResult,
      systemInfo?.apiPort ? `http://localhost:${systemInfo.apiPort}` : "http://localhost:3001"
    );
  };

  /**
   * Tests API health endpoints
   */
  const handleTestApi = () => {
    testApiHealth(
      setLoading,
      addTestResult,
      setSystemInfo,
      systemInfo?.apiPort ? `http://localhost:${systemInfo.apiPort}` : "http://localhost:3001"
    );
  };

  return (
    <>
      <FloatingButton isOpen={isOpen} onToggle={togglePanel} />

      <ServicePanel
        isOpen={isOpen}
        isMinimized={isMinimized}
        services={services}
        activeTab={activeTab}
        testResults={testResults}
        loading={loading}
        systemInfo={systemInfo}
        onToggle={togglePanel}
        onMinimize={handleMinimize}
        onTabChange={setActiveTab}
        onTestDatabase={handleTestDatabase}
        onTestApi={handleTestApi}
      />
    </>
  );
}
