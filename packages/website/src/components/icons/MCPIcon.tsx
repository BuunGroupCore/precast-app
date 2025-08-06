import React from "react";

interface MCPIconProps {
  className?: string;
}

export const MCPIcon: React.FC<MCPIconProps> = ({ className }) => {
  return (
    <img
      src="/icons/mcp.svg"
      alt="MCP"
      className={className}
      style={{ width: "1em", height: "1em", display: "inline-block" }}
    />
  );
};
