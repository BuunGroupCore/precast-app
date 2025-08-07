# Setup Guides

This directory contains setup and configuration guides for the Precast repository.

## Available Guides

### 🤖 [GitHub App for Releases](./github-app-releases.md)
Step-by-step guide to create and configure a GitHub App for automated releases and PR creation. Includes:
- Creating a GitHub App with correct permissions
- Installing on your repository
- Configuring secrets
- Troubleshooting common issues

### 🚀 [Release Workflow](./release-workflow.md)
Complete guide to the automated release process using Changesets and GitHub Actions. Covers:
- How releases work
- Changeset configuration
- Deployment setup
- Version strategies
- Rollback procedures

## Quick Start

### For Repository Owners

1. **Set up GitHub App** - Follow the [GitHub App guide](./github-app-releases.md) to enable automated releases
2. **Configure secrets** - Add required secrets for your workflow
3. **Test the workflow** - Create a changeset and verify PR creation works

### For Contributors

1. **Fork the repository**
2. **Set up your own GitHub App** following our guide
3. **Configure your fork** with your app credentials
4. **Start contributing** with automated releases on your fork

## Required Secrets Reference

| Secret | Used For | Guide |
|--------|----------|-------|
| `APP_ID` | GitHub App authentication | [GitHub App Setup](./github-app-releases.md#step-6-add-secrets-to-your-repository) |
| `APP_PRIVATE_KEY` | GitHub App authentication | [GitHub App Setup](./github-app-releases.md#step-6-add-secrets-to-your-repository) |
| `RELEASE_TOKEN` | PAT authentication (alternative) | [GitHub App Setup](./github-app-releases.md#alternative-using-personal-access-token-pat) |
| `CLOUDFLARE_API_TOKEN` | Website deployment | [Release Workflow](./release-workflow.md#required-secrets) |
| `CLOUDFLARE_ACCOUNT_ID` | Website deployment | [Release Workflow](./release-workflow.md#required-secrets) |

## Workflow Files

The repository includes these workflow files:

- **`.github/workflows/release.yml`** - Unified release workflow with automatic auth detection (GitHub App → PAT → default token)
- **`.github/workflows/test-cli.yml`** - CLI testing workflow
- **`.github/workflows/update-analytics.yml`** - Analytics data update workflow

## Need Help?

- Check the [Troubleshooting sections](./github-app-releases.md#troubleshooting) in each guide
- Open an [issue](https://github.com/yourusername/precast-app/issues) for bugs
- Join our [discussions](https://github.com/yourusername/precast-app/discussions) for questions

## Contributing to Documentation

We welcome improvements to our documentation! If you find issues or have suggestions:

1. Fork the repository
2. Make your changes in the `docs/` directory
3. Submit a pull request with a clear description

---

*Last updated: January 2025*