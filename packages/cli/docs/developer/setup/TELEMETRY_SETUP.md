# Telemetry Setup Guide

This guide explains how to set up Google Analytics 4 telemetry for your CLI application, similar to how Precast CLI implements it.

## Prerequisites

- Google Account
- Access to Google Analytics
- Node.js project with CLI commands

## Step 1: Create a Google Analytics 4 Property

### 1.1 Access Google Analytics
1. Go to [Google Analytics](https://analytics.google.com)
2. Sign in with your Google account

### 1.2 Create a New Property
1. Click **Admin** (gear icon in bottom left)
2. Click **Create Property**
3. Enter property details:
   - **Property name**: `Your CLI Name`
   - **Time zone**: Your timezone
   - **Currency**: Your currency
4. Click **Next**

### 1.3 Configure Business Details
1. Select your industry category
2. Select business size
3. Select how you intend to use Google Analytics
4. Click **Create**

### 1.4 Set Up Data Stream
1. Choose **Web** as platform (even though it's for CLI)
2. Enter details:
   - **Website URL**: `https://your-cli-domain.com` (can be placeholder)
   - **Stream name**: `Your CLI Name`
3. Click **Create stream**

### 1.5 Get Your Measurement ID
1. After creating the stream, you'll see your **Measurement ID**
2. It looks like: `G-XXXXXXXXXX`
3. Copy this ID - you'll need it for your code

## Step 2: Implement Telemetry in Your CLI

### 2.1 Create the Analytics Module

Create `src/utils/analytics.ts`:

```typescript
/**
 * Google Analytics 4 telemetry for Your CLI
 */

import crypto from "crypto";
import { readFileSync, existsSync, writeFileSync } from "fs";
import os from "os";
import { join } from "path";

const GA_MEASUREMENT_ID = "G-XXXXXXXXXX"; // Replace with your Measurement ID
const GA_API_SECRET = ""; // Optional - see Step 3
const GA_ENDPOINT = "https://www.google-analytics.com/mp/collect";
const TELEMETRY_DISABLED_KEY = "YOUR_CLI_TELEMETRY_DISABLED";
const SESSION_FILE = join(os.homedir(), ".your-cli-session");

export interface TelemetryEvent {
  // Define your event properties
  framework?: string;
  feature?: string;
  // Add more as needed
}

/**
 * Check if telemetry is enabled
 */
export function isTelemetryEnabled(): boolean {
  if (
    process.env[TELEMETRY_DISABLED_KEY] === "1" ||
    process.env[TELEMETRY_DISABLED_KEY] === "true"
  ) {
    return false;
  }

  if (process.env.CI === "true") {
    return false;
  }

  return true;
}

/**
 * Get or create a persistent anonymous client ID
 */
function getClientId(): string {
  try {
    if (existsSync(SESSION_FILE)) {
      return readFileSync(SESSION_FILE, "utf-8").trim();
    }
  } catch {
    // Ignore read errors
  }

  const clientId = crypto.randomUUID();

  try {
    writeFileSync(SESSION_FILE, clientId);
  } catch {
    // Ignore write errors
  }

  return clientId;
}

/**
 * Send event to Google Analytics 4
 */
async function sendToGA4(eventName: string, parameters: Record<string, any>): Promise<void> {
  if (!isTelemetryEnabled()) {
    return;
  }

  try {
    const url = new URL(GA_ENDPOINT);
    url.searchParams.append("measurement_id", GA_MEASUREMENT_ID);
    if (GA_API_SECRET) {
      url.searchParams.append("api_secret", GA_API_SECRET);
    }

    const cleanParams: Record<string, any> = {};
    for (const [key, value] of Object.entries(parameters)) {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          cleanParams[key] = value.join(",");
        } else {
          cleanParams[key] = String(value);
        }
      }
    }

    const payload = {
      client_id: getClientId(),
      events: [
        {
          name: eventName,
          params: {
            ...cleanParams,
            engagement_time_msec: "100",
          },
        },
      ],
    };

    fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).catch(() => {
      // Ignore fetch errors
    });
  } catch {
    // Never break CLI
  }
}

/**
 * Track your custom events
 */
export async function trackEvent(eventName: string, properties?: Record<string, any>): Promise<void> {
  await sendToGA4(eventName, properties || {});
}
```

### 2.2 Add Telemetry to Your Commands

In your command files:

```typescript
import { trackEvent } from "../utils/analytics.js";

// In your command function
export async function myCommand(options: Options) {
  // Your command logic
  
  // Track the event
  await trackEvent("command_executed", {
    command: "myCommand",
    option1: options.option1,
    option2: options.option2,
    success: true,
  });
}
```

### 2.3 Display Telemetry Notice

Show users that you collect anonymous data:

```typescript
export function displayTelemetryNotice(): void {
  if (!isTelemetryEnabled()) {
    return;
  }

  console.log(`
  📊 This CLI collects anonymous usage data to improve the tool.
     No personal information is collected.
     
     To opt-out: export YOUR_CLI_TELEMETRY_DISABLED=1
     Learn more: https://your-docs.com/telemetry
  `);
}
```

## Step 3: (Optional) Create API Secret

API secrets add an extra layer of validation but are not required.

1. In GA4, go to **Admin** → **Data Streams**
2. Click on your stream
3. Scroll down to **Measurement Protocol API secrets**
4. Click **Create**
5. Enter a nickname for the secret
6. Copy the generated secret
7. Add it to your code: `const GA_API_SECRET = "your-secret";`

## Step 4: Configure GA4 for Better CLI Tracking

### 4.1 Disable Automatic Page Views
Since you're tracking a CLI, not a website:

1. Go to **Admin** → **Data Streams** → Your stream
2. Click **Configure tag settings**
3. Under **Settings**, disable unnecessary automatic tracking

### 4.2 Create Custom Dimensions

1. Go to **Admin** → **Custom definitions**
2. Click **Create custom dimension**
3. Add dimensions for your CLI-specific parameters:
   - Dimension name: `CLI Version`
   - Scope: `Event`
   - Event parameter: `cli_version`
4. Repeat for other parameters (framework, features, etc.)

### 4.3 Set Up Events

1. Go to **Admin** → **Events**
2. Mark your custom events as conversions if needed
3. Create event modifications if you need to transform data

## Step 5: Test Your Implementation

### 5.1 Create a Test Script

Create `test-telemetry.js`:

```javascript
const GA_MEASUREMENT_ID = "G-XXXXXXXXXX";
const GA_ENDPOINT = `https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}`;

async function sendTestEvent() {
  const payload = {
    client_id: `test_${Date.now()}`,
    events: [
      {
        name: "test_event",
        params: {
          test_param: "hello",
          engagement_time_msec: "100"
        }
      }
    ]
  };

  const response = await fetch(GA_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  console.log("Status:", response.status); // Should be 204
}

sendTestEvent();
```

### 5.2 Verify in GA4

1. Run your test script: `node test-telemetry.js`
2. Check **Realtime** report (may take 30-60 seconds)
3. Check **DebugView** for immediate feedback
4. After 24 hours, check **Events** report

## Step 6: Create Reports and Dashboards

### 6.1 Exploration Reports

1. Go to **Explore** → **Blank**
2. Add dimensions:
   - Event name
   - Your custom dimensions
3. Add metrics:
   - Event count
   - Users
   - User engagement

### 6.2 Custom Reports

1. Go to **Reports** → **Library**
2. Create new report
3. Design your report layout
4. Save and publish to make it available

### 6.3 Audiences

1. Go to **Configure** → **Audiences**
2. Create segments based on:
   - Feature usage
   - Error patterns
   - User preferences

## Step 7: Privacy and Compliance

### 7.1 Create Privacy Documentation

Document what you collect and why:

```markdown
# Telemetry Policy

## What We Collect
- Command usage
- Feature adoption
- Error types (not content)
- Anonymous system info

## What We DON'T Collect
- Personal information
- File contents
- Environment variables
- IP addresses

## Opt-Out
Set environment variable: YOUR_CLI_TELEMETRY_DISABLED=1
```

### 7.2 GDPR Compliance

- Don't collect personal data
- Provide clear opt-out mechanism
- Document data usage
- Use anonymous identifiers

## Step 8: Monitor and Iterate

### 8.1 Regular Reviews

- Check data quality weekly
- Review top events monthly
- Adjust tracking based on insights

### 8.2 Data Hygiene

- Remove unused events
- Clean up test data
- Archive old reports

### 8.3 Performance Monitoring

- Ensure telemetry doesn't slow CLI
- Use fire-and-forget pattern
- Set reasonable timeouts

## Troubleshooting

### Events Not Showing in Realtime

1. **Wait longer**: Can take up to 3 minutes
2. **Check filters**: Remove any active filters
3. **Verify Measurement ID**: Ensure it's correct
4. **Test with curl**:
   ```bash
   curl -X POST "https://www.google-analytics.com/mp/collect?measurement_id=G-XXXXXXXXXX" \
     -H "Content-Type: application/json" \
     -d '{"client_id":"test","events":[{"name":"test","params":{"engagement_time_msec":"100"}}]}'
   ```

### 204 Response but No Data

- This is normal - 204 means success
- Data processing can be delayed
- Check DebugView for immediate feedback

### Rate Limiting

- GA4 limits: 25 events per batch
- 20 events/second per client
- Implement client-side throttling if needed

## Best Practices

1. **Keep It Anonymous**: Never send PII
2. **Be Transparent**: Always show telemetry notice
3. **Make Opt-Out Easy**: Simple environment variable
4. **Fire and Forget**: Don't block on telemetry
5. **Handle Errors Silently**: Never crash due to telemetry
6. **Batch When Possible**: Send multiple events together
7. **Use Meaningful Names**: Make events self-documenting
8. **Version Your Events**: Include CLI version in all events

## Example Implementation

See the Precast CLI implementation:
- Analytics module: `/packages/cli/src/utils/analytics.ts`
- Integration: `/packages/cli/src/commands/init.ts`
- Documentation: `/packages/cli/docs/TELEMETRY.md`

## Resources

- [GA4 Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/ga4)
- [GA4 Event Builder](https://ga-dev-tools.google/ga4/event-builder/)
- [GA4 Documentation](https://support.google.com/analytics/answer/9304153)
- [Privacy Best Practices](https://support.google.com/analytics/answer/9019185)