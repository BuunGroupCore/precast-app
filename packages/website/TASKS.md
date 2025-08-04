# TASKS: AI Assistance & UI Component Libraries Implementation

## Overview
This document outlines the implementation tasks for adding AI assistance integration and UI component library support to the Precast CLI tool. These features have been added to the UI builder interface and now need to be implemented in the backend CLI.

## Implementation Status
- ✅ UI Implementation: BuilderPage.tsx has been updated with AI assistance and UI library options
- ⏳ Backend Implementation: CLI needs to support `--ai` and `--ui` flags

## 1. AI Assistance Integration

### Task: Add AI Tool Support
The CLI should support the `--ai` flag to create project-level configuration files for different AI assistants.

#### Command Structure
```bash
create-precast-app myapp --framework react --ai claude
```

#### Supported AI Tools
1. **Claude Code** (`--ai claude`)
   - Create `.claude/` directory
   - Generate `.claude/project.json` with project metadata
   - Generate `.claude/instructions.md` with project-specific instructions
   
2. **GitHub Copilot** (`--ai copilot`)
   - Create `.github/` directory (if not exists)
   - Generate `.github/copilot-instructions.md` with coding guidelines
   
3. **Cursor** (`--ai cursor`)
   - Generate `.cursorrules` file in project root
   - Include framework-specific rules and conventions
   
4. **Gemini CLI** (`--ai gemini`)
   - Generate `gemini.md` in project root
   - Include project context and structure information

### Implementation Details

#### File: `/packages/cli/src/cli.ts`
- Add `--ai <tool>` option to commander
- Validate AI tool selection (claude, copilot, cursor, gemini)

#### File: `/packages/cli/src/generators/ai-config-generator.ts` (NEW)
```typescript
interface AIConfig {
  tool: 'claude' | 'copilot' | 'cursor' | 'gemini';
  projectPath: string;
  projectConfig: ProjectConfig;
}

export async function generateAIConfig(config: AIConfig): Promise<void> {
  switch (config.tool) {
    case 'claude':
      await generateClaudeConfig(config);
      break;
    case 'copilot':
      await generateCopilotConfig(config);
      break;
    case 'cursor':
      await generateCursorConfig(config);
      break;
    case 'gemini':
      await generateGeminiConfig(config);
      break;
  }
}
```

#### Configuration File Templates

**Claude Project JSON** (`.claude/project.json`):
```json
{
  "name": "{{projectName}}",
  "description": "{{description}}",
  "framework": "{{framework}}",
  "language": "{{language}}",
  "dependencies": {
    "frontend": ["{{frontendDeps}}"],
    "backend": ["{{backendDeps}}"],
    "database": ["{{databaseDeps}}"]
  },
  "conventions": {
    "styling": "{{styling}}",
    "testing": "{{testingFramework}}",
    "linting": "{{lintingRules}}"
  }
}
```

**Claude Instructions** (`.claude/instructions.md`):
```markdown
# Project Instructions for Claude

## Project Overview
This is a {{framework}} application built with Precast.

## Technology Stack
- Framework: {{framework}}
- Backend: {{backend}}
- Database: {{database}}
- Styling: {{styling}}
- TypeScript: {{typescript}}

## Coding Conventions
1. Follow {{framework}} best practices
2. Use {{styling}} for styling
3. Maintain consistent file structure
4. Write tests for new features

## Project Structure
```
{{projectStructure}}
```
```

**Copilot Instructions** (`.github/copilot-instructions.md`):
```markdown
# GitHub Copilot Instructions

## Project Context
- Framework: {{framework}}
- Language: {{language}}
- Build Tool: {{buildTool}}

## Coding Standards
1. Use functional components for React/Vue/Solid
2. Follow {{framework}} naming conventions
3. Implement proper error handling
4. Add JSDoc comments for public APIs

## Preferred Patterns
{{frameworkSpecificPatterns}}
```

**Cursor Rules** (`.cursorrules`):
```
# Cursor AI Rules for {{projectName}}

## Technology Stack
framework: {{framework}}
language: {{language}}
styling: {{styling}}
testing: {{testingFramework}}

## Code Style
- Use {{indentation}} for indentation
- Follow {{namingConvention}} naming convention
- Prefer {{componentStyle}} components

## Project Conventions
{{projectSpecificRules}}
```

**Gemini Config** (`gemini.md`):
```markdown
# Gemini AI Configuration

## Project: {{projectName}}

### Stack Overview
- **Frontend**: {{framework}}
- **Backend**: {{backend}}
- **Database**: {{database}}
- **Styling**: {{styling}}

### Key Dependencies
{{dependencies}}

### Project Goals
{{projectGoals}}

### Architecture Decisions
{{architectureNotes}}
```

## 2. UI Component Libraries Integration

### Task: Add UI Library Support
The CLI should support the `--ui` flag to install and configure UI component libraries.

#### Command Structure
```bash
create-precast-app myapp --framework react --ui shadcn
```

#### Supported UI Libraries

| Library | ID | Compatible Frameworks | Requirements |
|---------|----|--------------------|--------------|
| shadcn/ui | `shadcn` | react, next, remix, vite | tailwind |
| DaisyUI | `daisyui` | All (CSS-based) | tailwind |
| Brutalist UI | `brutalist` | react, next, remix | None |
| Material UI | `mui` | react, next, remix | None |
| Chakra UI | `chakra` | react, next, remix | None |
| Ant Design | `antd` | react, next, remix | None |
| Mantine | `mantine` | react, next, remix | None |

### Implementation Details

#### File: `/packages/cli/src/cli.ts`
- Add `--ui <library>` option to commander
- Validate UI library selection
- Check framework compatibility

#### File: `/packages/cli/src/generators/ui-library-generator.ts` (NEW)
```typescript
interface UILibraryConfig {
  library: string;
  framework: string;
  projectPath: string;
  packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun';
}

export async function installUILibrary(config: UILibraryConfig): Promise<void> {
  // Validate compatibility
  if (!isCompatible(config.library, config.framework)) {
    throw new Error(`${config.library} is not compatible with ${config.framework}`);
  }

  // Install dependencies
  await installDependencies(config);

  // Configure library
  await configureLibrary(config);

  // Add example components
  await addExampleComponents(config);
}
```

#### Library-Specific Configurations

**shadcn/ui Setup**:
1. Install dependencies: `tailwindcss`, `@radix-ui/*`, `class-variance-authority`
2. Initialize shadcn config: `components.json`
3. Setup CSS variables
4. Add example Button component

**DaisyUI Setup**:
1. Install `daisyui` as devDependency
2. Add to `tailwind.config.js` plugins
3. Add theme configuration
4. Create example themed component

**Material UI Setup**:
1. Install `@mui/material`, `@emotion/react`, `@emotion/styled`
2. Add theme provider to root
3. Create custom theme file
4. Add example MUI component

## 3. Integration with Existing CLI

### File Structure Updates
```
packages/cli/src/
├── generators/
│   ├── ai-config-generator.ts (NEW)
│   ├── ui-library-generator.ts (NEW)
│   └── ... (existing generators)
├── templates/
│   ├── ai-configs/
│   │   ├── claude/
│   │   ├── copilot/
│   │   ├── cursor/
│   │   └── gemini/
│   └── ui-components/
│       ├── shadcn/
│       ├── daisyui/
│       └── ... (other UI libraries)
```

### CLI Option Updates
```typescript
// In cli.ts
program
  .option('--ai <tool>', 'AI assistant configuration (claude, copilot, cursor, gemini)')
  .option('--ui <library>', 'UI component library (shadcn, daisyui, brutalist, mui, chakra, antd, mantine)')
  .option('--no-install', 'Skip automatic dependency installation')
  .option('--pm <manager>', 'Package manager to use (npm, pnpm, bun). Default: pnpm')
  .option('--deploy <method>', 'Deployment configuration (cloudflare-pages, azure-static, vercel, netlify, github-pages)');
```

### Project Generation Flow
1. Parse CLI arguments
2. Validate framework compatibility
3. Generate base project
4. If `--ai` flag: Generate AI configuration files
5. If `--ui` flag: Install and configure UI library
6. Run final setup (install deps, git init, etc.)

## 4. Testing Requirements

### Unit Tests
- Test AI config file generation for each tool
- Test UI library compatibility validation
- Test dependency installation mocking

### Integration Tests
- Test full project generation with AI configs
- Test project generation with UI libraries
- Test incompatible combinations handling

### E2E Tests
- Generate project with each AI tool option
- Generate project with each UI library
- Verify generated files and configurations

## 5. Documentation Updates

### README.md Updates
- Add AI assistance section with examples
- Add UI libraries section with compatibility matrix
- Update usage examples

### CLI Help Text
- Document `--ai` flag options
- Document `--ui` flag options
- Add examples in help output

## 6. Future Enhancements

### AI Assistance
- Add AI tool detection (check if user has tools installed)
- Generate framework-specific AI prompts
- Add custom instruction templates

### UI Libraries
- Add component scaffolding commands
- Support multiple UI libraries in one project
- Add theme customization during setup

## Implementation Priority

1. **High Priority**
   - Basic AI config file generation
   - Core UI library installation
   - Framework compatibility validation

2. **Medium Priority**
   - Advanced AI instructions based on project structure
   - UI library example components
   - Comprehensive error handling

3. **Low Priority**
   - AI tool detection
   - Custom theming options
   - Component scaffolding

## Notes for Backend Implementation

- Ensure all file operations are async
- Add proper error handling and user feedback
- Validate all inputs before processing
- Make features opt-in (don't force AI/UI on users)
- Maintain backward compatibility
- Add telemetry for feature usage (with user consent)

---

*This document should be used by the backend AI agent to implement the features designed in the UI.*