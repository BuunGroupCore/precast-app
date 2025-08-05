import { Header } from "@precast/ui";
import { ReactNode, useState } from "react";
import {
  FaHome,
  FaTerminal,
  FaBook,
  FaStar,
  FaCube,
  FaHeart,
  FaFolderOpen,
  FaChartLine,
  FaCog,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

import { Footer } from "./Footer";
import { GitHubStars } from "./GitHubStars";
import { NpmStats } from "./NpmStats";
import { SettingsDialog } from "./SettingsDialog";
import { ThemeSwitcher } from "./ThemeSwitcher";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSettings, setShowSettings] = useState(false);

  const navItems = [
    {
      href: "/",
      label: "HOME",
      icon: FaHome,
      color: "var(--comic-red)",
      effect: "POW!",
      onClick: () => navigate("/"),
    },
    {
      href: "/builder",
      label: "BUILDER",
      icon: FaTerminal,
      color: "var(--comic-blue)",
      effect: "ZAP!",
      onClick: () => navigate("/builder"),
    },
    {
      label: "RESOURCES",
      icon: FaFolderOpen,
      color: "var(--comic-green)",
      effect: "BOOM!",
      dropdown: {
        items: [
          {
            label: "SHOWCASE",
            icon: FaStar,
            onClick: () => navigate("/showcase"),
          },
          {
            label: "COMPONENTS",
            icon: FaCube,
            onClick: () => navigate("/components"),
          },
          {
            label: "METRICS",
            icon: FaChartLine,
            onClick: () => navigate("/metrics"),
          },
          {
            label: "SUPPORT",
            icon: FaHeart,
            onClick: () => navigate("/support"),
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
      onClick: () => navigate("/docs"),
    },
  ];

  const isDocsPage = location.pathname.startsWith("/docs");

  return (
    <div className="min-h-screen comic-cursor">
      <Header
        logo="PRECAST"
        logoSrc="https://brutalist.precast.dev/logo.png"
        links={navItems}
        currentPath={location.pathname}
        onLogoClick={() => navigate("/")}
        rightContent={
          <div className="flex items-center gap-4">
            <GitHubStars />
            <NpmStats />
            <ThemeSwitcher />
            <button
              onClick={() => setShowSettings(true)}
              className="settings-cog p-2 bg-comic-yellow text-comic-black rounded-lg border-2 border-comic-black hover:bg-comic-orange transition-colors font-comic font-bold"
              title="Settings"
            >
              <FaCog className="text-lg" />
            </button>
          </div>
        }
      />
      {/* Consistent padding for all pages to account for fixed header */}
      <div className={`pt-32 min-h-screen flex flex-col ${isDocsPage ? "" : ""}`}>
        <div className="flex-grow">{children}</div>
        {!isDocsPage && <Footer />}
      </div>

      {/* Settings Dialog */}
      <SettingsDialog isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}
