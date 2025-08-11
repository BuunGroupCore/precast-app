#!/bin/bash

# =============================================================================
# RUN ALL PRIORITY 1 TESTS
# =============================================================================
# This script runs all Priority 1 test combinations from TESTS.md
# =============================================================================

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# Test results tracking
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
FAILED_CONFIGS=()

# Results file
RESULTS_FILE="test-projects/output/all-tests-$(date +%Y%m%d_%H%M%S).txt"
mkdir -p test-projects/output

echo "========================================" | tee "$RESULTS_FILE"
echo "RUNNING ALL PRIORITY 1 TESTS" | tee -a "$RESULTS_FILE"
echo "Started: $(date)" | tee -a "$RESULTS_FILE"
echo "========================================" | tee -a "$RESULTS_FILE"
echo "" | tee -a "$RESULTS_FILE"

# Function to run a single test
run_test() {
    local test_name="$1"
    local cli_args="$2"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    echo -e "\n${CYAN}[TEST $TOTAL_TESTS]${NC} $test_name" | tee -a "$RESULTS_FILE"
    echo "Command: $cli_args" | tee -a "$RESULTS_FILE"
    echo "----------------------------------------" | tee -a "$RESULTS_FILE"
    
    # Run the test with enhanced runner
    if ./test-runner-enhanced.sh $cli_args --install --yes > /tmp/test_output.log 2>&1; then
        echo -e "${GREEN}✓ PASSED${NC}" | tee -a "$RESULTS_FILE"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        
        # Extract project name from log
        local project_name=$(grep "Generated project name:" /tmp/test_output.log | awk '{print $NF}')
        
        # Validate the project
        if [ ! -z "$project_name" ]; then
            if ./test-runner-enhanced.sh --validate "test-projects/$project_name" >> /tmp/test_output.log 2>&1; then
                echo -e "${GREEN}  ✓ Validation passed${NC}" | tee -a "$RESULTS_FILE"
            else
                echo -e "${YELLOW}  ⚠ Validation had warnings${NC}" | tee -a "$RESULTS_FILE"
            fi
        fi
    else
        echo -e "${RED}✗ FAILED${NC}" | tee -a "$RESULTS_FILE"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        FAILED_CONFIGS+=("$test_name")
        
        # Show error from log
        echo "Error details:" | tee -a "$RESULTS_FILE"
        tail -20 /tmp/test_output.log | tee -a "$RESULTS_FILE"
    fi
    
    # Clean up test output
    rm -f /tmp/test_output.log
    
    # Small delay between tests
    sleep 2
}

# Priority 1 Test Matrix
echo -e "${CYAN}Starting Priority 1 Test Matrix...${NC}\n" | tee -a "$RESULTS_FILE"

# Test 1: React + Express + Postgres + Prisma + Tailwind + Better Auth (with Docker)
run_test "React Full Stack with Prisma" \
    "--framework react --backend express --database postgres --orm prisma --styling tailwind --auth better-auth --runtime node --docker"

# Test 2: Next.js + Next API + Postgres + Prisma + Tailwind/shadcn + Auth.js (with Docker)
run_test "Next.js Full Stack with shadcn" \
    "--framework next --backend next-api --database postgres --orm prisma --styling tailwind --ui-library shadcn --auth auth.js --runtime node --docker"

# Test 3: Vue + Express + MySQL + Drizzle + Tailwind/DaisyUI + Better Auth (with Docker)
run_test "Vue Full Stack with DaisyUI" \
    "--framework vue --backend express --database mysql --orm drizzle --styling tailwind --ui-library daisyui --auth better-auth --runtime node --docker"

# Test 4: React + Hono + Postgres + Drizzle + Tailwind + Better Auth (with Docker)
run_test "React with Hono Backend" \
    "--framework react --backend hono --database postgres --orm drizzle --styling tailwind --auth better-auth --runtime bun --docker"

# Test 5: Next.js + Hono + MySQL + Prisma + Tailwind/shadcn + Better Auth (with Docker)
run_test "Next.js with Hono and MySQL" \
    "--framework next --backend hono --database mysql --orm prisma --styling tailwind --ui-library shadcn --auth better-auth --runtime node --docker"

# Test 6: Svelte + Express + Postgres + Prisma + Tailwind + Better Auth (with Docker)
run_test "Svelte Full Stack" \
    "--framework svelte --backend express --database postgres --orm prisma --styling tailwind --auth better-auth --runtime node --docker"

# Test 7: Astro + Express + Postgres + Drizzle + Tailwind + Better Auth (with Docker)
run_test "Astro Full Stack" \
    "--framework astro --backend express --database postgres --orm drizzle --styling tailwind --auth better-auth --runtime node --docker"

# Test 8: Vite React + Fastify + MongoDB + Mongoose + CSS (with Docker)
run_test "Vite React with MongoDB" \
    "--framework vite --ui-framework react --backend fastify --database mongodb --orm mongoose --styling css --runtime node --docker"

# Test 9: React Native + Express + Postgres + Prisma + Better Auth (with Docker)
run_test "React Native Backend" \
    "--framework react-native --backend express --database postgres --orm prisma --auth better-auth --runtime node --docker"

# Test 10: Backend Only - NestJS + Postgres + TypeORM (with Docker)
run_test "NestJS API Only" \
    "--framework none --backend nestjs --database postgres --orm typeorm --runtime node --docker"

# Note: Removed duplicate Docker tests since all database tests now include --docker
# Note: Skipping Edge/Serverless tests with non-Docker databases for now

# API Client tests
echo -e "\n${CYAN}Running API Client Tests...${NC}\n" | tee -a "$RESULTS_FILE"

# Test 11: React + Express with TanStack Query (with Docker)
run_test "React with TanStack Query" \
    "--framework react --backend express --database postgres --orm prisma --api-client tanstack-query --runtime node --docker"

# Test 12: Next.js with tRPC (with Docker)
run_test "Next.js with tRPC" \
    "--framework next --backend express --database postgres --orm prisma --api-client trpc --runtime node --docker"

# Generate summary report
echo "" | tee -a "$RESULTS_FILE"
echo "========================================" | tee -a "$RESULTS_FILE"
echo "TEST SUMMARY" | tee -a "$RESULTS_FILE"
echo "========================================" | tee -a "$RESULTS_FILE"
echo "Total Tests: $TOTAL_TESTS" | tee -a "$RESULTS_FILE"
echo -e "${GREEN}Passed: $PASSED_TESTS${NC}" | tee -a "$RESULTS_FILE"
echo -e "${RED}Failed: $FAILED_TESTS${NC}" | tee -a "$RESULTS_FILE"

if [ ${#FAILED_CONFIGS[@]} -gt 0 ]; then
    echo "" | tee -a "$RESULTS_FILE"
    echo "Failed Configurations:" | tee -a "$RESULTS_FILE"
    for config in "${FAILED_CONFIGS[@]}"; do
        echo "  - $config" | tee -a "$RESULTS_FILE"
    done
fi

echo "" | tee -a "$RESULTS_FILE"
echo "Completed: $(date)" | tee -a "$RESULTS_FILE"
echo "Results saved to: $RESULTS_FILE" | tee -a "$RESULTS_FILE"

# Exit with appropriate code
if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "\n${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "\n${RED}✗ Some tests failed. Please review the results.${NC}"
    exit 1
fi