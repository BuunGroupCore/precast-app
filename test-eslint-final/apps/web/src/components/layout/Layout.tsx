import { ReactNode } from "react";

import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

/**
 * Main application layout component
 */
export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
