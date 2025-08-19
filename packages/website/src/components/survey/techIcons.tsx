import { IconType } from "react-icons";
import {
  FaReact,
  FaVuejs,
  FaAngular,
  FaNodeJs,
  FaDocker,
  FaAws,
  FaGitAlt,
  FaPalette,
  FaLock,
  FaTimes,
  FaDatabase,
} from "react-icons/fa";
import {
  SiNextdotjs,
  SiSvelte,
  SiExpress,
  SiFastify,
  SiNestjs,
  SiPostgresql,
  SiMongodb,
  SiMysql,
  SiTailwindcss,
  SiTypescript,
  SiJavascript,
  SiVercel,
  SiNetlify,
  SiStripe,
  SiClerk,
  SiBun,
  SiVite,
  SiRemix,
  SiSupabase,
  SiFirebase,
  SiKoa,
  SiAstro,
} from "react-icons/si";

import { HonoIcon } from "@/components/icons/HonoIcon";
import { AuthJSIcon } from "@/components/icons/AuthJSIcon";
import { DaisyUIIcon } from "@/components/icons/DaisyUIIcon";
import { PrismaIcon } from "@/components/icons/PrismaIcon";

export const techIcons: Record<string, IconType | React.FC<{ className?: string }>> = {
  // Frameworks
  react: FaReact,
  vue: FaVuejs,
  angular: FaAngular,
  svelte: SiSvelte,
  next: SiNextdotjs,
  "next.js": SiNextdotjs,
  remix: SiRemix,
  astro: SiAstro,
  vite: SiVite,
  "react-native": FaReact,
  "react-router": FaReact,
  "tanstack-router": FaReact,
  "tanstack-start": FaReact,

  // Backend
  node: FaNodeJs,
  express: SiExpress,
  fastify: SiFastify,
  nestjs: SiNestjs,
  hono: HonoIcon,
  "next-api": SiNextdotjs,
  koa: SiKoa,

  // Databases
  postgres: SiPostgresql,
  postgresql: SiPostgresql,
  mongodb: SiMongodb,
  mysql: SiMysql,
  supabase: SiSupabase,
  firebase: SiFirebase,

  // ORMs
  prisma: PrismaIcon,
  drizzle: FaDatabase,
  typeorm: FaDatabase,
  mongoose: SiMongodb,

  // Styling
  tailwind: SiTailwindcss,
  css: FaPalette,
  scss: FaPalette,
  "styled-components": FaPalette,

  // UI Libraries
  shadcn: SiTailwindcss,
  "shadcn/ui": SiTailwindcss,
  daisyui: DaisyUIIcon,
  brutalist: FaPalette,

  // Auth
  "better-auth": AuthJSIcon,
  clerk: SiClerk,
  "supabase-auth": SiSupabase,
  auth0: FaLock,
  "firebase-auth": SiFirebase,
  nextauth: AuthJSIcon,

  // Languages & Runtime
  typescript: SiTypescript,
  javascript: SiJavascript,
  bun: SiBun,

  // Deployment
  vercel: SiVercel,
  netlify: SiNetlify,
  aws: FaAws,
  docker: FaDocker,

  // Other
  git: FaGitAlt,
  stripe: SiStripe,
  none: FaTimes,
};

export function getTechIcon(tech: string): IconType | React.FC<{ className?: string }> {
  const normalizedTech = tech.toLowerCase().replace(/ /g, "-");
  return techIcons[normalizedTech] || FaPalette;
}
