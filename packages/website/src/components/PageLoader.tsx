import { ComicLoadingAnimation } from "@/components/ui/ComicLoadingAnimation";
import { useEffect, useState, useMemo } from "react";

/**
 * Loading component displayed while lazy-loaded pages are being fetched.
 * Now uses the awesome new comic loading animations!
 */
export function PageLoader() {
  const variants = useMemo(
    () =>
      ["explosion", "superhero", "comic-burst", "pow-bam", "lightning", "speech-bubble"] as const,
    []
  );
  const [currentVariant, setCurrentVariant] = useState<(typeof variants)[number]>("explosion");

  useEffect(() => {
    // Randomly switch between variants for more fun
    const randomVariant = variants[Math.floor(Math.random() * variants.length)];
    setCurrentVariant(randomVariant);
  }, [variants]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-comic-yellow/10 via-comic-white to-comic-blue/10"
      role="status"
      aria-live="polite"
      aria-label="Loading page content"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      <div className="text-center comic-panel bg-comic-white p-12 rounded-2xl shadow-2xl border-4 border-comic-black">
        <ComicLoadingAnimation
          variant={currentVariant}
          size="lg"
          message="Loading awesome content..."
          aria-label="Loading page content"
        />

        <div className="mt-6 flex items-center justify-center space-x-2">
          <span className="text-3xl font-display text-comic-purple animate-pulse">PRECAST</span>
        </div>
      </div>
    </div>
  );
}
