# Telemetry Documentation

## Overview

The Precast CLI collects anonymous usage data to help improve the tool and understand how developers use it. This data is sent to PostHog, a privacy-focused product analytics platform used by major developer tools like BetterStack CLI, Supabase, and many open-source projects.

## What We Collect

### Project Creation (`project_created` event)

- Framework choice (React, Vue, Angular, TanStack Start, etc.)
- Backend selection (Express, Fastify, Hono, NestJS, etc.)
- Database type (PostgreSQL, MySQL, MongoDB, SQLite, etc.)
- ORM selection (Prisma, Drizzle, TypeORM, Mongoose, etc.)
- Styling solution (Tailwind CSS, CSS, SCSS, CSS Modules, etc.)
- UI library (shadcn/ui, DaisyUI, Material UI, Chakra UI, etc.)
- Authentication provider (Better Auth, NextAuth.js, Clerk, Supabase Auth, etc.)
- API client (TanStack Query, SWR, tRPC, Apollo Client, etc.)
- AI assistant configuration (Claude, Copilot, Cursor, Gemini, etc.)
- Runtime environment (Node.js, Bun, Deno)
- TypeScript usage (yes/no)
- Docker configuration (yes/no)
- Git initialization (yes/no)
- Code quality tools (ESLint, Prettier)
- PowerUps selected (Sentry, PostHog, Storybook, testing frameworks)
- MCP servers configured (for Claude AI integration)
- Color palette theme selected
- Project creation duration (milliseconds)
- Success status (true/false)
- Entry point (CLI vs website builder)
- Security audit results

### Project Completion (`project_completed` event)

- Same properties as `project_created` with final completion status
- Total setup time including all phases
- Retry count for any failed operations

### Dependency Installation (`dependencies_installed` event)

- Package manager used (bun, npm, yarn, pnpm)
- Installation duration (milliseconds)
- Number of packages installed
- Success status (true/false)
- **Installation context** (NEW):
  - `database` - Core database packages (postgres, drizzle-orm, etc.)
  - `database_dev` - Database development tools (drizzle-kit, @types/pg, etc.)
  - `icons` - Icon libraries for widgets (react-icons, lucide-react)
  - `auth` - Authentication packages (better-auth, @auth/core, etc.)
  - `auth_dev` - Auth development dependencies
  - `api_client` - API client libraries (tanstack-query, swr, etc.)
  - `api_client_dev` - API client dev dependencies
  - `ui_library` - UI component libraries (shadcn components, etc.)
  - `powerups` - PowerUp feature packages (sentry, posthog, etc.)
  - `powerups_dev` - PowerUp development dependencies
  - `core` - Core project dependencies
  - `core_fallback` - Fallback installations (when bun fails to npm)

### Error Tracking

- Error type and context
- Package manager failures and fallbacks
- Template generation issues
- Dependency installation failures
- Recovery attempts and success rates

### Performance Metrics

- Template generation duration
- File creation and processing times
- Package installation performance by manager
- Overall project setup benchmarks

### User Preferences and Workflows

- Package manager preferences
- Installation mode choices (auto-install vs manual)
- Feature combination patterns
- Project customization trends

### Feature Addition (`feature_added` event)

- Feature type (component, ui_library, ai_assistant, auth, etc.)
- Feature-specific details (component name, library name, provider, etc.)
- Framework context
- TypeScript usage
- Additional options (styles, tests, Storybook integration, etc.)
- Add command vs initial setup

### System Information (Anonymous)

- CLI version (full and major version for grouping)
- Node.js version (full and major version for compatibility tracking)
- Operating system details:
  - Platform (darwin, linux, win32, etc.)
  - Platform display name (macOS, Linux, Windows)
  - Architecture (x64, arm64, etc.)
  - OS type (Darwin, Linux, Windows_NT)
  - OS release version
- Session information:
  - Anonymous session ID (random UUID, expires after 30 minutes)
  - Creation timestamp and hour (for usage pattern analysis)
  - Weekday (for understanding usage patterns)

## What We DON'T Collect

- Personal information (name, email, etc.)
- Project names or paths
- File contents
- Environment variables (except telemetry settings)
- IP addresses (PostHog privacy mode is enabled, IP tracking disabled)
- Machine identifiers
- Geolocation data (explicitly disabled)
- Any sensitive or private data

## Privacy Features

### Anonymous Session IDs

Each CLI session generates a random UUID that persists across commands but contains no identifying information.

### Opt-Out

You can disable telemetry at any time using the CLI command:

```bash
create-precast-app telemetry disable
```

Or by setting an environment variable:

```bash
export PRECAST_TELEMETRY_DISABLED=1
```

Or in your shell configuration file (`~/.bashrc`, `~/.zshrc`, etc.):

```bash
echo 'export PRECAST_TELEMETRY_DISABLED=1' >> ~/.bashrc
```

### Managing Telemetry

The CLI provides commands to manage telemetry settings:

```bash
# Check current telemetry status
create-precast-app telemetry status

# Disable telemetry
create-precast-app telemetry disable

# Enable telemetry
create-precast-app telemetry enable
```

### Automatic Disabling

Telemetry is automatically disabled in:

- CI environments (when `CI=true` or `CONTINUOUS_INTEGRATION=true`)
- When explicitly opted out via environment variable

### Data Transparency

All telemetry code is open source and can be reviewed at:

- `/packages/cli/src/utils/analytics.ts`

## How It Works

1. **Event Generation**: When you run a CLI command, relevant anonymous data is collected
2. **Session ID**: A random UUID is generated and stored in `~/.precast-cli-session`
3. **PostHog Transmission**: Data is sent via HTTPS POST to PostHog's API
4. **Fire and Forget**: Telemetry never blocks or slows down CLI operations
5. **Error Handling**: All telemetry errors are silently ignored
6. **Privacy First**: PostHog is configured with privacy mode and IP tracking disabled

## PostHog Setup

The CLI uses PostHog with privacy-focused configuration:

- **API Key**: Write-only project key (embedded at build time)
- **Host**: `https://app.posthog.com` (or self-hosted instance)
- **Privacy Mode**: Enabled (strips potentially identifying data)
- **IP Tracking**: Disabled (`$ip: null`)
- **Geolocation**: Disabled (`disableGeoip: true`)
- **Protocol**: HTTPS only
- **Method**: POST with JSON payload

## Viewing Analytics Data

### For Users

Telemetry data helps us understand:

- Most popular framework combinations
- Common configuration patterns
- Feature adoption rates
- Error patterns to fix
- Performance metrics

### For Maintainers

Access analytics at: https://app.posthog.com

Key features:

- **Live Events**: See events as they happen in real-time
- **Dashboards**: Custom dashboards for framework usage, popular configurations
- **Insights**: Analyze trends, funnels, and user paths
- **Feature Flags**: A/B test new features (if configured)
- **Debug Mode**: Test events with `DEBUG_ANALYTICS=1` environment variable

## Implementation Details

### Event Structure

#### Project Creation Event

```javascript
{
  distinctId: "anonymous-uuid",
  event: "project_created",
  properties: {
    framework: "tanstack-start",
    backend: "hono",
    database: "postgres",
    orm: "drizzle",
    styling: "tailwind",
    runtime: "node",
    typescript: true,
    docker: true,
    git: true,
    eslint: true,
    prettier: true,
    colorPalette: "minimal-pro",
    duration: 15565,
    packageManager: "bun",
    entryPoint: "cli",
    success: true,
    cli_version: "0.1.31",
    cli_version_major: "0",
    platform: "linux",
    platform_display: "Linux",
    platform_arch: "x64",
    platform_type: "Linux",
    platform_release: "5.15.167.4-microsoft-standard-WSL2",
    node_version: "20.19.1",
    node_version_major: 20,
    sessionId: "63edd370-e6a4-4299-9511-6901e7658b7e",
    createdAt: "2025-08-12T04:52:04.543Z",
    createdHour: "4",
    createdDate: "2025-08-12",
    createdWeekday: "2",
    $ip: null  // IP tracking disabled
  }
}
```

#### Dependency Installation Event

```javascript
{
  distinctId: "anonymous-uuid",
  event: "dependencies_installed",
  properties: {
    packageManager: "bun",
    duration: 7097,
    success: true,
    packageCount: 3,
    installationContext: "database",  // NEW: Specific context
    cli_version: "0.1.31",
    platform: "linux",
    sessionId: "63edd370-e6a4-4299-9511-6901e7658b7e",
    $ip: null
  }
}
```

### Debug Mode

Enable debug logging to see analytics events in real-time:

```bash
# Using environment variable
DEBUG_ANALYTICS=1 create-precast-app init my-app

# Using CLI flag (recommended)
create-precast-app init my-app --debug-analytics

# Full debug mode (includes error debugging)
create-precast-app init my-app --debug
```

Debug output shows:

- Event names and timing
- Complete property payloads
- Success/failure status
- Installation contexts and package details
- Formatted analytics summary at completion

### Rate Limiting

- PostHog handles rate limiting automatically
- Events are batched and sent efficiently
- No additional rate limiting implemented in CLI

### Data Retention

- Standard PostHog data retention policies apply
- Data can be exported or deleted per GDPR requirements
- Self-hosting option available for full data control

## Compliance

### GDPR

- No personal data collected
- Easy opt-out mechanism
- Transparent about data collection
- Data minimization principle followed

### Privacy by Design

- Anonymous by default
- No tracking without consent (opt-out available)
- Minimal data collection
- Open source implementation

## FAQ

**Q: Why collect telemetry?**
A: To understand usage patterns, prioritize features, and improve the CLI based on real usage data.

**Q: Can I see what data is sent?**
A: Yes, all telemetry code is open source. You can also use network debugging tools to inspect the exact payloads.

**Q: Is my project code or content ever sent?**
A: No, only configuration choices and anonymous metrics are collected.

**Q: How do I verify telemetry is disabled?**
A: Run any command with `PRECAST_TELEMETRY_DISABLED=1` - you won't see the telemetry notice.

**Q: Can I delete my data?**
A: Since data is anonymous and not linked to any identity, individual deletion isn't applicable.

## Contact

For questions or concerns about telemetry:

- Open an issue: https://github.com/BuunGroupCore/precast-app/issues
- Email: privacy@precast.dev (if available)
