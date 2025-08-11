# Telemetry Documentation

## Overview

The Precast CLI collects anonymous usage data to help improve the tool and understand how developers use it. This data is sent to Google Analytics 4 using the Measurement Protocol, which is the same approach used by major CLIs like Next.js, Angular CLI, and AWS CDK.

## What We Collect

### Project Creation (`project_created` event)

- Framework choice (React, Vue, Angular, etc.)
- Backend selection (Express, Fastify, Hono, etc.)
- Database type (PostgreSQL, MySQL, MongoDB, etc.)
- ORM selection (Prisma, Drizzle, TypeORM, etc.)
- Styling solution (Tailwind, CSS, SCSS, etc.)
- UI library (shadcn/ui, DaisyUI, Material UI, etc.)
- Authentication provider (Better Auth, NextAuth, Clerk, etc.)
- API client (tRPC, GraphQL, REST, etc.)
- AI assistant configuration (Claude, Copilot, Cursor, etc.)
- TypeScript usage (yes/no)
- Docker configuration (yes/no)
- Git initialization (yes/no)
- PowerUps selected (testing, linting, monitoring tools)
- MCP servers configured (for Claude AI)
- Project creation duration (milliseconds)
- Success status (true/false)

### Feature Addition (`feature_added` event)

- Feature type (component, ui_library, ai_assistant, etc.)
- Feature-specific details (component name, library name, etc.)
- Framework context
- TypeScript usage
- Additional options (styles, tests, Storybook, etc.)

### System Information (Anonymous)

- CLI version
- Node.js version
- Operating system platform (darwin, linux, win32)
- Country code (derived from IP, optional)

## What We DON'T Collect

- Personal information (name, email, etc.)
- Project names or paths
- File contents
- Environment variables (except telemetry settings)
- IP addresses
- Machine identifiers
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
3. **GA4 Transmission**: Data is sent via HTTPS POST to Google Analytics 4
4. **Fire and Forget**: Telemetry never blocks or slows down CLI operations
5. **Error Handling**: All telemetry errors are silently ignored

## Google Analytics 4 Setup

The CLI uses Google Analytics 4 Measurement Protocol with:

- **Measurement ID**: `G-4S73687P86`
- **Endpoint**: `https://www.google-analytics.com/mp/collect`
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

Access analytics at: https://analytics.google.com

Key reports:

- **Realtime**: See events as they happen
- **Engagement > Events**: View all tracked events
- **Custom Dimensions**: Framework, database, and feature usage

## Implementation Details

### Event Structure

```javascript
{
  client_id: "anonymous-uuid",
  events: [{
    name: "project_created",
    params: {
      framework: "react",
      backend: "express",
      database: "postgres",
      cli_version: "1.0.0",
      platform: "darwin",
      node_version: "18.17.0",
      engagement_time_msec: "100"
    }
  }]
}
```

### Rate Limiting

- GA4 has built-in rate limiting (20 events/second per client)
- No additional rate limiting implemented in CLI

### Data Retention

- Standard GA4 data retention policies apply
- Data is aggregated and anonymized by Google

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
