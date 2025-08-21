# @test-stripe/shared

Shared utilities, types, and constants for the test-stripe monorepo.

## What's Inside

This package contains code that is shared between the frontend and backend applications:

- **Types**: TypeScript types and interfaces used across apps
- **Constants**: Shared configuration values and constants
- **Utils**: Common utility functions
- **Schemas**: Validation schemas for data models

## Usage

Import from this package in your apps:

```typescript
import { User, ApiResponse, formatDate } from "@test-stripe/shared";
```

## Development

### Building

```bash
bun run build
```

### Development Mode

Watch for changes and rebuild automatically:

```bash
bun run dev
```

### Type Checking

```bash
bun run type-check
```

### Linting

```bash
bun run lint
```

## Adding New Exports

1. Add your code to the appropriate directory in `src/`
2. Export it from the relevant index file
3. Run `bun run build` to compile
4. Import it in your apps

## Structure

```
src/
├── types/       # Shared TypeScript types
├── constants.ts # Shared constants
├── utils/       # Utility functions
├── schemas/     # Validation schemas
└── index.ts     # Main export file
```
