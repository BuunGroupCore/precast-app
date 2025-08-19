import { motion } from "framer-motion";
import { FaMagic } from "react-icons/fa";

export function GeneratingAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto text-center"
    >
      <div className="bg-comic-white rounded-2xl border-4 border-comic-black comic-shadow p-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="inline-block text-6xl mb-6 text-comic-purple"
        >
          <FaMagic />
        </motion.div>
        <h2 className="text-3xl font-display text-comic-black mb-4">Analyzing your answers...</h2>
        <p className="font-comic text-comic-black/60">
          Our AI is crafting the perfect stack just for you!
        </p>
      </div>
    </motion.div>
  );
}
