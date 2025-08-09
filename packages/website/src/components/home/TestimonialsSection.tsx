import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FaStar,
  FaQuoteLeft,
  FaChevronLeft,
  FaChevronRight,
  FaRocket,
  FaTrophy,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { THIRD_PARTY_APIS } from "@/config/constants";
import { useTestimonials } from "@/hooks/useTestimonials";

/**
 * Testimonials section component displaying user reviews in a comic book style.
 * Shows "Be the First Hero" design when empty or displays testimonials with carousel navigation.
 * Automatically applies special "First Hero" badge to the first testimonial.
 */
export function TestimonialsSection() {
  const navigate = useNavigate();
  const { testimonials } = useTestimonials();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (!isPaused && testimonials.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isPaused, testimonials.length]);

  /**
   * Renders star rating display
   */
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar key={i} className={i < rating ? "text-comic-yellow" : "text-comic-gray"} size={16} />
    ));
  };

  return (
    <section className="py-20 px-4 relative" style={{ backgroundColor: "var(--comic-purple)" }}>
      <div className="absolute inset-0 opacity-10">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 35px,
              rgba(255,255,255,0.1) 35px,
              rgba(255,255,255,0.1) 70px
            ), repeating-linear-gradient(
              90deg,
              transparent,
              transparent 35px,
              rgba(255,255,255,0.1) 35px,
              rgba(255,255,255,0.1) 70px
            )`,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="action-text text-4xl sm:text-5xl md:text-7xl text-comic-yellow mb-8 sm:mb-12">
            HERO TESTIMONIALS
          </h2>
          <div className="relative max-w-3xl mx-auto">
            <div
              className="relative border-4 border-comic-black rounded-3xl p-8 bg-comic-white"
              style={{
                boxShadow: "6px 6px 0 var(--comic-black)",
              }}
            >
              <div className="absolute -bottom-6 left-20 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-comic-black"></div>
              <div className="absolute -bottom-5 left-20 w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-white"></div>

              <p className="font-comic text-base sm:text-lg md:text-xl text-comic-black">
                Hear from the <strong className="text-comic-purple">AMAZING DEVELOPERS</strong>{" "}
                who&apos;ve joined our superhero league!
              </p>
            </div>
          </div>
        </motion.div>

        {testimonials.length > 0 ? (
          <div
            className="relative max-w-6xl mx-auto px-12 sm:px-16 md:px-20"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-comic-yellow border-2 sm:border-4 border-comic-black rounded-full p-2 sm:p-3 shadow-lg"
              >
                <FaChevronLeft className="text-comic-black text-sm sm:text-xl" />
              </motion.div>
            </button>

            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-comic-yellow border-2 sm:border-4 border-comic-black rounded-full p-2 sm:p-3 shadow-lg"
              >
                <FaChevronRight className="text-comic-black text-sm sm:text-xl" />
              </motion.div>
            </button>

            <div className="overflow-visible py-12">
              <motion.div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {testimonials.map((testimonial, idx) => (
                  <div key={testimonial.id} className="w-full flex-shrink-0 px-2 sm:px-4 md:px-8">
                    <div className="max-w-4xl mx-auto">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                      >
                        {idx === 0 && (
                          <div className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2 z-20">
                            <div className="bg-comic-yellow border-2 sm:border-3 border-comic-black rounded-full px-3 sm:px-4 py-1 sm:py-2 shadow-lg">
                              <div className="flex items-center gap-1 sm:gap-2">
                                <FaTrophy className="text-xs sm:text-sm text-comic-black" />
                                <span className="font-comic font-bold text-xs sm:text-sm text-comic-black">
                                  FIRST HERO
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {testimonial.highlighted && !idx && (
                          <div className="absolute -top-8 -right-2 sm:-top-10 sm:-right-10 z-10">
                            <div className="action-text text-base sm:text-xl md:text-2xl text-comic-white bg-comic-red px-2 sm:px-4 py-1 sm:py-2 rounded-full border-2 sm:border-4 border-comic-black shadow-lg transform rotate-12">
                              LEGENDARY!
                            </div>
                          </div>
                        )}
                        {testimonial.highlighted && idx !== 0 && (
                          <div className="absolute -top-8 -right-2 sm:-top-10 sm:-right-10 z-10">
                            <div className="action-text text-base sm:text-xl md:text-2xl text-comic-white bg-comic-red px-2 sm:px-4 py-1 sm:py-2 rounded-full border-2 sm:border-4 border-comic-black shadow-lg transform rotate-12">
                              WOW!
                            </div>
                          </div>
                        )}

                        <div
                          className="relative border-4 sm:border-6 border-comic-black rounded-2xl p-6 sm:p-8 md:p-12 bg-comic-white"
                          style={{
                            boxShadow: "8px 8px 0 var(--comic-black)",
                          }}
                        >
                          <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 bg-comic-yellow rounded-full p-2 sm:p-3 border-2 sm:border-4 border-comic-black">
                            <FaQuoteLeft className="text-comic-black text-sm sm:text-xl" />
                          </div>

                          <div className="mb-6">
                            <p className="font-comic text-base sm:text-lg md:text-xl text-comic-black leading-relaxed">
                              &quot;{testimonial.content}&quot;
                            </p>
                          </div>

                          <div className="flex items-center gap-1 mb-4">
                            {renderStars(testimonial.rating)}
                          </div>

                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                            <img
                              src={`${THIRD_PARTY_APIS.DICEBEAR_NOTIONISTS}?seed=${testimonial.avatarSeed}`}
                              alt={testimonial.name}
                              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 sm:border-3 border-comic-black"
                            />
                            <div className="flex-1">
                              <h3 className="font-comic font-bold text-base sm:text-lg text-comic-black">
                                {testimonial.name}
                              </h3>
                              <p className="font-comic text-xs sm:text-sm text-comic-gray">
                                {testimonial.role} at {testimonial.company}
                              </p>
                              <div className="flex flex-wrap gap-1 sm:gap-2 mt-1">
                                {testimonial.projectType && (
                                  <span className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 bg-comic-purple text-comic-white text-[10px] sm:text-xs font-comic rounded-full">
                                    {testimonial.projectType}
                                  </span>
                                )}
                                {idx === 0 && (
                                  <span className="inline-block px-2 py-0.5 sm:py-1 bg-comic-yellow text-comic-black text-[10px] sm:text-xs font-comic font-bold rounded-full border border-comic-black">
                                    FOUNDING MEMBER
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full border-2 border-comic-black transition-all ${
                    index === currentIndex ? "bg-comic-yellow w-8" : "bg-comic-white"
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto px-4 py-16"
          >
            <div
              className="relative border-4 sm:border-6 border-comic-black rounded-3xl p-6 sm:p-8 md:p-12 bg-comic-white text-center"
              style={{
                boxShadow: "6px 6px 0 var(--comic-black)",
              }}
            >
              <div className="inline-block mb-6">
                <div className="bg-comic-yellow rounded-full p-6 border-4 border-comic-black inline-block">
                  <FaTrophy className="text-5xl text-comic-black" />
                </div>
              </div>

              <div className="mb-8">
                <h3 className="action-text text-2xl sm:text-4xl md:text-5xl text-comic-purple mb-4 sm:mb-6">
                  BE THE FIRST HERO!
                </h3>
                <p className="font-comic text-base sm:text-xl md:text-2xl text-comic-black mb-3 sm:mb-4">
                  No testimonials yet? <strong>This is your chance!</strong>
                </p>
                <p className="font-comic text-sm sm:text-lg text-comic-gray max-w-2xl mx-auto">
                  Be the legendary developer who starts our Hero League. Share your PRECAST success
                  story and inspire others to join the revolution!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 mb-6 sm:mb-10">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <FaTrophy className="text-lg sm:text-2xl text-comic-yellow" />
                  <span className="font-comic text-xs sm:text-sm font-bold text-comic-black">
                    First Hero Badge
                  </span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <FaStar className="text-lg sm:text-2xl text-comic-purple" />
                  <span className="font-comic text-xs sm:text-sm font-bold text-comic-black">
                    Featured Position
                  </span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <FaRocket className="text-lg sm:text-2xl text-comic-red" />
                  <span className="font-comic text-xs sm:text-sm font-bold text-comic-black">
                    Eternal Glory
                  </span>
                </div>
              </div>

              <motion.button
                onClick={() => navigate("/submit-testimonial")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-comic bg-comic-purple text-comic-white hover:bg-comic-darkPurple text-base sm:text-xl px-6 sm:px-10 py-3 sm:py-5 inline-flex items-center gap-2 sm:gap-3"
              >
                <FaRocket className="text-sm sm:text-base" />
                BE THE FIRST HERO
              </motion.button>
            </div>
          </motion.div>
        )}

        <div className="text-center mt-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {testimonials.length > 0 && (
              <motion.button
                onClick={() => navigate("/testimonials")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="action-text text-lg sm:text-2xl text-comic-red bg-comic-white px-4 sm:px-6 py-2 sm:py-3 rounded-full border-2 sm:border-4 border-comic-black inline-block cursor-pointer hover:bg-comic-yellow transition-colors"
              >
                VIEW ALL {testimonials.length} HEROES
              </motion.button>
            )}
            <motion.button
              onClick={() => navigate("/submit-testimonial")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="action-text text-xl sm:text-3xl text-comic-yellow bg-comic-black px-4 sm:px-6 py-2 sm:py-3 rounded-full border-2 sm:border-4 border-comic-yellow inline-block cursor-pointer hover:bg-comic-gray transition-colors"
            >
              JOIN THE HERO LEAGUE!
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
