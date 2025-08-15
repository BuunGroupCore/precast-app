import { select } from "@clack/prompts";
import type { ProjectConfig } from "@shared/stack-config.js";

/**
 * AI Assistant options available in the CLI
 */
export const AI_ASSISTANTS = [
  {
    value: "none",
    label: "None",
    hint: "No AI assistance",
  },
  {
    value: "claude",
    label: "Claude Code",
    hint: "AI pair programming with Claude - context-aware code assistance",
  },
  {
    value: "copilot",
    label: "GitHub Copilot",
    hint: "AI-powered code suggestions from GitHub and OpenAI",
  },
  {
    value: "cursor",
    label: "Cursor",
    hint: "AI-first code editor with deep codebase understanding",
  },
  {
    value: "gemini",
    label: "Gemini CLI",
    hint: "Google's AI assistant for code generation and analysis",
  },
];

/**
 * Prompt user to select an AI assistant
 * @param _config - Current project configuration
 * @returns Selected AI assistant ID
 */
export async function promptAIAssistant(_config: Partial<ProjectConfig>): Promise<string> {
  const result = await select({
    message: "Select AI assistant for development:",
    options: AI_ASSISTANTS,
    initialValue: "none",
  });

  if (typeof result === "string") {
    return result;
  }

  return "none";
}

/**
 * Check if an AI assistant ID is valid
 * @param aiAssistant - AI assistant ID to validate
 * @returns True if valid, false otherwise
 */
export function isValidAIAssistant(aiAssistant: string): boolean {
  return AI_ASSISTANTS.some((ai) => ai.value === aiAssistant);
}
