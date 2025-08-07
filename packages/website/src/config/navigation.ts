import { IconType } from "react-icons";
import {
  FaHome,
  FaTerminal,
  FaBook,
  FaStar,
  FaCube,
  FaHeart,
  FaChartLine,
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaDiscord,
} from "react-icons/fa";
import { SiNpm } from "react-icons/si";

export interface NavItem {
  href: string;
  label: string;
  icon: IconType;
  color: string;
  effect?: string;
  dropdown?: {
    items: Array<{
      label: string;
      icon: IconType;
      href: string;
    }>;
  };
}

/**
 * Main navigation configuration for the application.
 * Centralized location for all navigation items and their properties.
 */
export const mainNavigation: NavItem[] = [
  {
    href: "/",
    label: "HOME",
    icon: FaHome,
    color: "var(--comic-red)",
    effect: "POW!",
  },
  {
    href: "/builder",
    label: "BUILDER",
    icon: FaTerminal,
    color: "var(--comic-blue)",
    effect: "ZAP!",
  },
  {
    href: "/resources",
    label: "RESOURCES",
    icon: FaStar,
    color: "var(--comic-green)",
    effect: "BOOM!",
    dropdown: {
      items: [
        {
          label: "SHOWCASE",
          icon: FaStar,
          href: "/showcase",
        },
        {
          label: "COMPONENTS",
          icon: FaCube,
          href: "/components",
        },
        {
          label: "METRICS",
          icon: FaChartLine,
          href: "/metrics",
        },
        {
          label: "SUPPORT",
          icon: FaHeart,
          href: "/support",
        },
      ],
    },
  },
  {
    href: "/docs",
    label: "DOCS",
    icon: FaBook,
    color: "var(--comic-purple)",
    effect: "WHOOSH!",
  },
];

export interface FooterSection {
  title: string;
  icon?: IconType;
  links: Array<{
    label: string;
    href: string;
    external?: boolean;
  }>;
}

/**
 * Footer navigation configuration.
 * Organized by sections for easy maintenance.
 */
export const footerNavigation: FooterSection[] = [
  {
    title: "QUICK ACCESS",
    links: [
      { label: "Builder", href: "/builder" },
      { label: "Components", href: "/components" },
      { label: "Documentation", href: "/docs" },
    ],
  },
  {
    title: "RESOURCES",
    links: [
      { label: "Getting Started", href: "/docs/getting-started" },
      { label: "GitHub", href: "https://github.com/BuunGroupCore/precast-app", external: true },
      { label: "API Reference", href: "/docs/api" },
      { label: "UI Library", href: "https://brutalist.precast.dev", external: true },
    ],
  },
  {
    title: "SUPPORT",
    links: [
      { label: "Contact", href: "mailto:support@precast.dev" },
      { label: "Discord Community", href: "https://discord.gg/4Wen9Pg3rG", external: true },
      { label: "FAQ", href: "/docs/faq" },
    ],
  },
];

export interface SocialLink {
  name: string;
  href: string;
  icon: IconType;
}

/**
 * Social media links configuration.
 */
export const socialLinks: SocialLink[] = [
  {
    name: "GitHub",
    href: "https://github.com/BuunGroupCore/precast-app",
    icon: FaGithub,
  },
  {
    name: "NPM",
    href: "https://www.npmjs.com/package/create-precast-app",
    icon: SiNpm as any as IconType, // SiNpm has slightly different type
  },
  {
    name: "Twitter",
    href: "https://x.com/buungroup",
    icon: FaTwitter,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/buun-group",
    icon: FaLinkedin,
  },
  {
    name: "Discord",
    href: "https://discord.gg/4Wen9Pg3rG",
    icon: FaDiscord,
  },
];
