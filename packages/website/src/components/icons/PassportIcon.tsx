import React from "react";

interface PassportIconProps {
  className?: string;
}

export const PassportIcon: React.FC<PassportIconProps> = ({ className }) => (
  <img src="/icons/passport.svg" alt="Passport.js" className={`w-6 h-6 ${className || ""}`} />
);
