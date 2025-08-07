import { motion } from "framer-motion";
import { FaFilter, FaStar, FaTrophy } from "react-icons/fa";

import type { Testimonial } from "@/config/testimonials";

/**
 * Props for the testimonials filter component.
 */
interface TestimonialsFiltersProps {
  testimonials: Testimonial[];
  filter: string;
  setFilter: (filter: string) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
}

/**
 * Filter and sort controls for testimonials page.
 */
export function TestimonialsFilters({
  testimonials,
  filter,
  setFilter,
  sortBy,
  setSortBy,
}: TestimonialsFiltersProps) {
  const projectTypes = Array.from(new Set(testimonials.map((t) => t.projectType).filter(Boolean)));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-8"
    >
      <div className="comic-panel p-6 bg-comic-white mb-6">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <FaFilter className="text-comic-purple" />
            <span className="font-comic font-bold text-comic-black">Filter Heroes:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`btn-comic text-sm px-4 py-2 ${
                filter === "all"
                  ? "bg-comic-purple text-comic-white"
                  : "bg-comic-yellow text-comic-black hover:bg-comic-purple hover:text-comic-white"
              }`}
            >
              All Heroes ({testimonials.length})
            </button>
            <button
              onClick={() => setFilter("first-hero")}
              className={`btn-comic text-sm px-4 py-2 ${
                filter === "first-hero"
                  ? "bg-comic-purple text-comic-white"
                  : "bg-comic-yellow text-comic-black hover:bg-comic-purple hover:text-comic-white"
              }`}
            >
              <FaTrophy className="inline mr-1" />
              First Hero
            </button>
            <button
              onClick={() => setFilter("5-star")}
              className={`btn-comic text-sm px-4 py-2 ${
                filter === "5-star"
                  ? "bg-comic-purple text-comic-white"
                  : "bg-comic-yellow text-comic-black hover:bg-comic-purple hover:text-comic-white"
              }`}
            >
              <FaStar className="inline mr-1" />
              5-Star
            </button>
            <button
              onClick={() => setFilter("highlighted")}
              className={`btn-comic text-sm px-4 py-2 ${
                filter === "highlighted"
                  ? "bg-comic-purple text-comic-white"
                  : "bg-comic-yellow text-comic-black hover:bg-comic-purple hover:text-comic-white"
              }`}
            >
              ⭐ Featured
            </button>
          </div>
        </div>

        {projectTypes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {projectTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type || "")}
                className={`btn-comic text-xs px-3 py-1 ${
                  filter === type
                    ? "bg-comic-red text-comic-white"
                    : "bg-comic-white text-comic-black hover:bg-comic-red hover:text-comic-white border-2 border-comic-red"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 mt-4 pt-4 border-t-2 border-comic-black">
          <span className="font-comic font-bold text-comic-black">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-comic-white border-3 border-comic-black rounded-lg px-3 py-2 font-comic text-comic-black"
          >
            <option value="date">Latest First</option>
            <option value="rating">Highest Rating</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
}
