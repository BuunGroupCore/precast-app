import { useState } from "react";
import { motion } from "framer-motion";
import { FaCopy, FaCheck, FaCode, FaEye } from "react-icons/fa";

interface CodeExampleProps {
  title?: string;
  description?: string;
  code: string;
  component?: React.ReactNode;
  language?: string;
  showToggle?: boolean;
}

/**
 * Documentation component for displaying code examples with live preview.
 * Features copy-to-clipboard functionality and optional preview toggle.
 */
export function CodeExample({
  title,
  description,
  code,
  component,
  language = "tsx",
  showToggle = true,
}: CodeExampleProps) {
  const [copied, setCopied] = useState(false);
  const [activeView, setActiveView] = useState<"preview" | "code">(component ? "preview" : "code");

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code: ", err);
    }
  };

  return (
    <div className="comic-panel bg-white p-6">
      {/* Header */}
      {(title || description || (component && showToggle)) && (
        <div className="mb-6">
          {(title || (component && showToggle)) && (
            <div className="flex items-center justify-between mb-2">
              {title && <h4 className="font-display text-xl text-comic-black">{title}</h4>}

              {component && showToggle && (
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setActiveView("preview")}
                    className={`px-3 py-1 font-comic text-sm transition-colors flex items-center gap-2 ${
                      activeView === "preview"
                        ? "bg-comic-blue text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <FaEye size={12} />
                    Preview
                  </button>
                  <button
                    onClick={() => setActiveView("code")}
                    className={`px-3 py-1 font-comic text-sm transition-colors flex items-center gap-2 ${
                      activeView === "code"
                        ? "bg-comic-blue text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <FaCode size={12} />
                    Code
                  </button>
                </div>
              )}
            </div>
          )}

          {description && <p className="font-comic text-gray-600">{description}</p>}
        </div>
      )}

      {/* Content */}
      <div className="space-y-4">
        {/* Preview */}
        {component && activeView === "preview" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg"
          >
            <div className="flex items-center justify-center min-h-[100px]">{component}</div>
          </motion.div>
        )}

        {/* Code */}
        {activeView === "code" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-sm">
              <code className={`language-${language}`}>{code}</code>
            </pre>

            {/* Copy Button */}
            <button
              onClick={copyToClipboard}
              className="absolute top-3 right-3 p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
              title="Copy code"
            >
              {copied ? (
                <FaCheck className="text-green-400" size={14} />
              ) : (
                <FaCopy className="text-gray-300" size={14} />
              )}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default CodeExample;
