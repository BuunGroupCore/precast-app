import React from "react";

interface HonoIconProps {
  className?: string;
  variant?: "white" | "black";
}

export const HonoIcon: React.FC<HonoIconProps> = ({ className, variant = "white" }) => {
  return (
    <img
      src="/icons/hono.svg"
      alt="Hono"
      className={className}
      style={{
        width: "1em",
        height: "1em",
        display: "inline-block",
        filter: variant === "white" ? "brightness(0) invert(1)" : "none",
      }}
    />
  );
};
