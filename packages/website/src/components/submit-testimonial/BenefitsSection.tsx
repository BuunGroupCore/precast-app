import { motion } from "framer-motion";
import { FaStar, FaCheckCircle } from "react-icons/fa";

/**
 * Benefits section showing why users should share their testimonials.
 */
export function BenefitsSection() {
  const benefits = [
    "Inspire other developers with your success story",
    "Get featured on the PRECAST website",
    "Help grow the PRECAST community",
    "Share your expertise and insights",
    "Join the ranks of coding superheroes",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-20"
    >
      <div className="comic-panel p-8 bg-comic-blue text-comic-white">
        <h3 className="font-display text-3xl mb-6 flex items-center gap-3 justify-center">
          <FaStar className="text-comic-yellow" />
          WHY SHARE YOUR STORY?
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3"
            >
              <FaCheckCircle className="text-comic-yellow mt-1 flex-shrink-0 text-xl" />
              <span className="font-comic text-lg">{benefit}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
