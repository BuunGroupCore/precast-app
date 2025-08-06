import React from "react";

interface CloudflareIconProps {
  className?: string;
}

export const CloudflareIcon: React.FC<CloudflareIconProps> = ({ className }) => {
  return (
    <img
      src="/icons/cloudflare-color.svg"
      alt="Cloudflare"
      className={className}
      style={{ width: "1em", height: "1em", display: "inline-block" }}
    />
  );
};
