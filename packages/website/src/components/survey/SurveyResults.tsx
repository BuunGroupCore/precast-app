import { motion } from "framer-motion";
import React from "react";
import { FaRocket, FaTrophy } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { ExtendedProjectConfig } from "@/components/builder";

import { getTechIcon } from "./techIcons";

interface SurveyResultsProps {
  recommendedStack: Partial<ExtendedProjectConfig>;
  onStartOver: () => void;
}

export function SurveyResults({ recommendedStack, onStartOver }: SurveyResultsProps) {
  const navigate = useNavigate();

  const navigateToBuilder = () => {
    navigate("/builder", { state: { recommendedStack } });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-comic-white rounded-2xl border-4 border-comic-black comic-shadow p-8">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="inline-block text-6xl mb-4 text-comic-yellow"
          >
            <FaTrophy />
          </motion.div>
          <h2 className="text-3xl font-display text-comic-black mb-2">
            Your Perfect Stack is Ready!
          </h2>
          <p className="font-comic text-comic-black/60">Based on your answers, we recommend:</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {recommendedStack.framework && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-comic-yellow rounded-xl border-3 border-comic-black p-4 comic-shadow hover:transform hover:rotate-1 transition-transform"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="text-2xl text-comic-black">
                  {React.createElement(getTechIcon(recommendedStack.framework), {
                    className: "w-6 h-6",
                  })}
                </div>
                <div className="font-display text-sm text-comic-black">FRAMEWORK</div>
              </div>
              <div className="text-xl font-bold font-comic text-comic-black capitalize">
                {recommendedStack.framework}
              </div>
            </motion.div>
          )}
          {recommendedStack.backend && recommendedStack.backend !== "none" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-comic-blue rounded-xl border-3 border-comic-black p-4 comic-shadow hover:transform hover:-rotate-1 transition-transform"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="text-2xl text-comic-white">
                  {React.createElement(getTechIcon(recommendedStack.backend), {
                    className: "w-6 h-6",
                  })}
                </div>
                <div className="font-display text-sm text-comic-white">BACKEND</div>
              </div>
              <div className="text-xl font-bold font-comic text-comic-white capitalize">
                {recommendedStack.backend}
              </div>
            </motion.div>
          )}
          {recommendedStack.database && recommendedStack.database !== "none" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-comic-green rounded-xl border-3 border-comic-black p-4 comic-shadow hover:transform hover:rotate-1 transition-transform"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="text-2xl text-comic-black">
                  {React.createElement(getTechIcon(recommendedStack.database), {
                    className: "w-6 h-6",
                  })}
                </div>
                <div className="font-display text-sm text-comic-black">DATABASE</div>
              </div>
              <div className="text-xl font-bold font-comic text-comic-black capitalize">
                {recommendedStack.database}
              </div>
            </motion.div>
          )}
          {recommendedStack.styling && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-comic-purple rounded-xl border-3 border-comic-black p-4 comic-shadow hover:transform hover:-rotate-1 transition-transform"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="text-2xl text-comic-white">
                  {React.createElement(getTechIcon(recommendedStack.styling), {
                    className: "w-6 h-6",
                  })}
                </div>
                <div className="font-display text-sm text-comic-white">STYLING</div>
              </div>
              <div className="text-xl font-bold font-comic text-comic-white capitalize">
                {recommendedStack.styling}
              </div>
            </motion.div>
          )}
          {recommendedStack.auth && recommendedStack.auth !== "none" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-comic-pink rounded-xl border-3 border-comic-black p-4 comic-shadow hover:transform hover:rotate-1 transition-transform"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="text-2xl text-comic-black">
                  {React.createElement(getTechIcon(recommendedStack.auth), {
                    className: "w-6 h-6",
                  })}
                </div>
                <div className="font-display text-sm text-comic-black">AUTH</div>
              </div>
              <div className="text-xl font-bold font-comic text-comic-black capitalize">
                {recommendedStack.auth}
              </div>
            </motion.div>
          )}
          {recommendedStack.uiLibrary && recommendedStack.uiLibrary !== "none" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-comic-orange rounded-xl border-3 border-comic-black p-4 comic-shadow hover:transform hover:-rotate-1 transition-transform"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="text-2xl text-comic-black">
                  {React.createElement(getTechIcon(recommendedStack.uiLibrary), {
                    className: "w-6 h-6",
                  })}
                </div>
                <div className="font-display text-sm text-comic-black">UI LIBRARY</div>
              </div>
              <div className="text-xl font-bold font-comic text-comic-black capitalize">
                {recommendedStack.uiLibrary === "shadcn" ? "shadcn/ui" : recommendedStack.uiLibrary}
              </div>
            </motion.div>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onStartOver}
            className="px-6 py-3 bg-comic-white rounded-lg border-3 border-comic-black font-comic font-bold hover:bg-comic-yellow comic-shadow-sm transition-all"
          >
            Start Over
          </button>
          <button
            onClick={navigateToBuilder}
            className="px-6 py-3 bg-comic-green text-comic-black rounded-lg border-3 border-comic-black font-comic font-bold hover:bg-comic-dark-green hover:text-comic-white comic-shadow transition-all flex items-center gap-2"
          >
            Use This Stack <FaRocket />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
