# GitHub Metrics Worker

A Cloudflare Worker that fetches and caches GitHub repository metrics using GitHub App authentication. This worker collects repository statistics, issue breakdowns, commit activity, and release information, storing them in Cloudflare R2 for fast access.

## Features

- 🔐 **GitHub App Authentication** with automatic PKCS#1 to PKCS#8 key conversion
- 📊 **Comprehensive Metrics Collection**:
  - Repository stats (stars, forks, watchers, issues)
  - Issue breakdown by labels
  - Commit activity (last 30 days)
  - Release information
  - Contributor count
- 💾 **R2 Storage** for caching metrics data
- ⏰ **Scheduled Updates** every 30 minutes via Cron Triggers
- 🚀 **High Performance** with token caching and parallel API calls
- 🔄 **Manual Refresh** endpoint with rate limiting

## Architecture

```mermaid
graph TB
    subgraph "Client"
        A[Web Application]
    end

    subgraph "Cloudflare Worker"
        B[HTTP Endpoints]
        C[Scheduled Trigger]
        D[GitHub Auth Module]
        E[Data Processor]
        F[GitHub Client]
    end

    subgraph "Storage"
        G[R2 Bucket]
    end

    subgraph "GitHub"
        H[GitHub API]
        I[GitHub App]
    end

    A -->|GET /data| B
    A -->|GET /refresh| B
    A -->|GET /status| B

    C -->|Every 30 min| E
    B --> E

    E --> F
    F --> D
    D -->|JWT Auth| I
    I -->|Installation Token| D
    F -->|Authenticated Requests| H

    E -->|Store Metrics| G
    B -->|Retrieve Cached Data| G

    style A fill:#e1f5fe
    style B fill:#fff3e0
    style C fill:#fff3e0
    style D fill:#f3e5f5
    style E fill:#f3e5f5
    style F fill:#f3e5f5
    style G fill:#e8f5e9
    style H fill:#f5f5f5
    style I fill:#f5f5f5
```

## How It Works

### 1. Authentication Flow

```mermaid
sequenceDiagram
    participant W as Worker
    participant GA as GitHubAuth
    participant GH as GitHub API

    W->>GA: Request Auth Headers
    GA->>GA: Check Token Cache
    alt Token Expired or Missing
        GA->>GA: Convert PKCS#1 to PKCS#8
        GA->>GA: Create JWT with Private Key
        GA->>GH: POST /app/installations/{id}/access_tokens
        GH-->>GA: Installation Token
        GA->>GA: Cache Token (50 min)
    end
    GA-->>W: Return Auth Headers
    W->>GH: API Request with Token
    GH-->>W: Response Data
```

### 2. Data Collection Flow

The worker collects metrics in parallel for optimal performance:

1. **Repository Data**: Stars, forks, watchers, language, license
2. **Contributors**: List of repository contributors
3. **Commits**: Recent commit history (last 100 commits)
4. **Releases**: Published releases
5. **Issues**: Closed issues count and breakdown by labels
6. **Commit Activity**: Daily commit counts for the last 30 days

### 3. Key Conversion (PKCS#1 to PKCS#8)

GitHub provides private keys in PKCS#1 format, but the Web Crypto API requires PKCS#8. The worker automatically converts the key format on the fly:

```javascript
// Automatic conversion happens internally
// No manual conversion needed!
// Just use your GitHub App private key as-is
```

## Setup

### 1. GitHub App Creation

1. Go to GitHub Settings > Developer settings > GitHub Apps
2. Click "New GitHub App"
3. Configure:
   - **Name**: `precast-metrics-app`
   - **Homepage URL**: `https://precast.dev`
   - **Webhook URL**: Leave empty (not needed)
   - **Repository permissions**:
     - Contents: Read
     - Issues: Read
     - Metadata: Read
     - Pull requests: Read
   - **Account permissions**: None needed
4. Generate a private key and save the `.pem` file
5. Note the App ID from the app settings
6. Install the app on the `BuunGroupCore/precast-app` repository
7. Note the Installation ID from the installation URL

### 2. Cloudflare Setup

#### R2 Bucket

```bash
# Create R2 bucket
wrangler r2 bucket create precast-metrics-data

# Optional: Set up custom domain for public access
wrangler r2 bucket domain add precast-metrics-data --domain metrics-data.precast-workers.dev
```

#### Worker Secrets

```bash
# Set secrets (replace with actual values)
wrangler secret put GITHUB_APP_ID
# Enter: 1748004

wrangler secret put GITHUB_APP_PRIVATE_KEY
# Paste the entire private key including headers:
# -----BEGIN RSA PRIVATE KEY-----
# ... key content ...
# -----END RSA PRIVATE KEY-----

wrangler secret put GITHUB_INSTALLATION_ID
# Enter: 79847032
```

### 3. Local Development Setup

Create `.dev.vars` for local testing:

```env
GITHUB_APP_ID="1748004"
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
... your private key content ...
-----END RSA PRIVATE KEY-----"
GITHUB_INSTALLATION_ID="79847032"
```

## Development

### Local Testing

```bash
# Install dependencies
npm install

# Start development server
wrangler dev --port 8787 --local

# In another terminal, test the endpoints
```

### Testing Endpoints with cURL

#### Status Check

```bash
# Check worker status
curl http://localhost:8787/status

# Pretty print with jq
curl -s http://localhost:8787/status | jq '.'

# Expected response:
# {
#   "status": "ok",
#   "hasData": true,
#   "lastUpdated": "2025-08-08T12:55:16.601Z"
# }
```

#### Get Cached Data

```bash
# Get all cached metrics
curl http://localhost:8787/data

# Get specific fields with jq
curl -s http://localhost:8787/data | jq '{
  stars: .repository.stars,
  forks: .repository.forks,
  issues: .issues.totalOpen,
  lastUpdated
}'

# Get issue breakdown
curl -s http://localhost:8787/data | jq '.issues.breakdown'

# Get commit activity
curl -s http://localhost:8787/data | jq '.commits.recentActivity'
```

#### Refresh Data

```bash
# Trigger manual refresh (rate limited to once per 5 minutes)
curl http://localhost:8787/refresh

# Get repository stats after refresh
curl -s http://localhost:8787/refresh | jq '.repository'

# Get only star and fork count
curl -s http://localhost:8787/refresh | jq '{
  stars: .repository.stars,
  forks: .repository.forks,
  contributors: .repository.contributors
}'
```

### Complete Test Script

Create `test-local.sh`:

```bash
#!/bin/bash

echo "🧪 Testing GitHub Metrics Worker"
echo "================================"

BASE_URL="http://localhost:8787"

echo -e "\n📊 1. Status Check:"
curl -s $BASE_URL/status | jq '.'

echo -e "\n📦 2. Get Cached Data:"
curl -s $BASE_URL/data | jq '{
  repository: {
    stars: .repository.stars,
    forks: .repository.forks,
    issues: .repository.openIssues
  },
  lastUpdated
}'

echo -e "\n🔄 3. Refresh Data:"
RESPONSE=$(curl -s $BASE_URL/refresh)
if echo "$RESPONSE" | jq -e . >/dev/null 2>&1; then
  echo "$RESPONSE" | jq '.repository | {stars, forks, contributors}'
else
  echo "$RESPONSE"
fi

echo -e "\n📈 4. Commit Activity:"
curl -s $BASE_URL/data | jq '.commits.recentActivity |
  map(select(.commits > 0)) |
  map({date: .week, commits})'

echo -e "\n🏷️ 5. Issue Breakdown:"
curl -s $BASE_URL/data | jq '.issues.breakdown |
  map(select(.total > 0)) |
  map({label, total, closed})'
```

Make it executable and run:

```bash
chmod +x test-local.sh
./test-local.sh
```

## Data Structure

```json
{
  "timestamp": "2025-08-08T12:55:16.601Z",
  "repository": {
    "stars": 1,
    "forks": 0,
    "watchers": 1,
    "openIssues": 0,
    "closedIssues": 2,
    "contributors": 2,
    "commits": 73,
    "language": "TypeScript",
    "license": "MIT License"
  },
  "issues": {
    "breakdown": [
      {
        "label": "bug",
        "name": "Bug Reports",
        "open": 0,
        "closed": 0,
        "total": 0,
        "icon": "FaBug",
        "color": "text-comic-red"
      },
      {
        "label": "showcase",
        "name": "Showcase Projects",
        "open": 0,
        "closed": 1,
        "total": 1,
        "icon": "FaStar",
        "color": "text-comic-purple"
      }
    ],
    "totalOpen": 0,
    "totalClosed": 2
  },
  "commits": {
    "total": 73,
    "recentActivity": [
      { "week": "8/7", "commits": 34 },
      { "week": "8/8", "commits": 11 }
    ]
  },
  "releases": [],
  "lastUpdated": "2025-08-08T12:55:16.601Z"
}
```

## Deployment

### Deploy to Production

```bash
# Deploy worker
wrangler deploy --env production

# Verify deployment
curl https://api.precast.dev/status
```

### Monitor Production

```bash
# View real-time logs
wrangler tail --env production

# Filter logs
wrangler tail --env production --filter "path:/refresh"

# Check R2 storage
wrangler r2 object get precast-metrics-data/metrics-data.json
```

## Troubleshooting

### Common Issues

#### Authentication Errors

```bash
# Error: Failed to get installation token: 401

# Solution: Verify credentials
wrangler secret list

# Re-add secrets if needed
wrangler secret put GITHUB_APP_ID
```

#### Rate Limiting

```bash
# Error: 429 Too Many Requests

# The worker implements:
# - Token caching (50 minutes)
# - Manual refresh limiting (5 minutes)
# - Scheduled updates (30 minutes)
```

#### 403 Forbidden Errors

```bash
# Error: Request forbidden by administrative rules

# Solution: Worker automatically adds User-Agent header
# If still occurs, check GitHub App permissions
```

### Debug Commands

```bash
# Test with verbose output
curl -v http://localhost:8787/status

# Check specific metrics
curl -s http://localhost:8787/data | jq '.repository'

# Monitor R2 bucket
wrangler r2 object list precast-metrics-data/

# View worker metrics
wrangler metrics show --env production
```

## API Rate Limits

- **GitHub App**: 5,000 requests/hour (vs 60 for unauthenticated)
- **Search API**: 30 requests/minute
- **Installation Token**: Valid for 1 hour (cached for 50 minutes)

## Security

- Private keys are never exposed in responses
- Tokens are cached in memory only
- R2 bucket can be configured for public read access
- Rate limiting prevents abuse

## Contributing

1. Fork the repository
2. Create a feature branch
3. Test locally with `wrangler dev`
4. Submit a pull request

## License

MIT License - See LICENSE file for details
