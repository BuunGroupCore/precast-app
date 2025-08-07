import { FaRocket, FaStar, FaBolt, FaHeart, FaFire } from "react-icons/fa";

import {
  HeroSection,
  CommunitySection,
  SponsorsSection,
  TechStackSection,
  TestimonialsSection,
  CTASection,
  ComicPageSeparator,
} from "@/components/home";
import { HomePageSEO } from "@/features/common";

/**
 * Home page component that combines all the modular sections.
 * Uses separate components for better organization and maintainability.
 */
export function HomePage() {
  return (
    <div className="overflow-hidden">
      <HomePageSEO />
      <div id="hero">
        <HeroSection />
      </div>

      <ComicPageSeparator
        topColor="transparent"
        bottomColor="var(--comic-purple)"
        text="MEANWHILE..."
        icon={<FaRocket />}
        pageNumber={1}
        textBgColor="var(--comic-yellow)"
        textColor="var(--comic-white)"
        nextSectionId="community"
      />

      <div id="community">
        <CommunitySection />
      </div>

      <ComicPageSeparator
        topColor="var(--comic-purple)"
        bottomColor="var(--comic-gray)"
        text="SPONSOR POWER!"
        icon={<FaHeart />}
        pageNumber={2}
        textBgColor="var(--comic-red)"
        textColor="var(--comic-white)"
        nextSectionId="sponsors"
      />

      <div id="sponsors">
        <SponsorsSection />
      </div>

      <ComicPageSeparator
        topColor="var(--comic-gray)"
        bottomColor="var(--comic-blue)"
        text="GEAR UP!"
        icon={<FaBolt />}
        pageNumber={3}
        textBgColor="var(--comic-yellow)"
        textColor="var(--comic-white)"
        nextSectionId="tech-stack"
      />

      <div id="tech-stack">
        <TechStackSection />
      </div>

      <ComicPageSeparator
        topColor="var(--comic-blue)"
        bottomColor="var(--comic-purple)"
        text="HEROES SPEAK!"
        icon={<FaStar />}
        pageNumber={4}
        textBgColor="var(--comic-blue)"
        textColor="var(--comic-white)"
        nextSectionId="testimonials"
      />

      <div id="testimonials">
        <TestimonialsSection />
      </div>

      <ComicPageSeparator
        topColor="var(--comic-purple)"
        bottomColor="var(--comic-red)"
        text="FINAL MISSION!"
        icon={<FaFire />}
        pageNumber={5}
        textBgColor="var(--comic-purple)"
        textColor="var(--comic-white)"
        nextSectionId="cta"
      />

      <div id="cta">
        <CTASection />
      </div>
    </div>
  );
}
