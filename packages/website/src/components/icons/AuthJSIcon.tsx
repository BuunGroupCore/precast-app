import React from "react";

interface AuthJSIconProps {
  className?: string;
}

export const AuthJSIcon: React.FC<AuthJSIconProps> = ({ className }) => {
  return (
    <img
      src="/icons/authjs.webp"
      alt="Auth.js"
      className={className}
      style={{ width: "1em", height: "1em", display: "inline-block" }}
    />
  );
};
