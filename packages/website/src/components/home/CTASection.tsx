import { motion } from "framer-motion";
import { FaRocket } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

/**
 * Call-to-action section component for the home page.
 * Displays a final compelling message to encourage users to start using the builder.
 */
export function CTASection() {
  const navigate = useNavigate();

  return (
    <section
      className="py-20 px-4 relative overflow-hidden"
      style={{ backgroundColor: "var(--comic-red)" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative max-w-4xl mx-auto text-center"
      >
        <h2 className="action-text text-5xl md:text-7xl text-comic-yellow mb-6">
          READY FOR ACTION?
        </h2>

        <div className="speech-bubble bg-comic-white text-comic-black max-w-2xl mx-auto mb-8">
          <p className="font-comic text-xl">
            Join the <strong>LEAGUE OF EXTRAORDINARY DEVELOPERS</strong> and build amazing projects
            with superhero speed!
          </p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => navigate("/builder")}
            className="btn-comic bg-comic-yellow text-comic-black hover:bg-comic-darkYellow flex items-center gap-2 justify-center"
          >
            <FaRocket />
            START YOUR MISSION
          </button>
        </div>
      </motion.div>
    </section>
  );
}
