import { useState } from "react";
import { motion } from "framer-motion";
import { FaCopy, FaCheck } from "react-icons/fa";

interface ColorSwatchProps {
  name: string;
  value: string;
  description?: string;
  contrastRatio?: string;
  size?: "sm" | "md" | "lg";
  showCopyValue?: boolean;
}

/**
 * Documentation component for displaying color tokens.
 * Shows color preview, name, value, and optional contrast information.
 */
export function ColorSwatch({
  name,
  value,
  description,
  contrastRatio,
  size = "md",
  showCopyValue = true,
}: ColorSwatchProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy color value: ", err);
    }
  };

  const sizeClasses = {
    sm: "h-12 w-full",
    md: "h-16 w-full",
    lg: "h-20 w-full",
  };

  const containerClasses = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={`comic-panel bg-white ${containerClasses[size]}`}
    >
      {/* Color Preview */}
      <div
        className={`${sizeClasses[size]} rounded-lg border-2 border-comic-black mb-3 transition-transform hover:scale-105`}
        style={{ backgroundColor: value }}
        title={`${name}: ${value}`}
      />

      {/* Color Info */}
      <div className="space-y-2">
        {/* Name */}
        <div className="font-comic text-sm font-bold text-comic-black">{name}</div>

        {/* Value */}
        {showCopyValue && (
          <div
            className="font-mono text-xs p-1 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 transition-colors flex items-center justify-between"
            onClick={copyToClipboard}
          >
            <span>{value}</span>
            {copied ? (
              <FaCheck className="text-green-500 ml-1" size={10} />
            ) : (
              <FaCopy className="text-gray-500 ml-1" size={10} />
            )}
          </div>
        )}

        {/* Description */}
        {description && <div className="font-comic text-xs text-gray-600">{description}</div>}

        {/* Contrast Ratio */}
        {contrastRatio && (
          <div className="font-mono text-xs text-gray-500">Contrast: {contrastRatio}</div>
        )}
      </div>
    </motion.div>
  );
}

export default ColorSwatch;
