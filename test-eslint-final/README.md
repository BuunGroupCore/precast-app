# test-eslint-final

A modern full-stack application built with react and express.

## Project Structure

```
test-eslint-final/
├── apps/
│   ├── web/          # Frontend (react)
│   └── api/          # Backend (express)
├── packages/
│   └── shared/       # Shared utilities and types
├── package.json      # Root workspace configuration
└── turbo.json        # Turborepo configuration
```

## Getting Started

1. Install dependencies:

   ```bash
   bun install
   ```

2. Start development servers:

   ```bash
   bun run dev
   ```

   This will start:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

## Available Scripts

- `bun run dev` - Start development servers
- `bun run build` - Build all applications
- `bun run start` - Start production servers
- `bun run lint` - Lint all packages
- `bun run type-check` - Type check all packages

## Tech Stack

### Frontend (apps/web)

- **Framework**: react
- **Styling**: tailwind

- **Language**: TypeScript

### Backend (apps/api)

- **Framework**: express
- **Database**: postgres
- **ORM**: drizzle
- **Language**: TypeScript

## Deployment

Each application can be deployed independently:

- **Frontend**: Deploy `apps/web` to Vercel, Netlify, or similar
- **Backend**: Deploy `apps/api` to Railway, Render, or similar

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

MIT
