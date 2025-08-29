import { ReactNode } from 'react';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Main application layout - Brutalist design with grid pattern
 */
export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white relative flex flex-col">
      {/* Grid pattern background */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, black, black 1px, transparent 1px, transparent 40px),
            repeating-linear-gradient(90deg, black, black 1px, transparent 1px, transparent 40px)
          `,
        }}
      />

      {/* Diagonal accent stripes */}
      <div className="fixed top-0 left-0 w-full h-2 bg-yellow-400 border-b-2 border-black z-10" />
      <div className="fixed top-0 left-0 w-2 h-full bg-yellow-400 border-r-2 border-black z-10" />

      <main className="relative z-0 flex-1 pt-8">{children}</main>

      <Footer />
    </div>
  );
}
