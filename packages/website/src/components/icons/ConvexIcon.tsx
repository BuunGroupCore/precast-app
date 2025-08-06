import React from "react";

interface ConvexIconProps {
  className?: string;
}

export const ConvexIcon: React.FC<ConvexIconProps> = ({ className }) => {
  return (
    <img
      src="/icons/convex.svg"
      alt="Convex"
      className={className}
      style={{ width: "1em", height: "1em", display: "inline-block" }}
    />
  );
};
