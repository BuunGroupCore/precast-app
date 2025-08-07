import { motion } from "framer-motion";
import { FaStar, FaQuoteLeft, FaTrophy } from "react-icons/fa";

import { THIRD_PARTY_APIS } from "@/config/constants";
import type { Testimonial } from "@/config/testimonials";

/**
 * Props for the testimonial card component.
 */
interface TestimonialCardProps {
  testimonial: Testimonial;
  isFirstHero: boolean;
  index: number;
}

/**
 * Individual testimonial card with comic book styling.
 */
export function TestimonialCard({ testimonial, isFirstHero, index }: TestimonialCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar key={i} className={i < rating ? "text-comic-yellow" : "text-comic-gray"} size={14} />
    ));
  };

  return (
    <motion.div
      key={testimonial.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
      }}
      className="relative"
    >
      {isFirstHero && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-comic-yellow border-3 border-comic-black rounded-full px-4 py-2 shadow-lg">
            <div className="flex items-center gap-2">
              <FaTrophy className="text-sm text-comic-black" />
              <span className="font-comic font-bold text-xs text-comic-black">FIRST HERO</span>
            </div>
          </div>
        </div>
      )}

      {testimonial.highlighted && !isFirstHero && (
        <div className="absolute -top-3 -right-3 z-10">
          <div className="action-text text-sm text-comic-white bg-comic-red px-3 py-1 rounded-full border-3 border-comic-black shadow-lg transform rotate-12">
            FEATURED
          </div>
        </div>
      )}
      {testimonial.highlighted && isFirstHero && (
        <div className="absolute -top-3 -right-3 z-10">
          <div className="action-text text-sm text-comic-white bg-comic-red px-3 py-1 rounded-full border-3 border-comic-black shadow-lg transform rotate-12">
            LEGENDARY
          </div>
        </div>
      )}

      <div
        className="comic-panel bg-comic-white p-6 h-full flex flex-col"
        style={{
          boxShadow: "8px 8px 0 var(--comic-black)",
        }}
      >
        <div className="absolute -top-3 -left-3 bg-comic-yellow rounded-full p-2 border-3 border-comic-black">
          <FaQuoteLeft className="text-comic-black text-sm" />
        </div>

        <div className="flex-grow mb-4">
          <p className="font-comic text-base text-comic-black leading-relaxed mb-4">
            &quot;{testimonial.content}&quot;
          </p>

          <div className="flex items-center gap-1 mb-4">{renderStars(testimonial.rating)}</div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t-2 border-comic-black">
          <img
            src={`${THIRD_PARTY_APIS.DICEBEAR_NOTIONISTS}?seed=${testimonial.avatarSeed}`}
            alt={testimonial.name}
            className="w-12 h-12 rounded-full border-2 border-comic-black"
          />
          <div className="flex-grow">
            <h3 className="font-comic font-bold text-base text-comic-black">
              {testimonial.name}
              {isFirstHero && (
                <span className="inline-flex items-center gap-1 ml-2 px-2 py-0.5 bg-comic-yellow text-comic-black text-xs font-bold rounded-full border border-comic-black">
                  <FaTrophy className="text-xs" />
                  #1
                </span>
              )}
            </h3>
            <p className="font-comic text-sm text-comic-gray">
              {testimonial.role} at {testimonial.company}
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {testimonial.projectType && (
                <span className="inline-block px-2 py-1 bg-comic-purple text-comic-white text-xs font-comic rounded-full">
                  {testimonial.projectType}
                </span>
              )}
              {isFirstHero && (
                <span className="inline-block px-2 py-1 bg-comic-red text-comic-white text-xs font-comic rounded-full">
                  FOUNDING MEMBER
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="text-right mt-2">
          <span className="font-comic text-xs text-comic-gray">
            {new Date(testimonial.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
