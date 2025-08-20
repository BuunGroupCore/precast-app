---
"create-precast-app": patch
---

fix: Correct CI/CD workflows based on actual package structure

## Package Structure (Correct Understanding)

### Public Package (Published to npm)
- **`create-precast-app`** - The CLI tool (only package in changesets)

### Private Packages (Not published, ignored by changesets)
- **`@precast/website`** - Has build script
- **`@precast/ui`** - Has build script 
- **`@precast/utils`** - NO build script (exports TypeScript directly)
- **`@precast/hooks`** - NO build script (exports TypeScript directly)

### Not a Package
- **`/packages/shared/`** - Just shared TypeScript files, no package.json

## Fixes Applied

### Test Workflow
- Only build UI package (the only dependency with a build script)
- Don't try to build @precast/shared (doesn't exist as package)
- Don't try to build @precast/utils (no build script)
- Fixed pnpm execution context issues

### Release Workflow  
- Split into two workflows (release-pr.yml and github-release.yml)
- Only include `create-precast-app` in changesets (others are ignored)
- Build UI, CLI, and website in correct order

### Changeset Configuration
- Correctly ignores all private packages
- Only tracks `create-precast-app` for versioning