import React from "react";

interface CommandSyntaxHighlightProps {
  command: string;
}

export const CommandSyntaxHighlight: React.FC<CommandSyntaxHighlightProps> = ({ command }) => {
  const parseCommand = (cmd: string) => {
    const segments: JSX.Element[] = [];

    // Handle multi-word flags like --mcp-servers
    const parts: string[] = [];
    let current = "";
    let inMcpServers = false;

    for (let i = 0; i < cmd.length; i++) {
      const char = cmd[i];

      if (char === " " && !inMcpServers) {
        if (current) {
          parts.push(current);
          current = "";
        }
      } else {
        current += char;
        if (current === "--mcp-servers") {
          inMcpServers = true;
        } else if (inMcpServers && current.includes("--")) {
          // Found next flag, end mcp-servers
          const mcpEnd = current.lastIndexOf("--");
          parts.push(current.substring(0, mcpEnd - 1));
          current = current.substring(mcpEnd);
          inMcpServers = false;
        }
      }
    }
    if (current) parts.push(current);

    parts.forEach((part, index) => {
      const key = `${part}-${index}`;

      // Package managers (cyan)
      if (["npx", "npm", "yarn", "pnpm", "bun"].includes(part)) {
        segments.push(
          <span key={key} className="text-cyan-400 font-bold">
            {part}
          </span>
        );
      }
      // "create" keyword (white)
      else if (part === "create") {
        segments.push(
          <span key={key} className="text-comic-white">
            {part}
          </span>
        );
      }
      // Package name (yellow)
      else if (part.includes("precast-app")) {
        segments.push(
          <span key={key} className="text-yellow-400 font-bold">
            {part}
          </span>
        );
      }
      // Project name (green)
      else if (index === 2 && !part.startsWith("--")) {
        segments.push(
          <span key={key} className="text-green-400 font-bold">
            {part}
          </span>
        );
      }
      // Special handling for --mcp-servers
      else if (part.startsWith("--mcp-servers")) {
        const flagParts = part.split(" ");
        segments.push(
          <React.Fragment key={key}>
            <span className="text-purple-400">{flagParts[0]}</span>
            {flagParts.slice(1).map((server, i) => (
              <React.Fragment key={`${key}-server-${i}`}>
                <span> </span>
                <span className="text-blue-400">{server}</span>
              </React.Fragment>
            ))}
          </React.Fragment>
        );
      }
      // Flags with values (purple flag, blue value)
      else if (part.startsWith("--")) {
        const [flag, value] = part.split("=");
        if (value) {
          // Special coloring for certain values
          let valueColor = "text-blue-400";
          if (value === "none") valueColor = "text-gray-500";
          else if (["react", "vue", "angular", "svelte"].includes(value))
            valueColor = "text-green-400";
          else if (["express", "fastify", "nestjs", "hono"].includes(value))
            valueColor = "text-orange-400";
          else if (["postgres", "mysql", "mongodb"].includes(value)) valueColor = "text-cyan-400";

          segments.push(
            <React.Fragment key={key}>
              <span className="text-purple-400">{flag}</span>
              <span className="text-comic-white">=</span>
              <span className={valueColor}>{value}</span>
            </React.Fragment>
          );
        } else {
          segments.push(
            <span key={key} className="text-purple-400">
              {part}
            </span>
          );
        }
      }
      // Default (white)
      else {
        segments.push(
          <span key={key} className="text-comic-white">
            {part}
          </span>
        );
      }

      // Add space between parts (except last)
      if (index < parts.length - 1) {
        segments.push(<span key={`space-${index}`}> </span>);
      }
    });

    return segments;
  };

  return (
    <>
      {parseCommand(command)}
      <span className="animate-blink ml-1 inline-block w-1 h-3 bg-comic-white"></span>
    </>
  );
};
