import React from "react";

interface ClerkIconProps {
  className?: string;
}

export const ClerkIcon: React.FC<ClerkIconProps> = ({ className }) => (
  <img src="/icons/clerk.svg" alt="Clerk" className={`w-6 h-6 ${className || ""}`} />
);
