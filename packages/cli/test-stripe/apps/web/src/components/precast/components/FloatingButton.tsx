/**
 * FloatingButton Component
 * @module FloatingButton
 * @description Floating toggle button for the Precast validation panel
 */

import React from "react";
import { Terminal } from "lucide-react";

interface FloatingButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * Floating action button to toggle the Precast validation panel
 * @param {FloatingButtonProps} props - Component props
 * @returns {JSX.Element|null} Button element or null when panel is open
 */
export function FloatingButton({ isOpen, onToggle }: FloatingButtonProps) {
  if (isOpen) return null;

  return (
    <button onClick={onToggle} className="precast-floating-btn" title="Open Precast Validator">
      <div className="btn-icon">
        <img
          src="https://precast.dev/logo.png"
          alt="Precast"
          className="logo-img"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.nextElementSibling?.classList.remove("hidden");
          }}
        />
        <Terminal size={24} className="hidden" />
      </div>
    </button>
  );
}
