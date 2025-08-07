import { useState, useEffect } from "react";

import { testimonials as staticTestimonials, type Testimonial } from "@/config/testimonials";

/**
 * Hook to load testimonials dynamically.
 * Falls back to static testimonials if dynamic loading fails.
 */
export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(staticTestimonials);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        // Try to load dynamic testimonials
        const response = await fetch("/testimonials.json");
        if (response.ok) {
          const dynamicTestimonials = await response.json();
          // Merge static and dynamic testimonials, removing duplicates by ID
          const merged = [...staticTestimonials];
          const existingIds = new Set(staticTestimonials.map((t) => t.id));

          for (const testimonial of dynamicTestimonials) {
            if (!existingIds.has(testimonial.id)) {
              merged.push(testimonial);
            }
          }

          setTestimonials(merged);
        }
      } catch (err) {
        console.warn("Failed to load dynamic testimonials, using static ones", err);
        setError(err instanceof Error ? err.message : "Failed to load testimonials");
      } finally {
        setIsLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  return { testimonials, isLoading, error };
}
