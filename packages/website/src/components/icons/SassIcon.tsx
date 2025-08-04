import React from "react";

export const SassIcon: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <img
      src="/icons/sass.svg"
      alt="Sass"
      className={className}
      style={{ width: "1em", height: "1em" }}
    />
  );
};
