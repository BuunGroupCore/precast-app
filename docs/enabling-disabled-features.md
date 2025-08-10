# Enabling Disabled Features

This document explains how to enable features that are currently disabled for testing in both the Precast CLI and website builder.

## Overview

Some features are marked as `disabled: true` to hide them from users until they're fully tested and production-ready. This approach allows us to ship code early while preventing users from accessing untested features.

## Currently Disabled Features

### Frameworks
- **Angular** - Platform for building mobile and desktop web applications
- **Nuxt** - The Intuitive Vue Framework  
- **Remix** - Build better websites with Remix
- **Solid** - Simple and performant reactivity for building user interfaces

### UI Component Libraries
- **Ant Design** - Enterprise-class UI design language and React components
- **Mantine** - Full-featured React components and hooks library
- **Chakra UI** - Simple, modular and accessible component library for React

### Backends
- **Convex** - Backend-as-a-Service with real-time sync
- **Fastify** - Fast and low overhead web framework for Node.js

### Databases
- **Turso** - Edge-hosted distributed SQLite database
- **Firebase** - Google's mobile and web app development platform
- **PlanetScale** - Serverless MySQL platform with branching
- **Neon** - Serverless Postgres with branching and autoscaling
- **Supabase** - The open source Firebase alternative (temporarily disabled)

### Authentication Providers
- **Lucia** - Modern authentication library with edge support
- **Auth0** - Universal authentication & authorization platform
- **Clerk** - Complete user management platform with built-in auth
- **Passport.js** - Simple, unobtrusive authentication middleware for Node.js

### Deployment Platforms
- **GitHub Pages** - Host directly from your GitHub repository
- **Azure Static Web Apps** - Free SSL, custom domains, and serverless APIs
- **AWS Amplify** - Full-stack development platform with CI/CD (Note: Not in CLI yet)

## How to Enable Features

To enable any disabled feature, you need to remove or set `disabled: false` in the configuration files. Features are defined in multiple locations depending on the package:

### 1. Shared Configuration (CLI)

**File:** `/packages/shared/stack-config.ts`

Find the feature definition and remove the `disabled: true` property:

```typescript
// Before (disabled)
{
  id: "angular",
  name: "Angular",
  description: "Platform for building mobile and desktop web applications",
  dependencies: ["typescript"],
  recommended: ["scss"],
  disabled: true,  // Remove this line
}

// After (enabled)
{
  id: "angular",
  name: "Angular",
  description: "Platform for building mobile and desktop web applications",
  dependencies: ["typescript"],
  recommended: ["scss"],
}
```

### 2. Website Configuration

The website has its own configuration files that need to be updated:

#### Frameworks, Backends, Databases, Auth
**File:** `/packages/website/src/lib/stack-config.ts`

```typescript
// Remove disabled: true from the feature definition
{
  id: "solid",
  name: "Solid",
  icon: SiSolid,
  color: "text-comic-blue",
  description: "Simple and performant reactivity for building user interfaces",
  category: "ui-library",
  recommended: ["typescript", "tailwind"],
  disabled: true,  // Remove this line
}
```

#### UI Component Libraries
**File:** `/packages/website/src/components/builder/constants.ts`

```typescript
// Remove disabled: true from the UI library definition
{
  id: "chakra",
  name: "Chakra UI",
  icon: SiChakraui,
  color: "text-teal-500",
  description: "Simple, modular and accessible component library for React",
  frameworks: ["react", "next", "remix"],
  incompatible: ["tailwind"],
  disabled: true,  // Remove this line
}
```

#### Deployment Methods
**File:** `/packages/website/src/components/builder/constants.ts`

```typescript
// Remove disabled: true from the deployment method
{
  id: "github-pages",
  name: "GitHub Pages",
  icon: FaGithub,
  color: "text-gray-800",
  description: "Free static site hosting from GitHub",
  supportsStatic: true,
  supportsDynamic: false,
  disabled: true,  // Remove this line
}
```

### 3. CLI-Specific Configurations

#### Auth Providers
**File:** `/packages/cli/src/utils/auth-setup.ts`

```typescript
// Remove disabled: true from the auth provider
clerk: {
  id: "clerk",
  name: "Clerk",
  requiresDatabase: false,
  supportedFrameworks: ["next", "react", "remix"],
  disabled: true,  // Remove this line
}
```

#### UI Libraries
**File:** `/packages/cli/src/utils/dependency-checker.ts`

```typescript
// Remove disabled: true from the UI library compatibility rule
chakra: {
  name: "Chakra UI",
  frameworks: ["react", "next", "remix", "vite"],
  requiredDeps: ["@chakra-ui/react", "@emotion/react", "@emotion/styled", "framer-motion"],
  disabled: true,  // Remove this line
}
```

#### Deployment Configurations
**File:** `/packages/cli/src/utils/deployment-setup.ts`

```typescript
// Remove disabled: true from the deployment config
"github-pages": {
  id: "github-pages",
  name: "GitHub Pages",
  description: "Host directly from your GitHub repository",
  frameworks: ["*"],
  configFiles: [".github/workflows/deploy.yml"],
  buildCommand: "npm run build",
  outputDir: "dist",
  disabled: true,  // Remove this line
}
```

## Testing Before Enabling

Before enabling a feature for production use:

1. **Test Template Generation**
   ```bash
   # Build the CLI
   cd packages/cli
   bun run build
   
   # Test with the feature
   ./dist/cli.js init test-project --framework angular --install
   ```

2. **Verify Dependencies**
   - Ensure all required dependencies are properly installed
   - Check that package.json is correctly generated
   - Verify that configuration files are properly created

3. **Test Build Process**
   ```bash
   cd test-project
   npm run build
   ```

4. **Test Development Server**
   ```bash
   npm run dev
   ```

5. **Check Integration**
   - Test with different combinations of features
   - Verify compatibility rules are working
   - Ensure no conflicts with other enabled features

## Batch Enabling Features

To enable multiple features at once, you can use your text editor's find and replace functionality:

1. Search for `disabled: true` in the relevant files
2. Review each instance to ensure it's safe to enable
3. Remove the line or change to `disabled: false`

## After Enabling

Once features are enabled:

1. **Update Documentation**
   - Add feature to README.md supported list
   - Update CLI help text if needed
   - Add examples to documentation

2. **Update Tests**
   - Add test cases for the newly enabled feature
   - Update integration tests

3. **Announce the Feature**
   - Update CHANGELOG.md
   - Consider announcing in release notes
   - Update website feature list

## Rollback

If issues are discovered after enabling a feature:

1. Add `disabled: true` back to all relevant configuration files
2. Deploy hotfix immediately
3. Document the issue for future reference

## Notes

- The `disabled` property is checked at runtime, so no rebuild is required for the website (just refresh)
- For the CLI, you'll need to rebuild after making changes: `bun run build`
- Some features may require additional setup beyond just removing the disabled flag (check templates, generators, etc.)
- Always test thoroughly before enabling features in production