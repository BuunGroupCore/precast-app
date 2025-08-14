import { Skeleton } from "./SkeletonLoader";

/**
 * Pre-built skeleton components for common use cases
 */
export const SkeletonComponents = {
  /**
   * Skeleton for text lines with optional line count
   */
  Text: ({ lines = 3, className = "" }: { lines?: number; className?: string }) => (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} variant="text" width={i === lines - 1 ? "75%" : "100%"} className="h-4" />
      ))}
    </div>
  ),

  /**
   * Skeleton for user avatar
   */
  Avatar: ({ size = "md", className = "" }: { size?: "sm" | "md" | "lg"; className?: string }) => {
    const sizes = {
      sm: "w-8 h-8",
      md: "w-12 h-12",
      lg: "w-16 h-16",
    };
    return <Skeleton variant="circular" className={`${sizes[size]} ${className}`} />;
  },

  /**
   * Skeleton for card component
   */
  Card: ({ className = "" }: { className?: string }) => (
    <div className={`comic-panel p-4 ${className}`}>
      <Skeleton variant="text" className="h-6 mb-4" width="60%" />
      <Skeleton variant="text" className="h-4 mb-2" />
      <Skeleton variant="text" className="h-4 mb-2" />
      <Skeleton variant="text" className="h-4" width="80%" />
    </div>
  ),

  /**
   * Skeleton for button
   */
  Button: ({ size = "md", className = "" }: { size?: "sm" | "md" | "lg"; className?: string }) => {
    const sizes = {
      sm: "w-20 h-8",
      md: "w-24 h-10",
      lg: "w-32 h-12",
    };
    return <Skeleton variant="rounded" className={`${sizes[size]} ${className}`} />;
  },

  /**
   * Skeleton for image/media
   */
  Media: ({
    aspectRatio = "16/9",
    className = "",
  }: {
    aspectRatio?: string;
    className?: string;
  }) => (
    <Skeleton
      variant="rectangular"
      className={`w-full ${className}`}
      width="100%"
      height={aspectRatio === "16/9" ? "56.25%" : aspectRatio === "4/3" ? "75%" : "100%"}
    />
  ),

  /**
   * Skeleton for list items
   */
  ListItem: ({
    showAvatar = true,
    className = "",
  }: {
    showAvatar?: boolean;
    className?: string;
  }) => (
    <div className={`flex items-center gap-4 p-2 ${className}`}>
      {showAvatar && <Skeleton variant="circular" className="w-10 h-10 flex-shrink-0" />}
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" className="h-4" width="70%" />
        <Skeleton variant="text" className="h-3" width="40%" />
      </div>
    </div>
  ),

  /**
   * Skeleton for data table
   */
  Table: ({
    rows = 5,
    cols = 4,
    className = "",
  }: {
    rows?: number;
    cols?: number;
    className?: string;
  }) => (
    <div className={`w-full ${className}`}>
      <div className="border-b-2 border-comic-black pb-2 mb-2">
        <div className="grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} variant="text" className="h-5 mx-2" />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid py-2"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={colIndex} variant="text" className="h-4 mx-2" />
          ))}
        </div>
      ))}
    </div>
  ),

  /**
   * Skeleton for navigation menu
   */
  Navigation: ({ items = 5, className = "" }: { items?: number; className?: string }) => (
    <nav className={`flex gap-4 ${className}`}>
      {Array.from({ length: items }).map((_, i) => (
        <Skeleton key={i} variant="rounded" className="w-20 h-8" />
      ))}
    </nav>
  ),

  /**
   * Skeleton for form fields
   */
  FormField: ({ label = true, className = "" }: { label?: boolean; className?: string }) => (
    <div className={`space-y-2 ${className}`}>
      {label && <Skeleton variant="text" className="h-4" width="30%" />}
      <Skeleton variant="rounded" className="h-10 w-full" />
    </div>
  ),

  /**
   * Skeleton for stats/metrics card
   */
  Stat: ({ className = "" }: { className?: string }) => (
    <div className={`comic-panel p-4 text-center ${className}`}>
      <Skeleton variant="text" className="h-4 mb-2 mx-auto" width="60%" />
      <Skeleton variant="text" className="h-8 mx-auto" width="40%" />
    </div>
  ),

  /**
   * Skeleton for metric/stat cards
   */
  MetricCard: ({ className = "" }: { className?: string }) => (
    <div className={`comic-panel p-6 space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <Skeleton variant="text" className="h-4 w-20" />
        <Skeleton variant="circular" className="w-6 h-6" />
      </div>
      <Skeleton variant="text" className="h-8 w-16" />
      <Skeleton variant="text" className="h-3 w-32" />
    </div>
  ),

  /**
   * Skeleton for chart components
   */
  Chart: ({ className = "" }: { className?: string }) => (
    <div className={`comic-panel p-4 space-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <Skeleton variant="text" className="h-6 w-32" />
        <Skeleton variant="rounded" className="h-8 w-24" />
      </div>
      <Skeleton variant="rectangular" className="h-64 w-full" />
    </div>
  ),

  /**
   * Skeleton for table rows
   */
  TableRow: ({ columns = 4, className = "" }: { columns?: number; className?: string }) => (
    <tr className={className}>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="p-3">
          <Skeleton variant="text" className="h-4" />
        </td>
      ))}
    </tr>
  ),
};
