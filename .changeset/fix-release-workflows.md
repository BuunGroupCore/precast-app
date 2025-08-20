---
"create-precast-app": patch
"@precast/website": patch
"@precast/ui": patch
"@precast/utils": patch
"@precast/hooks": patch
"@precast/shared": patch
---

fix: Split release workflow for proper GitHub releases

## Problem
The previous release workflow tried to create GitHub releases in the same run as the changesets PR creation, which would never work since the PR needs to be merged first.

## Solution
Split the release process into two separate workflows:

### 1. `release-pr.yml` - Release PR Creation
- Creates changesets PR with version bumps
- Runs on push to main
- Builds all packages before creating PR
- Handles npm publishing when PR is merged

### 2. `github-release.yml` - GitHub Release Creation  
- Triggers automatically on tag push (`v*`)
- Can also be triggered manually with a specific tag
- Creates GitHub release with:
  - Full monorepo archive
  - Standalone CLI archive
  - Extracted changelog for the version
  - Build instructions
- Prevents duplicate releases
- No npm references, GitHub-only distribution

## Benefits
- **Actually works** - Proper separation of PR creation and release creation
- **Automatic triggering** - Tag push automatically creates GitHub release
- **Manual fallback** - Can manually create releases if needed
- **Better archives** - Both full repo and standalone CLI archives
- **Changelog integration** - Extracts version-specific changes
- **Duplicate prevention** - Won't recreate existing releases

## Migration
The old `release.yml` workflow is marked as deprecated but kept for reference. New releases will use the split workflow approach.