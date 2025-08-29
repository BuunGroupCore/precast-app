# test-mcp2 - AI Assistant Context

## Project Overview

This is a Frontend: react, Styling: tailwind project created with Precast CLI.

## Project Structure

Single react frontend application

## Technology Stack

Frontend: react, Styling: tailwind

- **Language**: TypeScript
- **Package Manager**: bun
- **Runtime**: bun

## Key Commands

- `dev`: bun run dev
- `build`: bun run build

## Styling

This project uses Tailwind CSS for styling. The configuration file is `tailwind.config.ts`.

## Development Guidelines

1. **Code Style**: ESLint is configured for code linting. Prettier is configured for code formatting.
2. **Type Safety**: TypeScript is configured for type checking. Run `bun run type-check` to check types.
3. **Testing**:

## MCP Servers

This project is configured with the following MCP (Model Context Protocol) servers:

- **context7**: Configure the required environment variables in `.env`
- **consult7**: Configure the required environment variables in `.env`

After configuring the environment variables, restart Claude Code to enable the MCP servers.

## Environment Variables

Key environment variables are defined in `.env.local` (not committed to git).
Example variables are provided in `.env.example`.

## Getting Started

1. Install dependencies: `bun install`
2. Start the development server: `bun run dev`

## Important Notes

- Always check `.env.example` for required environment variables
- Never commit sensitive data or credentials
- Follow the existing code patterns and conventions
- Use TypeScript types for better code quality

## AI Assistant Instructions

When working with this codebase:

1. **Maintain consistency** with existing code patterns and styles
2. **Test changes** before committing
3. **Update types** when modifying data structures (TypeScript)
4. **Follow security best practices** - never expose secrets or credentials
5. **Respect the project structure** - place files in appropriate directories

Remember: The goal is to maintain clean, efficient, and maintainable code.
