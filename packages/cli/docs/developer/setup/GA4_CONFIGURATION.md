# GA4 Configuration Guide for Precast CLI Telemetry

## Overview

This guide provides step-by-step instructions for configuring Google Analytics 4 to receive and visualize telemetry data from the Precast CLI. The setup includes creating custom dimensions, understanding data processing times, and building custom reports.

## Important: Data Processing Timeline

### Why You're Not Seeing Data Yet

- **Realtime Reports**: 1-3 minutes delay
- **Custom Dimensions**: **24-48 hours after first event** (this is why you see no data initially)
- **Standard Reports**: 24-48 hours
- **Explorations with Custom Dimensions**: 24-48 hours

**This is completely normal!** Google Analytics needs time to:

1. Process your custom dimension definitions
2. Connect incoming events to those dimensions
3. Build the data relationships

## Step 1: Create Custom Dimensions

### Access Custom Definitions

1. Go to [Google Analytics](https://analytics.google.com)
2. Navigate to **Admin** (gear icon)
3. Under **Property**, click **Custom definitions**
4. Click **Create custom dimension**

### Custom Dimensions Configuration Table

Create each dimension below with these EXACT specifications:

| Dimension Name     | Scope | Event Parameter  | Description                                                        |
| ------------------ | ----- | ---------------- | ------------------------------------------------------------------ |
| **Framework**      | Event | `framework`      | Frontend framework (React, Vue, Angular, Next, Nuxt, Svelte, etc.) |
| **Backend**        | Event | `backend`        | Backend framework (Express, Fastify, Hono, none, etc.)             |
| **Database**       | Event | `database`       | Database type (postgres, mysql, mongodb, sqlite, none, etc.)       |
| **ORM**            | Event | `orm`            | ORM/ODM tool (prisma, drizzle, typeorm, mongoose, none, etc.)      |
| **Styling**        | Event | `styling`        | CSS solution (tailwind, css, scss, styled-components, etc.)        |
| **UI Library**     | Event | `ui_library`     | Component library (shadcn, daisyui, material-ui, none, etc.)       |
| **Authentication** | Event | `auth`           | Auth provider (better-auth, next-auth, clerk, none, etc.)          |
| **API Client**     | Event | `api_client`     | API method (trpc, graphql, rest, tanstack-query, none, etc.)       |
| **TypeScript**     | Event | `typescript`     | TypeScript enabled (true/false)                                    |
| **Docker**         | Event | `docker`         | Docker configured (true/false)                                     |
| **Git**            | Event | `git`            | Git initialized (true/false)                                       |
| **PowerUps**       | Event | `powerups`       | Additional tools (testing, linting, monitoring, etc.)              |
| **MCP Servers**    | Event | `mcp_servers`    | MCP servers for Claude (postgresql, github, git, filesystem, etc.) |
| **Runtime**        | Event | `runtime`        | JavaScript runtime (node, bun, deno)                               |
| **CLI Version**    | Event | `cli_version`    | Precast CLI version number                                         |
| **Node Version**   | Event | `node_version`   | Node.js version                                                    |
| **Platform**       | Event | `platform`       | Operating system (darwin, linux, win32)                            |
| **AI Assistant**   | Event | `ai_assistant`   | AI coding assistant (claude, copilot, cursor, gemini, none)        |
| **AI Assistants**  | Event | `ai_assistants`  | Multiple AI assistants comma-separated                             |
| **Component Name** | Event | `component_name` | Name of generated component                                        |
| **Feature Type**   | Event | `feature_type`   | Type of feature added                                              |
| **With Styles**    | Event | `with_styles`    | Component includes styles (true/false)                             |
| **With Tests**     | Event | `with_tests`     | Component includes tests (true/false)                              |
| **With Storybook** | Event | `with_storybook` | Component includes Storybook (true/false)                          |
| **Duration**       | Event | `duration`       | Operation duration in milliseconds                                 |
| **Success**        | Event | `success`        | Operation succeeded (true/false)                                   |

### How to Create Each Dimension:

1. Click **Create custom dimension**
2. Fill in the form:
   - **Dimension name**: Copy from table above
   - **Scope**: Select **Event** (always)
   - **Description**: Copy from table above
   - **Event parameter**: Copy EXACTLY from table (case-sensitive)
3. Click **Save**
4. Repeat for all 26 dimensions

## Step 2: Tracked Events

Your CLI sends these events that use the custom dimensions:

### project_created

Fired when a new project is initialized with `precast init`

**Parameters sent:**

- framework, backend, database, orm, styling, ui_library, auth, api_client
- typescript, docker, git, powerups, mcp_servers, runtime
- cli_version, node_version, platform, duration, success

### feature_added

Fired when features are added with `precast add` or `precast add-features`

**Parameters sent:**

- feature_type (component, ui_library, ai_assistant)
- Feature-specific parameters (component_name, with_styles, etc.)
- framework, cli_version, node_version, platform

## Step 3: Testing Your Setup

### Generate Test Events

```bash
# Test different framework combinations
./packages/cli/dist/cli.js init test-react --framework react --backend express --database postgres --orm prisma --styling tailwind --yes

./packages/cli/dist/cli.js init test-vue --framework vue --backend fastify --database mysql --orm drizzle --styling css --yes

./packages/cli/dist/cli.js init test-next --framework next --backend none --database mongodb --orm mongoose --styling tailwind --ui-library shadcn --yes
```

### Verify Events Are Being Sent

```bash
# Quick test to verify GA4 is receiving events
node -e "
fetch('https://www.google-analytics.com/mp/collect?measurement_id=G-4S73687P86', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    client_id: 'test_' + Date.now(),
    events: [{
      name: 'test_setup_verification',
      params: {
        framework: 'react',
        backend: 'express',
        database: 'postgres',
        engagement_time_msec: '100'
      }
    }]
  })
}).then(r => console.log('GA4 Response Status:', r.status));
"
```

Expected output: `GA4 Response Status: 204` (204 means success)

## Step 4: Creating Custom Reports (After 24 Hours)

### Example 1: Framework Popularity Report

**Purpose**: See which frameworks are most popular among users

1. Go to **Explore** → Click **Blank**
2. Name your exploration: "Framework Popularity"
3. Configure the report:

**DIMENSIONS (drag to Rows section):**

- Event name
- Framework
- Backend (optional)

**METRICS (drag to Values section):**

- Event count
- Total users

**FILTERS (add under Filters section):**

- Dimension: Event name
- Match type: Exactly matches
- Value: `project_created`

**VISUALIZATION:**

- Click the visualization icon
- Select "Donut chart" or "Bar chart"
- Framework will show as segments/bars

**Expected Output After Data Populates:**

```
Framework | Event count | Total users
----------|-------------|-------------
react     | 145         | 28
next      | 89          | 15
vue       | 67          | 12
angular   | 45          | 8
svelte    | 23          | 5
```

### Example 2: Stack Combination Analysis

**Purpose**: Understand popular technology stack combinations

1. Go to **Explore** → Click **Blank**
2. Name your exploration: "Stack Combinations"
3. Configure the report:

**DIMENSIONS (drag to Rows in this order):**

1. Framework
2. Database
3. Styling
4. TypeScript

**METRICS (drag to Values section):**

- Event count
- Total users

**FILTERS:**

- Dimension: Event name
- Match type: Exactly matches
- Value: `project_created`

**SORTING:**

- Sort by: Event count
- Order: Descending

**Expected Output After Data Populates:**

```
Framework | Database | Styling  | TypeScript | Event count | Users
----------|----------|----------|------------|-------------|-------
react     | postgres | tailwind | true       | 67          | 15
next      | postgres | tailwind | true       | 45          | 12
vue       | mysql    | css      | false      | 34          | 8
react     | mongodb  | tailwind | true       | 28          | 7
angular   | postgres | scss     | true       | 23          | 5
```

### Example 3: Feature Adoption Dashboard

**Purpose**: Track which features users add to their projects

1. Go to **Explore** → Click **Blank**
2. Name your exploration: "Feature Adoption"
3. Configure the report:

**DIMENSIONS:**

- UI Library (drag to Rows)
- AI Assistant (drag to Columns)

**METRICS:**

- Event count (drag to Values)

**FILTERS:**

- Add two filters:
  1. Event name → exactly matches → `project_created`
  2. UI Library → is not → (not set)

**VISUALIZATION:**

- Select "Heat map" for cross-analysis

## Step 5: Building a Dashboard

After your explorations have data:

1. Go to **Reports** → **Library**
2. Click **Create new report** → **Create detail report**
3. Add cards:

### Card 1: Framework Distribution

- Type: Pie chart
- Dimension: Framework
- Metric: Total users
- Filter: Event name = project_created

### Card 2: Success Rate

- Type: Scorecard
- Metric: Event count
- Filter: Success = true
- Comparison: Previous period

### Card 3: Technology Trends

- Type: Line chart (time series)
- Dimension: Date
- Breakdown dimension: Framework
- Metric: Event count

### Card 4: Database Choices

- Type: Bar chart
- Dimension: Database
- Metric: Event count
- Filter: Database != none

## Step 6: Troubleshooting

### "No data available" in Custom Dimensions

**This is NORMAL for the first 24-48 hours!**

Reasons:

1. **Processing Delay**: GA4 needs 24-48 hours to connect custom dimensions to events
2. **No Historical Data**: Dimensions only collect data from creation time forward
3. **Event Not Fired**: The specific event with that parameter hasn't been sent yet

### Debugging Checklist

#### 1. Verify Events Are Sent

Check Realtime reports (these work immediately):

- Go to **Reports** → **Realtime**
- Look for your event names in the event count card
- You should see `project_created` and `feature_added`

#### 2. Check DebugView

For immediate parameter verification:

1. Go to **Admin** → **DebugView**
2. Run a CLI command
3. Watch events appear with all parameters

#### 3. Verify Custom Dimensions

- Go to **Admin** → **Custom definitions**
- Ensure all 26 dimensions are created
- Check that Event parameter names match EXACTLY (case-sensitive)

#### 4. Wait for Processing

- Standard reports: Wait 24 hours
- Custom dimensions in Explorations: Wait 24-48 hours
- This is Google's processing time, not a configuration issue

### Common Issues and Solutions

| Issue                               | Solution                                                           |
| ----------------------------------- | ------------------------------------------------------------------ |
| 204 status but no data              | Normal - GA4 returns 204 for success. Wait 24 hours for processing |
| Custom dimensions show "(not set)"  | Parameter not sent with event OR dimension created after event     |
| No events in Realtime               | Check if `PRECAST_TELEMETRY_DISABLED=1` is set                     |
| Dimensions not appearing in Explore | Wait 24-48 hours after first event with that parameter             |
| Low user count                      | Anonymous UUID is persistent - same user across sessions           |

## Step 7: API Access for Your Website

To display metrics on your website, use the GA4 Data API:

### Enable the API

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable "Google Analytics Data API"
3. Create service account credentials
4. Add service account email to GA4 property

### Example API Request

```javascript
// Fetch framework distribution for your website
const response = await fetch(
  `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runReport`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      dimensions: [{ name: "customEvent:framework" }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: {
        filter: {
          fieldName: "eventName",
          stringFilter: { value: "project_created" },
        },
      },
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
    }),
  }
);
```

## Next Steps

### Day 1 (Today)

✅ Create all custom dimensions
✅ Verify events are being sent (204 status)
✅ Check Realtime reports for basic event flow
✅ Generate test events with different configurations

### Day 2 (After 24 Hours)

- Check standard Reports → Events
- Custom dimensions should start appearing
- Create your first Exploration reports
- Build framework popularity chart

### Day 3 (After 48 Hours)

- All custom dimensions fully available
- Create comprehensive dashboards
- Set up custom alerts
- Export data for website integration

### Week 1

- Analyze patterns and trends
- Identify most popular configurations
- Create audience segments
- Set up conversion tracking for success metrics

## Resources

- [GA4 Measurement Protocol Documentation](https://developers.google.com/analytics/devguides/collection/protocol/ga4)
- [GA4 Custom Dimensions Guide](https://support.google.com/analytics/answer/10075209)
- [GA4 Explorations Tutorial](https://support.google.com/analytics/answer/9327972)
- [GA4 Data API](https://developers.google.com/analytics/devguides/reporting/data/v1)

## Support

For issues or questions:

- Check telemetry code: `/packages/cli/src/utils/analytics.ts`
- View telemetry docs: `/packages/cli/docs/TELEMETRY.md`
- Open an issue: [GitHub Issues](https://github.com/BuunGroupCore/precast-app/issues)
