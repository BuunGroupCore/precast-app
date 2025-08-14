import { motion } from "framer-motion";
import { useState } from "react";
import { FaCopy, FaCheck, FaCode, FaEye, FaDownload } from "react-icons/fa";

import { Button } from "@/design-system/components/Button";
import { Card } from "@/design-system/components/Card";

interface ComponentConfig {
  [key: string]: unknown;
}

interface PlaygroundComponent {
  name: string;
  component: React.ComponentType<ComponentConfig>;
  defaultProps: ComponentConfig;
  configurable: Array<{
    prop: string;
    type: "select" | "boolean" | "text" | "number";
    options?: string[];
    label: string;
  }>;
}

/**
 * Interactive Design System Playground.
 * Allows developers to test component configurations in real-time.
 */
export function DesignSystemPlaygroundPage() {
  const [selectedComponent, setSelectedComponent] = useState("Button");
  const [componentConfig, setComponentConfig] = useState<ComponentConfig>({});
  const [copiedItem, setCopiedItem] = useState<string>("");
  const [activeView, setActiveView] = useState<"preview" | "code">("preview");

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(id);
      setTimeout(() => setCopiedItem(""), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const components: PlaygroundComponent[] = [
    {
      name: "Button",
      component: Button,
      defaultProps: {
        children: "Click me",
        variant: "primary",
        size: "md",
        fullWidth: false,
        loading: false,
        disabled: false,
      },
      configurable: [
        {
          prop: "variant",
          type: "select",
          options: ["primary", "secondary", "accent", "ghost", "danger"],
          label: "Variant",
        },
        {
          prop: "size",
          type: "select",
          options: ["sm", "md", "lg", "xl"],
          label: "Size",
        },
        {
          prop: "fullWidth",
          type: "boolean",
          label: "Full Width",
        },
        {
          prop: "loading",
          type: "boolean",
          label: "Loading",
        },
        {
          prop: "disabled",
          type: "boolean",
          label: "Disabled",
        },
        {
          prop: "children",
          type: "text",
          label: "Text",
        },
      ],
    },
    {
      name: "Card",
      component: Card,
      defaultProps: {
        children: "Card content goes here...",
        variant: "default",
        padding: "md",
        hover: false,
      },
      configurable: [
        {
          prop: "variant",
          type: "select",
          options: ["default", "outlined", "elevated"],
          label: "Variant",
        },
        {
          prop: "padding",
          type: "select",
          options: ["none", "sm", "md", "lg"],
          label: "Padding",
        },
        {
          prop: "hover",
          type: "boolean",
          label: "Hover Effect",
        },
        {
          prop: "children",
          type: "text",
          label: "Content",
        },
      ],
    },
  ];

  const currentComponent = components.find((comp) => comp.name === selectedComponent);
  const currentConfig = {
    ...currentComponent?.defaultProps,
    ...componentConfig,
  };

  const generateCode = () => {
    if (!currentComponent) return "";

    const props = Object.entries(currentConfig)
      .filter(([key, value]) => {
        const defaultValue = currentComponent.defaultProps[key];
        return value !== defaultValue && key !== "children";
      })
      .map(([key, value]) => {
        if (typeof value === "boolean") {
          return value ? key : "";
        }
        if (typeof value === "string" && key !== "children") {
          return `${key}="${value}"`;
        }
        return `${key}={${JSON.stringify(value)}}`;
      })
      .filter(Boolean)
      .join(" ");

    const childrenText = currentConfig.children || currentComponent.defaultProps.children;

    return `<${currentComponent.name}${props ? ` ${props}` : ""}>
  ${typeof childrenText === "string" ? childrenText : ""}
</${currentComponent.name}>`;
  };

  const handleConfigChange = (prop: string, value: unknown) => {
    setComponentConfig((prev) => ({
      ...prev,
      [prop]: value,
    }));
  };

  const resetConfig = () => {
    setComponentConfig({});
  };

  const exportConfig = () => {
    const configData = {
      component: selectedComponent,
      props: currentConfig,
      code: generateCode(),
    };

    const blob = new Blob([JSON.stringify(configData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedComponent.toLowerCase()}-config.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Header */}
      <section className="pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="action-text text-4xl sm:text-6xl text-comic-green mb-6">PLAYGROUND</h1>
            <div className="speech-bubble max-w-3xl mx-auto">
              <p className="font-comic text-lg">
                Test our components in <strong>REAL-TIME</strong>! Configure props, see live
                previews, and export your perfect configuration. It&apos;s like having{" "}
                <strong>SUPERPOWERS</strong> for component development!
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Component Selector */}
          <div className="xl:col-span-1">
            <div className="comic-panel bg-white p-6 sticky top-8">
              <h3 className="font-display text-xl mb-4">Components</h3>
              <div className="space-y-2">
                {components.map((component) => (
                  <button
                    key={component.name}
                    onClick={() => {
                      setSelectedComponent(component.name);
                      setComponentConfig({});
                    }}
                    className={`w-full text-left p-3 rounded font-comic transition-colors ${
                      selectedComponent === component.name
                        ? "bg-comic-green text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {component.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Configuration Panel */}
          <div className="xl:col-span-1">
            <div className="comic-panel bg-white p-6 sticky top-8 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-xl">Configure</h3>
                <button
                  onClick={resetConfig}
                  className="text-sm font-comic text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Reset
                </button>
              </div>

              {currentComponent && (
                <div className="space-y-4">
                  {currentComponent.configurable.map((config) => (
                    <div key={config.prop} className="space-y-2">
                      <label className="block font-comic text-sm font-bold">{config.label}</label>

                      {config.type === "select" && config.options && (
                        <select
                          value={(currentConfig[config.prop] as string) || ""}
                          onChange={(e) => handleConfigChange(config.prop, e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded font-comic text-sm focus:outline-none focus:border-comic-green"
                        >
                          {config.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      )}

                      {config.type === "boolean" && (
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(currentConfig[config.prop] as boolean) || false}
                            onChange={(e) => handleConfigChange(config.prop, e.target.checked)}
                            className="w-4 h-4 text-comic-green focus:ring-comic-green border-gray-300 rounded"
                          />
                          <span className="font-comic text-sm">Enable</span>
                        </label>
                      )}

                      {config.type === "text" && (
                        <input
                          type="text"
                          value={(currentConfig[config.prop] as string) || ""}
                          onChange={(e) => handleConfigChange(config.prop, e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded font-comic text-sm focus:outline-none focus:border-comic-green"
                          placeholder={`Enter ${config.label.toLowerCase()}`}
                        />
                      )}

                      {config.type === "number" && (
                        <input
                          type="number"
                          value={(currentConfig[config.prop] as string) || ""}
                          onChange={(e) =>
                            handleConfigChange(config.prop, parseInt(e.target.value))
                          }
                          className="w-full p-2 border border-gray-300 rounded font-comic text-sm focus:outline-none focus:border-comic-green"
                          placeholder={`Enter ${config.label.toLowerCase()}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 space-y-2">
                <button
                  onClick={exportConfig}
                  className="w-full btn-comic bg-comic-blue text-white flex items-center justify-center gap-2"
                >
                  <FaDownload size={14} />
                  Export Config
                </button>
              </div>
            </div>
          </div>

          {/* Preview and Code */}
          <div className="xl:col-span-3">
            <div className="space-y-6">
              {/* View Toggle */}
              <div className="comic-panel bg-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setActiveView("preview")}
                      className={`px-4 py-2 font-comic text-sm transition-colors flex items-center gap-2 ${
                        activeView === "preview"
                          ? "bg-comic-green text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <FaEye size={14} />
                      Preview
                    </button>
                    <button
                      onClick={() => setActiveView("code")}
                      className={`px-4 py-2 font-comic text-sm transition-colors flex items-center gap-2 ${
                        activeView === "code"
                          ? "bg-comic-green text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <FaCode size={14} />
                      Code
                    </button>
                  </div>

                  <div className="font-display text-xl text-comic-green">{selectedComponent}</div>
                </div>
              </div>

              {/* Preview/Code Content */}
              <div className="comic-panel bg-white p-8 min-h-[400px]">
                {activeView === "preview" && currentComponent && (
                  <div className="space-y-8">
                    <div className="text-center">
                      <h4 className="font-display text-2xl mb-6 text-comic-black">Live Preview</h4>
                      <div className="flex items-center justify-center min-h-[200px] p-8 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
                        <currentComponent.component {...currentConfig} />
                      </div>
                    </div>

                    {/* Preview on different backgrounds */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <h5 className="font-comic text-sm font-bold mb-2">Light Background</h5>
                        <div className="p-4 bg-white border border-gray-200 rounded flex items-center justify-center min-h-[80px]">
                          <currentComponent.component {...currentConfig} />
                        </div>
                      </div>
                      <div className="text-center">
                        <h5 className="font-comic text-sm font-bold mb-2">Dark Background</h5>
                        <div className="p-4 bg-gray-900 border border-gray-700 rounded flex items-center justify-center min-h-[80px]">
                          <currentComponent.component {...currentConfig} />
                        </div>
                      </div>
                      <div className="text-center">
                        <h5 className="font-comic text-sm font-bold mb-2">Colored Background</h5>
                        <div className="p-4 bg-comic-yellow border border-comic-black rounded flex items-center justify-center min-h-[80px]">
                          <currentComponent.component {...currentConfig} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeView === "code" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display text-2xl text-comic-black">Generated Code</h4>
                      <button
                        onClick={() => copyToClipboard(generateCode(), "generated-code")}
                        className="btn-comic bg-comic-blue text-white flex items-center gap-2"
                      >
                        {copiedItem === "generated-code" ? (
                          <>
                            <FaCheck size={14} />
                            Copied!
                          </>
                        ) : (
                          <>
                            <FaCopy size={14} />
                            Copy Code
                          </>
                        )}
                      </button>
                    </div>

                    <div className="relative">
                      <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto font-mono text-sm">
                        <code>{generateCode()}</code>
                      </pre>
                    </div>

                    {/* Import statement */}
                    <div>
                      <h5 className="font-comic font-bold mb-2">Import Statement</h5>
                      <div className="relative">
                        <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg font-mono text-sm">
                          <code>{`import { ${selectedComponent} } from '@/design-system/components';`}</code>
                        </pre>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              `import { ${selectedComponent} } from '@/design-system/components';`,
                              "import-statement"
                            )
                          }
                          className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                        >
                          {copiedItem === "import-statement" ? (
                            <FaCheck className="text-green-400" size={14} />
                          ) : (
                            <FaCopy className="text-gray-300" size={14} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Props object */}
                    <div>
                      <h5 className="font-comic font-bold mb-2">Props Configuration</h5>
                      <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-sm">
                        <code>{JSON.stringify(currentConfig, null, 2)}</code>
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
