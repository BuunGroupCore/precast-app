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
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 border-4 border-comic-yellow transform rotate-45"></div>
        <div className="absolute top-20 right-20 w-16 h-16 border-4 border-comic-yellow transform -rotate-12"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 border-4 border-comic-yellow transform rotate-12"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="text-center lg:text-left">
            <h2 className="action-text text-5xl md:text-7xl text-comic-yellow mb-6">
              READY FOR ACTION?
            </h2>

            <div className="speech-bubble bg-comic-white text-comic-black max-w-2xl mb-8">
              <p className="font-comic text-xl">
                Join the <strong>LEAGUE OF EXTRAORDINARY DEVELOPERS</strong> and build amazing
                projects with superhero speed!
              </p>
            </div>

            <div className="flex justify-center lg:justify-start">
              <button
                onClick={() => navigate("/builder")}
                className="btn-comic bg-comic-yellow text-comic-black hover:bg-comic-darkYellow flex items-center gap-2 justify-center transform hover:scale-105 transition-all duration-200"
              >
                <FaRocket />
                START YOUR MISSION
              </button>
            </div>
          </div>

          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Comic panel frame */}
              <div className="border-8 border-comic-yellow rounded-lg bg-comic-white p-4 shadow-2xl transform rotate-1">
                <img
                  src="/art/5.png"
                  alt="Ready for Action Hero"
                  className="w-full h-80 lg:h-96 object-cover rounded-lg"
                />

                {/* Panel decorations */}
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-comic-blue rounded-full border-2 border-comic-yellow"></div>
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-comic-green rounded-full border-2 border-comic-yellow"></div>
                <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-comic-purple rounded-full border-2 border-comic-yellow"></div>
                <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-comic-orange rounded-full border-2 border-comic-yellow"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
