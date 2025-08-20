---
"create-precast-app": patch
"@precast/website": patch
"@precast/ui": patch
"@precast/utils": patch
"@precast/hooks": patch
---

chore: Update CI/CD workflows for new testing framework and GitHub-only releases

## CI/CD Improvements

### Testing Workflow Updates
- **Matrix testing** on Node.js 18 and 20 for broader compatibility
- **Separated test runs** by category (unit, integration, Docker, plugins, PowerUps, edge cases)
- **Test report generation** with automatic upload to GitHub artifacts
- **Cleanup verification** to ensure no leftover test directories
- **Appropriate timeouts** for each test category
- **GitHub job summaries** for quick test result overview
- **Updated to upload-artifact@v4** to fix deprecation warning

### Release Workflow Updates
- **GitHub-focused releases** without npm publishing references
- **Dual archive creation**:
  - Full monorepo archive (`precast-app-v{version}.tar.gz`)
  - Standalone CLI archive (`precast-cli-v{version}.tar.gz`)
- **Improved release notes** with:
  - All package versions listed
  - Build from source instructions
  - Clone from git tag instructions
  - Package descriptions and contents
  - Verification steps for GitHub releases

## Testing Changes

The test workflow now:
1. Builds all shared packages before testing
2. Runs tests in logical groups with proper isolation
3. Generates comprehensive test reports
4. Verifies automatic cleanup worked correctly
5. Supports both bun and pnpm as needed

## Release Changes

The release workflow now:
1. Creates GitHub releases with proper tags
2. Provides source archives for distribution
3. Focuses on GitHub as the primary distribution method
4. Includes detailed build instructions for users

These changes improve CI/CD reliability, test visibility, and make releases more accessible to users who want to build from source.