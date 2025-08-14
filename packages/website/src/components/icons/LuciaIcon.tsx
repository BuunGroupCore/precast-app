import React from "react";

interface LuciaIconProps {
  className?: string;
}

export const LuciaIcon: React.FC<LuciaIconProps> = ({ className }) => (
  <img src="/icons/lucia.svg" alt="Lucia" className={`w-6 h-6 ${className || ""}`} />
);
