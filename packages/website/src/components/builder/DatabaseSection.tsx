import { motion } from "framer-motion";
import React, { useState } from "react";
import { FaDatabase } from "react-icons/fa";

import { Tooltip } from "@/components/ui/Tooltip";
import { databases, orms, type StackOption } from "@/lib/stack-config";

import { CollapsibleSection } from "./CollapsibleSection";
import { DatabaseDeploymentModal } from "./DatabaseDeploymentModal";
import { PublicIcon } from "./PublicIcon";
import type { ExtendedProjectConfig } from "./types";

interface DatabaseSectionProps {
  config: ExtendedProjectConfig;
  setConfig: React.Dispatch<React.SetStateAction<ExtendedProjectConfig>>;
}

export const DatabaseSection: React.FC<DatabaseSectionProps> = ({ config, setConfig }) => {
  const [deploymentModalOpen, setDeploymentModalOpen] = useState(false);
  const [selectedDatabase, setSelectedDatabase] = useState<StackOption | null>(null);

  const handleDatabaseSelect = (db: StackOption) => {
    if (db.deploymentOptions && (db.deploymentOptions.local || db.deploymentOptions.cloud)) {
      setSelectedDatabase(db);
      setDeploymentModalOpen(true);
    } else {
      const updates: Partial<ExtendedProjectConfig> = {
        database: db.id,
        databaseDeployment: undefined,
      };

      if (db.id === "none") {
        updates.orm = "none";
        updates.auth = "none";
      }

      setConfig({ ...config, ...updates });
    }
  };

  const handleDeploymentSelect = (deployment: "local" | "cloud") => {
    if (!selectedDatabase) return;

    const updates: Partial<ExtendedProjectConfig> = {
      database: selectedDatabase.id,
      databaseDeployment: deployment,
    };

    if (selectedDatabase.id === "none") {
      updates.orm = "none";
      updates.auth = "none";
    }

    setConfig({ ...config, ...updates });
    setSelectedDatabase(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
    >
      <CollapsibleSection
        icon={<FaDatabase className="text-3xl" />}
        title={<h3 className="font-display text-2xl">DATABASE</h3>}
        className="bg-comic-green text-comic-white"
      >
        <p className="font-comic text-sm mb-4 text-comic-white/90">
          Store your data - pick from SQL databases, NoSQL, or backend-as-a-service options
        </p>
        <div className="grid grid-cols-3 gap-3">
          {databases.map((db) => {
            const isRecommendedForBackend =
              config.backend === "cloudflare-workers" && db.id === "cloudflare-d1";

            const isSelected = config.database === db.id;
            const hasDeploymentOptions =
              db.deploymentOptions && (db.deploymentOptions.local || db.deploymentOptions.cloud);
            const deploymentBadge = isSelected && hasDeploymentOptions && config.databaseDeployment;
            const isCloudOnly = !hasDeploymentOptions && db.id !== "none";

            return (
              <Tooltip key={db.id} content={db.description || ""}>
                <button
                  onClick={() => handleDatabaseSelect(db)}
                  data-active={isSelected}
                  className={`filter-btn-comic flex flex-col items-center justify-center gap-2 py-3 h-20 w-full relative ${
                    isRecommendedForBackend ? "ring-2 ring-comic-yellow ring-offset-2" : ""
                  }`}
                >
                  <div className="absolute -top-2 -right-2 flex flex-col gap-1">
                    {isRecommendedForBackend && (
                      <span className="bg-comic-yellow text-comic-black text-[10px] font-comic font-bold px-2 py-0.5 rounded-full border-2 border-comic-black z-10">
                        RECOMMENDED
                      </span>
                    )}
                    {deploymentBadge && (
                      <span
                        className={`text-[9px] font-comic font-bold px-1.5 py-0.5 rounded-full border border-comic-black ${
                          config.databaseDeployment === "local"
                            ? "bg-comic-blue text-comic-white"
                            : "bg-comic-green text-comic-white"
                        }`}
                      >
                        {config.databaseDeployment?.toUpperCase()}
                      </span>
                    )}
                    {isCloudOnly && (
                      <span className="bg-comic-orange text-comic-white text-[8px] font-comic font-bold px-1.5 py-0.5 rounded-full border border-comic-black">
                        CLOUD ONLY
                      </span>
                    )}
                  </div>

                  {db.icon &&
                    (typeof db.icon === "string" ? (
                      <PublicIcon name={db.icon} className="text-2xl" />
                    ) : (
                      <db.icon className="text-2xl" />
                    ))}
                  <span className="text-xs">{db.name}</span>
                </button>
              </Tooltip>
            );
          })}
        </div>
        {/* ORM Selection */}
        {config.database !== "none" &&
          config.database !== "supabase" &&
          config.database !== "firebase" && (
            <div className="mt-4">
              <div className="flex items-center gap-2 my-4">
                <div className="flex-1 border-t-2 border-comic-white/30"></div>
                <h4 className="font-comic text-sm text-comic-yellow px-2">ORM/ODM</h4>
                <div className="flex-1 border-t-2 border-comic-white/30"></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {orms
                  .filter((orm) => {
                    if (orm.id === "none") return true;
                    if (orm.incompatible?.includes(config.database)) return false;
                    if (orm.id === "drizzle" && config.database === "mongodb") return false;
                    return true;
                  })
                  .map((orm) => (
                    <Tooltip key={orm.id} content={orm.description || ""}>
                      <button
                        onClick={() => setConfig({ ...config, orm: orm.id })}
                        data-active={config.orm === orm.id}
                        className="filter-btn-comic flex flex-col items-center justify-center gap-1 h-16 text-xs w-full"
                      >
                        {orm.icon &&
                          (typeof orm.icon === "string" ? (
                            <PublicIcon name={orm.icon} className="text-xl" />
                          ) : (
                            <orm.icon className="text-xl" />
                          ))}
                        <span className="text-xs">{orm.name}</span>
                      </button>
                    </Tooltip>
                  ))}
              </div>
            </div>
          )}
      </CollapsibleSection>

      {selectedDatabase && (
        <DatabaseDeploymentModal
          isOpen={deploymentModalOpen}
          onClose={() => setDeploymentModalOpen(false)}
          database={selectedDatabase}
          onSelect={handleDeploymentSelect}
        />
      )}
    </motion.div>
  );
};
