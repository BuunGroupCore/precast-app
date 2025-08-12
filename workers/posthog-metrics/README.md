# PostHog Analytics Worker

A Cloudflare Worker that fetches and caches analytics data from PostHog for the Precast app. This worker collects usage metrics, event breakdowns, framework/feature adoption, and stores them for fast access via the unified API at `api.precast.dev`.

## Features

- **Secure PostHog API Integration** with API key authentication
- **Comprehensive Analytics Collection**:
- Event tracking and breakdowns
- User activity metrics
- Framework usage statistics
- Feature adoption tracking
- Timeline data for charts
- **R2 Storage** for caching analytics data
- **Scheduled Updates** every 6 hours via Cron Triggers
- **High Performance** with data caching and parallel API calls
- **Manual Refresh** endpoint with rate limiting
- **Unified API** served from `api.precast.dev/analytics`

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        api.precast.dev                      │
├─────────────────────────┬───────────────────────────────────┤
│   GitHub Metrics (/*)   │   PostHog Analytics (/analytics)  │
├─────────────────────────┼───────────────────────────────────┤
│  • /data                │  • /analytics                     │
│  • /refresh             │  • /analytics/data                │
│  • /status              │  • /analytics/refresh             │
│                         │  • /analytics/status              │
│                         │  • /analytics/events              │
│                         │  • /analytics/frameworks          │
│                         │  • /analytics/features            │
└─────────────────────────┴───────────────────────────────────┘
```

## API Endpoints

All endpoints are served from `https://api.precast.dev/analytics`

### Core Endpoints

#### `GET /analytics`

Returns a summary of analytics data including usage metrics and last update time.

```bash
curl https://api.precast.dev/analytics
```

Response:

```json
{
  "project": {
    "name": "Precast App",
    "id": "12345"
  },
  "usage": {
    "totalEvents": 10000,
    "uniqueUsers": 500,
    "eventsLast30Days": 8000,
    "eventsLast7Days": 2000,
    "activeUsersLast30Days": 400,
    "activeUsersLast7Days": 150
  },
  "lastUpdated": "2025-01-01T12:00:00Z"
}
```

#### `GET /analytics/data`

Returns complete analytics data including all metrics, events, and breakdowns.

```bash
curl https://api.precast.dev/analytics/data
```

#### `GET /analytics/refresh`

Manually triggers a data refresh (rate limited to once per 5 minutes).

```bash
curl https://api.precast.dev/analytics/refresh
```

#### `GET /analytics/status`

Returns worker health status and available endpoints.

```bash
curl https://api.precast.dev/analytics/status
```

### Specialized Endpoints

#### `GET /analytics/events`

Returns event tracking data and timeline.

```bash
curl https://api.precast.dev/analytics/events
```

#### `GET /analytics/frameworks`

Returns framework usage statistics.

```bash
curl https://api.precast.dev/analytics/frameworks
```

Response:

```json
{
  "breakdown": {
    "react": 450,
    "vue": 120,
    "angular": 80,
    "next": 200
  },
  "topFrameworks": [
    { "name": "react", "count": 450, "percentage": 45 },
    { "name": "next", "count": 200, "percentage": 20 }
  ]
}
```

#### `GET /analytics/features`

Returns feature adoption data.

```bash
curl https://api.precast.dev/analytics/features
```

### Advanced Analytics Endpoints

#### `GET /analytics/stacks`

Returns popular stack combinations and their success rates.

```bash
curl https://api.precast.dev/analytics/stacks
```

Response:
```json
[
  {
    "framework": "react",
    "backend": "express",
    "database": "postgres",
    "orm": "prisma",
    "styling": "tailwind",
    "frequency": 245,
    "successRate": 92,
    "avgSetupTime": 45000
  }
]
```

#### `GET /analytics/developer-experience`

Returns developer experience metrics.

```bash
curl https://api.precast.dev/analytics/developer-experience
```

Response:
```json
{
  "typeScriptAdoption": 78,
  "dockerUsage": 45,
  "gitInitRate": 92,
  "eslintEnabled": 85,
  "prettierEnabled": 87,
  "testingSetup": 64,
  "cicdConfigured": 32
}
```

#### `GET /analytics/performance`

Returns performance metrics by package manager and framework.

```bash
curl https://api.precast.dev/analytics/performance
```

#### `GET /analytics/journey`

Returns user journey analytics.

```bash
curl https://api.precast.dev/analytics/journey
```

#### `GET /analytics/ai-automation`

Returns AI and automation adoption metrics.

```bash
curl https://api.precast.dev/analytics/ai-automation
```

#### `GET /analytics/errors`

Returns error analysis and recovery patterns.

```bash
curl https://api.precast.dev/analytics/errors
```

#### `GET /analytics/plugins`

Returns plugin ecosystem metrics.

```bash
curl https://api.precast.dev/analytics/plugins
```

#### `GET /analytics/quality`

Returns code quality and testing metrics.

```bash
curl https://api.precast.dev/analytics/quality
```

## Setup

### 1. PostHog Configuration

1. Log in to your PostHog account
2. Navigate to Project Settings
3. Create a new Personal API Key:
   - Go to "Personal API Keys" section
   - Click "Create personal API key"
   - Give it a descriptive name (e.g., "Precast Analytics Worker")
   - **Required Scopes/Permissions:**
     - `project:read` - Read project data and settings
     - `insight:read` - Read insights and dashboards
     - `event_definition:read` - Read event definitions
     - `person:read` - Read person/user data
     - `cohort:read` - Read cohorts (if using cohort analysis)
     - `query:read` - Read query results
     - `session_recording:read` - Read session recordings (optional)
   - **Note:** Do NOT grant write permissions as they're not needed
   - Copy the generated key (format: `phx_xxxxxxxxxxxxx`)
4. Note your Project ID from the project settings (found in URL or project settings page)

### 2. Cloudflare Setup

#### Create R2 Bucket

```bash
# Create R2 bucket for analytics data
wrangler r2 bucket create precast-analytics-data
```

#### Configure Worker Secrets

```bash
# Set PostHog credentials
wrangler secret put POSTHOG_PROJECT_ID --env production
# Enter your PostHog project ID

wrangler secret put POSTHOG_API_KEY --env production
# Enter your PostHog API key

wrangler secret put POSTHOG_HOST --env production
# Enter: https://app.posthog.com (or your custom host)
```

### 3. Local Development

Create `.dev.vars` file for local testing:

```env
POSTHOG_PROJECT_ID="your_project_id"
POSTHOG_API_KEY="phx_your_api_key"
POSTHOG_HOST="https://app.posthog.com"
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
wrangler dev --env development
```

## Development

### Project Structure

```
posthog-metrics/
├── src/
│   ├── index.ts                 # Worker entry point
│   ├── config/
│   │   └── constants.ts         # Configuration constants
│   ├── services/
│   │   ├── posthog-auth.service.ts    # PostHog authentication
│   │   ├── posthog-client.service.ts  # PostHog API client
│   │   ├── data-processor.service.ts  # Data processing
│   │   └── r2-storage.service.ts      # R2 storage operations
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   └── utils/
│       └── helpers.ts           # Utility functions
├── wrangler.toml                # Cloudflare Worker configuration
├── package.json
├── tsconfig.json
└── README.md
```

### Testing

Test endpoints locally:

```bash
# Check status
curl http://localhost:8787/analytics/status

# Get analytics summary
curl http://localhost:8787/analytics

# Get full data
curl http://localhost:8787/analytics/data

# Get framework stats
curl http://localhost:8787/analytics/frameworks

# Trigger manual refresh
curl http://localhost:8787/analytics/refresh
```

## Deployment

### Deploy to Production

```bash
# Build and deploy
wrangler deploy --env production

# Verify deployment
curl https://api.precast.dev/analytics/status
```

### Monitor Production

```bash
# View real-time logs
wrangler tail --env production

# Filter logs for analytics endpoints
wrangler tail --env production --filter "path:/analytics"

# Check R2 storage
wrangler r2 object list precast-analytics-data/
```

## Data Structure

The worker stores analytics data in the following structure:

```typescript
interface PostHogMetricsData {
  timestamp: string;
  project: {
    name: string;
    id: string;
  };
  usage: {
    totalEvents: number;
    uniqueUsers: number;
    eventsLast30Days: number;
    eventsLast7Days: number;
    activeUsersLast30Days: number;
    activeUsersLast7Days: number;
  };
  events: {
    breakdown: EventBreakdown[];
    topEvents: EventBreakdown[];
    timeline: TimelineData[];
  };
  frameworks: {
    breakdown: Record<string, number>;
    topFrameworks: FrameworkUsage[];
  };
  features: {
    breakdown: Record<string, number>;
    topFeatures: FeatureUsage[];
  };
  lastUpdated: string;
}
```

## Scheduled Updates

The worker automatically updates analytics data every 6 hours via Cloudflare Cron Triggers:

```toml
[triggers]
crons = ["0 */6 * * *"]  # Runs at 00:00, 06:00, 12:00, 18:00 UTC
```

## Rate Limiting

- **Manual Refresh**: Limited to once per 5 minutes
- **Scheduled Updates**: Every 6 hours
- **API Requests**: Respects PostHog API rate limits

## Security

- API keys are stored as encrypted secrets
- CORS headers configured for browser access
- Rate limiting prevents abuse
- R2 bucket can be configured with access controls

## Troubleshooting

### Common Issues

#### No Data Available

```bash
# Check if worker has run
curl https://api.precast.dev/analytics/status

# Trigger manual refresh
curl https://api.precast.dev/analytics/refresh
```

#### Authentication Errors

```bash
# Verify secrets are set
wrangler secret list --env production

# Re-add secrets if needed
wrangler secret put POSTHOG_API_KEY --env production
```

#### Rate Limiting

```bash
# Check Retry-After header
curl -I https://api.precast.dev/analytics/refresh
```

### Debug Commands

```bash
# View worker logs
wrangler tail --env production

# Check R2 bucket contents
wrangler r2 object list precast-analytics-data/

# Download stored data
wrangler r2 object get precast-analytics-data/posthog-analytics.json

# View worker metrics
wrangler metrics show --env production
```

## Integration with Website

The analytics data can be consumed by the Precast website:

```typescript
// Fetch analytics data
const response = await fetch("https://api.precast.dev/analytics/data");
const analytics = await response.json();

// Display framework usage
const frameworkData = await fetch("https://api.precast.dev/analytics/frameworks");
const frameworks = await frameworkData.json();

// Show in charts
frameworks.topFrameworks.forEach((fw) => {
  console.log(`${fw.name}: ${fw.percentage}%`);
});
```

## Contributing to Advanced Analytics

### Adding New Metrics

To add new analytics metrics to the PostHog worker:

#### 1. Define Types

Add your metric types to `src/types/index.ts`:

```typescript
export interface YourNewMetric {
  field1: string;
  field2: number;
  // Add your fields
}

// Update PostHogMetricsData interface
export interface PostHogMetricsData {
  // ... existing fields
  yourNewMetric?: YourNewMetric;
}
```

#### 2. Create Calculation Logic

Add calculation method to `src/services/advanced-metrics.service.ts`:

```typescript
/**
 * Calculate your new metric
 */
calculateYourNewMetric(events: PostHogEventResponse): YourNewMetric {
  // Your calculation logic here
  const result = {
    field1: "value",
    field2: 42
  };
  
  return result;
}
```

#### 3. Update Data Processor

In `src/services/data-processor.service.ts`, call your new calculation:

```typescript
const yourNewMetric = this.advancedMetrics.calculateYourNewMetric(data.events);

return {
  // ... existing metrics
  yourNewMetric,
};
```

#### 4. Add API Endpoint

Add handler in `src/index.ts`:

```typescript
// Add to handlers object
"/analytics/your-new-metric": handleYourNewMetricRequest,

// Add handler function
async function handleYourNewMetricRequest(
  env: WorkerEnv,
  headers: Record<string, string>
): Promise<Response> {
  const storage = new R2StorageService(env);
  const metrics = await storage.getCachedData();

  if (!metrics || !metrics.yourNewMetric) {
    return new Response("No data available", {
      status: 404,
      headers,
    });
  }

  return new Response(JSON.stringify(metrics.yourNewMetric), {
    status: 200,
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
  });
}
```

#### 5. Document the Endpoint

Add documentation to this README:

```markdown
#### `GET /analytics/your-new-metric`

Description of what this metric provides.

\```bash
curl https://api.precast.dev/analytics/your-new-metric
\```

Response:
\```json
{
  "field1": "value",
  "field2": 42
}
\```
```

### Best Practices for New Metrics

1. **Performance**: Keep calculations efficient as they run every 6 hours
2. **Error Handling**: Always check for null/undefined values
3. **Type Safety**: Use TypeScript types strictly
4. **Documentation**: Document what each metric measures and why
5. **Testing**: Test with sample data before deployment
6. **Backwards Compatibility**: Make new metrics optional in interfaces

### Event Naming Conventions

When tracking new events from the CLI:

- **Project Events**: `project_created`, `project_completed`, `project_failed`
- **Feature Events**: `feature_added`, `feature_configured`, `feature_enabled`
- **Error Events**: `error_occurred`, `error_recovered`, `fallback_triggered`
- **Performance Events**: `performance_measured`, `benchmark_recorded`

### Testing New Metrics Locally

1. Create test data:
```typescript
const testEvents: PostHogEventResponse = {
  results: [
    {
      id: "test-1",
      timestamp: new Date().toISOString(),
      event: "project_created",
      properties: {
        framework: "react",
        // Add test properties
      }
    }
  ],
  count: 1
};
```

2. Run locally:
```bash
npm run dev
curl http://localhost:8787/analytics/your-new-metric
```

3. Verify output matches expected structure

### Performance Considerations

- **Batch Processing**: Process events in batches for large datasets
- **Caching**: Use R2 storage efficiently
- **Parallel Calculations**: Use `Promise.all()` for independent calculations
- **Memory Management**: Clear large objects after processing

### Example: Adding Session Duration Metric

Here's a complete example of adding a new metric:

```typescript
// 1. In types/index.ts
export interface SessionMetrics {
  avgDuration: number;
  medianDuration: number;
  bounceRate: number;
}

// 2. In advanced-metrics.service.ts
calculateSessionMetrics(events: PostHogEventResponse): SessionMetrics {
  const sessions = this.groupEventsBySessions(events.results);
  const durations: number[] = [];
  let bounces = 0;
  
  for (const session of sessions) {
    const duration = this.calculateSessionDuration(session);
    durations.push(duration);
    
    if (session.length <= 1) {
      bounces++;
    }
  }
  
  return {
    avgDuration: this.calculateAverage(durations),
    medianDuration: this.calculateMedian(durations),
    bounceRate: sessions.length > 0 
      ? Math.round((bounces / sessions.length) * 100)
      : 0
  };
}
```

### Submitting Contributions

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-metric`
3. Test thoroughly with local development
4. Update this README with new endpoint documentation
5. Submit a pull request with:
   - Clear description of the new metric
   - Why it's valuable
   - Example use cases
   - Test results

## License

MIT License - See LICENSE file for details
