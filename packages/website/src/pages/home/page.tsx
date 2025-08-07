import {
  HeroSection,
  CommunitySection,
  SponsorsSection,
  TechStackSection,
  CTASection,
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
      <HeroSection />
      <CommunitySection />
      <SponsorsSection />
      <TechStackSection />
      <CTASection />
    </div>
  );
}
