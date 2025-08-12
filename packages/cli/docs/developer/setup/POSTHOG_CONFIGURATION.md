# PostHog Configuration Guide for Precast CLI Telemetry

## Overview

This guide provides step-by-step instructions for configuring PostHog to receive and visualize telemetry data from the Precast CLI. PostHog is a privacy-focused, open-source product analytics platform that provides real-time insights without the complexity of Google Analytics.

## Why PostHog?

- **Real-time data**: Events appear instantly (no 24-48 hour wait)
- **Privacy-first**: Built-in privacy controls, IP blocking, and GDPR compliance
- **Developer-friendly**: Designed for product analytics, not marketing
- **Open source**: Can be self-hosted for complete data control
- **No configuration needed**: Events and properties work immediately

## Step 1: Create a PostHog Account

### Cloud Setup (Recommended)

1. Go to [PostHog Cloud](https://app.posthog.com/signup)
2. Create a free account (includes 1M events/month)
3. Create your first project
4. Note your **Project API Key** (starts with `phc_`)

### Self-Hosted Setup (Optional)

For complete data control:

```bash
# Using Docker
docker run -d \
  --name posthog \
  -p 8000:8000 \
  posthog/posthog:latest
```

## Step 2: Configure the CLI

### Set Environment Variables

Create a `.env` file in `/packages/cli/`:

```bash
# PostHog Configuration
POSTHOG_API_KEY=phc_YOUR_PROJECT_API_KEY
POSTHOG_HOST=https://app.posthog.com  # Or your self-hosted URL

# Optional: Disable telemetry for development
# PRECAST_TELEMETRY_DISABLED=1
```

### Build the CLI with Keys

```bash
# Build with PostHog keys embedded
bun run build

# The keys are now compiled into the CLI binary
```

## Step 3: Privacy Configuration

The CLI is configured with maximum privacy settings:

```javascript
// In analytics.ts
new PostHog(POSTHOG_API_KEY, {
  host: POSTHOG_HOST,
  flushAt: 1, // Send events immediately
  flushInterval: 0, // No batching delay
  privacyMode: true, // Strip potentially identifying data
  disableGeoip: true, // No location tracking
});

// Each event includes:
{
  $ip: null; // Explicitly disable IP tracking
}
```

## Step 4: Events and Properties

### Tracked Events

#### project_created

Fired when a new project is initialized with `create-precast-app init`

**Properties:**

- `framework` - Frontend framework (react, vue, angular, etc.)
- `backend` - Backend framework (express, fastify, hono, none, etc.)
- `database` - Database type (postgres, mysql, mongodb, none, etc.)
- `orm` - ORM/ODM tool (prisma, drizzle, typeorm, none, etc.)
- `styling` - CSS solution (tailwind, css, scss, etc.)
- `ui_library` - Component library (shadcn, daisyui, material-ui, none, etc.)
- `auth_provider` - Authentication (better-auth, next-auth, clerk, none, etc.)
- `api_client` - API method (trpc, graphql, rest, none, etc.)
- `ai_assistant` - AI tools (claude, copilot, cursor, none, etc.)
- `has_typescript` - TypeScript enabled (true/false)
- `has_docker` - Docker configured (true/false)
- `has_git` - Git initialized (true/false)
- `powerups` - Additional tools (comma-separated)
- `mcp_servers` - MCP servers for Claude (comma-separated)
- `duration_ms` - Project creation time in milliseconds
- `success` - Operation succeeded (true/false)
- `cli_version` - Precast CLI version
- `platform` - Operating system (darwin, linux, win32)
- `node_version` - Node.js version

#### feature_added

Fired when features are added with `create-precast-app add`

**Properties:**

- `feature_name` - Type of feature (component, ui_library, ai_assistant, etc.)
- Additional feature-specific properties
- System properties (cli_version, platform, node_version)

#### command\_[name]

Fired for specific commands (e.g., `command_telemetry`)

**Properties:**

- Command-specific options
- System properties

#### cli_error

Fired when errors occur (anonymous)

**Properties:**

- `error_type` - Type of error
- Additional error context (no sensitive data)

## Step 5: Testing Your Setup

### Enable Debug Mode

```bash
# See analytics events in console
DEBUG_ANALYTICS=1 ./dist/cli.js init test-project \
  --framework react \
  --backend express \
  --database postgres

# Output:
# [Analytics] Sending event: project_created
# [Analytics] Properties: {
#   "framework": "react",
#   "backend": "express",
#   "database": "postgres",
#   ...
# }
# [Analytics] ✓ Event sent successfully
```

### Verify in PostHog Dashboard

1. Go to your [PostHog Dashboard](https://app.posthog.com)
2. Click **Live events** in the sidebar
3. Run a CLI command
4. Watch events appear in real-time!

## Step 6: Creating Insights

### Dashboard 1: Framework Popularity

1. Go to **Insights** → **New insight**
2. Select **Trends**
3. Configure:
   - **Event**: `project_created`
   - **Breakdown by**: `framework`
   - **Chart type**: Pie chart
4. Save to dashboard

### Dashboard 2: Stack Combinations

1. Create new **Insights** → **Funnel**
2. Configure steps:
   - Step 1: `project_created` where `framework = react`
   - Step 2: `project_created` where `database = postgres`
   - Step 3: `project_created` where `styling = tailwind`
3. View popular technology combinations

### Dashboard 3: Success Rate

1. Create new **Insights** → **Trends**
2. Configure:
   - **Event**: `project_created`
   - **Filter**: `success = true` vs `success = false`
   - **Chart type**: Stacked bar
3. Monitor CLI reliability

### Dashboard 4: Feature Adoption

1. Create new **Insights** → **Retention**
2. Configure:
   - **Target event**: `project_created`
   - **Returning event**: `feature_added`
   - **Breakdown**: `feature_name`
3. Track which features users add after project creation

## Step 7: Advanced Features

### User Paths

Track how users progress through the CLI:

1. Go to **User Paths**
2. Start from: `project_created`
3. View common next actions

### Cohorts

Create user segments:

1. Go to **Cohorts** → **New cohort**
2. Example: "TypeScript React Users"
   - Performed `project_created`
   - Where `framework = react`
   - And `has_typescript = true`

### Alerts

Get notified of issues:

1. Go to **Alerts** → **New alert**
2. Example: "High Error Rate"
   - When `cli_error` events
   - Increase by > 50%
   - In last hour

### Feature Flags (Optional)

A/B test new features:

```javascript
// In your CLI code
if (posthog.isFeatureEnabled("new-framework-support")) {
  // Show new framework option
}
```

## Step 8: API Access for Your Website

### Get API Key

1. Go to **Project Settings** → **API Keys**
2. Create a **Read-only** API key for your website

### Fetch Analytics Data

```javascript
// For your website dashboard
const response = await fetch("https://app.posthog.com/api/projects/{project_id}/insights/trend/", {
  headers: {
    Authorization: `Bearer ${POSTHOG_API_KEY}`,
  },
});

const data = await response.json();
// Display framework popularity, success rates, etc.
```

### Embed Dashboards

PostHog supports public dashboard sharing:

1. Go to **Dashboards**
2. Click **Share**
3. Enable public access
4. Embed iframe in your website

## Step 9: Data Export

### Export to Data Warehouse

PostHog supports exports to:

- BigQuery
- Snowflake
- Redshift
- S3
- PostgreSQL

### Manual Export

1. Go to **Data Management** → **Exports**
2. Select events and date range
3. Export as CSV or JSON

## Troubleshooting

### Events Not Appearing

1. **Check API Key**: Ensure `POSTHOG_API_KEY` is set correctly
2. **Debug Mode**: Run with `DEBUG_ANALYTICS=1`
3. **Telemetry Enabled**: Check `PRECAST_TELEMETRY_DISABLED` is not set
4. **Network**: Verify connection to PostHog servers

### Common Issues

| Issue                  | Solution                                          |
| ---------------------- | ------------------------------------------------- |
| No events in dashboard | Check if API key is valid and telemetry enabled   |
| Missing properties     | Ensure all properties are strings or serializable |
| Events delayed         | Check `flushAt` and `flushInterval` settings      |
| IP addresses showing   | Verify `privacyMode: true` and `$ip: null`        |

## Privacy & Compliance

### GDPR Compliance

- ✅ No personal data collected
- ✅ Anonymous session IDs only
- ✅ IP tracking disabled
- ✅ Geolocation disabled
- ✅ Easy opt-out mechanism
- ✅ Data deletion available

### Security

- API keys are write-only (can't read data)
- HTTPS only communication
- No sensitive data in events
- Keys embedded at build time (not in source)

## Best Practices

1. **Never log sensitive data** - No passwords, tokens, or personal info
2. **Use descriptive event names** - `project_created` not `event_1`
3. **Consistent property names** - Always use snake_case
4. **Test locally first** - Use `DEBUG_ANALYTICS=1`
5. **Monitor error events** - Set up alerts for `cli_error`

## Resources

- [PostHog Documentation](https://posthog.com/docs)
- [PostHog Node.js SDK](https://posthog.com/docs/libraries/node)
- [Privacy & GDPR Guide](https://posthog.com/docs/privacy)
- [Self-Hosting Guide](https://posthog.com/docs/self-host)

## Support

For issues or questions:

- Check telemetry code: `/packages/cli/src/utils/analytics.ts`
- View telemetry docs: `/packages/cli/docs/TELEMETRY.md`
- PostHog Community: [posthog.com/questions](https://posthog.com/questions)
- Open an issue: [GitHub Issues](https://github.com/BuunGroupCore/precast-app/issues)
