/**
 * ResultDisplay Component
 * Extracted from PrecastWidget - exact copy of ResultDisplay function
 */

import React, { useState } from "react";
import { Activity, AlertTriangle } from "lucide-react";
import { TestResult, AuthDetails } from "../types";

interface ResultDisplayProps {
  service: string;
  testResults: Record<string, TestResult>;
}

/**
 * ResultDisplay Component
 * Exact copy from original PrecastWidget (lines 979-1070)
 */
export function ResultDisplay({ service, testResults }: ResultDisplayProps) {
  const result = testResults[service];
  const [isExpanded, setIsExpanded] = useState(false);

  if (!result) return null;

  // Check if this is an auth result with large response data
  const isAuthResult = service === "auth" || service === "authSession";
  const hasLargeDetails =
    result.details && typeof result.details === "object" && Object.keys(result.details).length > 3;
  const shouldCollapse = isAuthResult && result.success && hasLargeDetails;

  return (
    <div
      className={`result-display`}
      style={{ backgroundColor: result.success ? "var(--color-light)" : "var(--color-primary)" }}
    >
      <div className="result-content">
        <div className="result-icon">
          {result.success ? (
            <Activity size={12} className="icon-primary" />
          ) : (
            <AlertTriangle size={12} className="icon-primary" />
          )}
        </div>
        <div className="result-details">
          <p className="result-message">{result.message}</p>
          <p className="result-timestamp">{new Date(result.timestamp).toLocaleTimeString()}</p>

          {result.details && typeof result.details === "object" && result.details !== null ? (
            shouldCollapse ? (
              <div className="collapsible-details">
                <button onClick={() => setIsExpanded(!isExpanded)} className="expand-btn">
                  <span className="expand-text">
                    {isExpanded ? "Hide" : "Show"} Response Details
                  </span>
                  <span className="expand-arrow">{isExpanded ? "▼" : "▶"}</span>
                </button>

                {isExpanded && (
                  <div className="code-block">
                    <pre className="json-highlighted">
                      <code
                        className="language-json"
                        dangerouslySetInnerHTML={{
                          __html: JSON.stringify(result.details, null, 2)
                            .replace(/&/g, "&amp;")
                            .replace(/</g, "&lt;")
                            .replace(/>/g, "&gt;")
                            .replace(/("[\w]+"):/g, '<span style="color: #60a5fa">$1</span>:')
                            .replace(/(:\s*"[^"]*")/g, '<span style="color: #fde047">$1</span>')
                            .replace(/(:\s*\d+)/g, '<span style="color: #c084fc">$1</span>')
                            .replace(
                              /(:\s*true|:\s*false)/g,
                              '<span style="color: #f87171">$1</span>'
                            )
                            .replace(/(:\s*null)/g, '<span style="color: #9ca3af">$1</span>'),
                        }}
                      />
                    </pre>
                  </div>
                )}

                {!isExpanded && result.details && (
                  <div className="summary-box">
                    <p className="summary-text">
                      ✓ User:{" "}
                      {(result.details as AuthDetails).email ||
                        (result.details as AuthDetails).user?.email ||
                        "Authenticated"}
                      {Boolean((result.details as AuthDetails).session) && (
                        <>
                          <br />✓ Session created
                        </>
                      )}
                      {Boolean((result.details as AuthDetails).token) && (
                        <>
                          <br />✓ Token received
                        </>
                      )}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="result-json">
                <pre className="json-content">{JSON.stringify(result.details, null, 2)}</pre>
              </div>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}
