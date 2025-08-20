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
  FaLinkedin,
  FaDiscord,
  FaRocket,
  FaCode,
  FaQuestionCircle,
  FaEnvelope,
  FaBroadcastTower,
  FaGlobe,
} from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";
import { SiNpm } from "react-icons/si";

import { EMAILS, FEATURES } from "./constants";

/**
 * Navigation item configuration
 */
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
    dropdown: {
      items: [
        {
          label: "VISUAL BUILDER",
          icon: FaTerminal,
          href: "/builder",
        },
        {
          label: "STACK SURVEY",
          icon: FaQuestionCircle,
          href: "/survey",
        },
      ],
    },
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
          label: "OUR PROJECTS",
          icon: FaRocket,
          href: "/projects",
        },
        {
          label: "ROADMAP",
          icon: FaChartLine,
          href: "/roadmap",
        },
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
        // Design System - Currently under development
        ...(FEATURES.DESIGN_SYSTEM_ENABLED
          ? [
              {
                label: "DESIGN SYSTEM",
                icon: FaCode,
                href: "/design-system",
              },
            ]
          : []),
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

/**
 * Footer section configuration
 */
export interface FooterSection {
  title: string;
  icon?: IconType;
  links: Array<{
    label: string;
    href: string;
    external?: boolean;
    icon?: IconType;
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
      { label: "Builder", href: "/builder", icon: FaRocket },
      { label: "Components", href: "/components", icon: FaCube },
      { label: "Docs", href: "/docs", icon: FaBook },
    ],
  },
  {
    title: "RESOURCES",
    links: [
      { label: "Getting Started", href: "/docs", icon: FaCode },
      { label: "Showcase", href: "/showcase", icon: FaStar },
      { label: "UI Library", href: "https://brutalist.precast.dev", external: true, icon: FaGlobe },
    ],
  },
  {
    title: "SUPPORT",
    links: [
      { label: "Contact", href: `mailto:${EMAILS.SUPPORT}`, icon: FaEnvelope },
      {
        label: "Discord Community",
        href: "https://discord.gg/4Wen9Pg3rG",
        external: true,
        icon: FaBroadcastTower,
      },
      { label: "FAQ", href: "/docs/faq", icon: FaQuestionCircle },
    ],
  },
];

/**
 * Social media link configuration
 */
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
    icon: SiNpm as IconType, // SiNpm has slightly different type
  },
  {
    name: "Twitter",
    href: "https://x.com/buungroup",
    icon: RiTwitterXFill as IconType,
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
