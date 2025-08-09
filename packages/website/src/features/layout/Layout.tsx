import { Header } from "@precast/ui";
import { ReactNode, useState, useEffect, useRef } from "react";
import { FaCog, FaBars, FaTimes } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

import { mainNavigation } from "@/config/navigation";
import { GitHubStars, NpmStats } from "@/features/stats";
import { SettingsDialog, ThemeSwitcher } from "@/features/theme";
import { preloadRoute, preloadCommonRoutes } from "@/utils/route-preloader";

import { BetaDisclaimer } from "./BetaDisclaimer";
import { Footer } from "./Footer";

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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    preloadCommonRoutes();
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false);
      }
    };
    if (showMobileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMobileMenu]);

  const navItems = mainNavigation.map((item) => ({
    ...item,
    onClick: () => navigate(item.href),
    onMouseEnter: () => preloadRoute(item.href),
    dropdown: item.dropdown
      ? {
          items: item.dropdown.items.map((dropdownItem) => ({
            ...dropdownItem,
            onClick: () => navigate(dropdownItem.href),
            onMouseEnter: () => preloadRoute(dropdownItem.href),
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
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {/* Desktop view - show all items */}
            <div className="hidden sm:flex items-center gap-2 sm:gap-3">
              <GitHubStars />
              <NpmStats />
            </div>

            {/* Always visible items */}
            <ThemeSwitcher />
            <button
              onClick={() => setShowSettings(true)}
              className="settings-cog p-2 bg-comic-yellow text-comic-black rounded-lg border-2 border-comic-black hover:bg-comic-orange transition-colors font-comic font-bold flex items-center justify-center"
              title="Settings"
            >
              <FaCog className="text-base sm:text-lg" />
            </button>

            {/* Mobile menu button */}
            <div className="sm:hidden relative" ref={mobileMenuRef}>
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 bg-comic-red text-comic-white rounded-lg border-2 border-comic-black hover:bg-comic-dark-red transition-colors flex items-center justify-center"
                title="Stats Menu"
              >
                {showMobileMenu ? (
                  <FaTimes className="text-base" />
                ) : (
                  <FaBars className="text-base" />
                )}
              </button>

              {/* Mobile dropdown menu */}
              {showMobileMenu && (
                <div className="absolute top-full right-0 mt-2 bg-comic-white border-3 border-comic-black rounded-lg comic-shadow z-50 min-w-[160px]">
                  <div className="p-3 space-y-2">
                    <div className="pb-2 border-b-2 border-comic-black">
                      <GitHubStars />
                    </div>
                    <div className="pt-2">
                      <NpmStats />
                    </div>
                  </div>
                </div>
              )}
            </div>
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

      {/* Beta Disclaimer */}
      <BetaDisclaimer />
    </div>
  );
}
