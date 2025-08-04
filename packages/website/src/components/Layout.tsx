import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header } from "@precast/ui";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { Footer } from "./Footer";
import { FaHome, FaTerminal, FaCube, FaBook } from "react-icons/fa";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

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
      href: "/components",
      label: "COMPONENTS",
      icon: FaCube,
      color: "var(--comic-green)",
      effect: "BOOM!",
      onClick: () => navigate("/components"),
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
        rightContent={<ThemeSwitcher />}
      />
      {/* Consistent padding for all pages to account for fixed header */}
      <div className={`pt-32 min-h-screen flex flex-col ${isDocsPage ? "" : ""}`}>
        <div className="flex-grow">
          {children}
        </div>
        {!isDocsPage && <Footer />}
      </div>
    </div>
  );
}