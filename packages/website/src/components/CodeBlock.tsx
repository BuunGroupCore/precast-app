import { useState } from "react";
import { motion } from "framer-motion";
import { FaCopy, FaCheck } from "react-icons/fa";

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({ code, language = "bash", showLineNumbers = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const lines = code.trim().split("\n");

  return (
    <div className="relative group">
      <div className="terminal-comic p-4 pr-12">
        <pre className="font-mono text-sm text-comic-green overflow-x-auto">
          {showLineNumbers ? (
            lines.map((line, index) => (
              <div key={index} className="flex">
                <span className="text-comic-gray mr-4 select-none">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span dangerouslySetInnerHTML={{ __html: formatLine(line) }} />
              </div>
            ))
          ) : (
            <span dangerouslySetInnerHTML={{ __html: formatLine(code) }} />
          )}
        </pre>
      </div>
      
      {/* Copy Button */}
      <motion.button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 p-2 rounded-lg border-2 transition-all"
        style={{
          backgroundColor: copied ? "var(--comic-green)" : "var(--comic-black)",
          borderColor: "var(--comic-black)",
          color: copied ? "var(--comic-black)" : "var(--comic-green)",
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {copied ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FaCheck className="text-sm" />
          </motion.div>
        ) : (
          <FaCopy className="text-sm" />
        )}
      </motion.button>
      
      {/* Tooltip */}
      {copied && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute top-0 right-12 mt-2 px-2 py-1 bg-comic-green text-comic-black text-xs font-comic rounded border-2 border-comic-black"
        >
          Copied!
        </motion.div>
      )}
    </div>
  );
}

function formatLine(line: string): string {
  // Format $ commands
  if (line.trim().startsWith("$")) {
    return line.replace(/^\s*(\$)/, '<span class="text-comic-yellow">$</span>');
  }
  
  // Format comments
  if (line.trim().startsWith("#")) {
    return `<span class="text-comic-gray">${line}</span>`;
  }
  
  // Highlight npm/yarn/pnpm/bun commands
  const commandPattern = /^(npm|yarn|pnpm|bun|npx)\s+/;
  if (commandPattern.test(line.trim())) {
    return line.replace(commandPattern, '<span class="text-comic-blue">$&</span>');
  }
  
  return line;
}