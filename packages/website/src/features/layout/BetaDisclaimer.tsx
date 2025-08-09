import { useState, useEffect } from "react";
import { FaFlask, FaTimes, FaChevronDown } from "react-icons/fa";

import { FEATURES } from "@/config/constants";

export function BetaDisclaimer() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // Check if feature is enabled
    if (!FEATURES.SHOW_BETA_DISCLAIMER) {
      setIsVisible(false);
      return;
    }

    // Check if user has dismissed it
    const dismissed = localStorage.getItem("beta-disclaimer-dismissed");
    if (dismissed === "true") {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    // Add keyboard shortcut listener to reset disclaimer
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl/Cmd + Shift + B
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "b") {
        e.preventDefault();
        // Reset the disclaimer
        localStorage.removeItem("beta-disclaimer-dismissed");
        if (FEATURES.SHOW_BETA_DISCLAIMER) {
          setIsVisible(true);
          setIsMinimized(false);
          // Beta disclaimer reset! It will now appear again.
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("beta-disclaimer-dismissed", "true");
  };

  // Don't render if feature is disabled or not visible
  if (!FEATURES.SHOW_BETA_DISCLAIMER || !isVisible) return null;

  if (isMinimized) {
    return (
      <div
        className="fixed bottom-4 left-4 z-40 cursor-pointer group"
        onClick={() => setIsMinimized(false)}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-comic-yellow rounded-full animate-ping opacity-75" />
          <div className="relative bg-comic-yellow text-comic-black p-3 rounded-full border-3 border-comic-black comic-shadow hover:scale-110 transition-all duration-200 group-hover:bg-comic-orange group-hover:rotate-12">
            <FaFlask className="text-xl" />
          </div>
          <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-comic-red text-comic-white text-xs font-display px-2 py-1 rounded-full border-2 border-comic-black transform rotate-12">
              CLICK!
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-xs">
      <div className="relative bg-comic-yellow text-comic-black p-4 rounded-lg border-3 border-comic-black comic-shadow transform rotate-1 hover:rotate-0 transition-transform">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <FaFlask className="text-xl flex-shrink-0 animate-bounce" />
            <div>
              <div className="font-display text-sm uppercase tracking-wider mb-1">Beta Build</div>
              <div className="font-comic text-xs leading-tight">
                Under active development - things might explode!
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            {/* Minimize Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(true);
              }}
              className="group relative bg-comic-blue text-comic-white w-8 h-8 rounded-lg border-2 border-comic-black comic-shadow-sm hover:bg-comic-dark-blue hover:translate-y-[-2px] hover:comic-shadow transition-all duration-200"
              title="Minimize"
            >
              <FaChevronDown className="text-xs absolute inset-0 m-auto" />
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-comic-white text-comic-black text-xs font-display px-2 py-1 rounded border-2 border-comic-black whitespace-nowrap">
                  HIDE!
                </div>
              </div>
            </button>
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDismiss();
              }}
              className="group relative bg-comic-red text-comic-white w-8 h-8 rounded-lg border-2 border-comic-black comic-shadow-sm hover:bg-comic-dark-red hover:translate-y-[-2px] hover:comic-shadow transition-all duration-200"
              title={`Dismiss (Press Ctrl+Shift+B to bring back)`}
            >
              <FaTimes className="text-xs absolute inset-0 m-auto" />
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-comic-white text-comic-black text-xs font-display px-2 py-1 rounded border-2 border-comic-black whitespace-nowrap">
                  ZAP!
                </div>
              </div>
            </button>
          </div>
        </div>
        <div className="absolute -top-2 -left-2">
          <div className="bg-comic-red text-comic-white text-xs font-display px-2 py-0.5 rounded-full border-2 border-comic-black transform -rotate-12">
            POW!
          </div>
        </div>
      </div>
    </div>
  );
}
