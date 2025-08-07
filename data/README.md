# Analytics Data Directory

This directory contains automatically generated analytics data from the Precast CLI usage via Google Analytics 4.

## Files

- **`analytics.json`** - Complete structured analytics data for website consumption
- **`analytics.csv`** - CSV format analytics data for external tools
- **`.gitkeep`** - Ensures directory is tracked in git

## Data Source

Data is fetched every 6 hours via GitHub Actions from GA4 using the Measurement Protocol.

## Usage

Your website can consume the JSON data directly:

```javascript
// Fetch analytics data for display
fetch('/data/analytics.json')
  .then(res => res.json())
  .then(data => {
    console.log('Total projects created:', data.totals.projects);
    console.log('Popular frameworks:', data.frameworks);
    console.log('Top stacks:', data.popularStacks);
  });
```

## Data Structure

The JSON file contains:

```javascript
{
  "updated": "2024-01-01T12:00:00.000Z",
  "lastUpdatedFormatted": "January 1, 2024 at 12:00 PM UTC",
  "totals": {
    "projects": 1234,
    "users": 567,
    "totalEvents": 2345
  },
  "frameworks": { "react": 500, "vue": 300, ... },
  "databases": { "postgres": 400, "mysql": 200, ... },
  "popularStacks": [
    {
      "framework": "react",
      "backend": "express", 
      "database": "postgres",
      "count": 67,
      "percentage": "15.2"
    }
  ]
}
```

## Automation

The analytics data updates automatically via `.github/workflows/update-analytics.yml`.

Manual updates can be triggered via:
- GitHub Actions UI → "Update Analytics Data" → "Run workflow"
- Or by running `node scripts/fetch-analytics.js` locally (requires GA4 credentials)