import { ReactNode } from "react";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

/**
 * Main application layout - Brutalist design with grid pattern
 */
export function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      {/* Grid pattern background */}
      <div className="grid-background" />

      {/* Diagonal accent stripes */}
      <div className="layout-accent-top" />
      <div className="layout-accent-left" />

      <main className="main">{children}</main>

      <Footer />
    </div>
  );
}
