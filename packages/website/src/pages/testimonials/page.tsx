import { motion } from "framer-motion";
import { useState } from "react";

import {
  TestimonialsHeader,
  TestimonialsFilters,
  TestimonialsGrid,
  JoinHeroLeague,
} from "@/components/testimonials";
import { TestimonialsPageSEO } from "@/features/common/SEO";
import { useTestimonials } from "@/hooks/useTestimonials";

/**
 * Testimonials page displaying developer success stories in a filterable grid layout.
 */
export function TestimonialsPage() {
  const { testimonials } = useTestimonials();
  const [filter, setFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");

  const filteredTestimonials = testimonials.filter((testimonial) => {
    if (filter === "all") return true;
    if (filter === "5-star") return testimonial.rating === 5;
    if (filter === "first-hero") return testimonials.indexOf(testimonial) === 0;
    if (filter === "highlighted") return testimonial.highlighted;
    return testimonial.projectType === filter;
  });

  const sortedTestimonials = [...filteredTestimonials].sort((a, b) => {
    if (sortBy === "date") return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <>
      <TestimonialsPageSEO testimonialsCount={testimonials.length} />

      <div className="min-h-screen pt-20 pb-20">
        <div className="absolute inset-0 opacity-5">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 35px,
                rgba(0,0,0,0.05) 35px,
                rgba(0,0,0,0.05) 70px
              )`,
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative">
          <TestimonialsHeader />

          <TestimonialsFilters
            testimonials={testimonials}
            filter={filter}
            setFilter={setFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6 text-center"
          >
            <p className="font-comic text-comic-black text-lg">
              Showing <strong className="text-comic-purple">{sortedTestimonials.length}</strong>{" "}
              epic testimonials
            </p>
          </motion.div>

          <TestimonialsGrid
            testimonials={testimonials}
            sortedTestimonials={sortedTestimonials}
            setFilter={setFilter}
          />

          <JoinHeroLeague />
        </div>
      </div>
    </>
  );
}
