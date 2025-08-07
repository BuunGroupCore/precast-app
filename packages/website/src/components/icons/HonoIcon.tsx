import React from "react";

interface HonoIconProps {
  className?: string;
}

export const HonoIcon: React.FC<HonoIconProps> = ({ className }) => {
  return (
    <img
      src="/icons/hono.svg"
      alt="Hono"
      className={className}
      style={{
        width: "1em",
        height: "1em",
        display: "inline-block",
        filter: "brightness(0) invert(1)",
      }}
    />
  );
};
