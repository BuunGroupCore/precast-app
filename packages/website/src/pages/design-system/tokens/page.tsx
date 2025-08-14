import { motion } from "framer-motion";
import { useState } from "react";
import { FaCopy, FaCheck, FaPalette, FaFont, FaRuler, FaGem } from "react-icons/fa";

import { colors } from "@/design-system/tokens/colors";
import { typography } from "@/design-system/tokens/typography";
import { spacing, borderRadius } from "@/design-system/tokens/spacing";

/**
 * Design Tokens documentation page.
 * Comprehensive showcase of all design tokens with copy functionality.
 */
export function DesignSystemTokensPage() {
  const [copiedItem, setCopiedItem] = useState<string>("");

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(id);
      setTimeout(() => setCopiedItem(""), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const getContrastRatio = (color: string) => {
    // Simple contrast calculation - in a real implementation, you'd use a proper contrast calculation
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : null;
    };

    const getLuminance = (r: number, g: number, b: number) => {
      const [rs, gs, bs] = [r, g, b].map((c) => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const rgb = hexToRgb(color);
    if (!rgb) return "N/A";

    const luminance = getLuminance(rgb.r, rgb.g, rgb.b);
    const whiteContrast = 1.05 / (luminance + 0.05);
    const blackContrast = (luminance + 0.05) / 0.05;

    return `${whiteContrast > blackContrast ? whiteContrast.toFixed(1) : blackContrast.toFixed(1)}:1`;
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
            <h1 className="action-text text-4xl sm:text-6xl text-comic-red mb-6">DESIGN TOKENS</h1>
            <div className="speech-bubble max-w-2xl mx-auto">
              <p className="font-comic text-lg">
                The <strong>FOUNDATIONAL ELEMENTS</strong> of our comic book themed design system!
                Colors that pop, typography that commands attention, and spacing that creates
                perfect harmony!
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Color Tokens */}
      <section className="pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <FaPalette size={32} className="text-comic-red" />
              <h2 className="font-display text-4xl text-comic-red">COLORS</h2>
            </div>
          </motion.div>

          {/* Comic Colors */}
          <div className="mb-12">
            <h3 className="font-display text-2xl text-comic-black mb-6">Comic Palette</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Object.entries(colors.comic).map(([name, value]) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="comic-panel bg-white p-4"
                >
                  <div
                    className="w-full h-20 rounded-lg border-2 border-comic-black mb-3"
                    style={{ backgroundColor: value }}
                  />
                  <div className="font-comic text-sm font-bold mb-1">{name}</div>
                  <div
                    className="font-mono text-xs mb-2 p-1 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => copyToClipboard(value, `comic-${name}`)}
                  >
                    {copiedItem === `comic-${name}` ? (
                      <FaCheck className="inline mr-1 text-green-500" />
                    ) : (
                      <FaCopy className="inline mr-1" />
                    )}
                    {value}
                  </div>
                  <div className="font-mono text-xs text-gray-600">{getContrastRatio(value)}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Semantic Colors */}
          <div className="mb-12">
            <h3 className="font-display text-2xl text-comic-black mb-6">Semantic Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(colors.semantic).map(([name, value]) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="comic-panel bg-white p-4"
                >
                  <div
                    className="w-full h-20 rounded-lg border-2 border-comic-black mb-3"
                    style={{ backgroundColor: value }}
                  />
                  <div className="font-comic text-sm font-bold mb-1 capitalize">{name}</div>
                  <div
                    className="font-mono text-xs mb-2 p-1 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => copyToClipboard(value, `semantic-${name}`)}
                  >
                    {copiedItem === `semantic-${name}` ? (
                      <FaCheck className="inline mr-1 text-green-500" />
                    ) : (
                      <FaCopy className="inline mr-1" />
                    )}
                    {value}
                  </div>
                  <div className="font-mono text-xs text-gray-600">{getContrastRatio(value)}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Neutral Colors */}
          <div className="mb-12">
            <h3 className="font-display text-2xl text-comic-black mb-6">Neutral Scale</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-9 gap-3">
              {Object.entries(colors.neutral).map(([name, value]) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="comic-panel bg-white p-3"
                >
                  <div
                    className="w-full h-16 rounded border-2 border-comic-black mb-2"
                    style={{ backgroundColor: value }}
                  />
                  <div className="font-comic text-xs font-bold mb-1">{name}</div>
                  <div
                    className="font-mono text-xs p-1 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => copyToClipboard(value, `neutral-${name}`)}
                  >
                    {copiedItem === `neutral-${name}` ? (
                      <FaCheck className="inline mr-1 text-green-500" />
                    ) : (
                      <FaCopy className="inline mr-1" />
                    )}
                    {value}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Typography Tokens */}
      <section className="pb-12 px-4 bg-comic-yellow">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-8 pt-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <FaFont size={32} className="text-comic-black" />
              <h2 className="font-display text-4xl text-comic-black">TYPOGRAPHY</h2>
            </div>
          </motion.div>

          {/* Font Families */}
          <div className="mb-12">
            <h3 className="font-display text-2xl text-comic-black mb-6">Font Families</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(typography.fontFamily).map(([name, value]) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="comic-panel bg-white p-6"
                >
                  <div className="font-comic text-sm font-bold mb-2 uppercase">{name}</div>
                  <div className="text-2xl mb-4" style={{ fontFamily: value }}>
                    The quick brown fox jumps over the lazy dog
                  </div>
                  <div
                    className="font-mono text-xs p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => copyToClipboard(value, `font-${name}`)}
                  >
                    {copiedItem === `font-${name}` ? (
                      <FaCheck className="inline mr-1 text-green-500" />
                    ) : (
                      <FaCopy className="inline mr-1" />
                    )}
                    {value}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Font Sizes */}
          <div className="mb-12">
            <h3 className="font-display text-2xl text-comic-black mb-6">Font Sizes</h3>
            <div className="comic-panel bg-white p-6">
              <div className="space-y-4">
                {Object.entries(typography.fontSize).map(([name, value]) => (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-6 p-3 hover:bg-gray-50 rounded"
                  >
                    <div className="w-16 font-comic text-sm font-bold">{name}</div>
                    <div className="font-display flex-1" style={{ fontSize: value }}>
                      Aa
                    </div>
                    <div
                      className="font-mono text-xs p-1 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 transition-colors"
                      onClick={() => copyToClipboard(value, `size-${name}`)}
                    >
                      {copiedItem === `size-${name}` ? (
                        <FaCheck className="inline mr-1 text-green-500" />
                      ) : (
                        <FaCopy className="inline mr-1" />
                      )}
                      {value}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spacing Tokens */}
      <section className="pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-8 pt-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <FaRuler size={32} className="text-comic-blue" />
              <h2 className="font-display text-4xl text-comic-blue">SPACING & LAYOUT</h2>
            </div>
          </motion.div>

          {/* Spacing Scale */}
          <div className="mb-12">
            <h3 className="font-display text-2xl text-comic-black mb-6">Spacing Scale</h3>
            <div className="comic-panel bg-white p-6">
              <div className="space-y-3">
                {Object.entries(spacing)
                  .slice(0, 20)
                  .map(([name, value]) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-4"
                    >
                      <div className="w-12 font-comic text-sm font-bold">{name}</div>
                      <div
                        className="bg-comic-blue border border-comic-black"
                        style={{
                          width: value === "0px" ? "1px" : value,
                          height: "16px",
                        }}
                      />
                      <div
                        className="font-mono text-xs p-1 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 transition-colors"
                        onClick={() => copyToClipboard(value, `spacing-${name}`)}
                      >
                        {copiedItem === `spacing-${name}` ? (
                          <FaCheck className="inline mr-1 text-green-500" />
                        ) : (
                          <FaCopy className="inline mr-1" />
                        )}
                        {value}
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          </div>

          {/* Border Radius */}
          <div className="mb-12">
            <h3 className="font-display text-2xl text-comic-black mb-6">Border Radius</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Object.entries(borderRadius).map(([name, value]) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="comic-panel bg-white p-4"
                >
                  <div
                    className="w-full h-16 bg-comic-green border-2 border-comic-black mb-3"
                    style={{ borderRadius: value }}
                  />
                  <div className="font-comic text-sm font-bold mb-1">{name}</div>
                  <div
                    className="font-mono text-xs p-1 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => copyToClipboard(value, `radius-${name}`)}
                  >
                    {copiedItem === `radius-${name}` ? (
                      <FaCheck className="inline mr-1 text-green-500" />
                    ) : (
                      <FaCopy className="inline mr-1" />
                    )}
                    {value}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Usage Examples */}
      <section className="py-12 px-4 bg-comic-black">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <FaGem size={32} className="text-comic-yellow" />
              <h2 className="font-display text-4xl text-comic-yellow">USING TOKENS</h2>
            </div>
            <div className="speech-bubble bg-comic-white max-w-3xl mx-auto">
              <p className="font-comic text-lg text-comic-black">
                Import tokens from{" "}
                <code className="bg-gray-100 px-2 py-1 rounded">@/design-system/tokens</code>
                to ensure consistent styling across your entire application. All tokens are
                <strong> TYPE-SAFE</strong> and provide excellent developer experience!
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
