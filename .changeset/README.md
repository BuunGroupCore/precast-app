# Changesets Developer Guide

## Overview

Changesets manages versioning and publishing for our monorepo. It automates version bumping, changelog generation, and NPM publishing through GitHub Actions.

## Quick Start

### Creating a Release

1. **Make your code changes**
   ```bash
   # Make your changes to packages/cli
   git add .
   git commit -m "feat: add new feature"
   ```

2. **Create a changeset**
   ```bash
   pnpm changeset add
   # Or use the shorthand
   pnpm changeset
   ```

3. **Select change type**
   - **patch**: Bug fixes (0.1.38 → 0.1.39)
   - **minor**: New features (0.1.38 → 0.2.0)
   - **major**: Breaking changes (0.1.38 → 1.0.0)

4. **Write a summary**
   - This becomes your changelog entry
   - Be descriptive for users
   - Example: "Fix TypeScript configuration for React projects"

5. **Push to main**
   ```bash
   git add .changeset/your-change.md
   git commit -m "chore: add changeset"
   git push origin main
   ```

6. **Merge the Version PR**
   - Changesets bot creates a PR titled "Version Packages"
   - Review the version bumps and changelog
   - Merge to trigger NPM publish

## Detailed Workflow

### Step 1: Understanding Changeset Files

When you run `pnpm changeset add`, it creates a file like:
```markdown
---
"create-precast-app": patch
---

Fix TypeScript configuration for React projects
```

- The frontmatter specifies package and version type
- The body becomes the changelog entry
- File is stored in `.changeset/` with random name

### Step 2: How Version Bumping Works

When the Version PR is created, changesets:

1. **Reads all changeset files**
2. **Determines version bumps**:
   - Multiple patches = single patch bump
   - Any minor = minor bump (overrides patches)
   - Any major = major bump (overrides all)
3. **Updates package.json**:
   ```diff
   - "version": "0.1.38",
   + "version": "0.1.39",
   ```
4. **Updates CHANGELOG.md**:
   ```markdown
   ## 0.1.39
   
   ### Patch Changes
   
   - Fix TypeScript configuration for React projects
   ```
5. **Deletes processed changeset files**

### Step 3: Publishing Process

After merging the Version PR:

1. **GitHub Action detects version change**
2. **Runs `changeset publish`**:
   - Builds the package
   - Publishes to NPM registry
   - Creates git tag (e.g., `create-precast-app@0.1.39`)
3. **Creates GitHub Release**:
   - Includes changelog
   - Attaches built artifacts
   - Links to NPM package

## Common Scenarios

### Multiple Changes in One Release

```bash
# Create multiple changesets for different fixes
pnpm changeset add  # Fix: database connection
pnpm changeset add  # Fix: auth middleware
pnpm changeset add  # Feature: add Docker support

# All will be included in one version bump
git add .changeset/
git commit -m "chore: add changesets for release"
git push
```

### Pre-release Versions

```bash
# Enter pre-release mode
pnpm changeset pre enter beta

# Create changesets as normal
pnpm changeset add

# Version will be: 0.1.39-beta.0
# Exit pre-release mode
pnpm changeset pre exit
```

### Emergency Hotfix

```bash
# Create patch changeset
pnpm changeset add
# Select: patch
# Summary: "Critical: Fix production crash in init command"

# Fast-track merge
git add .
git commit -m "fix: critical production issue"
git push

# Immediately merge the Version PR
```

### Releasing Multiple Packages

Our config ignores internal packages, only publishes:
- `create-precast-app` (CLI)

Internal packages (not published):
- `@precast/ui`
- `@precast/utils`
- `@precast/hooks`
- `@precast/website`

## Configuration

### Current Settings (`.changeset/config.json`)

```json
{
  "changelog": ["@changesets/changelog-github", { "repo": "BunnGroupCore/precast-app" }],
  "commit": false,
  "access": "public",
  "baseBranch": "main",
  "ignore": ["@precast/ui", "@precast/utils", "@precast/hooks", "@precast/website"]
}
```

- **changelog**: GitHub-flavored with issue/PR links
- **commit**: We commit manually (not auto-commit)
- **access**: Public NPM packages
- **baseBranch**: PRs created against main
- **ignore**: Internal packages not published

## Best Practices

### Writing Good Changeset Messages

✅ **Good:**
```markdown
Fix TypeScript path aliases for Next.js projects with app directory
```

❌ **Bad:**
```markdown
fix ts
```

### Choosing Version Types

| Change | Version Type | Example |
|--------|-------------|---------|
| Typo fix | patch | Fix spelling in CLI output |
| Bug fix | patch | Fix package installation error |
| New feature | minor | Add support for Bun runtime |
| New option | minor | Add --no-git flag |
| Remove feature | major | Remove support for Node 16 |
| Change defaults | major | Change default framework to Next.js |
| API change | major | Rename --install to --auto-install |

### Grouping Related Changes

Instead of:
```bash
pnpm changeset add  # Fix: auth setup
pnpm changeset add  # Fix: auth types
pnpm changeset add  # Fix: auth config
```

Do:
```bash
pnpm changeset add  # Fix: multiple auth setup issues
# List all fixes in the description
```

## Troubleshooting

### "No Changeset Found"

**Problem:** Push to main but no Version PR created

**Solution:** 
```bash
# Check if changeset exists
ls .changeset/
# Should see .md files besides README.md and config.json

# If not, create one
pnpm changeset add
```

### Version PR Not Publishing

**Problem:** Merged Version PR but NPM not updated

**Check:**
1. NPM_TOKEN secret is valid
2. Check Actions tab for errors
3. Verify package.json has "name" field

### Changeset Not Detecting Changes

**Problem:** Made changes but changeset says "no packages to release"

**Solution:**
```bash
# Ensure package is not in ignore list
cat .changeset/config.json | grep ignore

# Ensure you selected the right package
pnpm changeset add
# Select: create-precast-app (not @precast/cli)
```

### Manual Publishing (Emergency)

If automation fails:
```bash
# After Version PR is merged
cd packages/cli
npm publish --access public
```

## GitHub Actions Integration

### Workflows Using Changesets

1. **release.yml**: Creates Version PRs and publishes
2. **publish.yml**: Backup manual publishing

### Required Secrets

- `NPM_TOKEN`: NPM automation token
- `GITHUB_TOKEN`: Provided automatically
- `APP_ID` & `APP_PRIVATE_KEY`: For GitHub App (optional)

## Commands Reference

```bash
# Add a changeset
pnpm changeset add
pnpm changeset      # shorthand

# Check status
pnpm changeset status

# Version packages (usually done by CI)
pnpm changeset version

# Publish (usually done by CI)
pnpm changeset publish

# Pre-release mode
pnpm changeset pre enter <tag>  # beta, alpha, rc
pnpm changeset pre exit
```

## Example: Complete Release Flow

```bash
# 1. Feature development
git checkout -b feat/add-astro-support
# ... make changes ...

# 2. Create changeset
pnpm changeset add
# > Select: create-precast-app
# > Select: minor
# > Summary: Add support for Astro framework

# 3. Commit everything
git add .
git commit -m "feat: add Astro framework support"

# 4. Push branch and create PR
git push origin feat/add-astro-support
# Create PR on GitHub

# 5. After PR approved and merged to main
# Changesets bot creates "Version Packages" PR

# 6. Review Version Packages PR
# - Check version bump (0.1.38 → 0.2.0)
# - Review CHANGELOG.md additions
# - Merge when ready

# 7. Automated publishing
# - GitHub Action publishes to NPM
# - Creates GitHub release
# - Tags version in git

# 8. Verify release
npm view create-precast-app@latest version
# Should show: 0.2.0
```

## Tips

1. **Always create changesets** for user-facing changes
2. **Batch small fixes** into one changeset
3. **Use clear, descriptive messages** for changelog
4. **Don't edit package.json versions manually**
5. **Review Version PRs carefully** before merging
6. **Monitor Actions tab** after merging Version PRs

## Need Help?

- Changesets docs: https://github.com/changesets/changesets
- Check `.github/workflows/release.yml` for automation details
- Run `pnpm changeset status` to see pending changes
- Check Actions tab for workflow runs