import React from "react";

interface PublicIconProps {
  name: string;
  className?: string;
}

/**
 * Renders an icon from the public/icons directory with proper sizing and styling.
 * Automatically handles different file extensions and converts text-* classes to width/height.
 */
export const PublicIcon: React.FC<PublicIconProps> = ({ name, className = "" }) => {
  const getIconPath = (iconName: string) => {
    if (iconName === "precast") {
      return `/icons/${iconName}.png`;
    }
    return `/icons/${iconName}.svg`;
  };

  const sizeMatch = className.match(/text-(\w+)/);
  let sizeClasses = "w-6 h-6";

  if (sizeMatch) {
    const size = sizeMatch[1];
    switch (size) {
      case "xs":
        sizeClasses = "w-3 h-3";
        break;
      case "sm":
        sizeClasses = "w-4 h-4";
        break;
      case "base":
        sizeClasses = "w-4 h-4";
        break;
      case "lg":
        sizeClasses = "w-5 h-5";
        break;
      case "xl":
        sizeClasses = "w-6 h-6";
        break;
      case "2xl":
        sizeClasses = "w-8 h-8";
        break;
      case "3xl":
        sizeClasses = "w-10 h-10";
        break;
      default:
        sizeClasses = "w-6 h-6";
    }
  }

  const cleanedClassName = className.replace(/text-\w+/g, "").trim();

  return (
    <img src={getIconPath(name)} alt={name} className={`${sizeClasses} ${cleanedClassName}`} />
  );
};
