import {
  FaReact,
  FaVuejs,
  FaAngular,
  FaNodeJs,
  FaDatabase,
  FaPalette,
  FaCss3Alt,
  FaSass,
} from "react-icons/fa";
import {
  SiNextdotjs,
  SiNuxtdotjs,
  SiSvelte,
  SiRemix,
  SiAstro,
  SiVite,
  SiExpress,
  SiFastify,
  SiNestjs,
  SiPostgresql,
  SiMysql,
  SiSqlite,
  SiMongodb,
  SiPrisma,
  SiTailwindcss,
  SiStyledcomponents,
  SiChakraui,
  SiMui,
  SiAntdesign,
  SiMantine,
  SiJavascript,
  SiSupabase,
  SiCloudflare,
} from "react-icons/si";

// Framework icons
export const FRAMEWORK_ICONS: Record<
  string,
  React.ComponentType<{ className?: string; size?: number | string }>
> = {
  react: FaReact,
  vue: FaVuejs,
  angular: FaAngular,
  next: SiNextdotjs,
  "next.js": SiNextdotjs,
  nextjs: SiNextdotjs,
  nuxt: SiNuxtdotjs,
  svelte: SiSvelte,
  solid: FaReact, // SolidJS doesn't have a specific icon in react-icons, using React as fallback
  remix: SiRemix,
  astro: SiAstro,
  vite: SiVite,
  vanilla: SiJavascript,
};

// Backend icons
export const BACKEND_ICONS: Record<
  string,
  React.ComponentType<{ className?: string; size?: number | string }>
> = {
  express: SiExpress,
  fastify: SiFastify,
  nestjs: SiNestjs,
  nest: SiNestjs,
  hono: FaNodeJs, // Hono doesn't have an icon, use Node
  node: FaNodeJs,
  "cloudflare-workers": SiCloudflare,
  supabase: SiSupabase,
};

// Database icons
export const DATABASE_ICONS: Record<
  string,
  React.ComponentType<{ className?: string; size?: number | string }>
> = {
  postgres: SiPostgresql,
  postgresql: SiPostgresql,
  mysql: SiMysql,
  sqlite: SiSqlite,
  mongodb: SiMongodb,
  mongo: SiMongodb,
  supabase: SiSupabase,
};

// ORM icons
export const ORM_ICONS: Record<
  string,
  React.ComponentType<{ className?: string; size?: number | string }>
> = {
  prisma: SiPrisma,
  drizzle: FaDatabase, // Drizzle doesn't have a specific icon
  typeorm: FaDatabase,
  mongoose: SiMongodb,
};

// Styling icons
export const STYLING_ICONS: Record<
  string,
  React.ComponentType<{ className?: string; size?: number | string }>
> = {
  tailwind: SiTailwindcss,
  tailwindcss: SiTailwindcss,
  css: FaCss3Alt,
  scss: FaSass,
  sass: FaSass,
  "styled-components": SiStyledcomponents,
  emotion: FaPalette, // Emotion doesn't have a specific icon
  "css-modules": FaCss3Alt,
};

// UI Library icons
export const UI_LIBRARY_ICONS: Record<
  string,
  React.ComponentType<{ className?: string; size?: number | string }>
> = {
  shadcn: FaPalette, // shadcn doesn't have an icon
  "shadcn/ui": FaPalette,
  daisyui: FaPalette, // DaisyUI icon not in react-icons
  mui: SiMui,
  "material-ui": SiMui,
  chakra: SiChakraui,
  "chakra-ui": SiChakraui,
  antd: SiAntdesign,
  "ant-design": SiAntdesign,
  mantine: SiMantine,
};

// Utility function to get icon with fallback
export function getTechIcon(
  type: "framework" | "backend" | "database" | "orm" | "styling" | "ui",
  name: string
) {
  const iconMaps = {
    framework: FRAMEWORK_ICONS,
    backend: BACKEND_ICONS,
    database: DATABASE_ICONS,
    orm: ORM_ICONS,
    styling: STYLING_ICONS,
    ui: UI_LIBRARY_ICONS,
  };

  const iconMap = iconMaps[type];
  const normalizedName = name?.toLowerCase().replace(/\s+/g, "-");

  return iconMap[normalizedName] || null;
}
