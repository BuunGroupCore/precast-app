import React from "react";

interface PublicIconProps {
  name: string;
  className?: string;
}

export const PublicIcon: React.FC<PublicIconProps> = ({ name, className = "" }) => {
  // Handle special cases for different file extensions
  const getIconPath = (iconName: string) => {
    if (iconName === "precast") {
      return `/icons/${iconName}.png`;
    }
    return `/icons/${iconName}.svg`;
  };

  return <img src={getIconPath(name)} alt={name} className={`w-6 h-6 ${className}`} />;
};
