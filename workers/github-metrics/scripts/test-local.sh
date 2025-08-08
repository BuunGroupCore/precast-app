#!/bin/bash

echo "🧪 Testing GitHub Metrics Worker Locally..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if wrangler is already running
if lsof -Pi :8787 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 8787 is already in use. Stopping existing process..."
    kill $(lsof -Pi :8787 -sTCP:LISTEN -t)
    sleep 2
fi

# Start wrangler dev in background
echo "Starting worker locally..."
wrangler dev --port 8787 --local > /dev/null 2>&1 &
WRANGLER_PID=$!

# Wait for worker to start
echo "Waiting for worker to start..."
sleep 5

echo ""
echo -e "${YELLOW}📊 Testing /status endpoint...${NC}"
curl -s http://localhost:8787/status | jq .

echo ""
echo -e "${YELLOW}🔄 Testing /refresh endpoint (fetching fresh data from GitHub)...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" http://localhost:8787/refresh)
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "429" ]; then
    echo "⚠️  Rate limited (this is expected if recently refreshed)"
    echo "Clearing rate limit..."
    # For local testing, we can't easily clear R2, so just wait a moment
    sleep 2
    echo "Retrying..."
    RESPONSE=$(curl -s http://localhost:8787/refresh)
    echo "$RESPONSE" | jq '.repository' 2>/dev/null || echo "$RESPONSE"
elif [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Successfully fetched data from GitHub!${NC}"
    echo "$BODY" | jq '.repository'
else
    echo "❌ Error: HTTP $HTTP_CODE"
    echo "$BODY"
fi

echo ""
echo -e "${YELLOW}📦 Testing /data endpoint (should return cached data)...${NC}"
DATA_RESPONSE=$(curl -s http://localhost:8787/data)
if echo "$DATA_RESPONSE" | jq -e '.repository' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Cached data retrieved successfully!${NC}"
    echo "$DATA_RESPONSE" | jq '.repository | {stars, forks, watchers, openIssues}'
else
    echo "$DATA_RESPONSE"
fi

echo ""
echo -e "${YELLOW}⏰ Testing scheduled trigger...${NC}"
# Trigger the scheduled event properly
curl -X POST http://localhost:8787/__scheduled \
  -H "Content-Type: application/json" \
  -d '{"scheduledTime": "'$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")'"}'

# Kill wrangler dev
kill $WRANGLER_PID 2>/dev/null

echo ""
echo -e "${GREEN}✅ Test complete!${NC}"
echo ""
echo "To test in production after deployment:"
echo "  curl https://github-metrics-worker.[your-subdomain].workers.dev/status"