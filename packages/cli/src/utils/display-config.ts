import { log } from "@clack/prompts";
import pc from "picocolors";
import type { ProjectConfig } from "../../../shared/stack-config.js";

export function displayConfigSummary(config: ProjectConfig): void {
  log.message("");
  log.message(pc.bold("📋 Configuration Summary:"));
  log.message("");
  
  const items = [
    { label: "Project", value: config.name, color: pc.cyan },
    { label: "Framework", value: config.framework, color: pc.green },
    { label: "Backend", value: config.backend, color: pc.yellow },
    { label: "Database", value: config.database, color: pc.blue },
    { label: "ORM", value: config.orm, color: pc.magenta },
    { label: "Styling", value: config.styling, color: pc.cyan },
    { label: "TypeScript", value: config.typescript ? "✓" : "✗", color: config.typescript ? pc.green : pc.red },
    { label: "Git", value: config.git ? "✓" : "✗", color: config.git ? pc.green : pc.red },
    { label: "Docker", value: config.docker ? "✓" : "✗", color: config.docker ? pc.green : pc.red },
  ];
  
  const maxLabelLength = Math.max(...items.map(item => item.label.length));
  
  items.forEach(({ label, value, color }) => {
    const paddedLabel = label.padEnd(maxLabelLength);
    log.message(`  ${pc.gray(paddedLabel)} ${color(value)}`);
  });
  
  log.message("");
}

export function displayConfig(config: Partial<ProjectConfig>): string {
  const entries = Object.entries(config)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => {
      const displayValue = typeof value === "boolean" 
        ? (value ? pc.green("✓") : pc.red("✗"))
        : pc.cyan(String(value));
      return `${pc.gray(key)}: ${displayValue}`;
    });
  
  return entries.join(", ");
}