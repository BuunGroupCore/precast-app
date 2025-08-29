import React from "react";

interface CommandSyntaxHighlightProps {
  command: string;
}

export const CommandSyntaxHighlight: React.FC<CommandSyntaxHighlightProps> = ({ command }) => {
  const parseCommand = (cmd: string) => {
    const segments: React.JSX.Element[] = [];

    // Simple space splitting since all flags now use = for values
    const parts = cmd.split(" ").filter((p) => p.length > 0);

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
