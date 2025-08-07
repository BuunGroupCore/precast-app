import { motion } from "framer-motion";

import type { Testimonial } from "@/config/testimonials";

import { TestimonialCard } from "./TestimonialCard";

/**
 * Props for the testimonials grid component.
 */
interface TestimonialsGridProps {
  testimonials: Testimonial[];
  sortedTestimonials: Testimonial[];
  setFilter: (filter: string) => void;
}

/**
 * Grid display of testimonial cards with empty state handling.
 */
export function TestimonialsGrid({
  testimonials,
  sortedTestimonials,
  setFilter,
}: TestimonialsGridProps) {
  if (sortedTestimonials.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
        <div className="comic-panel bg-comic-white p-12 max-w-md mx-auto">
          <h3 className="action-text text-3xl text-comic-purple mb-4">NO HEROES FOUND!</h3>
          <p className="font-comic text-comic-black mb-6">
            No testimonials match your current filter. Try adjusting your search criteria!
          </p>
          <button
            onClick={() => setFilter("all")}
            className="btn-comic bg-comic-yellow text-comic-black hover:bg-comic-purple hover:text-comic-white"
          >
            Show All Heroes
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
    >
      {sortedTestimonials.map((testimonial, idx) => {
        const isFirstHero = testimonials.indexOf(testimonial) === 0;

        return (
          <TestimonialCard
            key={testimonial.id}
            testimonial={testimonial}
            isFirstHero={isFirstHero}
            index={idx}
          />
        );
      })}
    </motion.div>
  );
}
