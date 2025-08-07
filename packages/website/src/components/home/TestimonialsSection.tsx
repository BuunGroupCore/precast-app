import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";

import { useTestimonials } from "@/hooks/useTestimonials";

/**
 * Testimonials section component displaying user reviews in a comic book style.
 * Features carousel navigation and highlighted testimonials.
 */
export function TestimonialsSection() {
  const { testimonials } = useTestimonials();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-advance testimonials every 5 seconds
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isPaused, testimonials.length]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar key={i} className={i < rating ? "text-comic-yellow" : "text-comic-gray"} size={16} />
    ));
  };

  return (
    <section className="py-20 px-4 relative" style={{ backgroundColor: "var(--comic-purple)" }}>
      {/* Background pattern */}
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
          <h2 className="action-text text-5xl md:text-7xl text-comic-yellow mb-12">
            HERO TESTIMONIALS
          </h2>
          <div className="relative max-w-3xl mx-auto">
            <div
              className="relative border-4 border-comic-black rounded-3xl p-8 bg-comic-white"
              style={{
                boxShadow: "6px 6px 0 var(--comic-black)",
              }}
            >
              {/* Speech bubble tail */}
              <div className="absolute -bottom-6 left-20 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-comic-black"></div>
              <div className="absolute -bottom-5 left-20 w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-white"></div>

              <p className="font-comic text-lg md:text-xl text-comic-black">
                Hear from the <strong className="text-comic-purple">AMAZING DEVELOPERS</strong>{" "}
                who&apos;ve joined our superhero league!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Carousel Container */}
        <div
          className="relative max-w-6xl mx-auto px-16 md:px-20"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-comic-yellow border-4 border-comic-black rounded-full p-3 shadow-lg"
            >
              <FaChevronLeft className="text-comic-black text-xl" />
            </motion.div>
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-comic-yellow border-4 border-comic-black rounded-full p-3 shadow-lg"
            >
              <FaChevronRight className="text-comic-black text-xl" />
            </motion.div>
          </button>

          {/* Testimonial Cards */}
          <div className="overflow-visible py-12">
            <motion.div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-8">
                  <div className="max-w-4xl mx-auto">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="relative"
                    >
                      {/* Comic effect for highlighted testimonials */}
                      {testimonial.highlighted && (
                        <div className="absolute -top-10 -right-10 z-10">
                          <div className="action-text text-2xl text-comic-white bg-comic-red px-4 py-2 rounded-full border-4 border-comic-black shadow-lg transform rotate-12">
                            WOW!
                          </div>
                        </div>
                      )}

                      <div
                        className="relative border-6 border-comic-black rounded-2xl p-8 md:p-12 bg-comic-white"
                        style={{
                          boxShadow: "8px 8px 0 var(--comic-black)",
                        }}
                      >
                        {/* Quote icon */}
                        <div className="absolute -top-4 -left-4 bg-comic-yellow rounded-full p-3 border-4 border-comic-black">
                          <FaQuoteLeft className="text-comic-black text-xl" />
                        </div>

                        {/* Content */}
                        <div className="mb-6">
                          <p className="font-comic text-lg md:text-xl text-comic-black leading-relaxed">
                            &quot;{testimonial.content}&quot;
                          </p>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-4">
                          {renderStars(testimonial.rating)}
                        </div>

                        {/* Author info */}
                        <div className="flex items-center gap-4">
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="w-16 h-16 rounded-full border-3 border-comic-black"
                          />
                          <div>
                            <h3 className="font-comic font-bold text-lg text-comic-black">
                              {testimonial.name}
                            </h3>
                            <p className="font-comic text-sm text-comic-gray">
                              {testimonial.role} at {testimonial.company}
                            </p>
                            {testimonial.projectType && (
                              <span className="inline-block mt-1 px-3 py-1 bg-comic-purple text-comic-white text-xs font-comic rounded-full">
                                {testimonial.projectType}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Dots indicator */}
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

        {/* Bottom decoration */}
        <div className="text-center mt-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <motion.a
              href="https://github.com/BuunGroupCore/precast-app/issues/new?template=testimonial.md"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="action-text text-3xl text-comic-yellow bg-comic-black px-6 py-3 rounded-full border-4 border-comic-yellow inline-block cursor-pointer hover:bg-comic-gray transition-colors"
            >
              JOIN THE HERO LEAGUE!
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
