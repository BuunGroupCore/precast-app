import { RoadmapSection } from "@/components/roadmap";
import { RoadmapPageSEO } from "@/features/common";

/**
 * Roadmap page displaying future support for disabled tools and frameworks
 */
export function RoadmapPage() {
  return (
    <>
      <RoadmapPageSEO />
      <RoadmapSection />
    </>
  );
}
