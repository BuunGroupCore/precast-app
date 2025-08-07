import { motion } from "framer-motion";
import { useState } from "react";
import { FaTerminal, FaCopy, FaCheck } from "react-icons/fa";
import { SiNpm, SiYarn, SiBun } from "react-icons/si";
import { useNavigate } from "react-router-dom";

import { PACKAGE_MANAGERS } from "../../config/constants";

/**
 * Hero section component for the home page.
 * Displays the main title, tagline, and quick start command with package manager selector.
 */
export function HeroSection() {
  const navigate = useNavigate();
  const [selectedPackageManager, setSelectedPackageManager] = useState("npx");
  const [copied, setCopied] = useState(false);

  const packageManagerIcons = {
    npx: SiNpm,
    npm: SiNpm,
    yarn: SiYarn,
    pnpm: SiNpm,
    bun: SiBun,
  };

  const copyCommand = () => {
    const pm = PACKAGE_MANAGERS.find((pm) => pm.id === selectedPackageManager);
    const command = pm?.command + " my-super-app";
    if (command) {
      navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="relative">
      <div className="relative max-w-7xl mx-auto px-4 py-10 sm:py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <span className="action-text text-5xl sm:text-7xl md:text-9xl text-comic-red">
              PRECAST
            </span>
            <br />
            <span className="font-display text-2xl sm:text-4xl md:text-5xl text-comic-black">
              The Superhero CLI Builder
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="inline-block mb-12"
          >
            <div className="speech-bubble max-w-2xl">
              <p className="font-comic text-lg sm:text-xl md:text-2xl">
                Build TypeScript projects with <strong>SUPERHUMAN SPEED!</strong>
                Choose your stack, configure your powers, and launch into action!
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <motion.button
              onClick={() => navigate("/builder")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-pow flex items-center gap-3"
            >
              <FaTerminal className="text-2xl" />
              <span>OPEN BUILDER</span>
            </motion.button>

            <motion.button
              onClick={() => navigate("/origin-story")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-bam"
            >
              READ ORIGIN STORY
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-16 max-w-4xl mx-auto"
          >
            <div className="flex justify-center mb-4">
              <div className="flex gap-2 p-2 bg-comic-white rounded-lg border-4 border-comic-black comic-shadow">
                {PACKAGE_MANAGERS.map((pm) => {
                  const Icon = packageManagerIcons[pm.id as keyof typeof packageManagerIcons];
                  const pmColor =
                    pm.id === "npx" || pm.id === "npm"
                      ? "var(--comic-red)"
                      : pm.id === "yarn"
                        ? "var(--comic-blue)"
                        : pm.id === "bun"
                          ? "var(--comic-yellow)"
                          : "var(--comic-green)";

                  return (
                    <button
                      key={pm.id}
                      onClick={() => setSelectedPackageManager(pm.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-comic font-bold text-sm border-2 transition-all ${
                        selectedPackageManager === pm.id
                          ? "border-comic-black comic-shadow"
                          : "border-transparent hover:border-comic-black"
                      }`}
                      style={{
                        backgroundColor: selectedPackageManager === pm.id ? pmColor : "transparent",
                        color:
                          selectedPackageManager === pm.id
                            ? "var(--comic-white)"
                            : "var(--comic-black)",
                      }}
                    >
                      <Icon className="text-lg" />
                      <span>{pm.id.toUpperCase()}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="comic-panel p-6 bg-comic-black relative group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-comic-red border border-comic-black" />
                    <div className="w-3 h-3 rounded-full bg-comic-yellow border border-comic-black" />
                    <div className="w-3 h-3 rounded-full bg-comic-green border border-comic-black" />
                  </div>
                  <span className="font-display text-comic-green">QUICK START</span>
                </div>

                <motion.button
                  onClick={copyCommand}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-3 py-1 rounded-lg border-2 border-comic-green bg-comic-green/20 hover:bg-comic-green/30 transition-all opacity-0 group-hover:opacity-100"
                >
                  {copied ? (
                    <>
                      <FaCheck className="text-comic-green text-sm" />
                      <span className="font-comic text-comic-green text-sm">COPIED!</span>
                    </>
                  ) : (
                    <>
                      <FaCopy className="text-comic-green text-sm" />
                      <span className="font-comic text-comic-green text-sm">COPY</span>
                    </>
                  )}
                </motion.button>
              </div>

              <div
                className="font-mono text-lg cursor-pointer hover:bg-comic-white/5 p-2 rounded transition-colors"
                onClick={copyCommand}
              >
                <span className="text-comic-yellow">$</span>{" "}
                <span className="text-comic-green">
                  {PACKAGE_MANAGERS.find((pm) => pm.id === selectedPackageManager)?.command}
                </span>{" "}
                <span className="text-comic-blue">my-super-app</span>
                <span className="animate-pulse text-comic-green ml-2">_</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
