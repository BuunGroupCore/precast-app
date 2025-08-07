import { motion } from "framer-motion";
import { FaRocket, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

/**
 * Call-to-action section with hero art background encouraging testimonial submissions.
 */
export function JoinHeroLeague() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="text-center mt-16"
    >
      <div
        className="comic-panel p-8 bg-comic-black text-comic-white relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('/art/9.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(255,255,255,0.1) 10px,
                rgba(255,255,255,0.1) 20px
              )`,
            }}
          />
        </div>

        <div className="relative z-10">
          <h2 className="action-text text-3xl md:text-4xl mb-4 text-comic-yellow">
            JOIN THE HERO LEAGUE!
          </h2>
          <p className="font-comic text-lg mb-6">
            Ready to become a <strong className="text-comic-yellow">coding superhero?</strong> Share
            your PRECAST story!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={() => navigate("/submit-testimonial")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-comic bg-comic-purple text-comic-white hover:bg-comic-darkPurple inline-flex items-center gap-3 text-xl px-8 py-4"
            >
              <FaRocket />
              SHARE YOUR STORY
            </motion.button>
            <motion.button
              onClick={() => navigate("/")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-comic bg-comic-yellow text-comic-black hover:bg-comic-white inline-flex items-center gap-3 text-xl px-8 py-4"
            >
              <FaArrowLeft />
              BACK TO HOME
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
