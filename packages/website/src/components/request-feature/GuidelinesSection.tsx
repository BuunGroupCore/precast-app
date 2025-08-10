import { motion } from "framer-motion";
import { FaCheckCircle, FaStar, FaUsers } from "react-icons/fa";

const guidelines = [
  "Be specific and clear about the feature",
  "Explain why this feature would be valuable",
  "Include concrete use cases or examples",
  "Consider backwards compatibility",
  "Search existing issues first to avoid duplicates",
];

const benefits = [
  "Help shape the future of Precast",
  "Contribute to the developer community",
  "Get your feature implemented by the team",
  "Improve the CLI for everyone",
  "Be recognized as a contributor",
];

/**
 * Guidelines and benefits section for feature requests
 */
export function GuidelinesSection() {
  return (
    <div className="space-y-6">
      {/* Guidelines */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="comic-panel bg-comic-yellow p-6"
      >
        <h3 className="font-display text-xl text-comic-black mb-4 flex items-center gap-2">
          <FaCheckCircle />
          Guidelines
        </h3>
        <ul className="space-y-2">
          {guidelines.map((guideline, index) => (
            <li key={index} className="font-comic text-sm text-comic-black flex items-start gap-2">
              <span className="text-comic-red mt-1">•</span>
              {guideline}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Benefits */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="comic-panel bg-comic-green p-6"
      >
        <h3 className="font-display text-xl text-comic-white mb-4 flex items-center gap-2">
          <FaStar />
          Why Contribute?
        </h3>
        <ul className="space-y-2">
          {benefits.map((benefit, index) => (
            <li key={index} className="font-comic text-sm text-comic-white flex items-start gap-2">
              <span className="text-comic-yellow mt-1">•</span>
              {benefit}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Additional Help */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="comic-panel bg-comic-blue p-6"
      >
        <h3 className="font-display text-xl text-comic-white mb-4 flex items-center gap-2">
          <FaUsers />
          Need Help?
        </h3>
        <p className="font-comic text-sm text-comic-white mb-4">
          Not sure how to describe your feature? Join our Discord community for help!
        </p>
        <a
          href="https://discord.gg/4Wen9Pg3rG"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-comic bg-comic-white text-comic-blue hover:bg-comic-gray w-full text-center"
        >
          Join Discord
        </a>
      </motion.div>
    </div>
  );
}
