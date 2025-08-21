/**
 * TestButton Component
 * Reusable test button for service testing
 */

import React from "react";

interface TestButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

/**
 * Reusable Test Button Component
 * Extracted and standardized from original PrecastWidget test buttons
 */
export function TestButton({
  onClick,
  isLoading,
  disabled = false,
  children,
  variant = "primary",
  className = "",
}: TestButtonProps) {
  const baseClasses = variant === "primary" ? "test-btn" : "test-btn status-btn";

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${className}`}
    >
      {isLoading ? (
        <span className="loading">
          <span className="spinner"></span>
          TESTING...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
