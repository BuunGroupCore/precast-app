# Precast App Development Environment Setup
# Run 'make help' to see available commands

.PHONY: help setup install dev build test clean doctor check-deps init-husky format lint typecheck ci full-setup

# Colors for terminal output
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[1;33m
BLUE := \033[0;34m
PURPLE := \033[0;35m
CYAN := \033[0;36m
WHITE := \033[1;37m
NC := \033[0m # No Color

# Default target
.DEFAULT_GOAL := help

# Help command
help: ## Show this help message
	@echo "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
	@echo "${CYAN}║           ${WHITE}Precast App Development Makefile${CYAN}                 ║${NC}"
	@echo "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
	@echo ""
	@echo "${YELLOW}Available commands:${NC}"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  ${GREEN}%-15s${NC} %s\n", $$1, $$2}'
	@echo ""
	@echo "${PURPLE}Quick start:${NC}"
	@echo "  ${WHITE}make setup${NC}     - Complete environment setup"
	@echo "  ${WHITE}make dev${NC}       - Start development server"
	@echo "  ${WHITE}make test${NC}      - Run all tests"
	@echo ""

# Check if required tools are installed
check-deps: ## Check if required dependencies are installed
	@echo "${BLUE}🔍 Checking development dependencies...${NC}"
	@command -v node >/dev/null 2>&1 || { echo "${RED}❌ Node.js is not installed. Please install Node.js 18+${NC}" >&2; exit 1; }
	@command -v git >/dev/null 2>&1 || { echo "${RED}❌ Git is not installed. Please install Git${NC}" >&2; exit 1; }
	@echo "${GREEN}✅ Node.js found:${NC} $$(node --version)"
	@echo "${GREEN}✅ Git found:${NC} $$(git --version)"
	@if command -v bun >/dev/null 2>&1; then \
		echo "${GREEN}✅ Bun found:${NC} $$(bun --version)"; \
		echo "${CYAN}ℹ️  Using Bun as package manager${NC}"; \
	elif command -v pnpm >/dev/null 2>&1; then \
		echo "${GREEN}✅ pnpm found:${NC} $$(pnpm --version)"; \
		echo "${CYAN}ℹ️  Using pnpm as package manager${NC}"; \
	else \
		echo "${YELLOW}⚠️  Neither Bun nor pnpm found. Installing pnpm...${NC}"; \
		npm install -g pnpm; \
	fi

# Complete setup for new developers
setup: ## Complete environment setup for new developers
	@echo "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
	@echo "${CYAN}║              ${WHITE}Setting up Development Environment${CYAN}            ║${NC}"
	@echo "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
	@echo ""
	@$(MAKE) check-deps
	@echo ""
	@echo "${BLUE}📦 Installing dependencies...${NC}"
	@$(MAKE) install
	@echo ""
	@echo "${BLUE}🔧 Setting up Git hooks...${NC}"
	@$(MAKE) init-husky
	@echo ""
	@echo "${BLUE}🏗️  Building packages...${NC}"
	@$(MAKE) build
	@echo ""
	@echo "${GREEN}✨ Setup complete! You can now run:${NC}"
	@echo "  ${WHITE}make dev${NC}       - Start development server"
	@echo "  ${WHITE}make test${NC}      - Run tests"
	@echo "  ${WHITE}make help${NC}      - Show all available commands"
	@echo ""

# Install dependencies
install: ## Install all dependencies
	@echo "${BLUE}📦 Installing dependencies...${NC}"
	@if command -v bun >/dev/null 2>&1; then \
		bun install; \
	elif command -v pnpm >/dev/null 2>&1; then \
		pnpm install; \
	else \
		npm install; \
	fi
	@echo "${GREEN}✅ Dependencies installed${NC}"

# Initialize Husky git hooks
init-husky: ## Initialize git hooks with Husky
	@echo "${BLUE}🪝 Setting up Git hooks...${NC}"
	@if [ -d .git ]; then \
		node .husky/install.mjs; \
		echo "${GREEN}✅ Git hooks configured${NC}"; \
	else \
		echo "${YELLOW}⚠️  Not a git repository. Skipping hooks setup${NC}"; \
	fi

# Development server
dev: ## Start the development server
	@echo "${CYAN}🚀 Starting development server...${NC}"
	@if command -v bun >/dev/null 2>&1; then \
		bun dev; \
	elif command -v pnpm >/dev/null 2>&1; then \
		pnpm dev; \
	else \
		npm run dev; \
	fi

# Build all packages
build: ## Build all packages
	@echo "${BLUE}🏗️  Building all packages...${NC}"
	@if command -v bun >/dev/null 2>&1; then \
		bun run build; \
	elif command -v pnpm >/dev/null 2>&1; then \
		pnpm run build; \
	else \
		npm run build; \
	fi
	@echo "${GREEN}✅ Build complete${NC}"

# Run tests
test: ## Run all tests
	@echo "${BLUE}🧪 Running tests...${NC}"
	@if command -v bun >/dev/null 2>&1; then \
		bun test; \
	elif command -v pnpm >/dev/null 2>&1; then \
		pnpm test; \
	else \
		npm test; \
	fi

# Type checking
typecheck: ## Run TypeScript type checking
	@echo "${BLUE}📝 Running type checks...${NC}"
	@if command -v bun >/dev/null 2>&1; then \
		bun typecheck; \
	elif command -v pnpm >/dev/null 2>&1; then \
		pnpm typecheck; \
	else \
		npm run typecheck; \
	fi

# Linting
lint: ## Run ESLint on all packages
	@echo "${BLUE}🔍 Running linter...${NC}"
	@if command -v bun >/dev/null 2>&1; then \
		bun lint; \
	elif command -v pnpm >/dev/null 2>&1; then \
		pnpm lint; \
	else \
		npm run lint; \
	fi

# Format code
format: ## Format code with Prettier
	@echo "${BLUE}💅 Formatting code...${NC}"
	@if command -v bun >/dev/null 2>&1; then \
		bun format; \
	elif command -v pnpm >/dev/null 2>&1; then \
		pnpm format; \
	else \
		npm run format; \
	fi
	@echo "${GREEN}✅ Code formatted${NC}"

# Clean build artifacts and dependencies
clean: ## Clean all build artifacts and node_modules
	@echo "${BLUE}🧹 Cleaning project...${NC}"
	@rm -rf node_modules packages/*/node_modules
	@rm -rf packages/*/dist
	@rm -rf packages/website/dist
	@rm -rf packages/cli/dist
	@echo "${GREEN}✅ Project cleaned${NC}"

# Full clean and reinstall
reset: ## Complete reset - clean and reinstall everything
	@echo "${YELLOW}⚠️  This will remove all node_modules and reinstall dependencies${NC}"
	@echo "${YELLOW}Press Ctrl+C to cancel, or wait 3 seconds to continue...${NC}"
	@sleep 3
	@$(MAKE) clean
	@$(MAKE) setup

# Run CI checks locally
ci: ## Run all CI checks locally
	@echo "${CYAN}🔄 Running CI checks locally...${NC}"
	@echo ""
	@echo "${BLUE}1/4 Type checking...${NC}"
	@$(MAKE) typecheck
	@echo ""
	@echo "${BLUE}2/4 Linting...${NC}"
	@$(MAKE) lint
	@echo ""
	@echo "${BLUE}3/4 Testing...${NC}"
	@$(MAKE) test
	@echo ""
	@echo "${BLUE}4/4 Building...${NC}"
	@$(MAKE) build
	@echo ""
	@echo "${GREEN}✅ All CI checks passed!${NC}"

# Doctor - diagnose common issues
doctor: ## Diagnose common development issues
	@echo "${CYAN}👨‍⚕️ Running diagnostics...${NC}"
	@echo ""
	@$(MAKE) check-deps
	@echo ""
	@echo "${BLUE}📋 Checking workspace configuration...${NC}"
	@if [ -f "pnpm-workspace.yaml" ]; then \
		echo "${GREEN}✅ Workspace configuration found${NC}"; \
	else \
		echo "${RED}❌ pnpm-workspace.yaml not found${NC}"; \
	fi
	@echo ""
	@echo "${BLUE}📋 Checking TypeScript configuration...${NC}"
	@if [ -f "tsconfig.json" ]; then \
		echo "${GREEN}✅ TypeScript configuration found${NC}"; \
	else \
		echo "${RED}❌ tsconfig.json not found${NC}"; \
	fi
	@echo ""
	@echo "${BLUE}📋 Checking Husky configuration...${NC}"
	@if [ -d ".husky" ]; then \
		echo "${GREEN}✅ Husky hooks directory found${NC}"; \
		if [ -f ".husky/pre-commit" ]; then \
			echo "${GREEN}✅ Pre-commit hook found${NC}"; \
		else \
			echo "${YELLOW}⚠️  Pre-commit hook not found${NC}"; \
		fi \
	else \
		echo "${RED}❌ Husky not configured${NC}"; \
	fi
	@echo ""
	@echo "${BLUE}📋 Checking CLI build...${NC}"
	@if [ -f "packages/cli/dist/cli.js" ]; then \
		echo "${GREEN}✅ CLI is built${NC}"; \
	else \
		echo "${YELLOW}⚠️  CLI not built. Run 'make build' to build${NC}"; \
	fi
	@echo ""
	@echo "${GREEN}Diagnostics complete!${NC}"

# Quick setup for CLI development
setup-cli: ## Quick setup for CLI package development
	@echo "${CYAN}🛠️  Setting up CLI development environment...${NC}"
	@cd packages/cli && \
	if command -v bun >/dev/null 2>&1; then \
		bun install && bun run build; \
	elif command -v pnpm >/dev/null 2>&1; then \
		pnpm install && pnpm run build; \
	else \
		npm install && npm run build; \
	fi
	@echo "${GREEN}✅ CLI ready for development${NC}"
	@echo "Test with: ${WHITE}./packages/cli/dist/cli.js init test-project${NC}"

# Quick setup for website development
setup-website: ## Quick setup for website development
	@echo "${CYAN}🌐 Setting up website development environment...${NC}"
	@cd packages/website && \
	if command -v bun >/dev/null 2>&1; then \
		bun install; \
	elif command -v pnpm >/dev/null 2>&1; then \
		pnpm install; \
	else \
		npm install; \
	fi
	@echo "${GREEN}✅ Website ready for development${NC}"
	@echo "Start with: ${WHITE}make dev${NC}"

# Update dependencies
update-deps: ## Update all dependencies to latest versions
	@echo "${BLUE}📦 Updating dependencies...${NC}"
	@if command -v bun >/dev/null 2>&1; then \
		bun update; \
	elif command -v pnpm >/dev/null 2>&1; then \
		pnpm update -r; \
	else \
		npm update; \
	fi
	@echo "${GREEN}✅ Dependencies updated${NC}"

# Security audit
audit: ## Run security audit on dependencies
	@echo "${BLUE}🔒 Running security audit...${NC}"
	@if command -v bun >/dev/null 2>&1; then \
		echo "${YELLOW}Bun doesn't have audit yet, using npm audit...${NC}"; \
		npm audit; \
	elif command -v pnpm >/dev/null 2>&1; then \
		pnpm audit; \
	else \
		npm audit; \
	fi

# Create a new feature branch
feature: ## Create a new feature branch (usage: make feature name=my-feature)
	@if [ -z "$(name)" ]; then \
		echo "${RED}❌ Please provide a feature name: make feature name=my-feature${NC}"; \
		exit 1; \
	fi
	@echo "${BLUE}🌿 Creating feature branch: feature/$(name)${NC}"
	@git checkout -b feature/$(name)
	@echo "${GREEN}✅ Branch created and switched to feature/$(name)${NC}"

# Show current environment info
info: ## Show current environment information
	@echo "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
	@echo "${CYAN}║                ${WHITE}Environment Information${CYAN}                     ║${NC}"
	@echo "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
	@echo ""
	@echo "${BLUE}System:${NC}"
	@echo "  OS: $$(uname -s) $$(uname -r)"
	@echo "  Node: $$(node --version)"
	@echo "  Git: $$(git --version | cut -d' ' -f3)"
	@echo ""
	@echo "${BLUE}Package Managers:${NC}"
	@if command -v bun >/dev/null 2>&1; then echo "  Bun: $$(bun --version)"; fi
	@if command -v pnpm >/dev/null 2>&1; then echo "  pnpm: $$(pnpm --version)"; fi
	@if command -v npm >/dev/null 2>&1; then echo "  npm: $$(npm --version)"; fi
	@echo ""
	@echo "${BLUE}Project:${NC}"
	@echo "  Branch: $$(git branch --show-current)"
	@echo "  Last commit: $$(git log -1 --format='%h - %s')"
	@echo ""

# Run pre-commit hooks manually
pre-commit: ## Run pre-commit hooks manually
	@echo "${BLUE}🪝 Running pre-commit hooks...${NC}"
	@bash .husky/pre-commit
	@echo "${GREEN}✅ Pre-commit checks passed${NC}"

# Create test project with CLI
test-cli: ## Test CLI by creating a sample project
	@echo "${BLUE}🧪 Testing CLI with sample project...${NC}"
	@./packages/cli/dist/cli.js init test-project --framework react --backend express --database postgres --orm prisma --styling tailwind --yes
	@echo "${GREEN}✅ Test project created in test-project/${NC}"

# Show package versions
versions: ## Show all package versions
	@echo "${CYAN}📦 Package Versions:${NC}"
	@echo ""
	@for pkg in packages/*/package.json; do \
		name=$$(cat $$pkg | grep '"name"' | cut -d'"' -f4); \
		version=$$(cat $$pkg | grep '"version"' | head -1 | cut -d'"' -f4); \
		echo "  ${GREEN}$$name${NC}: $$version"; \
	done

# Shortcut aliases
s: setup ## Alias for setup
d: dev ## Alias for dev
t: test ## Alias for test
b: build ## Alias for build
c: clean ## Alias for clean