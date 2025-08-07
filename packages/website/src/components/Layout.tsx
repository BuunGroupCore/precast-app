import { Header } from "@precast/ui";
import { ReactNode, useState } from "react";
import { FaCog } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

import { mainNavigation } from "../config/navigation";

import { Footer } from "./Footer";
import { GitHubStars } from "./GitHubStars";
import { NpmStats } from "./NpmStats";
import { SettingsDialog } from "./SettingsDialog";
import { ThemeSwitcher } from "./ThemeSwitcher";

interface LayoutProps {
  children: ReactNode;
}

/**
 * Main layout component that provides the header, footer, and navigation structure.
 * Wraps all pages with consistent navigation and theming.
 */
export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSettings, setShowSettings] = useState(false);

  // Transform navigation config to include onClick handlers
  const navItems = mainNavigation.map((item) => ({
    ...item,
    onClick: () => navigate(item.href),
    dropdown: item.dropdown
      ? {
          items: item.dropdown.items.map((dropdownItem) => ({
            ...dropdownItem,
            onClick: () => navigate(dropdownItem.href),
          })),
        }
      : undefined,
  }));

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
