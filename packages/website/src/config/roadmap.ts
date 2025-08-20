import { IconType } from "react-icons";
import { FaClock, FaFlask, FaTools, FaMobile, FaCube } from "react-icons/fa";
import {
  SiAngular,
  SiNuxtdotjs,
  SiRemix,
  SiFastify,
  SiSupabase,
  SiFirebase,
  SiMui,
  SiChakraui,
  SiAntdesign,
  SiMantine,
  SiAuth0,
} from "react-icons/si";

// Import custom icons - these will need to be imported in the component
// We'll export the icon names as strings and map them in the component
export type CustomIconName =
  | "ClerkIcon"
  | "ConvexIcon"
  | "NeonIcon"
  | "PassportIcon"
  | "PlanetScaleIcon"
  | "TursoIcon";

/**
 * Category types for roadmap items
 */
export type RoadmapCategory =
  | "all"
  | "frameworks"
  | "backend"
  | "database"
  | "ui"
  | "auth"
  | "mobile";

/**
 * Status of roadmap items
 */
export type RoadmapStatus = "testing" | "coming-soon" | "planned";

/**
 * Roadmap item structure
 */
export interface RoadmapItem {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Brief description */
  description: string;
  /** Category for filtering */
  category: RoadmapCategory;
  /** Icon - either a React Icon or a custom icon name */
  icon: IconType | CustomIconName;
  /** Current development status */
  status: RoadmapStatus;
  /** Expected release quarter */
  expectedRelease?: string;
  /** Progress percentage (0-100) */
  progress?: number;
  /** Additional notes or updates */
  notes?: string;
  /** Color theme for the card */
  colorClass: string;
}

/**
 * Status badge configurations
 */
export const statusConfig = {
  testing: {
    label: "IN TESTING",
    icon: FaFlask,
    color: "bg-comic-yellow text-comic-black",
  },
  "coming-soon": {
    label: "COMING SOON",
    icon: FaClock,
    color: "bg-comic-blue text-comic-white",
  },
  planned: {
    label: "PLANNED",
    icon: FaTools,
    color: "bg-comic-gray text-comic-white",
  },
} as const;

/**
 * Collection of tools and frameworks currently being tested or planned
 */
export const roadmapItems: RoadmapItem[] = [
  // ==========================================
  // FRAMEWORKS
  // ==========================================
  {
    id: "angular",
    name: "Angular",
    description: "Platform for building mobile and desktop web applications with TypeScript",
    category: "frameworks",
    icon: SiAngular,
    status: "testing",
    expectedRelease: "Q3 2026",
    progress: 75,
    notes: "Template generation complete, testing CLI integration",
    colorClass: "bg-comic-red",
  },
  {
    id: "nuxt",
    name: "Nuxt",
    description: "The Intuitive Vue Framework with SSR and static site generation",
    category: "frameworks",
    icon: SiNuxtdotjs,
    status: "testing",
    expectedRelease: "Q3 2026",
    progress: 60,
    notes: "Working on module system integration",
    colorClass: "bg-comic-green",
  },
  {
    id: "remix",
    name: "Remix",
    description: "Build better websites with Remix's nested routing and data loading",
    category: "frameworks",
    icon: SiRemix,
    status: "testing",
    expectedRelease: "Q3 2026",
    progress: 80,
    notes: "Finalizing loader patterns and deployment configs",
    colorClass: "bg-comic-blue",
  },
  {
    id: "solid",
    name: "SolidJS",
    description: "Simple and performant reactivity for building user interfaces",
    category: "frameworks",
    icon: FaCube, // SolidJS icon placeholder
    status: "coming-soon",
    expectedRelease: "Q1 2026",
    progress: 40,
    notes: "Implementing fine-grained reactivity patterns",
    colorClass: "bg-comic-purple",
  },

  // ==========================================
  // BACKEND
  // ==========================================
  {
    id: "fastify",
    name: "Fastify",
    description: "Fast and low overhead web framework for Node.js",
    category: "backend",
    icon: SiFastify,
    status: "testing",
    expectedRelease: "Q3 2026",
    progress: 70,
    notes: "Optimizing plugin system and schema validation",
    colorClass: "bg-comic-yellow",
  },
  {
    id: "convex",
    name: "Convex",
    description: "Backend-as-a-Service with real-time sync and serverless functions",
    category: "backend",
    icon: "ConvexIcon",
    status: "planned",
    expectedRelease: "Q1 2026",
    progress: 20,
    notes: "Researching real-time sync patterns",
    colorClass: "bg-comic-orange",
  },

  // ==========================================
  // DATABASES
  // ==========================================
  {
    id: "supabase",
    name: "Supabase",
    description: "The open source Firebase alternative with PostgreSQL",
    category: "database",
    icon: SiSupabase,
    status: "testing",
    expectedRelease: "Q3 2026",
    progress: 85,
    notes: "Finalizing auth integration and real-time subscriptions",
    colorClass: "bg-comic-green",
  },
  {
    id: "firebase",
    name: "Firebase",
    description: "Google's mobile and web app development platform",
    category: "database",
    icon: SiFirebase,
    status: "coming-soon",
    expectedRelease: "Q1 2026",
    progress: 30,
    notes: "Working on Firestore rules generation",
    colorClass: "bg-comic-yellow",
  },
  {
    id: "neon",
    name: "Neon",
    description: "Serverless Postgres with branching and autoscaling",
    category: "database",
    icon: "NeonIcon",
    status: "testing",
    expectedRelease: "Q3 2026",
    progress: 65,
    notes: "Implementing branching workflows",
    colorClass: "bg-comic-blue",
  },
  {
    id: "turso",
    name: "Turso",
    description: "Edge-hosted distributed SQLite database",
    category: "database",
    icon: "TursoIcon",
    status: "coming-soon",
    expectedRelease: "Q1 2026",
    progress: 25,
    notes: "Exploring edge deployment patterns",
    colorClass: "bg-comic-purple",
  },
  {
    id: "planetscale",
    name: "PlanetScale",
    description: "Serverless MySQL platform with branching",
    category: "database",
    icon: "PlanetScaleIcon",
    status: "planned",
    expectedRelease: "Q2 2026",
    progress: 10,
    notes: "Planning schema migration strategies",
    colorClass: "bg-comic-red",
  },

  // ==========================================
  // UI LIBRARIES
  // ==========================================
  {
    id: "mui",
    name: "Material UI",
    description: "React components that implement Google's Material Design",
    category: "ui",
    icon: SiMui,
    status: "testing",
    expectedRelease: "Q3 2026",
    progress: 55,
    notes: "Creating theme configuration templates",
    colorClass: "bg-comic-blue",
  },
  {
    id: "chakra",
    name: "Chakra UI",
    description: "Modular and accessible component library for React",
    category: "ui",
    icon: SiChakraui,
    status: "coming-soon",
    expectedRelease: "Q1 2026",
    progress: 35,
    notes: "Building custom theme providers",
    colorClass: "bg-comic-green",
  },
  {
    id: "antd",
    name: "Ant Design",
    description: "Enterprise-class UI design language and React components",
    category: "ui",
    icon: SiAntdesign,
    status: "planned",
    expectedRelease: "Q1 2026",
    progress: 15,
    notes: "Researching enterprise patterns",
    colorClass: "bg-comic-red",
  },
  {
    id: "mantine",
    name: "Mantine",
    description: "Full-featured React components and hooks library",
    category: "ui",
    icon: SiMantine,
    status: "planned",
    expectedRelease: "Q2 2026",
    progress: 5,
    notes: "Planning component architecture",
    colorClass: "bg-comic-purple",
  },

  // ==========================================
  // AUTHENTICATION
  // ==========================================
  {
    id: "clerk",
    name: "Clerk",
    description: "Complete user management and authentication solution",
    category: "auth",
    icon: "ClerkIcon",
    status: "testing",
    expectedRelease: "Q3 2026",
    progress: 90,
    notes: "Polishing user management dashboard integration",
    colorClass: "bg-comic-blue",
  },
  {
    id: "auth0",
    name: "Auth0",
    description: "Identity platform for application builders",
    category: "auth",
    icon: SiAuth0,
    status: "coming-soon",
    expectedRelease: "Q1 2026",
    progress: 45,
    notes: "Implementing universal login flows",
    colorClass: "bg-comic-orange",
  },
  {
    id: "passport",
    name: "Passport.js",
    description: "Simple, unobtrusive authentication for Node.js",
    category: "auth",
    icon: "PassportIcon",
    status: "planned",
    expectedRelease: "Q2 2026",
    progress: 0,
    notes: "Planning strategy pattern implementation",
    colorClass: "bg-comic-green",
  },

  // ==========================================
  // MOBILE
  // ==========================================
  {
    id: "react-native",
    name: "React Native",
    description: "Build native mobile apps using React",
    category: "mobile",
    icon: FaMobile,
    status: "planned",
    expectedRelease: "Q2 2026",
    progress: 0,
    notes: "Researching Expo integration",
    colorClass: "bg-comic-blue",
  },
  {
    id: "capacitor",
    name: "Capacitor",
    description: "Cross-platform native runtime for web apps",
    category: "mobile",
    icon: FaMobile,
    status: "planned",
    expectedRelease: "Q3 2026",
    progress: 0,
    notes: "Planning plugin system",
    colorClass: "bg-comic-purple",
  },
];

/**
 * Get roadmap statistics
 */
export function getRoadmapStats() {
  const stats = {
    total: roadmapItems.length,
    testing: roadmapItems.filter((i) => i.status === "testing").length,
    comingSoon: roadmapItems.filter((i) => i.status === "coming-soon").length,
    planned: roadmapItems.filter((i) => i.status === "planned").length,
    byCategory: {
      frameworks: roadmapItems.filter((i) => i.category === "frameworks").length,
      backend: roadmapItems.filter((i) => i.category === "backend").length,
      database: roadmapItems.filter((i) => i.category === "database").length,
      ui: roadmapItems.filter((i) => i.category === "ui").length,
      auth: roadmapItems.filter((i) => i.category === "auth").length,
      mobile: roadmapItems.filter((i) => i.category === "mobile").length,
    },
  };
  return stats;
}

/**
 * Get items by status
 */
export function getItemsByStatus(status: RoadmapStatus) {
  return roadmapItems.filter((item) => item.status === status);
}

/**
 * Get items by category
 */
export function getItemsByCategory(category: RoadmapCategory) {
  if (category === "all") return roadmapItems;
  return roadmapItems.filter((item) => item.category === category);
}
