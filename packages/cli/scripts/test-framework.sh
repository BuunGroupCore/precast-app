#!/bin/bash

# =============================================================================
# TEST SPECIFIC FRAMEWORK
# =============================================================================
# Tests a specific framework with various backend/database combinations
# Usage: ./test-framework.sh <framework>
# Example: ./test-framework.sh react
# =============================================================================

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Check arguments
if [ -z "$1" ]; then
    echo -e "${RED}Error: Framework name required${NC}"
    echo "Usage: ./test-framework.sh <framework>"
    echo "Available frameworks: react, vue, svelte, next, astro, vite, vanilla, react-native"
    exit 1
fi

FRAMEWORK="$1"
RESULTS_FILE="../test-projects/output/framework-${FRAMEWORK}-$(date +%Y%m%d_%H%M%S).txt"
mkdir -p ../test-projects/output

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

echo "========================================" | tee "$RESULTS_FILE"
echo "TESTING FRAMEWORK: $FRAMEWORK" | tee -a "$RESULTS_FILE"
echo "Started: $(date)" | tee -a "$RESULTS_FILE"
echo "========================================" | tee -a "$RESULTS_FILE"
echo "" | tee -a "$RESULTS_FILE"

# Function to run a test
run_test() {
    local test_name="$1"
    local cli_args="$2"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    echo -e "\n${CYAN}[TEST $TOTAL_TESTS]${NC} $test_name" | tee -a "$RESULTS_FILE"
    echo "Command: ./test-runner.sh --framework $FRAMEWORK $cli_args" | tee -a "$RESULTS_FILE"
    
    if ./test-runner.sh --framework "$FRAMEWORK" $cli_args --install --yes > /tmp/framework_test.log 2>&1; then
        echo -e "${GREEN}✓ PASSED${NC}" | tee -a "$RESULTS_FILE"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}✗ FAILED${NC}" | tee -a "$RESULTS_FILE"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        echo "Error:" | tee -a "$RESULTS_FILE"
        tail -10 /tmp/framework_test.log | tee -a "$RESULTS_FILE"
    fi
    
    rm -f /tmp/framework_test.log
    sleep 2
}

# Define test combinations based on framework
case "$FRAMEWORK" in
    "react"|"vue"|"svelte")
        echo -e "${PURPLE}Testing standard frontend framework: $FRAMEWORK${NC}\n"
        
        # Test with different backends (with Docker for databases)
        run_test "$FRAMEWORK + Express + PostgreSQL" \
            "--backend express --database postgres --orm prisma --styling tailwind --runtime node --docker"
        
        run_test "$FRAMEWORK + Hono + MySQL" \
            "--backend hono --database mysql --orm drizzle --styling tailwind --runtime bun --docker"
        
        run_test "$FRAMEWORK + Fastify + MongoDB" \
            "--backend fastify --database mongodb --orm mongoose --styling css --runtime node --docker"
        
        run_test "$FRAMEWORK + No Backend" \
            "--backend none --database none --orm none --styling tailwind --runtime node"
        
        # Test with UI libraries (if Tailwind)
        if [ "$FRAMEWORK" = "react" ]; then
            run_test "$FRAMEWORK + shadcn/ui" \
                "--backend express --database postgres --orm prisma --styling tailwind --ui-library shadcn --runtime node --docker"
        fi
        
        run_test "$FRAMEWORK + DaisyUI" \
            "--backend express --database postgres --orm prisma --styling tailwind --ui-library daisyui --runtime node --docker"
        
        # Test with authentication (with Docker for databases)
        run_test "$FRAMEWORK + Better Auth" \
            "--backend express --database postgres --orm prisma --styling tailwind --auth better-auth --runtime node --docker"
        
        run_test "$FRAMEWORK + Supabase Auth" \
            "--backend express --database postgres --orm prisma --styling tailwind --auth supabase-auth --runtime node --docker"
        
        # Already testing with Docker in all database tests above
        ;;
        
    "next")
        echo -e "${PURPLE}Testing Next.js framework${NC}\n"
        
        # Next.js specific tests (with Docker for databases)
        run_test "Next.js + API Routes" \
            "--backend next-api --database postgres --orm prisma --styling tailwind --runtime node --docker"
        
        run_test "Next.js + External Backend (Hono)" \
            "--backend hono --database mysql --orm drizzle --styling tailwind --runtime bun --docker"
        
        run_test "Next.js + shadcn/ui" \
            "--backend next-api --database postgres --orm prisma --styling tailwind --ui-library shadcn --runtime node --docker"
        
        run_test "Next.js + Auth.js" \
            "--backend next-api --database postgres --orm prisma --styling tailwind --auth auth.js --runtime node --docker"
        
        run_test "Next.js + tRPC" \
            "--backend next-api --database postgres --orm prisma --api-client trpc --runtime node --docker"
        ;;
        
    "astro")
        echo -e "${PURPLE}Testing Astro framework${NC}\n"
        
        run_test "Astro + Express Backend" \
            "--backend express --database postgres --orm drizzle --styling tailwind --runtime node --docker"
        
        # Skipping Cloudflare D1 for now (not Docker-based)
        
        run_test "Astro + No Backend (Static)" \
            "--backend none --database none --orm none --styling tailwind --runtime node"
        ;;
        
    "vite")
        echo -e "${PURPLE}Testing Vite with UI frameworks${NC}\n"
        
        # Test Vite with different UI frameworks (with Docker for databases)
        for ui in "react" "vue" "svelte" "vanilla"; do
            run_test "Vite + $ui" \
                "--ui-framework $ui --backend express --database postgres --orm prisma --styling tailwind --runtime node --docker"
        done
        ;;
        
    "react-native")
        echo -e "${PURPLE}Testing React Native${NC}\n"
        
        run_test "React Native + Express API" \
            "--backend express --database postgres --orm prisma --auth better-auth --runtime node --docker"
        
        run_test "React Native + NestJS API" \
            "--backend nestjs --database postgres --orm typeorm --runtime node --docker"
        ;;
        
    "vanilla")
        echo -e "${PURPLE}Testing Vanilla JavaScript${NC}\n"
        
        run_test "Vanilla JS + Express" \
            "--backend express --database postgres --orm none --styling css --runtime node --docker"
        
        run_test "Vanilla JS + No Backend" \
            "--backend none --database none --orm none --styling css --runtime node"
        ;;
        
    "none")
        echo -e "${PURPLE}Testing Backend-only configurations${NC}\n"
        
        run_test "Express API" \
            "--backend express --database postgres --orm prisma --runtime node --docker"
        
        run_test "NestJS API" \
            "--backend nestjs --database postgres --orm typeorm --runtime node --docker"
        
        run_test "Hono API" \
            "--backend hono --database mysql --orm drizzle --runtime bun --docker"
        
        # Skipping Cloudflare D1 for now (not Docker-based)
        ;;
        
    *)
        echo -e "${RED}Unknown framework: $FRAMEWORK${NC}"
        exit 1
        ;;
esac

# Summary
echo "" | tee -a "$RESULTS_FILE"
echo "========================================" | tee -a "$RESULTS_FILE"
echo "TEST SUMMARY FOR $FRAMEWORK" | tee -a "$RESULTS_FILE"
echo "========================================" | tee -a "$RESULTS_FILE"
echo "Total Tests: $TOTAL_TESTS" | tee -a "$RESULTS_FILE"
echo -e "${GREEN}Passed: $PASSED_TESTS${NC}" | tee -a "$RESULTS_FILE"
echo -e "${RED}Failed: $FAILED_TESTS${NC}" | tee -a "$RESULTS_FILE"
echo "Success Rate: $(( PASSED_TESTS * 100 / TOTAL_TESTS ))%" | tee -a "$RESULTS_FILE"
echo "" | tee -a "$RESULTS_FILE"
echo "Completed: $(date)" | tee -a "$RESULTS_FILE"
echo "Results saved to: $RESULTS_FILE" | tee -a "$RESULTS_FILE"

# Exit code
if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "\n${GREEN}✓ All $FRAMEWORK tests passed!${NC}"
    exit 0
else
    echo -e "\n${RED}✗ $FAILED_TESTS $FRAMEWORK tests failed${NC}"
    exit 1
fi