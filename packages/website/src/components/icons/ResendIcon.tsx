import React from "react";

interface ResendIconProps {
  className?: string;
}

export const ResendIcon: React.FC<ResendIconProps> = ({ className }) => (
  <img src="/icons/resend.svg" alt="Resend" className={className || ""} />
);
