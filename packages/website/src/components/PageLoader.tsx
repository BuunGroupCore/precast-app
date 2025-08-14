import { LoadingSpinner } from "@/components/ui";

/**
 * Loading component displayed while lazy-loaded pages are being fetched.
 * Now uses the unified loading system with proper accessibility.
 */
export function PageLoader() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-comic-dots"
      role="status"
      aria-live="polite"
      aria-label="Loading page content"
    >
      <div className="text-center comic-panel bg-comic-white p-8 rounded-lg shadow-lg">
        <LoadingSpinner
          size="lg"
          variant="spinner"
          color="purple"
          message="Loading awesome content..."
          aria-label="Loading page content"
        />

        <div className="mt-4 flex items-center justify-center space-x-2">
          <span className="text-2xl font-bold text-comic-purple">PRECAST</span>
          <div className="w-2 h-2 bg-comic-purple rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
