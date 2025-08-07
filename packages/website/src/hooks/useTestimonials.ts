import { useState, useEffect } from "react";

import { DATA_URLS } from "@/config/constants";
import { testimonials as staticTestimonials, type Testimonial } from "@/config/testimonials";

/**
 * Hook to load testimonials from GitHub repository and merge with static ones.
 * Always falls back to static testimonials from config/testimonials.ts if GitHub fetch fails.
 */
export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(staticTestimonials);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTestimonials = async () => {
      // Start with static testimonials as the base
      const finalTestimonials = [...staticTestimonials];

      try {
        // Try to load additional testimonials from GitHub repository with cache-busting
        const response = await fetch(`${DATA_URLS.TESTIMONIALS_JSON}?t=${Date.now()}`);

        if (response.ok) {
          const dynamicTestimonials = await response.json();

          if (Array.isArray(dynamicTestimonials) && dynamicTestimonials.length > 0) {
            // Merge dynamic testimonials with static ones, avoiding duplicates
            const existingIds = new Set(staticTestimonials.map((t) => t.id));

            for (const testimonial of dynamicTestimonials) {
              if (testimonial && testimonial.id && !existingIds.has(testimonial.id)) {
                finalTestimonials.push(testimonial);
              }
            }
          }
        }
        // Note: If response is not ok (404, etc.), we silently use static testimonials
      } catch (err) {
        // Network error, parsing error, etc. - fall back to static testimonials
        console.warn(
          "Failed to load testimonials from GitHub, falling back to static testimonials",
          err
        );
        setError(err instanceof Error ? err.message : "Failed to load dynamic testimonials");
      } finally {
        // Always set testimonials (either merged or just static) and mark as loaded
        setTestimonials(finalTestimonials);
        setIsLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  return { testimonials, isLoading, error };
}
