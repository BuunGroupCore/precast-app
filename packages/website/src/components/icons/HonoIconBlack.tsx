import React from "react";

import { HonoIcon } from "./HonoIcon";

interface HonoIconBlackProps {
  className?: string;
}

export const HonoIconBlack: React.FC<HonoIconBlackProps> = ({ className }) => {
  return <HonoIcon className={className} variant="black" />;
};
