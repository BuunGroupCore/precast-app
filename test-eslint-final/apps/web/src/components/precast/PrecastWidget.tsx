import React, { useState, useEffect } from "react";

interface TestResult {
  success: boolean;
  message: string;
  details?: any;
  timestamp: string;
}

/**
 * PrecastWidget - Service validation and testing widget
 * Validates that Docker containers, databases, and other services are working correctly
 */
export function PrecastWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  // Only show in development
  const isDevelopment = import.meta.env.DEV;

  useEffect(() => {
    // Check if admin panel should be open by default (from localStorage)
    const savedState = localStorage.getItem("adminPanelOpen");
    if (savedState === "true") {
      setIsOpen(true);
    }
  }, []);

  if (!isDevelopment) {
    return null;
  }

  const addTestResult = (service: string, result: Omit<TestResult, "timestamp">) => {
    setTestResults((prev) => ({
      ...prev,
      [service]: {
        ...result,
        timestamp: new Date().toISOString(),
      },
    }));
  };

  // Database Connection Test
  const testDatabaseConnection = async () => {
    setLoading((prev) => ({ ...prev, database: true }));
    try {
      // Support both relative and absolute API URLs
      const apiUrl = import.meta.env.VITE_API_URL || "";
      const response = await fetch(`${apiUrl}/api/health/database`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Include cookies for CORS
      });

      const data = await response.json();

      if (response.ok) {
        addTestResult("database", {
          success: true,
          message: "Database connected!",
          details: data,
        });
      } else {
        addTestResult("database", {
          success: false,
          message: "Database connection failed",
          details: data.error,
        });
      }
    } catch (error) {
      addTestResult("database", {
        success: false,
        message: "Network error",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading((prev) => ({ ...prev, database: false }));
    }
  };

  const togglePanel = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    localStorage.setItem("adminPanelOpen", String(newState));
    if (newState) {
      setIsMinimized(false);
    }
  };

  const ResultDisplay = ({ service }: { service: string }) => {
    const result = testResults[service];
    if (!result) return null;

    return (
      <div
        className={`mt-3 p-3 rounded-lg text-xs border ${
          result.success
            ? "bg-green-500/10 text-green-400 border-green-500/20"
            : "bg-red-500/10 text-red-400 border-red-500/20"
        }`}
      >
        <div className="flex items-start space-x-2">
          {result.success ? (
            <svg
              className="w-4 h-4 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
          <div className="flex-1">
            <p className="font-medium">{result.message}</p>
            <p className="text-xs opacity-60 mt-1">
              {new Date(result.timestamp).toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Floating Button - Modern Glass Morphism */}
      {!isOpen && (
        <button
          onClick={togglePanel}
          className="fixed bottom-6 right-6 z-50 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl p-4 shadow-2xl hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] transition-all duration-300 hover:scale-110 hover:bg-white/20 group"
          title="Open Admin Panel"
        >
          <div className="relative">
            <svg
              className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-gradient-to-r from-purple-400 to-pink-400"></span>
            </span>
          </div>
        </button>
      )}

      {/* Floating Panel - Modern Glass Design */}
      {isOpen && (
        <div
          className={`fixed z-50 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(139,92,246,0.15)] transition-all duration-300 ${
            isMinimized ? "bottom-6 right-6 w-72 h-14" : "bottom-6 right-6 w-[420px] max-h-[85vh]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                <svg
                  className="w-5 h-5 text-purple-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Precast Validator</h3>
                <p className="text-xs text-gray-400">Service Health Check</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMinimized ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  )}
                </svg>
              </button>
              <button
                onClick={togglePanel}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                title="Close"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Content - Modern Dark Theme */}
          {!isMinimized && (
            <div className="p-5 overflow-y-auto max-h-[calc(85vh-4rem)]">
              <div className="space-y-4">
                {/* Database Test Card */}
                <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4 hover:bg-white/[0.07] transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      </div>
                      <div>
                        <h3 className="font-medium text-white text-sm">Database</h3>
                        <p className="text-xs text-gray-400">postgres</p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full border ${
                        testResults.database?.success
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                      }`}
                    >
                      {testResults.database?.success ? "Connected" : "Ready to Test"}
                    </span>
                  </div>
                  <button
                    onClick={testDatabaseConnection}
                    disabled={loading.database}
                    className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-purple-500/20"
                  >
                    {loading.database ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Testing...
                      </span>
                    ) : (
                      "Test Connection"
                    )}
                  </button>
                  <ResultDisplay service="database" />
                </div>

                {/* Quick Actions - Modern Dark Theme */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-medium text-gray-300">Quick Actions</p>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent ml-3"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => window.open("/api/health", "_blank")}
                      className="group relative px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <svg
                          className="w-3.5 h-3.5 text-emerald-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-xs text-gray-300 group-hover:text-white">
                          API Health
                        </span>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setTestResults({});
                        console.clear();
                      }}
                      className="group relative px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <svg
                          className="w-3.5 h-3.5 text-orange-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        <span className="text-xs text-gray-300 group-hover:text-white">Clear</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
