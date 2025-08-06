import React from "react";

interface DaisyUIIconProps {
  className?: string;
}

export const DaisyUIIcon: React.FC<DaisyUIIconProps> = ({ className }) => {
  return (
    <img
      src="/icons/daisyui.svg"
      alt="DaisyUI"
      className={className}
      style={{ width: "1em", height: "1em", display: "inline-block" }}
    />
  );
};
