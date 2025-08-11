#!/bin/bash

# =============================================================================
# PRECAST CLI ENHANCED TEST RUNNER
# =============================================================================
#
# Enhanced version with comprehensive validation and automated checks
#
# USAGE:
#   ./test-runner-enhanced.sh [CLI_OPTIONS]
#   ./test-runner-enhanced.sh --validate PROJECT_PATH
#   ./test-runner-enhanced.sh --report
#
# =============================================================================

set -e # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Global variables
CLI_ARGS="$@"
PROJECT_NAME=""
TEST_DIR=""
DOCKER_STARTED=false
DEV_PID=""
BACKEND_PID=""
CLEANUP_PERFORMED=false
LOG_DIR=""
LOG_FILE=""
VALIDATION_REPORT=""
TEST_RESULTS_FILE=""

# Test validation results
VALIDATION_PASSED=true
VALIDATION_ERRORS=()
VALIDATION_WARNINGS=()

# Logging functions
log_to_file() {
    if [ ! -z "$LOG_FILE" ] && [ -f "$LOG_FILE" ]; then
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
    fi
}

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
    log_to_file "[INFO] $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
    log_to_file "[SUCCESS] $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
    log_to_file "[WARNING] $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    log_to_file "[ERROR] $1"
}

log_step() {
    echo -e "\n${PURPLE}[STEP]${NC} $1"
    log_to_file "\n[STEP] $1"
}

# Cleanup function
cleanup() {
    if [ "$CLEANUP_PERFORMED" = true ]; then
        return
    fi
    CLEANUP_PERFORMED=true
    
    log_step "Stopping services..."
    
    # Kill development servers if running
    if [ ! -z "$DEV_PID" ]; then
        log_info "Stopping frontend server (PID: $DEV_PID)"
        kill -TERM "$DEV_PID" 2>/dev/null || true
        sleep 2
        kill -KILL "$DEV_PID" 2>/dev/null || true
    fi
    
    if [ ! -z "$BACKEND_PID" ]; then
        log_info "Stopping backend server (PID: $BACKEND_PID)"
        kill -TERM "$BACKEND_PID" 2>/dev/null || true
        sleep 2
        kill -KILL "$BACKEND_PID" 2>/dev/null || true
    fi
    
    # Stop Docker containers if they were started
    if [ "$DOCKER_STARTED" = true ] && [ ! -z "$TEST_DIR" ]; then
        log_info "Stopping Docker containers"
        cd "$TEST_DIR" 2>/dev/null || true
        if [ -f "docker/docker-compose.yml" ]; then
            cd docker 2>/dev/null || true
        fi
        docker compose down --volumes --remove-orphans 2>/dev/null || true
    fi
    
    # Additional cleanup for any remaining Docker resources
    log_info "Final Docker cleanup..."
    cleanup_existing_docker 2>/dev/null || true
    
    # Save validation report
    if [ ! -z "$VALIDATION_REPORT" ]; then
        echo "$VALIDATION_REPORT" > "$TEST_DIR/validation-report.txt"
        log_info "Validation report saved to: $TEST_DIR/validation-report.txt"
    fi
    
    log_success "Cleanup completed"
}

# Set up signal handlers
trap cleanup EXIT
trap cleanup INT
trap cleanup TERM

# Setup logging
setup_logging() {
    LOG_DIR="test-projects/output"
    mkdir -p "$LOG_DIR"
    
    local timestamp=$(date +%Y%m%d_%H%M%S)
    LOG_FILE="$LOG_DIR/test_${timestamp}.log"
    TEST_RESULTS_FILE="$LOG_DIR/results_${timestamp}.json"
    
    echo "========================================" > "$LOG_FILE"
    echo "PRECAST CLI ENHANCED TEST RUNNER LOG" >> "$LOG_FILE"
    echo "Started: $(date)" >> "$LOG_FILE"
    echo "Command: $0 $CLI_ARGS" >> "$LOG_FILE"
    echo "========================================" >> "$LOG_FILE"
    echo "" >> "$LOG_FILE"
    
    log_success "Logging to: $LOG_FILE"
}

# Generate unique project name
generate_project_name() {
    local timestamp=$(date +%Y%m%d%H%M%S)
    local random=$(shuf -i 1000-9999 -n 1 2>/dev/null || echo $RANDOM)
    PROJECT_NAME="test-project-${timestamp}-${random}"
    TEST_DIR="test-projects/$PROJECT_NAME"
    
    log_info "Generated project name: $PROJECT_NAME"
    log_info "Test directory: $TEST_DIR"
}

# Validate environment
validate_environment() {
    log_step "Validating environment"
    
    if [ ! -f "dist/cli.js" ]; then
        log_error "Must be run from packages/cli/ directory (dist/cli.js not found)"
        exit 1
    fi
    
    if [ -z "$CLI_ARGS" ]; then
        log_error "No CLI arguments provided"
        exit 1
    fi
    
    # Check for Docker if --docker flag is present
    if echo "$CLI_ARGS" | grep -q "\--docker"; then
        if ! command -v docker >/dev/null 2>&1; then
            log_error "Docker is required when using --docker flag"
            exit 1
        fi
        if ! docker info >/dev/null 2>&1; then
            log_error "Docker daemon is not running"
            exit 1
        fi
    fi
    
    log_success "Environment validation passed"
}

# Create test project
create_project() {
    log_step "Creating test project"
    
    mkdir -p test-projects
    
    # Build CLI if needed
    if [ ! -f "dist/cli.js" ] || [ "src" -nt "dist" ]; then
        log_info "Building CLI..."
        bun run build
    fi
    
    local cli_path="$(pwd)/dist/cli.js"
    local cmd="node $cli_path init $PROJECT_NAME $CLI_ARGS --yes --install --no-git --pm bun"
    log_info "Running: $cmd"
    
    cd test-projects
    if eval "$cmd"; then
        log_success "Project created successfully"
    else
        log_error "Failed to create project"
        exit 1
    fi
    cd - >/dev/null
}

# Comprehensive validation function
validate_project() {
    log_step "Running comprehensive project validation"
    
    local project_path="${1:-$TEST_DIR}"
    cd "$project_path"
    
    VALIDATION_REPORT="=== PROJECT VALIDATION REPORT ===\n"
    VALIDATION_REPORT+="Project: $(basename $project_path)\n"
    VALIDATION_REPORT+="Date: $(date)\n\n"
    
    # 1. Check file structure
    log_info "Validating file structure..."
    local required_files=("package.json" ".gitignore")
    local missing_files=()
    
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            missing_files+=("$file")
            VALIDATION_ERRORS+=("Missing required file: $file")
        fi
    done
    
    if [ ${#missing_files[@]} -eq 0 ]; then
        log_success "✓ File structure valid"
        VALIDATION_REPORT+="✓ File structure: PASS\n"
    else
        log_error "✗ Missing files: ${missing_files[*]}"
        VALIDATION_REPORT+="✗ File structure: FAIL (missing: ${missing_files[*]})\n"
        VALIDATION_PASSED=false
    fi
    
    # 2. Validate package.json
    log_info "Validating package.json..."
    if [ -f "package.json" ]; then
        if jq empty package.json 2>/dev/null; then
            local has_scripts=$(jq '.scripts | has("dev", "build")' package.json)
            if [ "$has_scripts" = "true" ]; then
                log_success "✓ package.json valid with required scripts"
                VALIDATION_REPORT+="✓ package.json: PASS\n"
            else
                log_warning "⚠ package.json missing dev or build scripts"
                VALIDATION_REPORT+="⚠ package.json: WARNING (missing scripts)\n"
                VALIDATION_WARNINGS+=("Missing dev or build scripts")
            fi
        else
            log_error "✗ Invalid JSON in package.json"
            VALIDATION_REPORT+="✗ package.json: FAIL (invalid JSON)\n"
            VALIDATION_ERRORS+=("Invalid package.json")
            VALIDATION_PASSED=false
        fi
    fi
    
    # 3. Check TypeScript configuration (if applicable)
    if [ -f "tsconfig.json" ]; then
        log_info "Validating TypeScript configuration..."
        if jq empty tsconfig.json 2>/dev/null; then
            log_success "✓ tsconfig.json valid"
            VALIDATION_REPORT+="✓ TypeScript config: PASS\n"
        else
            log_error "✗ Invalid tsconfig.json"
            VALIDATION_REPORT+="✗ TypeScript config: FAIL\n"
            VALIDATION_ERRORS+=("Invalid tsconfig.json")
            VALIDATION_PASSED=false
        fi
    fi
    
    # 4. Check ESLint configuration
    if [ -f ".eslintrc.json" ] || [ -f ".eslintrc.js" ] || [ -f "eslint.config.js" ]; then
        log_info "Found ESLint configuration"
        VALIDATION_REPORT+="✓ ESLint config: FOUND\n"
    else
        log_warning "⚠ No ESLint configuration found"
        VALIDATION_REPORT+="⚠ ESLint config: NOT FOUND\n"
        VALIDATION_WARNINGS+=("No ESLint configuration")
    fi
    
    # 5. Check Prettier configuration
    if [ -f ".prettierrc" ] || [ -f ".prettierrc.json" ] || [ -f "prettier.config.js" ]; then
        log_info "Found Prettier configuration"
        VALIDATION_REPORT+="✓ Prettier config: FOUND\n"
    else
        log_warning "⚠ No Prettier configuration found"
        VALIDATION_REPORT+="⚠ Prettier config: NOT FOUND\n"
        VALIDATION_WARNINGS+=("No Prettier configuration")
    fi
    
    # 6. Check Docker configuration (if --docker was used)
    if echo "$CLI_ARGS" | grep -q "\--docker"; then
        log_info "Validating Docker configuration..."
        if [ -f "docker-compose.yml" ] || [ -f "docker/docker-compose.yml" ]; then
            log_success "✓ Docker Compose file found"
            VALIDATION_REPORT+="✓ Docker config: PASS\n"
        else
            log_error "✗ Docker Compose file missing"
            VALIDATION_REPORT+="✗ Docker config: FAIL\n"
            VALIDATION_ERRORS+=("Docker Compose file missing")
            VALIDATION_PASSED=false
        fi
    fi
    
    # 7. Check database configuration (if database was selected)
    if echo "$CLI_ARGS" | grep -q "\--database" && ! echo "$CLI_ARGS" | grep -q "\--database none"; then
        log_info "Validating database configuration..."
        if [ -f ".env" ] || [ -f ".env.example" ]; then
            log_success "✓ Environment configuration found"
            VALIDATION_REPORT+="✓ Database config: PASS\n"
        else
            log_warning "⚠ No environment configuration found"
            VALIDATION_REPORT+="⚠ Database config: WARNING\n"
            VALIDATION_WARNINGS+=("No environment configuration")
        fi
    fi
    
    cd - >/dev/null
    
    # Generate summary
    VALIDATION_REPORT+="\n=== SUMMARY ===\n"
    VALIDATION_REPORT+="Errors: ${#VALIDATION_ERRORS[@]}\n"
    VALIDATION_REPORT+="Warnings: ${#VALIDATION_WARNINGS[@]}\n"
    
    if [ "$VALIDATION_PASSED" = true ]; then
        VALIDATION_REPORT+="Result: PASS ✓\n"
        log_success "Validation PASSED with ${#VALIDATION_WARNINGS[@]} warnings"
    else
        VALIDATION_REPORT+="Result: FAIL ✗\n"
        log_error "Validation FAILED with ${#VALIDATION_ERRORS[@]} errors"
    fi
    
    echo -e "$VALIDATION_REPORT"
}

# Run code quality checks
run_code_checks() {
    log_step "Running code quality checks"
    
    cd "$TEST_DIR"
    
    # Detect package manager
    local pkg_manager="bun"
    if [ ! -f "bun.lockb" ] && [ -f "package-lock.json" ]; then
        pkg_manager="npm"
    elif [ ! -f "bun.lockb" ] && [ -f "yarn.lock" ]; then
        pkg_manager="yarn"
    fi
    
    log_info "Using package manager: $pkg_manager"
    
    local check_results="=== CODE QUALITY CHECKS ===\n\n"
    
    # Run Prettier check
    log_info "Running Prettier check..."
    local prettier_errors=""
    case $pkg_manager in
        "bun")
            prettier_errors=$(bun run format:check 2>&1 || true)
            ;;
        "npm")
            prettier_errors=$(npm run format:check 2>&1 || true)
            ;;
        "yarn")
            prettier_errors=$(yarn format:check 2>&1 || true)
            ;;
    esac
    
    if echo "$prettier_errors" | grep -q "error\|Error\|failed"; then
        log_error "✗ Prettier check failed"
        check_results+="Prettier: FAIL ✗\n"
        VALIDATION_ERRORS+=("Prettier formatting errors")
        VALIDATION_PASSED=false
    else
        log_success "✓ Prettier check passed"
        check_results+="Prettier: PASS ✓\n"
    fi
    
    # Run ESLint
    log_info "Running ESLint..."
    local eslint_errors=""
    case $pkg_manager in
        "bun")
            eslint_errors=$(bun run lint 2>&1 || true)
            ;;
        "npm")
            eslint_errors=$(npm run lint 2>&1 || true)
            ;;
        "yarn")
            eslint_errors=$(yarn lint 2>&1 || true)
            ;;
    esac
    
    if echo "$eslint_errors" | grep -q "error\|Error"; then
        log_error "✗ ESLint check failed"
        check_results+="ESLint: FAIL ✗\n"
        VALIDATION_ERRORS+=("ESLint errors")
        VALIDATION_PASSED=false
    else
        log_success "✓ ESLint check passed"
        check_results+="ESLint: PASS ✓\n"
    fi
    
    # Run TypeScript check (if applicable)
    if [ -f "tsconfig.json" ]; then
        log_info "Running TypeScript check..."
        local tsc_errors=""
        case $pkg_manager in
            "bun")
                tsc_errors=$(bunx tsc --noEmit 2>&1 || true)
                ;;
            "npm")
                tsc_errors=$(npx tsc --noEmit 2>&1 || true)
                ;;
            "yarn")
                tsc_errors=$(yarn tsc --noEmit 2>&1 || true)
                ;;
        esac
        
        if echo "$tsc_errors" | grep -q "error TS"; then
            log_error "✗ TypeScript check failed"
            check_results+="TypeScript: FAIL ✗\n"
            VALIDATION_ERRORS+=("TypeScript compilation errors")
            VALIDATION_PASSED=false
        else
            log_success "✓ TypeScript check passed"
            check_results+="TypeScript: PASS ✓\n"
        fi
    fi
    
    # Run build check
    log_info "Running build check..."
    local build_result=""
    case $pkg_manager in
        "bun")
            build_result=$(bun run build 2>&1 || echo "FAILED")
            ;;
        "npm")
            build_result=$(npm run build 2>&1 || echo "FAILED")
            ;;
        "yarn")
            build_result=$(yarn build 2>&1 || echo "FAILED")
            ;;
    esac
    
    if echo "$build_result" | grep -q "FAILED\|error\|Error"; then
        log_error "✗ Build check failed"
        check_results+="Build: FAIL ✗\n"
        VALIDATION_ERRORS+=("Build failed")
        VALIDATION_PASSED=false
    else
        log_success "✓ Build check passed"
        check_results+="Build: PASS ✓\n"
    fi
    
    echo -e "$check_results" >> "$LOG_FILE"
    VALIDATION_REPORT+="\n$check_results"
    
    cd - >/dev/null
}

# Clean up existing Docker resources
cleanup_existing_docker() {
    log_info "Cleaning up existing Docker resources..."
    
    # Stop and remove any containers with postgres or pgadmin
    local existing_containers=$(docker ps -a --format "{{.Names}}" | grep -E "(postgres|pgadmin)" || true)
    if [ ! -z "$existing_containers" ]; then
        log_info "Stopping existing postgres/pgadmin containers..."
        echo "$existing_containers" | xargs -r docker stop
        echo "$existing_containers" | xargs -r docker rm
    fi
    
    # Remove any volumes with postgres or pgadmin
    local existing_volumes=$(docker volume ls --format "{{.Name}}" | grep -E "(postgres|pgadmin)" || true)
    if [ ! -z "$existing_volumes" ]; then
        log_info "Removing existing postgres/pgadmin volumes..."
        echo "$existing_volumes" | xargs -r docker volume rm
    fi
    
    # Clean up any networks that might conflict
    local existing_networks=$(docker network ls --format "{{.Name}}" | grep -E "test_project.*network" || true)
    if [ ! -z "$existing_networks" ]; then
        log_info "Removing existing test project networks..."
        echo "$existing_networks" | xargs -r docker network rm 2>/dev/null || true
    fi
    
    # Kill any processes using ports 5432, 5050, 3001, 5173
    log_info "Killing processes on conflicting ports..."
    for port in 5432 5050 3001 5173; do
        local pids=$(lsof -ti:$port 2>/dev/null || true)
        if [ ! -z "$pids" ]; then
            log_info "Killing process on port $port (PIDs: $pids)"
            echo "$pids" | xargs -r kill -9
        fi
    done
    
    log_success "Docker cleanup completed"
}

# Start Docker if needed
start_docker() {
    if echo "$CLI_ARGS" | grep -q "\--docker"; then
        log_step "Starting Docker containers"
        
        # Always clean up existing resources first
        cleanup_existing_docker
        
        cd "$TEST_DIR"
        
        if [ -f "docker-compose.yml" ] || [ -f "docker/docker-compose.yml" ]; then
            log_info "Found docker-compose.yml, starting containers..."
            
            if [ -f "docker/docker-compose.yml" ]; then
                cd docker
            fi
            
            if docker compose up -d; then
                DOCKER_STARTED=true
                log_success "Docker containers started"
                
                # Wait for containers to be ready
                log_info "Waiting for containers to be ready..."
                sleep 10
                
                # Check container health
                local containers=$(docker compose ps --format json | jq -r '.[].Name')
                for container in $containers; do
                    local health=$(docker inspect $container | jq -r '.[0].State.Health.Status // "none"')
                    if [ "$health" = "healthy" ] || [ "$health" = "none" ]; then
                        log_success "✓ Container $container is ready"
                    else
                        log_warning "⚠ Container $container health: $health"
                    fi
                done
            else
                log_error "Failed to start Docker containers"
                VALIDATION_ERRORS+=("Docker containers failed to start")
                VALIDATION_PASSED=false
            fi
        else
            log_warning "docker-compose.yml not found"
            VALIDATION_WARNINGS+=("Docker Compose file not found")
        fi
        
        cd - >/dev/null
    fi
}

# Test API endpoints
test_api_endpoints() {
    log_step "Testing API endpoints"
    
    # Check if backend exists
    if echo "$CLI_ARGS" | grep -q "\--backend none"; then
        log_info "No backend to test"
        return
    fi
    
    log_info "Waiting for API to be ready..."
    sleep 5
    
    # Test health endpoint
    local api_url="http://localhost:3001"
    if curl -s -o /dev/null -w "%{http_code}" "$api_url/health" | grep -q "200\|204"; then
        log_success "✓ Health endpoint responding"
        VALIDATION_REPORT+="✓ API Health Check: PASS\n"
    else
        log_warning "⚠ Health endpoint not responding"
        VALIDATION_REPORT+="⚠ API Health Check: FAIL\n"
        VALIDATION_WARNINGS+=("API health endpoint not responding")
    fi
}

# Run development servers
run_dev_servers() {
    log_step "Starting development servers"
    
    cd "$TEST_DIR"
    
    # Detect package manager
    local pkg_manager="bun"
    if [ ! -f "bun.lockb" ] && [ -f "package-lock.json" ]; then
        pkg_manager="npm"
    elif [ ! -f "bun.lockb" ] && [ -f "yarn.lock" ]; then
        pkg_manager="yarn"
    fi
    
    # Check if monorepo
    if [ -d "apps" ]; then
        log_info "Detected monorepo structure"
        
        # Start backend if exists
        if [ -d "apps/api" ] || [ -d "apps/backend" ]; then
            log_info "Starting backend server..."
            case $pkg_manager in
                "bun")
                    (cd apps/api 2>/dev/null || cd apps/backend; bun run dev) &
                    ;;
                "npm")
                    (cd apps/api 2>/dev/null || cd apps/backend; npm run dev) &
                    ;;
                "yarn")
                    (cd apps/api 2>/dev/null || cd apps/backend; yarn dev) &
                    ;;
            esac
            BACKEND_PID=$!
            log_success "Backend server started (PID: $BACKEND_PID)"
        fi
        
        # Start frontend if exists
        if [ -d "apps/web" ] || [ -d "apps/frontend" ]; then
            log_info "Starting frontend server..."
            sleep 3 # Let backend start first
            case $pkg_manager in
                "bun")
                    (cd apps/web 2>/dev/null || cd apps/frontend; bun run dev) &
                    ;;
                "npm")
                    (cd apps/web 2>/dev/null || cd apps/frontend; npm run dev) &
                    ;;
                "yarn")
                    (cd apps/web 2>/dev/null || cd apps/frontend; yarn dev) &
                    ;;
            esac
            DEV_PID=$!
            log_success "Frontend server started (PID: $DEV_PID)"
        fi
    else
        # Single app structure
        log_info "Starting development server..."
        case $pkg_manager in
            "bun")
                bun run dev &
                ;;
            "npm")
                npm run dev &
                ;;
            "yarn")
                yarn dev &
                ;;
        esac
        DEV_PID=$!
        log_success "Development server started (PID: $DEV_PID)"
    fi
    
    # Wait for servers to initialize
    log_info "Waiting for servers to initialize..."
    sleep 10
    
    cd - >/dev/null
}

# Generate test report
generate_test_report() {
    log_step "Generating test report"
    
    local report_file="$TEST_DIR/test-report.json"
    local report='{}'
    
    # Add basic info
    report=$(echo "$report" | jq --arg name "$PROJECT_NAME" '.project_name = $name')
    report=$(echo "$report" | jq --arg date "$(date -Iseconds)" '.test_date = $date')
    report=$(echo "$report" | jq --arg args "$CLI_ARGS" '.cli_args = $args')
    
    # Add validation results
    report=$(echo "$report" | jq --arg passed "$VALIDATION_PASSED" '.validation_passed = ($passed == "true")')
    report=$(echo "$report" | jq --argjson errors "$(printf '%s\n' "${VALIDATION_ERRORS[@]}" | jq -Rs 'split("\n") | map(select(. != ""))')" '.errors = $errors')
    report=$(echo "$report" | jq --argjson warnings "$(printf '%s\n' "${VALIDATION_WARNINGS[@]}" | jq -Rs 'split("\n") | map(select(. != ""))')" '.warnings = $warnings')
    
    # Save report
    echo "$report" | jq '.' > "$report_file"
    
    # Also save to central results file
    echo "$report" | jq '.' >> "$TEST_RESULTS_FILE"
    
    log_success "Test report saved to: $report_file"
}

# Validation mode - validate existing project
validation_mode() {
    local project_path="$1"
    
    if [ -z "$project_path" ] || [ ! -d "$project_path" ]; then
        log_error "Invalid project path: $project_path"
        exit 1
    fi
    
    echo -e "${CYAN}"
    echo "========================================"
    echo "    VALIDATION MODE"
    echo "========================================"
    echo -e "${NC}"
    
    setup_logging
    TEST_DIR="$project_path"
    validate_project "$project_path"
    run_code_checks
    generate_test_report
    
    if [ "$VALIDATION_PASSED" = true ]; then
        log_success "✓ Project validation PASSED"
        exit 0
    else
        log_error "✗ Project validation FAILED"
        exit 1
    fi
}

# Report mode - show test results
report_mode() {
    echo -e "${CYAN}"
    echo "========================================"
    echo "    TEST RESULTS REPORT"
    echo "========================================"
    echo -e "${NC}"
    
    local results_dir="test-projects/output"
    
    if [ ! -d "$results_dir" ]; then
        log_error "No test results found"
        exit 1
    fi
    
    # Find latest results file
    local latest_results=$(ls -t "$results_dir"/results_*.json 2>/dev/null | head -1)
    
    if [ -z "$latest_results" ]; then
        log_error "No test results found"
        exit 1
    fi
    
    log_info "Latest results: $latest_results"
    echo ""
    
    # Parse and display results
    cat "$latest_results" | jq '.'
}

# Main execution
main() {
    # Check for special modes
    if [ "$1" = "--validate" ]; then
        validation_mode "$2"
        exit 0
    fi
    
    if [ "$1" = "--report" ]; then
        report_mode
        exit 0
    fi
    
    if [ "$1" = "--cleanup" ]; then
        # Use existing cleanup from original script
        ./test-runner.sh --cleanup "$2"
        exit 0
    fi
    
    echo -e "${CYAN}"
    echo "========================================"
    echo "    PRECAST CLI ENHANCED TEST RUNNER"
    echo "========================================"
    echo -e "${NC}"
    
    setup_logging
    validate_environment
    generate_project_name
    create_project
    validate_project
    start_docker
    run_code_checks
    run_dev_servers
    test_api_endpoints
    generate_test_report
    
    # Display results
    log_step "Test Results"
    echo ""
    if [ "$VALIDATION_PASSED" = true ]; then
        echo -e "${GREEN}════════════════════════════════════════${NC}"
        echo -e "${GREEN}    ✓ ALL TESTS PASSED${NC}"
        echo -e "${GREEN}════════════════════════════════════════${NC}"
    else
        echo -e "${RED}════════════════════════════════════════${NC}"
        echo -e "${RED}    ✗ TESTS FAILED${NC}"
        echo -e "${RED}════════════════════════════════════════${NC}"
        echo -e "${RED}Errors:${NC}"
        for error in "${VALIDATION_ERRORS[@]}"; do
            echo -e "  ${RED}✗${NC} $error"
        done
    fi
    
    if [ ${#VALIDATION_WARNINGS[@]} -gt 0 ]; then
        echo -e "${YELLOW}Warnings:${NC}"
        for warning in "${VALIDATION_WARNINGS[@]}"; do
            echo -e "  ${YELLOW}⚠${NC} $warning"
        done
    fi
    
    echo ""
    echo -e "${CYAN}Project: $PROJECT_NAME${NC}"
    echo -e "${CYAN}Location: $TEST_DIR${NC}"
    echo -e "${CYAN}Log file: $LOG_FILE${NC}"
    echo -e "${CYAN}Report: $TEST_DIR/test-report.json${NC}"
    
    if [ "$VALIDATION_PASSED" = true ]; then
        echo ""
        echo -e "${GREEN}Frontend: http://localhost:5173${NC}"
        echo -e "${GREEN}Backend:  http://localhost:3001${NC}"
        echo ""
        echo -e "${CYAN}Press any key to stop services...${NC}"
        read -n 1 -s
    else
        echo ""
        echo -e "${RED}Fix the errors above and re-run validation with:${NC}"
        echo -e "${YELLOW}./test-runner-enhanced.sh --validate $TEST_DIR${NC}"
    fi
}

# Run main function with all arguments
main "$@"