# Troubleshooting Guide

Common issues and solutions when using the Precast CLI.

## 📋 Table of Contents

1. [Installation Issues](#installation-issues)
2. [Command Not Found](#command-not-found)  
3. [Package Manager Issues](#package-manager-issues)
4. [Dependency Issues](#dependency-issues)
5. [Template Generation Issues](#template-generation-issues)
6. [Docker Issues](#docker-issues)
7. [Database Connection Issues](#database-connection-issues)
8. [Authentication Issues](#authentication-issues)
9. [Build & Development Issues](#build--development-issues)
10. [Platform-Specific Issues](#platform-specific-issues)

## 🚀 Installation Issues

### CLI Installation Fails

**Problem:** Cannot install or run `create-precast-app`
```bash
npm install -g create-precast-app
# Error: EACCES permission denied
```

**Solutions:**

#### Use npx (Recommended)
```bash
# Don't install globally, use npx instead
npx create-precast-app@latest my-project

# Or with bun
bunx create-precast-app@latest my-project
```

#### Fix npm permissions
```bash
# macOS/Linux: Change npm global directory
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.profile
source ~/.profile

# Then install globally
npm install -g create-precast-app
```

#### Use Node Version Manager
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use latest Node.js
nvm install node
nvm use node

# Now install CLI
npm install -g create-precast-app
```

### Outdated CLI Version

**Problem:** Using old version with missing features
```bash
create-precast-app --version
# 0.1.15 (but latest is 0.1.27)
```

**Solutions:**
```bash
# Update to latest version
npm update -g create-precast-app

# Or use npx to always get latest
npx create-precast-app@latest my-project

# Check installed version
create-precast-app --version
```

## ❌ Command Not Found

### "create-precast-app: command not found"

**Problem:** CLI not found in PATH

**Solutions:**

#### Verify Installation
```bash
# Check if installed globally
npm list -g create-precast-app

# Check npm global bin directory
npm config get prefix

# Check PATH includes npm bin
echo $PATH
```

#### Use Full Path
```bash
# Find where npm installs global packages
npm root -g

# Run with full path
/usr/local/lib/node_modules/create-precast-app/dist/cli.js my-project
```

#### Use npx Instead
```bash
# Always works without global installation
npx create-precast-app@latest my-project
```

### Windows PowerShell Execution Policy

**Problem:** Cannot run scripts on Windows
```bash
create-precast-app : File cannot be loaded because running scripts is disabled
```

**Solutions:**
```powershell
# Check current policy
Get-ExecutionPolicy

# Set policy to allow scripts
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Or run with bypass
PowerShell -ExecutionPolicy Bypass -Command "npx create-precast-app@latest my-project"
```

## 📦 Package Manager Issues

### Bun Installation Failures

**Problem:** Bun fails to install certain packages
```bash
error: failed to install dependencies with bun
falling back to npm...
```

**This is expected behavior.** The CLI automatically detects when Bun fails and falls back to npm.

**Common Bun-incompatible packages:**
- esbuild (native modules)
- Prisma (binary dependencies)  
- Sharp (image processing)
- Canvas (native dependencies)

**Solutions:**
```bash
# Let CLI handle fallback automatically (recommended)
create-precast-app my-project --pm bun

# Force npm from start
create-precast-app my-project --pm npm

# Mixed approach: Use bun where possible
create-precast-app my-project --pm bun
# CLI will use npm only for problematic packages
```

### PNPM Peer Dependency Issues

**Problem:** PNPM complains about peer dependencies
```bash
WARN: peer dep missing: react@^18.0.0 required by @types/react
```

**Solutions:**
```bash
# Install missing peer dependencies
pnpm install react@^18.0.0

# Or use --shamefully-hoist flag
echo "shamefully-hoist=true" >> .npmrc
pnpm install

# Or switch to npm for easier peer dep handling
create-precast-app my-project --pm npm
```

### Yarn Berry (v2+) Issues

**Problem:** Yarn v2+ causes compatibility issues
```bash
Error: Plug'n'Play mode not compatible with some packages
```

**Solutions:**
```bash
# Use Yarn Classic (v1)
npm install -g yarn@1.22.19

# Or set nodeLinker to node-modules
echo 'nodeLinker: node-modules' >> .yarnrc.yml
yarn install

# Or use npm instead
create-precast-app my-project --pm npm
```

## 🔗 Dependency Issues

### Version Conflicts

**Problem:** Conflicting dependency versions
```bash
npm ERR! peer dep missing: react@^17.0.0, required by old-package@1.0.0
```

**Solutions:**
```bash
# Check for outdated dependencies
npm outdated

# Update dependencies  
npm update

# Force resolution (package.json)
{
  "overrides": {
    "react": "^18.0.0"
  }
}

# Or use --force flag (not recommended)
npm install --force
```

### Native Module Build Failures

**Problem:** Native modules fail to compile
```bash
gyp ERR! build error
gyp ERR! stack Error: `make` failed with exit code: 2
```

**Solutions:**

#### Install Build Tools
```bash
# Windows
npm install -g windows-build-tools

# macOS  
xcode-select --install

# Ubuntu/Debian
sudo apt-get install build-essential python3

# Alpine Linux
apk add build-base python3
```

#### Use Prebuilt Binaries
```bash
# Set npm config to use prebuilt binaries
npm config set target_platform linux
npm config set target_arch x64
npm config set runtime node
```

#### Switch Package Managers
```bash
# Try bun (often handles native modules better)
create-precast-app my-project --pm bun

# Or try different Node.js version
nvm install 18.18.0
nvm use 18.18.0
create-precast-app my-project
```

## 📄 Template Generation Issues

### Handlebars Template Errors

**Problem:** Template processing fails
```bash
Error: Parse error on line 15: Unexpected token '{'
```

**Solutions:**
```bash
# Enable debug mode to see template details
DEBUG=* create-precast-app my-project

# Check for custom template overrides
create-precast-app my-project --no-template-cache

# Report template issue with debug output
create-precast-app my-project --debug > debug.log 2>&1
```

### File Permission Errors

**Problem:** Cannot write template files
```bash
Error: EACCES: permission denied, open '/path/to/file'
```

**Solutions:**
```bash
# Check directory permissions
ls -la ./

# Create project in user directory
cd ~/Documents
create-precast-app my-project

# Fix permissions (macOS/Linux)
sudo chown -R $USER:$USER /path/to/project

# Run with elevated permissions (not recommended)
sudo create-precast-app my-project
```

### Template Validation Errors

**Problem:** Generated project fails validation
```bash
Error: Angular requires TypeScript
Help: Remove --no-typescript flag or choose different framework
```

**Solutions:**
```bash
# Fix the configuration
create-precast-app my-project --framework angular
# (TypeScript enabled automatically)

# Or choose compatible combination
create-precast-app my-project --framework angular --no-typescript
# Error: This combination is invalid

# Use suggested fix
create-precast-app my-project --framework react --no-typescript
# This works
```

## 🐳 Docker Issues

### Docker Not Running

**Problem:** Docker commands fail
```bash
Cannot connect to the Docker daemon at unix:///var/run/docker.sock
```

**Solutions:**
```bash
# Start Docker Desktop (macOS/Windows)
open -a Docker

# Start Docker service (Linux)
sudo systemctl start docker

# Verify Docker is running
docker --version
docker ps

# Skip Docker if not needed
create-precast-app my-project # (no --docker flag)
```

### Docker Compose Issues

**Problem:** Services fail to start
```bash
ERROR: Version in "./docker-compose.yml" is unsupported
```

**Solutions:**
```bash
# Update Docker Compose
# macOS/Windows: Update Docker Desktop
# Linux:
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Check version
docker-compose --version

# Use docker-compose v2 syntax
docker compose up -d  # (note: no hyphen)
```

### Port Conflicts

**Problem:** Database ports already in use
```bash
Error: Port 5432 is already in use
```

**Solutions:**
```bash
# Find what's using the port
lsof -i :5432  # macOS/Linux
netstat -ano | findstr :5432  # Windows

# Stop conflicting service
sudo systemctl stop postgresql  # Linux
brew services stop postgresql  # macOS

# Or modify docker-compose.yml to use different port
services:
  postgres:
    ports:
      - "5433:5432"  # Use 5433 instead of 5432
```

### Database Container Issues

**Problem:** Database container won't start
```bash
postgres_1 | FATAL: password authentication failed
```

**Solutions:**
```bash
# Reset Docker volumes
docker-compose down -v
docker-compose up -d

# Check environment variables
cat .env

# Regenerate with secure passwords
create-precast-app new-project --docker --database postgres

# Use generic passwords for development
create-precast-app new-project --docker --database postgres --no-secure-passwords
```

## 🗄️ Database Connection Issues

### PostgreSQL Connection Refused

**Problem:** Cannot connect to PostgreSQL
```bash
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solutions:**
```bash
# Check if PostgreSQL is running
docker-compose ps

# Start database service
docker-compose up -d postgres

# Check connection string
echo $DATABASE_URL

# Test connection
docker-compose exec postgres psql -U precast_user -d precast_db -c "SELECT version();"
```

### Prisma Migration Issues

**Problem:** Prisma migrations fail
```bash
Error: P1001: Can't reach database server at `localhost:5432`
```

**Solutions:**
```bash
# Ensure database is running
docker-compose up -d postgres

# Wait for database to be ready
docker-compose logs postgres

# Reset and recreate database
npx prisma migrate reset
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
```

### Database Schema Issues

**Problem:** Database schema out of sync
```bash
Error: Table 'users' doesn't exist
```

**Solutions:**
```bash
# Run migrations
npx prisma migrate dev  # Prisma
npx drizzle-kit push:pg  # Drizzle

# Seed database (if seed file exists)
npm run db:seed

# Reset database completely
docker-compose down -v postgres
docker-compose up -d postgres
npx prisma migrate dev
```

## 🔐 Authentication Issues

### NextAuth Configuration

**Problem:** NextAuth.js setup issues
```bash
Error: NEXTAUTH_SECRET is not defined
```

**Solutions:**
```bash
# Generate secret
openssl rand -base64 32

# Add to .env.local
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# For production
NEXTAUTH_URL="https://yourdomain.com"
```

### Better Auth Issues

**Problem:** Better Auth configuration errors
```bash
Error: Database adapter not configured
```

**Solutions:**
```bash
# Verify database connection
echo $DATABASE_URL

# Check if database tables exist
npx prisma db push  # Creates tables if missing

# Verify better-auth configuration
cat src/lib/auth.ts
```

### OAuth Provider Issues

**Problem:** Social login fails
```bash
Error: OAuth callback error
```

**Solutions:**
```bash
# Check OAuth app configuration
# 1. Verify client ID and secret
# 2. Check callback URL matches provider settings
# 3. Ensure domain is whitelisted

# For development
# Google: http://localhost:3000/api/auth/callback/google
# GitHub: http://localhost:3000/api/auth/callback/github

# Check environment variables
cat .env.local | grep -E "(GOOGLE|GITHUB|AUTH0)"
```

## 🔨 Build & Development Issues

### TypeScript Compilation Errors

**Problem:** TypeScript build fails
```bash
error TS2307: Cannot find module '@/components/ui/button'
```

**Solutions:**
```bash
# Check tsconfig.json paths
cat tsconfig.json | grep -A 5 "paths"

# Verify file exists
ls src/components/ui/button.tsx

# Regenerate TypeScript references
rm -rf node_modules/.cache
npm install
npx tsc --noEmit

# Check path mapping
# tsconfig.json should have:
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Vite Build Issues

**Problem:** Vite build fails
```bash
error during build: RollupError: Could not resolve entry module
```

**Solutions:**
```bash
# Check vite.config.js
cat vite.config.js

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev

# Check entry point exists
ls src/main.tsx  # or src/main.ts

# Verify dependencies
npm ls
```

### Next.js Issues

**Problem:** Next.js development server issues
```bash
Error: Module not found: Can't resolve '@/components/ui'
```

**Solutions:**
```bash
# Check next.config.js
cat next.config.js

# Verify tsconfig.json paths
cat tsconfig.json | grep -A 10 "baseUrl"

# Clear Next.js cache
rm -rf .next
npm run dev

# Check file structure matches imports
ls src/components/ui/
```

### Styling Issues

**Problem:** Tailwind styles not working
```bash
# Styles not applied, white screen
```

**Solutions:**
```bash
# Check tailwind.config.js exists
ls tailwind.config.js

# Verify content paths
cat tailwind.config.js | grep -A 5 "content"

# Check CSS import
grep -r "@tailwind" src/

# Rebuild
rm -rf node_modules/.cache
npm run dev
```

## 🖥️ Platform-Specific Issues

### Windows Issues

#### Path Length Limitations
```bash
Error: ENAMETOOLONG: name too long
```

**Solutions:**
```bash
# Enable long paths in Windows
# 1. Run as Administrator
# 2. Open Group Policy Editor (gpedit.msc)
# 3. Go to: Computer Configuration > Administrative Templates > System > Filesystem
# 4. Enable "Enable Win32 long paths"

# Or create project in shorter path
cd C:\
create-precast-app app
```

#### Line Ending Issues
```bash
warning: LF will be replaced by CRLF
```

**Solutions:**
```bash
# Configure Git line endings
git config --global core.autocrlf true

# Or disable the warning
git config --global core.safecrlf false
```

### macOS Issues

#### Xcode Command Line Tools
```bash
Error: gyp: No Xcode or CLT version detected!
```

**Solutions:**
```bash
# Install Xcode Command Line Tools
xcode-select --install

# If already installed, reset
sudo xcode-select --reset
sudo xcode-select --install
```

#### Homebrew Conflicts
```bash
Error: node: command not found (after Homebrew update)
```

**Solutions:**
```bash
# Check if node is installed
brew list | grep node

# Reinstall if missing
brew install node

# Fix PATH
echo 'export PATH="/opt/homebrew/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Linux Issues

#### Missing System Dependencies
```bash
Error: canvas: Failed to load canvas dependency
```

**Solutions:**
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

# CentOS/RHEL/Fedora
sudo yum install cairo-devel pango-devel libjpeg-turbo-devel giflib-devel librsvg2-devel

# Alpine
apk add cairo-dev pango-dev jpeg-dev giflib-dev librsvg-dev
```

#### Permission Issues
```bash
Error: EACCES: permission denied, mkdir '/usr/local/lib/node_modules'
```

**Solutions:**
```bash
# Use nvm instead of system Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install node

# Or fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

## 🔍 Debug Mode & Logging

### Enable Verbose Logging
```bash
# Enable all debug output
DEBUG=* create-precast-app my-project

# Enable CLI-specific debugging
DEBUG=precast:* create-precast-app my-project

# Save debug output to file
DEBUG=* create-precast-app my-project > debug.log 2>&1
```

### Check CLI Configuration
```bash
# Show CLI version and config
create-precast-app --version
create-precast-app --help

# Test CLI without creating project
create-precast-app --dry-run my-project --framework react
```

### Validate Project Configuration
```bash
# Test configuration without creating files
create-precast-app my-project \
  --framework react \
  --database postgres \
  --orm prisma \
  --validate-only
```

## 🆘 Getting Help

### Report Issues
```bash
# Gather system information
node --version
npm --version
create-precast-app --version

# Create minimal reproduction
create-precast-app test-issue --framework react --yes

# Include debug output
DEBUG=* create-precast-app test-issue > issue-debug.log 2>&1
```

### Community Support
- **GitHub Issues**: [Report bugs](https://github.com/BuunGroupCore/precast-app/issues)
- **Discussions**: [Get help](https://github.com/BuunGroupCore/precast-app/discussions)
- **Discord**: [Join community](https://discord.gg/precast)

### Emergency Fixes
```bash
# Clear all caches
npm cache clean --force
rm -rf node_modules
rm package-lock.json
npm install

# Reset to known working state
git clean -fdx
npm install
```

---

**Need more help?** [Open an issue](https://github.com/BuunGroupCore/precast-app/issues/new) with:
1. Operating system and version
2. Node.js and npm versions  
3. Complete command you ran
4. Full error output
5. Debug logs (if available)

**Next:** [Examples](./examples.md) | [Configuration Guide](./configuration.md) | [Contributing](../contributing.md)