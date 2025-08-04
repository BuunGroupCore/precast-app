import React from "react";

interface PublicIconProps {
  name: string;
  className?: string;
}

export const PublicIcon: React.FC<PublicIconProps> = ({ name, className = "" }) => {
  return <img src={`/icons/${name}.svg`} alt={name} className={`w-6 h-6 ${className}`} />;
};
