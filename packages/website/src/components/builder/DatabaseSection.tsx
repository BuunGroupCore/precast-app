import { motion } from "framer-motion";
import React from "react";
import { FaDatabase } from "react-icons/fa";

import { Tooltip } from "@/components/ui/Tooltip";
import { databases, orms } from "@/lib/stack-config";

import { CollapsibleSection } from "./CollapsibleSection";
import type { ExtendedProjectConfig } from "./types";

interface DatabaseSectionProps {
  config: ExtendedProjectConfig;
  setConfig: React.Dispatch<React.SetStateAction<ExtendedProjectConfig>>;
}

export const DatabaseSection: React.FC<DatabaseSectionProps> = ({ config, setConfig }) => {
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
          {databases.map((db) => (
            <Tooltip key={db.id} content={db.description || ""}>
              <button
                onClick={() => setConfig({ ...config, database: db.id })}
                data-active={config.database === db.id}
                className="filter-btn-comic flex flex-col items-center justify-center gap-2 py-3 h-20 w-full"
              >
                {db.icon && <db.icon className="text-2xl" />}
                <span className="text-xs">{db.name}</span>
              </button>
            </Tooltip>
          ))}
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
                        {orm.icon && <orm.icon className="text-xl" />}
                        <span className="text-xs">{orm.name}</span>
                      </button>
                    </Tooltip>
                  ))}
              </div>
            </div>
          )}
      </CollapsibleSection>
    </motion.div>
  );
};
