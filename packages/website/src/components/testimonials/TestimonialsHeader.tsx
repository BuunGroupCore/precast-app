import { motion } from "framer-motion";
import { FaTrophy, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

/**
 * Testimonials page header with navigation and title.
 */
export function TestimonialsHeader() {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <button
        onClick={() => navigate("/")}
        className="btn-comic bg-comic-white text-comic-black hover:bg-comic-yellow flex items-center gap-2 mb-6"
      >
        <FaArrowLeft />
        BACK TO HOME
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="action-text text-5xl md:text-7xl text-comic-purple mb-6">
          HERO LEAGUE HALL OF FAME
        </h1>
        <div className="speech-bubble max-w-3xl mx-auto mb-8">
          <p className="font-comic text-lg md:text-xl text-comic-black">
            <FaTrophy className="inline text-comic-yellow mr-2" />
            Meet the <strong>legendary developers</strong> who joined our superhero league! Each
            card tells a story of coding victory! 🦸‍♂️🦸‍♀️
          </p>
        </div>
      </motion.div>
    </div>
  );
}
