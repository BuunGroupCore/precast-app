import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState, useRef, isValidElement, createElement } from "react";
import { FaCog, FaSave, FaUndo, FaTimes, FaChevronRight } from "react-icons/fa";

import { packageManagers } from "@/components/builder/constants";
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

interface MobileSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsSection = "templates" | "defaults" | "options";

interface MobileSelectProps {
  label: string;
  value: string;
  options: Array<{
    id: string;
    name: string;
    icon?: React.ComponentType<{ className?: string }> | React.ReactElement | string | null;
    color?: string;
    description?: string;
  }>;
  onChange: (value: string) => void;
}

/**
 * Mobile-optimized select dropdown component with icons and animations
 */
const MobileSelect: React.FC<MobileSelectProps> = ({ label, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<"above" | "below">("below");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((opt) => opt.id === value);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;
      const dropdownHeight = 300; // Approximate max height

      // Position dropdown above if not enough space below
      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        setDropdownPosition("above");
      } else {
        setDropdownPosition("below");
      }
    }
  }, [isOpen]);

  return (
    <div className="mb-4 relative">
      <label className="font-comic font-bold text-xs text-comic-black/70 mb-1 block uppercase">
        {label}
      </label>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 border-3 border-comic-black rounded-lg bg-white font-comic font-bold text-sm flex items-center justify-between gap-2 hover:bg-comic-yellow/20 transition-colors"
        style={{ boxShadow: "2px 2px 0 var(--comic-black)" }}
      >
        <div className="flex items-center gap-2">
          {selectedOption?.icon && selectedOption.icon !== null ? (
            typeof selectedOption.icon === "string" ? (
              <span className={`text-lg ${selectedOption.color || "text-comic-black"}`}>
                {selectedOption.icon}
              </span>
            ) : isValidElement(selectedOption.icon) ? (
              selectedOption.icon
            ) : (
              createElement(selectedOption.icon as React.ComponentType<{ className?: string }>, {
                className: `text-lg ${selectedOption.color || "text-comic-black"}`,
              })
            )
          ) : null}
          <span>{selectedOption?.name || "Select..."}</span>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[10000]"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, scale: 0.95, y: dropdownPosition === "above" ? 10 : -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: dropdownPosition === "above" ? 10 : -10 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className={`absolute ${dropdownPosition === "above" ? "bottom-full mb-2" : "top-full mt-2"} left-0 right-0 z-[10001] comic-panel bg-white rounded-lg`}
              style={{
                boxShadow: "4px 4px 0 var(--comic-black)",
                maxHeight: "240px",
                overflowY: "auto",
                overflowX: "hidden",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    onChange(option.id);
                    setIsOpen(false);
                  }}
                  className={`w-full p-3 flex items-center gap-2 hover:bg-comic-yellow/30 transition-colors font-comic font-bold text-sm text-left border-b-2 border-comic-black/10 last:border-0 ${
                    option.id === value ? "bg-comic-yellow/50" : ""
                  }`}
                >
                  {option.icon && option.icon !== null ? (
                    typeof option.icon === "string" ? (
                      <span
                        className={`text-lg flex-shrink-0 ${option.color || "text-comic-black"}`}
                      >
                        {option.icon}
                      </span>
                    ) : isValidElement(option.icon) ? (
                      option.icon
                    ) : (
                      createElement(option.icon as React.ComponentType<{ className?: string }>, {
                        className: `text-lg flex-shrink-0 ${option.color || "text-comic-black"}`,
                      })
                    )
                  ) : null}
                  <div className="flex-1">
                    <div className="font-bold">{option.name}</div>
                    {option.description && (
                      <div className="text-xs text-comic-black/60 font-normal">
                        {option.description}
                      </div>
                    )}
                  </div>
                  {option.id === value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 bg-comic-green rounded-full flex items-center justify-center flex-shrink-0"
                    >
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </motion.div>
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Mobile-optimized settings dialog with bottom sheet design and smooth scrolling.
 * Features tabbed navigation for better organization on small screens.
 */
export const MobileSettingsDialog: React.FC<MobileSettingsDialogProps> = ({ isOpen, onClose }) => {
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
  const [activeSection, setActiveSection] = useState<SettingsSection>("defaults");

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 1500);
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
      // Show feedback animation
      const button = document.getElementById(`stack-${stackId}`);
      if (button) {
        button.classList.add("animate-pulse");
        setTimeout(() => button.classList.remove("animate-pulse"), 1000);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[9998]"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[9999] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="comic-panel rounded-t-3xl bg-white overflow-hidden">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b-4 border-comic-black p-4 z-10">
                <div className="w-12 h-1 bg-comic-black rounded-full mx-auto mb-3" />
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <FaCog className="text-2xl text-comic-red" />
                    </motion.div>
                    <h2 className="font-display text-2xl text-comic-red">SETTINGS</h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg border-3 border-comic-black bg-comic-red text-white hover:bg-comic-red/80 active:scale-95 transition-all"
                    style={{ boxShadow: "2px 2px 0 var(--comic-black)" }}
                  >
                    <FaTimes />
                  </button>
                </div>

                {/* Section Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveSection("defaults")}
                    className={`px-4 py-2 rounded-lg border-3 border-comic-black font-comic font-bold text-xs whitespace-nowrap transition-all ${
                      activeSection === "defaults"
                        ? "bg-comic-purple text-white"
                        : "bg-white text-comic-black/70"
                    }`}
                    style={{
                      boxShadow: activeSection === "defaults" ? "2px 2px 0 var(--comic-black)" : "",
                    }}
                  >
                    DEFAULTS
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveSection("templates")}
                    className={`px-4 py-2 rounded-lg border-3 border-comic-black font-comic font-bold text-xs whitespace-nowrap transition-all ${
                      activeSection === "templates"
                        ? "bg-comic-orange text-white"
                        : "bg-white text-comic-black/70"
                    }`}
                    style={{
                      boxShadow:
                        activeSection === "templates" ? "2px 2px 0 var(--comic-black)" : "",
                    }}
                  >
                    TEMPLATES
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveSection("options")}
                    className={`px-4 py-2 rounded-lg border-3 border-comic-black font-comic font-bold text-xs whitespace-nowrap transition-all ${
                      activeSection === "options"
                        ? "bg-comic-blue text-white"
                        : "bg-white text-comic-black/70"
                    }`}
                    style={{
                      boxShadow: activeSection === "options" ? "2px 2px 0 var(--comic-black)" : "",
                    }}
                  >
                    OPTIONS
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[60vh] p-4">
                <AnimatePresence mode="wait">
                  {/* Defaults Section */}
                  {activeSection === "defaults" && (
                    <motion.div
                      key="defaults"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="comic-panel p-3 mb-4 bg-gradient-to-r from-comic-purple/10 to-comic-blue/10 border-3 border-comic-black rounded-lg">
                        <h3 className="font-display text-lg text-comic-purple flex items-center gap-2">
                          <span className="text-2xl">⚡</span> PREFERRED STACK
                        </h3>
                      </div>

                      <MobileSelect
                        label="Framework"
                        value={settings.preferredFramework || "react"}
                        options={frameworks.map((f) => ({
                          id: f.id,
                          name: f.name,
                          icon: f.icon as
                            | React.ComponentType<{ className?: string }>
                            | React.ReactElement
                            | null,
                          color: f.color,
                          description: f.description,
                        }))}
                        onChange={(value) =>
                          setSettings({
                            ...settings,
                            preferredFramework: value,
                            preferredUIFramework:
                              value === "vite" ? settings.preferredUIFramework : undefined,
                          })
                        }
                      />

                      {settings.preferredFramework === "vite" && (
                        <MobileSelect
                          label="UI Framework"
                          value={settings.preferredUIFramework || ""}
                          options={[
                            { id: "", name: "Auto", icon: null },
                            ...uiLibraries_frontend
                              .filter((f) => ["react", "vue", "svelte", "solid"].includes(f.id))
                              .map((f) => ({
                                id: f.id,
                                name: f.name,
                                icon: f.icon as
                                  | React.ComponentType<{ className?: string }>
                                  | React.ReactElement
                                  | null,
                                color: f.color,
                                description: f.description,
                              })),
                          ]}
                          onChange={(value) =>
                            setSettings({ ...settings, preferredUIFramework: value || undefined })
                          }
                        />
                      )}

                      <MobileSelect
                        label="Backend"
                        value={settings.preferredBackend || "node"}
                        options={backends.map((b) => ({
                          id: b.id,
                          name: b.name,
                          icon: b.icon as
                            | React.ComponentType<{ className?: string }>
                            | React.ReactElement
                            | null,
                          color: b.color,
                          description: b.description,
                        }))}
                        onChange={(value) => setSettings({ ...settings, preferredBackend: value })}
                      />

                      <MobileSelect
                        label="Database"
                        value={settings.preferredDatabase || "postgres"}
                        options={databases.map((d) => ({
                          id: d.id,
                          name: d.name,
                          icon: d.icon as
                            | React.ComponentType<{ className?: string }>
                            | React.ReactElement
                            | null,
                          color: d.color,
                          description: d.description,
                        }))}
                        onChange={(value) => setSettings({ ...settings, preferredDatabase: value })}
                      />

                      <MobileSelect
                        label="Runtime"
                        value={settings.preferredRuntime || "bun"}
                        options={runtimes.map((r) => ({
                          id: r.id,
                          name: r.name,
                          icon: r.icon as
                            | React.ComponentType<{ className?: string }>
                            | React.ReactElement
                            | null,
                          color: r.color,
                          description: r.description,
                        }))}
                        onChange={(value) => setSettings({ ...settings, preferredRuntime: value })}
                      />

                      <MobileSelect
                        label="Styling"
                        value={settings.preferredStyling || "tailwind"}
                        options={stylings.map((s) => ({
                          id: s.id,
                          name: s.name,
                          icon: s.icon as
                            | React.ComponentType<{ className?: string }>
                            | React.ReactElement
                            | null,
                          color: s.color,
                          description: s.description,
                        }))}
                        onChange={(value) => setSettings({ ...settings, preferredStyling: value })}
                      />

                      <MobileSelect
                        label="Package Manager"
                        value={settings.preferredPackageManager || "bun"}
                        options={packageManagers}
                        onChange={(value) =>
                          setSettings({ ...settings, preferredPackageManager: value })
                        }
                      />
                    </motion.div>
                  )}

                  {/* Templates Section */}
                  {activeSection === "templates" && (
                    <motion.div
                      key="templates"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="comic-panel p-3 mb-4 bg-gradient-to-r from-comic-yellow/20 to-comic-orange/20 border-3 border-comic-black rounded-lg">
                        <h3 className="font-display text-lg text-comic-orange flex items-center gap-2">
                          <span className="text-2xl">🚀</span> QUICK TEMPLATES
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {preferredStacks.map((stack) => (
                          <button
                            key={stack.id}
                            id={`stack-${stack.id}`}
                            onClick={() => applyPreferredStack(stack.id)}
                            className="w-full p-4 border-3 border-comic-black rounded-lg bg-white hover:bg-comic-yellow active:scale-95 transition-all text-left flex items-center justify-between"
                            style={{ boxShadow: "2px 2px 0 var(--comic-black)" }}
                          >
                            <div className="flex items-center gap-3">
                              {stack.icon && <stack.icon className={`text-2xl ${stack.color}`} />}
                              <div>
                                <span className="font-display text-sm block">{stack.name}</span>
                                <p className="font-comic text-xs text-comic-black/70">
                                  {stack.description}
                                </p>
                              </div>
                            </div>
                            <FaChevronRight className="text-comic-black/30" />
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Options Section */}
                  {activeSection === "options" && (
                    <motion.div
                      key="options"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="comic-panel p-3 mb-4 bg-gradient-to-r from-comic-green/10 to-comic-blue/10 border-3 border-comic-black rounded-lg">
                        <h3 className="font-display text-lg text-comic-blue flex items-center gap-2">
                          <span className="text-2xl">⚙️</span> DEFAULT OPTIONS
                        </h3>
                      </div>
                      <div className="space-y-4">
                        <label
                          className="flex items-center justify-between p-4 border-3 border-comic-black rounded-lg bg-white cursor-pointer active:scale-95 transition-transform"
                          style={{ boxShadow: "2px 2px 0 var(--comic-black)" }}
                        >
                          <span className="font-comic font-bold">TypeScript</span>
                          <input
                            type="checkbox"
                            checked={settings.defaultTypescript || false}
                            onChange={(e) =>
                              setSettings({ ...settings, defaultTypescript: e.target.checked })
                            }
                            className="w-6 h-6 rounded border-2 border-comic-black accent-comic-red"
                          />
                        </label>

                        <label
                          className="flex items-center justify-between p-4 border-3 border-comic-black rounded-lg bg-white cursor-pointer active:scale-95 transition-transform"
                          style={{ boxShadow: "2px 2px 0 var(--comic-black)" }}
                        >
                          <span className="font-comic font-bold">Git Repository</span>
                          <input
                            type="checkbox"
                            checked={settings.defaultGit || false}
                            onChange={(e) =>
                              setSettings({ ...settings, defaultGit: e.target.checked })
                            }
                            className="w-6 h-6 rounded border-2 border-comic-black accent-comic-red"
                          />
                        </label>

                        <label
                          className="flex items-center justify-between p-4 border-3 border-comic-black rounded-lg bg-white cursor-pointer active:scale-95 transition-transform"
                          style={{ boxShadow: "2px 2px 0 var(--comic-black)" }}
                        >
                          <span className="font-comic font-bold">Docker Setup</span>
                          <input
                            type="checkbox"
                            checked={settings.defaultDocker || false}
                            onChange={(e) =>
                              setSettings({ ...settings, defaultDocker: e.target.checked })
                            }
                            className="w-6 h-6 rounded border-2 border-comic-black accent-comic-red"
                          />
                        </label>

                        <label
                          className="flex items-center justify-between p-4 border-3 border-comic-black rounded-lg bg-white cursor-pointer active:scale-95 transition-transform"
                          style={{ boxShadow: "2px 2px 0 var(--comic-black)" }}
                        >
                          <span className="font-comic font-bold">Auto-Install</span>
                          <input
                            type="checkbox"
                            checked={settings.defaultAutoInstall !== false}
                            onChange={(e) =>
                              setSettings({ ...settings, defaultAutoInstall: e.target.checked })
                            }
                            className="w-6 h-6 rounded border-2 border-comic-black accent-comic-red"
                          />
                        </label>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer Actions */}
              <div className="sticky bottom-0 bg-white border-t-4 border-comic-black p-4 flex gap-3">
                <button
                  onClick={saveSettings}
                  className="flex-1 py-3 bg-comic-green text-white font-display text-lg rounded-lg border-3 border-comic-black active:scale-95 transition-all flex items-center justify-center gap-2"
                  style={{ boxShadow: "3px 3px 0 var(--comic-black)" }}
                >
                  {saved ? (
                    <>
                      <FaCog className="animate-spin" /> SAVED!
                    </>
                  ) : (
                    <>
                      <FaSave /> SAVE
                    </>
                  )}
                </button>
                <button
                  onClick={resetToDefaults}
                  className="p-3 bg-comic-orange text-white font-display rounded-lg border-3 border-comic-black active:scale-95 transition-all"
                  style={{ boxShadow: "3px 3px 0 var(--comic-black)" }}
                  title="Reset to defaults"
                >
                  <FaUndo />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
