import React from "react";

interface BrutalityUIIconProps {
  className?: string;
}

export const BrutalityUIIcon: React.FC<BrutalityUIIconProps> = ({ className }) => (
  <img src="/icons/precast.png" alt="Brutality UI" className={`w-6 h-6 ${className || ""}`} />
);
