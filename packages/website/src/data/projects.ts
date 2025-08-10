/**
 * Project data structure for all projects
 */
export interface Project {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  image: string;
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  status: string;
  categories: string[];
  stars?: number; // Optional GitHub stars count
}

/**
 * Collection of all projects
 */
export const projects: Project[] = [
  {
    id: 1,
    title: "Starfighters",
    description:
      "An interactive space shooter game, using client side rendering to shoot and play the game and compete on a leaderboard and reduce enemy forces.",
    longDescription: "",
    technologies: [
      "React",
      "Next.js",
      "TypeScript",
      "Javascript",
      "TailwindCSS",
      "Shadcn UI",
      "Supabase",
    ],
    image: "https://sacha.roussakis-notter.com/projects/starfighters.png",
    githubUrl: "",
    liveUrl: "https://starfighters.co",
    featured: true,
    status: "Production",
    categories: ["Web Applications", "Game"],
  },
  {
    id: 2,
    title: "Buun Group",
    description: "A website for Buun Group, a company that provides web development services.",
    longDescription: "A website for Buun Group, a company that provides web development services.",
    technologies: ["Next.js", "TypeScript", "TailwindCSS", "Shadcn UI", "Supabase"],
    image: "https://sacha.roussakis-notter.com/projects/buungroup.png",
    githubUrl: "",
    liveUrl: "https://buungroup.com",
    featured: true,
    status: "Production",
    categories: ["Web Applications", "Productivity"],
  },
  {
    id: 3,
    title: "Interparcel API Client",
    description: "A TypeScript-based Node.js client for interacting with the Interparcel API.",
    longDescription:
      "A client for the Interparcel API, a RESTful API for managing parcels and shipments. Supports quoting, shipment creation, and parcel tracking.",
    technologies: [
      "Node.js",
      "TypeScript",
      "GitHub Actions",
      "Make",
      "JavaScript",
      "Jest",
      "axios",
      "ts-jest",
    ],
    image: "https://sacha.roussakis-notter.com/projects/interparcel.png",
    githubUrl: "https://github.com/BuunGroup-Packages/npm-interparcel-api-client",
    liveUrl: "https://www.npmjs.com/package/@buun_group/interparcel-api-sdk",
    featured: true,
    status: "Production",
    categories: ["Web Applications", "Productivity", "Opensource", "NPM Packages"],
  },
  {
    id: 4,
    title: "Open Source Intelligence (OSINT) Tools",
    description: "A collection of tools for Open Source Intelligence (OSINT).",
    longDescription: "A collection of tools for Open Source Intelligence (OSINT).",
    technologies: [
      "Node.js",
      "TypeScript",
      "GitHub Actions",
      "Make",
      "JavaScript",
      "Jest",
      "axios",
      "ts-jest",
    ],
    image: "https://sacha.roussakis-notter.com/projects/dfw1n.png",
    githubUrl: "https://github.com/DFW1N/DFW1N-OSINT/tree/master",
    liveUrl: "https://dfw1n.github.io/DFW1N-OSINT/",
    featured: true,
    status: "Production",
    categories: ["Open Source Intelligence", "Opensource"],
  },
  {
    id: 5,
    title: "Piixels",
    description: "Free Online Pixel Art Generator",
    longDescription:
      "Create, edit, and download pixel art with custom palettes. All processing is done client-side, ensuring your images remain private. No uploads, no servers.",
    technologies: [
      "Dexie.js",
      "TypeScript",
      "Cloudflare",
      "React",
      "tailwindcss",
      "framer-motion",
      "React Router",
      "Vite.js",
      "JavaScript",
      "bun.js",
    ],
    image: "https://sacha.roussakis-notter.com/projects/piixels.png",
    githubUrl: "",
    liveUrl: "https://piixels.art",
    featured: true,
    status: "Production",
    categories: ["Web Applications"],
  },
  {
    id: 6,
    title: "Brutalist UI",
    description: "Bold, raw, and unapologetically powerful UI components for React applications.",
    longDescription:
      "A comprehensive React component library that embraces brutalist design principles. Features bold typography, stark contrasts, and functional-first design patterns that prioritize clarity and impact over decoration.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Storybook", "Vite", "npm"],
    image: "https://brutalist.precast.dev/logo.png",
    githubUrl: "https://github.com/BuunGroup-Packages/precast-brutalist-components",
    liveUrl: "https://brutalist.precast.dev",
    featured: true,
    status: "Production",
    categories: ["Web Applications", "Opensource", "NPM Packages"],
  },
];

export const projectCategories = [
  "All Missions",
  "Opensource",
  "NPM Packages",
  "Open Source Intelligence",
  "Web Applications",
];
