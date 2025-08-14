# Precast CLI Quick Start Guide

## For New Developers

Welcome to the Precast CLI codebase! This guide will get you up and running quickly.

## 🚀 5-Minute Setup

```bash
# 1. Clone and setup
git clone https://github.com/BuunGroupCore/precast-app.git
cd precast-app
bun install

# 2. Build everything
bun run build

# 3. Navigate to CLI
cd packages/cli

# 4. Test the CLI
./dist/cli.js init test-project --framework react
```

## 📁 Key Files to Know

### Essential Files

- `src/cli.ts` - Main entry point
- `src/commands/init.ts` - Project creation logic
- `src/core/template-engine.ts` - Template processing
- `packages/shared/stack-config.ts` - Technology definitions

### Where Things Live

- **Commands**: `src/commands/` - CLI commands (init, deploy, generate)
- **Templates**: `src/templates/` - Handlebars templates
- **Generators**: `src/generators/` - Framework-specific logic
- **Utils**: `src/utils/` - Helper functions

## 🔧 Common Development Tasks

### Running the CLI Without Building

```bash
# Use tsx for instant execution (no build needed!)
npx tsx src/cli.ts init my-app --framework react

# Or use the dev script
bun run dev -- init my-app --framework vue
```

### Testing Your Changes

```bash
# Run all tests
bun test

# Run specific test
bun test template-engine

# Run with coverage
bun test --coverage
```

### Debugging

```bash
# Enable debug output
DEBUG=precast:* ./dist/cli.js init test-app

# Verbose mode
VERBOSE=true ./dist/cli.js init test-app
```

## 🎯 Common Modifications

### Adding a New Framework

1. **Create Generator** - `src/generators/[framework]-template.ts`

```typescript
export async function generateMyFrameworkTemplate(
  config: ProjectConfig,
  projectPath: string
): Promise<void> {
  // Your implementation
}
```

2. **Add Templates** - `src/templates/frameworks/[framework]/`

```
frameworks/myframework/
├── base/
│   ├── package.json.hbs
│   └── index.html.hbs
└── src/
    └── main.js.hbs
```

3. **Update Config** - `packages/shared/stack-config.ts`

```typescript
export const FRAMEWORKS = [
  // ... existing
  { id: "myframework", name: "My Framework" },
];
```

4. **Wire It Up** - `src/generators/index.ts`

```typescript
case "myframework":
  await generateMyFrameworkTemplate(config, projectPath);
  break;
```

### Adding a New CLI Option

1. **Add to Command** - `src/commands/init.ts`

```typescript
.option('--my-option <value>', 'Description')
```

2. **Add to Types** - `src/commands/init.ts`

```typescript
interface InitOptions {
  myOption?: string;
  // ... other options
}
```

3. **Use in Logic**

```typescript
if (options.myOption) {
  // Handle the option
}
```

## 📝 Template System

### Basic Template Example

```handlebars
{{! package.json.hbs }}
{ "name": "{{name}}",
{{#if typescript}}
  "scripts": { "build": "tsc" },
{{/if}}
"dependencies": {
{{#if (eq framework "react")}}
  "react": "^18.0.0"
{{/if}}
} }
```

### Available Helpers

- `{{#if condition}}` - Conditional rendering
- `{{#unless condition}}` - Negative conditional
- `{{#eq a b}}` - Equality check
- `{{#ne a b}}` - Not equal check
- `{{#ifAny ...}}` - Any condition true
- `{{#ifAll ...}}` - All conditions true
- `{{capitalize string}}` - Capitalize string
- `{{lowercase string}}` - Lowercase string

## 🧪 Testing Checklist

Before committing, test these common scenarios:

```bash
# 1. Basic React app
./dist/cli.js init test-react --framework react --typescript

# 2. Full-stack with database
./dist/cli.js init test-full \
  --framework next \
  --backend express \
  --database postgres \
  --orm prisma

# 3. With Docker
./dist/cli.js init test-docker \
  --framework vue \
  --docker \
  --database mysql

# 4. With authentication
./dist/cli.js init test-auth \
  --framework react \
  --auth better-auth
```

## 🐛 Common Issues & Solutions

### Issue: Template not found

```bash
Error: Template not found: frameworks/react/base
```

**Solution**: Check template path and ensure it exists in `src/templates/`

### Issue: Dependency installation fails

```bash
Error: Failed to install dependencies
```

**Solution**: CLI automatically falls back from Bun to npm. Check package compatibility.

### Issue: TypeScript errors

```bash
Error: Type 'X' is not assignable to type 'Y'
```

**Solution**: Run `bun run typecheck` to see all errors, fix types accordingly.

## 💡 Pro Tips

### Speed Up Development

1. **Use tsx for instant feedback** - No build needed!

```bash
npx tsx src/cli.ts init test --framework react
```

2. **Watch mode for continuous building**

```bash
bun run dev  # In one terminal
./dist/cli.js init test  # In another terminal
```

3. **Test templates without full generation**

```bash
# Just process a single template
npx tsx scripts/test-template.ts frameworks/react/base/package.json.hbs
```

### Debugging Like a Pro

1. **Use VS Code debugger**
   - Set breakpoints in TypeScript files
   - Press F5 to start debugging
   - Step through code execution

2. **Console debugging**

```typescript
import { logger } from "../utils/logger.js";
logger.debug("Variable value:", myVar);
```

3. **Check error collector**

```typescript
import { errorCollector } from "../utils/error-collector.js";
// Errors are collected and displayed at the end
```

## 📚 Essential Documentation

- **[Architecture](ARCHITECTURE.md)** - System design
- **[Developer Guide](DEVELOPER-GUIDE.md)** - Detailed workflows
- **[Contributing](../CONTRIBUTING.md)** - Contribution guidelines

## 🤝 Getting Help

- **GitHub Issues** - Report bugs
- **GitHub Discussions** - Ask questions
- **Code Comments** - Read inline docs
- **Existing Code** - Look for similar implementations

## 🎯 Next Steps

1. **Explore the codebase** - Start with `src/cli.ts`
2. **Make a small change** - Try adding a console log
3. **Run tests** - Ensure nothing breaks
4. **Create a PR** - Even small improvements help!

## 🚦 Quick Command Reference

```bash
# Development
bun run dev          # Watch mode
bun run build        # Build CLI
bun test            # Run tests
bun run lint        # Check code style
bun run typecheck   # Check types

# Testing the CLI
./dist/cli.js init [name]     # Create project
./dist/cli.js deploy          # Manage Docker
./dist/cli.js generate        # Generate ORM
./dist/cli.js status          # Project info

# Common flags
--framework react|vue|angular|next|...
--backend express|fastify|nestjs|...
--database postgres|mysql|mongodb|...
--typescript
--docker
--install
-y (skip prompts)
```

---

**Remember**: The best way to learn is by doing. Start small, ask questions, and have fun building! 🚀
