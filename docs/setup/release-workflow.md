# Release Workflow Guide

This guide explains how the automated release workflow works in the Precast repository and how to configure it for your needs.

## Overview

The Precast release workflow uses:
- **Changesets** for version management
- **GitHub Actions** for automation
- **GitHub App or PAT** for authentication
- **Cloudflare Pages** for deployment

## Release Workflow (`release.yml`)

The single release workflow supports multiple authentication methods automatically:

### Authentication Priority
1. **GitHub App** - If `APP_ID` and `APP_PRIVATE_KEY` secrets are set
2. **Personal Access Token** - If `RELEASE_TOKEN` secret is set  
3. **Default GITHUB_TOKEN** - Always available as fallback

### Features
- Triggers on push to main
- Creates version PRs automatically
- Publishes to npm (if configured)
- Deploys to Cloudflare Pages
- Sends notifications (if configured)

## Setting Up Releases

### Prerequisites

1. **GitHub App or PAT configured** (see [GitHub App Setup Guide](./github-app-releases.md))
2. **Changesets initialized** in your repository
3. **Cloudflare account** (for deployment)
4. **npm account** (if publishing packages)

### Required Secrets

Add these in **Settings** → **Secrets and variables** → **Actions**:

| Secret Name | Description | Required |
|------------|-------------|----------|
| `APP_ID` | GitHub App ID | Yes (for App auth) |
| `APP_PRIVATE_KEY` | GitHub App private key | Yes (for App auth) |
| `RELEASE_TOKEN` | Personal Access Token | Yes (for PAT auth) |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token | Yes (for deployment) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID | Yes (for deployment) |
| `NPM_TOKEN` | npm publish token | Optional |
| `POSTHOG_API_KEY` | PostHog analytics key | Optional |
| `POSTHOG_HOST` | PostHog host URL | Optional |
| `GA_MEASUREMENT_ID` | Google Analytics ID | Optional |

## How Releases Work

### Step 1: Create Changes
```bash
# Make your code changes
git add .
git commit -m "feat: add new feature"
```

### Step 2: Create a Changeset
```bash
# Run changeset command
pnpm changeset

# Follow prompts to:
# 1. Select packages to release
# 2. Choose version bump type (patch/minor/major)
# 3. Write changelog entry
```

### Step 3: Commit Changeset
```bash
git add .changeset/
git commit -m "chore: add changeset"
git push origin main
```

### Step 4: Automated PR Creation
The workflow will:
1. Detect the changeset
2. Create a "Version Packages" PR
3. Update version numbers
4. Generate CHANGELOG entries

### Step 5: Release
When you merge the Version Packages PR:
1. Packages are published to npm
2. GitHub release is created
3. Website deploys to Cloudflare
4. Notifications sent (if configured)

## Changeset Configuration

### `.changeset/config.json`
```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

### Configuration Options

| Option | Description | Default |
|--------|-------------|---------|
| `access` | npm publish access level | `public` |
| `baseBranch` | Branch to create PRs against | `main` |
| `commit` | Auto-commit changeset files | `false` |
| `fixed` | Packages that version together | `[]` |
| `linked` | Packages with linked versions | `[]` |

## Manual Release Process

If automation fails, you can release manually:

```bash
# 1. Version packages
pnpm changeset version

# 2. Install dependencies
pnpm install

# 3. Build packages
pnpm build

# 4. Publish to npm
pnpm changeset publish

# 5. Push tags
git push --follow-tags
```

## Deployment Configuration

### Cloudflare Pages Setup

1. Create a Cloudflare account
2. Go to **Pages** → **Create a project**
3. Connect your GitHub repository
4. Configure build settings:
   - Build command: `pnpm --filter website build`
   - Build output: `packages/website/dist`
5. Get your API token and account ID

### Environment Variables

Set these in Cloudflare Pages dashboard:

```env
VITE_PUBLIC_POSTHOG_KEY=your_key
VITE_PUBLIC_POSTHOG_HOST=your_host
VITE_GA_MEASUREMENT_ID=your_ga_id
```

## Workflow Triggers

### Automatic Triggers
- **Push to main**: Runs release workflow
- **PR merge**: Triggers deployment
- **Schedule**: Daily comprehensive tests

### Manual Triggers
```yaml
workflow_dispatch:
  inputs:
    deploy_only:
      description: 'Deploy without release'
      type: boolean
      default: false
```

Trigger manually from Actions tab → Select workflow → Run workflow

## Version Strategies

### Semantic Versioning

Follow [SemVer](https://semver.org/):
- **Patch** (1.0.x): Bug fixes
- **Minor** (1.x.0): New features (backwards compatible)
- **Major** (x.0.0): Breaking changes

### Prerelease Versions

For testing releases:

```bash
# Create prerelease changeset
pnpm changeset pre enter beta

# Create changes and changesets as normal

# Exit prerelease mode
pnpm changeset pre exit
```

## Monitoring Releases

### GitHub Actions
- Check workflow runs in Actions tab
- View logs for each step
- Download artifacts if needed

### Deployment Status
- Cloudflare Pages dashboard
- GitHub deployment environments
- PostHog events (if configured)

## Rollback Process

If a release has issues:

### Quick Rollback
1. Revert the merge commit
2. Push to main
3. Workflow deploys previous version

### Manual Rollback
```bash
# Checkout previous version
git checkout <previous-tag>

# Force deploy
pnpm --filter website build
wrangler pages deploy dist --project-name=precast-website
```

## Troubleshooting

### Common Issues

#### "No changesets found"
- Ensure `.changeset/*.md` files exist
- Check changeset configuration

#### "Version Packages PR not created"
- Verify GitHub App/PAT permissions
- Check workflow logs for errors

#### "Deployment failed"
- Verify Cloudflare credentials
- Check build output exists
- Review Cloudflare Pages logs

#### "npm publish failed"
- Ensure NPM_TOKEN is set
- Check package.json access level
- Verify npm account permissions

### Debug Mode

Enable debug logging:

```yaml
env:
  ACTIONS_RUNNER_DEBUG: true
  ACTIONS_STEP_DEBUG: true
```

## Best Practices

1. **Test locally first**
   ```bash
   pnpm build
   pnpm test
   ```

2. **Write clear changeset messages**
   - Describe what changed
   - Explain why (if not obvious)
   - Note breaking changes

3. **Use conventional commits**
   - `feat:` for features
   - `fix:` for bug fixes
   - `chore:` for maintenance

4. **Review Version PRs**
   - Check version bumps are correct
   - Review CHANGELOG entries
   - Verify no unwanted changes

5. **Monitor deployments**
   - Check deployment URLs
   - Verify functionality
   - Monitor error rates

## Advanced Configuration

### Multi-Package Releases

For monorepo with multiple packages:

```json
{
  "linked": [
    ["@precast/cli", "@precast/ui", "@precast/utils"]
  ]
}
```

### Custom Changelog

Create `.changeset/changelog.js`:

```javascript
const getReleaseLine = async (changeset, type) => {
  const [firstLine, ...rest] = changeset.summary.split('\n');
  return `- ${changeset.commit ? `${changeset.commit}: ` : ''}${firstLine}`;
};

module.exports = { getReleaseLine };
```

### Release Channels

For different release channels:

```yaml
- name: Determine Release Channel
  run: |
    if [[ "${{ github.ref }}" == "refs/heads/main" ]]; then
      echo "RELEASE_TAG=latest" >> $GITHUB_ENV
    elif [[ "${{ github.ref }}" == "refs/heads/beta" ]]; then
      echo "RELEASE_TAG=beta" >> $GITHUB_ENV
    fi
```

## Resources

- [Changesets Documentation](https://github.com/changesets/changesets)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages)
- [npm Publishing Guide](https://docs.npmjs.com/cli/v8/commands/npm-publish)

---

*Last updated: January 2025*