import React from "react";

interface PrismaIconProps {
  className?: string;
}

export const PrismaIcon: React.FC<PrismaIconProps> = ({ className }) => {
  return (
    <img
      src="/icons/prisma.svg"
      alt="Prisma"
      className={className}
      style={{ width: "1em", height: "1em", display: "inline-block" }}
    />
  );
};
