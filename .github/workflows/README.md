# GitHub Actions Workflows

This directory contains automated CI/CD workflows for the Precast App monorepo.

## Workflows Overview

### 1. Test (`test.yml`)
**Trigger**: Push to main/develop, Pull requests
**Purpose**: Runs tests and type checking for all packages
- Tests CLI package with Bun
- Tests website with pnpm
- Runs type checking and linting
- Ensures code quality before merge

### 2. Release (`release.yml`)
**Trigger**: Push to main, Manual dispatch
**Purpose**: Manages NPM package releases using changesets
- Creates version bump PRs when changesets are detected
- Publishes packages to NPM after PR merge
- Creates GitHub releases with built artifacts
- Handles semantic versioning automatically

### 3. Deploy Website (`deploy-website.yml`)
**Trigger**: Push to main (when website/UI changes), Manual dispatch
**Purpose**: Deploys website to Cloudflare Pages
- Only deploys when website or UI packages change
- Checks if Cloudflare Pages project exists before creation
- Builds UI components and website
- Tracks deployments with PostHog analytics

### 4. Publish Packages (`publish.yml`)
**Trigger**: GitHub release created, Manual dispatch
**Purpose**: Manual NPM publishing fallback
- Publishes CLI package to NPM
- Supports beta and latest tags
- Used for manual releases when needed

### 5. Collect Testimonials (`collect-testimonials.yml`)
**Trigger**: Issue labeled with `testimonial-approved`, Manual dispatch
**Purpose**: Automates testimonial collection from GitHub issues
- Processes approved testimonial issues
- Updates `packages/website/public/testimonials.json`
- Enables community-driven content without code changes
- Real-time updates without deployment

## Workflow Dependencies

### Required Secrets
- `APP_ID` - GitHub App ID for automation
- `APP_PRIVATE_KEY` - GitHub App private key
- `RELEASE_TOKEN` - GitHub token for releases
- `NPM_TOKEN` - NPM authentication token
- `CLOUDFLARE_API_TOKEN` - Cloudflare deployment token
- `CLOUDFLARE_ACCOUNT_ID` - Cloudflare account ID
- `POSTHOG_API_KEY` - PostHog analytics key
- `POSTHOG_HOST` - PostHog host URL
- `GA_MEASUREMENT_ID` - Google Analytics ID

## Development Workflow

### Creating a Release
1. Make changes to packages
2. Run `pnpm changeset add` to create a changeset
3. Push to main branch
4. Changesets bot creates a version PR
5. Merge PR to trigger NPM publish and GitHub release

### Deploying Website
- Automatic: Push changes to `packages/website/` or `packages/ui/`
- Manual: Use "Run workflow" button on Deploy Website action

### Running Tests
- Automatic: Create a PR or push to main/develop
- All tests must pass before merge

## Changeset Configuration

The monorepo uses changesets for version management:
- Config: `.changeset/config.json`
- Ignored packages: UI, utils, hooks, website (internal only)
- Public packages: `create-precast-app` (CLI)
- Changelog: Auto-generated with GitHub links

## Best Practices

1. **Always create changesets** for public package changes
2. **Test locally** before pushing to main
3. **Use semantic versioning**:
   - Patch: Bug fixes
   - Minor: New features (backwards compatible)
   - Major: Breaking changes
4. **Monitor workflow runs** in the Actions tab
5. **Check deployment status** in Cloudflare dashboard

## Troubleshooting

### Release not publishing
- Check if changeset exists in `.changeset/` directory
- Verify NPM_TOKEN is valid
- Check workflow logs for errors

### Website not deploying
- Verify changes are in `packages/website/` or `packages/ui/`
- Check Cloudflare API credentials
- Ensure build succeeds locally

### Tests failing
- Run tests locally: `pnpm test`
- Check type errors: `pnpm typecheck`
- Fix linting issues: `pnpm lint`

## Testimonial Collection System

### How it works:
1. **User submits testimonial**: Users click "JOIN THE HERO LEAGUE!" button which opens a pre-filled GitHub issue template
2. **Review process**: Maintainers review the testimonial and add the `testimonial-approved` label
3. **Automatic processing**: The GitHub Action triggers when the label is added
4. **Dynamic updates**: The testimonial is added to `packages/website/public/testimonials.json`
5. **Website updates**: The website automatically loads new testimonials without needing a rebuild

### Configuration:
- Issue template: `.github/ISSUE_TEMPLATE/testimonial.yml`
- Workflow: `.github/workflows/collect-testimonials.yml`
- Dynamic testimonials: `packages/website/public/testimonials.json`

### Benefits:
- No code changes needed for new testimonials
- Community-driven content
- Automatic moderation through issue labels
- Real-time updates without deployment