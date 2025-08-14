import { motion } from "framer-motion";
import { useState } from "react";
import { FaCube, FaCopy, FaCheck, FaEye, FaCode, FaPlay } from "react-icons/fa";

import { Button } from "@/design-system/components/Button";
import { Card } from "@/design-system/components/Card";

interface ComponentExample {
  name: string;
  description: string;
  category: string;
  status: "stable" | "beta" | "experimental";
  props: Array<{
    name: string;
    type: string;
    default?: string;
    description: string;
    required?: boolean;
  }>;
  examples: Array<{
    title: string;
    description: string;
    code: string;
    component: React.ReactNode;
  }>;
}

/**
 * Design System Components documentation page.
 * Interactive showcase of all components with live examples and prop documentation.
 */
export function DesignSystemComponentsPage() {
  const [copiedItem, setCopiedItem] = useState<string>("");
  const [selectedComponent, setSelectedComponent] = useState<string>("Button");
  const [activeTab, setActiveTab] = useState<"examples" | "props" | "code">("examples");

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(id);
      setTimeout(() => setCopiedItem(""), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const components: ComponentExample[] = [
    {
      name: "Button",
      description: "A versatile button component with comic book styling and multiple variants.",
      category: "Form Controls",
      status: "stable",
      props: [
        {
          name: "variant",
          type: "'primary' | 'secondary' | 'accent' | 'ghost' | 'danger'",
          default: "'primary'",
          description: "Visual style variant of the button",
        },
        {
          name: "size",
          type: "'sm' | 'md' | 'lg' | 'xl'",
          default: "'md'",
          description: "Size of the button",
        },
        {
          name: "fullWidth",
          type: "boolean",
          default: "false",
          description: "Whether the button should take full width of its container",
        },
        {
          name: "loading",
          type: "boolean",
          default: "false",
          description: "Shows loading spinner and disables interaction",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description: "Disables the button",
        },
      ],
      examples: [
        {
          title: "Button Variants",
          description: "Different visual styles for various contexts",
          code: `<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="accent">Accent</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>`,
          component: (
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="accent">Accent</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </div>
          ),
        },
        {
          title: "Button Sizes",
          description: "Different sizes for various layouts",
          code: `<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>`,
          component: (
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">Extra Large</Button>
            </div>
          ),
        },
        {
          title: "Button States",
          description: "Loading and disabled states",
          code: `<Button loading>Loading...</Button>
<Button disabled>Disabled</Button>
<Button fullWidth>Full Width</Button>`,
          component: (
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button loading>Loading...</Button>
                <Button disabled>Disabled</Button>
              </div>
              <Button fullWidth>Full Width</Button>
            </div>
          ),
        },
      ],
    },
    {
      name: "Card",
      description: "A flexible card component with comic book styling for content organization.",
      category: "Layout",
      status: "stable",
      props: [
        {
          name: "variant",
          type: "'default' | 'outlined' | 'elevated'",
          default: "'default'",
          description: "Visual style variant of the card",
        },
        {
          name: "padding",
          type: "'none' | 'sm' | 'md' | 'lg'",
          default: "'md'",
          description: "Internal padding of the card",
        },
        {
          name: "hover",
          type: "boolean",
          default: "false",
          description: "Enable hover effects",
        },
      ],
      examples: [
        {
          title: "Basic Card",
          description: "Simple card with content",
          code: `<Card>
  <h3 className="font-display text-xl mb-2">Card Title</h3>
  <p className="font-comic">This is a basic card component with comic book styling.</p>
</Card>`,
          component: (
            <Card>
              <h3 className="font-display text-xl mb-2">Card Title</h3>
              <p className="font-comic">This is a basic card component with comic book styling.</p>
            </Card>
          ),
        },
        {
          title: "Card Variants",
          description: "Different visual styles",
          code: `<Card variant="default">Default Card</Card>
<Card variant="outlined">Outlined Card</Card>
<Card variant="elevated">Elevated Card</Card>`,
          component: (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card variant="default">
                <p className="font-comic">Default Card</p>
              </Card>
              <Card variant="outlined">
                <p className="font-comic">Outlined Card</p>
              </Card>
              <Card variant="elevated">
                <p className="font-comic">Elevated Card</p>
              </Card>
            </div>
          ),
        },
        {
          title: "Interactive Card",
          description: "Card with hover effects",
          code: `<Card hover>
  <h3 className="font-display text-xl mb-2">Interactive Card</h3>
  <p className="font-comic">Hover over me to see the effect!</p>
</Card>`,
          component: (
            <Card hover>
              <h3 className="font-display text-xl mb-2">Interactive Card</h3>
              <p className="font-comic">Hover over me to see the effect!</p>
            </Card>
          ),
        },
      ],
    },
  ];

  const currentComponent = components.find((comp) => comp.name === selectedComponent);
  const categories = Array.from(new Set(components.map((comp) => comp.category)));

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
            <h1 className="action-text text-4xl sm:text-6xl text-comic-blue mb-6">COMPONENTS</h1>
            <div className="speech-bubble max-w-3xl mx-auto">
              <p className="font-comic text-lg">
                Discover our <strong>SUPER-POWERED</strong> component library! Each component is
                crafted with comic book aesthetics, accessibility in mind, and
                <strong> LEGENDARY</strong> developer experience!
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Component Sidebar */}
          <div className="lg:col-span-1">
            <div className="comic-panel bg-white p-6 sticky top-8">
              <h3 className="font-display text-xl mb-4">Components</h3>

              {categories.map((category) => (
                <div key={category} className="mb-6">
                  <h4 className="font-comic text-sm font-bold mb-2 text-gray-600 uppercase">
                    {category}
                  </h4>
                  <div className="space-y-1">
                    {components
                      .filter((comp) => comp.category === category)
                      .map((component) => (
                        <button
                          key={component.name}
                          onClick={() => setSelectedComponent(component.name)}
                          className={`w-full text-left p-2 rounded font-comic transition-colors ${
                            selectedComponent === component.name
                              ? "bg-comic-blue text-white"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{component.name}</span>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                component.status === "stable"
                                  ? "bg-green-100 text-green-800"
                                  : component.status === "beta"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {component.status}
                            </span>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Component Details */}
          <div className="lg:col-span-3">
            {currentComponent && (
              <div>
                {/* Component Header */}
                <div className="comic-panel bg-white p-6 mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="font-display text-3xl text-comic-blue mb-2">
                        {currentComponent.name}
                      </h2>
                      <p className="font-comic text-lg text-gray-600">
                        {currentComponent.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCube className="text-comic-blue" />
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          currentComponent.status === "stable"
                            ? "bg-green-100 text-green-800"
                            : currentComponent.status === "beta"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {currentComponent.status}
                      </span>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-gray-200 mb-6">
                    {(["examples", "props", "code"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 font-comic capitalize transition-colors ${
                          activeTab === tab
                            ? "border-b-2 border-comic-blue text-comic-blue"
                            : "text-gray-600 hover:text-gray-800"
                        }`}
                      >
                        {tab === "examples" && <FaEye className="inline mr-2" />}
                        {tab === "props" && <FaPlay className="inline mr-2" />}
                        {tab === "code" && <FaCode className="inline mr-2" />}
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="space-y-6">
                  {activeTab === "examples" && (
                    <div className="space-y-8">
                      {currentComponent.examples.map((example, index) => (
                        <motion.div
                          key={example.title}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="comic-panel bg-white p-6"
                        >
                          <h4 className="font-display text-xl mb-2">{example.title}</h4>
                          <p className="font-comic text-gray-600 mb-6">{example.description}</p>

                          {/* Live Example */}
                          <div className="mb-6 p-6 border-2 border-gray-200 rounded-lg bg-gray-50">
                            {example.component}
                          </div>

                          {/* Code */}
                          <div className="relative">
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-sm">
                              <code>{example.code}</code>
                            </pre>
                            <button
                              onClick={() => copyToClipboard(example.code, `example-${index}`)}
                              className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                            >
                              {copiedItem === `example-${index}` ? (
                                <FaCheck className="text-green-400" />
                              ) : (
                                <FaCopy className="text-gray-300" />
                              )}
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {activeTab === "props" && (
                    <div className="comic-panel bg-white p-6">
                      <h4 className="font-display text-xl mb-4">Props API</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left font-comic font-bold py-2">Name</th>
                              <th className="text-left font-comic font-bold py-2">Type</th>
                              <th className="text-left font-comic font-bold py-2">Default</th>
                              <th className="text-left font-comic font-bold py-2">Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentComponent.props.map((prop) => (
                              <tr key={prop.name} className="border-b border-gray-100">
                                <td className="py-3 font-mono text-sm font-bold">
                                  {prop.name}
                                  {prop.required && <span className="text-red-500 ml-1">*</span>}
                                </td>
                                <td className="py-3 font-mono text-sm text-gray-600">
                                  {prop.type}
                                </td>
                                <td className="py-3 font-mono text-sm text-gray-500">
                                  {prop.default || "-"}
                                </td>
                                <td className="py-3 font-comic text-sm">{prop.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {activeTab === "code" && (
                    <div className="comic-panel bg-white p-6">
                      <h4 className="font-display text-xl mb-4">Import & Usage</h4>
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-comic font-bold mb-2">Import</h5>
                          <div className="relative">
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                              <code>{`import { ${currentComponent.name} } from '@/design-system/components';`}</code>
                            </pre>
                            <button
                              onClick={() =>
                                copyToClipboard(
                                  `import { ${currentComponent.name} } from '@/design-system/components';`,
                                  "import"
                                )
                              }
                              className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                            >
                              {copiedItem === "import" ? (
                                <FaCheck className="text-green-400" />
                              ) : (
                                <FaCopy className="text-gray-300" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div>
                          <h5 className="font-comic font-bold mb-2">Basic Usage</h5>
                          <div className="relative">
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                              <code>
                                {currentComponent.examples[0]?.code ||
                                  `<${currentComponent.name} />`}
                              </code>
                            </pre>
                            <button
                              onClick={() =>
                                copyToClipboard(
                                  currentComponent.examples[0]?.code ||
                                    `<${currentComponent.name} />`,
                                  "usage"
                                )
                              }
                              className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                            >
                              {copiedItem === "usage" ? (
                                <FaCheck className="text-green-400" />
                              ) : (
                                <FaCopy className="text-gray-300" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
