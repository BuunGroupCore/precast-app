import React from "react";

interface TanStackIconProps {
  className?: string;
}

export const TanStackIcon: React.FC<TanStackIconProps> = ({ className }) => {
  return (
    <img
      src="/icons/tanstack.png"
      alt="TanStack"
      className={className}
      style={{ width: "1em", height: "1em", display: "inline-block" }}
    />
  );
};
