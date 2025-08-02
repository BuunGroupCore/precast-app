export interface IconProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Icon({ name, size = "md", className }: IconProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <span className={`inline-block ${sizeClasses[size]} ${className || ""}`}>
      {/* Icon implementation placeholder */}
      <svg viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10" />
      </svg>
    </span>
  );
}
