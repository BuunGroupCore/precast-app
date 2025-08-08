import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { FaCog, FaSave, FaUndo } from "react-icons/fa";

import { packageManagers } from "@/components/builder/constants";
import { ComicSelect, GenericComicDialog } from "@/features/common";
import { db, type UserSettings } from "@/lib/db";
import { preferredStacks } from "@/lib/preferred-stacks";
import {
  frameworks,
  backends,
  databases,
  stylings,
  runtimes,
  uiLibraries_frontend,
} from "@/lib/stack-config";

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Settings dialog component for managing user preferences and default configurations.
 * Allows users to customize their preferred tech stack and project defaults.
 */
export const SettingsDialog: React.FC<SettingsDialogProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<UserSettings>({
    preferredFramework: "react",
    preferredUIFramework: undefined,
    preferredBackend: "node",
    preferredDatabase: "postgres",
    preferredOrm: "prisma",
    preferredStyling: "tailwind",
    preferredRuntime: "bun",
    preferredAuth: "none",
    preferredUILibrary: "none",
    preferredPackageManager: "bun",
    preferredDeployment: "none",
    defaultTypescript: true,
    defaultGit: true,
    defaultDocker: false,
    defaultAutoInstall: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const userSettings = await db.userSettings.orderBy("updatedAt").last();
      if (userSettings) {
        setSettings(userSettings);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  const saveSettings = async () => {
    try {
      const now = new Date();
      const settingsToSave: UserSettings = {
        ...settings,
        updatedAt: now,
        createdAt: settings.createdAt || now,
      };

      const existingSettings = await db.userSettings.orderBy("updatedAt").last();
      if (existingSettings) {
        await db.userSettings.put({ ...settingsToSave, id: existingSettings.id });
      } else {
        await db.userSettings.add(settingsToSave);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  };

  const resetToDefaults = () => {
    setSettings({
      preferredFramework: "react",
      preferredUIFramework: undefined,
      preferredBackend: "node",
      preferredDatabase: "postgres",
      preferredOrm: "prisma",
      preferredStyling: "tailwind",
      preferredRuntime: "bun",
      preferredAuth: "none",
      preferredUILibrary: "none",
      preferredPackageManager: "bun",
      preferredDeployment: "none",
      defaultTypescript: true,
      defaultGit: true,
      defaultDocker: false,
      defaultAutoInstall: true,
      createdAt: settings.createdAt || new Date(),
      updatedAt: new Date(),
    });
  };

  const applyPreferredStack = (stackId: string) => {
    const stack = preferredStacks.find((s) => s.id === stackId);
    if (stack) {
      setSettings({
        ...settings,
        preferredFramework: stack.config.framework,
        preferredUIFramework: (stack.config as typeof stack.config & { uiFramework?: string })
          .uiFramework,
        preferredBackend: stack.config.backend,
        preferredDatabase: stack.config.database,
        preferredOrm: stack.config.orm || "none",
        preferredStyling: stack.config.styling || "tailwind",
        preferredRuntime: stack.config.runtime || "node",
        preferredAuth: stack.config.auth || "none",
        defaultTypescript: stack.config.typescript ?? true,
      });
    }
  };

  return (
    <GenericComicDialog isOpen={isOpen} onClose={onClose} title="SETTINGS" size="lg">
      <div className="space-y-6 max-h-[70vh] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="comic-panel p-4"
        >
          <h3 className="font-display text-lg mb-3 text-comic-purple">QUICK STACK TEMPLATES</h3>
          <div className="grid grid-cols-3 gap-3">
            {preferredStacks.map((stack) => (
              <button
                key={stack.id}
                onClick={() => applyPreferredStack(stack.id)}
                className="p-3 border-3 border-comic-black rounded-lg bg-comic-white hover:bg-comic-yellow transition-all duration-200 transform hover:scale-105"
                style={{ boxShadow: "2px 2px 0 var(--comic-black)" }}
              >
                <div className="flex items-center gap-2 mb-1">
                  {stack.icon && <stack.icon className={`text-lg ${stack.color}`} />}
                  <span className="font-display text-sm">{stack.name}</span>
                </div>
                <p className="font-comic text-xs text-left">{stack.description}</p>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="comic-panel p-4"
        >
          <h3 className="font-display text-lg mb-3 text-comic-red">PREFERRED DEFAULTS</h3>
          <div className="grid grid-cols-2 gap-4">
            <ComicSelect
              label="Framework"
              options={frameworks}
              value={settings.preferredFramework || "react"}
              onChange={(value) =>
                setSettings({
                  ...settings,
                  preferredFramework: value,
                  // Clear UI Framework when switching away from Vite
                  preferredUIFramework:
                    value === "vite" ? settings.preferredUIFramework : undefined,
                })
              }
            />

            {/* Only show UI Framework selector when Vite is selected */}
            {settings.preferredFramework === "vite" && (
              <ComicSelect
                label="UI Framework (for Vite)"
                options={[
                  { id: "", name: "Auto", icon: null },
                  ...uiLibraries_frontend.filter((f) =>
                    ["react", "vue", "svelte", "solid"].includes(f.id)
                  ),
                ]}
                value={settings.preferredUIFramework || ""}
                onChange={(value) =>
                  setSettings({ ...settings, preferredUIFramework: value || undefined })
                }
              />
            )}

            <ComicSelect
              label="Backend"
              options={backends}
              value={settings.preferredBackend || "node"}
              onChange={(value) => setSettings({ ...settings, preferredBackend: value })}
            />

            <ComicSelect
              label="Database"
              options={databases}
              value={settings.preferredDatabase || "postgres"}
              onChange={(value) => setSettings({ ...settings, preferredDatabase: value })}
            />

            <ComicSelect
              label="Runtime"
              options={runtimes}
              value={settings.preferredRuntime || "bun"}
              onChange={(value) => setSettings({ ...settings, preferredRuntime: value })}
            />

            <ComicSelect
              label="Styling"
              options={stylings}
              value={settings.preferredStyling || "tailwind"}
              onChange={(value) => setSettings({ ...settings, preferredStyling: value })}
            />

            <ComicSelect
              label="Package Manager"
              options={packageManagers}
              value={settings.preferredPackageManager || "bun"}
              onChange={(value) => setSettings({ ...settings, preferredPackageManager: value })}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="comic-panel p-4"
        >
          <h3 className="font-display text-lg mb-3 text-comic-blue">DEFAULT OPTIONS</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.defaultTypescript || false}
                onChange={(e) => setSettings({ ...settings, defaultTypescript: e.target.checked })}
                className="w-5 h-5 rounded border-2 border-comic-black accent-comic-red"
              />
              <span className="font-comic font-bold">Default TypeScript ON</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.defaultGit || false}
                onChange={(e) => setSettings({ ...settings, defaultGit: e.target.checked })}
                className="w-5 h-5 rounded border-2 border-comic-black accent-comic-red"
              />
              <span className="font-comic font-bold">Default Git ON</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.defaultDocker || false}
                onChange={(e) => setSettings({ ...settings, defaultDocker: e.target.checked })}
                className="w-5 h-5 rounded border-2 border-comic-black accent-comic-red"
              />
              <span className="font-comic font-bold">Default Docker ON</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.defaultAutoInstall !== false}
                onChange={(e) => setSettings({ ...settings, defaultAutoInstall: e.target.checked })}
                className="w-5 h-5 rounded border-2 border-comic-black accent-comic-red"
              />
              <span className="font-comic font-bold">Default Auto-Install ON</span>
            </label>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3"
        >
          <button
            onClick={saveSettings}
            className="flex-1 py-3 bg-comic-green text-comic-white font-display text-lg rounded-lg border-3 border-comic-black hover:bg-comic-blue transition-colors flex items-center justify-center gap-2"
          >
            {saved ? (
              <>
                <FaCog className="animate-spin" /> SAVED!
              </>
            ) : (
              <>
                <FaSave /> SAVE SETTINGS
              </>
            )}
          </button>
          <button
            onClick={resetToDefaults}
            className="py-3 px-4 bg-comic-orange text-comic-white font-display rounded-lg border-3 border-comic-black hover:bg-comic-red transition-colors flex items-center justify-center gap-2"
            title="Reset to defaults"
          >
            <FaUndo />
          </button>
        </motion.div>
      </div>
    </GenericComicDialog>
  );
};
