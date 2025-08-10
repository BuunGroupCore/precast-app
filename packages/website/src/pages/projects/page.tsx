import { ProjectsSection } from "@/components/projects";
import { ProjectsPageSEO } from "@/features/common";

/**
 * Our Projects page showcasing all Buun Group open source projects.
 */
export function ProjectsPage() {
  return (
    <>
      <ProjectsPageSEO />
      <ProjectsSection />
    </>
  );
}
