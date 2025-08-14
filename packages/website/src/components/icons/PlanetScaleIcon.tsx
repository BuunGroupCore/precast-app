import React from "react";

interface PlanetScaleIconProps {
  className?: string;
}

export const PlanetScaleIcon: React.FC<PlanetScaleIconProps> = ({ className }) => (
  <img src="/icons/planetscale.svg" alt="PlanetScale" className={`w-6 h-6 ${className || ""}`} />
);
