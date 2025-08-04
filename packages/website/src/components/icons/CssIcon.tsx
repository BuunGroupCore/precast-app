import React from "react";

export const CssIcon: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <img
      src="/icons/css.svg"
      alt="CSS"
      className={className}
      style={{ width: "1em", height: "1em" }}
    />
  );
};
