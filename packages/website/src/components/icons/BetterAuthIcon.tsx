import React from "react";

interface BetterAuthIconProps {
  className?: string;
}

export const BetterAuthIcon: React.FC<BetterAuthIconProps> = ({ className }) => (
  <img src="/icons/betterauth.svg" alt="Better Auth" className={`w-6 h-6 ${className || ""}`} />
);
