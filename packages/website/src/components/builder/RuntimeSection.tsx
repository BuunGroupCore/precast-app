import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { FaCogs } from "react-icons/fa";

import { Tooltip } from "@/components/ui/Tooltip";
import { runtimes } from "@/lib/stack-config";

import { CollapsibleSection } from "./CollapsibleSection";
import type { ExtendedProjectConfig } from "./types";

interface RuntimeSectionProps {
  config: ExtendedProjectConfig;
  setConfig: React.Dispatch<React.SetStateAction<ExtendedProjectConfig>>;
}

export const RuntimeSection: React.FC<RuntimeSectionProps> = ({ config, setConfig }) => {
  const isRuntimeCompatible = (runtime: (typeof runtimes)[0]) => {
    if (runtime.incompatible && runtime.incompatible.includes(config.framework)) {
      return false;
    }
    return true;
  };

  /**
   * Automatically resets runtime selection when it becomes incompatible with the current framework
   */
  useEffect(() => {
    if (config.runtime) {
      const selectedRuntime = runtimes.find((r) => r.id === config.runtime);
      if (selectedRuntime && !isRuntimeCompatible(selectedRuntime)) {
        const defaultRuntime = runtimes.find((r) => r.id === "node" && isRuntimeCompatible(r));
        const firstCompatible = defaultRuntime || runtimes.find((r) => isRuntimeCompatible(r));

        setConfig((prev) => ({
          ...prev,
          runtime: firstCompatible?.id || undefined,
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.framework]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.45 }}
    >
      <CollapsibleSection
        icon={<FaCogs className="text-3xl" />}
        title={<h3 className="font-display text-2xl">RUNTIME</h3>}
        className="bg-comic-yellow text-comic-black"
      >
        <p className="font-comic text-sm mb-4 text-comic-black/90">
          Choose your JavaScript runtime - from classic Node.js to modern edge runtimes
        </p>
        <div className="grid grid-cols-1 min-[320px]:grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {runtimes.map((runtime) => {
            const isCompatible = isRuntimeCompatible(runtime);
            const isRecommended = runtime.recommendedFor?.frameworks?.includes(config.framework);

            let tooltipContent = runtime.description || "";
            if (!isCompatible && runtime.incompatible?.includes(config.framework)) {
              tooltipContent += ` (Not compatible with ${config.framework})`;
            } else if (isRecommended && runtime.recommendedFor?.reason) {
              tooltipContent += ` (Recommended: ${runtime.recommendedFor.reason})`;
            }

            return (
              <Tooltip key={runtime.id} content={tooltipContent}>
                <button
                  onClick={() => isCompatible && setConfig({ ...config, runtime: runtime.id })}
                  data-active={config.runtime === runtime.id}
                  disabled={!isCompatible}
                  className={`filter-btn-comic flex flex-col items-center justify-center gap-2 py-3 h-20 w-full relative ${
                    !isCompatible ? "opacity-50 cursor-not-allowed" : ""
                  } ${
                    isRecommended && isCompatible ? "ring-2 ring-comic-green ring-offset-2" : ""
                  }`}
                >
                  {isRecommended && isCompatible && (
                    <span className="absolute -top-2 -right-2 bg-comic-green text-comic-white text-[10px] font-comic font-bold px-2 py-0.5 rounded-full border-2 border-comic-black">
                      RECOMMENDED
                    </span>
                  )}
                  {runtime.icon && <runtime.icon className="text-2xl" />}
                  <span className="text-xs">{runtime.name}</span>
                </button>
              </Tooltip>
            );
          })}
        </div>
      </CollapsibleSection>
    </motion.div>
  );
};
